import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { StarRating } from "./StarRating";
import { Badge } from "@/components/ui/badge";
import type { Book } from "@/types";

export function BookCard({ book }: { book: Book }) {
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
