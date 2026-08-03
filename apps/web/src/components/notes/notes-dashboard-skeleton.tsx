import { CategoryNavSkeleton } from "@/components/notes/category-nav-skeleton";
import { NoteCardSkeleton } from "@/components/notes/note-card-skeleton";
import { NotesToolbarSkeleton } from "@/components/notes/notes-toolbar-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export function NotesDashboardSkeleton() {
  return (
    <div aria-hidden="true" data-slot="notes-dashboard-skeleton">
      <div className="flex min-h-14 justify-end">
        <div className="border-skeleton-border bg-skeleton-surface flex h-11 w-32 items-center justify-center gap-2 rounded-full border">
          <Skeleton shape="line" tone="ink" className="size-3.5" />
          <Skeleton shape="line" tone="ink" className="h-3.5 w-16" />
        </div>
      </div>

      <div className="grid gap-6 pt-3 lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-12 lg:pt-5">
        <CategoryNavSkeleton />

        <div className="min-w-0">
          <NotesToolbarSkeleton />

          <div className="notes-grid grid gap-4 sm:gap-5">
            {Array.from({ length: 6 }, (_, index) => (
              <NoteCardSkeleton key={index} index={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
