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

export function formatEuDate(date: Date) {
  const day = date.getDate().toString().padStart(2, "0");
  // JavaScript just had to mess it up at 1-indexed months
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString().padStart(4, "0");
  return `${day}${month}${year}`;
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
