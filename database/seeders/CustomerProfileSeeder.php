<?php

namespace Database\Seeders;

use App\Models\CustomerProfile;
use App\Models\User;
use Illuminate\Database\Seeder;

class CustomerProfileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create profiles for existing customers
        $customers = User::where('type', 'customer')->whereDoesntHave('customerProfile')->get();

        foreach ($customers as $customer) {
            CustomerProfile::factory()->create(['user_id' => $customer->id]);
        }

        // Create additional customer profiles if needed
        // Mix of business and retail customers
        if ($customers->isEmpty()) {
            // Create business customers
            CustomerProfile::factory()
                ->count(5)
                ->state(['customer_type' => 'business'])
                ->create();

            // Create retail customers
            CustomerProfile::factory()
                ->count(10)
                ->state(['customer_type' => 'retail'])
                ->create();
        }
    }
}
