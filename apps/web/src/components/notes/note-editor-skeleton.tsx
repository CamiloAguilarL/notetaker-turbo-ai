import { Skeleton } from "@/components/ui/skeleton";

export function NoteEditorSkeleton() {
  return (
    <div aria-hidden="true" data-slot="note-editor-skeleton">
      <div className="flex min-h-14 items-center justify-between gap-4 pb-3">
        <div className="border-skeleton-border bg-skeleton-surface w-category-trigger rounded-control flex h-11 items-center gap-2 border px-3">
          <Skeleton shape="line" tone="ink" className="size-2.5" />
          <Skeleton shape="line" tone="ink" className="h-3 w-24" />
          <Skeleton shape="line" tone="ink" className="ml-auto h-3 w-5" />
        </div>
        <div className="flex items-center gap-1">
          <div className="flex h-10 w-24 items-center justify-center gap-2">
            <Skeleton shape="line" tone="ink" className="size-3.5" />
            <Skeleton shape="line" tone="ink" className="h-3 w-12" />
          </div>
          <Skeleton shape="control" className="size-9" />
        </div>
      </div>

      <div className="border-skeleton-border bg-skeleton-surface border-note min-h-[calc(100dvh-9rem)] rounded-2xl p-5 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex min-h-10 flex-wrap items-center justify-end gap-x-4 gap-y-1">
            <Skeleton shape="line" tone="ink" className="h-3 w-48" />
            <Skeleton shape="line" tone="ink" className="h-3 w-14" />
          </div>

          <Skeleton
            shape="line"
            tone="ink"
            className="mt-4 h-10 w-4/5 sm:mt-6 sm:h-11 md:w-2/3"
          />

          <div className="mt-7 space-y-3.5">
            <Skeleton shape="line" tone="ink" className="h-4 w-full" />
            <Skeleton shape="line" tone="ink" className="h-4 w-11/12" />
            <Skeleton shape="line" tone="ink" className="h-4 w-full" />
            <Skeleton shape="line" tone="ink" className="h-4 w-4/5" />
            <Skeleton shape="line" tone="ink" className="h-4 w-11/12" />
            <Skeleton shape="line" tone="ink" className="h-4 w-2/3" />
            <Skeleton
              shape="line"
              tone="ink"
              className="hidden h-4 w-5/6 sm:block"
            />
            <Skeleton
              shape="line"
              tone="ink"
              className="hidden h-4 w-1/2 sm:block"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
