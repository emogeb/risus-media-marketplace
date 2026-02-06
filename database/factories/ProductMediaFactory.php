<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProductMedia>
 */
class ProductMediaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Generate random image ID for variety (1-1000 range for Picsum)
        $imageId = fake()->numberBetween(1, 1000);

        // Use Picsum.photos for reliable placeholder images
        // Format: https://picsum.photos/seed/{seed}/width/height
        $seed = fake()->uuid();

        return [
            'product_id' => Product::factory(),
            'variant_id' => null,
            'type' => 'image',
            'path' => "https://picsum.photos/seed/{$seed}/800/1200",
            'alt_text' => fake()->optional()->words(3, true),
            'sort_order' => fake()->numberBetween(0, 10),
        ];
    }
}
