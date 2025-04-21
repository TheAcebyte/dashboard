export type ServerAction<T, R> = (payload: T) => Promise<R> | void;

export type ServerActionResponse = {
  success: boolean;
  message: string;
};

export type UnionOfProperties<
  O extends object,
  A extends O[],
  P extends keyof O,
> = Pick<A[number], P>[P];

export type FirstArrayElementInObject<T extends { [k: string]: unknown[] }> = {
  [k in keyof T]: T[k] extends [infer F, ...infer R] ? F : never;
};
