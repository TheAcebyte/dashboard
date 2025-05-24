import type { Session } from "@/db/queries/sessions";
import type { TranslationFunction } from "@/types/utils";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function delay(seconds: number) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

export function getAge(birthday: Date) {
  const ageDiffMs = Date.now() - birthday.getTime();
  const ageToDate = new Date(ageDiffMs);
  return Math.abs(ageToDate.getUTCFullYear() - new Date(0).getUTCFullYear());
}

export function getOrdinalSuffix(ordinal: number) {
  switch (ordinal % 10) {
    case 1:
      return "st";

    case 2:
      return "nd";

    case 3:
      return "rd";

    default:
      return "th";
  }
}

export function onlyContainsCharacter(string: string, target: string) {
  for (const character of string) {
    if (character != target) return false;
  }

  return true;
}

export function iterator(n: number) {
  return [...Array(n)];
}

export function range(start: number, end: number, step: number = 1) {
  const array = [];
  for (let i = start; i < end; i += step) {
    array.push(i);
  }

  return array;
}

export function padEndArray<T>(array: T[], value: T, length: number) {
  for (let i = array.length; i < length; i++) {
    array.push(value);
  }

  return array;
}

export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
) {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

export function capitalize(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function getAttendanceRate(session: Session) {
  const attendanceRate =
    (session.presentStudentsCount + session.lateStudentsCount) /
    (session.studentCount - session.excusedStudentsCount);

  return isNaN(attendanceRate) ? 0 : attendanceRate;
}

export function round(value: number, near: number) {
  return Math.round(value / near) * near;
}

export function clamp(value: number, min: number, max: number) {
  if (value <= min) return min;
  if (value >= max) return max;
  return value;
}
