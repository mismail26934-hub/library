import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronDown, Menu, Search, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { logout } from "@/features/auth/authSlice";
import { qk } from "@/lib/query-keys";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { cn, getInitials } from "@/lib/utils";

export function Navbar() {
  const { token, user } = useAppSelector((s) => s.auth);
  const cartCount = useAppSelector((s) => s.cart.items.length);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
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
    setSearchOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    qc.removeQueries({ queryKey: qk.cart() });
    setMenuOpen(false);
    navigate("/login");
  };

  return (
    <header className="shadow-card sticky top-0 z-40 bg-white">
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between gap-4 px-5 md:px-12 lg:px-[120px]">
        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center gap-[15px]">
          <img src="/figma/logo.png" alt="Booky" className="size-[42px]" />
          <span
            className={cn(
              "text-[26px] font-bold tracking-tight text-[var(--color-ink)] md:text-[32px]",
              (searchOpen || mobileOpen) && "hidden md:inline",
            )}
          >
            Booky
          </span>
        </Link>

        {/* Mobile search-active bar */}
        {searchOpen && (
          <div className="flex flex-1 items-center gap-4 md:hidden">
            <form
              onSubmit={submitSearch}
              className="flex h-10 flex-1 items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-white px-3"
            >
              <Search className="size-5 shrink-0 text-[var(--color-ink-subtle)]" />
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search book"
                className="w-full bg-transparent text-sm font-medium tracking-[-0.42px] text-[var(--color-ink)] placeholder:text-[var(--color-ink-subtle)] focus:outline-none"
              />
            </form>
            <button
              type="button"
              aria-label="Close search"
              onClick={() => setSearchOpen(false)}
            >
              <X className="size-6 text-[var(--color-ink-strong)]" />
            </button>
          </div>
        )}

        {token ? (
          <>
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
            <div
              className={cn(
                "shrink-0 items-center gap-4 md:gap-6",
                searchOpen ? "hidden md:flex" : "flex",
              )}
            >
              {/* Search trigger (mobile) */}
              <button
                type="button"
                aria-label="Search"
                onClick={() => setSearchOpen(true)}
                className="md:hidden"
              >
                <Search className="size-6 text-[var(--color-ink-strong)]" />
              </button>

              <Link to="/cart" className="relative" aria-label="Cart">
                <BagIcon className="size-7 text-[var(--color-ink-strong)] md:size-8" />
                {cartCount > 0 && (
                  <span className="absolute -right-1.5 -top-1 flex size-5 items-center justify-center rounded-full bg-[#ee1d52] text-[12px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </Link>

              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((o) => !o)}
                  className="flex items-center gap-3"
                  aria-label="Account menu"
                >
                  <Avatar
                    className="size-10 md:size-12"
                    src={user?.profilePhoto}
                    fallback={getInitials(user?.name)}
                  />
                  <span className="hidden text-lg font-semibold tracking-[-0.36px] text-[var(--color-ink)] md:inline">
                    {user?.name ?? "Account"}
                  </span>
                  <ChevronDown
                    className={cn(
                      "hidden size-6 text-[var(--color-ink)] transition-transform md:block",
                      menuOpen && "rotate-180",
                    )}
                  />
                </button>
                {menuOpen && (
                  <div className="shadow-card fixed inset-x-4 top-[84px] z-50 flex flex-col gap-4 rounded-2xl bg-white p-4 text-base font-semibold tracking-[-0.32px] md:absolute md:inset-x-auto md:right-0 md:top-[calc(100%+12px)] md:w-[184px]">
                    {user?.role === "ADMIN" && (
                      <Link
                        to="/admin"
                        onClick={() => setMenuOpen(false)}
                        className="text-left text-[var(--color-ink)] transition-colors hover:text-[#1c65da]"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <Link
                      to="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="text-[var(--color-ink)] transition-colors hover:text-[#1c65da]"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/loans"
                      onClick={() => setMenuOpen(false)}
                      className="text-[var(--color-ink)] transition-colors hover:text-[#1c65da]"
                    >
                      Borrowed List
                    </Link>
                    <Link
                      to="/reviews"
                      onClick={() => setMenuOpen(false)}
                      className="text-[var(--color-ink)] transition-colors hover:text-[#1c65da]"
                    >
                      Reviews
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="text-left text-[#ee1d52] transition-colors hover:opacity-80"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Logged-out desktop: Login + Register pill buttons (Figma "Before Login") */}
            <div className="hidden shrink-0 items-center gap-3 md:flex md:gap-4">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="flex h-12 w-[110px] items-center justify-center rounded-full border border-[var(--color-border)] text-base font-bold tracking-[-0.32px] text-[var(--color-ink)] transition-colors hover:bg-secondary md:w-[163px]"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="flex h-12 w-[110px] items-center justify-center rounded-full bg-[#1c65da] text-base font-bold tracking-[-0.32px] text-white transition-colors hover:bg-[#1c65da]/90 md:w-[163px]"
              >
                Register
              </button>
            </div>

            {/* Logged-out mobile: search, cart, hamburger */}
            <div
              className={cn(
                "shrink-0 items-center gap-4 md:hidden",
                searchOpen ? "hidden" : "flex",
              )}
            >
              <button
                type="button"
                aria-label="Search"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="size-6 text-[var(--color-ink-strong)]" />
              </button>
              <Link to="/cart" className="relative" aria-label="Cart">
                <BagIcon className="size-7 text-[var(--color-ink-strong)]" />
                {cartCount > 0 && (
                  <span className="absolute -right-1.5 -top-1 flex size-5 items-center justify-center rounded-full bg-[#ee1d52] text-[12px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </Link>
              <button
                type="button"
                aria-label="Menu"
                onClick={() => setMobileOpen((o) => !o)}
              >
                {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="border-t bg-white px-5 py-4 md:hidden">
          {token ? (
            <>
              <form onSubmit={submitSearch} className="mb-3 flex h-11 items-center gap-1.5 rounded-full border px-4">
                <Search className="size-5 text-[var(--color-ink-subtle)]" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search book"
                  className="w-full bg-transparent text-sm focus:outline-none"
                />
              </form>
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
                  Borrowed List
                </Link>
                <Link to="/reviews" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground">
                  Reviews
                </Link>
                <Button variant="outline" onClick={handleLogout} className="mt-2">
                  Logout
                </Button>
              </nav>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  navigate("/login");
                }}
                className="flex h-12 flex-1 items-center justify-center rounded-full border border-[var(--color-border)] text-base font-bold tracking-[-0.32px] text-[var(--color-ink)] transition-colors hover:bg-secondary"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  navigate("/register");
                }}
                className="flex h-12 flex-1 items-center justify-center rounded-full bg-[#1c65da] text-base font-bold tracking-[-0.32px] text-white transition-colors hover:bg-[#1c65da]/90"
              >
                Register
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

function BagIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M10.6665 10.6667V9.33333C10.6665 7.91885 11.2284 6.56229 12.2286 5.5621C13.2288 4.5619 14.5853 4 15.9998 4C17.4143 4 18.7709 4.5619 19.7711 5.5621C20.7713 6.56229 21.3332 7.91885 21.3332 9.33333V10.6667"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.78133 10.1134C4 10.8947 4 12.1507 4 14.6654V18.6654C4 23.6934 4 26.208 5.56267 27.7694C7.12533 29.3307 9.63867 29.332 14.6667 29.332H17.3333C22.3613 29.332 24.876 29.332 26.4373 27.7694C27.9987 26.2067 28 23.6934 28 18.6654V14.6654C28 12.1507 28 10.8947 27.2187 10.1134C26.4373 9.33203 25.1813 9.33203 22.6667 9.33203H9.33333C6.81867 9.33203 5.56267 9.33203 4.78133 10.1134ZM13.3333 15.9987C13.3333 15.6451 13.1929 15.3059 12.9428 15.0559C12.6928 14.8058 12.3536 14.6654 12 14.6654C11.6464 14.6654 11.3072 14.8058 11.0572 15.0559C10.8071 15.3059 10.6667 15.6451 10.6667 15.9987V18.6654C10.6667 19.019 10.8071 19.3581 11.0572 19.6082C11.3072 19.8582 11.6464 19.9987 12 19.9987C12.3536 19.9987 12.6928 19.8582 12.9428 19.6082C13.1929 19.3581 13.3333 19.019 13.3333 18.6654V15.9987ZM21.3333 15.9987C21.3333 15.6451 21.1929 15.3059 20.9428 15.0559C20.6928 14.8058 20.3536 14.6654 20 14.6654C19.6464 14.6654 19.3072 14.8058 19.0572 15.0559C18.8071 15.3059 18.6667 15.6451 18.6667 15.9987V18.6654C18.6667 19.019 18.8071 19.3581 19.0572 19.6082C19.3072 19.8582 19.6464 19.9987 20 19.9987C20.3536 19.9987 20.6928 19.8582 20.9428 19.6082C21.1929 19.3581 21.3333 19.019 21.3333 18.6654V15.9987Z"
        fill="currentColor"
      />
    </svg>
  );
}
