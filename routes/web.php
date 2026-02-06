<?php

use App\Http\Controllers\Admin\AdminCategoryController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminOrderController;
use App\Http\Controllers\Admin\AdminProductController;
use App\Http\Controllers\Admin\AdminStoreController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CollectionController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\StoreController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Sanctum\Http\Controllers\CsrfCookieController;

// Locale Switcher
Route::post('/locale', function (Illuminate\Http\Request $request) {
    $request->validate([
        'locale' => 'required|string|in:tr,en,de,ar',
    ]);

    session(['locale' => $request->locale]);

    return back();
})->name('locale.set');

// Log missing translation keys
Route::post('/api/i18n/missing', function (Illuminate\Http\Request $request) {
    $key = $request->input('key');
    $locale = $request->input('locale');

    if ($key && $locale) {
        \Illuminate\Support\Facades\Log::build([
            'driver' => 'single',
            'path' => storage_path('logs/i18n-missing-keys.log'),
        ])->warning("Missing translation: {$key} ({$locale})");
    }

    return response()->noContent();
});

// Sanctum SPA CSRF cookie (same-origin / stateful auth)
Route::get('/sanctum/csrf-cookie', [CsrfCookieController::class, 'show'])
    ->middleware('web')
    ->name('sanctum.csrf-cookie');

// Home route - use HomeController
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/category/{categorySlug}', [HomeController::class, 'index'])->name('home.category');

// Collections/Categories
Route::get('/collections', [CollectionController::class, 'index'])->name('collections.index');
Route::get('/collections/{category}', [CollectionController::class, 'index'])->name('collections.show');

// Store Routes
Route::get('/stores', [StoreController::class, 'index'])->name('stores.index');
Route::get('/stores/{slug}', [StoreController::class, 'show'])->name('stores.show');

// Cart Routes
Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
Route::post('/cart', [CartController::class, 'store'])->name('cart.store');
Route::put('/cart/{item}', [CartController::class, 'update'])->name('cart.update');
Route::delete('/cart/{item}', [CartController::class, 'destroy'])->name('cart.destroy');

// Legal Pages
Route::get('/legal/terms', fn () => Inertia::render('legal/Terms'))->name('legal.terms');
Route::get('/legal/privacy', fn () => Inertia::render('legal/Privacy'))->name('legal.privacy');
Route::get('/legal/kvkk', fn () => Inertia::render('legal/KVKK'))->name('legal.kvkk');
Route::get('/legal/cookies', fn () => Inertia::render('legal/Cookies'))->name('legal.cookies');
Route::get('/legal/distance-sales', fn () => Inertia::render('legal/DistanceSales'))->name('legal.distance-sales');
Route::get('/legal/seller-agreement', fn () => Inertia::render('legal/SellerAgreement'))->name('legal.seller-agreement');

// Help Pages
Route::get('/help/how-to-order', fn () => Inertia::render('help/HowToOrder'))->name('help.how-to-order');
Route::get('/help/payment', fn () => Inertia::render('help/Payment'))->name('help.payment');
Route::get('/help/shipping', fn () => Inertia::render('help/Shipping'))->name('help.shipping');
Route::get('/help/returns', fn () => Inertia::render('help/Returns'))->name('help.returns');
Route::get('/help/faq', fn () => Inertia::render('help/FAQ'))->name('help.faq');
Route::get('/help/contact', fn () => Inertia::render('help/Contact'))->name('help.contact');

// Seller Pages
Route::get('/become-seller', fn () => Inertia::render('seller/BecomeSeller'))->name('become-seller');
Route::get('/seller/commissions', fn () => Inertia::render('seller/Commissions'))->name('seller.commissions');

// Checkout Route
Route::get('/checkout', function () {
    return Inertia::render('Checkout/Index');
})->name('checkout');

// Admin panel (Vue SPA) - sadece admin rolü; product route'tan önce tanımlanmalı
Route::middleware(['auth', 'user.type:admin'])->group(function () {
    Route::get('admin', fn () => view('admin'))->name('admin');
    Route::get('admin/{any}', fn () => view('admin'))->where('any', '.*')->name('admin.any');

    // Admin API (JSON) - admin SPA bu endpoint'leri kullanır; Inertia yok
    Route::prefix('api')->group(function () {
        Route::get('dashboard/summary', [AdminDashboardController::class, 'summary']);
        Route::get('orders', [AdminOrderController::class, 'index']);
        Route::get('orders/{id}', [AdminOrderController::class, 'show']);
        Route::patch('orders/{id}/status', [AdminOrderController::class, 'updateStatus']);
        Route::get('categories', [AdminCategoryController::class, 'index']);
        Route::get('stores', [AdminStoreController::class, 'index']);
        Route::put('stores/reorder', [AdminStoreController::class, 'reorder']);
        Route::get('stores/{id}', [AdminStoreController::class, 'show']);
        Route::post('stores', [AdminStoreController::class, 'store']);
        Route::put('stores/{id}', [AdminStoreController::class, 'update']);
        Route::delete('stores/{id}', [AdminStoreController::class, 'destroy']);
        Route::get('products', [AdminProductController::class, 'index']);
        Route::get('products/{id}', [AdminProductController::class, 'show']);
        Route::post('products', [AdminProductController::class, 'store']);
        Route::put('products/{id}', [AdminProductController::class, 'update']);
        Route::delete('products/{id}', [AdminProductController::class, 'destroy']);
        Route::patch('products/{id}/stock', [AdminProductController::class, 'updateStock']);

        Route::get('sellers', [\App\Http\Controllers\Admin\AdminSellerController::class, 'index']);
        Route::get('sellers/{id}', [\App\Http\Controllers\Admin\AdminSellerController::class, 'show']);
        Route::get('sellers/{id}', [\App\Http\Controllers\Admin\AdminSellerController::class, 'show']);

        Route::apiResource('banners', \App\Http\Controllers\Admin\AdminBannerController::class);
        Route::patch('banners/{banner}/toggle', [\App\Http\Controllers\Admin\AdminBannerController::class, 'toggle']);
    });
});

// Dashboard: admin → admin panel, diğerleri → ana sayfa
Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        $user = auth()->user();
        if ($user && ($user->type ?? '') === 'admin') {
            return redirect()->route('admin');
        }

        return redirect()->route('home');
    })->name('dashboard');

    Route::get('vendor', fn () => redirect()->route('home'))
        ->middleware('user.type:seller')
        ->name('vendor');
});

// Product routes (store-scoped) - must be last due to wildcard
Route::get('/{store}/{product}', [ProductController::class, 'show'])
    ->where('store', '^(?!api|admin|sanctum|settings|_debugbar|_ignition).*$')
    ->name('product.show');

require __DIR__.'/settings.php';
