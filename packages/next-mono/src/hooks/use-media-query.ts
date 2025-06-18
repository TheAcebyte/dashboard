import { useEffect, useState } from "react";

type MediaQueryMatch = "match" | "no-match" | "server";

export default function useMediaQuery(query: string) {
  const [match, setMatch] = useState<MediaQueryMatch>("server");
  
  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const updateMatch = () =>
      setMatch(mediaQuery.matches ? "match" : "no-match");
    updateMatch();

    mediaQuery.addEventListener("change", updateMatch);
    return () => mediaQuery.removeEventListener("change", updateMatch);
  }, []);

  return match;
}
