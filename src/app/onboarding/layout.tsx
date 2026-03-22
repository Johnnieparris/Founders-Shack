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
    <div className="relative min-h-screen bg-[#08080a] overflow-x-hidden">
      {/* Background glow mesh */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/2 top-[-15%] h-[700px] w-[1000px] -translate-x-1/2 rounded-full bg-violet-600/[0.07] blur-[150px]" />
        <div className="absolute right-[-15%] top-[20%] h-[500px] w-[600px] rounded-full bg-purple-500/[0.05] blur-[130px]" />
        <div className="absolute bottom-[-10%] left-[-10%] h-[450px] w-[550px] rounded-full bg-indigo-500/[0.04] blur-[120px]" />
      </div>

      {/* Noise texture overlay */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.015]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }} />

      <header className="relative z-10 border-b border-white/[0.06] backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center px-6 py-4">
          <Link
            href="/onboarding"
            className="text-sm font-medium tracking-tight text-white/50 transition hover:text-white/70"
          >
            Career Prep
          </Link>
        </div>
      </header>

      <div className="relative z-10">{children}</div>
    </div>
  );
}
