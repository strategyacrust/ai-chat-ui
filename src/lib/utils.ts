import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fmtDate(time: Date | number) {
  const t = typeof time == "number" ? new Date(time) : time;
  return `${t.toLocaleString("zh")}`;
}
