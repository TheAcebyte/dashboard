"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

interface Props {
  height?: number;
}

export default function SessionHistoryGraph({ height = 100 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => (canvas.width = canvas.offsetWidth);
    window.addEventListener("resize", resizeCanvas);
    return window.removeEventListener("resize", resizeCanvas);
  }, []);

  return <canvas height={height} className="w-full" ref={canvasRef}></canvas>;
}
