<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Attribute>
 */
class AttributeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $codes = ['color', 'size', 'material', 'style', 'season', 'occasion'];
        $code = fake()->randomElement($codes).'-'.fake()->unique()->numerify('####');

        return [
            'code' => $code,
            'name' => fake()->words(2, true),
            'data_type' => fake()->randomElement(['select', 'multiselect', 'number', 'text', 'boolean']),
            'is_filterable' => fake()->boolean(70),
            'is_variant' => fake()->boolean(50),
            'sort_order' => fake()->numberBetween(0, 100),
        ];
    }
}
