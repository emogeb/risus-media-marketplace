<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProductVariant>
 */
class ProductVariantFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $sku = strtoupper(Str::random(3)).'-'.fake()->unique()->numerify('####');

        return [
            'product_id' => Product::factory(),
            'sku' => $sku,
            'price' => fake()->optional()->randomFloat(2, 50, 5000),
            'currency' => 'USD',
            'compare_at_price' => fake()->optional()->randomFloat(2, 50, 5500),
            'stock_quantity' => fake()->numberBetween(0, 100),
            'stock_status' => fake()->randomElement(['in_stock', 'out_of_stock', 'backordered']),
            'is_default' => false,
            'variant_signature' => fake()->optional()->sha1(),
        ];
    }
}
