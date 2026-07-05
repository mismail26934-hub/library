import { useMemo, useState } from "react";
import { useAdminLoans } from "@/features/admin/useAdmin";
import { useDebounce } from "@/lib/useDebounce";
import { SearchLarge } from "@/components/admin/SearchLarge";
import { FilterPills } from "@/components/admin/FilterPills";
import { Pagination } from "@/components/admin/Pagination";
import { LoanStatusBadge } from "@/components/admin/LoanStatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, ErrorState } from "@/components/states";
import { formatDate } from "@/lib/utils";
import type { AdminLoan } from "@/types";

const LIMIT = 10;

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Returned", value: "returned" },
  { label: "Overdue", value: "overdue" },
];

const STATUS_PARAM: Record<string, string | undefined> = {
  all: undefined,
  active: "BORROWED",
  returned: "RETURNED",
  overdue: "OVERDUE",
};

export function AdminBorrowedListPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const debounced = useDebounce(search, 450);

  const query = useMemo(
    () => ({
      page,
      limit: LIMIT,
      search: debounced || undefined,
      status: STATUS_PARAM[filter],
    }),
    [page, debounced, filter],
  );

  const { data, isLoading, isError, refetch, isFetching } = useAdminLoans(query);
  const loans = data?.loans ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-6">
        <h1 className="text-[28px] font-bold tracking-[-0.84px] text-[var(--color-ink)]">Borrowed List</h1>
        <SearchLarge value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search" />
      </div>
      <FilterPills
        options={FILTERS}
        value={filter}
        onChange={(v) => { setFilter(v); setPage(1); }}
      />

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[250px] w-full rounded-2xl" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState message="Failed to load borrowed list." onRetry={() => refetch()} />
      ) : loans.length === 0 ? (
        <EmptyState title="No records found" description="No borrowing activity matches your filter." />
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {loans.map((loan) => (
              <BorrowedCard key={loan.id} loan={loan} />
            ))}
          </div>
          <Pagination
            page={page}
            totalPages={data?.pagination.totalPages ?? 1}
            total={data?.pagination.total}
            limit={LIMIT}
            onPageChange={setPage}
            disabled={isFetching}
          />
        </>
      )}
    </div>
  );
}

function BorrowedCard({ loan }: { loan: AdminLoan }) {
  const { book, user } = loan;
  return (
    <div className="shadow-card flex flex-col gap-5 rounded-2xl bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="font-bold text-[var(--color-ink)]">Status</span>
          <LoanStatusBadge status={loan.status} />
        </div>
        <div className="flex items-center gap-3">
          <span className="font-bold text-[var(--color-ink)]">Due Date</span>
          <span className="inline-flex items-center rounded-[4px] bg-[rgba(238,29,82,0.1)] px-2 py-0.5 text-sm font-bold text-[#ee1d52]">
            {formatDate(loan.dueAt)}
          </span>
        </div>
      </div>

      <div className="h-px w-full bg-[var(--color-border)]" />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-4">
          <div className="h-[138px] w-[92px] shrink-0 overflow-hidden rounded-md bg-secondary">
            {book?.coverImage && (
              <img src={book.coverImage} alt={book.title} className="size-full object-cover" />
            )}
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="w-fit rounded-md border border-[var(--color-border)] px-2 text-sm font-bold text-[var(--color-ink)]">
              {book?.category?.name ?? "Category"}
            </span>
            <p className="truncate text-xl font-bold tracking-[-0.4px] text-[var(--color-ink)]">
              {book?.title ?? "-"}
            </p>
            <p className="truncate font-medium tracking-[-0.48px] text-[var(--color-ink-muted)]">
              {book?.author?.name ?? "-"}
            </p>
            <div className="flex items-center gap-2 text-sm font-bold text-[var(--color-ink)]">
              <span>{formatDate(loan.borrowedAt)}</span>
              <span className="size-[3px] rounded-full bg-[var(--color-ink)]" />
              <span>Duration {loan.durationDays ?? "-"} Days</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center sm:min-w-[160px]">
          <p className="text-sm font-semibold tracking-[-0.32px] text-[var(--color-ink-subtle)]">
            borrower&apos;s name
          </p>
          <p className="text-xl font-bold tracking-[-0.4px] text-[var(--color-ink)]">
            {user?.name ?? "-"}
          </p>
        </div>
      </div>
    </div>
  );
}
