/**
 * Sanctum SPA: ensure CSRF cookie is set before POST (login, register, etc.)
 * Call this before Inertia router.post for auth forms to avoid 419.
 */
export async function ensureCsrfCookie(): Promise<void> {
  await fetch('/sanctum/csrf-cookie', {
    method: 'GET',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
  });
}
