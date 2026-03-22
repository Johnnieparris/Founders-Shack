"use client";

import Image from "next/image";
import Link from "next/link";

/* ── Floating cards — each has unique position, size, speed ─── */
const CARDS = [
  {
    title: "Google STEP Internship",
    badge: "Application",
    badgeColor: "#6ee7b7",
    badgeBg: "rgba(16,185,129,0.15)",
    accent: "rgba(16,185,129,0.4)",
    org: "Google",
    top: "14%",
    left: "3%",
    rotate: "-4deg",
    delay: "0.6s",
    duration: "7s",
    size: "lg" as const,
    side: "left" as const,
  },
  {
    title: "Women in Tech Panel",
    badge: "Event",
    badgeColor: "#a5b4fc",
    badgeBg: "rgba(99,102,241,0.15)",
    accent: "rgba(99,102,241,0.4)",
    org: "UNSW Societies",
    top: "58%",
    left: "6%",
    rotate: "-2deg",
    delay: "1.1s",
    duration: "9s",
    size: "sm" as const,
    side: "left" as const,
  },
  {
    title: "AI Research Assistant",
    badge: "Research",
    badgeColor: "#c4b5fd",
    badgeBg: "rgba(139,92,246,0.15)",
    accent: "rgba(139,92,246,0.4)",
    org: "CSE Faculty",
    top: "18%",
    right: "3%",
    rotate: "3deg",
    delay: "0.8s",
    duration: "8s",
    size: "md" as const,
    side: "right" as const,
  },
  {
    title: "Startup Career Fair",
    badge: "Career Fair",
    badgeColor: "#fcd34d",
    badgeBg: "rgba(245,158,11,0.15)",
    accent: "rgba(245,158,11,0.4)",
    org: "Founders Society",
    top: "55%",
    right: "5%",
    rotate: "2deg",
    delay: "1.3s",
    duration: "7.5s",
    size: "lg" as const,
    side: "right" as const,
  },
  {
    title: "Deloitte Grad Program",
    badge: "Application",
    badgeColor: "#6ee7b7",
    badgeBg: "rgba(16,185,129,0.15)",
    accent: "rgba(16,185,129,0.4)",
    org: "Deloitte",
    top: "38%",
    left: "1%",
    rotate: "-1deg",
    delay: "1.5s",
    duration: "8.5s",
    size: "md" as const,
    side: "left" as const,
  },
  {
    title: "Hackathon 2026",
    badge: "Event",
    badgeColor: "#a5b4fc",
    badgeBg: "rgba(99,102,241,0.15)",
    accent: "rgba(99,102,241,0.4)",
    org: "CompSoc",
    top: "40%",
    right: "2%",
    rotate: "4deg",
    delay: "1.7s",
    duration: "6.5s",
    size: "sm" as const,
    side: "right" as const,
  },
];

const SIZE_MAP = {
  sm: "w-[150px]",
  md: "w-[180px]",
  lg: "w-[210px]",
} as const;

const OPACITY_MAP = {
  sm: 0.25,
  md: 0.35,
  lg: 0.4,
} as const;

