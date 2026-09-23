import type { JsonObject } from "#shared/json.js";

/** A provider-owned sandbox that a workflow child may borrow for its session. */
export type SandboxAttachment = JsonObject & {
  readonly provider: "vercel";
  readonly name: string;
};

export function readSandboxAttachment(value: unknown): SandboxAttachment | undefined {
  if (value === undefined) return undefined;
  if (
    typeof value !== "object" ||
    value === null ||
    !("provider" in value) ||
    value.provider !== "vercel" ||
    !("name" in value) ||
    typeof value.name !== "string" ||
    value.name.trim() === ""
  ) {
    throw new TypeError("agent() `sandbox` must be a VercelSandbox.attach() reference.");
  }
  return { provider: "vercel", name: value.name };
}
