import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { booksApi } from "@/lib/api-endpoints";
import { qk } from "@/lib/query-keys";
import { useCategories } from "@/features/books/useBooks";
import { StarRating } from "@/components/StarRating";
import { Avatar } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/states";
import { cn, getInitials } from "@/lib/utils";
import type { Author, Book } from "@/types";

const CATEGORIES = [
  { name: "Fiction", icon: "/figma/cat-fiction.png" },
  { name: "Non-Fiction", icon: "/figma/cat-nonfiction.png" },
  { name: "Self-Improvement", icon: "/figma/cat-self.png" },
  { name: "Finance", icon: "/figma/cat-finance.png" },
  { name: "Science & Technology", icon: "/figma/cat-science.png" },
  { name: "Education", icon: "/figma/cat-education.png" },
];

function CategoryCard({ name, icon, href }: { name: string; icon: string; href: string }) {
  return (
    <Link
      to={href}
      className="shadow-card flex flex-col items-start justify-center gap-2 rounded-2xl bg-white p-2 transition-transform hover:-translate-y-0.5 md:gap-3 md:p-3"
    >
      <div className="flex w-full items-center justify-center rounded-[10.5px] bg-[var(--color-brand-soft)] p-1.5 md:rounded-xl md:p-2">
        <img src={icon} alt="" className="size-11 object-contain md:size-[52px]" />
      </div>
      <p className="w-full text-xs font-semibold tracking-[-0.32px] text-[var(--color-ink)] md:text-base">
        {name}
      </p>
    </Link>
  );
}

function BookyCard({ book }: { book: Book }) {
  return (
    <Link
      to={`/books/${book.id}`}
      className="shadow-card group flex flex-1 flex-col overflow-hidden rounded-xl bg-white transition-shadow hover:shadow-md"
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
      <div className="flex flex-col gap-0.5 p-3 md:gap-1 md:p-4">
        <p className="line-clamp-2 text-sm font-bold leading-7 tracking-[-0.28px] text-[var(--color-ink-strong)] md:text-lg md:leading-8 md:tracking-[-0.54px]">
          {book.title}
        </p>
        <p className="line-clamp-1 text-sm font-medium tracking-[-0.42px] text-[var(--color-ink-muted)] md:text-base md:tracking-[-0.48px]">
          {book.author?.name}
        </p>
        <div className="flex items-center gap-1 pt-0.5">
          <StarRating value={Math.round(book.rating)} size={20} />
          <span className="text-sm font-semibold tracking-[-0.28px] text-[var(--color-ink-strong)] md:text-base md:tracking-[-0.32px]">
            {book.rating.toFixed(1)}
          </span>
        </div>
      </div>
    </Link>
  );
}

function AuthorCard({ author, count }: { author: Author; count: number }) {
  return (
    <div className="shadow-card flex flex-1 items-center gap-4 rounded-xl bg-white p-4">
      <Avatar className="size-[68px] shrink-0 text-lg" fallback={getInitials(author.name)} />
      <div className="flex min-w-0 flex-col gap-0.5">
        <p className="truncate text-lg font-bold tracking-[-0.54px] text-[var(--color-ink-strong)]">
          {author.name}
        </p>
        <div className="flex items-center gap-1.5 text-base font-medium tracking-[-0.48px] text-[var(--color-ink)]">
          <BookGlyph className="h-5 w-4 shrink-0" />
          {count} {count === 1 ? "book" : "books"}
        </div>
      </div>
    </div>
  );
}

function BookGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 20" fill="none" className={className} aria-hidden="true">
      <path
        d="M2 20C1.45 20 0.979333 19.8043 0.588 19.413C0.196666 19.0217 0.000666667 18.5507 0 18V2C0 1.45 0.196 0.979333 0.588 0.588C0.98 0.196667 1.45067 0.000666667 2 0H14C14.55 0 15.021 0.196 15.413 0.588C15.805 0.98 16.0007 1.45067 16 2V18C16 18.55 15.8043 19.021 15.413 19.413C15.0217 19.805 14.5507 20.0007 14 20H2ZM7 9L9.5 7.5L12 9V2H7V9Z"
        fill="#1C65DA"
      />
    </svg>
  );
}

