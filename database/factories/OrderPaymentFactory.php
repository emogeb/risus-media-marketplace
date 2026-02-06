<?php

namespace Database\Factories;

use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OrderPayment>
 */
class OrderPaymentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'order_id' => Order::factory(),
            'payment_method' => fake()->randomElement(['credit_card', 'bank_transfer', 'paypal', 'stripe']),
            'amount' => fake()->randomFloat(2, 50, 5000),
            'currency' => 'USD',
            'status' => fake()->randomElement(['pending', 'completed', 'failed', 'refunded']),
            'transaction_id' => fake()->optional()->regexify('[A-Z0-9]{20}'),
            'gateway_response' => fake()->optional()->randomElement([
                ['success' => true, 'transaction_id' => fake()->uuid()],
                null,
            ]),
            'processed_at' => fake()->optional()->dateTimeBetween('-1 week', 'now'),
            'failure_reason' => fake()->optional()->sentence(),
        ];
    }
}
