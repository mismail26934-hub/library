import type { LoanStatus } from "@/types";
import { cn } from "@/lib/utils";

const config: Record<string, { label: string; className: string }> = {
  BORROWED: { label: "Active", className: "bg-[rgba(36,165,0,0.05)] text-[#24a500]" },
  RETURNED: { label: "Returned", className: "bg-[rgba(36,165,0,0.05)] text-[#24a500]" },
  LATE: { label: "Overdue", className: "bg-[rgba(238,29,82,0.05)] text-[#ee1d52]" },
  OVERDUE: { label: "Overdue", className: "bg-[rgba(238,29,82,0.05)] text-[#ee1d52]" },
};

export function LoanStatusBadge({ status }: { status: LoanStatus | string }) {
  const c = config[status] ?? { label: status, className: "bg-secondary text-[var(--color-ink)]" };
  return (
    <span
      className={cn(
        "inline-flex h-8 items-center justify-center rounded px-2 text-sm font-bold tracking-[-0.28px]",
        c.className,
      )}
    >
      {c.label}
    </span>
  );
}
