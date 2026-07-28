---
activation: always
---

# Architecture & Engineering Decision Log (`decisions.md`)

This log records significant architectural, technical, and engineering decisions made throughout the lifecycle of the `movie-app` project.

**Directive:** All future AI sessions MUST consult this Memory Bank log before proposing or attempting structural changes to the codebase.

---

## Decision Log Table

| Date | Decision | Rationale | Alternatives Considered |
| :--- | :--- | :--- | :--- |
| 2026-07-28 | **Nuxt 3 SSR Adoption** | Enables Server-Side Rendering (SSR) for improved SEO, fast initial page loads, and seamless server routes (`/server/api`) for full-stack integration. | Client-only SPA (Vite + Vue 3), static site generator (SSG). |
| 2026-07-28 | **Supabase Auth & PostgreSQL Integration** | Provides managed authentication, Row-Level Security (RLS), real-time database capabilities, and native SSR cookie handling utilities. | Custom Express + MongoDB backend, Firebase, Auth0 with standalone PostgreSQL. |
| 2026-07-28 | **Pinia Component State Isolation** | Strongly-typed, centralized state management with SSR hydration support, eliminating prop-drilling while adhering to unidirectional data flow. | Vuex 4, custom reactive composables without centralized devtools inspection. |
| 2026-07-28 | **Vercel Nitro Server Deployment Target** | Native integration with Nuxt 3 Nitro engine, zero-config edge deployment, serverless function scaling, and optimal static asset CDN caching. | AWS Lambda + CloudFront, Docker containerization on AWS ECS, Netlify. |
| 2026-07-28 | **Tailwind CSS v4 Design Engine** | First-class CSS-first configuration, performance improvements via Lightning CSS, and utility-first styling consistency. | Tailwind CSS v3 with JavaScript `tailwind.config.js`, CSS Modules, Vuetify/Element Plus. |
| 2026-07-28 | **Zod Schema Runtime Validation** | Guarantees strict runtime data safety for API request/response payloads and authentication forms with dynamic TypeScript type inference. | Yup, Joi, manual custom TypeScript type guard functions. |

---

## Decision Record Details

### 1. Nuxt 3 Server-Side Rendering (SSR) Framework Migration
* **Context:** Transitioning from Vite SPA to Nuxt 3 SSR to support enterprise SEO, dynamic meta tags for movies, and server-side API proxying.
* **Impact:** Structure shifted to `pages/`, `components/`, `layouts/`, and `server/`.
* **Guardrail:** All components must adhere to `<script setup lang="ts">` and SSR hydration safety (`<ClientOnly>` when dealing with browser-only APIs).

### 2. Supabase Cloud Authentication & Row-Level Security (RLS)
* **Context:** Need persistent user sessions, secure password handling, and movie bookmark synchronization across devices.
* **Impact:** Supabase SSR module used for server-side auth token validation via HTTP cookies.
* **Guardrail:** Never expose Supabase service role keys on the client bundle; restrict client access via `@nuxtjs/supabase` composables.

### 3. Pinia State Management Isolation
* **Context:** Modular state for user auth, movie search filters, and user watchlist.
* **Impact:** Read-only state getters with explicit action mutations.
* **Guardrail:** Direct mutation of Pinia state from components is disallowed; state changes must pass through store actions.

### 4. Vercel + Nitro Engine Deployment
* **Context:** Production deployment target required for global availability, fast cold starts, and CI/CD pull request previews.
* **Impact:** Build output tuned for Nitro preset `vercel`.
