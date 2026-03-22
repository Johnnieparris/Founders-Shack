import type { ZodError } from "zod";

/** Turns Zod `flatten()` output into a single readable string for API responses / UI. */
export function formatZodError(error: ZodError): string {
  const flat = error.flatten();
  const parts: string[] = [...flat.formErrors];
  for (const [key, messages] of Object.entries(flat.fieldErrors)) {
    if (messages?.length) {
      parts.push(`${key}: ${messages.join(", ")}`);
    }
  }
  return parts.join("; ") || error.message;
}
