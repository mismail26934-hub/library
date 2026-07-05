import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNowStrict, isBefore } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Instantly reset window scroll — bypasses global smooth-scroll CSS. */
export function scrollToTop() {
  const html = document.documentElement;
  const previous = html.style.scrollBehavior;
  html.style.scrollBehavior = "auto";
  window.scrollTo(0, 0);
  html.scrollTop = 0;
  document.body.scrollTop = 0;
  html.style.scrollBehavior = previous;
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "-";
  try {
    return format(new Date(date), "dd MMM yyyy");
  } catch {
    return "-";
  }
}

export function formatDueDate(date: string | Date | null | undefined): string {
  if (!date) return "-";
  try {
    return format(new Date(date), "dd MMMM yyyy");
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

export function formatReviewDate(date: string | Date | null | undefined): string {
  if (!date) return "-";
  try {
    return format(new Date(date), "dd MMMM yyyy, HH:mm");
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
