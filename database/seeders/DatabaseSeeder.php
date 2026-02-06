<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'type' => 'admin',
            'status' => 'active',
        ]);

        // Seed other models through their seeders
        $this->call([
            // User Profiles (must be before stores to ensure sellers have profiles)
            SellerProfileSeeder::class,
            CustomerProfileSeeder::class,

            // Stores and Users
            StoreSeeder::class,

            // Categories
            CategorySeeder::class,

            // Attributes
            AttributeSeeder::class,
            AttributeValueSeeder::class,
            CategoryAttributeSeeder::class,

            // Products
            ProductSeeder::class,
            ProductDescriptionSeeder::class,
            ProductMediaSeeder::class,
            ProductAttributeValueSeeder::class,

            // Variants
            ProductVariantSeeder::class,
            VariantOptionSeeder::class,

            // Orders
            OrderSeeder::class,
            OrderStoreSeeder::class,
            OrderItemSeeder::class,
            OrderItemMeasurementSeeder::class,
        ]);
    }
}
