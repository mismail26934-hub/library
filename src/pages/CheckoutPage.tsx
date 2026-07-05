import { useMemo, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";
import { addDays, format } from "date-fns";
import { Calendar } from "lucide-react";
import { booksApi } from "@/lib/api-endpoints";
import { qk } from "@/lib/query-keys";
import { useRemoveFromCart } from "@/features/cart/useCart";
import { useProfile } from "@/features/profile/useProfile";
import { useBorrow } from "@/features/loans/useLoans";
import { BorrowRadio } from "@/components/checkout/BorrowRadio";
import { CheckoutBookRow } from "@/components/checkout/CheckoutBookRow";
import { FilterCheckbox } from "@/components/FilterCheckbox";
import { LoadingSpinner, ErrorState, EmptyState } from "@/components/states";
import { toast } from "sonner";
import type { Book, BookDetail } from "@/types";

const DURATIONS = [
  { days: 3, label: "3 Days" },
  { days: 5, label: "5 Days" },
  { days: 10, label: "10 Days" },
] as const;

interface CheckoutLocationState {
  bookIds?: number[];
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex h-[30px] items-center justify-between text-base text-[var(--color-ink)]">
      <span className="font-medium tracking-[-0.48px]">{label}</span>
      <span className="font-bold tracking-[-0.32px]">{value}</span>
    </div>
  );
}

