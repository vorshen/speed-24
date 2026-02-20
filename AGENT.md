# AGENT.md

## Purpose

This document defines how to translate a **prototype implementation** into **production code** without losing core product semantics.

- Prototype input in this repository is TypeScript-based.
- Production output is **not language-constrained** (backend/frontend/mobile/workflow engines are all valid targets).
- The target is semantic equivalence, not syntax equivalence.

Use this file as the operating contract for agents and engineers performing the translation.

## Repository Shape (Expected)

The target repository is expected to look like:

- `prototype/`: prototype source of truth (Prototype-style implementation and contracts).
- `business/`: production-oriented implementation translated from `prototype/`.

Working rule:

- Treat `prototype/` as semantic input and reference baseline.
- Build or evolve production architecture in `business/`.
- Do not require `business/` to mimic `prototype/` file structure one-to-one.

## Non-Goals

- Do not copy prototype framework choices as production defaults.
- Do not treat prototype folder structure as production architecture.
- Do not ship `business/` with direct runtime dependency on copied prototype JSON files (`blueprint.json` / `store.json` / `theme.json`) as the final production architecture.
- Do not silently degrade visual/layout fidelity without explicit rationale and sign-off.

## Source Context (Repository-Bound)

For translation tasks in this repository layout, use these anchors:

- `prototype/src/data/blueprint.json` (+ `store.json` / `theme.json`): flow, data, and presentation contracts.
- `prototype/src/core/app.ts` (or equivalent runtime entry): runtime protocol semantics (`currentState`, params merge, `transitionTo`, `goBack`, data loading behavior).
- `business/`: production target where translated architecture is implemented (language/framework unconstrained).

These are reference inputs for semantic extraction, not mandatory production implementation details.

## Repository Runtime Conventions (This Repo)

- JavaScript/TypeScript projects in this repository use **pnpm** as package manager.
- `prototype/src/data/*.json` are **semantic source references only**.
- In `business/`, production runtime should use typed modules/adapters (for example `StateRegistry`, repositories, token registry), not direct JSON copies as runtime dependencies.
- For current scope, backend is optional:
  - If no backend features are required, use frontend-local repository implementations (in-memory/local persistence) behind interfaces.
  - Keep boundaries so backend can be added later by replacing adapters, not rewriting pages.

## Canonical Semantics to Preserve

The following semantics are invariant across language or stack:

1. **State Machine Integrity**
   - Business flow is represented as explicit states and transitions.
   - Every reachable user path can be represented by state + params.

2. **Navigation Semantics**
   - `transitionTo(targetStateId, params?)` means an intentional state transition with parameter merge/override behavior.
   - `goBack()` means returning via valid history semantics, not ad-hoc redirection.

3. **Parameter Contract**
   - State params are explicit, typed in spirit (primitive-safe), and carry user context.
   - Runtime params override defaults while preserving unspecified defaults.

4. **Data Contract Separation**
   - `blueprint` (flow), `store` (business data), `theme` (presentation tokens) are separate concerns.
   - UI/page logic is derived from state + data, not hidden constants.

5. **Interaction Completeness**
   - No dead interactive element.
   - Any clickable control has defined behavior, target, or state effect.

6. **Token-Driven Presentation**
   - Visual rules come from semantic tokens/themes, not arbitrary hardcoded values.

7. **Visual/Layout Fidelity**
   - Production UI should preserve prototype visual hierarchy, spacing rhythm, typography intent, and interaction feel.
   - Visual + layout parity is a first-class acceptance target (near pixel parity where platform allows).

## Translation Unit Model

Translate by units, not by files.

- **State Unit**
  - Prototype: `blueprint.states[]`
  - Production equivalent: route graph, workflow graph, or navigation model
  - Must preserve: reachability, no orphan/dead-end (unless terminal by design)

- **Param Unit**
  - Prototype: state `params` + runtime overrides
  - Production equivalent: URL/query/path params, request payload, session/context
  - Must preserve: defaulting, override precedence, primitive-safe serialization

- **Data Unit**
  - Prototype: `store.json` seed data
  - Production equivalent: DB schema + API contracts + cache/read models
  - Must preserve: entity meaning, key relations, required fields

- **Theme Unit**
  - Prototype: `theme.json`
  - Production equivalent: design tokens, style dictionary, platform theme system
  - Must preserve: semantic token names and intent

- **Interaction Unit**
  - Prototype: click handlers mapped to transitions/effects
  - Production equivalent: command handlers, controller actions, event-driven actions
  - Must preserve: user intent and observable outcomes

## Runtime-Agnostic Mapping Rules

Apply these rules regardless of target stack:

- Map **state IDs** to stable production identifiers (route names, workflow step IDs, scene IDs).
- Map **state transitions** to explicit, testable navigation commands.
- Map **param merge semantics** to deterministic policy:
  - `finalParams = defaults + runtimeOverrides`.
- Map **prototype store reads** to production read boundary:
  - API/service/repository adapters (no direct UI hardcoded datasets).
