import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function delay(seconds: number) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

const imageMime = ["image/png", "image/jpeg", "image/jpg"];

export function isImage(file: File) {
  return imageMime.includes(file.type);
}
