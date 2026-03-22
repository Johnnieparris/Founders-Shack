"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

import {
  clearStoredOnboardingUserId,
  getStoredOnboardingUserId,
} from "~/lib/onboarding-storage";

const cardClass =
  "rounded-xl border border-zinc-800 bg-[#1E1E1E] p-6 shadow-[var(--shadow-dashboard-card-dark)]";

const labelClass = "text-xs font-medium uppercase tracking-wide text-zinc-500";
const valueClass = "mt-1 text-sm text-zinc-100";

type OnboardingUserRow = {
  id: string;
  created_at: string;
  name: string;
  country: string;
  university: string | null;
  major: string | null;
  year_level: string | null;
};

function formatYearLevel(value: string | null) {
  if (!value) return "—";
  const map: Record<string, string> = {
    "1": "Year 1",
    "2": "Year 2",
    "3": "Year 3",
    "4": "Year 4",
    honours: "Honours",
    postgrad: "Postgraduate",
  };
  return map[value] ?? value;
}

export function ProfileView() {
  const { data: session, status } = useSession();
  const [onboardingUser, setOnboardingUser] = useState<
    OnboardingUserRow | null | undefined
  >(undefined);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    const load = async () => {
      const id = getStoredOnboardingUserId();
      if (!id) {
        setOnboardingUser(null);
        return;
      }
      try {
        const res = await fetch(
          `/api/profile/onboarding-user?id=${encodeURIComponent(id)}`,
        );
        const data = (await res.json()) as { user?: OnboardingUserRow | null };
        setOnboardingUser(data.user ?? null);
      } catch {
        setOnboardingUser(null);
      }
    };
    void load();
  }, []);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await fetch("/api/onboarding/reset", { method: "POST" });
      clearStoredOnboardingUserId();
      if (session) {
        await signOut({ callbackUrl: "/onboarding" });
      } else {
        window.location.href = "/onboarding";
      }
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-6 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Profile
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Your account and onboarding details
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard"
            className="rounded-full border border-zinc-600 px-5 py-2.5 text-sm font-semibold text-zinc-200 transition hover:bg-zinc-800"
          >
            Back to dashboard
          </Link>
          <button
            type="button"
            onClick={() => void handleSignOut()}
            disabled={signingOut}
            className="rounded-full border border-red-900/60 bg-red-950/30 px-5 py-2.5 text-sm font-semibold text-red-200 transition hover:bg-red-950/50 disabled:opacity-50"
          >
            {signingOut ? "Signing out…" : "Sign out"}
          </button>
        </div>
      </div>

      <section className={cardClass}>
        <h2 className="mb-4 text-lg font-semibold text-white">
          Account (Discord)
        </h2>
        {status === "loading" ? (
          <p className="text-sm text-zinc-500">Loading session…</p>
        ) : session?.user ? (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-zinc-700 bg-zinc-800">
              {session.user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={session.user.image}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xl font-semibold text-zinc-400">
                  {session.user.name?.[0] ?? "?"}
                </div>
              )}
            </div>
            <dl className="min-w-0 flex-1 space-y-3">
              <div>
                <dt className={labelClass}>Display name</dt>
                <dd className={valueClass}>{session.user.name ?? "—"}</dd>
              </div>
              <div>
                <dt className={labelClass}>Email</dt>
                <dd className={valueClass}>{session.user.email ?? "—"}</dd>
              </div>
              <div>
                <dt className={labelClass}>User ID</dt>
                <dd className={`${valueClass} font-mono text-xs text-zinc-400`}>
                  {session.user.id}
                </dd>
              </div>
            </dl>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-zinc-400">
              You’re not signed in with Discord. Sign in to link your account.
            </p>
            <button
              type="button"
              onClick={() => void signIn("discord", { callbackUrl: "/profile" })}
              className="rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-dashboard-button)] transition hover:bg-indigo-500"
            >
              Sign in with Discord
            </button>
          </div>
        )}
      </section>

      <section className={cardClass}>
        <h2 className="mb-4 text-lg font-semibold text-white">
          Career profile (onboarding)
        </h2>
        {onboardingUser === undefined ? (
          <p className="text-sm text-zinc-500">Loading…</p>
        ) : onboardingUser === null ? (
          <p className="text-sm text-zinc-400">
            No onboarding record found on this device. Complete onboarding to
            save your study details to your profile.
          </p>
        ) : (
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className={labelClass}>Name</dt>
              <dd className={valueClass}>{onboardingUser.name}</dd>
            </div>
            <div>
              <dt className={labelClass}>Country</dt>
              <dd className={valueClass}>{onboardingUser.country}</dd>
            </div>
            <div>
              <dt className={labelClass}>University</dt>
              <dd className={valueClass}>
                {onboardingUser.university ?? "—"}
              </dd>
            </div>
            <div>
              <dt className={labelClass}>Major</dt>
              <dd className={valueClass}>{onboardingUser.major ?? "—"}</dd>
            </div>
            <div>
              <dt className={labelClass}>Year level</dt>
              <dd className={valueClass}>
                {formatYearLevel(onboardingUser.year_level)}
              </dd>
            </div>
            <div>
              <dt className={labelClass}>Record ID</dt>
              <dd className={`${valueClass} font-mono text-xs break-all text-zinc-400`}>
                {onboardingUser.id}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className={labelClass}>Created</dt>
              <dd className={valueClass}>
                {new Date(onboardingUser.created_at).toLocaleString()}
              </dd>
            </div>
          </dl>
        )}
      </section>
    </div>
  );
}
