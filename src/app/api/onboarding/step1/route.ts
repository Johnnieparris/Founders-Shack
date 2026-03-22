import { NextResponse } from "next/server";
import { z } from "zod";

import {
  describeFetchError,
  supabaseClientErrorHint,
} from "~/lib/onboarding-errors";
import { COUNTRIES } from "~/lib/onboarding-options";
import { formatZodError } from "~/lib/zod-format";
import { createSupabaseAdmin } from "~/server/supabase/admin";

/** Matches `public.users`: `name` and `country` NOT NULL. */
const bodySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  country: z.enum(COUNTRIES as unknown as [string, ...string[]]),
});

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: formatZodError(parsed.error) },
      { status: 400 },
    );
  }

  const { name, country } = parsed.data;

  try {
    const supabase = createSupabaseAdmin();

    const { data, error } = await supabase
      .from("users")
      .insert({
        name,
        country,
      })
      .select("id")
      .single();

    if (error) {
      console.error("[onboarding step1]", error);
      return NextResponse.json(
        {
          error: error.message,
          details: error.details ?? undefined,
          hint: supabaseClientErrorHint(error.message),
        },
        { status: 500 },
      );
    }

    if (!data?.id) {
      return NextResponse.json(
        { error: "No id returned from Supabase" },
        { status: 500 },
      );
    }

    return NextResponse.json({ id: data.id as string });
  } catch (err) {
    console.error("[onboarding step1] network/throw", err);
    return NextResponse.json(
      {
        error: describeFetchError(err),
        hint:
          "Server could not reach Supabase. Verify SUPABASE_URL (https://…supabase.co) and SUPABASE_SERVICE_ROLE_KEY in .env, no extra quotes/spaces, and network access.",
      },
      { status: 500 },
    );
  }
}
