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
        Schema::create('cart_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cart_id')->constrained('carts')->onDelete('cascade');
            $table->foreignId('product_id')->constrained('products')->onDelete('restrict');
            $table->foreignId('variant_id')->nullable()->constrained('product_variants')->onDelete('restrict');
            $table->foreignId('store_id')->constrained('stores')->onDelete('restrict');
            $table->integer('qty');
            $table->decimal('unit_price', 10, 2);
            $table->string('currency', 3)->default('USD');
            $table->string('title_snapshot'); // Product title snapshot
            $table->json('variant_snapshot')->nullable(); // Variant options snapshot
            $table->decimal('line_total', 10, 2);
            $table->decimal('discount_total', 10, 2)->default(0); // Item-level discount (future-proofing)
            $table->decimal('tax_total', 10, 2)->default(0); // Item-level tax (future-proofing)
            $table->timestamps();

            // Performance indexes
            $table->index('cart_id');
            $table->index(['cart_id', 'store_id']);
            $table->index('product_id');
            $table->index('variant_id');

            // Index for merge/upsert operations: same product + variant in same cart lookup
            // Note: Not unique to handle NULL variant_id cases. Application-level merge logic handles duplicates.
            $table->index(['cart_id', 'product_id', 'variant_id'], 'idx_cart_items_cart_product_variant');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cart_items');
    }
};
