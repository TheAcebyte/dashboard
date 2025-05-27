import { TranslationFunction } from "@/types/utils";
import { z } from "zod";

export const getSessionSchema = (t: TranslationFunction<"attendance-page">) => {
  return z.object({
    group: z.string().nonempty(t("session-dialog-group-error-required")),
    name: z.string().nonempty(t("session-dialog-name-error-required")),
    duration: z.number().nullable(),
    lateThreshold: z.number().nullable(),
  });
};

export type SessionFields = z.infer<ReturnType<typeof getSessionSchema>>;

export const getExcuseStudentSchema = (
  t: TranslationFunction<"attendance-page">,
) => {
  return z.object({
    excuse: z
      .string()
      .nonempty(t("student-dialog-excuse-error-required"))
      .max(100, t("student-dialog-excuse-error-long")),
  });
};

export type ExcuseStudentFields = z.infer<
  ReturnType<typeof getExcuseStudentSchema>
>;
