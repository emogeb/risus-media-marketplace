<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Admin kullanıcı oluşturur veya günceller.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@worldweddingfairs.com'],
            [
                'name' => 'Admin',
                'password' => Hash::make('Risus3535'),
                'type' => User::TYPE_ADMIN,
                'status' => 'active',
            ]
        );
    }
}
