"use client";

import endSession from "@/actions/session/end-session";
import useVisibilityChange from "@/hooks/use-visibility-change";
import { splitTimeFromSeconds } from "@/lib/date";
import { cn, mapRange, onlyContainsCharacter } from "@/lib/utils";
import { useSessionRefetchStore } from "@/stores/refetch-store";
import { AlarmClock } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { getCSSVariable } from "@/lib/utils"

interface Props {
  sessionId: string;
  startedAt: number;
  plannedDuration: number;
  size?: number;
  thickness?: number;
  emptyColor?: string;
  fillColor?: string;
}

export default function SessionTimerCard({
  sessionId,
  startedAt,
  plannedDuration,
  size = 200,
  thickness = 8,
}: Props) {
  const t = useTranslations("attendance-page");
  const roundedStartTime = Math.round(startedAt / 1000);
  const roundedDuration = Math.round(plannedDuration / 1000);
  const [remainingTime, setRemainingTime] = useState(1);
  const visible = useVisibilityChange();
  const { refetch } = useSessionRefetchStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const currentTime = Math.round(Date.now() / 1000);
    let remainingTime = roundedStartTime + roundedDuration - currentTime;
    if (remainingTime <= 0) {
      endSession(sessionId).then(refetch);
      return;
    }

    setRemainingTime(remainingTime);
    const intervalId = setInterval(() => {
      if (remainingTime <= 0) {
        endSession(sessionId).then(refetch);
      } else {
        remainingTime--;
        setRemainingTime(remainingTime);
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, [startedAt, plannedDuration, visible]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const center = Math.floor(size / 2);
    const radius = Math.floor(size / 2) - Math.floor(thickness / 2);
    const emptyColor = getCSSVariable(canvasRef.current, "--default-border");
    const fillColor = getCSSVariable(canvasRef.current, "--primary-fg");
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, 2 * Math.PI);
    ctx.lineWidth = thickness;
    ctx.strokeStyle = emptyColor;
    ctx.stroke();

    const fillAngle = mapRange(
      remainingTime,
      0,
      roundedDuration,
      -Math.PI / 2,
      (3 * Math.PI) / 2,
    );
    ctx.beginPath();
    ctx.arc(center, center, radius, -Math.PI / 2, fillAngle);
    ctx.lineWidth = thickness;
    ctx.strokeStyle = fillColor;
    ctx.stroke();

    return () => ctx.clearRect(0, 0, size, size);
  }, [remainingTime]);

  const splitTime = splitTimeFromSeconds(remainingTime);
  const isUnderAnHour = onlyContainsCharacter(splitTime.hours, "0");
  const isUnderAMinute =
    isUnderAnHour && onlyContainsCharacter(splitTime.minutes, "0");
  const isUnderASecond =
    isUnderAnHour &&
    isUnderAMinute &&
    onlyContainsCharacter(splitTime.seconds, "0");

  return (
    <div className="border-default-border rounded-2xl border px-8 py-4">
      <header className="text-secondary-fg flex items-center gap-2 font-medium">
        <AlarmClock size={20} />
        <h1>{t("time-remaining")}</h1>
      </header>
      <div className="relative mt-8">
        <canvas width={size} height={size} ref={canvasRef}></canvas>
        <div className="absolute top-1/2 left-1/2 -translate-1/2 text-[32px] font-semibold">
          <span
            className={cn(
              "text-primary-fg",
              isUnderAnHour && "text-secondary-fg",
            )}
          >
            {splitTime.hours}:
          </span>
          <span
            className={cn(
              "text-primary-fg",
              isUnderAMinute && "text-secondary-fg",
            )}
          >
            {splitTime.minutes}:
          </span>
          <span
            className={cn(
              "text-primary-fg",
              isUnderASecond && "text-secondary-fg",
            )}
          >
            {splitTime.seconds}
          </span>
        </div>
      </div>
    </div>
  );
}
