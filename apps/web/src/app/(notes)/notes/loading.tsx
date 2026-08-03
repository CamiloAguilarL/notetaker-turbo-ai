export default function NotesLoading() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      aria-label="Loading notes"
      className="max-w-app mx-auto w-full animate-pulse px-5 pt-2 pb-10 sm:px-8 lg:px-10"
    >
      <div className="flex min-h-14 justify-end">
        <div className="bg-muted h-11 w-32 rounded-full" />
      </div>
      <div className="grid gap-6 pt-5 lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-12">
        <div className="flex gap-2 overflow-hidden pb-2 lg:block lg:space-y-3 lg:overflow-visible lg:pb-0">
          {Array.from({ length: 5 }, (_, index) => (
            <div
              key={index}
              className="bg-muted h-11 w-36 shrink-0 rounded-full lg:h-9 lg:w-full lg:rounded-md"
            />
          ))}
        </div>
        <div className="notes-grid grid gap-4 sm:gap-5">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="bg-muted min-h-note-card rounded-2xl" />
          ))}
        </div>
      </div>
    </main>
  );
}
