import type { VoidCallback, Timeout } from "@/types/utils";
import { useRef } from "react";

export default function useDebounce<T>(callback: VoidCallback<T>, delay: number) {
  const timeoutIdRef = useRef<Timeout | null>(null);
  return (args: T) => {
    if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
    timeoutIdRef.current = setTimeout(() => callback(args), delay);
  };
}
