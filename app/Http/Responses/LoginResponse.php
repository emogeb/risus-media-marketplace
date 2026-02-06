<?php

namespace App\Http\Responses;

use Illuminate\Contracts\Support\Responsable;
use Symfony\Component\HttpFoundation\Response;

class LoginResponse implements Responsable
{
    public function toResponse($request): Response
    {
        $user = $request->user();

        if ($user && method_exists($user, 'isAdmin') && $user->isAdmin()) {
            return redirect()->route('admin');
        }

        if ($user && method_exists($user, 'isVendor') && $user->isVendor()) {
            return redirect()->route('vendor');
        }

        return redirect()->route('dashboard');
    }
}
