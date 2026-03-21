import { DashboardClient } from "~/app/_components/dashboard";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

export default async function DashboardPage() {
  const session = await auth();
  void api.dashboard.getFeed.prefetch({ category: "events" });

  return (
    <HydrateClient>
      <main>
        <div className="mx-auto max-w-7xl px-6 py-8">
          <DashboardClient session={session} />
        </div>
      </main>
    </HydrateClient>
  );
}
