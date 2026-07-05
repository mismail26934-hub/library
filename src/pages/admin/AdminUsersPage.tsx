import { useMemo, useState } from "react";
import { useAdminUsers } from "@/features/admin/useAdmin";
import { useDebounce } from "@/lib/useDebounce";
import { SearchLarge } from "@/components/admin/SearchLarge";
import { Pagination } from "@/components/admin/Pagination";
import { Avatar } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, ErrorState } from "@/components/states";
import { formatDateTime, getInitials } from "@/lib/utils";
import type { User } from "@/types";

const LIMIT = 10;

export function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debounced = useDebounce(search, 450);

  const query = useMemo(
    () => ({ page, limit: LIMIT, search: debounced || undefined }),
    [page, debounced],
  );

  const { data, isLoading, isError, refetch, isFetching } = useAdminUsers(query);
  const users = data?.users ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-6">
        <h1 className="text-[28px] font-bold tracking-[-0.84px] text-[var(--color-ink)]">User</h1>
        <SearchLarge value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search user" />
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : isError ? (
        <ErrorState message="Failed to load users." onRetry={() => refetch()} />
      ) : users.length === 0 ? (
        <EmptyState title="No users found" description="Try a different search term." />
      ) : (
        <div className="rounded-xl border border-[var(--color-border)] bg-white p-4 drop-shadow-[0px_0px_12px_rgba(203,202,202,0.2)]">
          {/* Desktop table */}
          <div className="hidden md:block">
            <table className="w-full table-fixed border-collapse">
              <thead>
                <tr>
                  <Th className="w-[56px]">No</Th>
                  <Th>Name</Th>
                  <Th>Nomor Handphone</Th>
                  <Th>Email</Th>
                  <Th>Created at</Th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u.id} className="border-b border-[var(--color-border)] last:border-0">
                    <Td>{(page - 1) * LIMIT + i + 1}</Td>
                    <Td className="truncate">{u.name}</Td>
                    <Td>{u.phone ?? "-"}</Td>
                    <Td className="truncate">{u.email}</Td>
                    <Td>{formatDateTime(u.createdAt)}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="flex flex-col gap-3 md:hidden">
            {users.map((u, i) => (
              <UserCard key={u.id} user={u} index={(page - 1) * LIMIT + i + 1} />
            ))}
          </div>

          <div className="mt-2 border-t border-[var(--color-border)] pt-2">
            <Pagination
              page={page}
              totalPages={data?.pagination.totalPages ?? 1}
              total={data?.pagination.total}
              limit={LIMIT}
              onPageChange={setPage}
              disabled={isFetching}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <th
      className={
        "h-16 bg-[#fafafa] px-4 text-left text-sm font-bold tracking-[-0.28px] text-[var(--color-ink)] " +
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
        "h-16 px-4 text-sm font-semibold tracking-[-0.32px] text-[var(--color-ink)] " + (className ?? "")
      }
    >
      {children}
    </td>
  );
}

function UserCard({ user, index }: { user: User; index: number }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] p-3">
      <span className="w-5 shrink-0 text-sm font-semibold text-[var(--color-ink-subtle)]">{index}</span>
      <Avatar className="size-11" src={user.profilePhoto} fallback={getInitials(user.name)} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-bold text-[var(--color-ink)]">{user.name}</p>
        <p className="truncate text-sm text-[var(--color-ink-subtle)]">{user.email}</p>
        <p className="text-sm text-[var(--color-ink-subtle)]">{user.phone ?? "-"}</p>
      </div>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-3 rounded-xl border border-[var(--color-border)] bg-white p-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="h-14 w-full" />
      ))}
    </div>
  );
}
