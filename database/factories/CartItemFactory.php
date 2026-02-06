<?php

namespace Database\Factories;

use App\Models\Cart;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Store;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CartItem>
 */
class CartItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $qty = fake()->numberBetween(1, 5);
        $unitPrice = fake()->randomFloat(2, 20, 1000);
        $lineTotal = $qty * $unitPrice;

        return [
            'cart_id' => Cart::factory(),
            'product_id' => Product::factory(),
            'variant_id' => fake()->optional()->randomElement([ProductVariant::factory(), null]),
            'store_id' => Store::factory(),
            'qty' => $qty,
            'unit_price' => $unitPrice,
            'currency' => 'USD',
            'title_snapshot' => fake()->sentence(),
            'variant_snapshot' => fake()->optional()->randomElement([
                ['color' => fake()->colorName(), 'size' => fake()->randomElement(['S', 'M', 'L', 'XL'])],
                null,
            ]),
            'line_total' => $lineTotal,
        ];
    }
}
