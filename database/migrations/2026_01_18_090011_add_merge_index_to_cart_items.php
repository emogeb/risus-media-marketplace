<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private function indexExists(string $table, string $indexName): bool
    {
        $driver = DB::connection()->getDriverName();

        if ($driver === 'sqlite') {
            $rows = DB::select(
                "SELECT 1 FROM sqlite_master 
                 WHERE type='index' AND name=? AND tbl_name=?
                 LIMIT 1",
                [$indexName, $table]
            );

            return ! empty($rows);
        } else {
            $db = DB::getDatabaseName();
            $rows = DB::select(
                'SELECT 1
                 FROM information_schema.statistics
                 WHERE table_schema = ? AND table_name = ? AND index_name = ?
                 LIMIT 1',
                [$db, $table, $indexName]
            );

            return ! empty($rows);
        }
    }

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Index for merge/upsert operations: same product + variant in same cart lookup
        // Note: Not unique to handle NULL variant_id cases. Application-level merge logic handles duplicates.
        if (! $this->indexExists('cart_items', 'idx_cart_items_cart_product_variant')) {
            Schema::table('cart_items', function (Blueprint $table) {
                $table->index(['cart_id', 'product_id', 'variant_id'], 'idx_cart_items_cart_product_variant');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if ($this->indexExists('cart_items', 'idx_cart_items_cart_product_variant')) {
            Schema::table('cart_items', function (Blueprint $table) {
                $table->dropIndex('idx_cart_items_cart_product_variant');
            });
        }
    }
};
