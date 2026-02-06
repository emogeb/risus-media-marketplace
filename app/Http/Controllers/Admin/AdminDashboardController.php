<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\ProductVariant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminDashboardController extends Controller
{
    /**
     * Dashboard summary for admin SPA. Returns totals and optional revenue series.
     */
    public function summary(Request $request): JsonResponse
    {
        $request->validate([
            'range' => 'sometimes|string|in:today,7d,30d,90d',
            'from' => 'sometimes|date',
            'to' => 'sometimes|date|after_or_equal:from',
        ]);

        $totalOrders = Order::query()->count();
        $pendingOrders = Order::query()->whereIn('status', ['pending', 'confirmed'])->count();
        $lowStockProducts = ProductVariant::query()->where('stock_quantity', '<=', 5)->distinct('product_id')->count('product_id');

        $totalRevenue = (float) Order::query()->whereNotIn('status', ['cancelled'])->sum('grand_total');

        $revenueSeries = [];
        $range = $request->input('range', '30d');
        if ($range === 'today') {
            $days = 1;
        } else {
            $days = $range === '7d' ? 7 : ($range === '90d' ? 90 : 30);
        }
        for ($i = $days - 1; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $revenue = (float) Order::query()
                ->whereDate('created_at', $date)
                ->whereNotIn('status', ['cancelled'])
                ->sum('grand_total');
            $revenueSeries[] = ['date' => $date, 'revenue' => $revenue];
        }

        return response()->json([
            'totalRevenue' => $totalRevenue,
            'totalOrders' => $totalOrders,
            'pendingOrders' => $pendingOrders,
            'lowStockProducts' => $lowStockProducts,
            'revenueGrowth' => 0,
            'ordersGrowth' => 0,
            'revenueSeries' => $revenueSeries,
        ]);
    }
}
