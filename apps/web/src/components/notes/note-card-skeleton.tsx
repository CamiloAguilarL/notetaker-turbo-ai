import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const titleWidths = ["w-3/4", "w-2/3", "w-4/5"] as const;
const finalLineWidths = ["w-3/5", "w-4/5", "w-1/2"] as const;

export function NoteCardSkeleton({ index }: { index: number }) {
  return (
    <article
      aria-hidden="true"
      data-slot="note-card-skeleton"
      className="border-skeleton-border bg-skeleton-surface border-note h-note-card compact:p-5 rounded-2xl p-4 xl:p-6"
    >
      <div className="flex items-center gap-2">
        <Skeleton shape="line" tone="ink" className="h-3 w-14" />
        <Skeleton shape="line" tone="ink" className="size-1.5" />
        <Skeleton shape="line" tone="ink" className="h-3 w-24" />
      </div>

      <Skeleton
        shape="line"
        tone="ink"
        className={cn("mt-5 h-7", titleWidths[index % titleWidths.length])}
      />

      <div className="mt-4 space-y-2.5">
        <Skeleton shape="line" tone="ink" className="h-3.5 w-full" />
        <Skeleton shape="line" tone="ink" className="h-3.5 w-11/12" />
        <Skeleton
          shape="line"
          tone="ink"
          className={cn(
            "h-3.5",
            finalLineWidths[index % finalLineWidths.length],
          )}
        />
        <Skeleton
          shape="line"
          tone="ink"
          className="hidden h-3.5 w-2/3 xl:block"
        />
      </div>
    </article>
  );
}
