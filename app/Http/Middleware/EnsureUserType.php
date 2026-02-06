<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserType
{
    /**
     * Allow only users with the given type(s). Admin her zaman geçer (tüm yetki).
     * Usage: ->middleware('user.type:admin') or ->middleware('user.type:vendor')
     */
    public function handle(Request $request, Closure $next, string ...$types): Response
    {
        if (! $request->user()) {
            return redirect()->route('login');
        }

        if ($request->user()->isAdmin()) {
            return $next($request);
        }

        $allowed = count($types) > 0 ? array_merge(...array_map(fn (string $t) => explode(',', $t), $types)) : [User::TYPE_ADMIN];
        $allowed = array_map('trim', $allowed);
        $userType = $request->user()->type ?? User::TYPE_CUSTOMER;

        if (! in_array($userType, $allowed, true)) {
            return redirect()->to('/dashboard');
        }

        return $next($request);
    }
}
