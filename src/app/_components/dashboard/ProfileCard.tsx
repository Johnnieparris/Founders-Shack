"use client";

interface ProfileCardProps {
  name: string | null | undefined;
  image: string | null | undefined;
  degree?: string;
  year?: number;
}

export function ProfileCard({ name, image, degree, year }: ProfileCardProps) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-[#1E1E1E] p-5">
      <div className="flex items-center gap-4">
        <div className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-zinc-700 bg-zinc-800 shadow-[var(--shadow-dashboard-inset)]">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt={name ?? "Profile"}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-zinc-400">
              {name?.[0] ?? "?"}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-zinc-100">
            {name ?? "Student"}
          </p>
          {(degree != null && degree !== "") || year != null ? (
            <p className="text-sm text-zinc-400">
              {[degree, year ? `Year ${year}` : null].filter(Boolean).join(" · ")}
            </p>
          ) : null}
        </div>
      </div>
      <a
        href="#"
        className="mt-4 block text-center text-sm font-medium text-indigo-400 hover:text-indigo-300"
      >
        Edit profile
      </a>
    </div>
  );
}
