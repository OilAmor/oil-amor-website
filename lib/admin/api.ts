/**
 * Admin API fetch helper
 * Cookies are sent automatically; no client-side secrets needed.
 */

export async function adminFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  return fetch(input, {
    ...init,
    credentials: 'include',
  })
}
