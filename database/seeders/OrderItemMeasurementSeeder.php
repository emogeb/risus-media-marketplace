<?php

namespace Database\Seeders;

use App\Models\OrderItemMeasurement;
use Illuminate\Database\Seeder;

class OrderItemMeasurementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // OrderItemMeasurementSeeder will create measurements for some order items
        // Only create for made-to-order items
        OrderItemMeasurement::factory()->count(10)->create();
    }
}
