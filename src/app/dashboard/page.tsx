import { DashboardClient } from "~/app/_components/dashboard";
import { api, HydrateClient } from "~/trpc/server";

export default async function DashboardPage() {
  void api.dashboard.getFeed.prefetch({ category: "events" });

  return (
    <HydrateClient>
      <main>
        <div className="mx-auto max-w-7xl px-6 py-8">
          <DashboardClient />
        </div>
      </main>
    </HydrateClient>
  );
}
