# Flow 24 Business App (Expo SDK 54)

Production translation of `prototype/` into a React Native application using Expo Go (SDK 54).

## Stack

- React Native
- Expo Go (`expo` `~54.0.0`)
- TypeScript

## Run

```bash
pnpm install
pnpm start
```

Then scan the QR code with Expo Go on a mobile device.

## Semantic guarantees implemented

- Explicit state machine: `home` -> `difficulty` -> `game`
- Deterministic param merge on transition: `finalParams = defaults + runtimeOverrides`
- Real history back behavior via stack-based `goBack()`
- Production boundaries (frontend-only, no backend required now):
  - `src/domain/flow-registry.ts` (flow definition)
  - `src/domain/game-config.ts` (in-memory repositories)
  - `src/domain/theme-tokens.ts` (design tokens)
