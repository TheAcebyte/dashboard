import useVisibilityChange from "@/hooks/use-visibility-change";
import { useEffect, useState } from "react";

type VoidCallback = () => void;

export default function usePolling(callback: VoidCallback, ms: number) {
  const [pollingCounter, setPollingCounter] = useState(0);
  const visible = useVisibilityChange();

  useEffect(() => {
    if (!visible) return;
    const pollingCallback = () => {
      callback();
      setPollingCounter((pollingCounter) => pollingCounter + 1);
    };

    const intervalId = setInterval(pollingCallback, ms);
    return () => clearInterval(intervalId);
  }, [visible, callback, ms]);

  return pollingCounter;
}