- When backend is not required for current scope, implement repository interfaces with local adapters (in-memory/local cache) and keep the same contracts.
- Map **theme tokens** to centralized token registry with platform adapters.
- Map **visual effects** (blur/glow/shadow/overlays/feedback animations) to platform-equivalent implementations.
- For platform-incompatible primitives, define deterministic fallbacks that preserve perceived style and hierarchy.
- Map **back behavior** to true history semantics (browser stack, app nav stack, workflow prior node).

## Productionization Pipeline

Use this phased process:

1. **Semantic Extraction**
   - Input: prototype code + `prototype/store/theme`.
   - Output: stack-neutral semantic spec (states, params, transitions, entities, tokens, interactions).

2. **Architecture Mapping**
   - Decide target architecture boundaries:
     - navigation layer
     - domain/application layer
     - data access layer
     - presentation layer
   - Produce mapping document from semantic units to architecture units.

3. **Adapter Implementation**
   - Implement translation adapters for:
     - navigation
     - param serialization/deserialization
     - data source replacement (seed -> real service/DB)
     - token binding

4. **Behavioral Verification**
   - Verify state coverage, interaction completeness, and param correctness.
   - Run regression checks against prototype behavior, not only snapshot UI tests.

5. **Source-Target Traceability**
   - Keep a trace map from `prototype/` semantics to `business/` implementations.
   - For every major flow in `prototype`, identify its production entrypoint(s) in `business/`.

## Minimal Guardrails (Hybrid Normative Rules)

### MUST

- Preserve all business-relevant states and transitions.
- Preserve param default + runtime override semantics.
- Ensure every interactive element has defined behavior.
- Keep flow/data/theme concerns separated in production architecture.
- Make navigation and transition behavior testable.
- Preserve prototype visual style and layout structure with high fidelity.
- Keep all critical surfaces token-driven; no critical hardcoded visual constants.
- Use `pnpm` for JavaScript/TypeScript dependency management in this repository.
- Implement production runtime contracts as typed modules/adapters in `business/` (state registry, repositories, token registry).
- If backend is out of scope, keep repository boundaries and provide local implementations instead of direct UI constants.

### SHOULD

- Keep semantic names stable across translation (or provide explicit mapping).
- Keep theme tokens semantic-first (e.g., `primary`, `surface`, `textPrimary`).
- Keep production adapters thin and replaceable.

### MUST NOT

- Hardcode business constants in presentation as a substitute for data contracts.
- Collapse multiple distinct prototype states into one ambiguous production state without explicit rationale.
- Replace history/back behavior with arbitrary jumps.
- Ship major visual/layout regressions relative to prototype without documented mitigation.
- Treat copied prototype JSON files as final production runtime sources in `business/`.

## Acceptance Checklist (Definition of Done)

A translation is acceptable only if all checks pass:

1. **State Coverage**
   - Every prototype state maps to one production state equivalent.
   - Orphans: 0.
   - Unintended dead-ends: 0.

2. **Transition Coverage**
   - Every prototype transition path has production execution path.
   - Invalid target handling is defined.

3. **Param Coverage**
   - Every state param has production carrier and parser/validator.
   - Default + override precedence is deterministic and tested.

4. **Interaction Coverage**
   - All clickable/interactive elements are behavior-complete.
   - No no-op handlers.

5. **Data Contract Coverage**
   - Prototype entities map to production schemas/contracts.
   - Required fields and identifiers preserved.

6. **Theme Coverage**
   - Semantic token mapping complete.
   - No critical UI relies on unnamed hardcoded style values.

7. **Visual Fidelity Coverage**
   - Key screens/components visually align with prototype in color, spacing, typography, hierarchy, and effects.
   - Platform constraints and fallback strategy are documented for any non-1:1 effect.

## Worked Example (From This Repository, Language-Neutral)

Prototype semantics in `prototype/src/core/app.ts`:

- Reads current state from URL/context.
- Merges runtime params into state defaults.
- Triggers navigation via `transitionTo(stateId, params?)`.
- Supports `goBack()` history behavior.

Production translation pattern:

- Implement a `NavigationPort` with:
  - `navigate(targetStateId, params)`
  - `back()`
- Implement a `ParamPolicy` with:
  - default params from state definition
  - runtime override merge
  - validation and coercion strategy
- Implement a `StateRegistry`:
  - stable state IDs
  - state metadata
  - allowed transition constraints (optional but recommended)

Result: same behavior semantics, different runtime implementation.

Practical repository mapping:

- `prototype/src/data/blueprint.json` -> production flow definitions in `business/` (routes/workflows/state registry).
- `prototype/src/data/store.json` -> production data contracts in `business/` (API DTOs/domain models/repositories).
- `prototype/src/data/theme.json` -> production token system in `business/` (theme module/design token adapters).
- `prototype/src/core/app.ts` navigation semantics -> production navigation adapter in `business/`.

## Suggested Deliverables per Translation Task

- `semantic-spec` (states/transitions/params/entities/tokens/interactions)
- `mapping-spec` (prototype units -> production architecture)
- `verification-report` (checklist evidence and known tradeoffs)

If any semantic cannot be preserved, document:

- what changed
- why it changed
- risk and mitigation

## Decision Priority

When tradeoffs appear, prioritize in this order:

1. visual/layout fidelity (prototype parity first)
2. behavior correctness
3. semantic traceability
4. maintainability
5. implementation convenience

