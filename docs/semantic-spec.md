# Semantic Spec

## States

- `home`: main menu, starts single-player flow.
- `difficulty`: choose difficulty level.
- `game`: gameplay state with params and runtime interaction.

## Params

- `game.level`: `easy | medium | hard` (default `medium`).
- `game.isGameOver`: boolean default `false`.
- `game.isWin`: boolean default `false`.
- `game.showSolution`: boolean default `false`.

## Transition semantics

- `transitionTo(targetStateId, params?)`:
  - Find target state in blueprint.
  - Read state default params.
  - Merge runtime override on top of defaults.
  - Push resulting state to history stack.
- `goBack()`:
  - Pop previous state from history stack when available.
  - If stack has one element, remain in current state.

## Data and theme boundaries

- Flow contract: `src/domain/flow-registry.ts`
- Business data contract: `src/domain/game-config.ts`
- Visual token contract: `src/domain/theme-tokens.ts`
- Current implementation is frontend-only and uses in-memory repositories behind interfaces.

## Interaction completeness

- Home: Single Player button transitions to `difficulty`.
- Difficulty: each option transitions to `game` with `level`.
- Game: cards/operators/actions all map to concrete logic.
- End overlay: Next Level (new solvable round), Quit To Menu (`home`).
