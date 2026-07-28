---
activation: always
---

# Fact-Checking & Source Verification Guardrails

This rule file defines strict verification guardrails that **MUST** be adhered to by all AI assistants operating in this workspace.

---

## 1. Primary Directive: ABSOLUTELY NO CODE GUESSING

AI assistants are strictly prohibited from guessing, assuming, or hallucinating code logic, file locations, data structures, or API contracts. All code generation, modification, and refactoring **MUST** be grounded in direct empirical evidence gathered from inspecting actual workspace files.

---

## 2. Prohibition of Intuitive Inferences

* **Never Infer File Paths**: Do not guess where a component, composable, view, type, or asset is located. Always use directory listing or search tools to confirm exact file paths before referencing them in code or imports.
* **Never Infer Component Props or Emits**: Do not assume prop names, types, optionality, or emitted event signatures for Vue components. Always view the source `.vue` file to inspect `defineProps<{ ... }>()` and `defineEmits<{ ... }>()` definitions.
* **Never Infer Type Interfaces or Schemas**: Do not guess type definitions (such as `Movie`, `UserCredentials`, or Zod schemas). Inspect the authoritative definitions in `src/types/` or the source files.
* **Never Infer External API Contracts**: Do not assume endpoint URLs, request payload structures, or response types. Verify against existing API handlers or schema files.

---

## 3. Mandatory Inspection Workflow Before Editing

Before making any code edits, adding imports, or calling functions/components:
1. **Search & Read**: Perform explicit file reads (`view_file`) or search queries (`grep_search`) to locate and inspect authoritative source files.
2. **Inspect Full Symbol Definitions**: Locate the full declaration of any imported interface, type, enum, function, composable, or component. Partial views or assumptions from comments/docs are insufficient.
3. **Verify Parameter & Prop Signatures**:
   * Confirm whether a function expects **positional arguments** `fn(a, b)` or **destructured options** `fn({ a, b })`.
   * Confirm exact prop casing (e.g., `:is-favorite` vs `:favorite`) and event names (e.g., `@select-movie` vs `@select`).
4. **Trace Call Sites on Signature Changes**: If modifying a component's props/emits or a function signature, search the entire codebase to identify and update all invocation sites.

---

## 4. Verification & Post-Edit Integrity

* **No Blind Claims of Success**: Never declare a task complete or a bug fixed without running available build/type-check tools (`vue-tsc`, `vite build`) or verifying against source constraints.
* **Inspect Error Logs First**: When diagnosing errors or failures, fetch and inspect the full error traceback before attempting any fix. Never apply superficial symptom patches or swallow exceptions.

---

## 5. Empirical Verification Protocol

1. **Mandatory Execution Verification**:
   * **NEVER** declare a feature implemented, a bug fixed, or a refactoring complete without running concrete terminal verification commands (e.g., `npx nuxi typecheck`, `npm run build`, `vue-tsc -b`, `npx eslint .`, or equivalent project check scripts).
   * Editing a file or observing clean syntax does NOT equal completing a task; empirical execution proof is mandatory.
2. **Un-truncated Error Log Inspection**:
   * When an error or build failure occurs, you **MUST** read and inspect the **FULL, un-truncated error log** before formulating a diagnostic hypothesis or proposing a fix.
   * **NEVER** mask symptoms, swallow exceptions in empty `catch` blocks, comment out broken assertions, or return dummy fallback data to bypass failures.
3. **Evidence-Based Diagnostics**:
   * Formulate diagnostic hypotheses **strictly** after reviewing concrete log output and tracebacks.
   * Every code or configuration edit performed during debugging **MUST** be explicitly justified by an error traceback, log line, or empirically verified root cause.

