import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { ONBOARDING_COMPLETE_COOKIE } from "~/lib/onboarding-cookie";

export async function POST() {
  const store = await cookies();
  store.set(ONBOARDING_COMPLETE_COOKIE, "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 400,
  });

  return NextResponse.json({ ok: true });
}
