import { ProfileTabs } from "@/components/ProfileTabs";
import { cn } from "@/lib/utils";

interface ProfilePageLayoutProps {
  children: React.ReactNode;
  /** Wider content column on desktop (e.g. Borrowed List at 1000px). */
  wide?: boolean;
}

/**
 * Desktop: Figma 1440px artboard — profile block at 220px from the artboard left edge.
 * Centers a 1440px column in the viewport, then applies pl-[220px].
 */
export function ProfilePageLayout({ children, wide = false }: ProfilePageLayoutProps) {
  return (
    <div className="mx-auto w-full max-w-[560px] lg:max-w-none">
      <div className="flex flex-col gap-4 md:gap-6 lg:relative lg:left-1/2 lg:w-[1440px] lg:max-w-[100vw] lg:-translate-x-1/2 lg:pl-[220px] lg:gap-6">
        <div className="flex w-full flex-col gap-4 md:gap-6 lg:max-w-[557px] lg:gap-6">
          <ProfileTabs />
        </div>
        <div
          className={cn(
            "flex w-full flex-col gap-4 md:gap-6 lg:gap-6",
            wide ? "lg:max-w-[1000px]" : "lg:max-w-[557px]",
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
