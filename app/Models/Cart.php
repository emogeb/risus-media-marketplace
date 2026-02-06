<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Cart extends Model
{
    /** @use HasFactory<\Database\Factories\CartFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'cart_token',
        'status',
        'currency',
        'expires_at',
    ];

    protected function casts(): array
    {
        return [
            'expires_at' => 'datetime',
        ];
    }

    /**
     * Get the user that owns the cart.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the cart items for the cart.
     */
    public function items(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    /**
     * Add or update item in cart (merge behavior).
     * If same product + variant exists, increments qty; otherwise creates new item.
     */
    public function addOrUpdateItem(int $productId, ?int $variantId, int $qty, int $storeId): CartItem
    {
        $product = Product::findOrFail($productId);

        // Validate variant requirement
        CartItem::validateVariantRequirement($product, $variantId);

        // Find existing item with same product + variant in this cart
        $existingItem = $this->items()
            ->where('product_id', $productId)
            ->where('variant_id', $variantId)
            ->first();

        if ($existingItem) {
            // Update existing item: increment qty and recalculate totals
            $existingItem->qty += $qty;
            $existingItem->line_total = $existingItem->qty * $existingItem->unit_price;
            $existingItem->save();

            return $existingItem;
        }

        // Create new item
        $variant = $variantId ? ProductVariant::findOrFail($variantId) : null;
        $unitPrice = $variant?->price ?? $product->base_price;
        $lineTotal = $qty * $unitPrice;

        return $this->items()->create([
            'product_id' => $productId,
            'variant_id' => $variantId,
            'store_id' => $storeId,
            'qty' => $qty,
            'unit_price' => $unitPrice,
            'currency' => $product->currency ?? 'USD',
            'title_snapshot' => $product->name,
            'variant_snapshot' => $variant ? [
                'sku' => $variant->sku,
                'price' => $variant->price,
            ] : null,
            'line_total' => $lineTotal,
        ]);
    }

    /**
     * Create or find guest cart by cart token.
     */
    public static function findOrCreateGuestCart(?string $cartToken = null): Cart
    {
        if ($cartToken) {
            $cart = static::where('cart_token', $cartToken)
                ->whereNull('user_id')
                ->where('status', 'active')
                ->first();

            if ($cart) {
                return $cart;
            }
        }

        // Create new guest cart
        return static::create([
            'user_id' => null,
            'cart_token' => Str::uuid()->toString(),
            'status' => 'active',
            'currency' => 'USD',
        ]);
    }

    /**
     * Merge guest cart into user cart (on login).
     * Transfers all items from guest cart to user cart.
     */
    public static function mergeGuestCartIntoUserCart(Cart $guestCart, int $userId): Cart
    {
        // Get or create user's active cart
        $userCart = static::where('user_id', $userId)
            ->where('status', 'active')
            ->first();

        if (! $userCart) {
            $userCart = static::create([
                'user_id' => $userId,
                'cart_token' => null,
                'status' => 'active',
                'currency' => $guestCart->currency ?? 'USD',
            ]);
        }

        // Transfer items from guest cart to user cart
        foreach ($guestCart->items as $guestItem) {
            $userCart->addOrUpdateItem(
                $guestItem->product_id,
                $guestItem->variant_id,
                $guestItem->qty,
                $guestItem->store_id
            );
        }

        // Mark guest cart as completed/merged
        $guestCart->update(['status' => 'completed']);

        return $userCart;
    }

    /**
     * Get cart by token (for guest carts).
     */
    public static function findByToken(string $cartToken): ?Cart
    {
        return static::where('cart_token', $cartToken)
            ->where('status', 'active')
            ->first();
    }
}
