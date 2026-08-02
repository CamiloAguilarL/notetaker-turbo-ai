import { Inbox } from "lucide-react";

import { CategoryNav } from "@/components/notes/category-nav";
import { NewNoteButton } from "@/components/notes/new-note-button";
import { NoteCard } from "@/components/notes/note-card";
import { UndoDeleteBanner } from "@/components/notes/undo-delete-banner";
import { getCategories, getNotes } from "@/lib/api/server";

type NotesPageProps = {
  searchParams: Promise<{
    category?: string | string[];
    undo?: string | string[];
  }>;
};

export default async function NotesPage({ searchParams }: NotesPageProps) {
  const query = await searchParams;
  const requestedCategory = query.category;
  const categoryParam = Array.isArray(requestedCategory)
    ? requestedCategory[0]
    : requestedCategory;
  const categories = await getCategories();
  const activeCategory = categories.some(
    (category) => category.slug === categoryParam,
  )
    ? categoryParam
    : undefined;
  const notes = await getNotes(activeCategory);
  const categoryBySlug = new Map(
    categories.map((category) => [category.slug, category]),
  );
  const activeName = categories.find(
    (category) => category.slug === activeCategory,
  )?.name;
  const requestedUndo = Array.isArray(query.undo) ? query.undo[0] : query.undo;
  const undoId = requestedUndo?.match(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  )
    ? requestedUndo
    : undefined;
  const destination = activeCategory
    ? `/notes?category=${encodeURIComponent(activeCategory)}`
    : "/notes";

  return (
    <main className="mx-auto w-full max-w-screen-2xl px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
      <div className="border-foreground/20 flex items-start justify-between gap-6 border-b pb-8">
        <div>
          <p className="text-muted-foreground font-mono text-xs font-semibold tracking-[0.18em] uppercase">
            Your private notebook
          </p>
          <h1 className="mt-3 font-serif text-5xl leading-none font-semibold tracking-[-0.035em] sm:text-6xl">
            {activeName ?? "All Notes"}
          </h1>
        </div>
        <NewNoteButton category={activeCategory} />
      </div>

      <div className="grid gap-8 pt-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-10">
        <aside className="min-w-0 lg:sticky lg:top-6 lg:self-start">
          <p className="text-muted-foreground mb-3 hidden text-xs font-semibold tracking-[0.14em] uppercase lg:block">
            Categories
          </p>
          <CategoryNav
            categories={categories}
            activeCategory={activeCategory}
          />
        </aside>

        {notes.length ? (
          <section
            aria-label={activeName ? `${activeName} notes` : "All notes"}
            className="grid min-w-0 gap-5 sm:grid-cols-2 xl:grid-cols-3"
          >
            {notes.map((note) => {
              const category = categoryBySlug.get(note.category);
              if (!category) return null;
              return (
                <NoteCard
                  key={note.id}
                  note={note}
                  category={category}
                  returnCategory={activeCategory}
                />
              );
            })}
          </section>
        ) : (
          <section className="border-foreground/25 bg-card/40 grid min-h-[24rem] place-items-center border-2 border-dashed px-6 py-12 text-center">
            <div className="max-w-md">
              <span className="border-foreground bg-note-school mx-auto grid size-16 place-items-center rounded-full border-2 shadow-[3px_4px_0_var(--foreground)]">
                <Inbox aria-hidden="true" className="size-6" />
              </span>
              <h2 className="mt-7 font-serif text-3xl font-semibold">
                {activeName
                  ? `No ${activeName} notes yet`
                  : "Your notes are waiting"}
              </h2>
              <p className="text-muted-foreground mt-3 leading-7">
                {activeName
                  ? "Start one here, or choose another category to keep exploring."
                  : "Capture the first thought. You can change its category whenever you like."}
              </p>
            </div>
          </section>
        )}
      </div>
      {undoId ? (
        <UndoDeleteBanner noteId={undoId} destination={destination} />
      ) : null}
    </main>
  );
}
