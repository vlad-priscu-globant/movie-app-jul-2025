# Workspace Discovery Report

**Project Name:** `movie-app`  
**Architectural Framework:** Vue 3 + Vite 8 SPA (Single Page Application)  
**Discovery Date:** July 28, 2026  
**Role:** Senior Frontend Architect  

---

## 1. Installed Dependencies & Exact Library Versions

The application is built as a Single Page Application (SPA) leveraging **Vite 8** and **Vue 3**, styled with **Tailwind CSS v4**. Below is the complete manifest of exact installed versions extracted from lockfiles and `node_modules` package descriptors:

### Core Framework & Build Infrastructure
| Tech / Library | Status | Declared Specifier (`package.json`) | Installed Resolved Version (`node_modules`) |
| :--- | :--- | :--- | :--- |
| **Vue** | Installed | `^3.5.39` | `3.5.39` |
| **Vite** | Installed | `^8.1.1` | `8.1.4` |
| **@vitejs/plugin-vue** | Installed | `^6.0.7` | `6.0.8` |
| **TypeScript** | Installed | `~6.0.2` | `6.0.3` |
| **@vue/tsconfig** | Installed | `^0.9.1` | `0.9.1` |
| **vue-tsc** | Installed | `^3.3.5` | `3.3.7` |
| **@types/node** | Installed | `^24.13.2` | `24.13.2` |

### Styling & CSS Processing
| Tech / Library | Status | Declared Specifier | Installed Resolved Version |
| :--- | :--- | :--- | :--- |
| **Tailwind CSS** | Installed | `^4.3.2` | `4.3.2` |
| **@tailwindcss/vite** | Installed | `^4.3.2` | `4.3.2` |
| **Autoprefixer** | Installed | `^10.5.3` | `10.5.3` |
| **PostCSS** | Installed | `^8.5.19` | `8.5.19` |

### Routing & Schema Validation (Auxiliary)
| Tech / Library | Status | Declared Specifier | Installed Resolved Version |
| :--- | :--- | :--- | :--- |
| **Vue Router** | Installed | `^4.6.3` | `4.6.4` |
| **Zod** | Installed | `^4.4.3` | `4.4.3` |

### Platform Services & SSR Frameworks
| Tech / Service | Status | Notes |
| :--- | :--- | :--- |
| **Nuxt** | *Not Installed* (N/A) | Project uses standard Vite + Vue 3 SPA architecture. |
| **Supabase** | *Not Installed* (N/A) | Data currently uses mock states in views. |
| **Vercel Insights / Analytics** | *Not Installed* (N/A) | No telemetry/analytics package present. |

---

## 2. Directory Hierarchy Map

Below is the mapping of key requested standard directories and their structural presence within this Vue 3 / Vite project:

* **`pages/` (Nuxt Convention)**  
  *Status:* **N/A** (Replaced by `src/views/` under standard Vue SPA conventions).
* **`components/` (`src/components/`)**  
  *Status:* **Active**. Houses reusable UI presentation components:
  * `MovieCard.vue` — Interactive movie poster card with hover scaling and stateful favorite toggle.
  * `MovieListItem.vue` — Alternative list-item presentation component for movie items.
  * `SearchBar.vue` — Custom input control with two-way `v-model` binding and clear button action.
  * `NotFound.vue` — Lightweight 404 fallback component.
  * `partials/` — Subdirectory reserved for modular partial components (currently empty).
* **`layouts/` (Nuxt Convention)**  
  *Status:* **N/A (Embedded)**. Layout infrastructure is directly integrated within `src/App.vue`, featuring a sticky header with brand logo and global navigation, a flex-grow main view container (`<RouterView />`), and a semantic footer.
* **`server/` (Nuxt / Node API Convention)**  
  *Status:* **N/A (Client-only SPA)**. Client-side backend abstraction is prepared in `src/api/` (with `src/api/__tests__/`), but no active server-side runtime code exists in this repository.
