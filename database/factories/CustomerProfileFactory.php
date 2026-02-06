<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CustomerProfile>
 */
class CustomerProfileFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $customerType = fake()->randomElement(['business', 'retail']);

        if ($customerType === 'business') {
            // Business customer için
            return [
                'user_id' => User::factory()->state(['type' => 'customer']),
                'customer_type' => 'business',
                'tax_number' => fake()->unique()->numerify('##########'),
                'company_name' => fake()->company(),
                'first_name' => null,
                'last_name' => null,
                'address' => fake()->address(),
                'phone' => fake()->phoneNumber(),
                'email' => fake()->unique()->companyEmail(), // Business için email gerekli
            ];
        } else {
            // Retail customer için
            return [
                'user_id' => User::factory()->state(['type' => 'customer']),
                'customer_type' => 'retail',
                'tax_number' => null,
                'company_name' => null,
                'first_name' => fake()->firstName(),
                'last_name' => fake()->lastName(),
                'address' => fake()->address(),
                'phone' => fake()->phoneNumber(),
                'email' => fake()->optional()->email(), // Retail için email nullable
            ];
        }
    }
}
