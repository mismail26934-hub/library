import type { LoanStatus } from "@/types";
import { cn } from "@/lib/utils";

const config: Record<string, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-[rgba(36,165,0,0.05)] text-[#24a500]" },
  BORROWED: { label: "Active", className: "bg-[rgba(36,165,0,0.05)] text-[#24a500]" },
  returned: { label: "Returned", className: "bg-[rgba(36,165,0,0.05)] text-[#24a500]" },
  RETURNED: { label: "Returned", className: "bg-[rgba(36,165,0,0.05)] text-[#24a500]" },
  overdue: { label: "Overdue", className: "bg-[rgba(238,29,82,0.05)] text-[#ee1d52]" },
  LATE: { label: "Overdue", className: "bg-[rgba(238,29,82,0.05)] text-[#ee1d52]" },
  OVERDUE: { label: "Overdue", className: "bg-[rgba(238,29,82,0.05)] text-[#ee1d52]" },
};

export function LoanStatusBadge({ status }: { status: LoanStatus | string }) {
  const key = String(status).toLowerCase();
  const c = config[key] ?? config[status] ?? { label: status, className: "bg-secondary text-[var(--color-ink)]" };
  return (
    <span
      className={cn(
        "inline-flex h-8 items-center justify-center rounded-[4px] px-2 py-[2px] text-sm font-bold leading-7 tracking-[-0.28px]",
        c.className,
      )}
    >
      {c.label}
    </span>
  );
}
