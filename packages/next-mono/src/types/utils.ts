import { type Messages, type NamespaceKeys, useTranslations } from "next-intl";

export type VoidCallback<T = unknown> = (args: T) => void;

export type Timeout = ReturnType<typeof setTimeout>;

export type ServerAction<T, R> = (payload: T) => Promise<R>;

export type ServerActionResponse = {
  success: boolean;
  message: string;
};

export type TranslationFunction<T extends keyof Messages> = ReturnType<
  typeof useTranslations<NamespaceKeys<Messages, T>>
>;
