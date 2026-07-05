import { useState } from "react";
import { BookFilterPanel } from "@/components/BookFilterPanel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BookListMobileFilterBarProps {
  onChange?: () => void;
}

export function BookListMobileFilterBar({ onChange }: BookListMobileFilterBarProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="shadow-card flex h-[52px] w-full items-center justify-between rounded-xl bg-white p-3 lg:hidden"
      >
        <span className="text-sm font-extrabold leading-7 text-[var(--color-ink)]">
          FILTER
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden
        >
          <path
            d="M5 10H15M2.5 5H17.5M7.5 15H12.5"
            stroke="#0A0D12"
            strokeWidth="1.66667"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="max-h-[85vh] overflow-y-auto rounded-2xl p-5"
          onClose={() => setOpen(false)}
        >
          <DialogHeader>
            <DialogTitle className="text-base font-extrabold text-[var(--color-ink)]">
              Filter
            </DialogTitle>
          </DialogHeader>
          <BookFilterPanel
            showHeading={false}
            onChange={() => {
              onChange?.();
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
