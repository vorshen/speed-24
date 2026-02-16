---
name: prototype-to-react-native
description: Translates prototype implementations into production React Native code using Expo (default SDK 54, upgrade-ready), preserving state/param/navigation semantics and token-driven UI. Use when users ask to convert prototype flows into business-grade React Native apps.
---

# Prototype to React Native

## Purpose

Translate `prototype/` semantics into production-ready React Native code in `business/` while preserving behavior, visual intent, and architecture boundaries.

## When to Use

Use this skill when the user asks to:

- Convert prototype pages/flows to React Native.
- Build or refactor `business/` as production code.
- Preserve `transitionTo`, `goBack`, and params merge semantics.
- Keep token-driven styling and flow/data/theme separation.

## Non-Goals

- Do not mirror prototype file structure one-to-one.
- Do not keep copied prototype JSON files as final runtime dependencies in `business/`.
- Do not introduce backend by default for single-app local gameplay flows.

## Stack and Package Policy

- Package manager: `pnpm` only.
- Runtime: Expo Go.
- Default SDK: 54.
- Upgrade-ready: keep version policy centralized and compatibility-checked.

### Dependency Rules

1. Use `pnpm` for all install/run commands.
2. Use `pnpm expo install` for Expo-managed packages.
3. Keep `react-native` aligned to Expo expected version (patch mismatch must be fixed).
4. Use explicit entrypoint for pnpm compatibility:
   - `package.json` -> `"main": "./index.js"`
   - `index.js` uses `registerRootComponent(App)`

## Required Production Architecture (Frontend-Only Default)

When backend is not explicitly requested:

- Build a frontend production architecture with repository boundaries.
- Use local repository implementations (in-memory/local persistence) behind interfaces.
- Keep UI independent from data-source details.

Recommended modules:

- Flow/state registry (typed state definitions and defaults).
- Navigation semantic adapter (`initial`, `transition`, params merge, back behavior).
- Repository interfaces + local implementations.
- Token registry for theme values.

## Semantic Invariants

Always preserve:

1. Explicit state machine coverage.
2. Deterministic params merge:
   - `finalParams = defaultParams + runtimeOverrides`
3. Valid history semantics for back navigation.
4. Interaction completeness (no dead controls).
5. Token-driven critical UI surfaces.

## Input and Output Mapping

Treat prototype files as semantic references:

- `prototype/src/data/blueprint.json` -> typed flow registry / route model.
- `prototype/src/data/store.json` -> repository contracts and local implementations.
- `prototype/src/data/theme.json` -> typed token registry.
- `prototype/src/core/app.ts` -> navigation semantic adapter and app shell logic.

## Execution Workflow

### Phase 1: Semantic Extraction

- Read prototype flow/data/theme/runtime semantics.
- Extract:
  - states and transitions
  - params defaults and override behavior
  - interactions and side effects
  - theme tokens and visual hierarchy

### Phase 2: Production Mapping

- Define boundaries:
  - navigation layer
  - domain/config layer
  - repository layer
  - presentation layer
- Plan names and stable IDs for state mapping.

### Phase 3: Implementation

- Implement `business/` production modules.
- Keep UI components focused on rendering + intent dispatch.
- Place root-level translation docs in `docs/` (repository root):
  - `docs/semantic-spec.md`
  - `docs/mapping-spec.md`
  - `docs/verification-report.md`

### Phase 4: Verification

Run at minimum:

- `pnpm install`
- `pnpm typecheck`
- Expo compatibility check (especially `react-native` patch alignment)

Validate:

- state coverage
- transition coverage
- params merge correctness
- interaction completeness
- token usage on critical screens

## Backend Decision Rule

- Default: no backend.
- Only add API/backend logic if user explicitly requests backend integration.
- If backend is requested:
  - keep existing repository interfaces
  - replace local repository implementations with API/server adapters
  - avoid rewriting presentation modules

## Output Contract

For each translation task, produce:

1. Production code in `business/`.
2. Root-level documents in `docs/`:
   - `semantic-spec.md`
   - `mapping-spec.md`
   - `verification-report.md`
3. Clear note of any semantic tradeoff:
   - what changed
   - why it changed
   - risk and mitigation

## Acceptance Checklist

- [ ] `pnpm` is used consistently.
- [ ] Expo default SDK target is 54 (with upgrade-ready version policy).
- [ ] `business/` does not depend on copied prototype JSON at runtime.
- [ ] `transitionTo` semantics preserve defaults + runtime override.
- [ ] `goBack` uses valid history behavior.
- [ ] All interactive elements have concrete behavior.
- [ ] Critical UI styling is token-driven.
- [ ] Root-level `docs/semantic-spec.md` exists.
- [ ] Root-level `docs/mapping-spec.md` exists.
- [ ] Root-level `docs/verification-report.md` exists.
