import { useEffect, useState } from "react";

type FetchCallback<T> = () => Promise<T>;

export default function useFetch<T>(callback: FetchCallback<T>) {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<Error | null>();
  const [isLoading, setIsLoading] = useState(true);
  const [volatile, setVolatile] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await callback();
        setData(data);
      } catch (e) {
        const error = e instanceof Error ? e : new Error(`${e}`);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [callback, volatile]);

  const refetch = () => setVolatile({});
  return { data, error, isLoading, refetch };
}
