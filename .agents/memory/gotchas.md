---
activation: always
---

# Repository Bugs, API Quirks & Gotchas (`gotchas.md`)

This log records known technical gotchas, API quirks, build issues, and runtime pitfalls specific to the `movie-app` repository.

**Directive:** All future AI sessions MUST check this file before debugging tricky errors or refactoring complex modules.

---

## Gotchas & Technical Quirks Table

| Gotcha Title | Component/File | Symptom | Root Cause | Solution |
| :--- | :--- | :--- | :--- | :--- |
| **TMDB API Rate Limits & Quotas** | `src/api/tmdb.ts` / `server/api/movies` | HTTP 429 Too Many Requests errors during batch movie searches or pagination. | TMDB enforces burst rate limits (approx 40 requests/10s per IP). | Implement server-side caching (Nitro storage / Redis), request debouncing on SearchBar, and standard backoff handling. |
| **Nitro Engine DB Driver Imports** | `server/plugins/db.ts` / `server/api/*` | Server crashes on build (`Module not found` or CJS/ESM bundling errors). | Nitro uses Rollup to bundle server handlers; native Node CJS drivers (e.g. `pg` / `sqlite3`) can fail ESM bundling. | Use ESM-compatible drivers (`@supabase/supabase-js`, `postgres` driver) or mark native dependencies under `nitro.externals`. |
| **Supabase SSR Cookie Synchronization** | `middleware/auth.ts` / `server/middleware/supabase.ts` | Auth state mismatch (user appears logged in on client but unauthenticated during SSR). | Supabase auth cookies set client-side are not automatically parsed on first SSR request without proper Nuxt SSR auth middleware. | Use `@nuxtjs/supabase` module standard helper `useSupabaseUser()` and `useSupabaseClient()` with server cookie forwarding enabled. |
| **Tailwind CSS v4 `@import` Directives** | `src/assets/main.css` / `index.css` | Utility styles missing or `@theme` overrides failing to resolve. | Tailwind v4 uses CSS-first configuration via `@import "tailwindcss";` instead of JavaScript config `tailwind.config.js`. | Keep CSS configuration inside main stylesheet using CSS custom properties and `@theme` directives. Avoid `tailwind.config.js`. |
| **SSR Hydration Mismatch on Browser APIs** | `src/components/MovieCard.vue` | Vue Warn: `Hydration node mismatch` on page load. | Referencing browser-only globals (`window`, `localStorage`, `navigator`) directly inside `<script setup>` top-level scope during SSR. | Wrap client-only logic inside `onMounted()` hook or wrap components with `<ClientOnly>` tags. |
| **Vue SFC `<script setup>` Duplicate Imports** | `src/components/*.vue` | Build error: `Identifier X has already been declared` or compiler warnings. | Mixing `<script setup>` with standard `<script>` block and re-declaring props or variables across both. | Enforce single `<script setup lang="ts">` per SFC file as required by Architectural Rule 3.1. |

---

## Gotcha Resolution Playbooks

### Gotcha 1: Supabase Auth Cookie Handling in SSR
* **Symptom:** Page refresh briefly shows unauthenticated UI before flashing to logged-in state.
* **Root Cause:** Session restoration executing asynchronously on client hydration instead of server-side reading of session cookie.
* **Fix:** Use Nuxt 3 server middleware to validate JWT stored in cookies before rendering the template tree.

### Gotcha 2: Nitro Engine External Module Bundling
* **Symptom:** Nitro server build succeeds locally but fails on Vercel deployment with missing dependencies.
* **Root Cause:** Incompatible CJS package dynamic `require()` calls bundled incorrectly by Nitro ESM bundler.
* **Fix:** Add problematic package names to `nitro.externals.inline` or `nitro.externals.external` inside `nuxt.config.ts`.