export default function LandingPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center overflow-hidden bg-[#08080a]">

      {/* ── Background — matches dashboard glow mesh ──────── */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/2 top-[8%] h-[800px] w-[1000px] -translate-x-1/2 rounded-full bg-violet-600/[0.07] blur-[150px]" />
        <div className="absolute -right-[150px] top-[50%] h-[500px] w-[500px] rounded-full bg-purple-500/[0.05] blur-[130px]" />
        <div className="absolute -left-[150px] top-[30%] h-[400px] w-[400px] rounded-full bg-indigo-500/[0.04] blur-[120px]" />
      </div>

      {/* Grid pattern */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
          animation: "gridFade 1.5s ease-out both",
        }}
      />

      {/* Noise overlay */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.015]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
        }}
      />

      {/* ── Nav — matches dashboard header ──────────────────── */}
      <nav
        className="relative z-20 flex w-full items-center justify-between border-b border-white/[0.06] px-6 py-4 backdrop-blur-sm sm:px-10 lg:px-14"
        style={{ animation: "fadeIn 0.7s ease-out both" }}
      >
        <div className="flex items-center gap-2">
          <Image
            src="/bridge_logo.png"
            alt="Bridge"
            width={120}
            height={48}
            className="h-5 w-auto opacity-60"
            priority
          />
          <span className="text-[15px] font-semibold tracking-tight text-white/50">
            Bridge
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/onboarding"
            className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-medium text-white/40 transition-all duration-150 hover:border-white/[0.12] hover:bg-white/[0.06] hover:text-white/60 active:scale-[0.98]"
          >
            Sign in
          </Link>
          <Link
            href="/onboarding"
            className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black shadow-[0_0_24px_rgba(139,92,246,0.12)] transition-all duration-150 hover:bg-white/95 hover:shadow-[0_0_32px_rgba(139,92,246,0.18)] active:scale-[0.98]"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* ── Floating cards scattered around the page ────────── */}
      {CARDS.map((card, i) => (
        <div
          key={card.title}
          className="pointer-events-none absolute z-[5] hidden lg:block"
          style={{
            top: card.top,
            left: "left" in card ? card.left : undefined,
            right: "right" in card ? card.right : undefined,
            ["--rotate" as string]: card.rotate,
            animation: `${card.side === "left" ? "slideInLeft" : "slideInRight"} 0.8s ease-out ${card.delay} both, ${i % 2 === 0 ? "float" : "floatSlow"} ${card.duration} ease-in-out ${card.delay} infinite`,
          }}
        >
          <div
            className={`${SIZE_MAP[card.size]} rounded-2xl border border-white/[0.06] p-3`}
            style={{
              opacity: OPACITY_MAP[card.size],
              background: `linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)`,
              boxShadow: `0 0 40px ${card.accent.replace("0.4", "0.06")}`,
            }}
          >
            {/* Colored top edge */}
            <div
              className="mb-2.5 h-[2px] w-8 rounded-full"
              style={{ backgroundColor: card.accent }}
            />

            {/* Badge */}
            <span
              className="inline-block rounded-full px-2 py-px text-[10px] font-medium"
              style={{ backgroundColor: card.badgeBg, color: card.badgeColor }}
            >
              {card.badge}
            </span>

            {/* Title */}
            <p className="mt-1.5 text-[13px] font-semibold leading-tight text-white/80 line-clamp-1">
              {card.title}
            </p>

            {/* Org */}
            <p className="mt-1 text-[10px] text-white/30">{card.org}</p>
          </div>
        </div>
      ))}

      {/* ── Hero center ────────────────────────────────────── */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 text-center">

        {/* Status badge */}
        <div style={{ animation: "fadeInScale 0.8s ease-out 0.2s both" }}>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-1.5 text-xs font-medium text-white/40 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Built for university students
          </span>
        </div>

        {/* Headline */}
        <h1
          className="mt-8 max-w-[800px] font-bold leading-[0.93] tracking-tight text-white/90 sm:mt-10"
          style={{
            fontSize: "clamp(2.75rem, 9vw, 6.5rem)",
            animation: "fadeIn 1s ease-out 0.3s both",
          }}
        >
          Never miss
          <br />
          <span className="text-violet-400">what matters.</span>
        </h1>

        {/* Subtitle */}
        <p
          className="mt-6 max-w-[460px] text-sm leading-[1.7] text-white/35 sm:mt-8 sm:text-base"
          style={{ animation: "fadeIn 1s ease-out 0.5s both" }}
        >
          Every career event, internship, research role, and deadline
          from across your campus — one feed, zero noise.
        </p>

        {/* CTA */}
        <div
          className="mt-10 flex items-center gap-3 sm:mt-12"
          style={{ animation: "fadeIn 1s ease-out 0.7s both" }}
        >
          <Link
            href="/onboarding"
            className="group inline-flex items-center gap-2.5 rounded-lg bg-white px-6 py-3 text-sm font-medium text-black shadow-[0_0_24px_rgba(139,92,246,0.12)] transition-all duration-150 hover:bg-white/95 hover:shadow-[0_0_32px_rgba(139,92,246,0.18)] active:scale-[0.98]"
          >
            Get started free
            <svg
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </main>

      {/* ── Bottom line ────────────────────────────────────── */}
      <div className="pointer-events-none relative z-10 h-px w-full border-t border-white/[0.04]" />
    </div>
  );
}
