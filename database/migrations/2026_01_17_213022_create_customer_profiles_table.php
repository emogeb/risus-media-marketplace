<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('customer_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained('users')->onDelete('cascade');
            $table->string('customer_type'); // 'business' veya 'retail'

            // Business customer için gerekli alanlar
            $table->string('tax_number')->nullable(); // Vergi levhası (business için gerekli)
            $table->string('company_name')->nullable(); // Şirket ünvanı (business için gerekli)

            // Retail customer için gerekli alanlar
            $table->string('first_name')->nullable(); // İsim (retail için gerekli)
            $table->string('last_name')->nullable(); // Soyisim (retail için gerekli)

            // Her iki tip için gerekli alanlar
            $table->text('address')->nullable(); // Adres (her ikisi için gerekli)
            $table->string('phone'); // Telefon (her ikisi için gerekli)
            $table->string('email')->nullable(); // Email (retail için nullable, business için gerekli - validation'da kontrol edilecek)

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customer_profiles');
    }
};
