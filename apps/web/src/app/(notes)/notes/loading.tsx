export default function NotesLoading() {
  return (
    <main
      aria-label="Loading notes"
      className="mx-auto w-full max-w-screen-2xl animate-pulse px-5 py-8 sm:px-8 lg:px-10 lg:py-12"
    >
      <div className="border-foreground/20 h-24 border-b">
        <div className="bg-muted h-3 w-32 rounded" />
        <div className="bg-muted mt-4 h-12 w-64 rounded" />
      </div>
      <div className="grid gap-8 pt-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-10">
        <div className="bg-muted h-56 rounded" />
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="bg-muted min-h-72 rounded" />
          ))}
        </div>
      </div>
    </main>
  );
}
