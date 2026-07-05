import { useEffect, useRef, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronDown, ExternalLink, LogOut } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { logout } from "@/features/auth/authSlice";
import { qk } from "@/lib/query-keys";
import { Avatar } from "@/components/ui/avatar";
import { cn, getInitials } from "@/lib/utils";
import { AdminTabs } from "./AdminTabs";

function AdminHeader() {
  const { user } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    qc.removeQueries({ queryKey: qk.cart() });
    navigate("/login");
  };

  return (
    <header className="shadow-card sticky top-0 z-40 bg-white">
      <div className="mx-auto flex h-[64px] max-w-[1440px] items-center justify-between px-4 md:h-20 md:px-12 lg:px-[120px]">
        <Link to="/admin/books" className="flex shrink-0 items-center gap-[15px]">
          <img src="/figma/logo.png" alt="Booky" className="size-10 md:size-[42px]" />
          <span className="hidden text-[26px] font-bold tracking-tight text-[var(--color-ink)] md:inline md:text-[32px]">
            Booky
          </span>
        </Link>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="flex items-center md:gap-4"
            aria-label="Open profile menu"
          >
            <Avatar className="size-10 md:size-12" src={user?.profilePhoto} fallback={getInitials(user?.name)} />
            <span className="hidden text-lg font-semibold tracking-[-0.36px] text-[var(--color-ink)] md:block">
              {user?.name ?? "Admin"}
            </span>
            <ChevronDown
              className={cn(
                "hidden size-6 text-[var(--color-ink)] transition-transform md:block",
                open && "rotate-180",
              )}
            />
          </button>
          {open && (
            <div className="shadow-card absolute right-0 top-[calc(100%+12px)] w-52 overflow-hidden rounded-xl border bg-white py-1">
              <Link
                to="/"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[var(--color-ink)] hover:bg-secondary"
              >
                <ExternalLink className="size-4" /> Go to site
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-medium text-destructive hover:bg-secondary"
              >
                <LogOut className="size-4" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export function AdminLayout() {
  const { pathname } = useLocation();
  const hideTabs = /\/admin\/books\/(?:new|\d+\/(?:edit|preview))$/.test(pathname);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <AdminHeader />
      <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-6 md:px-12 md:py-12 lg:px-0">
        {!hideTabs && (
          <div className="mb-4 md:mb-8">
            <AdminTabs />
          </div>
        )}
        <Outlet />
      </main>
    </div>
  );
}
