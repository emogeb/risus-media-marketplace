<?php

namespace Database\Factories;

use App\Models\OrderItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OrderItemMeasurement>
 */
class OrderItemMeasurementFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'order_item_id' => OrderItem::factory(),
            'data' => [
                'bust' => fake()->numberBetween(32, 48),
                'waist' => fake()->numberBetween(24, 40),
                'hips' => fake()->numberBetween(34, 46),
                'length' => fake()->numberBetween(100, 150),
                'notes' => fake()->optional()->sentence(),
            ],
        ];
    }
}
