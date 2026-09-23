import type { VercelSandboxSession } from "#public/sandbox/vercel.js";
import {
  createVercelSandbox,
  createVercelSandboxProvider,
  type VercelSandboxPreparedArtifact,
  type VercelSandboxSessionState,
} from "#execution/sandbox/bindings/vercel.js";
import type {
  VercelSandboxCreateOptions,
  VercelSandboxRuntimeOptions,
} from "#public/sandbox/vercel-sandbox.js";
import type { SandboxEnvironment } from "#shared/sandbox-environment.js";
import { defineSandboxProvider } from "#shared/sandbox-provider.js";
import type { SandboxSession } from "#shared/sandbox-session.js";
import type { SandboxAttachment } from "#shared/sandbox-attachment.js";

export type VercelSandboxEnvironmentOptions = VercelSandboxCreateOptions & {
  readonly prepare?: (sandbox: SandboxSession) => Promise<void> | void;
};
export type { VercelSandboxRuntimeOptions } from "#public/sandbox/vercel-sandbox.js";

const defaultProvider = defineSandboxProvider<
  VercelSandboxEnvironmentOptions | undefined,
  VercelSandboxRuntimeOptions,
  VercelSandboxPreparedArtifact,
  VercelSandboxSessionState,
  VercelSandboxSession
>({
  name: "vercel",
  environment: (options) => {
    const { prepare, ...createOptions } = options ?? {};
    return createVercelSandbox({ createOptions, prepare, skipEmptyPreparation: true });
  },
});

const provider = defineSandboxProvider<
  VercelSandboxEnvironmentOptions | undefined,
  VercelSandboxRuntimeOptions,
  VercelSandboxPreparedArtifact,
  VercelSandboxSessionState,
  VercelSandboxSession
>({
  name: "vercel",
  environment: (options) => createVercelSandboxProvider(options),
});

export function createDefaultVercelEnvironment(
  options?: VercelSandboxEnvironmentOptions,
): SandboxEnvironment<VercelSandboxRuntimeOptions, VercelSandboxSession> {
  return defaultProvider.environment(options);
}

export const VercelSandbox = {
  name: "vercel",
  /** Reference an existing named sandbox without transferring ownership to the child. */
  attach(name: string): SandboxAttachment {
    if (typeof name !== "string" || name.trim() === "") {
      throw new TypeError("VercelSandbox.attach() requires a non-empty sandbox name.");
    }
    return { provider: "vercel", name };
  },
  environment(
    options?: VercelSandboxEnvironmentOptions,
  ): SandboxEnvironment<VercelSandboxRuntimeOptions, VercelSandboxSession> {
    return provider.environment(options);
  },
};
