<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function show($storeSlug, $productSlug)
    {
        \Illuminate\Support\Facades\Log::info("ProductController@show hit with store: $storeSlug, product: $productSlug");
        $product = Product::where('slug', $productSlug)
            ->whereHas('store', function ($query) use ($storeSlug) {
                $query->where('slug', $storeSlug);
            })
            ->with(['store', 'category', 'media', 'description', 'attributeValues.attribute', 'variants'])
            ->firstOrFail();

        // Get images from media or create placeholder
        $images = $product->media->count() > 0
            ? $product->media->map(function ($img) use ($product) {
                // Check if path is already a full URL (starts with http)
                $imageUrl = str_starts_with($img->path, 'http')
                    ? $img->path
                    : asset('storage/'.$img->path);

                return [
                    'id' => $img->id,
                    'url' => $imageUrl,
                    'alt' => $img->alt_text ?? $product->name,
                ];
            })->toArray()
            : [
                [
                    'id' => 0,
                    'url' => 'https://placehold.co/800x1200/e5e7eb/374151?text='.urlencode($product->name),
                    'alt' => $product->name,
                ],
            ];

        // Get description from description table
        $description = $product->description?->content ?? $product->name.' - '.$product->category->name;

        // Build condition badges from real data
        $conditionBadges = [];
        if ($product->made_to_order) {
            $conditionBadges[] = 'Sipariş Üzerine Üretim';
        } else {
            $conditionBadges[] = 'Hemen Gönderim';
        }
        if ($product->status === 'published') {
            $conditionBadges[] = 'Onaylı Ürün';
        }
        $conditionBadges[] = 'Deneme Hizmeti Mevcut';

        // Build specs from attributes and product data
        $specs = [
            ['label' => 'Kategori', 'value' => $product->category->name ?? 'N/A'],
            ['label' => 'Durum', 'value' => $product->status === 'published' ? 'Yayında' : ucfirst($product->status)],
        ];

        // Add custom attributes
        foreach ($product->attributeValues as $attrValue) {
            $specs[] = [
                'label' => $attrValue->attribute->name ?? 'Attribute',
                'value' => $attrValue->value ?? 'N/A',
            ];
        }

        // Add made to order info
        if ($product->made_to_order && $product->lead_time_days) {
            $specs[] = ['label' => 'Hazırlık Süresi', 'value' => $product->lead_time_days.' gün'];
        }

        $specs[] = ['label' => 'Para Birimi', 'value' => $product->currency];

        return Inertia::render('Products/Show', [
            'product' => [
                'id' => $product->id,
                'title' => $product->name,
                'slug' => $product->slug,
                'store_slug' => $product->store->slug,
                'designer' => $product->store->name,
                'price' => (float) ($product->variants->where('is_default', true)->first()?->price ?? ($product->discount_rate > 0
                    ? $product->base_price * (1 - $product->discount_rate / 100)
                    : $product->base_price)),
                'originalPrice' => $product->discount_rate > 0 ? (float) $product->base_price : null,
                'discount_rate' => $product->discount_rate,
                'currency' => $product->currency,
                'conditionBadges' => $conditionBadges,
                'description' => $description,
                'images' => $images,
                'specs' => $specs,
                'seller' => [
                    'name' => $product->store->name,
                    'location' => 'Türkiye',
                    'returnPolicy' => 'Son indirim - İade kabul edilmez',
                ],
                'shippingNote' => $product->store->name.' mağazasında depolanır ve doğrudan gönderilir. Tüm siparişlerde ücretsiz standart kargo.',
            ],
        ]);
    }
}
