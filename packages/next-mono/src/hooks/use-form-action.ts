import type { ServerAction } from "@/types/utils";
import { type FormEvent, useState } from "react";
import { z } from "zod";
import { init } from "zod-empty";

export default function useFormAction<T extends z.ZodRawShape, R>(
  action: ServerAction<z.infer<typeof schema>, R>,
  schema: z.ZodObject<T>,
  partialDefaultFields?: Partial<z.infer<typeof schema>>,
) {
  type FormFields = z.infer<typeof schema>;
  type FormFieldErrors = Partial<Record<keyof FormFields, string>>;
  const defaultFields = { ...init(schema), ...partialDefaultFields };
  const [fields, setFields] = useState<FormFields>(defaultFields);
  const [errors, setErrors] = useState<FormFieldErrors>({});
  const [response, setResponse] = useState<R>();

  const setters = Object.fromEntries(
    Object.keys(fields).map(<K extends keyof FormFields>(field: K) => {
      return [
        field,
        (value: FormFields[K]) =>
          setFields((prevFields) => ({ ...prevFields, [field]: value })),
      ];
    }),
  ) as { [K in keyof FormFields]: (value: FormFields[K]) => void };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const parseResult = schema.safeParse(fields);
    if (!parseResult.success) {
      const flattenedErrors = parseResult.error.flatten().fieldErrors;
      const firstErrors = Object.fromEntries(
        Object.entries(flattenedErrors).map(([field, errors]) => {
          const [firstError] = errors as string[];
          return [field, firstError];
        }),
      ) as Partial<Record<keyof FormFields, string>>;
      setErrors(firstErrors);
      return;
    }

    const response = await action(fields);
    setResponse(response);
    setErrors({});
  };

  const reset = () => setFields(defaultFields);

  return {
    handleSubmit,
    fields,
    setters,
    response,
    errors,
    reset,
  };
}
