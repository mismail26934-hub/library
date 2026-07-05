import { Star } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setCategory, setRating } from "@/store/uiSlice";
import { useCategories } from "@/features/books/useBooks";
import { FilterCheckbox } from "@/components/FilterCheckbox";
import type { Category } from "@/types";

const FIGMA_CATEGORY_ORDER = [
  "Fiction",
  "Non-Fiction",
  "Non-fiction",
  "Self-Improvement",
  "Self-Improve",
  "Finance",
  "Science",
  "Science-Fiction",
  "Science & Technology",
  "Education",
];

function sortCategories(categories: Category[]) {
  return [...categories].sort((a, b) => {
    const ai = FIGMA_CATEGORY_ORDER.findIndex(
      (n) => n.toLowerCase() === a.name.toLowerCase(),
    );
    const bi = FIGMA_CATEGORY_ORDER.findIndex(
      (n) => n.toLowerCase() === b.name.toLowerCase(),
    );
    const av = ai === -1 ? 999 : ai;
    const bv = bi === -1 ? 999 : bi;
    if (av !== bv) return av - bv;
    return a.name.localeCompare(b.name);
  });
}

interface BookFilterPanelProps {
  onChange?: () => void;
  showHeading?: boolean;
}

export function BookFilterPanel({ onChange, showHeading = true }: BookFilterPanelProps) {
  const dispatch = useAppDispatch();
  const { category, rating } = useAppSelector((s) => s.ui);
  const { data: categories } = useCategories();

  const sorted = sortCategories(categories ?? []).slice(0, 6);

  const pickCategory = (id: number) => {
    dispatch(setCategory(category === id ? null : id));
    onChange?.();
  };

  const pickRating = (value: number) => {
    dispatch(setRating(rating === value ? null : value));
    onChange?.();
  };

  return (
    <>
      <div className="flex flex-col gap-2.5">
        {showHeading && (
          <p className="text-base font-extrabold leading-[30px] text-[var(--color-ink)]">
            FILTER
          </p>
        )}
        <p className="text-lg font-extrabold tracking-[-0.36px] text-[var(--color-ink)]">
          Category
        </p>
        <div className="flex flex-col gap-2">
          {sorted.map((cat) => (
            <FilterCheckbox
              key={cat.id}
              checked={category === cat.id}
              onClick={() => pickCategory(cat.id)}
              label={cat.name}
            />
          ))}
        </div>
      </div>

      <hr className="my-6 border-t border-[#d5d7da]" />

      <div className="flex flex-col gap-2.5">
        <p className="text-lg font-extrabold tracking-[-0.36px] text-[var(--color-ink)]">
          Rating
        </p>
        <div className="flex flex-col">
          {[5, 4, 3, 2, 1].map((value) => (
            <div key={value} className="px-0 py-2">
              <FilterCheckbox
                checked={rating === value}
                onClick={() => pickRating(value)}
                label={`${value} star rating`}
              >
                <span className="flex items-center gap-0.5">
                  <Star className="size-6 fill-[var(--color-star)] text-[var(--color-star)]" />
                  <span className="text-base tracking-[-0.32px] text-[var(--color-ink)]">
                    {value}
                  </span>
                </span>
              </FilterCheckbox>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
