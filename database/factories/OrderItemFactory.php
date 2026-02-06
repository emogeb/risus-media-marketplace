<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\OrderStore;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Store;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OrderItem>
 */
class OrderItemFactory extends Factory
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
            'order_id' => Order::factory(),
            'order_store_id' => OrderStore::factory(),
            'store_id' => Store::factory(),
            'product_id' => Product::factory(),
            'variant_id' => fake()->optional()->randomElement([ProductVariant::factory(), null]),
            'qty' => $qty,
            'unit_price' => $unitPrice,
            'currency' => 'USD',
            'title_snapshot' => fake()->sentence(),
            'variant_snapshot' => fake()->optional()->randomElement([
                ['color' => fake()->colorName(), 'size' => fake()->randomElement(['S', 'M', 'L', 'XL'])],
                null,
            ]),
            'line_total' => $lineTotal,
            'notes' => fake()->optional()->sentence(),
        ];
    }
}
