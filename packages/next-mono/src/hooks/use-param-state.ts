import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function useParamState(key: string, defaultValue: string) {
  const [value, setValue] = useState<string>(defaultValue);
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const pushValue = (value: string) => {
    const newParams = new URLSearchParams(params);
    newParams.set(key, value);
    const url = `${pathname}?${newParams.toString()}`;
    router.replace(url, { scroll: false });
    setValue(value);
  };

  useEffect(() => {
    if (!params.has(key)) return;
    const value = params.get(key)!;
    setValue(value);
  }, [router, pathname, params]);

  return [value, pushValue] as const;
}
