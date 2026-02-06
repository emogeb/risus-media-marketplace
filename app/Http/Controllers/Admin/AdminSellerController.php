<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminSellerController extends Controller
{
    /**
     * List sellers (paginated).
     */
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'page' => 'sometimes|integer|min:1',
            'pageSize' => 'sometimes|integer|min:1|max:100',
            'q' => 'sometimes|nullable|string|max:255',
            'status' => 'sometimes|nullable|in:active,inactive',
        ]);

        $query = User::query()
            ->where('type', User::TYPE_SELLER)
            ->with(['stores', 'sellerProfile']);

        if ($request->filled('q')) {
            $q = $request->q;
            $query->where(function ($query) use ($q) {
                $query->where('name', 'like', "%{$q}%")
                    ->orWhere('email', 'like', "%{$q}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $perPage = (int) $request->input('pageSize', 10);
        $paginator = $query->latest()->paginate($perPage);

        $items = $paginator->getCollection()->map(fn (User $user) => $this->sellerToApi($user));

        return response()->json([
            'data' => $items,
            'total' => $paginator->total(),
            'page' => $paginator->currentPage(),
            'pageSize' => $paginator->perPage(),
        ]);
    }

    /**
     * Get single seller detail.
     */
    public function show(string $id): JsonResponse
    {
        $seller = User::where('type', User::TYPE_SELLER)
            ->with(['stores', 'sellerProfile'])
            ->findOrFail((int) $id);

        return response()->json($this->sellerToApi($seller));
    }

    /**
     * Helper to format seller for API.
     */
    private function sellerToApi(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'status' => $user->status,
            'companyName' => $user->sellerProfile?->company_name,
            'taxNumber' => $user->sellerProfile?->tax_number,
            'phone' => $user->sellerProfile?->phone ?? $user->stores->first()?->phone,
            'totalProducts' => $user->stores->sum(fn ($s) => $s->products()->count()),
            'createdAt' => $user->created_at?->toIso8601String(),
            'stores' => $user->stores->map(fn ($s) => [
                'id' => $s->id,
                'name' => $s->name,
                'slug' => $s->slug,
            ]),
        ];
    }
}
