<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class OrderPayment extends Model
{
    /** @use HasFactory<\Database\Factories\OrderPaymentFactory> */
    use HasFactory;

    protected $fillable = [
        'order_id',
        'payment_method',
        'amount',
        'currency',
        'status',
        'transaction_id',
        'idempotency_key',
        'payment_intent_id',
        'gateway_response',
        'processed_at',
        'failure_reason',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'gateway_response' => 'array',
            'processed_at' => 'datetime',
        ];
    }

    /**
     * Get the order that owns the payment.
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Create or find payment by idempotency key (prevents duplicate payments).
     */
    public static function createOrFindByIdempotencyKey(int $orderId, array $attributes, ?string $idempotencyKey = null): OrderPayment
    {
        // Generate idempotency key if not provided
        $idempotencyKey = $idempotencyKey ?? Str::uuid()->toString();

        // Check if payment with this idempotency key already exists
        $existingPayment = static::where('idempotency_key', $idempotencyKey)->first();

        if ($existingPayment) {
            return $existingPayment;
        }

        // Check if order already has a pending payment (prevent multiple pending payments)
        $hasPendingPayment = static::where('order_id', $orderId)
            ->where('status', 'pending')
            ->exists();

        if ($hasPendingPayment) {
            throw ValidationException::withMessages([
                'order_id' => 'Order already has a pending payment. Please complete or cancel the existing payment first.',
            ]);
        }

        // Create new payment with idempotency key
        return static::create([
            ...$attributes,
            'order_id' => $orderId,
            'idempotency_key' => $idempotencyKey,
        ]);
    }

    /**
     * Check if order has pending payment.
     */
    public static function hasPendingPayment(int $orderId): bool
    {
        return static::where('order_id', $orderId)
            ->where('status', 'pending')
            ->exists();
    }
}
