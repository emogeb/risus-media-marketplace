<?php

namespace Database\Seeders;

use App\Models\Cart;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class TestCartSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create a test guest cart with token
        $cart = Cart::create([
            'user_id' => null,
            'cart_token' => 'test-cart-token-'.Str::random(8),
            'status' => 'active',
            'currency' => 'USD',
        ]);

        // Get some random published products without variants
        $products = Product::where('status', 'published')
            ->where(function ($query) {
                $query->where('has_variants', false)
                    ->orWhereNull('has_variants');
            })
            ->with('store')
            ->inRandomOrder()
            ->limit(3)
            ->get();

        foreach ($products as $product) {
            $cart->addOrUpdateItem(
                $product->id,
                null, // no variant
                rand(1, 3), // random quantity
                $product->store_id
            );
        }

        $this->command->info("Test cart created with token: {$cart->cart_token}");
        $this->command->info("Total items: {$cart->items->count()}");
    }
}
