import { Skeleton } from "@/components/ui/skeleton";

export function NotesToolbarSkeleton() {
  return (
    <div
      data-slot="notes-toolbar-skeleton"
      className="mb-6 flex flex-col gap-3 md:flex-row md:items-center"
    >
      <div className="border-skeleton-border bg-skeleton-surface flex h-10 w-full items-center gap-3 rounded-lg border px-3 md:max-w-md">
        <Skeleton shape="line" tone="ink" className="size-4" />
        <Skeleton shape="line" tone="ink" className="h-3.5 w-36" />
      </div>

      <div className="flex items-center justify-between gap-3 md:ml-auto md:justify-end">
        <Skeleton shape="line" className="h-3.5 w-14" />
        <div className="border-skeleton-border bg-skeleton-surface flex h-10 w-40 items-center justify-between rounded-full border px-4">
          <Skeleton shape="line" tone="ink" className="h-3.5 w-24" />
          <Skeleton shape="line" tone="ink" className="size-3" />
        </div>
      </div>
    </div>
  );
}
