<?php

namespace App\Http\Controllers;

use App\Models\Attribute;
use App\Models\Category;
use App\Models\Product;
use App\Models\Store;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CollectionController extends Controller
{
    public function index(Request $request, $categorySlug = null)
    {
        // Get all categories for sidebar
        $categories = Category::withCount(['products' => function ($q) {
            $q->where('status', 'published');
        }])
            ->orderBy('name')
            ->get()
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                    'productsCount' => $category->products_count,
                ];
            });

        // Get all stores for filter
        $stores = Store::where('status', 'active')
            ->withCount(['products' => function ($q) {
                $q->where('status', 'published');
            }])
            ->orderBy('name')
            ->get()
            ->map(function ($store) {
                return [
                    'id' => $store->id,
                    'name' => $store->name,
                    'slug' => $store->slug,
                    'productsCount' => $store->products_count,
                ];
            });

        // Build query
        $query = Product::with(['store', 'category', 'media', 'attributeValues.attribute', 'attributeValues.value'])
            ->where('status', 'published');

        // Filter by category if provided
        if ($categorySlug && $categorySlug !== 'all') {
            $category = Category::where('slug', $categorySlug)->first();
            if ($category) {
                $query->where('category_id', $category->id);
            }
        }

        // Filter by store if provided
        if ($request->has('store') && $request->store !== 'all') {
            $query->whereHas('store', function ($q) use ($request) {
                $q->where('slug', $request->store);
            });
        }

        // Search filter
        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%'.$request->search.'%')
                    ->orWhereHas('description', function ($d) use ($request) {
                        $d->where('content', 'like', '%'.$request->search.'%')
                            ->orWhere('short_text', 'like', '%'.$request->search.'%');
                    });
            });
        }

        // Price range filter (avoid empty-string params like min_price=)
        if ($request->filled('min_price') && is_numeric($request->min_price)) {
            $query->where('base_price', '>=', (float) $request->min_price);
        }
        if ($request->filled('max_price') && is_numeric($request->max_price)) {
            $query->where('base_price', '<=', (float) $request->max_price);
        }

        // Type filter (ready vs made_to_order)
        $type = $request->get('type', 'all');
        if ($type === 'made_to_order') {
            $query->where('made_to_order', true);
        } elseif ($type === 'ready') {
            $query->where('made_to_order', false);
        }

        // Attribute-based filters (dynamic by attribute code)
        $filterableAttributes = Attribute::where('is_filterable', true)
            ->orderBy('sort_order')
            ->orderBy('name')
            ->with(['values' => function ($q) {
                $q->orderBy('sort_order')->orderBy('value');
            }])
            ->get();

        foreach ($filterableAttributes as $attr) {
            $values = $request->input($attr->code);
            if (! is_array($values) || count($values) === 0) {
                continue;
            }

            $query->whereHas('attributeValues', function ($q) use ($attr, $values) {
                $q->whereHas('attribute', fn ($a) => $a->where('code', $attr->code))
                    ->whereHas('value', fn ($v) => $v->whereIn('slug', $values));
            });
        }

        // Sort
        $sortBy = $request->get('sort', 'latest');
        switch ($sortBy) {
            case 'price_asc':
                $query->orderBy('base_price', 'asc');
                break;
            case 'price_desc':
                $query->orderBy('base_price', 'desc');
                break;
            case 'name':
                $query->orderBy('name', 'asc');
                break;
            default:
                $query->latest();
        }

        // Paginate
        $products = $query->paginate(24)->through(function ($product) {
            $primaryImage = $product->media
                ->where('type', 'image')
                ->sortBy('sort_order')
                ->first() ?? $product->media->sortBy('sort_order')->first();

            $imageUrl = $primaryImage
                ? (str_starts_with($primaryImage->path, 'http') ? $primaryImage->path : asset('storage/'.$primaryImage->path))
                : 'https://placehold.co/600x800/e5e7eb/374151?text=No+Image';

            $size = null;
            // Try to find "size" attribute value for quick display
            $sizeAttr = $product->attributeValues->first(function ($pav) {
                return $pav->attribute?->code === 'size';
            });
            if ($sizeAttr && $sizeAttr->value) {
                $size = $sizeAttr->value->value;
            }

            $basePrice = (float) ($product->base_price ?? 0);
            $sellingPrice = $product->discount_rate > 0 ? $basePrice * (1 - $product->discount_rate / 100) : $basePrice;

            return [
                'id' => $product->id,
                'title' => $product->name,
                'slug' => $product->slug,
                'price' => (float) $sellingPrice,
                'original_price' => $product->discount_rate > 0 ? $basePrice : null,
                'discount_rate' => $product->discount_rate,
                'size' => $size,
                'href' => route('product.show', ['store' => $product->store->slug, 'product' => $product->slug]),
                'image' => [
                    'url' => $imageUrl,
                    'alt' => $primaryImage?->alt_text ?? $product->name,
                ],
                'store' => [
                    'name' => $product->store->name,
                    'slug' => $product->store->slug,
                ],
                'category' => [
                    'name' => $product->category->name,
                    'slug' => $product->category->slug,
                ],
            ];
        });

        return Inertia::render('Collections', [
            'products' => $products,
            'categories' => $categories,
            'stores' => $stores,
            'filters' => [
                'search' => $request->get('search', ''),
                'category' => $categorySlug ?? 'all',
                'store' => $request->get('store', 'all'),
                'sort' => $sortBy,
                'min_price' => $request->get('min_price'),
                'max_price' => $request->get('max_price'),
                'type' => $type,
                // include dynamic attribute filters back to UI
                ...$filterableAttributes->mapWithKeys(function ($attr) use ($request) {
                    $val = $request->input($attr->code);

                    return [$attr->code => is_array($val) ? $val : []];
                })->toArray(),
            ],
            'filterOptions' => [
                'types' => [
                    ['label' => 'Hazır Ürün', 'value' => 'ready'],
                    ['label' => 'Sipariş Üzerine', 'value' => 'made_to_order'],
                ],
                'attributes' => $filterableAttributes->map(function ($attr) {
                    return [
                        'code' => $attr->code,
                        'name' => $attr->name,
                        'data_type' => $attr->data_type,
                        'values' => $attr->values->map(fn ($v) => [
                            'value' => $v->value,
                            'slug' => $v->slug,
                        ])->values(),
                    ];
                })->values(),
            ],
        ]);
    }
}
