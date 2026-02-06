<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;

class AdminBannerController extends Controller
{
    public function index()
    {
        return Banner::latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'text' => 'required|string|max:255',
            'background_color' => 'required|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'text_color' => 'required|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'is_active' => 'boolean',
            'start_time' => 'nullable|date',
            'end_time' => 'nullable|date|after_or_equal:start_time',
        ]);

        return Banner::create($validated);
    }

    public function show(Banner $banner)
    {
        return $banner;
    }

    public function update(Request $request, Banner $banner)
    {
        $validated = $request->validate([
            'text' => 'sometimes|string|max:255',
            'background_color' => 'sometimes|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'text_color' => 'sometimes|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'is_active' => 'boolean',
            'start_time' => 'nullable|date',
            'end_time' => 'nullable|date|after:start_time',
        ]);

        $banner->update($validated);

        return $banner;
    }

    public function destroy(Banner $banner)
    {
        $banner->delete();

        return response()->noContent();
    }

    public function toggle(Banner $banner)
    {
        $banner->update(['is_active' => ! $banner->is_active]);

        return $banner;
    }
}
