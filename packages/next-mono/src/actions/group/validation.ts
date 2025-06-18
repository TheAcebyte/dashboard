import type { TranslationFunction } from "@/types/utils";
import { z } from "zod";

export const getGroupSchema = (t: TranslationFunction<"database-page">) => {
  return z.object({
    name: z.string().nonempty(t("group-dialog-name-error-required")),
  });
};

export type GroupFields = z.infer<ReturnType<typeof getGroupSchema>>;
