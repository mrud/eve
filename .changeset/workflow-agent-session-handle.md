---
"eve": patch
---

Add `ctx.agentSession()` to workflow tools. It returns the child agent's real handle alongside its output and rejects unavailable continuation handles instead of starting a new child. A new root-agent child can borrow an existing named Vercel Sandbox through `VercelSandbox.attach()`.
