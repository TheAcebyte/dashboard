export type UnionOfProperties<
  O extends object,
  A extends O[],
  P extends keyof O,
> = Pick<A[number], P>[P];
