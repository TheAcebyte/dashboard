import { ServerAction } from "@/types/utils";
import { type FormEvent, useState } from "react";
import { z } from "zod";
import { init } from "zod-empty";

export default function useFormAction<T extends z.ZodRawShape, R>(
  action: ServerAction<z.infer<z.ZodObject<T>>, R>,
  schema: z.ZodObject<T>,
) {
  type FormFields = z.infer<typeof schema>;
  type FormFieldErrors =
    | z.inferFlattenedErrors<typeof schema>["fieldErrors"]
    | undefined;

  const defaultFields = init(schema);
  const [fields, setFields] = useState<FormFields>(defaultFields);
  const [errors, setErrors] = useState<FormFieldErrors>();
  const [response, setResponse] =
    useState<Awaited<ReturnType<typeof action>>>();

  const register =
    <K extends keyof FormFields>(field: K) =>
    (value: FormFields[K]) =>
      setFields((prevFields) => ({ ...prevFields, [field]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const parseResult = schema.safeParse(fields);
    if (!parseResult.success) {
      setErrors(parseResult.error.flatten().fieldErrors);
      return;
    }

    setErrors(undefined);
    const response = await action(fields);
    setResponse(response);
  };

  return {
    handleSubmit,
    register,
    response,
    errors,
  };
}
