import { cn } from "@/lib/utils";

export interface FilterPillOption {
  label: string;
  value: string;
}

interface FilterPillsProps {
  options: FilterPillOption[];
  value: string;
  onChange: (value: string) => void;
}

export function FilterPills({ options, value, onChange }: FilterPillsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 md:gap-3">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "flex h-10 items-center justify-center rounded-full border px-4 text-sm tracking-[-0.28px] transition-colors md:text-base md:tracking-[-0.32px]",
              active
                ? "border-[var(--color-primary)] bg-[#f6f9fe] font-bold text-[var(--color-primary)]"
                : "border-[var(--color-border)] font-semibold text-[var(--color-ink)] hover:bg-secondary",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
