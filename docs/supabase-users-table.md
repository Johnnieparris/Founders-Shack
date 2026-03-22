# `public.users` (Supabase)

Expected shape (your latest schema):

```sql
create table public.users (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  country text not null,
  university text null,
  degree text null,
  major text null,
  year_level text null,
  name text not null,
  interests text[] default '{}',
  constraint users_pkey primary key (id)
) TABLESPACE pg_default;
```

## App mapping

| Step | Columns |
|------|---------|
| 1 | `name`, `country` (both NOT NULL in DB) |
| 2 | `university`, `degree`, `major`, `year_level` |
| 3 | `interests` (array of career interest tags) |

After step 1, the new row’s `id` is returned and stored in `localStorage` as `founders_shack_onboarding_user_id`.

## Migrations

If you already created the table **without** `name`, add:

```sql
alter table public.users add column name text;

-- backfill before setting NOT NULL
update public.users set name = '' where name is null;
alter table public.users alter column name set not null;
```

(Prefer a real default or backfill strategy for existing rows.)

### Add `interests` and `degree` (for interests tag feature)

```sql
-- Add degree if not present
alter table public.users add column if not exists degree text;

-- Add interests array for career interest tags (min 3, max 5)
alter table public.users add column if not exists interests text[] default '{}';
```

## Troubleshooting: `TypeError: fetch failed`

That message usually means the **Next.js server** could not open an HTTPS connection to **Supabase** (the Supabase client uses `fetch` internally).

Check:

1. **`.env`** — `SUPABASE_URL` is exactly `https://YOUR_PROJECT.supabase.co` (no quotes, no trailing spaces, no typo).
2. **`SUPABASE_SERVICE_ROLE_KEY`** — full key from Supabase **Settings → API → service_role** (server only; never commit).
3. **Restart `npm run dev`** after changing `.env`.
4. **Network** — VPN, firewall, or corporate proxy blocking `*.supabase.co`.
5. **Node** — open Supabase dashboard in a browser on the same machine; if the site loads but the app still fails, compare URL/key again.

The onboarding API now returns a clearer message in the UI when this happens; check the terminal for `[onboarding step1] network/throw` logs too.
