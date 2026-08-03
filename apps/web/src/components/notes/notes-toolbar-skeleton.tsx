import { Skeleton } from "@/components/ui/skeleton";

export function NotesToolbarSkeleton() {
  return (
    <div data-slot="notes-toolbar-skeleton" className="mb-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="border-skeleton-border bg-skeleton-surface h-dashboard-control rounded-control flex w-full items-center gap-3 border px-3 sm:max-w-md">
          <Skeleton shape="line" tone="ink" className="size-4" />
          <Skeleton shape="line" tone="ink" className="h-3.5 w-36" />
        </div>

        <div className="border-skeleton-border bg-skeleton-surface h-dashboard-control rounded-control flex w-40 items-center justify-between border px-4 sm:ml-auto">
          <Skeleton shape="line" tone="ink" className="h-3.5 w-24" />
          <Skeleton shape="line" tone="ink" className="size-3" />
        </div>
      </div>
      <Skeleton shape="line" className="mt-2 h-3 w-12" />
    </div>
  );
}
