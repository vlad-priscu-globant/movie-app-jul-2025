# Claude Code Project Context & Instructions

> **PRIMARY ARCHITECTURAL REFERENCE:** Read `@ARCHITECTURE.md` before making any code modifications or architectural decisions.

---

## 1. Master Context Pointers

Claude Code MUST reference the following workspace documentation:
* **Architecture Guide:** [`ARCHITECTURE.md`](file:///c:/projects/movie-app-july-2026/ARCHITECTURE.md) (Master system blueprint & conventions)
* **Project Preferences:** [`project-preferences.md`](file:///c:/projects/movie-app-july-2026/project-preferences.md) (Tech stack evolution, Phase 1-3 roadmap, strict rules)
* **Discovery Report:** [`DISCOVERY_REPORT.md`](file:///c:/projects/movie-app-july-2026/DISCOVERY_REPORT.md) (Installed dependencies & workspace audit)
* **Agent Operational Rules:** [`.agents/rules/`](file:///c:/projects/movie-app-july-2026/.agents/rules/) (`persona-and-principles.md`, `code-conventions.md`, `fact-checking.md`)

---

## 2. Standard Development CLI Commands

Use the following CLI commands for development, verification, and builds:

```bash
# Launch development server
npm run dev

# Run full production build (Typecheck + Vite compilation)
npm run build

# Run TypeScript type safety verification
npm run typecheck   # (npx vue-tsc --noEmit)

# Run code style & linting checks
npm run lint        # (npx eslint .)

# Preview production build locally
npm run preview
```

---

## 3. Nuxt 3 & Supabase Conventions

### Nuxt 3 Architecture Standards
* **Single-File Components:** Use `<script setup lang="ts">` exclusively in all `.vue` files. Options API or plain `<script>` are forbidden.
* **Directory Conventions:**
  * `pages/`: Nuxt page view components.
  * `layouts/`: Application layout frames (`default.vue`, `auth.vue`).
  * `components/`: Reusable UI components (auto-imported).
  * `composables/`: State logic & custom hooks (`useMovieCatalog.ts`, `useAuth.ts`).
  * `server/api/`: Express / Node API server endpoints returning strongly-typed responses.

### Supabase Conventions
* **Client Initialization:** Access Supabase via `useSupabaseClient()` or dedicated composable hooks.
* **Authentication & Guarding:** Guard protected routes via Nuxt middleware using `useSupabaseUser()` session state.
* **Data Contracts:** All Supabase database payloads must be validated or typed against TypeScript interfaces in `src/types/` or `types/`.

### Strict Coding Rules
1. Zero `any` types allowed.
2. No direct DOM manipulation (use `ref`, `reactive`, `computed`).
3. Component state isolation: **Props Down, Emits Up**.

---

## 4. Skills & Context Synchronization (`git diff`)

* **Skill & Preference Access:** To access newly generated skills, updated project preferences (`project-preferences.md`), or pending context changes from other agent tools, run:
  ```bash
  git diff
  git status
  ```
* **Verification:** Always verify git status after creating files or editing configurations.
