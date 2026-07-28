---
activation: always
---

# Error Recovery & Self-Healing Protocol (`error-recovery.md`)

This rule file defines the mandatory 5-step self-healing protocol that all AI agents MUST follow whenever a terminal command, build script, typecheck, or test suite fails.

---

## The 5-Step Self-Healing Protocol

When any execution step encounters an error, warning exit code, build failure, or test failure, execute the following protocol sequentially without skipping steps:

```
┌───────────────────────────────────────────────────────────┐
│               1. LOG EXTRACTION                           │
│   • Fetch and inspect full, un-truncated error log        │
│   • BAN: Guessing hypotheses without reading raw logs     │
└─────────────────────────────┬─────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────┐
│               2. ROOT CAUSE ANALYSIS                      │
│   • Trace upstream data contracts & broken interfaces     │
│   • BAN: Superficial patches, dummy fallbacks, swallows  │
└─────────────────────────────┬─────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────┐
│               3. TARGETED CORRECTION                      │
│   • Apply minimal, surgical edits targeting root cause    │
│   • Maintain strict type safety and architectural rules   │
└─────────────────────────────┬─────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────┐
│               4. VERIFICATION RE-RUN                      │
│   • Immediately re-execute failing build/test command    │
│   • Prove zero errors before declaring success            │
└─────────────────────────────┬─────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────┐
│               5. GOTCHA REGISTRATION                      │
│   • If bug is recurring or framework-specific, append to │
│     `.agents/memory/gotchas.md`                           │
└───────────────────────────────────────────────────────────┘
```

---

## Detailed Step Specifications

### Step 1: Log Extraction
* **Rule:** Inspect the complete, un-truncated raw error log output immediately upon failure.
* **Prohibited:** Never form diagnostic hypotheses or start editing code based on partial snippet assumptions without inspecting the full stack trace and failure output.

### Step 2: Root Cause Analysis
* **Rule:** Trace broken contracts upstream to identify the true root cause (e.g. invalid type definition, missing environment variable, incorrect parameter order).
* **Prohibited:** Never apply superficial symptom patches, such as wrapping errors in silent `try/catch` blocks, returning dummy `null` fallbacks, commenting out broken assertions, or deleting failing test cases.

### Step 3: Targeted Correction
* **Rule:** Apply surgical, high-precision modifications directly addressing the root cause.
* **Prohibited:** Avoid massive unrelated refactoring while resolving a single localized failure. Keep edits focused and compliant with core architectural guardrails.

### Step 4: Verification Re-Run
* **Rule:** Immediately re-run the exact command or test suite that failed to empirically confirm a clean resolution.
* **Prohibited:** Never declare a bug fixed or task completed without running CLI verification commands (e.g., `npm run build` or `vue-tsc`).

### Step 5: Gotcha Registration
* **Rule:** If the failure stems from a subtle framework quirk, API rate limit, environment issue, or recurring pitfall, append a record entry to `.agents/memory/gotchas.md`.
* **Format:** Follow the standard Gotcha schema: `[Gotcha Title] | Component/File | Symptom | Root Cause | Solution`.
