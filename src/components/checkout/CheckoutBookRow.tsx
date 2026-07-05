import type { Book } from "@/types";

export function CheckoutBookRow({ book }: { book: Book }) {
  return (
    <div className="flex gap-4">
      <div className="h-[138px] w-[92px] shrink-0 overflow-hidden bg-muted">
        {book.coverImage ? (
          <img
            src={book.coverImage}
            alt={book.title}
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
            No cover
          </div>
        )}
      </div>
      <div className="flex min-w-0 flex-col gap-1">
        {book.category?.name && (
          <span className="inline-flex w-fit items-center rounded-md border border-[#d5d7da] px-2 py-0 text-sm font-bold leading-7 tracking-[-0.28px] text-[var(--color-ink)]">
            {book.category.name}
          </span>
        )}
        <p className="text-xl font-bold leading-[34px] tracking-[-0.4px] text-[var(--color-ink)]">
          {book.title}
        </p>
        <p className="text-base font-medium tracking-[-0.48px] text-[var(--color-ink-muted)]">
          {book.author?.name}
        </p>
      </div>
    </div>
  );
}
