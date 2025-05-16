"use client";

import { cst } from "@/constants";
import { PaginatedSessionRecord } from "@/db/queries/sessions";
import useInfinitePagination from "@/hooks/use-infinite-pagination";
import { getAttendanceRate } from "@/lib/utils";
import useAttendanceGroupStore from "@/stores/attendance-group-store";
import { useEffect, useRef, useState } from "react";

const sessionEndpoint = new URL("/api/sessions", cst.APP_URL);
const defaultLimit = 20;

interface Props {
  height?: number;
  entryRadius?: number;
}

export default function SessionHistoryGraph({
  height = 400,
  entryRadius = 10,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { group } = useAttendanceGroupStore();
  const [queryParams, setQueryParams] = useState<Record<string, string>>();
  useEffect(() => {
    setQueryParams({ group: group, status: "ended" });
  }, [group]);

  const paginate = useInfinitePagination<PaginatedSessionRecord>(
    sessionEndpoint,
    defaultLimit,
    { queryParams },
  );
  const responseDependency = paginate?.response;

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const resizeCanvas = () => {
      const width = canvas.getBoundingClientRect().width;
      canvas.width = width;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !paginate) return;
    const canvas = canvasRef.current;
    const data = paginate.response.data;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const getCanvasWidth = () => canvas.getBoundingClientRect().width;
    let isClicking = false;
    let previousPosition = getCanvasWidth();
    let offset = 0;

    const clearCanvas = () => {
      const canvasWidth = getCanvasWidth();
      ctx.clearRect(0, 0, canvasWidth, height);
    };

    const drawGraph = () => {
      const canvasWidth = getCanvasWidth();
      const shownEntries = Math.ceil(canvasWidth / (2 * entryRadius));
      const start = Math.floor((offset * shownEntries) / canvasWidth);
      const end = start + shownEntries;
      const slicedData = data.slice(start, end);

      clearCanvas();
      ctx.beginPath();
      slicedData.forEach((session, index) => {
        const xValue = (shownEntries - 1 - index) * 2 * entryRadius;
        const yValue = height * (1 - getAttendanceRate(session));
        console.log(xValue, yValue);
        ctx.lineTo(xValue, yValue);
      });
      ctx.strokeStyle = "black";
      ctx.stroke();
    };

    const handleMouseDown = (e: MouseEvent) => {
      isClicking = true;
      previousPosition = e.x;
    };
    const handleMouseUp = () => {
      isClicking = false;
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (!isClicking) return;
      // Here, x-axis is increasing from right to left
      offset += previousPosition - e.x;
      previousPosition = e.x;
      drawGraph();
    };

    drawGraph();
    canvas.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousemove", handleMouseMove);
      clearCanvas();
    };
  }, [responseDependency]);

  return (
    <canvas
      height={height}
      className="w-full bg-green-50"
      ref={canvasRef}
    ></canvas>
  );
}
