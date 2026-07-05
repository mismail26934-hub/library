import { useMemo, useState } from "react";
import { useAdminUsers } from "@/features/admin/useAdmin";
import { useDebounce } from "@/lib/useDebounce";
import { AdminUserCard } from "@/components/admin/AdminUserCard";
import { SearchLarge } from "@/components/admin/SearchLarge";
import { Pagination } from "@/components/admin/Pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, ErrorState } from "@/components/states";
import { formatDateTime } from "@/lib/utils";

const LIMIT = 10;

export function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debounced = useDebounce(search, 450);

  const query = useMemo(
    () => ({ page, limit: LIMIT, q: debounced || undefined }),
    [page, debounced],
  );

  const { data, isLoading, isError, refetch, isFetching } = useAdminUsers(query);
  const users = data?.users ?? [];
  const totalPages = data?.pagination.totalPages ?? 1;
  const total = data?.pagination.total;

  return (
    <div className="flex flex-col gap-[15px] lg:gap-6">
      <h1 className="text-2xl font-bold leading-9 tracking-[-0.72px] text-[var(--color-ink)] lg:text-[28px] lg:font-extrabold lg:leading-[38px] lg:tracking-[-0.56px]">
        User
      </h1>

      <SearchLarge
        value={search}
        onChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        placeholder="Search user"
        className="h-11 w-full lg:h-12 lg:max-w-[600px]"
      />

      {isLoading ? (
        <UsersSkeleton />
      ) : isError ? (
        <ErrorState message="Failed to load users." onRetry={() => refetch()} />
      ) : users.length === 0 ? (
        <EmptyState title="No users found" description="Try a different search term." />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden rounded-xl border border-[var(--color-border)] bg-white p-4 drop-shadow-[0px_0px_12px_rgba(203,202,202,0.2)] lg:block">
            <table className="w-full table-fixed border-collapse">
              <thead>
                <tr>
                  <Th className="w-11 text-center">No</Th>
                  <Th>Name</Th>
                  <Th>Nomor Handphone</Th>
                  <Th>Email</Th>
                  <Th>Created at</Th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u.id} className="border-b border-[var(--color-border)] last:border-0">
                    <Td className="text-center">{(page - 1) * LIMIT + i + 1}</Td>
                    <Td className="truncate">{u.name}</Td>
                    <Td>{u.phone ?? "-"}</Td>
                    <Td className="truncate">{u.email}</Td>
                    <Td>{formatDateTime(u.createdAt)}</Td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-2 border-t border-[var(--color-border)] pt-2">
              <Pagination
                page={page}
                totalPages={totalPages}
                total={total}
                limit={LIMIT}
                onPageChange={setPage}
                disabled={isFetching}
              />
            </div>
          </div>

          {/* Mobile cards */}
          <div className="flex flex-col gap-3 lg:hidden">
            {users.map((u, i) => (
              <AdminUserCard key={u.id} user={u} index={(page - 1) * LIMIT + i + 1} />
            ))}

            <Pagination
              page={page}
              totalPages={totalPages}
              total={total}
              limit={LIMIT}
              onPageChange={setPage}
              disabled={isFetching}
              showSummary={false}
              alwaysShowLabels
              className="justify-center sm:flex-row"
            />
          </div>
        </>
      )}
    </div>
  );
}

function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <th
      className={
        "h-16 bg-[#fafafa] px-4 text-left text-sm font-bold leading-7 tracking-[-0.28px] text-[var(--color-ink)] " +
        (className ?? "")
      }
    >
      {children}
    </th>
  );
}

function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <td
      className={
        "h-16 px-4 text-base font-semibold leading-[30px] tracking-[-0.32px] text-[var(--color-ink)] " +
        (className ?? "")
      }
    >
      {children}
    </td>
  );
}

function UsersSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="hidden h-[520px] w-full rounded-xl lg:block" />
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-[180px] w-full rounded-xl lg:hidden" />
      ))}
    </div>
  );
}
