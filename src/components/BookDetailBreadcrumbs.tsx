import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookDetailBreadcrumbsProps {
  categoryName?: string;
  categoryId?: number;
  bookTitle: string;
  className?: string;
}

export function BookDetailBreadcrumbs({
  categoryName,
  categoryId,
  bookTitle,
  className,
}: BookDetailBreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex flex-wrap items-center gap-1 text-sm font-semibold leading-7 tracking-[-0.28px]", className)}
    >
      <Link to="/" className="text-[#1C65DA] hover:underline">
        Home
      </Link>
      <ChevronRight className="size-4 shrink-0 text-[#1C65DA]" aria-hidden />
      {categoryName && categoryId ? (
        <>
          <Link
            to={`/books?category=${categoryId}`}
            className="text-[#1C65DA] hover:underline"
          >
            {categoryName}
          </Link>
          <ChevronRight className="size-4 shrink-0 text-[#1C65DA]" aria-hidden />
        </>
      ) : (
        <>
          <Link to="/books" className="text-[#1C65DA] hover:underline">
            Category
          </Link>
          <ChevronRight className="size-4 shrink-0 text-[#1C65DA]" aria-hidden />
        </>
      )}
      <span className="text-[var(--color-ink)]">{bookTitle}</span>
    </nav>
  );
}

function StatDivider() {
  return <div className="h-12 w-px shrink-0 self-stretch bg-[#d5d7da] lg:h-14" aria-hidden />;
}

interface BookDetailStatProps {
  value: string | number;
  label: string;
}

function BookDetailStat({ value, label }: BookDetailStatProps) {
  return (
    <div className="min-w-0 flex-1 lg:min-w-[102px] lg:flex-none">
      <p className="text-lg font-bold leading-8 tracking-[-0.54px] text-[var(--color-ink)] lg:text-2xl lg:leading-9 lg:tracking-normal">
        {value}
      </p>
      <p className="text-sm font-medium tracking-[-0.42px] text-[var(--color-ink)] lg:text-base lg:leading-[30px] lg:tracking-[-0.48px]">
        {label}
      </p>
    </div>
  );
}

export { StatDivider, BookDetailStat };
