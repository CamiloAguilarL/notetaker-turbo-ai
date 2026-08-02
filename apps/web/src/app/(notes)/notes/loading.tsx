export default function NotesLoading() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      aria-label="Loading notes"
      className="mx-auto w-full max-w-[82rem] animate-pulse px-5 pt-2 pb-10 sm:px-8 lg:px-10"
    >
      <div className="flex min-h-14 justify-end">
        <div className="bg-muted h-11 w-32 rounded-full" />
      </div>
      <div className="grid gap-6 pt-5 lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-12">
        <div className="space-y-3">
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index} className="bg-muted h-9 rounded-md" />
          ))}
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="bg-muted min-h-72 rounded-2xl" />
          ))}
        </div>
      </div>
    </main>
  );
}
