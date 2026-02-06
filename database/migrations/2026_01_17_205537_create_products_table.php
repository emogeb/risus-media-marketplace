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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained('stores')->onDelete('cascade');
            $table->foreignId('category_id')->constrained('categories')->onDelete('restrict');
            $table->string('name');
            $table->string('slug');
            $table->string('status')->default('draft');
            $table->decimal('base_price', 10, 2);
            $table->string('currency', 3)->default('USD');
            $table->boolean('made_to_order')->default(false);
            $table->integer('lead_time_days')->nullable();
            $table->boolean('has_variants')->default(false);
            $table->timestamps();
            $table->softDeletes(); // Soft delete for marketplace safety

            $table->unique(['store_id', 'slug']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
