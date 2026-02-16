import type { FlowRegistry, FlowStateId } from "../domain/flow-registry";
import type { AppState, Params, Primitive } from "./types";

const toPrimitive = (raw: string): Primitive => {
  if (raw === "true") {
    return true;
  }
  if (raw === "false") {
    return false;
  }
  const maybeNumber = Number(raw);
  if (!Number.isNaN(maybeNumber) && raw.trim() !== "") {
    return maybeNumber;
  }
  return raw;
};

export const parseRuntimeParams = (rawUrl: string): Record<string, Primitive> => {
  const queryStart = rawUrl.indexOf("?");
  if (queryStart < 0) {
    return {};
  }

  const query = rawUrl.slice(queryStart + 1);
  const params = new URLSearchParams(query);
  const runtime: Record<string, Primitive> = {};
  params.forEach((value, key) => {
    if (key !== "state" && key !== "page") {
      runtime[key] = toPrimitive(value);
    }
  });
  return runtime;
};

export const createState = (
  pageState: { id: string; name: string; page: string; defaultParams?: Params },
  runtimeParams?: Record<string, Primitive>,
): AppState => {
  const defaultParams = pageState.defaultParams ?? {};
  return {
    id: pageState.id,
    name: pageState.name,
    page: pageState.page,
    params: {
      ...defaultParams,
      ...(runtimeParams ?? {}),
    },
  };
};

export const resolveInitialState = (
  registry: FlowRegistry,
  preferredStateId?: string | null | FlowStateId,
  runtimeParams?: Record<string, Primitive>,
): AppState => {
  const targetId = (preferredStateId ?? registry.initialStateId) as FlowStateId;
  const state = registry.states[targetId];
  if (!state) {
    throw new Error(`State "${targetId}" not found in flow registry`);
  }
  return createState(state, runtimeParams);
};

export const transitionState = (
  registry: FlowRegistry,
  targetStateId: string,
  runtimeParams?: Params,
): AppState => {
  const state = registry.states[targetStateId as FlowStateId];
  if (!state) {
    throw new Error(`State "${targetStateId}" not found in flow registry`);
  }
  return createState(state, runtimeParams);
};
