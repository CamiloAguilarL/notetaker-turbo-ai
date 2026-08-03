export default function NoteLoading() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      aria-label="Loading note"
      className="max-w-app mx-auto w-full animate-pulse px-4 pt-1 pb-5 sm:px-8 lg:px-10"
    >
      <div className="mb-3 flex min-h-14 items-center justify-between">
        <div className="bg-muted h-10 w-36 rounded-full" />
        <div className="bg-muted size-10 rounded-full" />
      </div>
      <div className="border-border bg-muted border-note min-h-[calc(100dvh-9rem)] rounded-2xl p-8 lg:p-12">
        <div className="mx-auto max-w-5xl">
          <div className="bg-card ml-auto h-4 w-48 rounded" />
          <div className="bg-card mt-8 h-12 w-4/5 rounded" />
          <div className="bg-card mt-8 h-64 rounded" />
        </div>
      </div>
    </main>
  );
}
