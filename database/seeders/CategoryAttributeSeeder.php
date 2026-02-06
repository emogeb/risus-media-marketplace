<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\CategoryAttribute;
use Illuminate\Database\Seeder;

class CategoryAttributeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = Category::all();
        $attributes = \App\Models\Attribute::all();

        if ($categories->isEmpty() || $attributes->isEmpty()) {
            return; // Skip if no categories or attributes exist
        }

        // Assign 2-4 attributes to each category
        foreach ($categories as $category) {
            $randomAttributes = $attributes->random(min(fake()->numberBetween(2, 4), $attributes->count()));

            foreach ($randomAttributes as $attribute) {
                CategoryAttribute::create([
                    'category_id' => $category->id,
                    'attribute_id' => $attribute->id,
                    'is_required' => fake()->boolean(50),
                    'sort_order' => fake()->numberBetween(0, 100),
                ]);
            }
        }
    }
}
