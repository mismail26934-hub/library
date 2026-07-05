import { Link, Navigate, useLocation } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { BorrowSuccessIcon } from "@/components/checkout/BorrowSuccessIcon";

interface BorrowSuccessLocationState {
  returnDate?: string;
}

export function BorrowSuccessPage() {
  const location = useLocation();
  const state = (location.state ?? {}) as BorrowSuccessLocationState;

  if (!state.returnDate) {
    return <Navigate to="/loans" replace />;
  }

  const returnDate = parseISO(state.returnDate);
  const formattedDate = format(returnDate, "dd MMMM yyyy");

  return (
    <div className="flex min-h-[calc(100dvh-180px)] flex-col items-center justify-center px-0 py-8 lg:min-h-[calc(100dvh-220px)] lg:py-12">
      <div className="flex w-full max-w-[345px] flex-col items-center gap-6 lg:max-w-[638px] lg:gap-8">
        <BorrowSuccessIcon />

        <div className="flex w-full flex-col items-center gap-2 text-center text-[var(--color-ink)]">
          <h1 className="text-xl font-bold leading-[34px] tracking-[-0.4px] lg:text-[28px] lg:leading-[38px] lg:tracking-[-0.56px]">
            Borrowing Successful!
          </h1>
          <p className="text-base font-semibold leading-8 tracking-[-0.32px] lg:text-lg lg:tracking-[-0.36px]">
            Your book has been successfully borrowed. Please return it by{" "}
            <span className="font-semibold text-[#ee1d52]">{formattedDate}</span>
          </p>
        </div>

        <Link
          to="/loans"
          className="flex h-12 w-[286px] items-center justify-center rounded-full bg-[#1c65da] text-base font-bold tracking-[-0.32px] text-white transition-colors hover:bg-[#1c65da]/90"
        >
          See Borrowed List
        </Link>
      </div>
    </div>
  );
}
