<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Store;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->words(3, true);

        return [
            'store_id' => Store::factory(),
            'category_id' => Category::inRandomOrder()->first()?->id ?? Category::factory(),
            'name' => $name,
            'slug' => Str::slug($name),
            'status' => fake()->randomElement(['draft', 'published', 'archived']),
            'base_price' => fake()->randomFloat(2, 50, 5000),
            'currency' => 'USD',
            'made_to_order' => fake()->boolean(30),
            'lead_time_days' => fake()->optional()->numberBetween(7, 60),
            'has_variants' => fake()->boolean(50),
        ];
    }
}
