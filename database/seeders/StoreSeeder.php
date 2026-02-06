<?php

namespace Database\Seeders;

use App\Models\Store;
use App\Models\User;
use Illuminate\Database\Seeder;

class StoreSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create stores for sellers
        $sellers = User::where('type', 'seller')->get();

        if ($sellers->isEmpty()) {
            // Create some seller users first
            $sellers = User::factory()
                ->count(5)
                ->create(['type' => 'seller']);
        }

        foreach ($sellers as $seller) {
            Store::factory()
                ->count(fake()->numberBetween(1, 3))
                ->create(['owner_user_id' => $seller->id]);
        }
    }
}
