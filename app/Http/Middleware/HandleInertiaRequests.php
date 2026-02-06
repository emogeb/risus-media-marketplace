<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'type' => $request->user()->type ?? 'customer',
                ] : null,
            ],
            'flash' => [
                'status' => $request->session()->get('status'),
                'error' => $request->session()->get('error'),
                'errors' => $request->session()->get('errors')?->getBag('default')->getMessages() ?? [],
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'ziggy' => fn () => [
                ...(new Ziggy)->toArray(),
            ],
            'locale' => app()->getLocale(),
            'translations' => (function () {
                $locale = app()->getLocale();

                // Load English as universal base
                $enPath = base_path('lang/en.json');
                $enTranslations = file_exists($enPath) ? json_decode(file_get_contents($enPath), true) : [];

                if ($locale === 'en') {
                    return $enTranslations;
                }

                // Load Turkish as another layer if locale is not en or tr (to ensure maximum coverage)
                $trPath = base_path('lang/tr.json');
                $trTranslations = file_exists($trPath) ? json_decode(file_get_contents($trPath), true) : [];

                // Base is English + Turkish
                $baseTranslations = array_merge($enTranslations, $trTranslations);

                if ($locale === 'tr') {
                    return $baseTranslations;
                }

                // Load current locale (e.g. de, ar)
                $localePath = base_path("lang/{$locale}.json");
                if (file_exists($localePath)) {
                    $localeTranslations = json_decode(file_get_contents($localePath), true) ?? [];

                    return array_merge($baseTranslations, $localeTranslations);
                }

                return $baseTranslations;
            })(),
        ];
    }
}
