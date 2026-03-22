"use client";

import { useEffect, useState } from "react";

import {
  COUNTRIES,
  MAJORS,
  UNIVERSITIES,
  YEAR_LEVELS,
} from "~/lib/onboarding-options";
import {
  clearStoredOnboardingUserId,
  getStoredOnboardingUserId,
  setStoredOnboardingUserId,
} from "~/lib/onboarding-storage";

const inputClass =
  "w-full rounded-lg border border-zinc-700 bg-[#1E1E1E] px-4 py-3 text-zinc-100 placeholder:text-zinc-500 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500";

const labelClass = "mb-2 block text-sm font-medium text-zinc-300";

type Step = 1 | 2;

function formatApiDetails(details: unknown): string | undefined {
  if (details == null || details === "") return undefined;
  if (typeof details === "string") return details;
  if (typeof details === "object") {
    try {
      return JSON.stringify(details);
    } catch {
      return undefined;
    }
  }
  return String(details);
}

export function OnboardingFlow() {
  const [step, setStep] = useState<Step>(1);
  const [name, setName] = useState("");
  const [country, setCountry] = useState<(typeof COUNTRIES)[number] | "">("");
  const [university, setUniversity] = useState<
    (typeof UNIVERSITIES)[number] | ""
  >("");
  const [major, setMajor] = useState<(typeof MAJORS)[number] | "">("");
  const [yearLevel, setYearLevel] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const existing = getStoredOnboardingUserId();
    if (existing) {
      setUserId(existing);
      setStep(2);
    }
  }, []);

  async function handleStep1(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !country) {
      setError("Please enter your name and select a country.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/onboarding/step1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), country }),
      });
      const data = (await res.json()) as {
        id?: string;
        error?: string;
        hint?: string;
        details?: unknown;
      };
      if (!res.ok) {
        setError(
          [data.error, formatApiDetails(data.details), data.hint]
            .filter(Boolean)
            .join(" — ") || "Could not save. Try again.",
        );
        return;
      }
      if (!data.id) {
        setError("No user id returned.");
        return;
      }
      setUserId(data.id);
      setStoredOnboardingUserId(data.id);
      setStep(2);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Request failed. Is the dev server running?",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleStep2(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const id = userId ?? null;
    if (!id) {
      setError("Missing user id. Go back to step 1.");
      return;
    }
    if (!university || !major || !yearLevel) {
      setError("Please select university, major, and year level.");
      return;
    }
    setLoading(true);
    try {
      const patchRes = await fetch("/api/onboarding/step2", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          university,
          major,
          year_level: yearLevel,
        }),
      });
      const patchData = (await patchRes.json()) as {
        error?: string;
        hint?: string;
        details?: unknown;
      };
      if (!patchRes.ok) {
        setError(
          [
            patchData.error,
            formatApiDetails(patchData.details),
            patchData.hint,
          ]
            .filter(Boolean)
            .join(" — ") || "Could not update profile.",
        );
        return;
      }

      const doneRes = await fetch("/api/onboarding/complete", {
        method: "POST",
      });
      if (!doneRes.ok) {
        setError("Profile saved but could not finish onboarding. Try again.");
        return;
      }

      window.location.href = "/dashboard";
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Request failed. Is the dev server running?",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-[#1E1E1E] p-8 shadow-[var(--shadow-dashboard-card-dark)]">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            {step === 1 ? "Welcome" : "Your studies"}
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Step {step} of 2 —{" "}
            {step === 1
              ? "Your name and location"
              : "Tell us about your degree"}
          </p>
        </div>
        <div className="flex gap-1.5">
          <span
            className={`h-2 w-8 rounded-full ${step >= 1 ? "bg-indigo-600" : "bg-zinc-700"}`}
            aria-hidden
          />
          <span
            className={`h-2 w-8 rounded-full ${step >= 2 ? "bg-indigo-600" : "bg-zinc-700"}`}
            aria-hidden
          />
        </div>
      </div>

      {error ? (
        <div
          className="mb-6 rounded-lg border border-red-900/50 bg-red-950/40 px-4 py-3 text-sm text-red-200"
          role="alert"
        >
          {error}
        </div>
      ) : null}

      {step === 1 ? (
        <form onSubmit={handleStep1} className="flex flex-col gap-6">
          <div>
            <label htmlFor="name" className={labelClass}>
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className={inputClass}
              disabled={loading}
              required
            />
          </div>
          <div>
            <label htmlFor="country" className={labelClass}>
              Country
            </label>
            <select
              id="country"
              name="country"
              value={country}
              onChange={(e) =>
                setCountry(e.target.value as (typeof COUNTRIES)[number] | "")
              }
              className={inputClass}
              disabled={loading}
              required
            >
              <option value="">Select country</option>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-[var(--shadow-dashboard-button)] transition hover:bg-indigo-500 disabled:opacity-50"
          >
            {loading ? "Saving…" : "Continue"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleStep2} className="flex flex-col gap-6">
          <div>
            <label htmlFor="university" className={labelClass}>
              University
            </label>
            <select
              id="university"
              name="university"
              value={university}
              onChange={(e) =>
                setUniversity(
                  e.target.value as (typeof UNIVERSITIES)[number] | "",
                )
              }
              className={inputClass}
              disabled={loading}
            >
              <option value="">Select university</option>
              {UNIVERSITIES.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="major" className={labelClass}>
              Major
            </label>
            <select
              id="major"
              name="major"
              value={major}
              onChange={(e) =>
                setMajor(e.target.value as (typeof MAJORS)[number] | "")
              }
              className={inputClass}
              disabled={loading}
            >
              <option value="">Select major</option>
              {MAJORS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="year_level" className={labelClass}>
              Year level
            </label>
            <select
              id="year_level"
              name="year_level"
              value={yearLevel}
              onChange={(e) => setYearLevel(e.target.value)}
              className={inputClass}
              disabled={loading}
            >
              <option value="">Select year</option>
              {YEAR_LEVELS.map((y) => (
                <option key={y.value} value={y.value}>
                  {y.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={() => {
                clearStoredOnboardingUserId();
                setUserId(null);
                setStep(1);
                setError(null);
              }}
              disabled={loading}
              className="rounded-full border border-zinc-600 bg-transparent px-6 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-800 disabled:opacity-50"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-[var(--shadow-dashboard-button)] transition hover:bg-indigo-500 disabled:opacity-50 sm:min-w-[140px]"
            >
              {loading ? "Finishing…" : "Finish"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
