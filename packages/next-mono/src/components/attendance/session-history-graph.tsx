"use client";

import { env } from "@/constants/env";
import { PaginatedSessionRecord } from "@/db/queries/sessions";
import useInfinitePagination from "@/hooks/use-infinite-pagination";
import {
  clamp,
  getAttendanceRate,
  getCSSVariable,
  mapRange,
} from "@/lib/utils";
import useAttendanceGroupStore from "@/stores/attendance-group-store";
import { useSelectedSessionStore } from "@/stores/selected-session-store";
import { useEffect, useRef, useState } from "react";

const sessionEndpoint = new URL("/api/sessions", env.APP_URL);
const defaultLimit = 20;
const maxCanvasWidth = 1080;

interface Props {
  height?: number;
  lineWidth?: number;
  entrySpacing?: number;
  lineColor?: string;
  gradientColorTop?: string;
  gradientColorBottom?: string;
}

export default function SessionHistoryGraph({
  height = 400,
  entrySpacing = 50,
  lineWidth = 1,
}: Props) {
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

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offsetRef = useRef(0);
  const mouseXRef = useRef(maxCanvasWidth);
  const sessionIdRef = useRef("");
  const { sessionId, setSessionId } = useSelectedSessionStore();

  useEffect(() => {
    if (!paginate || sessionId) return;
    const [firstSession] = paginate.response.data;
    if (!firstSession) return;

    const firstSessionId = firstSession.sessionId;
    setSessionId(firstSessionId);
  }, [paginate?.response]);

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const getCoordinates = (index: number) => {
    if (!canvasRef.current || !paginate?.response) return [0, 0] as const;
    const canvas = canvasRef.current;
    const sessions = paginate.response.data;

    const offset = offsetRef.current;
    const session = sessions[index];
    const cursorOuterRadius = 6;
    const x = canvas.width - index * entrySpacing + offset;
    const y = mapRange(
      1 - getAttendanceRate(session),
      0,
      1,
      cursorOuterRadius,
      canvas.height - cursorOuterRadius,
    );

    return [x, y] as const;
  };

  const drawGraph = () => {
    if (!canvasRef.current || !paginate?.response) return;
    const canvas = canvasRef.current;
    const sessions = paginate.response.data;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const offset = offsetRef.current;
    const mouseX = mouseXRef.current;
    const scrolledEntries = offset / entrySpacing;
    const startIndex = Math.max(Math.floor(scrolledEntries), 0);
    const endIndex = Math.min(
      Math.ceil(scrolledEntries + canvas.width / entrySpacing),
      sessions.length - 1,
    );
    clearCanvas();

    // Draw grid lines
    const gridLineColor = getCSSVariable(canvas, "--default-border");
    const gridLineWidth = 200;
    const gridLineColumns = Math.floor(canvas.width / gridLineWidth) + 1;
    for (let i = 0; i < gridLineColumns; i++) {
      const x = canvas.width - i * gridLineWidth + (offset % gridLineWidth);
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.strokeStyle = gridLineColor;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    if (startIndex <= endIndex) {
      // Adding the background gradient below the graph
      const gradientColorTop = "rgba(123, 241, 168, 0.5)";
      const gradientColorBottom = "rgba(123, 241, 168, 0.05)";
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, gradientColorTop);
      gradient.addColorStop(1, gradientColorBottom);

      ctx.beginPath();
      for (let i = startIndex; i <= endIndex; i++) {
        const [x, y] = getCoordinates(i);
        const firstPoint = i == startIndex;
        const lastPoint = i == endIndex;
        if (firstPoint) ctx.moveTo(x, canvas.height);
        ctx.lineTo(x, y);
        if (lastPoint) ctx.lineTo(x, canvas.height);
      }
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      // Drawing the graph curve
      ctx.beginPath();
      for (let i = startIndex; i <= endIndex; i++) {
        const [x, y] = getCoordinates(i);
        const firstPoint = i == startIndex;
        if (firstPoint) ctx.moveTo(x, y);
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = getCSSVariable(canvas, "--accent-fg");
      ctx.lineWidth = lineWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();

      // Drawing the cursor
      const cursorInnerRadius = 4;
      const cursorOuterRadius = 6;
      const nearestSessionIndex = clamp(
        Math.round(
          ((canvas.width - mouseX + offset) * sessions.length) /
            (entrySpacing * (sessions.length - 1)),
        ),
        0,
        sessions.length - 1,
      );
      sessionIdRef.current = sessions[nearestSessionIndex].sessionId;
      const [roundedMouseX, roundedMouseY] =
        getCoordinates(nearestSessionIndex);

      ctx.beginPath();
      ctx.moveTo(roundedMouseX, 0);
      ctx.lineTo(roundedMouseX, canvas.height);
      ctx.strokeStyle = getCSSVariable(canvas, "--primary-fg");
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(roundedMouseX, roundedMouseY, cursorOuterRadius, 0, 2 * Math.PI);
      ctx.fillStyle = getCSSVariable(canvas, "--primary-fg");
      ctx.fill();

      ctx.beginPath();
      ctx.arc(roundedMouseX, roundedMouseY, cursorInnerRadius, 0, 2 * Math.PI);
      ctx.fillStyle = getCSSVariable(canvas, "--primary-bg");
      ctx.fill();
    }

    // Drawing the x-axis
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.strokeStyle = getCSSVariable(canvas, "--primary-fg");
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = height;
      drawGraph();
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [height, paginate?.response]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    let dragging = false;
    let lastX = 0;

    const getMouseCoordinates = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.x - rect.left;
      const y = e.y - rect.top;
      mouseXRef.current = x;
      return [x, y] as const;
    };

    const handleMouseDown = (e: MouseEvent) => {
      const [x] = getMouseCoordinates(e);
      lastX = x;
      dragging = true;
      canvas.style.cursor = "grabbing";
      document.body.style.cursor = "grabbing";
      drawGraph();
    };

    const handleMouseUp = (e: MouseEvent) => {
      dragging = false;
      canvas.style.cursor = "grab";
      document.body.style.cursor = "auto";
      if (e.target == canvas) setSessionId(sessionIdRef.current);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging && e.target != canvas) return;
      const [x] = getMouseCoordinates(e);
      if (dragging) {
        const dx = x - lastX;
        lastX = x;
        offsetRef.current += dx;
      }
      drawGraph();
    };

    drawGraph();
    canvas.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [paginate?.response]);

  return (
    <canvas height={height} className="w-full cursor-grab" ref={canvasRef} />
  );
}
