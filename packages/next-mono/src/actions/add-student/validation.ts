import { isImage } from "@/lib/utils";
import { z } from "zod";

const CNERegex = /^[A-Z][0-9]{9}$/;

export const studentSchema = z.object({
  firstName: z.string().nonempty("First name is required."),
  lastName: z.string().nonempty("Last name is required."),
  cne: z.string().nonempty("CNE is required.").regex(CNERegex, "Invalid CNE."),
  birthDate: z
    .string()
    .nonempty("Date is required.")
    .refine((date) => {
      const [day, month, year] = date.split("/").map((part) => parseInt(part));
      if (!day || !month || !year) return false;
      return day >= 1 && day <= 31 && month >= 1 && month <= 12 && year >= 1;
    }, "Invalid date."),
  group: z.string().nonempty("Group is required."),
  picture: z.instanceof(File).refine(isImage),
});

export type StudentFields = z.infer<typeof studentSchema>;
