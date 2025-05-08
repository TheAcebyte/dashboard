import { z } from "zod";

export const groupSchema = z.object({
  name: z.string().nonempty("Name is required."),
});

export type GroupFields = z.infer<typeof groupSchema>;
