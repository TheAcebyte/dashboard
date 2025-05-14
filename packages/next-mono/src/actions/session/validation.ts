import { z } from "zod";

export const sessionSchema = z.object({
  group: z.string().nonempty("Group is required."),
  name: z.string().nonempty("Name is required."),
  duration: z.number().nullable(),
  lateThreshold: z.number().nullable(),
});

export type SessionFields = z.infer<typeof sessionSchema>;

export const excuseStudentSchema = z.object({
  excuse: z
    .string()
    .nonempty("Excuse is required.")
    .max(100, "Excuse is too long."),
});

export type ExcuseStudentFields = z.infer<typeof excuseStudentSchema>;
