import { describe, expect, expectTypeOf, it } from "vitest";
import type { SessionContext } from "#context/session-context.js";
import type { RuntimeSandboxSessionFor } from "#public/definitions/sandbox.js";
import { Drive, VercelSandbox, type VercelSandboxSession } from "#public/sandbox/vercel.js";
describe("VercelSandbox", () => {
  it("creates a serializable reference to a named sandbox", () => {
    expect(VercelSandbox.attach("ace-au-scope")).toEqual({
      provider: "vercel",
      name: "ace-au-scope",
    });
    expect(() => VercelSandbox.attach(" ")).toThrow("non-empty sandbox name");
  });
  it("creates environments", () => {
    const environment = VercelSandbox.environment({ resources: { vcpus: 4 } });
    expect(environment.provider).toBe("vercel");
    expectTypeOf(environment.open).toBeFunction();
    expectTypeOf(Drive.getOrCreate).toBeFunction();
  });

  it("preserves its session capabilities through getSandbox", () => {
    const environment = VercelSandbox.environment({});
    const assertTypes = (ctx: SessionContext) => {
      expectTypeOf(ctx.getSandbox(environment)).toEqualTypeOf<
        Promise<RuntimeSandboxSessionFor<VercelSandboxSession>>
      >();
    };

    expectTypeOf(assertTypes).toBeFunction();
  });
});
