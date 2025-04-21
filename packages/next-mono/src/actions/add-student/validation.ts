import { z } from "zod";

const CNERegex = /^[A-Z][0-9]{9}$/;

export const studentSchema = z.object({
  firstName: z.string().nonempty("First name is required."),
  lastName: z.string().nonempty("Last name is required."),
  cne: z.string().nonempty("CNE is required.").regex(CNERegex, "Invalid CNE."),
  birthDate: z
    .string()
    .nonempty("Date is required.")
    .refine((usLocaleDate) => {
      const date = new Date(usLocaleDate);
      return !isNaN(date.getDate());
    }, "Invalid date."),
  group: z.string().nonempty("Group is required."),
  file: z.instanceof(File),
});

export type StudentFields = z.infer<typeof studentSchema>;
