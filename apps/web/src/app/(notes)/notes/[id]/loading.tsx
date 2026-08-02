export default function NoteLoading() {
  return (
    <main
      aria-label="Loading note"
      className="mx-auto w-full max-w-6xl animate-pulse px-4 py-5 sm:px-8 sm:py-8 lg:px-10"
    >
      <div className="border-border bg-muted min-h-[calc(100dvh-8rem)] border-2 p-8 lg:p-12">
        <div className="border-foreground/20 h-12 border-b" />
        <div className="mx-auto max-w-3xl py-14">
          <div className="bg-card h-16 w-4/5 rounded" />
          <div className="bg-card mt-10 h-64 rounded" />
        </div>
      </div>
    </main>
  );
}
