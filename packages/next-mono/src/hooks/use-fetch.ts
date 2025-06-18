import { useEffect, useState } from "react";

type FetchCallback<T> = () => Promise<T>;

interface UseFetchOptions {
  refetchCounter?: number;
}

export default function useFetch<T>(
  callback: FetchCallback<T>,
  options?: UseFetchOptions,
) {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await callback();
        setData(data);
        setError(null);
      } catch (e) {
        const error = e instanceof Error ? e : new Error(`${e}`);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [callback, options?.refetchCounter]);

  return { data, error, isLoading };
}
