import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const labelWidths = ["w-20", "w-24", "w-12", "w-16", "w-12"] as const;

export function CategoryNavSkeleton() {
  return (
    <div
      data-slot="category-nav-skeleton"
      className="flex gap-2 overflow-hidden pb-2 lg:block lg:space-y-1 lg:overflow-visible lg:pb-0"
    >
      {labelWidths.map((labelWidth, index) => (
        <div
          key={`${labelWidth}-${index}`}
          className="border-skeleton-border bg-skeleton-surface flex h-11 w-36 shrink-0 items-center gap-3 rounded-full border px-4 lg:h-9 lg:w-full lg:rounded-md lg:border-transparent lg:bg-transparent lg:px-1.5"
        >
          {index ? (
            <Skeleton shape="line" tone="ink" className="size-2.5" />
          ) : null}
          <Skeleton shape="line" tone="ink" className={cn("h-3", labelWidth)} />
          <Skeleton shape="line" tone="ink" className="ml-auto h-3 w-3" />
        </div>
      ))}
    </div>
  );
}
