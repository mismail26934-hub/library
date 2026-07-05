import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function FilterCheckbox({
  checked,
  onClick,
  label,
  className,
  children,
}: {
  checked: boolean;
  onClick: () => void;
  label?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={onClick}
      className={cn("flex w-full items-center gap-2 text-left", className)}
    >
      <span
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-[6px] border transition-colors",
          checked
            ? "border-transparent bg-[#1c65da] text-white"
            : "border-[#a4a7ae] bg-white hover:border-[#1c65da]",
        )}
      >
        {checked && <Check className="size-3.5" strokeWidth={3} />}
      </span>
      {children ?? (
        <span className="text-base font-medium tracking-[-0.48px] text-[var(--color-ink)]">
          {label}
        </span>
      )}
    </button>
  );
}
