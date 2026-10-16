// Sesión del dashboard: una cookie con un HMAC derivado de DASHBOARD_SECRET.
// Funciona en el runtime de Node y en el del middleware (Web Crypto).

export const DASHBOARD_COOKIE = "fh_dashboard";
export const DASHBOARD_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export async function dashboardToken(): Promise<string | null> {
  const secret = process.env.DASHBOARD_SECRET;
  if (!secret) return null;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode("focushub-dashboard-v1"));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, "0")).join("");
}

export function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
