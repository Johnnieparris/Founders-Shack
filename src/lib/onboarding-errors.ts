/**
 * Supabase / Node use `fetch` internally. Network/DNS/SSL/TLS issues surface as
 * `TypeError: fetch failed` with little detail — unwrap `cause` when present.
 */
export function describeFetchError(err: unknown): string {
  if (!(err instanceof Error)) return String(err);

  const base = err.message;
  const cause = err.cause;
  if (cause instanceof Error) {
    return `${base} (${cause.message})`;
  }
  if (typeof cause === "string") {
    return `${base} (${cause})`;
  }

  if (base.includes("fetch failed")) {
    return `${base} — Often: wrong SUPABASE_URL, offline/VPN/firewall, or invalid SSL. Check .env and that you can reach your project in the browser.`;
  }

  return base;
}

/** When Supabase returns `{ error }` (not thrown), network issues can still look like DB errors. */
export function isLikelySupabaseNetworkError(message: string): boolean {
  return /fetch failed|TypeError|network|ECONN|ENOTFOUND|ETIMEDOUT|ECONNREFUSED|getaddrinfo|certificate|SSL|TLS|UND_ERR|socket|aborted/i.test(
    message,
  );
}

/**
 * Human hint for the `{ error }` object from `.insert()` / `.update()`.
 * Avoids blaming the table schema when the real issue is HTTPS/DNS/env.
 */
export function supabaseClientErrorHint(message: string): string {
  if (isLikelySupabaseNetworkError(message)) {
    return [
      "This is usually a connection problem, not your table columns.",
      "Use SUPABASE_URL = https://YOUR_PROJECT.supabase.co (Project Settings → API). Do not use the postgres:// DATABASE_URL here.",
      "Paste SUPABASE_SERVICE_ROLE_KEY (service_role) from the same page. Restart dev server after saving .env.",
    ].join(" ");
  }
  return [
    "If this is a real SQL/RLS error: ensure columns name, country (NOT NULL), university, major, year_level (nullable), and that RLS allows inserts if enabled.",
  ].join(" ");
}
