<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index(Request $request, ?string $categorySlug = null)
    {
        $categories = Category::where('is_active', true)
            ->withCount('products')
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        $activeCategory = $categorySlug ?? 'all';

        $query = Product::with(['store', 'category', 'media'])
            ->where('status', 'published');

        if ($categorySlug && $categorySlug !== 'all') {
            $category = Category::where('slug', $categorySlug)->first();
            if ($category) {
                $query->where('category_id', $category->id);
            }
        }

        $products = $query->latest()->limit(20)->get()->map(function ($product) {
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
                'description' => $product->description?->short_text,
                'href' => route('product.show', ['store' => $product->store->slug, 'product' => $product->slug]),
                'storeName' => $product->store->name ?? '',
                'storeSlug' => $product->store->slug ?? '',
                'madeToOrder' => $product->made_to_order ?? false,
                'leadTimeDays' => $product->lead_time_days,
                'hasVariants' => $product->has_variants ?? false,
            ];
        });

        // Fetch stores - filter by category if provided
        $storesQuery = \App\Models\Store::where('status', 'active')
            ->has('products');

        if ($categorySlug && $categorySlug !== 'all') {
            $category = Category::where('slug', $categorySlug)->first();
            if ($category) {
                // Filter stores that have products in this category
                $storesQuery->whereHas('products', function ($query) use ($category) {
                    $query->where('category_id', $category->id)
                        ->where('status', 'published'); // Changed from 'active' to 'published'
                });
            }
        }

        $stores = $storesQuery->withCount('products')
            ->latest()
            ->get()
            ->map(function ($store) {
                return [
                    'id' => $store->id,
                    'name' => $store->name,
                    'slug' => $store->slug,
                    'href' => "/stores/{$store->slug}",
                    'productsCount' => $store->products_count,
                ];
            });

        // Fetch featured stores for Hero Carousel
        $heroStores = \App\Models\Store::where('is_featured_on_hero', true)
            ->whereNotNull('hero_video')
            ->orderBy('hero_order')
            ->get()
            ->map(function ($store) {
                $address = $store->address_json ?? [];

                return [
                    'id' => $store->id,
                    'name' => $store->name,
                    'slug' => $store->slug,
                    'slogan' => $address['description'] ?? '',
                    'videoUrl' => asset('storage/'.$store->hero_video),
                    'href' => "/stores/{$store->slug}",
                ];
            });

        return Inertia::render('Home', [
            'categories' => $categories->map(fn ($cat) => [
                'id' => $cat->id,
                'name' => $cat->name,
                'slug' => $cat->slug,
                'icon' => null,
                'products_count' => $cat->products_count ?? 0,
            ]),
            'products' => $products,
            'stores' => $stores,
            'heroStores' => $heroStores,
            'activeCategory' => $activeCategory,
            'banners' => \App\Models\Banner::current()->get(),
            'meta' => [
                'title' => $categorySlug
                    ? ($categories->firstWhere('slug', $categorySlug)?->name ?? 'Collections').' - Risus Media'
                    : 'Home - Risus Media',
                'description' => $categorySlug
                    ? 'Explore our '.($categories->firstWhere('slug', $categorySlug)?->name ?? '').' collection'
                    : 'Discover our handpicked selection of elegant products',
            ],
        ]);
    }
}
