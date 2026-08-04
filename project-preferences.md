# Project Preferences & Architectural Directives

**Project:** `movie-app`  
**Role:** Senior Staff Architect  
**Version:** 1.0  
**Effective Date:** July 28, 2026  
**Current Milestone Status:** **Session 06 Completed / Session 07 Active** (Initiation of Supabase Database Provisioning)

---

## 1. Active Tech Stack Evolution Roadmap

The project architecture evolves across three distinct execution phases (Sessions 1 to 12). Each phase expands capabilities while maintaining strict backward compatibility and code quality.

| Phase | Session Range | Core Technologies & Scope | Milestone Status |
| :--- | :--- | :--- | :--- |
| **Phase 1** | **Sessions 1–4** | **Foundation & SPA Architecture**<br>Vite + Vue 3 Composition API + Tailwind CSS + TypeScript + Zod. | `[x] COMPLETED` |
| **Phase 2** | **Sessions 5–8** | **Full-Stack SSR & Cloud Services**<br>Component Architecture + Express Backend + Nuxt 3 (SSR) + Supabase Auth & DB. | `[>] ACTIVE (Session 05)` |
| **Phase 3** | **Sessions 9–12** | **Production Engineering & Enterprise Workflows**<br>Vercel Deployment + Agile Workday Simulation (Jira, Git Flow, PR Reviews). | `[ ] PENDING` |

---

## 2. Progress Tracking & Session Checklist

### Phase 1: Foundation & SPA Core UI
- [x] **Session 01: Build Infrastructure & Tooling Scaffolding**
  - Configured Vite 8 build pipeline, TypeScript compiler settings, and Tailwind CSS v4 design engine.
- [x] **Session 02: Atomic UI Component System**
  - Created reusable UI components: `MovieCard.vue`, `MovieListItem.vue`, `SearchBar.vue`, and `NotFound.vue`.
- [x] **Session 03: Client Routing & Page Layout Shell**
  - Integrated Vue Router 4 (`HomeView.vue`, `LoginView.vue`), dynamic navigation, and responsive global layout shell in `App.vue`.
- [x] **Session 04: Data Contracts & Schema Validation**
  - Defined strong TypeScript domain interfaces in `src/types/index.ts` and runtime authentication validation schemas using **Zod**.

### Phase 2: Full-Stack SSR Architecture & Cloud Services
- [x] **Session 05: Component Architecture Refactoring & Express API Setup**
  - Audited component tree for reusability, modularized presentation layers, and established client-side REST API integration layer abstractions (`src/api/`).
- [x] **Session 06: Nuxt 3 Framework Migration & SSR Infrastructure**
  - Transitioned SPA structure to Nuxt 3 server-side rendering conventions (`pages/`, `layouts/`, `server/`).
- [>] **Session 07: Supabase Database Provisioning & Schema Definition** *(Current Session)*
  - Provision Supabase PostgreSQL instance, construct database tables, and configure client connection utilities.
- [ ] **Session 08: Supabase Auth Integration & Persistent State**
  - Implement Supabase authentication flows, session guards, and persistent user favorites state management.

### Phase 3: Production Engineering & Enterprise Workflows
- [ ] **Session 09: Vercel Deployment & Environment Provisioning**
  - Configure production deployment target on Vercel, setup environment secret variables, and optimize static asset caching.
- [ ] **Session 10: CI/CD Quality Gates & Automated Testing**
  - Establish automated GitHub Actions / CI check pipelines for type safety (`vue-tsc`), linting, and build verification.
- [ ] **Session 11: Enterprise Agile Simulation — Jira & Git Flow**
  - Simulate real-world enterprise workday workflows: feature branch naming, Jira issue tracking context, and commit hygiene.
- [ ] **Session 12: Peer Code Review & Architectural Sign-Off**
  - Perform simulated pull request reviews, final performance audits, refactoring, and architectural sign-off documentation.

---

## 3. Strict Architectural Rules

All code written or refactored within this codebase must strictly adhere to the following four architectural guardrails:

### Rule 3.1: Single-File Component Script Standard
* **Requirement:** Every Vue Single-File Component (SFC) must exclusively use `<script setup lang="ts">`.
* **Prohibited:** Plain `<script>`, Options API objects (`export default { ... }`), or separate non-setup script blocks are strictly disallowed unless defining named component exports.

### Rule 3.2: Absolute Type Safety (Zero `any`)
* **Requirement:** Strict type safety must be maintained across all modules. All function signatures, props, emits, reactive refs, and store states must be explicitly typed.
* **Prohibited:** The use of `any` or loose `unknown` casts without immediate type-narrowing guardrails is strictly forbidden.

### Rule 3.3: Reactivity Abstraction (No Direct DOM Manipulation)
* **Requirement:** DOM elements and properties must be controlled purely through Vue’s reactivity system (`ref`, `reactive`, `computed`, template refs).
* **Prohibited:** Imperative DOM access methods (such as `document.getElementById`, `document.querySelector`, `element.innerHTML`, or direct event listener attachments outside template directives) are strictly banned.

### Rule 3.4: Unidirectional Data Flow & State Isolation
* **Requirement:** Component architecture must enforce strict state isolation:
  * **Props Down:** Immutable data passed from parent to child via props.
  * **Emits Up:** State mutations requested by children via strongly-typed custom events (`defineEmits`).
* **Prohibited:** Direct mutation of props within child components or side-effecting child-to-parent prop mutations.

---

## 4. Soft Conflict Protocol

To maintain high architectural standards while ensuring smooth developer workflows, the system enforces a **Soft Conflict Protocol** upon detecting rule violations or roadmap drifts:

```
┌─────────────────────────────────────────────────────────┐
│                 RULE VIOLATION DETECTED                 │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│ 1. WARN                                                 │
│    • Immediately flag the non-compliant pattern         │
│    • Cite the specific Architectural Rule (3.1 - 3.4)   │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│ 2. ALTERNATIVE SOLUTION                                 │
│    • Provide an idiomatic Vue 3 / Nuxt 3 alternative     │
│    • Present clean code snippet showing compliant design│
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│ 3. ALIGNMENT & PROCEED                                  │
│    • Seek confirmation before proceeding with changes   │
└─────────────────────────────────────────────────────────┘
```

1. **Warning & Flagging:** Whenever an interaction or proposed change violates a strict rule (e.g., using `any` or direct DOM access), the assistant/developer must explicitly point out the violation and explain why it breaches project standards.
2. **Constructive Alternative:** Rather than blocking outright, the assistant/developer must propose a clean, idiomatic alternative adhering to Vue 3 / Nuxt 3 standards.
3. **Collaborative Resolution:** Proceed with implementation only after aligning on the compliant approach or receiving explicit architectural authorization.
