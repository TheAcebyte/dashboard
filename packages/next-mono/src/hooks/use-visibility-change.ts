import { useEffect, useState } from "react";

export default function useVisibilityChange() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const setVisibility = () => setVisible(!document.hidden);
    addEventListener("visibilitychange", setVisibility);
    return () => removeEventListener("visibilitychange", setVisibility);
  }, []);

  return visible;
}
