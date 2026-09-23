---
issue: https://github.com/vercel/eve/pull/3015
status: draft
last_updated: "2026-09-23"
---

# Return a child handle from workflow delegation

## Problem

`ctx.agent(target, input)` returns only the child's output. A workflow that
needs to contact the same child after a wait has no authoritative address to
persist. Guessing an `agentId` is unsafe: the current dispatch path starts a
new child when the supplied handle is unknown.

## Authoring contract

Add an opt-in `ctx.agentSession(target, input)` that returns
`{ agentId, output }`. Pass that `agentId` on the next call to reach the same
child. A missing or stale handle fails with `AGENT_CONTINUATION_UNAVAILABLE`;
it never starts another child. The ID comes from the owner-managed handle
store, not from model output or a caller-provided value. Structured output
schema typing follows `ctx.agent`.

Keep `ctx.agent` output-only for existing authored workflows. This is an
additive step toward the broader context API proposed in the linked draft;
that proposal's naming and tuple return are still under discussion.

## Boundary

This returns and validates child identity. It does not choose or attach a
sandbox for the child. Applications that need a child to share a particular
filesystem still need an explicit sandbox attachment contract.
