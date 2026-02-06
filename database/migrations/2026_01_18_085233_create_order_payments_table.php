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
        Schema::create('order_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->string('payment_method'); // credit_card, bank_transfer, paypal, etc.
            $table->decimal('amount', 10, 2);
            $table->string('currency', 3)->default('USD');
            $table->string('status')->default('pending'); // pending, completed, failed, refunded
            $table->string('transaction_id')->nullable()->unique(); // Gateway transaction ID
            $table->string('idempotency_key')->nullable()->unique(); // Idempotency key for retry protection
            $table->string('payment_intent_id')->nullable()->unique(); // Payment intent ID from provider
            $table->json('gateway_response')->nullable(); // Full gateway response
            $table->timestamp('processed_at')->nullable();
            $table->text('failure_reason')->nullable(); // Error message if failed
            $table->timestamps();

            // Performance indexes
            $table->index('order_id');
            $table->index(['order_id', 'status']);
            $table->index('status');
            $table->index('transaction_id');
            $table->index('processed_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_payments');
    }
};
