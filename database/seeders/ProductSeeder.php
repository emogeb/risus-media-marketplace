<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductDescription;
use App\Models\ProductMedia;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get existing categories and stores
        $categories = \App\Models\Category::all();
        $stores = \App\Models\Store::where('status', 'active')->get();

        if ($categories->isEmpty()) {
            throw new \Exception('No categories found. Please run CategorySeeder first.');
        }

        if ($stores->isEmpty()) {
            throw new \Exception('No stores found. Please run StoreSeeder first.');
        }

        // Create products with existing categories and stores
        foreach (range(1, 100) as $index) {
            $product = Product::factory()->create([
                'category_id' => $categories->random()->id,
                'store_id' => $stores->random()->id,
                'status' => fake()->randomElement(['published', 'published', 'published', 'draft', 'archived']), // 60% published
            ]);

            // Add product description
            ProductDescription::factory()->create([
                'product_id' => $product->id,
            ]);

            // Add 1-5 product media
            ProductMedia::factory()
                ->count(fake()->numberBetween(1, 5))
                ->create([
                    'product_id' => $product->id,
                ]);
        }
    }
}
