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
    <div className="-mx-4 flex flex-nowrap items-center gap-2 overflow-x-auto px-4 md:mx-0 md:gap-3 md:overflow-visible md:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "flex h-10 shrink-0 items-center justify-center rounded-full border px-3 text-sm tracking-[-0.28px] transition-colors md:px-4 md:text-base md:tracking-[-0.32px]",
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
