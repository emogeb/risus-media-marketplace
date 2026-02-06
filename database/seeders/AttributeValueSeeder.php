<?php

namespace Database\Seeders;

use App\Models\Attribute;
use App\Models\AttributeValue;
use Illuminate\Database\Seeder;

class AttributeValueSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create values for color attribute
        $colorAttribute = Attribute::where('code', 'color')->first();
        if ($colorAttribute) {
            $colors = ['Red', 'Blue', 'White', 'Black', 'Ivory', 'Pink', 'Navy', 'Gold'];
            foreach ($colors as $index => $color) {
                AttributeValue::create([
                    'attribute_id' => $colorAttribute->id,
                    'value' => $color,
                    'slug' => strtolower($color),
                    'sort_order' => $index,
                ]);
            }
        }

        // Create values for size attribute
        $sizeAttribute = Attribute::where('code', 'size')->first();
        if ($sizeAttribute) {
            $sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '0', '2', '4', '6', '8', '10', '12', '14', '16'];
            foreach ($sizes as $index => $size) {
                AttributeValue::create([
                    'attribute_id' => $sizeAttribute->id,
                    'value' => $size,
                    'slug' => strtolower($size),
                    'sort_order' => $index,
                ]);
            }
        }

        // Create values for other attributes
        AttributeValue::factory()->count(30)->create();
    }
}
