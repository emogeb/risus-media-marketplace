<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductDescription;
use App\Models\ProductVariant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminProductController extends Controller
{
    /**
     * List products (paginated). JSON for admin SPA.
     */
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'page' => 'sometimes|integer|min:1',
            'pageSize' => 'sometimes|integer|min:1|max:100',
            'q' => 'sometimes|nullable|string|max:255',
            'search' => 'sometimes|nullable|string|max:255',
            'status' => 'sometimes|nullable|in:draft,active,archived',
            'storeId' => 'sometimes|nullable|integer|exists:stores,id',
            'lowStock' => 'sometimes|in:true,false,1,0',
        ]);

        $query = Product::query()
            ->with([
                'store:id,name,slug',
                'category:id,name,slug',
                'variants',
                'media' => fn ($q) => $q->orderBy('sort_order'),
            ])
            ->withCount('variants');

        $search = $request->filled('q') ? $request->q : $request->input('search');
        if ($search !== null && $search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%'.$search.'%')
                    ->orWhere('slug', 'like', '%'.$search.'%');
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('storeId')) {
            $query->where('store_id', (int) $request->storeId);
        }

        if ($request->boolean('lowStock')) {
            $query->whereHas('variants', function ($q) {
                $q->where('stock_quantity', '<=', 5);
            });
        }

        $perPage = (int) $request->input('pageSize', 10);
        $paginator = $query->orderBy('updated_at', 'desc')->paginate($perPage);

        $items = $paginator->getCollection()->map(fn (Product $p) => $this->productToApi($p));

        return response()->json([
            'data' => $items,
            'total' => $paginator->total(),
            'page' => $paginator->currentPage(),
            'pageSize' => $paginator->perPage(),
        ]);
    }

    /**
     * Get single product.
     */
    public function show(string $id): JsonResponse
    {
        try {
            \Log::info('AdminProductController@show hit with ID: '.$id);
            $product = Product::with([
                'store:id,name,slug',
                'category:id,name,slug',
                'description',
                'variants',
                'media' => fn ($q) => $q->orderBy('sort_order'),
                'attributeValues.attribute',
                'attributeValues.attributeValue',
            ])->findOrFail((int) $id);

            return response()->json(['data' => $this->productToApi($product, true)]);
        } catch (\Exception $e) {
            \Log::error('Error in AdminProductController@show: '.$e->getMessage());
            \Log::error($e->getTraceAsString());

            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Create product. Accepts admin form shape (title, price, stock, sku, description, etc.)
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'store_id' => 'required|integer|exists:stores,id',
            'title' => 'required|string|max:255',
            'name' => 'sometimes|string|max:255',
            'category_id' => 'nullable|integer|exists:categories,id',
            'category' => 'nullable|string|max:64',
            'sku' => 'nullable|string|max:64',
            'description' => 'nullable|string|max:65535',
            'price' => 'required|numeric|min:0',
            'discount_rate' => 'nullable|integer|min:0|max:100',
            'currency' => 'nullable|string|size:3',
            'stock' => 'required|integer|min:0',
            'status' => 'nullable|in:draft,active,archived',
            'made_to_order' => 'sometimes|boolean',
            'lead_time_days' => 'nullable|integer|min:0|max:365',
            'length' => 'nullable|numeric|min:0|max:999999',
            'width' => 'nullable|numeric|min:0|max:999999',
            'height' => 'nullable|numeric|min:0|max:999999',
            'weight' => 'nullable|numeric|min:0|max:999999',
            'size_info' => 'nullable|string|max:100',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,webp|max:10240',
        ]);

        $name = $validated['name'] ?? $validated['title'];
        $categoryId = $validated['category_id'] ?? null;
        if (! $categoryId && ! empty($validated['category'])) {
            $cat = Category::where('slug', $validated['category'])->first();
            $categoryId = $cat?->id;
        }
        if (! $categoryId) {
            $categoryId = Category::query()->value('id') ?? null;
        }
        if (! $categoryId) {
            return response()->json([
                'message' => 'En az bir kategori gerekli.',
                'errors' => ['category_id' => ['Kategori seçiniz veya önce kategori oluşturun.']],
            ], 422);
        }

        $slug = Str::slug($name);
        $baseSlug = $slug;
        $attempt = 0;
        while (Product::where('store_id', $validated['store_id'])->where('slug', $slug)->exists()) {
            $slug = $baseSlug.'-'.(++$attempt);
        }

        $basePrice = (float) $validated['price'];
        $discountRate = (int) ($validated['discount_rate'] ?? 0);
        $sellingPrice = $basePrice;
        if ($discountRate > 0) {
            $sellingPrice = $basePrice * (1 - ($discountRate / 100));
        }

        $product = Product::create([
            'store_id' => $validated['store_id'],
            'category_id' => $categoryId,
            'name' => $name,
            'slug' => $slug,
            'status' => $validated['status'] ?? 'draft',
            'base_price' => $basePrice,
            'discount_rate' => $discountRate,
            'currency' => $validated['currency'] ?? 'TRY',
            'made_to_order' => $validated['made_to_order'] ?? false,
            'lead_time_days' => $validated['lead_time_days'] ?? null,
            'length' => $validated['length'] ?? null,
            'width' => $validated['width'] ?? null,
            'height' => $validated['height'] ?? null,
            'weight' => $validated['weight'] ?? null,
            'size_info' => $validated['size_info'] ?? null,
            'has_variants' => false,
        ]);

        if (! empty($validated['description'])) {
            ProductDescription::create([
                'product_id' => $product->id,
                'short_text' => Str::limit($validated['description'], 500),
                'long_text' => $validated['description'],
            ]);
        }

        $sku = $validated['sku'] ?? ('PRD-'.$product->id.'-'.strtoupper(Str::random(4)));
        if (ProductVariant::where('sku', $sku)->exists()) {
            $sku = $sku.'-'.strtoupper(Str::random(4));
        }

        ProductVariant::create([
            'product_id' => $product->id,
            'sku' => $sku,
            'price' => $sellingPrice,
            'currency' => $product->currency,
            'stock_quantity' => (int) $validated['stock'],
            'stock_status' => (int) $validated['stock'] > 0 ? 'in_stock' : 'out_of_stock',
            'is_default' => true,
        ]);

        // Handle Image Uploads
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $file) {
                $path = $file->store('products', 'public');

                \App\Models\ProductMedia::create([
                    'product_id' => $product->id,
                    'type' => 'image',
                    'path' => $path,
                    'alt_text' => $product->name,
                    'sort_order' => $index,
                ]);
            }
        }

        $product->load(['store:id,name,slug', 'category:id,name,slug', 'description', 'variants']);

        return response()->json(['data' => $this->productToApi($product, true)], 201);
    }

    /**
     * Update product.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $product = Product::with(['store', 'category', 'description', 'variants'])->findOrFail((int) $id);

        $validated = $request->validate([
            'store_id' => 'sometimes|integer|exists:stores,id',
            'title' => 'sometimes|string|max:255',
            'name' => 'sometimes|string|max:255',
            'category_id' => 'nullable|integer|exists:categories,id',
            'category' => 'nullable|string|max:64',
            'sku' => 'nullable|string|max:64',
            'description' => 'nullable|string|max:65535',
            'price' => 'sometimes|numeric|min:0',
            'discount_rate' => 'nullable|integer|min:0|max:100',
            'currency' => 'nullable|string|size:3',
            'stock' => 'sometimes|integer|min:0',
            'status' => 'sometimes|in:draft,active,archived',
            'made_to_order' => 'sometimes|boolean',
            'lead_time_days' => 'nullable|integer|min:0|max:365',
            'length' => 'nullable|numeric|min:0|max:999999',
            'width' => 'nullable|numeric|min:0|max:999999',
            'height' => 'nullable|numeric|min:0|max:999999',
            'weight' => 'nullable|numeric|min:0|max:999999',
            'size_info' => 'nullable|string|max:100',
        ]);

        if (array_key_exists('name', $validated) || array_key_exists('title', $validated)) {
            $product->name = $validated['name'] ?? $validated['title'] ?? $product->name;
        }
        if (array_key_exists('store_id', $validated)) {
            $product->store_id = $validated['store_id'];
        }
        if (array_key_exists('category_id', $validated)) {
            $product->category_id = $validated['category_id'];
        }
        if (! empty($validated['category']) && ! array_key_exists('category_id', $validated)) {
            $cat = Category::where('slug', $validated['category'])->first();
            if ($cat) {
                $product->category_id = $cat->id;
            }
        }
        if (array_key_exists('status', $validated)) {
            $product->status = $validated['status'];
        }

        // Handle Price & Discount Updates
        $priceUpdated = false;
        if (array_key_exists('price', $validated)) {
            $product->base_price = (float) $validated['price'];
            $priceUpdated = true;
        }
        if (array_key_exists('discount_rate', $validated) || $request->has('discount_rate')) {
            $product->discount_rate = (int) $validated['discount_rate'];
            $priceUpdated = true;
        }

        if (array_key_exists('currency', $validated)) {
            $product->currency = $validated['currency'];
        }
        if (array_key_exists('made_to_order', $validated)) {
            $product->made_to_order = (bool) $validated['made_to_order'];
        }
        if (array_key_exists('lead_time_days', $validated)) {
            $product->lead_time_days = $validated['lead_time_days'];
        }
        if (array_key_exists('length', $validated)) {
            $product->length = $validated['length'];
        }
        if (array_key_exists('width', $validated)) {
            $product->width = $validated['width'];
        }
        if (array_key_exists('height', $validated)) {
            $product->height = $validated['height'];
        }
        if (array_key_exists('weight', $validated)) {
            $product->weight = $validated['weight'];
        }
        if (array_key_exists('size_info', $validated)) {
            $product->size_info = $validated['size_info'];
        }
        $product->save();

        if (array_key_exists('description', $validated)) {
            $desc = $product->description;
            if ($desc) {
                $desc->short_text = Str::limit($validated['description'], 500);
                $desc->long_text = $validated['description'] ?? '';
                $desc->save();
            } else {
                ProductDescription::create([
                    'product_id' => $product->id,
                    'short_text' => Str::limit($validated['description'], 500),
                    'long_text' => $validated['description'] ?? '',
                ]);
            }
        }

        $defaultVariant = $product->variants->where('is_default', true)->first() ?? $product->variants->first();
        if ($defaultVariant) {
            if (array_key_exists('sku', $validated) && $validated['sku'] !== null) {
                $defaultVariant->sku = $validated['sku'];
            }

            // Recalculate selling price if needed
            if ($priceUpdated) {
                $basePrice = (float) $product->base_price;
                $rate = (int) $product->discount_rate;
                $sellingPrice = $basePrice;
                if ($rate > 0) {
                    $sellingPrice = $basePrice * (1 - ($rate / 100));
                }
                $defaultVariant->price = $sellingPrice;
            }
            // Ensure manual price override works if explicitly sent? No, follow logic.
            // But if user sends price but not discount_rate? We use stored discount_rate.
            // Logic above handles it.

            if (array_key_exists('stock', $validated)) {
                $defaultVariant->stock_quantity = (int) $validated['stock'];
                $defaultVariant->stock_status = (int) $validated['stock'] > 0 ? 'in_stock' : 'out_of_stock';
            }
            $defaultVariant->save();
        }

        $product->load(['store:id,name,slug', 'category:id,name,slug', 'description', 'variants']);

        return response()->json(['data' => $this->productToApi($product, true)]);
    }

    /**
     * Delete product (soft delete).
     */
    public function destroy(string $id): JsonResponse
    {
        $product = Product::findOrFail((int) $id);
        $product->delete();

        return response()->json(null, 204);
    }

    /**
     * Update product stock (default variant). Admin SPA may call PATCH /products/:id/stock.
     */
    public function updateStock(Request $request, string $id): JsonResponse
    {
        $request->validate(['stock' => 'required|integer|min:0']);

        $product = Product::with(['variants'])->findOrFail((int) $id);
        $variant = $product->variants->where('is_default', true)->first() ?? $product->variants->first();
        if (! $variant) {
            return response()->json(['message' => 'Ürün varyantı bulunamadı.'], 422);
        }

        $variant->stock_quantity = (int) $request->input('stock');
        $variant->stock_status = $variant->stock_quantity > 0 ? 'in_stock' : 'out_of_stock';
        $variant->save();

        $product->load(['store:id,name,slug', 'category:id,name,slug', 'variants']);

        return response()->json($this->productToApi($product, true));
    }

    private function productToApi(Product $product, bool $full = false): array
    {
        $defaultVariant = $product->relationLoaded('variants')
            ? ($product->variants->where('is_default', true)->first() ?? $product->variants->first())
            : null;
        if (! $defaultVariant && $product->relationLoaded('variants') && $product->variants->isNotEmpty()) {
            $defaultVariant = $product->variants->first();
        }
        $description = $product->relationLoaded('description') ? $product->description : null;

        $out = [
            'id' => (string) $product->id,
            'store_id' => $product->store_id,
            'title' => $product->name,
            'name' => $product->name,
            'sku' => $defaultVariant?->sku,
            'description' => $description?->long_text ?? $description?->short_text,
            'price' => (float) $product->base_price, // List Price
            'selling_price' => (float) ($defaultVariant?->price ?? $product->base_price), // Calculated Price
            'discount_rate' => (int) $product->discount_rate,
            'currency' => $product->currency,
            'stock' => $defaultVariant?->stock_quantity ?? 0,
            'status' => $product->status,
            'category' => $product->relationLoaded('category') && $product->category ? $product->category->slug : null,
            'created_at' => $product->created_at?->toIso8601String(),
            'updated_at' => $product->updated_at?->toIso8601String(),
        ];

        // Process images if loaded
        if ($product->relationLoaded('media') && $product->media->isNotEmpty()) {
            $images = $product->media->map(function ($media) {
                return [
                    'id' => $media->id,
                    'url' => str_starts_with($media->path, 'http') ? $media->path : asset('storage/'.$media->path),
                    'alt' => $media->alt_text,
                    'is_primary' => (int) $media->sort_order === 0,
                ];
            });

            $out['images'] = $images->toArray();

            // Set main image URL from first image
            if ($images->isNotEmpty()) {
                $out['imageUrl'] = $images->first()['url'];
            }
        } elseif ($product->relationLoaded('media') && $product->media->isEmpty()) {
            // Fallback placeholder
            $out['imageUrl'] = 'https://placehold.co/800x1200/e5e7eb/374151?text='.urlencode($product->name);
            $out['images'] = [];
        }

        if ($full || $product->relationLoaded('store')) {
            $out['store'] = $product->relationLoaded('store') && $product->store ? [
                'id' => $product->store->id,
                'name' => $product->store->name,
                'slug' => $product->store->slug,
            ] : null;
        }

        if ($product->relationLoaded('variants') && $product->variants->isNotEmpty()) {
            $out['lowStockThreshold'] = 5;

            // Add basic variants array (without size/color from options for now)
            $out['variants'] = $product->variants->map(function ($variant) {
                return [
                    'id' => $variant->id,
                    'sku' => $variant->sku,
                    'price' => (float) $variant->price,
                    'stock' => $variant->stock_quantity,
                    'size' => null, // TODO: Load from variant_options
                    'color' => null, // TODO: Load from variant_options
                ];
            })->toArray();

            // Simplified sizes array - will be empty for now
            $out['sizes'] = [];
        }

        // Add product attributes
        if ($product->relationLoaded('attributeValues') && $product->attributeValues->isNotEmpty()) {
            $out['attributes'] = $product->attributeValues->map(function ($attrValue) {
                $value = null;
                if ($attrValue->attributeValue) {
                    $value = $attrValue->attributeValue->value;
                } elseif ($attrValue->value_text) {
                    $value = $attrValue->value_text;
                } elseif ($attrValue->value_number !== null) {
                    $value = (string) $attrValue->value_number;
                } elseif ($attrValue->value_boolean !== null) {
                    $value = $attrValue->value_boolean ? 'Evet' : 'Hayır';
                }

                return [
                    'name' => $attrValue->attribute->name ?? 'Bilinmeyen',
                    'code' => $attrValue->attribute->code ?? '',
                    'value' => $value ?? '—',
                ];
            })->toArray();
        }

        return $out;
    }
}
