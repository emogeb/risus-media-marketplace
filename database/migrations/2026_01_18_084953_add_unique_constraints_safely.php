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
        $db = DB::getDatabaseName();

        if ($driver === 'sqlite') {
            // SQLite için sqlite_master kullan
            $rows = DB::select(
                "SELECT 1 FROM sqlite_master 
                 WHERE type='index' AND name=? AND tbl_name=?
                 LIMIT 1",
                [$indexName, $table]
            );

            return ! empty($rows);
        } else {
            // MySQL/MariaDB için information_schema kullan
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

    private function ensureNoDuplicates(string $sql, array $bindings, string $message): void
    {
        $rows = DB::select($sql, $bindings);

        if (! empty($rows)) {
            // İlk birkaç duplicate'ı mesajda gösterelim
            $sample = array_slice($rows, 0, 5);
            $sampleJson = json_encode($sample, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            throw new RuntimeException($message."\n\nDuplicate samples:\n".$sampleJson);
        }
    }

    public function up(): void
    {
        /**
         * 1) order_stores: aynı order içinde aynı store 1 kez olmalı
         */
        $this->ensureNoDuplicates(
            'SELECT order_id, store_id, COUNT(*) as count
             FROM order_stores
             GROUP BY order_id, store_id
             HAVING COUNT(*) > 1
             LIMIT 10',
            [],
            'Duplicate rows found in order_stores for (order_id, store_id). Clean duplicates before adding unique.'
        );

        if (! $this->indexExists('order_stores', 'uq_order_stores_order_store')) {
            Schema::table('order_stores', function (Blueprint $t) {
                $t->unique(['order_id', 'store_id'], 'uq_order_stores_order_store');
            });
        }

        /**
         * 2) attribute_values: aynı attribute altında slug tekil olsun
         */
        $this->ensureNoDuplicates(
            'SELECT attribute_id, slug, COUNT(*) as count
             FROM attribute_values
             GROUP BY attribute_id, slug
             HAVING COUNT(*) > 1
             LIMIT 10',
            [],
            'Duplicate rows found in attribute_values for (attribute_id, slug). Clean duplicates before adding unique.'
        );

        if (! $this->indexExists('attribute_values', 'uq_attr_values_attr_slug')) {
            Schema::table('attribute_values', function (Blueprint $t) {
                $t->unique(['attribute_id', 'slug'], 'uq_attr_values_attr_slug');
            });
        }

        /**
         * 3) product_attribute_values (select/multiselect için):
         * aynı product + same attribute + same attribute_value birden fazla kez eklenmesin
         * (attribute_value_id NULL olan satırlar bu unique'e dahil edilmez gibi düşünmek lazım;
         * MySQL'de NULL unique davranışı izin verir, ama yine de dupe kontrolü yapıyoruz.)
         */
        $this->ensureNoDuplicates(
            'SELECT product_id, attribute_id, attribute_value_id, COUNT(*) as count
             FROM product_attribute_values
             WHERE attribute_value_id IS NOT NULL
             GROUP BY product_id, attribute_id, attribute_value_id
             HAVING COUNT(*) > 1
             LIMIT 10',
            [],
            'Duplicate rows found in product_attribute_values for (product_id, attribute_id, attribute_value_id). Clean duplicates before adding unique.'
        );

        if (! $this->indexExists('product_attribute_values', 'uq_pav_product_attr_value')) {
            Schema::table('product_attribute_values', function (Blueprint $t) {
                $t->unique(['product_id', 'attribute_id', 'attribute_value_id'], 'uq_pav_product_attr_value');
            });
        }
    }

    public function down(): void
    {
        // Unique constraint'leri güvenli şekilde drop et
        $uniquesToDrop = [
            ['order_stores', 'uq_order_stores_order_store'],
            ['attribute_values', 'uq_attr_values_attr_slug'],
            ['product_attribute_values', 'uq_pav_product_attr_value'],
        ];

        foreach ($uniquesToDrop as [$table, $indexName]) {
            if ($this->indexExists($table, $indexName)) {
                Schema::table($table, function (Blueprint $t) use ($indexName) {
                    $t->dropUnique($indexName);
                });
            }
        }
    }
};
