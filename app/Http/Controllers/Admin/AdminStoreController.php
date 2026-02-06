<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Store;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class AdminStoreController extends Controller
{
    /**
     * List stores (paginated). JSON for admin SPA.
     */
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'page' => 'sometimes|integer|min:1',
            'pageSize' => 'sometimes|integer|min:1|max:100',
            'q' => 'sometimes|nullable|string|max:255',
            'search' => 'sometimes|nullable|string|max:255',
            'status' => 'sometimes|nullable|in:active,inactive',
        ]);

        $query = Store::query()->with('owner:id,name,email');

        $search = $request->filled('q') ? $request->q : $request->input('search');
        if ($search !== null && $search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%'.$search.'%')
                    ->orWhere('slug', 'like', '%'.$search.'%');
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $perPage = (int) $request->input('pageSize', 10);
        $paginator = $query->orderBy('created_at', 'desc')->paginate($perPage);

        $items = $paginator->getCollection()->map(fn (Store $store) => $this->storeToApi($store));

        return response()->json([
            'data' => $items,
            'total' => $paginator->total(),
            'page' => $paginator->currentPage(),
            'pageSize' => $paginator->perPage(),
        ]);
    }

    /**
     * Get single store.
     */
    public function show(string $id): JsonResponse
    {
        $store = Store::findOrFail((int) $id);

        return response()->json(['data' => $this->storeToApi($store)]);
    }

    /**
     * Create store.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:stores,slug',
            'category_ids' => 'required|array',
            'category_ids.*' => 'exists:categories,id',
            'description' => 'nullable|string|max:65535',
            'phone' => 'nullable|string|max:64',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string|max:1000',
            'logo_url' => 'nullable|string|url|max:2048',
            'status' => 'nullable|in:active,inactive',
            // Owner / Seller Info
            'owner.name' => 'required|string|max:255',
            'owner.email' => 'required|email|max:255|unique:users,email',
            'owner.tax_number' => 'required|string|max:50',
            'owner.company_name' => 'required|string|max:255',
            'hero_video' => 'nullable|file|mimes:mp4,mov,ogg,qt|max:51200', // 50MB max
            'is_featured_on_hero' => 'sometimes|boolean',
        ]);

        $store = \Illuminate\Support\Facades\DB::transaction(function () use ($validated, $request) {
            // 1. Create Seller User
            $password = \Illuminate\Support\Str::random(12);
            $user = \App\Models\User::create([
                'name' => $validated['owner']['name'],
                'email' => $validated['owner']['email'],
                'password' => \Illuminate\Support\Facades\Hash::make($password),
                'type' => \App\Models\User::TYPE_SELLER,
                'status' => 'active',
            ]);

            // 2. Create Seller Profile
            \App\Models\SellerProfile::create([
                'user_id' => $user->id,
                'company_name' => $validated['owner']['company_name'],
                'tax_number' => $validated['owner']['tax_number'],
                'phone' => $validated['phone'] ?? $validated['owner']['email'], // Fallback needed or require phone? Using store phone if avail
                'address' => $validated['address'] ?? '',
                'email' => $validated['owner']['email'],
            ]);

            // 3. Create Store
            $slug = $validated['slug'] ?? \Illuminate\Support\Str::slug($validated['name']);
            if (\App\Models\Store::where('slug', $slug)->exists()) {
                $slug = $slug.'-'.substr(uniqid(), -4);
            }

            $addressJson = null;
            if (
                ! empty($validated['address'])
                || ! empty($validated['phone'])
                || ! empty($validated['email'])
                || ! empty($validated['description'])
                || ! empty($validated['logo_url'])
            ) {
                $addressJson = array_filter([
                    'address' => $validated['address'] ?? null,
                    'phone' => $validated['phone'] ?? null,
                    'email' => $validated['email'] ?? null,
                    'description' => $validated['description'] ?? null,
                    'logo_url' => $validated['logo_url'] ?? null,
                ]);
            }

            $store = \App\Models\Store::create([
                'owner_user_id' => $user->id,
                'name' => $validated['name'],
                'slug' => $slug,
                'address_json' => $addressJson,
                'status' => $validated['status'] ?? 'active',
                'is_featured_on_hero' => $validated['is_featured_on_hero'] ?? false,
            ]);

            if ($request->hasFile('hero_video')) {
                $path = $request->file('hero_video')->store('hero-videos', 'public');
                $store->hero_video = $path;
                $store->save();
            }

            // 4. Attach Categories
            $store->categories()->sync($validated['category_ids']);

            return $store;
        });

        return response()->json(['data' => $this->storeToApi($store)], 201);
    }

    /**
     * Update store.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $store = Store::findOrFail((int) $id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'slug' => ['sometimes', 'nullable', 'string', 'max:255', Rule::unique('stores', 'slug')->ignore($store->id)],
            'category_ids' => 'sometimes|array',
            'category_ids.*' => 'exists:categories,id',
            'description' => 'nullable|string|max:65535',
            'phone' => 'nullable|string|max:64',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string|max:1000',
            'logo_url' => 'nullable|string|url|max:2048',
            'status' => 'sometimes|in:active,inactive',
            'hero_video' => 'nullable|file|mimes:mp4,mov,ogg,qt|max:51200',
            'is_featured_on_hero' => 'sometimes|boolean',
        ]);

        if (array_key_exists('name', $validated) && ! array_key_exists('slug', $validated) && empty($store->getRawOriginal('slug'))) {
            $validated['slug'] = Str::slug($validated['name']);
        }
        if (isset($validated['slug']) && $validated['slug'] === '') {
            $validated['slug'] = Str::slug($store->name);
        }

        $addressJson = $store->address_json ?? [];
        if (is_array($addressJson)) {
            if (array_key_exists('description', $validated)) {
                $addressJson['description'] = $validated['description'];
            }
            if (array_key_exists('phone', $validated)) {
                $addressJson['phone'] = $validated['phone'];
            }
            if (array_key_exists('email', $validated)) {
                $addressJson['email'] = $validated['email'];
            }
            if (array_key_exists('address', $validated)) {
                $addressJson['address'] = $validated['address'];
            }
            if (array_key_exists('logo_url', $validated)) {
                $addressJson['logo_url'] = $validated['logo_url'];
            }
        } else {
            $addressJson = array_filter([
                'address' => $validated['address'] ?? null,
                'phone' => $validated['phone'] ?? null,
                'email' => $validated['email'] ?? null,
                'description' => $validated['description'] ?? null,
                'logo_url' => $validated['logo_url'] ?? null,
            ]);
        }

        $store->fill(array_intersect_key($validated, array_flip(['name', 'slug', 'status', 'is_featured_on_hero'])));
        $store->address_json = $addressJson ?: null;

        if ($request->hasFile('hero_video')) {
            // Delete old video if exists
            if ($store->hero_video && \Illuminate\Support\Facades\Storage::disk('public')->exists($store->hero_video)) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($store->hero_video);
            }

            $path = $request->file('hero_video')->store('hero-videos', 'public');
            $store->hero_video = $path;
        }

        $store->save();

        // Update categories if provided
        if (array_key_exists('category_ids', $validated)) {
            $store->categories()->sync($validated['category_ids']);
        }

        return response()->json(['data' => $this->storeToApi($store)]);
    }

    /**
     * Delete store (soft delete).
     */
    public function destroy(string $id): JsonResponse
    {
        $store = Store::findOrFail((int) $id);

        if ($store->hero_video && \Illuminate\Support\Facades\Storage::disk('public')->exists($store->hero_video)) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($store->hero_video);
        }

        $store->delete();

        return response()->json(['message' => 'Store deleted successfully']);
    }

    public function reorder(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|integer|exists:stores,id',
            'items.*.order' => 'required|integer',
        ]);

        foreach ($validated['items'] as $item) {
            Store::where('id', $item['id'])->update(['hero_order' => $item['order']]);
        }

        return response()->json(['message' => 'Sıralama güncellendi']);
    }

    private function storeToApi(Store $store): array
    {
        $address = is_array($store->address_json) ? $store->address_json : [];

        return [
            'id' => $store->id,
            'name' => $store->name,
            'slug' => $store->slug,
            'category_ids' => $store->categories()->pluck('categories.id')->toArray(),
            'description' => $address['description'] ?? null,
            'phone' => $address['phone'] ?? null,
            'email' => $address['email'] ?? null,
            'address' => $address['address'] ?? null,
            'logo_url' => $address['logo_url'] ?? null,
            'status' => $store->status,
            'created_at' => $store->created_at?->toIso8601String(),
            'updated_at' => $store->updated_at?->toIso8601String(),
            'hero_video' => $store->hero_video,
            'hero_video_url' => $store->hero_video ? asset('storage/'.$store->hero_video) : null,
            'is_featured_on_hero' => $store->is_featured_on_hero,
            'hero_order' => $store->hero_order,
        ];
    }
}
