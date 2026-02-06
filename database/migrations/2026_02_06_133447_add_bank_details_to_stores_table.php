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
        Schema::table('stores', function (Blueprint $table) {
            $table->string('bank_iban')->nullable()->after('address_json');
            $table->string('bank_qr_path')->nullable()->after('bank_iban');
            $table->string('bank_swiss_code')->nullable()->after('bank_qr_path');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('stores', function (Blueprint $table) {
            $table->dropColumn(['bank_iban', 'bank_qr_path', 'bank_swiss_code']);
        });
    }
};
