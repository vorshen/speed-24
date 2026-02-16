export type Primitive = string | number | boolean;

export type Params = Record<string, Primitive>;

export interface AppState {
  id: string;
  name: string;
  page: string;
  params: Params;
}
