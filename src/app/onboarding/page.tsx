import { OnboardingFlow } from "~/app/_components/onboarding/OnboardingFlow";

export default function OnboardingPage() {
  return (
    <main className="flex min-h-[calc(100vh-65px)] items-center justify-center px-5 py-10 sm:py-14">
      <div className="w-full max-w-md">
        <OnboardingFlow />
      </div>
    </main>
  );
}
