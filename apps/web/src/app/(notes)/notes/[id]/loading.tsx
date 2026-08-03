import { NoteEditorSkeleton } from "@/components/notes/note-editor-skeleton";

export default function NoteLoading() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      aria-label="Loading note"
      aria-busy="true"
      className="max-w-app mx-auto w-full px-4 pt-1 pb-5 sm:px-8 lg:px-10"
    >
      <NoteEditorSkeleton />
    </main>
  );
}
