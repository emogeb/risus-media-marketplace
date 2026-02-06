<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;

class SetLocaleFromSession
{
    public function handle(Request $request, Closure $next)
    {
        $supported = ['tr', 'en', 'de', 'ar'];
        $fallback = config('app.fallback_locale', 'en');

        $locale = session('locale');

        if (! $locale) {
            $preferred = $request->getPreferredLanguage($supported);
            \Illuminate\Support\Facades\Log::info("i18n Debug: No session locale. Preferred from browser: '{$preferred}'. Supported: ".implode(',', $supported));
            $locale = $preferred ?? $fallback;
            session(['locale' => $locale]);
        }

        if (! in_array($locale, $supported, true)) {
            \Illuminate\Support\Facades\Log::warning("i18n Debug: Locale '{$locale}' not supported, falling back to '{$fallback}'");
            $locale = $fallback;
            session(['locale' => $locale]);
        }

        \Illuminate\Support\Facades\Log::info("i18n Debug: Final Locale set to '{$locale}'");
        App::setLocale($locale);

        return $next($request);
    }
}
