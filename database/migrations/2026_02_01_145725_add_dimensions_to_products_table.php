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
        Schema::table('products', function (Blueprint $table) {
            // Physical Dimensions (for shipping/logistics)
            $table->decimal('length', 8, 2)->nullable()->after('lead_time_days')->comment('Length in cm');
            $table->decimal('width', 8, 2)->nullable()->after('length')->comment('Width in cm');
            $table->decimal('height', 8, 2)->nullable()->after('width')->comment('Height in cm');
            $table->decimal('weight', 8, 2)->nullable()->after('height')->comment('Weight in kg');

            // Product Size/Fit Info
            $table->string('size_info', 100)->nullable()->after('weight')->comment('Size range or fit info (e.g., "36-44", "S/M/L")');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['length', 'width', 'height', 'weight', 'size_info']);
        });
    }
};
