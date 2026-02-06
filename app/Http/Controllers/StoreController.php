<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\Store;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StoreController extends Controller
{
    public function index(Request $request)
    {
        $query = Store::query()
            ->where('status', 'active')
            ->withCount('products');

        // Search
        if ($request->has('search')) {
            $query->where('name', 'like', '%'.$request->search.'%');
        }

        // Category Filter
        if ($request->has('category') && $request->category !== 'all') {
            $category = Category::where('slug', $request->category)->first();
            if ($category) {
                $query->whereHas('products', function ($q) use ($category) {
                    $q->where('category_id', $category->id)
                        ->where('status', 'active');
                });
            }
        }

        // Sorting
        switch ($request->input('sort', 'newest')) {
            case 'name-asc':
                $query->orderBy('name', 'asc');
                break;
            case 'name-desc':
                $query->orderBy('name', 'desc');
                break;
            case 'products-desc':
                $query->orderBy('products_count', 'desc');
                break;
            default:
                $query->orderBy('created_at', 'desc');
        }

        $stores = $query->paginate(12)->withQueryString();

        $stores->through(function ($store) {
            return [
                'id' => $store->id,
                'name' => $store->name,
                'slug' => $store->slug,
                'productsCount' => $store->products_count,
                'href' => route('stores.show', $store->slug),
            ];
        });

        // Get categories with product counts
        $categories = Category::withCount('products')
            ->orderBy('name')
            ->get();

        return Inertia::render('Store', [
            'stores' => $stores,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category', 'sort']),
        ]);
    }

    public function show(Request $request, $slug)
    {
        $store = Store::where('slug', $slug)
            ->with(['products' => function ($query) {
                $query->where('status', 'active')
                    ->with(['media', 'category'])
                    ->latest()
                    ->take(12);
            }])
            ->withCount(['products' => function ($query) {
                $query->where('status', 'active');
            }])
            ->firstOrFail();

        $activeTab = $request->query('tab', 'products');

        return Inertia::render('StoreDetail', [
            'store' => [
                'id' => $store->id,
                'name' => $store->name,
                'slug' => $store->slug,
                'productsCount' => $store->products_count,
                'description' => 'Welcome to '.$store->name.'. We offer a wide range of quality products for your special occasions.',
                'coverImage' => null,
                'logoImage' => null,
            ],
            'products' => $store->products->map(function ($product) use ($store) {
                $firstMedia = $product->media->first();

                // Check if media path is already a full URL or a storage path
                $imageUrl = null;
                if ($firstMedia) {
                    $imageUrl = str_starts_with($firstMedia->path, 'http')
                        ? $firstMedia->path
                        : asset('storage/'.$firstMedia->path);
                }

                $price = (float) ($product->base_price ?? 0);
                $sellingPrice = $product->discount_rate > 0 ? $price * (1 - $product->discount_rate / 100) : $price;

                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'imageUrl' => $imageUrl,
                    'imageAlt' => $firstMedia?->alt_text ?? $product->name,
                    'category' => $product->category->name ?? '',
                    'categorySlug' => $product->category->slug ?? '',
                    'price' => (float) $sellingPrice,
                    'original_price' => $product->discount_rate > 0 ? $price : null,
                    'discount_rate' => $product->discount_rate,
                    'currency' => $product->currency ?? 'USD',
                    'formattedPrice' => number_format($sellingPrice, 2).' '.($product->currency ?? 'USD'),
                    'href' => "/{$store->slug}/{$product->slug}",
                    'storeName' => $store->name,
                    'storeSlug' => $store->slug,
                ];
            }),
            'activeTab' => $activeTab,
        ]);
    }
}