export function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const removeFromCart = useRemoveFromCart();
  const state = (location.state ?? {}) as CheckoutLocationState;

  const bookIds = useMemo(() => {
    const ids = state.bookIds ?? [];
    return [...new Set(ids.filter((id) => Number.isFinite(id) && id > 0))];
  }, [state.bookIds]);

  const { data: profileData, isLoading: profileLoading, isError: profileError, refetch } =
    useProfile();

  const bookQueries = useQueries({
    queries: bookIds.map((id) => ({
      queryKey: qk.book(id),
      queryFn: () => booksApi.detail(id),
      enabled: bookIds.length > 0,
    })),
  });

  const books: Book[] = bookQueries
    .map((q) => q.data)
    .filter((b): b is BookDetail => Boolean(b));

  const booksLoading = bookQueries.some((q) => q.isLoading);
  const booksError = bookQueries.some((q) => q.isError);

  const borrow = useBorrow();

  const [days, setDays] = useState<number>(3);
  const [agreeReturn, setAgreeReturn] = useState(false);
  const [agreePolicy, setAgreePolicy] = useState(false);

  const borrowDate = useMemo(() => new Date(), []);
  const returnDate = addDays(borrowDate, days);

  if (bookIds.length === 0) {
    return <Navigate to="/books" replace />;
  }

  if (profileLoading || booksLoading) {
    return <LoadingSpinner label="Loading checkout..." />;
  }

  if (profileError || !profileData) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  if (booksError || books.length === 0) {
    return (
      <EmptyState
        title="Could not load books"
        description="Some books are unavailable. Go back and try again."
        action={
          <Link to="/books" className="text-[#1c65da] font-semibold hover:underline">
            Browse books
          </Link>
        }
      />
    );
  }

  const { profile } = profileData;
  const canConfirm = agreeReturn && agreePolicy && !borrow.isPending;

  const handleConfirm = async () => {
    if (!canConfirm) return;

    try {
      for (const book of books) {
        await borrow.mutateAsync({ bookId: book.id, days });
        await removeFromCart.mutateAsync(book.id);
      }
      navigate("/loans", { replace: true });
    } catch {
      // useBorrow shows toast on error
    }
  };

  return (
    <div className="mx-auto w-full max-w-[560px] lg:max-w-none">
      <div className="flex flex-col gap-6 lg:relative lg:left-1/2 lg:w-[1440px] lg:max-w-[100vw] lg:-translate-x-1/2 lg:pl-[220px] lg:gap-8">
        <div className="flex w-full max-w-[1002px] flex-col gap-6 lg:gap-8">
          <h1 className="text-2xl font-bold leading-9 text-[var(--color-ink)] lg:text-4xl lg:leading-[44px]">
            Checkout
          </h1>

          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-[58px]">
            <div className="flex min-w-0 flex-1 flex-col gap-8">
              <section className="flex flex-col gap-4">
                <h2 className="text-2xl font-bold leading-9 text-[var(--color-ink)]">
                  User Information
                </h2>
                <InfoRow label="Name" value={profile.name} />
                <InfoRow label="Email" value={profile.email} />
                <InfoRow label="Nomor Handphone" value={profile.phone || "-"} />
              </section>

              <hr className="border-[#d5d7da]" />

              <section className="flex flex-col gap-4">
                <h2 className="text-2xl font-bold leading-9 text-[var(--color-ink)]">
                  Book List
                </h2>
                <div className="flex flex-col gap-4">
                  {books.map((book) => (
                    <CheckoutBookRow key={book.id} book={book} />
                  ))}
                </div>
              </section>
            </div>

            <aside className="shadow-card flex w-full shrink-0 flex-col gap-4 rounded-[20px] bg-white p-4 lg:w-[478px] lg:gap-6 lg:p-5">
              <h2 className="text-xl font-bold leading-[34px] tracking-[-0.4px] text-[var(--color-ink)] lg:text-[28px] lg:leading-[38px] lg:tracking-[-0.56px]">
                Complete Your Borrow Request
              </h2>

              <div className="flex flex-col gap-4 lg:gap-6">
                <div className="flex flex-col gap-0.5">
                  <label className="text-sm font-bold leading-7 tracking-[-0.28px] text-[var(--color-ink)]">
                    Borrow Date
                  </label>
                  <div className="flex h-12 items-center gap-2 rounded-xl border border-[#d5d7da] bg-[#f5f5f5] px-4">
                    <span className="flex-1 text-base font-semibold tracking-[-0.32px] text-[var(--color-ink)]">
                      {format(borrowDate, "dd MMM yyyy")}
                    </span>
                    <Calendar className="size-5 shrink-0 text-[var(--color-ink)]" aria-hidden />
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <p className="text-base font-bold tracking-[-0.32px] text-[var(--color-ink)]">
                    Borrow Duration
                  </p>
                  {DURATIONS.map((option) => (
                    <BorrowRadio
                      key={option.days}
                      checked={days === option.days}
                      onChange={() => setDays(option.days)}
                      label={option.label}
                    />
                  ))}
                </div>

                <div className="rounded-xl bg-[#f6f9fe] p-4">
                  <p className="text-base font-bold tracking-[-0.32px] text-[var(--color-ink)]">
                    Return Date
                  </p>
                  <p className="text-base font-medium tracking-[-0.48px] text-[var(--color-ink)]">
                    Please return the book no later than{" "}
                    <span className="font-bold tracking-[-0.32px] text-[#ee1d52]">
                      {format(returnDate, "dd MMMM yyyy")}
                    </span>
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <FilterCheckbox
                    checked={agreeReturn}
                    onClick={() => setAgreeReturn((v) => !v)}
                    label="I agree to return the book(s) before the due date."
                  />
                  <FilterCheckbox
                    checked={agreePolicy}
                    onClick={() => setAgreePolicy((v) => !v)}
                    label="I accept the library borrowing policy."
                  />
                </div>

                <button
                  type="button"
                  disabled={!canConfirm}
                  onClick={() => {
                    if (!agreeReturn || !agreePolicy) {
                      toast.error("Please accept all agreements");
                      return;
                    }
                    handleConfirm();
                  }}
                  className="flex h-12 w-full items-center justify-center rounded-full bg-[#1c65da] text-base font-bold tracking-[-0.32px] text-white transition-colors hover:bg-[#1c65da]/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {borrow.isPending ? "Processing..." : "Confirm & Borrow"}
                </button>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
