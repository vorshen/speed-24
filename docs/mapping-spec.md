# Mapping Spec (Prototype -> Business)

## State Unit

- `prototype/src/data/blueprint.json` -> `business/src/domain/flow-registry.ts`
- Runtime resolver and transition adapter -> `business/src/core/navigation.ts`
- Rendering dispatcher -> `business/App.tsx`

## Param Unit

- Prototype default params and runtime override behavior preserved in:
  - `createState(...)`
  - `transitionState(...)`
- Deep-link query parsing and primitive coercion:
  - `parseRuntimeParams(...)`

## Data Unit

- `prototype/src/data/store.json` -> `business/src/domain/game-config.ts`
- Gameplay generation and difficulty time limits read from store contract in:
  - `business/src/screens/GameScreen.tsx`
  - `business/src/screens/DifficultyScreen.tsx`
- Current data source is `InMemory*Repository` for a backend-free production frontend.
- Future backend adoption only replaces repository implementation, not UI contracts.

## Theme Unit

- `prototype/src/data/theme.json` -> `business/src/domain/theme-tokens.ts`
- Token adapter in:
  - `business/src/core/theme.ts`
- Components consume centralized tokens:
  - `business/src/components/*`
  - `business/src/screens/*`

## Interaction Unit

- Home interactions -> `business/src/screens/HomeScreen.tsx`
- Difficulty selection + back -> `business/src/screens/DifficultyScreen.tsx`
- Game card/operator/action flows -> `business/src/screens/GameScreen.tsx`

## Navigation Port

- `navigate(targetStateId, params)` equivalent:
  - `transitionTo(...)` in `business/App.tsx`
- `back()` equivalent:
  - `goBack()` in `business/App.tsx`