* **`types/` (`src/types/`)**  
  *Status:* **Active**. 
  * `src/types/index.ts` defines core TypeScript interfaces (`Movie` and `UserCredentials`).
* **`public/` (Static Assets Root)**  
  *Status:* **Active**.
  * `favicon.svg` — Application branding icon served directly at root.

### Auxiliary Application Directories
* **`src/router/`**: Central routing table (`index.ts`) configuring Vue Router 4.
* **`src/views/`**: Page-level views (`HomeView.vue` and `LoginView.vue`).
* **`src/stores/`**: Directory reserved for Pinia/state management modules (currently empty).
* **`src/utils/`**: Directory reserved for helper functions and utilities (currently empty).
* **`src/assets/`**: Local media assets (`vue.svg`).

---

## 3. Routing Layout & Active Page Views

### Routing Setup
The routing system is configured in `src/router/index.ts` using `createRouter` with `createWebHistory()` mode.

### Layout Shell (`src/App.vue`)
The main layout wraps all page views with a cohesive dark-themed UI frame:
1. **Header:** Sticky navigation header (`bg-linear-to-b from-black via-zinc-950 to-transparent`) containing the `MovieApp` brand logo linking to `/`, a quick search input, and an `Autentificare` button linking to `/login`.
2. **Main Content Container:** Semantic `<main>` container hosting `<RouterView />`.
3. **Footer:** Copyright footer pinned to the bottom.

### Active Page Views

| Path | Route Name | Component File | Key Features & Responsibilities |
| :--- | :--- | :--- | :--- |
| `/` | `home` | `src/views/HomeView.vue` | Main dashboard displaying a grid of movies (`movies` ref state), real-time query filtering via `SearchBar`, and stateful favorite tracking (`favoriteIds` set). |
| `/login` | `login` | `src/views/LoginView.vue` | Authentication page featuring a login form, real-time input watching, and robust runtime schema validation via **Zod** (`loginSchema`). |
| `/:pathMatch(.*)` | `404` | `src/components/NotFound.vue` | Fallback catch-all route rendering a 404 heading for unmapped URLs. |

---

## 4. Application Architectural Visual Tree

```
movie-app/
├── .git/
├── .gitignore
├── .idea/
├── dist/                          # Production build output folder
├── node_modules/                  # Installed dependencies
├── public/                        # Static assets served at root URL
│   └── favicon.svg
├── src/                           # Primary source code directory
│   ├── api/                       # API client module directory
│   │   └── __tests__/             # Unit tests for API handlers
│   ├── assets/                    # Project images & media
│   │   └── vue.svg
│   ├── components/                # Reusable UI components
│   │   ├── partials/              # Nested sub-components
│   │   ├── MovieCard.vue          # Interactive movie card component
│   │   ├── MovieListItem.vue      # Alternative list item layout
│   │   ├── NotFound.vue           # 404 error view component
│   │   └── SearchBar.vue          # Search input component with v-model
│   ├── router/                    # Client-side routing configuration
│   │   └── index.ts               # Vue Router 4 setup & route table
│   ├── stores/                    # Pinia state stores directory
│   ├── types/                     # TypeScript definitions
│   │   └── index.ts               # Movie & UserCredentials interfaces
│   ├── utils/                     # Helper & utility functions directory
│   ├── views/                     # Page views (Route targets)
│   │   ├── HomeView.vue           # Main catalog & search view
│   │   └── LoginView.vue          # Auth form with Zod validation
│   ├── App.vue                    # Root application component & layout shell
│   ├── main.ts                    # Application entrypoint & plugin mounting
│   └── style.css                  # Global style imports
├── index.html                     # HTML root template
├── package.json                   # Dependency manifest & npm scripts
├── package-lock.json              # Resolved dependency lockfile
├── tsconfig.app.json              # TypeScript config for application code
├── tsconfig.json                  # Parent TypeScript configuration
├── tsconfig.node.json             # TypeScript config for Vite node tools
└── vite.config.ts                 # Vite 8 build & plugin configuration
```
