<?php

namespace App\Http\Responses;

use Illuminate\Contracts\Support\Responsable;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class LoginResponse implements Responsable
{
    public function toResponse($request): Response
    {
        $user = $request->user();

        if ($user && method_exists($user, 'isAdmin') && $user->isAdmin()) {
            return Inertia::location('/admin/');
        }

        if ($user && method_exists($user, 'isVendor') && $user->isVendor()) {
            return Inertia::location(route('vendor'));
        }

        return Inertia::location(route('dashboard'));
    }
}
