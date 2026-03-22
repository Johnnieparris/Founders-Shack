import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ONBOARDING_COMPLETE_COOKIE } from "~/lib/onboarding-cookie";

/** Fallback routing when `/` is hit (middleware handles the common case). */
export default async function HomePage() {
  const store = await cookies();
  if (store.get(ONBOARDING_COMPLETE_COOKIE)?.value === "true") {
    redirect("/dashboard");
  }
  redirect("/onboarding");
}
