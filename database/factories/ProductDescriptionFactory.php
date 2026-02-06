<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProductDescription>
 */
class ProductDescriptionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'product_id' => Product::factory(),
            'short_text' => fake()->sentence(),
            'long_text' => fake()->paragraphs(3, true),
            'care_text' => fake()->optional()->paragraph(),
            'meta_title' => fake()->optional()->sentence(),
            'meta_description' => fake()->optional()->text(160),
        ];
    }
}
