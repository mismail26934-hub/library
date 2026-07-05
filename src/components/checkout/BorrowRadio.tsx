import { cn } from "@/lib/utils";

interface BorrowRadioProps {
  checked: boolean;
  onChange: () => void;
  label: string;
}

export function BorrowRadio({ checked, onChange, label }: BorrowRadioProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      onClick={onChange}
      className="flex items-center gap-[15px] text-left"
    >
      <span
        className={cn(
          "relative size-6 shrink-0 rounded-full border transition-colors",
          checked
            ? "border-transparent bg-[#1c65da]"
            : "border-[#a4a7ae] bg-white",
        )}
      >
        {checked && (
          <span className="absolute inset-[30%] rounded-full bg-white" />
        )}
      </span>
      <span className="text-base font-semibold tracking-[-0.32px] text-[var(--color-ink)]">
        {label}
      </span>
    </button>
  );
}
