import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useMyLoans } from "@/features/loans/useLoans";
import { ProfilePageLayout } from "@/components/ProfilePageLayout";
import { BorrowedLoanCard } from "@/components/loans/BorrowedLoanCard";
import { GiveReviewModal } from "@/components/reviews/GiveReviewModal";
import { ReturnBookModal } from "@/components/loans/ReturnBookModal";
import { SearchLarge } from "@/components/admin/SearchLarge";
import { FilterPills } from "@/components/admin/FilterPills";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, ErrorState } from "@/components/states";
import { useDebounce } from "@/lib/useDebounce";
import type { Book, Loan } from "@/types";

const LIMIT = 10;

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Returned", value: "returned" },
  { label: "Overdue", value: "overdue" },
] as const;

type FilterValue = (typeof FILTERS)[number]["value"];

export function MyLoansPage() {
  const [filter, setFilter] = useState<FilterValue>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [reviewBook, setReviewBook] = useState<Book | null>(null);
  const [returnLoan, setReturnLoan] = useState<Loan | null>(null);

  const debouncedSearch = useDebounce(search, 450);

  const query = useMemo(
    () => ({
      status: filter === "all" ? undefined : filter,
      q: debouncedSearch || undefined,
      page,
      limit: LIMIT,
    }),
    [filter, debouncedSearch, page],
  );

  const { data, isLoading, isError, refetch, isFetching } = useMyLoans(query);

  useEffect(() => {
    setPage(1);
    setLoans([]);
  }, [filter, debouncedSearch]);

  useEffect(() => {
    if (!data) return;
    setLoans((prev) => (page === 1 ? data.loans : [...prev, ...data.loans]));
  }, [data, page]);

  const totalPages = data?.pagination.totalPages ?? 1;
  const hasMore = page < totalPages;
  const initialLoading = isLoading && page === 1;

  return (
    <ProfilePageLayout wide>
      <div className="flex flex-col gap-4 lg:gap-6">
        <h1 className="text-2xl font-bold leading-9 tracking-[-0.72px] text-[var(--color-ink)] lg:text-[28px] lg:leading-[38px] lg:tracking-[-0.84px]">
          Borrowed List
        </h1>

        <SearchLarge
          value={search}
          onChange={setSearch}
          placeholder="Search book"
          className="h-11 w-full lg:max-w-[544px]"
        />

        <FilterPills
          options={[...FILTERS]}
          value={filter}
          onChange={(v) => setFilter(v as FilterValue)}
        />

        {initialLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-[280px] w-full rounded-2xl lg:h-[250px]" />
            ))}
          </div>
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : loans.length === 0 ? (
          <EmptyState
            title="No loans here"
            description="Borrow a book to see it listed here."
            action={
              <Link to="/books">
                <Button>Browse books</Button>
              </Link>
            }
          />
        ) : (
          <div className="flex flex-col items-center gap-4 lg:gap-6">
            <div className="flex w-full flex-col gap-4">
              {loans.map((loan) => (
                <BorrowedLoanCard
                  key={loan.id}
                  loan={loan}
                  onGiveReview={() => setReviewBook(loan.book)}
                  onReturn={() => setReturnLoan(loan)}
                />
              ))}
            </div>

            {hasMore && (
              <button
                type="button"
                disabled={isFetching}
                onClick={() => setPage((p) => p + 1)}
                className="flex h-12 w-[200px] items-center justify-center rounded-full border border-[#d5d7da] text-base font-bold tracking-[-0.32px] text-[var(--color-ink)] transition-colors hover:bg-secondary disabled:opacity-60"
              >
                {isFetching ? "Loading…" : "Load More"}
              </button>
            )}
          </div>
        )}
      </div>

      <GiveReviewModal
        open={reviewBook !== null}
        book={reviewBook}
        onOpenChange={(open) => {
          if (!open) setReviewBook(null);
        }}
      />

      <ReturnBookModal
        open={returnLoan !== null}
        loan={returnLoan}
        onOpenChange={(open) => {
          if (!open) setReturnLoan(null);
        }}
      />
    </ProfilePageLayout>
  );
}
