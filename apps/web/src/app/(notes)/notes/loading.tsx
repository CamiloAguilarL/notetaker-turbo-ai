import { NotesDashboardSkeleton } from "@/components/notes/notes-dashboard-skeleton";

export default function NotesLoading() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      aria-label="Loading notes"
      aria-busy="true"
      className="max-w-app mx-auto w-full px-5 pt-2 pb-10 sm:px-8 lg:px-10"
    >
      <NotesDashboardSkeleton />
    </main>
  );
}
