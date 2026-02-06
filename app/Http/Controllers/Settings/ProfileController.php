<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileDeleteRequest;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user()->load('customerProfile');

        // Orders verisini çek (Pagination ile)
        $orders = $user->orders()->latest()->paginate(10);

        // TODO: Implement favorites, activity logs, recently viewed
        $favorites = []; // Placeholder
        $activityLogs = []; // Placeholder
        $recentlyViewed = []; // Placeholder (or from session/localStorage)

        return Inertia::render('settings/Profile', [
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
            'user' => $user,
            'orders' => $orders,
            'favorites' => $favorites,
            'activity_logs' => $activityLogs,
            'recently_viewed' => $recentlyViewed,
        ]);
    }

    /**
     * Update the user's profile settings.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        // Update Corporate Info (Customer Profile)
        $validated = $request->validated();
        if (array_key_exists('company_name', $validated) || array_key_exists('tax_number', $validated)) {
            $request->user()->customerProfile()->updateOrCreate(
                ['user_id' => $request->user()->id],
                [
                    'company_name' => $validated['company_name'] ?? null,
                    'tax_number' => $validated['tax_number'] ?? null,
                    // Eğer corporate olduğunu belirtmek gerekirse customer_type eklenebilir
                    // 'customer_type' => 'corporate'
                ]
            );
        }

        return to_route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(ProfileDeleteRequest $request): RedirectResponse
    {
        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
