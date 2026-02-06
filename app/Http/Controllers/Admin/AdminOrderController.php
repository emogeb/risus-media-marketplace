<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminOrderController extends Controller
{
    /**
     * List orders (paginated). JSON for admin SPA.
     */
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'page' => 'sometimes|integer|min:1',
            'pageSize' => 'sometimes|integer|min:1|max:100',
            'q' => 'sometimes|nullable|string|max:255',
            'search' => 'sometimes|nullable|string|max:255',
            'status' => 'sometimes|nullable|string|max:50',
            'payment_status' => 'sometimes|nullable|string|max:50',
            'fulfillment_type' => 'sometimes|nullable|string|max:50',
            'bridal_status' => 'sometimes|nullable|string|max:50',
        ]);

        $query = Order::query()
            ->with(['user:id,name,email', 'orderStores', 'payments']);

        // Search by order ID or user info
        $search = $request->filled('q') ? $request->q : $request->input('search');
        if ($search !== null && $search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('id', 'like', '%'.$search.'%')
                    ->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('name', 'like', '%'.$search.'%')
                            ->orWhere('email', 'like', '%'.$search.'%');
                    });
            });
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by payment status
        if ($request->filled('payment_status')) {
            $query->where('payment_status', $request->payment_status);
        }

        // Filter by fulfillment type
        if ($request->filled('fulfillment_type')) {
            $query->where('fulfillment_type', $request->fulfillment_type);
        }

        // Filter by bridal status
        if ($request->filled('bridal_status')) {
            $query->where('bridal_status', $request->bridal_status);
        }

        try {
            $perPage = (int) $request->input('pageSize', 10);
            $paginator = $query->orderBy('created_at', 'desc')->paginate($perPage);

            $items = $paginator->getCollection()->map(fn (Order $order) => $this->orderToApi($order));

            return response()->json([
                'data' => $items,
                'total' => $paginator->total(),
                'page' => $paginator->currentPage(),
                'pageSize' => $paginator->perPage(),
            ]);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Orders API Error: '.$e->getMessage());
            // Log::error($e->getTraceAsString());
            throw $e;
        }
    }

    /**
     * Get single order.
     */
    public function show(string $id): JsonResponse
    {
        $order = Order::with(['user:id,name,email', 'orderStores.orderItems', 'payments'])
            ->findOrFail((int) $id);

        return response()->json(['data' => $this->orderToApi($order, true)]);
    }

    /**
     * Update order status.
     */
    public function updateStatus(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|string|max:50',
        ]);

        $order = Order::findOrFail((int) $id);
        $order->status = $validated['status'];
        $order->save();

        $order->load(['user:id,name,email', 'orderStores', 'payments']);

        return response()->json(['data' => $this->orderToApi($order, true)]);
    }

    /**
     * Transform Order model to API response format.
     */
    private function orderToApi(Order $order, bool $full = false): array
    {
        $out = [
            'id' => (string) $order->id,
            'orderNumber' => '#'.str_pad((string) $order->id, 6, '0', STR_PAD_LEFT),
            'status' => $order->status,
            'paymentStatus' => $order->payment_status,
            'payment_status' => $order->payment_status, // keep snake_case for compatibility
            'currency' => $order->currency,
            'subtotal' => (float) $order->subtotal,
            'shipping_total' => (float) $order->shipping_total,
            'tax_total' => (float) $order->tax_total,
            'grand_total' => (float) $order->grand_total,
            'total' => (float) $order->grand_total, // Frontend expects total
            'created_at' => $order->created_at?->toIso8601String(),
            'updated_at' => $order->updated_at?->toIso8601String(),
            'fulfillmentType' => $order->fulfillment_type,
            'fulfillment_type' => $order->fulfillment_type,
            'bridalStatus' => $order->bridal_status,
            'bridal_status' => $order->bridal_status,
            'dueDate' => null, // Future enhancement
        ];

        // Add user info
        if ($order->relationLoaded('user') && $order->user) {
            $out['user'] = [
                'id' => $order->user->id,
                'name' => $order->user->name,
                'email' => $order->user->email,
            ];
            $out['customerName'] = $order->user->name;
        } else {
            $out['user'] = null;
            $out['customerName'] = 'Misafir';
        }

        // Add full details if requested
        if ($full) {
            $out['shipping_address'] = $order->shipping_address_json;
            $out['billing_address'] = $order->billing_address_json;

            if ($order->relationLoaded('orderStores')) {
                $out['order_stores'] = $order->orderStores->map(function ($orderStore) {
                    return [
                        'id' => $orderStore->id,
                        'store_id' => $orderStore->store_id,
                        'subtotal' => (float) $orderStore->subtotal,
                        'items_count' => $orderStore->relationLoaded('orderItems')
                            ? $orderStore->orderItems->count()
                            : 0,
                    ];
                })->toArray();
            }

            if ($order->relationLoaded('payments')) {
                $out['payments'] = $order->payments->map(function ($payment) {
                    return [
                        'id' => $payment->id,
                        'amount' => (float) $payment->amount,
                        'status' => $payment->status,
                        'provider' => $payment->provider,
                        'created_at' => $payment->created_at?->toIso8601String(),
                    ];
                })->toArray();
            }
        }

        return $out;
    }
}
