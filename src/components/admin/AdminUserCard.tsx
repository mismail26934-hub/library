import { formatDateTime } from "@/lib/utils";
import type { User } from "@/types";

interface AdminUserCardProps {
  user: User;
  index: number;
}

function Row({ label, value, bold = false }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex w-full items-center justify-between gap-3">
      <span className="shrink-0 text-sm font-semibold leading-7 tracking-[-0.28px] text-[var(--color-ink)]">
        {label}
      </span>
      <span
        className={
          "truncate text-right text-sm leading-7 tracking-[-0.28px] text-[var(--color-ink)] " +
          (bold ? "font-bold" : "font-semibold")
        }
      >
        {value}
      </span>
    </div>
  );
}

export function AdminUserCard({ user, index }: AdminUserCardProps) {
  return (
    <article className="shadow-card flex flex-col gap-1 rounded-xl bg-white p-3">
      <Row label="No" value={String(index)} />
      <Row label="Name" value={user.name} />
      <Row label="Email" value={user.email} bold />
      <Row label="Nomor Handphone" value={user.phone ?? "-"} bold />
      <Row label="Created at" value={formatDateTime(user.createdAt)} bold />
    </article>
  );
}
