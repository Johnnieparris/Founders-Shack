export const ONBOARDING_USER_ID_KEY = "founders_shack_onboarding_user_id";

export function getStoredOnboardingUserId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(ONBOARDING_USER_ID_KEY);
  } catch {
    return null;
  }
}

export function setStoredOnboardingUserId(id: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(ONBOARDING_USER_ID_KEY, id);
  } catch {
    // ignore
  }
}

export function clearStoredOnboardingUserId(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(ONBOARDING_USER_ID_KEY);
  } catch {
    // ignore
  }
}
