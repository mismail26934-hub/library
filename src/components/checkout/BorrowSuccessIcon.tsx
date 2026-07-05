import { Check } from "lucide-react";

export function BorrowSuccessIcon() {
  return (
    <div className="flex items-center justify-center rounded-full border border-[#e9eaeb] p-1.5">
      <div className="flex items-center justify-center rounded-full border border-[#e9eaeb] p-1.5">
        <div className="flex size-[117px] items-center justify-center rounded-full border border-[#e9eaeb] bg-[#1c65da]">
          <Check className="size-14 text-white" strokeWidth={3} aria-hidden />
        </div>
      </div>
    </div>
  );
}
