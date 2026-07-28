---
activation: always
---

# Autonomous Supabase Database Operations (`supabase-operations.md`)

This rule file defines the operational guardrails, migration standards, credential verification protocols, and security standards for autonomous Supabase database management within the `movie-app` repository.

---

## Core Database Operational Guardrails

All AI interactions involving database schema definitions, Row-Level Security (RLS) policies, or Supabase client integrations MUST comply with the following 3 directives:

```
┌───────────────────────────────────────────────────────────┐
│               1. AUTOMATED MIGRATIONS                     │
│   • Generate SQL in `supabase/migrations/<timestamp>_*.sql`│
│   • Execute application via `npx supabase db push`        │
└─────────────────────────────┬─────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────┐
│               2. PROACTIVE KEY & TOKEN CHECKS             │
│   • Verify `.env` / environment for `SUPABASE_ACCESS_TOKEN`│
│   • Prompt user immediately if credentials missing       │
└─────────────────────────────┬─────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────┐
│               3. STRICT ENVIRONMENT SECURITY              │
│   • BAN: Service role key (`SUPABASE_SERVICE_ROLE_KEY`)   │
│     in client code / Vue SFC templates                    │
│   • Enforce strict RLS policies on all Postgres tables    │
└───────────────────────────────────────────────────────────┘
```

---

## 1. Automated Migrations Protocol
* **Schema Change Execution:** Whenever a database table, column, index, function, or RLS policy change is required, the AI must automatically craft a versioned SQL file inside `supabase/migrations/` using standard timestamp naming conventions (e.g. `YYYYMMDDHHMMSS_create_movies_table.sql`).
* **CLI Deployment:** Attempt to push and apply migrations autonomously via Supabase CLI tools:
  ```bash
  npx supabase db push
  ```
* **Migration Rollback Safety:** Always test SQL queries for idempotent execution (`CREATE TABLE IF NOT EXISTS`, `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`, `DROP POLICY IF EXISTS`).

---

## 2. Proactive Key Checks & Credential Verification
* **Pre-Execution Check:** Before attempting any database query execution, migration push, or CLI command requiring authentication, automatically inspect the environment configuration (`.env`, `.env.local`, system environment variables) for:
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (Server-side/Nitro only)
  - `SUPABASE_ACCESS_TOKEN` (CLI operations)
* **Missing Key Protocol:** If required credentials or CLI access tokens are missing or unconfigured, halt execution before attempting failed API calls and proactively prompt the user with clear instructions on how to provide the missing keys.

---

## 3. Environment Safety & RLS Enforcement
* **Zero Service-Role Leakage:** The `SUPABASE_SERVICE_ROLE_KEY` grants full superuser database bypass permissions. It must NEVER be bundled into client-side JS assets, exposed in Vue SFC components, or stored in public composables (`src/api/` or `components/`).
* **Mandatory Row-Level Security:** Every Postgres table created or modified in Supabase MUST have Row-Level Security enabled:
  ```sql
  ALTER TABLE public.<table_name> ENABLE ROW LEVEL SECURITY;
  ```
* **Strict Policy Standard:** Define explicit policies for `SELECT`, `INSERT`, `UPDATE`, and `DELETE` actions scoped strictly to authenticated users (`auth.uid() = user_id`) or public read-only access where appropriate.
