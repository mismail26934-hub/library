import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { StarRating } from "./StarRating";
import { Badge } from "@/components/ui/badge";
import type { Book } from "@/types";

interface BookCardProps {
  book: Book;
  variant?: "default" | "desktop" | "mobile";
}

export function BookCard({ book, variant = "default" }: BookCardProps) {
  if (variant === "mobile") {
    return (
      <Link
        to={`/books/${book.id}`}
        className="shadow-card group flex min-w-0 flex-col overflow-hidden rounded-xl bg-white transition-shadow hover:shadow-md"
      >
        <div className="aspect-[230/345] w-full overflow-hidden bg-muted">
          {book.coverImage ? (
            <img
              src={book.coverImage}
              alt={book.title}
              loading="lazy"
              className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-sm text-muted-foreground">
              No cover
            </div>
          )}
        </div>
        <div className="flex flex-col gap-0.5 p-3">
          <h3 className="line-clamp-2 text-sm font-bold leading-7 tracking-[-0.28px] text-[var(--color-ink-strong)]">
            {book.title}
          </h3>
          <p className="line-clamp-1 text-sm font-medium tracking-[-0.42px] text-[var(--color-ink-muted)]">
            {book.author?.name}
          </p>
          <div className="flex items-center gap-0.5">
            <StarRating value={Math.round(book.rating)} size={24} />
            <span className="text-sm font-semibold tracking-[-0.28px] text-[var(--color-ink-strong)]">
              {book.rating.toFixed(1)}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "desktop") {
    return (
      <Link
        to={`/books/${book.id}`}
        className="shadow-card group flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl bg-white transition-shadow hover:shadow-md"
      >
        <div className="aspect-[230/345] w-full overflow-hidden bg-muted">
          {book.coverImage ? (
            <img
              src={book.coverImage}
              alt={book.title}
              loading="lazy"
              className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-sm text-muted-foreground">
              No cover
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1 p-4">
          <h3 className="line-clamp-2 text-lg font-bold leading-8 tracking-[-0.54px] text-[var(--color-ink-strong)]">
            {book.title}
          </h3>
          <p className="line-clamp-1 text-base font-medium tracking-[-0.48px] text-[var(--color-ink-muted)]">
            {book.author?.name}
          </p>
          <div className="flex items-center gap-0.5">
            <StarRating value={Math.round(book.rating)} size={24} />
            <span className="text-base font-semibold tracking-[-0.32px] text-[var(--color-ink-strong)]">
              {book.rating.toFixed(1)}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Link
        to={`/books/${book.id}`}
        className="group flex h-full flex-col overflow-hidden rounded-[var(--radius)] border bg-card transition-shadow hover:shadow-md"
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          {book.coverImage ? (
            <img
              src={book.coverImage}
              alt={book.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              No cover
            </div>
          )}
          <Badge
            variant={book.availableCopies > 0 ? "success" : "destructive"}
            className="absolute left-2 top-2"
          >
            {book.availableCopies > 0 ? `${book.availableCopies} left` : "Out of stock"}
          </Badge>
        </div>
        <div className="flex flex-1 flex-col gap-1 p-3">
          <p className="text-xs text-muted-foreground">{book.category?.name}</p>
          <h3 className="line-clamp-2 font-semibold leading-snug">{book.title}</h3>
          <p className="text-sm text-muted-foreground">{book.author?.name}</p>
          <div className="mt-auto flex items-center gap-1 pt-2">
            <StarRating value={Math.round(book.rating)} size={14} />
            <span className="text-xs text-muted-foreground">
              {book.rating.toFixed(1)} ({book.reviewCount})
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
