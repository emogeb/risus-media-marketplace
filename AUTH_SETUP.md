# Auth entegrasyonu (Sanctum + Fortify + Inertia Vue)

## Değişen / eklenen dosyalar

### Backend
- **routes/web.php** – `/sanctum/csrf-cookie` route; `/admin`, `/vendor` (auth + `user.type` middleware).
- **config/cors.php** – Yeni: `supports_credentials = true`, `allowed_origins` env’den.
- **config/sanctum.php** – Yayınlandı (migration yok).
- **config/fortify.php** – `Features::emailVerification()` kaldırıldı.
- **app/Providers/FortifyServiceProvider.php** – `LoginResponse` binding; status kontrolü (Login event: `status !== 'active'` → logout + ValidationException).
- **app/Http/Responses/LoginResponse.php** – Yeni: intended yoksa `type` ile yönlendirme (admin → `/admin`, vendor → `/vendor`, diğer → `/dashboard`).
- **app/Actions/Fortify/CreateNewUser.php** – Kayıtta `type => 'customer'`, `status => 'active'`.
- **app/Http/Middleware/HandleInertiaRequests.php** – `auth.user` (id, name, email, type); `flash` (status, error, errors).
- **app/Http/Middleware/EnsureUserType.php** – Yeni: `user.type:admin` / `user.type:vendor` route middleware.
- **bootstrap/app.php** – `user.type` alias → `EnsureUserType`.
- **routes/settings.php** – Settings route’ları sadece `auth` (verified kaldırıldı).

### Frontend
- **resources/js/lib/csrf.ts** – Yeni: `ensureCsrfCookie()` (GET `/sanctum/csrf-cookie`, credentials: include).
- **resources/js/pages/auth/login.vue** – Yeni: email, password, remember; submit öncesi CSRF; POST `/login`.
- **resources/js/pages/auth/register.vue** – Yeni: name, email, password, password_confirmation; POST `/register`.
- **resources/js/pages/auth/forgot-password.vue** – Yeni: email; POST `/forgot-password`.
- **resources/js/pages/auth/reset-password.vue** – Yeni: token, email, password, password_confirmation; POST `/reset-password`.
- **resources/js/pages/auth/two-factor-challenge.vue** – Yeni: code veya recovery_code; POST `/two-factor-challenge`.
- **resources/js/pages/auth/verify-email.vue** – Yeni: minimal (email verification kapalı olsa da sayfa mevcut).
- **resources/js/pages/auth/confirm-password.vue** – Yeni: şifre onayı; POST `/user/confirm-password`.
- **resources/js/pages/settings/two-factor.vue** – Yeni: 2FA aç/kapat; kurtarma kodları göster / yenile (Fortify endpoint’leri).
- **resources/js/components/layout/Navbar.vue** – Giriş yoksa Login / Kayıt ol; giriş varsa Dashboard, Ayarlar, Çıkış (POST `/logout`).

---

## Config / .env

- **SESSION_DRIVER=database** – Zaten kullanılıyor.
- **SANCTUM_STATEFUL_DOMAINS** – SPA’nın çalıştığı domain’ler (virgülle ayrılmış). Örnek: `localhost,localhost:5173,127.0.0.1,127.0.0.1:5173,risus_media.test`
- **APP_URL** – Uygulama URL’i (örn. `http://risus_media.test`).
- **CORS_ALLOWED_ORIGINS** – CORS izin verilen origin’ler (virgülle ayrılmış). Credentials ile kullanım için APP_URL veya Vite origin’i ekleyin.

`.env.example` içine `SANCTUM_STATEFUL_DOMAINS` ve `CORS_ALLOWED_ORIGINS` eklendi.

---

## 2FA endpoint’leri ve UI

Fortify route’ları (migration yok):

- **POST** `/user/two-factor-authentication` – 2FA aç.
- **POST** `/user/confirmed-two-factor-authentication` – OTP ile onay (code).
- **DELETE** `/user/two-factor-authentication` – 2FA kapat.
- **GET** `/user/two-factor-recovery-codes` – Kurtarma kodlarını getir (JSON).
- **POST** `/user/two-factor-recovery-codes` – Yeni kurtarma kodları üret.

UI: **Ayarlar → İki adımlı doğrulama** (`/settings/two-factor`) – aç/kapat, kurtarma kodları göster / yenile.

---

## Redirect ve status kontrolü

- **LoginResponse** (`app/Http/Responses/LoginResponse.php`): Önce `intended`; yoksa `user.type` → admin: `/admin`, vendor: `/vendor`, diğer: `/dashboard`.
- **Status engeli** (`FortifyServiceProvider::configureStatusCheck`): `Login` event’inde `user.status !== 'active'` ise logout + `ValidationException` (“Hesabınız pasif. Giriş yapamazsınız.”).

---

## Test akışları

1. **Kayıt → giriş → dashboard**  
   Register → Login → type’a göre `/dashboard` (veya admin/vendor).
2. **2FA aç → çıkış → giriş → two-factor-challenge → dashboard**  
   Settings → 2FA aç → Logout → Login → OTP veya kurtarma kodu → dashboard.
3. **status banned**  
   DB’de kullanıcı `status = 'banned'` (veya `inactive`) → login dene → “Hesabınız pasif.” hatası.

---

## Not

- Proje **Vue 3 + Inertia + TypeScript**; auth sayfaları Vue ile yazıldı.
- Migration eklenmedi; `users`, `password_reset_tokens`, `sessions`, 2FA kolonları ve marketplace type/status zaten mevcut.
- E-posta doğrulama Fortify’de kapatıldı; dashboard ve settings için sadece `auth` middleware kullanılıyor.
