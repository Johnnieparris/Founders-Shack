import { NextResponse } from "next/server";
import { z } from "zod";

import { createSupabaseAdmin } from "~/server/supabase/admin";

/**
 * Fetches one row from public.users by id (from browser localStorage after onboarding).
 * UUIDs are unguessable; for stricter auth, link this row to NextAuth user id later.
 */
export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("id");
  const parsed = z.string().uuid().safeParse(id);
  if (!parsed.success) {
    return NextResponse.json({ error: "Valid id (uuid) required" }, { status: 400 });
  }

  try {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
      .from("users")
      .select(
        "id, created_at, name, country, university, degree, major, year_level, interests",
      )
      .eq("id", parsed.data)
      .maybeSingle();

    if (error) {
      console.error("[profile onboarding-user]", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ user: data });
  } catch (err) {
    console.error("[profile onboarding-user] throw", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Request failed" },
      { status: 500 },
    );
  }
}
