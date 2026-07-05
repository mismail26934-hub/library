import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/admin/loans", label: "Borrowed List" },
  { to: "/admin/users", label: "User" },
  { to: "/admin/books", label: "Book List" },
];

export function AdminTabs() {
  return (
    <div className="flex h-14 w-full max-w-[600px] items-center gap-2 rounded-2xl bg-[var(--color-secondary)] p-2">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) =>
            cn(
              "flex h-10 flex-1 items-center justify-center rounded-xl px-3 text-center transition-colors",
              isActive
                ? "shadow-card bg-white text-sm font-bold tracking-[-0.28px] text-[var(--color-ink)] lg:text-base lg:tracking-[-0.32px]"
                : "text-sm font-medium tracking-[-0.42px] text-[var(--color-ink-subtle)] hover:text-[var(--color-ink)] lg:text-base lg:tracking-[-0.48px]",
            )
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </div>
  );
}
