---
activation: always
---

# Autonomous Vercel Deployment Operations (`vercel-operations.md`)

This rule file defines the operational protocols, automated log debugging workflows, environment secret synchronization standards, and runtime context compatibility rules for Vercel deployment management.

---

## Core Deployment Operational Directives

All AI operations involving Vercel deployment, build configuration, or cloud serverless/edge functions MUST adhere to the following 3 guardrails:

```
┌───────────────────────────────────────────────────────────┐
│               1. AUTOMATED LOG DEBUGGING                  │
│   • Fetch raw Vercel build/deployment logs autonomously   │
│   • BAN: Requesting user to manually copy/paste logs      │
└─────────────────────────────┬─────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────┐
│               2. PROACTIVE SECRETS MANAGEMENT             │
│   • Verify Vercel auth token (`VERCEL_TOKEN` / CLI auth)  │
│   • Sync local `.env` secrets via `npx vercel env pull`   │
└─────────────────────────────┬─────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────┐
│               3. EDGE VS SERVERLESS CONTEXT CONTROL       │
│   • BAN: Native Node.js CJS modules (`fs`, `path`, `net`)  │
│     in Edge runtime handlers                              │
│   • Refactor to Nitro storage / Edge-safe Web APIs        │
└───────────────────────────────────────────────────────────┘
```

---

## 1. Automated Deployment Debugging Protocol
* **Autonomous Log Retrieval:** Upon any reported Vercel deployment failure, build error, or HTTP 500 runtime exception, the AI must automatically fetch raw deployment logs using Vercel CLI (`npx vercel logs <url-or-deployment-id>` or `npx vercel inspect`) without asking the user to manually extract or copy/paste log snippets.
* **Nuxt/Nitro Error Parsing:** Parse Nitro compilation, Rollup bundling, and Vercel build output to identify root causes (e.g. missing environment variables, unhandled dynamic imports, or module resolution errors).
* **Surgical Fix & Re-Trigger:** Apply minimal, targeted code modifications resolving the exact failure and trigger a re-deployment verification.

---

## 2. Proactive Secrets & Environment Management
* **Token Verification:** Before running any Vercel CLI commands, verify whether Vercel authentication tokens or CLI login credentials exist (`VERCEL_TOKEN`, `.vercel/project.json`). Prompt the user proactively if authentication keys are missing.
* **Environment Variable Syncing:** Automatically detect new keys added to local `.env` files (e.g. `SUPABASE_URL`, `TMDB_API_KEY`) and synchronize them with the Vercel project environment via CLI (`npx vercel env add`) or Nitro server configuration.

---

## 3. Edge vs Serverless Context Compatibility
* **Node.js Native API Restrictions:** Edge runtime functions do not support Node.js native standard CJS modules (such as `fs`, `child_process`, `net`, `crypto` native bindings).
* **Edge-Safe Refactoring Standard:** When routes or server handlers are targeted for Vercel Edge middleware or Edge functions, automatically refactor native Node calls to use Web Standard APIs (`fetch`, `Web Crypto API`, `TextEncoder`, `Nitro Storage API`, `@unstorage`).
* **Nitro Preset Configuration:** Ensure `nuxt.config.ts` or `nitro.config.ts` specifies the appropriate deployment preset (`preset: 'vercel'`) to ensure proper serverless function chunking.
