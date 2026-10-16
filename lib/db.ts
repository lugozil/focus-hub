import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let client: NeonQueryFunction<false, false> | null = null;

/** Cliente SQL de Neon (solo servidor), o null si DATABASE_URL no está configurada. */
export function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  client ??= neon(url);
  return client;
}
