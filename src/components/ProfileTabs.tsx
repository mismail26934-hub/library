import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "Profile", to: "/profile" },
  { label: "Borrowed List", to: "/loans" },
  { label: "Reviews", to: "/reviews" },
] as const;

const base =
  "flex h-10 flex-1 items-center justify-center rounded-xl px-3 py-2 text-sm tracking-[-0.42px] transition md:text-base md:tracking-[-0.48px]";
const active =
  "shadow-card bg-white font-bold tracking-[-0.28px] text-[var(--color-ink)] md:tracking-[-0.32px]";
const inactive = "font-medium text-[var(--color-ink-subtle)]";

export function ProfileTabs() {
  return (
    <div className="flex h-14 w-full items-center gap-2 rounded-2xl bg-[#f5f5f5] p-2">
      {tabs.map((tab) => (
        <NavLink
          key={tab.label}
          to={tab.to}
          end
          className={({ isActive }) => cn(base, isActive ? active : inactive)}
        >
          {tab.label}
        </NavLink>
      ))}
    </div>
  );
}
