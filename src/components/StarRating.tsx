import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
  className?: string;
  readOnly?: boolean;
}

export function StarRating({
  value,
  onChange,
  size = 16,
  className,
  readOnly = true,
}: StarRatingProps) {
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(star)}
          className={cn(!readOnly && "cursor-pointer transition-transform hover:scale-110")}
          aria-label={`${star} star`}
        >
          <Star
            style={{ width: size, height: size }}
            className={cn(
              star <= value
                ? "fill-[var(--color-star)] text-[var(--color-star)]"
                : "fill-transparent text-muted-foreground/40",
            )}
          />
        </button>
      ))}
    </div>
  );
}
