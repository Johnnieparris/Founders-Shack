import { NextResponse } from "next/server";
import { z } from "zod";

import {
  describeFetchError,
  supabaseClientErrorHint,
} from "~/lib/onboarding-errors";
import {
  getAllValidInterests,
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
  interests: z
    .array(z.string())
    .min(3, "At least 3 interests required")
    .max(5, "At most 5 interests allowed")
    .refine(
      (arr) => {
        const valid = new Set(getAllValidInterests());
        return arr.every((i) => valid.has(i));
      },
      { message: "Invalid interest selected" }
    )
    .optional(),
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

  const { id, university, degree, major, year_level, interests } =
    parsed.data;

  try {
    const supabase = createSupabaseAdmin();

    const updatePayload: Record<string, unknown> = {
      university,
      degree,
      major,
      year_level,
    };
    if (interests != null && interests.length > 0) {
      updatePayload.interests = interests;
    }

    const { error } = await supabase
      .from("users")
      .update(updatePayload)
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
