import { defineChannel, POST } from "#public/channels/index.js";

// Epoch 31 channels could attach to an existing session and queue a turn.
// The new workflow agent handle field does not change this route contract.
export default defineChannel({
  routes: [
    POST("/continue/:sessionId", async (_request, { attachSession, params }) => {
      const result = await attachSession(params.sessionId!).send("Continue.", {
        auth: null,
        turnPolicy: "queue",
      });
      if (result.status === "session_not_active") {
        return Response.json({ accepted: false }, { status: 409 });
      }
      return Response.json({ sessionId: result.sessionId });
    }),
  ],
});
