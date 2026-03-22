import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Get started | Career Prep",
  description: "Tell us about yourself to personalize your experience",
};

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#121212]">
      <header className="border-b border-zinc-800 bg-[#1A1A1A]/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/onboarding"
            className="text-lg font-semibold text-zinc-100 hover:text-indigo-400"
          >
            Career Prep
          </Link>
          <span className="text-sm text-zinc-500">Onboarding</span>
        </div>
      </header>
      {children}
    </div>
  );
}
