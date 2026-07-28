---
activation: always
---

# Code Conventions & Component Architecture Guidelines

This rule file defines the mandatory coding standards, reactivity patterns, component naming conventions, and architectural principles for Vue 3 and TypeScript development within this workspace.

---

## 1. Script Setup & TypeScript Standard

* **Exclusive `<script setup lang="ts">` Usage**: All Vue Single File Components (SFCs) in `src/components/`, `src/views/`, and `src/App.vue` **MUST** exclusively use `<script setup lang="ts">`. Options API (`export default { ... }`) or non-setup scripts are strictly prohibited.
* **Strict Type Safety**:
  * Component props **MUST** be declared using type-only `defineProps<{ ... }>()` syntax.
  * Component emits **MUST** be declared using typed `defineEmits<{ (e: 'event-name', payload: Type): void }>()` syntax.
  * All component local state (`ref`, `reactive`) **MUST** specify explicit TypeScript generic types or rely on strict type inference.
* **Imports**: Group imports at the top of the `<script setup>` block in logical order:
  1. Vue core APIs (`ref`, `reactive`, `computed`, `watch`, `onMounted`, etc.)
  2. External libraries (`zod`, `vue-router`)
  3. Types & Interfaces (`import type { Movie } from '../types'`)
  4. Child Components & Composables

---

## 2. Reactivity Rules (`ref`, `reactive`, `computed`, `watch`)

### `ref` vs `reactive`
* **Use `ref` by Default**:
  * Primitive values (`string`, `number`, `boolean`).
  * Collections and complex data structures (`Array`, `Set`, `Map`).
  * Objects whose entire reference may be reassigned or replaced from API responses.
* **Use `reactive` for Grouped State**:
  * Grouped object properties (e.g., form error dictionaries `reactive<Record<keyof Form, string>>({ ... })`) where property access without `.value` inside script logic improves readability.
  * Never destructure a `reactive` object directly without `toRefs` or `toRef`, as it breaks reactivity.

### `computed` Guidelines
* `computed` getters **MUST** be pure functions with zero side effects.
* Never mutate DOM state, trigger HTTP requests, or alter other reactive references inside a `computed` getter.
* Always specify or verify return types for non-trivial computed properties.

### `watch` & `watchEffect` Guidelines
* Use `watch` for explicit, targeted side-effects (e.g., clearing validation errors when an input changes, logging, or persisting to localStorage).
* When watching properties inside a `ref` object, use a getter function:
  ```ts
  watch(() => form.value.email, (newEmail) => {
    if (errors.email) errors.email = ''
  })
  ```
* Avoid deep watchers (`deep: true`) on large arrays or complex trees unless strictly necessary due to performance overhead.

---

## 3. Component Naming & Template Usage

* **Filename Case**: All component filenames **MUST** use multi-word PascalCase matching their component identity:
  * Good: `MovieCard.vue`, `SearchBar.vue`, `HomeView.vue`
  * Bad: `movieCard.vue`, `searchbar.vue`, `card.vue`
* **View/Page Suffix**: Page-level route targets stored in `src/views/` **MUST** end with the `View.vue` suffix (e.g., `HomeView.vue`, `LoginView.vue`).
* **Template Tag Usage**: In Vue templates, custom components **MUST** be referenced using **kebab-case** tags to align with HTML/W3C custom element standards:
  * Good: `<movie-card :movie="movie" @select-movie="handleSelect" />`
  * Bad: `<MovieCard :movie="movie" />`
* **Event Naming**: Emitted custom event names **MUST** use camelCase in `<script>` declarations (`'selectMovie'`, `'toggleFavorite'`) and kebab-case when bound in template listeners (`@select-movie="..."`, `@toggle-favorite="..."`).

---

## 4. SOLID & Single Responsibility Principle (SRP) Assessment

### Views vs. Presentation Components
* **Views (`src/views/*`) — Orchestrator Role**:
  * Responsible for route-level page layout, route parameters, coordinating data fetching, invoking composables/stores, and managing top-level page state.
  * Should not contain complex inline HTML structures for individual UI items.
* **Components (`src/components/*`) — Presentation Role**:
  * Focus on visual rendering and localized user interactions.
  * **MUST** be "dumb" or decoupled presentation components: accept data exclusively via `props` and emit user actions via `emits`.
  * **MUST NOT** directly fetch API data or perform side effects outside their scope.

### Component Granularity & Composition
* Split large components when a single `.vue` file exceeds 150–200 lines or handles multiple distinct UI responsibilities.
* Use Vue slots (`<slot name="default">`, `<slot name="extraInfo">`) for flexible layout customization (as demonstrated in `MovieListItem.vue`).

---

## 5. DRY & Composables Guidelines

* **Extract Stateful Logic to Composables (`src/composables/`)**:
  * Any stateful reactive logic shared across multiple components (e.g., search filtering, authentication logic, API pagination) **MUST** be extracted into a composable function named with the `use` prefix (e.g., `useMovies.ts`, `useAuth.ts`).
  * Composables should return a plain object containing read-only or ref state and handler methods.
* **Pure Helper Utilities (`src/utils/`)**:
  * Non-reactive helper logic (date formatting, string manipulation, currency conversion) **MUST** be placed in pure TypeScript modules within `src/utils/`.
* **Centralized Type Definitions (`src/types/`)**:
  * Data models and API contract interfaces **MUST** be centralized in `src/types/index.ts` or domain-specific type files (e.g., `src/types/movie.ts`). Never duplicate interface declarations across components.
