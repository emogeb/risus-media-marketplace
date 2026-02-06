<?php

namespace Database\Seeders;

use App\Models\Attribute;
use Illuminate\Database\Seeder;

class AttributeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create common attributes for fashion products
        $attributes = [
            ['code' => 'color', 'name' => 'Color', 'data_type' => 'select', 'is_filterable' => true, 'is_variant' => true],
            ['code' => 'size', 'name' => 'Size', 'data_type' => 'select', 'is_filterable' => true, 'is_variant' => true],
            ['code' => 'material', 'name' => 'Material', 'data_type' => 'select', 'is_filterable' => true, 'is_variant' => false],
            ['code' => 'style', 'name' => 'Style', 'data_type' => 'select', 'is_filterable' => true, 'is_variant' => false],
            ['code' => 'occasion', 'name' => 'Occasion', 'data_type' => 'multiselect', 'is_filterable' => true, 'is_variant' => false],
        ];

        foreach ($attributes as $attribute) {
            Attribute::create($attribute);
        }

        // Create additional attributes
        Attribute::factory()->count(5)->create();
    }
}
