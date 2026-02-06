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

    private function addIndexIfMissing(string $table, string $indexName, array $columns): void
    {
        if ($this->indexExists($table, $indexName)) {
            return;
        }

        Schema::table($table, function (Blueprint $t) use ($indexName, $columns) {
            $t->index($columns, $indexName);
        });
    }

    public function up(): void
    {
        // attribute_values: attribute bazlı arama/sıralama
        $this->addIndexIfMissing('attribute_values', 'idx_attr_values_attr_sort', ['attribute_id', 'sort_order']);
        $this->addIndexIfMissing('attribute_values', 'idx_attr_values_attr_slug', ['attribute_id', 'slug']);

        // product_attribute_values: filtre sorgularının bel kemiği
        // Not: ['product_id', 'attribute_id'] ve ['attribute_id', 'attribute_value_id']
        // zaten create table'da var ama farklı isimlerle olabilir, kontrol ediyoruz
        $this->addIndexIfMissing('product_attribute_values', 'idx_pav_product_attr', ['product_id', 'attribute_id']);
        $this->addIndexIfMissing('product_attribute_values', 'idx_pav_attr_value', ['attribute_id', 'attribute_value_id']);
        $this->addIndexIfMissing('product_attribute_values', 'idx_pav_product_value', ['product_id', 'attribute_value_id']);

        // variant_options: varyant -> seçenek lookup
        $this->addIndexIfMissing('variant_options', 'idx_vo_value', ['attribute_value_id']);
        $this->addIndexIfMissing('variant_options', 'idx_vo_attr_value', ['attribute_id', 'attribute_value_id']);

        // order_stores: order içinden store kırılımı hızlı gelsin
        $this->addIndexIfMissing('order_stores', 'idx_os_order', ['order_id']);
        $this->addIndexIfMissing('order_stores', 'idx_os_store', ['store_id']);

        // order_items: sipariş detayları hızlı gelsin
        $this->addIndexIfMissing('order_items', 'idx_oi_order_store', ['order_store_id']);
        $this->addIndexIfMissing('order_items', 'idx_oi_order', ['order_id']);
        $this->addIndexIfMissing('order_items', 'idx_oi_store', ['store_id']);
        $this->addIndexIfMissing('order_items', 'idx_oi_product', ['product_id']);
        $this->addIndexIfMissing('order_items', 'idx_oi_variant', ['variant_id']);

        // products: category/store listeleri
        $this->addIndexIfMissing('products', 'idx_products_category_status', ['category_id', 'status']);
        $this->addIndexIfMissing('products', 'idx_products_store_status', ['store_id', 'status']);
    }

    public function down(): void
    {
        // Index'leri güvenli şekilde drop et
        $indexesToDrop = [
            ['attribute_values', 'idx_attr_values_attr_sort'],
            ['attribute_values', 'idx_attr_values_attr_slug'],
            ['product_attribute_values', 'idx_pav_product_attr'],
            ['product_attribute_values', 'idx_pav_attr_value'],
            ['product_attribute_values', 'idx_pav_product_value'],
            ['variant_options', 'idx_vo_value'],
            ['variant_options', 'idx_vo_attr_value'],
            ['order_stores', 'idx_os_order'],
            ['order_stores', 'idx_os_store'],
            ['order_items', 'idx_oi_order_store'],
            ['order_items', 'idx_oi_order'],
            ['order_items', 'idx_oi_store'],
            ['order_items', 'idx_oi_product'],
            ['order_items', 'idx_oi_variant'],
            ['products', 'idx_products_category_status'],
            ['products', 'idx_products_store_status'],
        ];

        foreach ($indexesToDrop as [$table, $indexName]) {
            if ($this->indexExists($table, $indexName)) {
                Schema::table($table, function (Blueprint $t) use ($indexName) {
                    $t->dropIndex($indexName);
                });
            }
        }
    }
};
