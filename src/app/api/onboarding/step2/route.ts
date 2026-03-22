import { NextResponse } from "next/server";
import { z } from "zod";

import {
  describeFetchError,
  supabaseClientErrorHint,
} from "~/lib/onboarding-errors";
import {
  UNIVERSITIES,
  UNSW_DEGREES,
  YEAR_LEVEL_VALUES,
} from "~/lib/onboarding-options";
import { formatZodError } from "~/lib/zod-format";
import { createSupabaseAdmin } from "~/server/supabase/admin";

const bodySchema = z.object({
  id: z.string().uuid("Invalid user id"),
  university: z.enum(UNIVERSITIES as unknown as [string, ...string[]]),
  degree: z.enum(UNSW_DEGREES as unknown as [string, ...string[]]),
  major: z.string().min(1, "Major is required"),
  year_level: z.enum(YEAR_LEVEL_VALUES),
});

export async function PATCH(request: Request) {
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

  const { id, university, degree, major, year_level } = parsed.data;

  try {
    const supabase = createSupabaseAdmin();

    const { error } = await supabase
      .from("users")
      .update({
        university,
        degree,
        major,
        year_level,
      })
      .eq("id", id);

    if (error) {
      console.error("[onboarding step2]", error);
      return NextResponse.json(
        {
          error: error.message,
          details: error.details ?? undefined,
          hint: supabaseClientErrorHint(error.message),
        },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[onboarding step2] network/throw", err);
    return NextResponse.json(
      {
        error: describeFetchError(err),
        hint:
          "Server could not reach Supabase. Check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.",
      },
      { status: 500 },
    );
  }
}
