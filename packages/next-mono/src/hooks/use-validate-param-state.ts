import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";

export default function useValidateParamState<T extends z.ZodType>(
  key: string,
  schema: T,
  defaultValue: z.infer<T>,
) {
  const [value, setValue] = useState<z.infer<T>>(defaultValue);
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const pushValue = (value: z.infer<T>) => {
    const newParams = new URLSearchParams(params);
    newParams.set(key, value);
    const url = `${pathname}?${newParams.toString()}`;
    router.replace(url);
    setValue(value);
  };

  useEffect(() => {
    if (!params.has(key)) return;
    const value = params.get(key)!;

    const parseResult = schema.safeParse(value);
    if (!parseResult.success) return;

    setValue(value as z.infer<T>);
  }, [router, pathname, params]);

  return [value, pushValue] as const;
}
