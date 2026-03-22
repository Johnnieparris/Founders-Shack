import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Profile | Career Prep",
  description: "View your profile and account settings",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#121212]">
      <header className="border-b border-zinc-800 bg-[#1A1A1A]/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/dashboard"
            className="text-lg font-semibold text-zinc-100 hover:text-indigo-400"
          >
            Career Prep
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link
              href="/dashboard"
              className="text-zinc-400 transition hover:text-zinc-200"
            >
              Dashboard
            </Link>
            <span className="font-medium text-indigo-400">Profile</span>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
