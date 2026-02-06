<?php

namespace Database\Seeders;

use App\Models\SellerProfile;
use App\Models\User;
use Illuminate\Database\Seeder;

class SellerProfileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create profiles for existing sellers
        $sellers = User::where('type', 'seller')->whereDoesntHave('sellerProfile')->get();

        foreach ($sellers as $seller) {
            SellerProfile::factory()->create(['user_id' => $seller->id]);
        }

        // Create additional seller profiles if needed
        if ($sellers->isEmpty()) {
            SellerProfile::factory()->count(5)->create();
        }
    }
}
