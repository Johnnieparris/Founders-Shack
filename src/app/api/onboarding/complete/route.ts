import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import {
  ONBOARDING_COMPLETE_COOKIE,
  ONBOARDING_USER_ID_COOKIE,
} from "~/lib/onboarding-cookie";

const bodySchema = z.object({
  userId: z.string().uuid().optional(),
});

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 400,
};

export async function POST(request: Request) {
  const store = await cookies();
  store.set(ONBOARDING_COMPLETE_COOKIE, "true", cookieOptions);

  try {
    const json = (await request.json().catch(() => ({}))) as unknown;
    const parsed = bodySchema.safeParse(json);
    if (parsed.success && parsed.data.userId) {
      store.set(ONBOARDING_USER_ID_COOKIE, parsed.data.userId, cookieOptions);
    }
  } catch {
    // Ignore body parse errors; complete cookie is set above
  }

  return NextResponse.json({ ok: true });
}
