import { defineEval } from "eve/evals";

export default defineEval({
  description: "An authored workflow continues the exact child and rejects a missing handle.",
  async test(t) {
    const turn = await t.send("WORKFLOW-AGENT-SESSION-START");
    turn.expectOk();
    turn.calledTool("agent_session", { count: 1, status: "completed" });
    turn.messageIncludes('"staleRejected":true');
    turn.messageIncludes('"firstOutput":"WORKFLOW-CHILD:session:first"');
    turn.messageIncludes('"secondOutput":"WORKFLOW-CHILD:session:second"');
    turn.eventsSatisfy("both calls use the same child handle", (events) => {
      const calls = events.filter((event) => event.type === "subagent.called");
      return (
        calls.length === 2 &&
        calls[0]?.data.agentId === calls[1]?.data.agentId &&
        calls[0]?.data.childSessionId === calls[1]?.data.childSessionId
      );
    });
    t.succeeded();
  },
});
