<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Validation\ValidationException;

class CartItem extends Model
{
    /** @use HasFactory<\Database\Factories/CartItemFactory> */
    use HasFactory;

    protected $fillable = [
        'cart_id',
        'product_id',
        'variant_id',
        'store_id',
        'qty',
        'unit_price',
        'currency',
        'title_snapshot',
        'variant_snapshot',
        'line_total',
        'discount_total',
        'tax_total',
    ];

    protected function casts(): array
    {
        return [
            'unit_price' => 'decimal:2',
            'line_total' => 'decimal:2',
            'discount_total' => 'decimal:2',
            'tax_total' => 'decimal:2',
            'variant_snapshot' => 'array',
        ];
    }

    /**
     * Get the cart that owns the cart item.
     */
    public function cart(): BelongsTo
    {
        return $this->belongsTo(Cart::class);
    }

    /**
     * Get the product (read-only reference).
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get the variant (read-only reference, nullable).
     */
    public function variant(): BelongsTo
    {
        return $this->belongsTo(ProductVariant::class);
    }

    /**
     * Get the store.
     */
    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    /**
     * Validate that variant_id is required when product has variants.
     */
    public static function validateVariantRequirement(Product $product, ?int $variantId): void
    {
        if ($product->has_variants && $variantId === null) {
            throw ValidationException::withMessages([
                'variant_id' => 'Variant selection is required for products with variants.',
            ]);
        }
    }
}
