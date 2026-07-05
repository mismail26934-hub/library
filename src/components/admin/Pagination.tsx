import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  total?: number;
  limit?: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

/** Builds a compact page list like: 1 2 3 … 10 */
function getPageItems(page: number, totalPages: number): (number | "...")[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const items: (number | "...")[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);
  if (start > 2) items.push("...");
  for (let i = start; i <= end; i++) items.push(i);
  if (end < totalPages - 1) items.push("...");
  items.push(totalPages);
  return items;
}

export function Pagination({
  page,
  totalPages,
  total,
  limit = 10,
  onPageChange,
  disabled,
}: PaginationProps) {
  if (totalPages <= 1 && !total) return null;

  const from = total ? (page - 1) * limit + 1 : 0;
  const to = total ? Math.min(page * limit, total) : 0;
  const items = getPageItems(page, Math.max(totalPages, 1));

  return (
    <div className="flex flex-col items-center justify-between gap-4 px-2 py-2 sm:flex-row sm:px-6">
      {total != null && (
        <p className="text-sm font-medium tracking-[-0.48px] text-[var(--color-ink)] md:text-base">
          Showing {from} to {to} of {total} entries
        </p>
      )}
      <div className="flex items-center gap-4">
        <button
          type="button"
          disabled={disabled || page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="flex items-center gap-1.5 text-sm font-medium tracking-[-0.48px] text-[var(--color-ink)] disabled:opacity-40 md:text-base"
        >
          <ChevronLeft className="size-6" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        <div className="flex items-center">
          {items.map((it, idx) =>
            it === "..." ? (
              <span
                key={`dots-${idx}`}
                className="flex size-10 items-center justify-center text-base text-[var(--color-ink)]"
              >
                …
              </span>
            ) : (
              <button
                key={it}
                type="button"
                disabled={disabled}
                onClick={() => onPageChange(it)}
                className={cn(
                  "flex size-10 items-center justify-center rounded-[10px] text-base tracking-[-0.48px] transition-colors",
                  it === page
                    ? "border border-[var(--color-border)] font-bold text-[var(--color-ink)]"
                    : "font-medium text-[var(--color-ink)] hover:bg-secondary",
                )}
              >
                {it}
              </button>
            ),
          )}
        </div>

        <button
          type="button"
          disabled={disabled || page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="flex items-center gap-1.5 text-sm font-medium tracking-[-0.48px] text-[var(--color-ink)] disabled:opacity-40 md:text-base"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="size-6" />
        </button>
      </div>
    </div>
  );
}
