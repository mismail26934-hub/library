import { useMemo, useState } from "react";
import { useAdminLoans } from "@/features/admin/useAdmin";
import { useDebounce } from "@/lib/useDebounce";
import { AdminBorrowedLoanCard } from "@/components/admin/AdminBorrowedLoanCard";
import { AdminBorrowedLoanCardDesktop } from "@/components/admin/AdminBorrowedLoanCardDesktop";
import { SearchLarge } from "@/components/admin/SearchLarge";
import { FilterPills } from "@/components/admin/FilterPills";
import { Pagination } from "@/components/admin/Pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, ErrorState } from "@/components/states";

const LIMIT = 10;

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Returned", value: "returned" },
  { label: "Overdue", value: "overdue" },
];

const STATUS_PARAM: Record<string, string | undefined> = {
  all: undefined,
  active: "active",
  returned: "returned",
  overdue: "overdue",
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
      q: debounced || undefined,
      status: STATUS_PARAM[filter],
    }),
    [page, debounced, filter],
  );

  const { data, isLoading, isError, refetch, isFetching } = useAdminLoans(query);
  const loans = data?.loans ?? [];

  return (
    <div className="flex flex-col gap-[15px] md:gap-6">
      <div className="flex flex-col gap-[15px] md:max-w-[600px] md:gap-6">
        <h1 className="text-2xl font-bold leading-9 tracking-[-0.72px] text-[var(--color-ink)] md:text-[28px] md:leading-[38px] md:tracking-[-0.84px]">
          Borrowed List
        </h1>
        <SearchLarge
          value={search}
          onChange={(v) => { setSearch(v); setPage(1); }}
          placeholder="Search"
          className="h-11 w-full md:h-12 md:max-w-[600px]"
        />
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
          <div className="flex flex-col gap-4 md:hidden">
            {loans.map((loan) => (
              <AdminBorrowedLoanCard key={loan.id} loan={loan} />
            ))}
          </div>
          <div className="hidden flex-col gap-6 md:flex">
            {loans.map((loan) => (
              <AdminBorrowedLoanCardDesktop key={loan.id} loan={loan} />
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
