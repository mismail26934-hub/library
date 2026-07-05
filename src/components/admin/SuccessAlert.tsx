import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SuccessAlertProps {
  message: string;
  onClose: () => void;
}

export function SuccessAlert({ message, onClose }: SuccessAlertProps) {
  return (
    <div
      role="status"
      className={cn(
        "fixed z-50 flex items-center gap-2 rounded-lg bg-[#079455] px-3 py-2",
        "left-1/2 top-[68px] h-10 w-[calc(100%-48px)] max-w-[345px] -translate-x-1/2",
        "md:left-auto md:right-[max(1rem,calc((100vw-1200px)/2))] md:top-[116px] md:w-[291px] md:max-w-none md:translate-x-0",
      )}
    >
      <p className="min-w-0 flex-1 text-sm font-semibold leading-7 tracking-[-0.28px] text-white">
        {message}
      </p>
      <button
        type="button"
        onClick={onClose}
        className="flex size-4 shrink-0 items-center justify-center text-white"
        aria-label="Dismiss notification"
      >
        <X className="size-4" strokeWidth={2.5} />
      </button>
    </div>
  );
}
