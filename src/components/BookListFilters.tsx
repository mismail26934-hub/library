import { BookFilterPanel } from "@/components/BookFilterPanel";

interface BookListFiltersProps {
  onChange?: () => void;
}

export function BookListFilters({ onChange }: BookListFiltersProps) {
  return (
    <aside className="shadow-card hidden w-[266px] shrink-0 flex-col rounded-xl bg-white py-4 lg:flex">
      <div className="px-4">
        <BookFilterPanel onChange={onChange} />
      </div>
    </aside>
  );
}
