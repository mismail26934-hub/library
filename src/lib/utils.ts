import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNowStrict, isBefore } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "-";
  try {
    return format(new Date(date), "dd MMM yyyy");
  } catch {
    return "-";
  }
}

export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return "-";
  try {
    return format(new Date(date), "dd MMM yyyy, HH:mm");
  } catch {
    return "-";
  }
}

export function fromNow(date: string | Date | null | undefined): string {
  if (!date) return "-";
  try {
    return formatDistanceToNowStrict(new Date(date), { addSuffix: true });
  } catch {
    return "-";
  }
}

export function isOverdue(
  dueAt: string | Date | null | undefined,
  status: string,
): boolean {
  if (!dueAt || status === "RETURNED") return false;
  return isBefore(new Date(dueAt), new Date());
}

export function getInitials(name?: string | null): string {
  if (!name) return "U";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
}
