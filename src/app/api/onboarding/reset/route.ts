import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  ONBOARDING_COMPLETE_COOKIE,
  ONBOARDING_USER_ID_COOKIE,
} from "~/lib/onboarding-cookie";

const clearOptions = {
  maxAge: 0,
  path: "/",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
};

/** Clears onboarding completion so the user can go through onboarding again. */
export async function POST() {
  const store = await cookies();
  store.set(ONBOARDING_COMPLETE_COOKIE, "", clearOptions);
  store.set(ONBOARDING_USER_ID_COOKIE, "", clearOptions);

  return NextResponse.json({ ok: true });
}
