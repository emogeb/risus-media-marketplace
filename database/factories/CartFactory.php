<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Cart>
 */
class CartFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory()->state(['type' => 'customer']),
            'status' => fake()->randomElement(['active', 'abandoned', 'completed', 'expired']),
            'currency' => 'USD',
            'expires_at' => fake()->optional()->dateTimeBetween('+1 day', '+30 days'),
        ];
    }
}
