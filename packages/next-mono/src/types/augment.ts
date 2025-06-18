interface Array<T> {
  map<U>(
    callbackfn: (value: T, index: number, tuple: T[] | [T]) => U,
    thisArg?: any,
  ): { [K in keyof this]: U };
}
