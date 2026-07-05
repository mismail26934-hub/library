import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, LayoutDashboard, LogOut, Menu, Search, ShoppingBag, User as UserIcon, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { logout } from "@/features/auth/authSlice";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { cn, getInitials } from "@/lib/utils";

export function Navbar() {
  const { token, user } = useAppSelector((s) => s.auth);
  const cartCount = useAppSelector((s) => s.cart.items.length);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = search.trim();
    navigate(q ? `/books?search=${encodeURIComponent(q)}` : "/books");
    setMobileOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    setMenuOpen(false);
    navigate("/login");
  };

  return (
    <header className="shadow-card sticky top-0 z-40 bg-white">
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between gap-4 px-5 md:px-12 lg:px-[120px]">
        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center gap-[15px]">
          <img src="/figma/logo.png" alt="Booky" className="size-[42px]" />
          <span className="text-[26px] font-bold tracking-tight text-[var(--color-ink)] md:text-[32px]">
            Booky
          </span>
        </Link>

        {/* Search (desktop) */}
        <form
          onSubmit={submitSearch}
          className="hidden h-11 w-full max-w-[500px] items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-white px-4 py-2 md:flex"
        >
          <Search className="size-5 shrink-0 text-[var(--color-ink-subtle)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search book"
            className="w-full bg-transparent text-sm font-medium tracking-[-0.42px] text-[var(--color-ink)] placeholder:text-[var(--color-ink-subtle)] focus:outline-none"
          />
        </form>

        {/* Right actions */}
        <div className="flex shrink-0 items-center gap-4 md:gap-6">
          <Link to="/cart" className="relative" aria-label="Cart">
            <ShoppingBag className="size-7 text-[var(--color-ink-strong)]" />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-1 flex size-5 items-center justify-center rounded-full bg-[#ee1d52] text-[12px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {token ? (
            <div className="relative hidden md:block" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-3"
              >
                <Avatar
                  className="size-12"
                  src={user?.profilePhoto}
                  fallback={getInitials(user?.name)}
                />
                <span className="text-lg font-semibold tracking-[-0.36px] text-[var(--color-ink)]">
                  {user?.name ?? "Account"}
                </span>
                <ChevronDown
                  className={cn(
                    "size-6 text-[var(--color-ink)] transition-transform",
                    menuOpen && "rotate-180",
                  )}
                />
              </button>
              {menuOpen && (
                <div className="shadow-card absolute right-0 top-[calc(100%+12px)] w-48 overflow-hidden rounded-xl border bg-white py-1">
                  {user?.role === "ADMIN" && (
                    <MenuItem to="/admin" onClick={() => setMenuOpen(false)}>
                      <LayoutDashboard className="size-4" /> Admin Dashboard
                    </MenuItem>
                  )}
                  <MenuItem to="/profile" onClick={() => setMenuOpen(false)}>
                    <UserIcon className="size-4" /> Profile
                  </MenuItem>
                  <MenuItem to="/loans" onClick={() => setMenuOpen(false)}>
                    <ShoppingBag className="size-4" /> My Loans
                  </MenuItem>
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
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Button variant="ghost" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button onClick={() => navigate("/register")}>Register</Button>
            </div>
          )}

          <button
            className="md:hidden"
            aria-label="Menu"
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="border-t bg-white px-5 py-4 md:hidden">
          <form onSubmit={submitSearch} className="mb-3 flex h-11 items-center gap-1.5 rounded-full border px-4">
            <Search className="size-5 text-[var(--color-ink-subtle)]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search book"
              className="w-full bg-transparent text-sm focus:outline-none"
            />
          </form>
          {token ? (
            <nav className="flex flex-col gap-1">
              {user?.role === "ADMIN" && (
                <Link to="/admin" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground">
                  Admin Dashboard
                </Link>
              )}
              <Link to="/profile" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground">
                Profile
              </Link>
              <Link to="/loans" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground">
                My Loans
              </Link>
              <Button variant="outline" onClick={handleLogout} className="mt-2">
                Logout
              </Button>
            </nav>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button className="flex-1" onClick={() => navigate("/register")}>
                Register
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

function MenuItem({
  to,
  onClick,
  children,
}: {
  to: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[var(--color-ink)] hover:bg-secondary"
    >
      {children}
    </Link>
  );
}
