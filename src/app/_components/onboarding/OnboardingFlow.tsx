"use client";

import { useEffect, useState } from "react";

import {
  COUNTRIES,
  getInterestsForDegreeMajor,
  UNIVERSITIES,
  UNSW_DEGREES,
  UNSW_DEGREE_MAJORS,
  YEAR_LEVELS,
} from "~/lib/onboarding-options";
import {
  clearStoredOnboardingUserId,
  getStoredOnboardingUserId,
  setStoredOnboardingUserId,
} from "~/lib/onboarding-storage";
import { GlassSelect } from "./GlassSelect";
import { InterestTagPicker } from "./InterestTagPicker";

const inputClass =
  "w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-3.5 py-2.5 text-[13px] text-white/85 placeholder:text-white/25 outline-none transition-all duration-150 focus:border-violet-400/20 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.06)]";

type Step = 1 | 2 | 3;

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
  if (typeof details === "number" || typeof details === "boolean") {
    return String(details);
  }
  return undefined;
}

export function OnboardingFlow() {
  const [step, setStep] = useState<Step>(1);
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [university, setUniversity] = useState("");
  const [degree, setDegree] = useState("");
  const [major, setMajor] = useState("");
  const [yearLevel, setYearLevel] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
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

  function goBack() {
    if (step === 2) {
      clearStoredOnboardingUserId();
      setUserId(null);
      setStep(1);
    } else if (step === 3) {
      setStep(2);
    }
    setError(null);
  }

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

  function handleStep2Continue(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!university || !degree || !yearLevel) {
      setError("Please select university, degree, and year level.");
      return;
    }
    const degreeMajors = UNSW_DEGREE_MAJORS[degree] ?? [];
    if (degreeMajors.length > 0 && !major) {
      setError("Please select a major for your degree.");
      return;
    }
    setStep(3);
  }

  async function handleStep3(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const id = userId ?? null;
    if (!id) {
      setError("Missing user id. Go back to step 1.");
      return;
    }
    if (interests.length < 3) {
      setError("Please select at least 3 career interests.");
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
          degree,
          major: major || "N/A",
          year_level: yearLevel,
          interests,
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: id }),
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

  const countryOptions = COUNTRIES.map((c) => ({ value: c, label: c }));
  const universityOptions = UNIVERSITIES.map((u) => ({ value: u, label: u }));
  const degreeOptions = UNSW_DEGREES.map((d) => ({ value: d, label: d }));
  const majorOptions = (UNSW_DEGREE_MAJORS[degree] ?? []).map((m) => ({
    value: m,
    label: m,
  }));
  const yearOptions = YEAR_LEVELS.map((y) => ({
    value: y.value,
    label: y.label,
  }));

  return (
    <div className="relative">
      {/* Card glow behind */}
      <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-b from-violet-500/[0.12] via-purple-500/[0.06] to-transparent blur-sm" />

      <div className="relative rounded-2xl border border-white/[0.1] bg-white/[0.04] p-6 shadow-[0_8px_40px_rgba(0,0,0,0.4),0_0_80px_rgba(139,92,246,0.04)] backdrop-blur-2xl sm:p-8">
        {/* Step indicator */}
        <div className="mb-6">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className={`h-1 w-8 rounded-full transition-colors duration-300 ${step >= 1 ? "bg-violet-400/70" : "bg-white/[0.08]"}`} />
              <div className={`h-1 w-8 rounded-full transition-colors duration-300 ${step >= 2 ? "bg-violet-400/70" : "bg-white/[0.08]"}`} />
              <div className={`h-1 w-8 rounded-full transition-colors duration-300 ${step >= 3 ? "bg-violet-400/70" : "bg-white/[0.08]"}`} />
            </div>
            <span className="text-[11px] font-medium text-white/25">
              {step}/3
            </span>
          </div>

          <h1 className="text-xl font-semibold tracking-tight text-white/90">
            {step === 1
              ? "Welcome"
              : step === 2
                ? "Your studies"
                : "Career interests"}
          </h1>
          <p className="mt-1 text-[13px] text-white/35">
            {step === 1
              ? "Let\u2019s start with the basics"
              : step === 2
                ? "Tell us about your degree"
                : "Select interests to personalise your feed"}
          </p>
        </div>

        {error ? (
          <div
            className="mb-5 rounded-lg border border-red-500/15 bg-red-500/[0.06] px-3.5 py-2.5 text-[13px] text-red-300/80"
            role="alert"
          >
            {error}
          </div>
        ) : null}

        {/* Step 1 */}
        {step === 1 ? (
          <form onSubmit={handleStep1} className="flex flex-col gap-3.5">
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-[11px] font-medium uppercase tracking-widest text-white/35"
              >
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
            <GlassSelect
              id="country"
              label="Country"
              placeholder="Select country"
              options={countryOptions}
              value={country}
              onChange={setCountry}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="mt-3 w-full rounded-lg bg-white py-3 text-[13px] font-medium text-black shadow-[0_0_24px_rgba(139,92,246,0.12)] transition-all duration-200 hover:bg-white/95 hover:shadow-[0_0_32px_rgba(139,92,246,0.18)] disabled:opacity-40"
            >
              {loading ? "Saving\u2026" : "Continue"}
            </button>
          </form>
        ) : step === 2 ? (
          /* Step 2 */
          <form onSubmit={handleStep2Continue} className="flex flex-col gap-3.5">
            <GlassSelect
              id="university"
              label="University"
              placeholder="Select university"
              options={universityOptions}
              value={university}
              onChange={setUniversity}
              disabled={loading}
            />
            <GlassSelect
              id="degree"
              label="Degree"
              placeholder="Select degree"
              options={degreeOptions}
              value={degree}
              onChange={(val) => {
                setDegree(val);
                setMajor("");
              }}
              disabled={loading}
            />
            {degree && majorOptions.length > 0 && (
              <GlassSelect
                id="major"
                label="Major"
                placeholder="Select major"
                options={majorOptions}
                value={major}
                onChange={setMajor}
                disabled={loading}
              />
            )}
            <GlassSelect
              id="year_level"
              label="Year level"
              placeholder="Select year"
              options={yearOptions}
              value={yearLevel}
              onChange={setYearLevel}
              disabled={loading}
            />
            <div className="mt-3 flex items-center gap-2.5">
              <button
                type="button"
                onClick={goBack}
                disabled={loading}
                className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-[13px] font-medium text-white/40 transition-all duration-150 hover:border-white/[0.12] hover:bg-white/[0.06] hover:text-white/60 disabled:opacity-40"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-lg bg-white py-3 text-[13px] font-medium text-black shadow-[0_0_24px_rgba(139,92,246,0.12)] transition-all duration-200 hover:bg-white/95 hover:shadow-[0_0_32px_rgba(139,92,246,0.18)] disabled:opacity-40"
              >
                Continue
              </button>
            </div>
          </form>
        ) : (
          /* Step 3 - Career interests */
          <form onSubmit={handleStep3} className="flex flex-col gap-3.5">
            <InterestTagPicker
              options={getInterestsForDegreeMajor(degree, major || undefined)}
              selected={interests}
              onChange={setInterests}
              minCount={3}
              maxCount={5}
              disabled={loading}
            />
            <div className="mt-3 flex items-center gap-2.5">
              <button
                type="button"
                onClick={goBack}
                disabled={loading}
                className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-[13px] font-medium text-white/40 transition-all duration-150 hover:border-white/[0.12] hover:bg-white/[0.06] hover:text-white/60 disabled:opacity-40"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading || interests.length < 3}
                className="flex-1 rounded-lg bg-white py-3 text-[13px] font-medium text-black shadow-[0_0_24px_rgba(139,92,246,0.12)] transition-all duration-200 hover:bg-white/95 hover:shadow-[0_0_32px_rgba(139,92,246,0.18)] disabled:opacity-40"
              >
                {loading ? "Finishing…" : "Get started"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
