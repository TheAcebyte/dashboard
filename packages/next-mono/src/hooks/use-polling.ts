import { VoidCallback } from "@/types/utils";
import { useEffect, useState } from "react";

export default function usePolling(callback: VoidCallback, ms: number) {
  const [hidden, setHidden] = useState(document.hidden);
  useEffect(() => {
    const handleChange = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", handleChange);
    return document.removeEventListener("visibilitychange", handleChange);
  }, []);

  useEffect(() => {
    if (hidden) return;
    const intervalId = setInterval(callback, ms);
    return () => clearInterval(intervalId);
  }, [hidden, callback, ms]);
}
