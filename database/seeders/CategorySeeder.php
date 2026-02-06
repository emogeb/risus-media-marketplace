<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Gelinlik', 'slug' => 'gelinlik', 'sort_order' => 1],
            ['name' => 'Damatlık', 'slug' => 'damatlik', 'sort_order' => 2],
            ['name' => 'Abiye', 'slug' => 'abiye', 'sort_order' => 3],
            ['name' => 'Nişanlık', 'slug' => 'nisanlik', 'sort_order' => 4],
            ['name' => 'Kınalık', 'slug' => 'kinalik', 'sort_order' => 5],
        ];

        foreach ($categories as $category) {
            Category::create([
                'name' => $category['name'],
                'slug' => $category['slug'],
                'sort_order' => $category['sort_order'],
                'is_active' => true,
                'parent_id' => null,
            ]);
        }
    }
}
