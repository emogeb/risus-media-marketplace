<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{
    /**
     * Display the shopping cart.
     */
    public function index(Request $request)
    {
        $cartToken = $request->cookie('cart_token');
        $userId = auth()->id();

        // Get cart (user cart or guest cart)
        if ($userId) {
            $cart = Cart::where('user_id', $userId)
                ->where('status', 'active')
                ->with(['items.product.media', 'items.product.store', 'items.variant'])
                ->first();
        } else {
            $cart = $cartToken
                ? Cart::where('cart_token', $cartToken)
                    ->whereNull('user_id')
                    ->where('status', 'active')
                    ->with(['items.product.media', 'items.product.store', 'items.variant'])
                    ->first()
                : null;
        }

        // Format cart items
        $cartItems = [];
        $subtotal = 0;
        $discount = 0;
        $tax = 0;

        if ($cart && $cart->items->count() > 0) {
            foreach ($cart->items as $item) {
                $product = $item->product;

                // Get primary image
                $primaryImage = $product->media->where('media_type', 'image')->first();

                $cartItems[] = [
                    'id' => $item->id,
                    'product_id' => $product->id,
                    'product_title' => $item->title_snapshot ?? $product->title,
                    'product_slug' => $product->slug,
                    'designer' => $product->designer,
                    'size' => $product->size,
                    'quantity' => $item->qty,
                    'unit_price' => (float) $item->unit_price,
                    'line_total' => (float) $item->line_total,
                    'discount_total' => (float) ($item->discount_total ?? 0),
                    'tax_total' => (float) ($item->tax_total ?? 0),
                    'image' => $primaryImage ? [
                        'url' => filter_var($primaryImage->url, FILTER_VALIDATE_URL)
                            ? $primaryImage->url
                            : asset('storage/'.$primaryImage->url),
                        'alt' => $primaryImage->alt_text ?? $product->title,
                    ] : [
                        'url' => 'https://placehold.co/400x600/e5e7eb/374151?text=No+Image',
                        'alt' => $product->title,
                    ],
                    'store' => [
                        'name' => $product->store->name,
                        'slug' => $product->store->slug,
                    ],
                    'href' => "/{$product->store->slug}/{$product->slug}",
                ];

                $subtotal += (float) $item->line_total;
                $discount += (float) ($item->discount_total ?? 0);
                $tax += (float) ($item->tax_total ?? 0);
            }
        }

        $total = $subtotal - $discount + $tax;

        return Inertia::render('Cart', [
            'cart' => [
                'items' => $cartItems,
                'subtotal' => $subtotal,
                'discount' => $discount,
                'tax' => $tax,
                'total' => $total,
                'item_count' => count($cartItems),
            ],
        ]);
    }

    /**
     * Add item to cart.
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'variant_id' => 'nullable|exists:product_variants,id',
            'quantity' => 'integer|min:1|max:99',
        ]);

        $cartToken = $request->cookie('cart_token');
        $userId = auth()->id();

        // Get or create cart
        if ($userId) {
            $cart = Cart::where('user_id', $userId)
                ->where('status', 'active')
                ->first();

            if (! $cart) {
                $cart = Cart::create([
                    'user_id' => $userId,
                    'status' => 'active',
                    'currency' => 'USD',
                ]);
            }
        } else {
            $cart = Cart::findOrCreateGuestCart($cartToken);
        }

        // Get product and store_id
        $product = Product::findOrFail($request->product_id);

        // Add item to cart
        $cart->addOrUpdateItem(
            $request->product_id,
            $request->variant_id,
            $request->input('quantity', 1),
            $product->store_id
        );

        // Set cart token cookie for guests
        if (! $userId) {
            cookie()->queue('cart_token', $cart->cart_token, 60 * 24 * 30); // 30 days
        }

        return redirect()->back()->with('success', 'Item added to cart');
    }

    /**
     * Update cart item quantity.
     */
    public function update(Request $request, $itemId)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1|max:99',
        ]);

        $cartToken = $request->cookie('cart_token');
        $userId = auth()->id();

        // Get cart
        if ($userId) {
            $cart = Cart::where('user_id', $userId)
                ->where('status', 'active')
                ->first();
        } else {
            $cart = $cartToken ? Cart::findByToken($cartToken) : null;
        }

        if (! $cart) {
            return redirect()->back()->with('error', 'Cart not found');
        }

        // Find item
        $item = $cart->items()->findOrFail($itemId);

        // Update quantity and line total
        $item->qty = $request->quantity;
        $item->line_total = $item->qty * $item->unit_price;
        $item->save();

        return redirect()->back()->with('success', 'Cart updated');
    }

    /**
     * Remove item from cart.
     */
    public function destroy(Request $request, $itemId)
    {
        $cartToken = $request->cookie('cart_token');
        $userId = auth()->id();

        // Get cart
        if ($userId) {
            $cart = Cart::where('user_id', $userId)
                ->where('status', 'active')
                ->first();
        } else {
            $cart = $cartToken ? Cart::findByToken($cartToken) : null;
        }

        if (! $cart) {
            return redirect()->back()->with('error', 'Cart not found');
        }

        // Find and delete item
        $item = $cart->items()->findOrFail($itemId);
        $item->delete();

        return redirect()->back()->with('success', 'Item removed from cart');
    }
}