export function HomePage() {
  const [page, setPage] = useState(1);
  const [books, setBooks] = useState<Book[]>([]);

  const { data: categories } = useCategories();
  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: qk.recommend(page),
    queryFn: () => booksApi.recommend(page),
  });

  useEffect(() => {
    if (!data?.books) return;
    setBooks((prev) => {
      if (page === 1) return data.books;
      const seen = new Set(prev.map((b) => b.id));
      return [...prev, ...data.books.filter((b) => !seen.has(b.id))];
    });
  }, [data, page]);

  const categoryHref = (name: string) => {
    const match = categories?.find(
      (c) => c.name.toLowerCase() === name.toLowerCase(),
    );
    return match ? `/books?category=${match.id}` : "/books";
  };

  const popularAuthors = useMemo(() => {
    const map = new Map<number, { author: Author; count: number }>();
    for (const b of books) {
      if (!b.author) continue;
      const entry = map.get(b.author.id);
      if (entry) entry.count += 1;
      else map.set(b.author.id, { author: b.author, count: 1 });
    }
    return [...map.values()].sort((a, b) => b.count - a.count).slice(0, 4);
  }, [books]);

  const hasMore = data ? page < data.pagination.totalPages : false;
  const initialLoading = isLoading && books.length === 0;

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 md:gap-12">
      {/* Hero banner */}
      <section className="flex flex-col items-center gap-4">
        <img
          src="/figma/banner.png"
          alt="Welcome to Booky"
          className="w-full rounded-3xl"
        />
        <div className="flex items-center gap-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={cn(
                "h-2.5 rounded-full transition-all",
                i === 0 ? "w-6 bg-[var(--color-brand)]" : "w-2.5 bg-[var(--color-brand-soft)]",
              )}
            />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="grid grid-cols-3 gap-3 md:grid-cols-6 md:gap-4">
        {CATEGORIES.map((c) => (
          <CategoryCard key={c.name} name={c.name} icon={c.icon} href={categoryHref(c.name)} />
        ))}
      </section>

      {/* Recommendation */}
      <section className="flex flex-col items-center gap-5 md:gap-10">
        <h2 className="w-full text-2xl font-bold leading-9 text-[var(--color-ink)] md:text-4xl md:leading-[44px]">
          Recommendation
        </h2>

        {initialLoading ? (
          <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3 md:gap-5 lg:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[230/345] w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : (
          <>
            <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3 md:gap-5 lg:grid-cols-5">
              {books.map((book) => (
                <BookyCard key={book.id} book={book} />
              ))}
            </div>

            {hasMore && (
              <button
                type="button"
                onClick={() => setPage((p) => p + 1)}
                disabled={isFetching}
                className="flex h-10 w-[150px] items-center justify-center rounded-full border border-[var(--color-border)] p-2 text-sm font-bold tracking-[-0.28px] text-[var(--color-ink)] transition-colors hover:bg-secondary disabled:opacity-60 md:h-12 md:w-[200px] md:text-base md:tracking-[-0.32px]"
              >
                {isFetching ? "Loading…" : "Load More"}
              </button>
            )}
          </>
        )}
      </section>

      {/* Popular Authors */}
      {popularAuthors.length > 0 && (
        <>
          <hr className="border-t border-[var(--color-border)]" />
          <section className="flex flex-col gap-6 md:gap-10">
            <h2 className="text-2xl font-bold leading-9 text-[var(--color-ink)] md:text-4xl md:leading-[44px]">
              Popular Authors
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-5">
              {popularAuthors.map(({ author, count }) => (
                <AuthorCard key={author.id} author={author} count={count} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
