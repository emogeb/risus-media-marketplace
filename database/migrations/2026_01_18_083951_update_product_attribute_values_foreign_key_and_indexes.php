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
        Schema::table('product_attribute_values', function (Blueprint $table) {
            // Drop the existing foreign key constraint for attribute_value_id
            $table->dropForeign(['attribute_value_id']);

            // Recreate it with set null on delete (safer for catalog filters)
            $table->foreign('attribute_value_id')
                ->references('id')
                ->on('attribute_values')
                ->onDelete('set null');

            // Add performance indexes
            // Index for querying product attributes
            $table->index(['product_id', 'attribute_id'], 'idx_product_attribute');

            // Index for filtering by attribute and value
            $table->index(['attribute_id', 'attribute_value_id'], 'idx_attribute_value');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('product_attribute_values', function (Blueprint $table) {
            // Drop indexes
            $table->dropIndex('idx_product_attribute');
            $table->dropIndex('idx_attribute_value');

            // Drop the foreign key constraint
            $table->dropForeign(['attribute_value_id']);

            // Recreate it with cascade (original behavior)
            $table->foreign('attribute_value_id')
                ->references('id')
                ->on('attribute_values')
                ->onDelete('cascade');
        });
    }
};
