import type { TranslationFunction } from "@/types/utils";
import { z } from "zod";

const CNERegex = /^[A-Z][0-9]{9}$/;

export const getStudentSchema = (t: TranslationFunction<"database-page">) => {
  return z.object({
    firstName: z
      .string()
      .nonempty(t("student-dialog-first-name-error-required")),
    lastName: z.string().nonempty(t("student-dialog-last-name-error-required")),
    cne: z
      .string()
      .nonempty(t("student-dialog-cne-error-required"))
      .regex(CNERegex, t("student-dialog-cne-error-invalid")),
    birthDate: z
      .string()
      .nonempty(t("student-dialog-birthdate-error-required"))
      .refine((euLocaleDate) => {
        const day = euLocaleDate.slice(0, 2);
        const month = euLocaleDate.slice(2, 4);
        const year = euLocaleDate.slice(4);
        const usLocaleDate = `${month}/${day}/${year}`;
        const date = new Date(usLocaleDate);
        return !isNaN(date.getDate());
      }, t("student-dialog-birthdate-error-invalid")),
    groupId: z.string().nonempty(t("student-dialog-group-label")),
    file: z.instanceof(File, {
      message: t("student-dialog-file-error-required"),
    }),
  });
};

export type StudentFields = z.infer<ReturnType<typeof getStudentSchema>>;
