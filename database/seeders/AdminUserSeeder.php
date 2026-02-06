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
            ['email' => 'emogeb11@gmail.com'],
            [
                'name' => 'Admin',
                'password' => Hash::make('admin123'),
                'type' => User::TYPE_ADMIN,
                'status' => 'active',
            ]
        );
    }
}
