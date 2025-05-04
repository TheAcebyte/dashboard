export type VoidCallback<T> = (args: T) => void;

export type Timeout = ReturnType<typeof setTimeout>;

export type ServerAction<T, R> = (payload: T) => Promise<R>;

export type ServerActionResponse = {
  success: boolean;
  message: string;
};
