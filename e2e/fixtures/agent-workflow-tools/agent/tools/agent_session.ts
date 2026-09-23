import { defineWorkflowTool } from "eve/tools";
import { z } from "zod";

export default defineWorkflowTool({
  description: "Start and continue one workflow child with its real handle.",
  inputSchema: z.strictObject({}),
  async execute(_input, ctx) {
    "use workflow";

    const first = await ctx.agentSession("workflow-marker", { message: "session:first" });
    const second = await ctx.agentSession("workflow-marker", {
      agentId: first.agentId,
      message: "session:second",
    });
    let staleRejected = false;
    try {
      await ctx.agentSession("workflow-marker", {
        agentId: "missing-workflow-child",
        message: "session:unexpected",
      });
    } catch (error) {
      staleRejected =
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "AGENT_CONTINUATION_UNAVAILABLE";
      if (!staleRejected) throw error;
    }
    return {
      agentId: first.agentId,
      continuedAgentId: second.agentId,
      firstOutput: first.output,
      secondOutput: second.output,
      staleRejected,
    };
  },
});
