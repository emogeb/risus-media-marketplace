<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class CheckoutController extends Controller
{
    public function index(Request $request)
    {
        $cartToken = $request->cookie('cart_token');
        $userId = auth()->id();

        // Get cart
        if ($userId) {
            $cart = Cart::where('user_id', $userId)
                ->where('status', 'active')
                ->with(['items.product.store.owner.sellerProfile'])
                ->first();
        } else {
            $cart = $cartToken
                ? Cart::where('cart_token', $cartToken)
                    ->whereNull('user_id')
                    ->where('status', 'active')
                    ->with(['items.product.store.owner.sellerProfile'])
                    ->first()
                : null;
        }

        if (!$cart || $cart->items->count() === 0) {
            return redirect()->route('cart.index');
        }

        // Since we restricted cart to single store, get the first one
        $store = $cart->items->first()->product->store;
        $sellerProfile = $store->owner->sellerProfile;

        return Inertia::render('Checkout/Index', [
            'store' => [
                'name' => $store->name,
                'bank_iban' => $store->bank_iban,
                'bank_swiss_code' => $store->bank_swiss_code,
                'bank_qr_url' => $store->bank_qr_path ? Storage::disk('public')->url($store->bank_qr_path) : null,
                'company_name' => $sellerProfile->company_name ?? '—',
                'tax_number' => $sellerProfile->tax_number ?? '—',
            ],
            'cart' => [
                'total' => (float) ($cart->total ?? 0),
                'items' => $cart->items->map(fn($item) => [
                    'title' => $item->title_snapshot ?? $item->product->title,
                    'qty' => $item->qty,
                    'price' => (float) $item->unit_price,
                ]),
            ]
        ]);
    }
}
