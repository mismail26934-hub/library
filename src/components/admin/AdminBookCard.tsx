import { useEffect, useRef, useState, type ReactNode } from "react";
import { MoreHorizontal, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Book } from "@/types";

interface AdminBookCardProps {
  book: Book;
  onPreview: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function AdminBookCard({ book, onPreview, onEdit, onDelete }: AdminBookCardProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const closeAnd = (action: () => void) => {
    setOpen(false);
    action();
  };

  return (
    <article className="shadow-card flex items-center justify-between rounded-2xl bg-white p-4">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="h-[138px] w-[92px] shrink-0 overflow-hidden rounded-md bg-secondary">
          {book.coverImage ? (
            <img src={book.coverImage} alt={book.title} className="size-full object-cover" />
          ) : null}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5 overflow-hidden">
          <span className="w-fit rounded-md border border-[#d5d7da] px-2 text-sm font-bold leading-7 tracking-[-0.28px] text-[var(--color-ink)]">
            {book.category?.name ?? "Uncategorized"}
          </span>
          <p
            className="line-clamp-2 text-sm font-bold leading-7 tracking-[-0.28px] text-[var(--color-ink)]"
            title={book.title}
          >
            {book.title}
          </p>
          <p className="truncate text-sm font-medium leading-7 tracking-[-0.42px] text-[var(--color-ink-muted)]">
            {book.author?.name ?? "-"}
          </p>
          <div className="flex items-center gap-0.5">
            <Star className="size-6 fill-[var(--color-star)] text-[var(--color-star)]" />
            <span className="text-sm font-bold leading-7 tracking-[-0.28px] text-[var(--color-ink-strong)]">
              {book.rating ?? 0}
            </span>
          </div>
        </div>
      </div>

      <div className="relative shrink-0 self-start pt-1" ref={menuRef}>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex size-6 items-center justify-center text-[var(--color-ink)]"
          aria-label="Book actions"
          aria-expanded={open}
        >
          <MoreHorizontal className="size-6" />
        </button>
        {open && (
          <div className="shadow-card absolute right-0 top-full z-20 mt-1 flex w-[154px] flex-col gap-4 rounded-2xl bg-white p-4">
            <MenuItem onClick={() => closeAnd(onPreview)}>Preview</MenuItem>
            <MenuItem onClick={() => closeAnd(onEdit)}>Edit</MenuItem>
            <MenuItem onClick={() => closeAnd(onDelete)} destructive>
              Delete
            </MenuItem>
          </div>
        )}
      </div>
    </article>
  );
}

function MenuItem({
  children,
  onClick,
  destructive = false,
}: {
  children: ReactNode;
  onClick: () => void;
  destructive?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-left text-sm font-semibold leading-[30px] tracking-[-0.28px]",
        destructive ? "text-[#ee1d52]" : "text-[var(--color-ink)]",
      )}
    >
      {children}
    </button>
  );
}
