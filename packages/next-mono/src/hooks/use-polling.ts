import useVisibilityChange from "@/hooks/use-visibility-change";
import { VoidCallback } from "@/types/utils";
import { useEffect, useState } from "react";

export default function usePolling(callback: VoidCallback, ms: number) {
  const visible = useVisibilityChange();

  useEffect(() => {
    if (!visible) return;
    const intervalId = setInterval(callback, ms);
    return () => clearInterval(intervalId);
  }, [visible, callback, ms]);
}
