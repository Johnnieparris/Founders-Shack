import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { ONBOARDING_COMPLETE_COOKIE } from "~/lib/onboarding-cookie";

/** Clears onboarding completion so the user can go through onboarding again. */
export async function POST() {
  const store = await cookies();
  store.set(ONBOARDING_COMPLETE_COOKIE, "", {
    maxAge: 0,
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return NextResponse.json({ ok: true });
}
