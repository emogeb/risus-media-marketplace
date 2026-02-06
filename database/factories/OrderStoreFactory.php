<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\Store;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OrderStore>
 */
class OrderStoreFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $subtotal = fake()->randomFloat(2, 50, 2500);
        $shipping = fake()->randomFloat(2, 5, 50);
        $tax = $subtotal * 0.1;
        $grandTotal = $subtotal + $shipping + $tax;

        return [
            'order_id' => Order::factory(),
            'store_id' => Store::factory(),
            'status' => fake()->randomElement(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
            'subtotal' => $subtotal,
            'shipping_total' => $shipping,
            'tax_total' => $tax,
            'grand_total' => $grandTotal,
            'tracking_code' => fake()->optional()->regexify('[A-Z]{2}[0-9]{9}[A-Z]{2}'),
        ];
    }
}
