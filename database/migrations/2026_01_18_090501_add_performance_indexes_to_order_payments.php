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
        // Index for panel/reporting queries: order payments by status and date
        if (! $this->indexExists('order_payments', 'idx_order_payments_order_status_created')) {
            Schema::table('order_payments', function (Blueprint $table) {
                $table->index(['order_id', 'status', 'created_at'], 'idx_order_payments_order_status_created');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if ($this->indexExists('order_payments', 'idx_order_payments_order_status_created')) {
            Schema::table('order_payments', function (Blueprint $table) {
                $table->dropIndex('idx_order_payments_order_status_created');
            });
        }
    }
};
