import { z } from "zod";
import { defineWorkflowTool } from "#public/tools/index.js";

// Epoch 57 workflow tools used ctx.agent() for an output-only invocation.
// Adding ctx.agentSession() must not change that authored call.
export const delegate = defineWorkflowTool({
  description: "Ask the worker to handle a message.",
  inputSchema: z.object({ message: z.string() }),
  async execute({ message }, ctx) {
    "use workflow";
    return await ctx.agent("worker", { message });
  },
});
