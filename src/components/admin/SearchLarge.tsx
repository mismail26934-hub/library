import { Search } from "lucide-react";

interface SearchLargeProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchLarge({ value, onChange, placeholder = "Search", className }: SearchLargeProps) {
  return (
    <div
      className={
        "flex h-12 items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-white px-4 py-2 " +
        (className ?? "w-full max-w-[600px]")
      }
    >
      <Search className="size-5 shrink-0 text-[var(--color-ink-subtle)]" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm font-medium tracking-[-0.42px] text-[var(--color-ink)] placeholder:text-[var(--color-ink-subtle)] focus:outline-none"
      />
    </div>
  );
}
