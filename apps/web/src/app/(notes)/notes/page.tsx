import Image from "next/image";

import { CategoryNav } from "@/components/notes/category-nav";
import { NewNoteButton } from "@/components/notes/new-note-button";
import { NoteCard } from "@/components/notes/note-card";
import { NotesToolbar } from "@/components/notes/notes-toolbar";
import { UndoDeleteBanner } from "@/components/notes/undo-delete-banner";
import { getCategories, getNotes } from "@/lib/api/server";
import {
  buildNotesHref,
  buildNotesSearchParams,
  normalizeNoteOrdering,
  normalizeSearchQuery,
} from "@/lib/notes-query";

type NotesPageProps = {
  searchParams: Promise<{
    category?: string | string[];
    q?: string | string[];
    ordering?: string | string[];
    undo?: string | string[];
  }>;
};

function first(value?: string | string[]): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function NotesPage({ searchParams }: NotesPageProps) {
  const query = await searchParams;
  const categoryParam = first(query.category);
  const categories = await getCategories();
  const activeCategory = categories.some(
    (category) => category.slug === categoryParam,
  )
    ? categoryParam
    : undefined;
  const searchQuery = normalizeSearchQuery(first(query.q));
  const ordering = normalizeNoteOrdering(
    first(query.ordering),
    Boolean(activeCategory),
  );
  const notes = await getNotes({
    category: activeCategory,
    search: searchQuery,
    ordering,
  });
  const categoryBySlug = new Map(
    categories.map((category) => [category.slug, category]),
  );
  const activeName = categories.find(
    (category) => category.slug === activeCategory,
  )?.name;
  const requestedUndo = first(query.undo);
  const undoId = requestedUndo?.match(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  )
    ? requestedUndo
    : undefined;
  const dashboardQuery = buildNotesSearchParams({
    category: activeCategory,
    search: searchQuery,
    ordering,
  }).toString();
  const destination = buildNotesHref({
    category: activeCategory,
    search: searchQuery,
    ordering,
  });

  return (
    <main className="mx-auto w-full max-w-[82rem] px-5 pt-2 pb-10 sm:px-8 lg:px-10 lg:pb-14">
      <h1 className="sr-only">{activeName ?? "All Notes"}</h1>
      <div className="flex min-h-14 items-start justify-end">
        <NewNoteButton
          category={activeCategory}
          returnQuery={dashboardQuery || undefined}
        />
      </div>

      <div className="grid gap-6 pt-3 lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-12 lg:pt-5">
        <aside className="min-w-0 lg:sticky lg:top-4 lg:self-start">
          <CategoryNav
            categories={categories}
            activeCategory={activeCategory}
            searchQuery={searchQuery}
            ordering={ordering}
          />
        </aside>

        <div className="min-w-0">
          <NotesToolbar
            key={`${activeCategory ?? "all"}:${searchQuery}:${ordering}`}
            initialSearch={searchQuery}
            ordering={ordering}
            activeCategory={activeCategory}
            resultCount={notes.length}
          />

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
                    returnQuery={dashboardQuery || undefined}
                  />
                );
              })}
            </section>
          ) : (
            <section className="grid min-h-[27rem] place-items-center px-6 py-10 text-center">
              <div className="max-w-lg">
                <Image
                  src="/illustrations/empty-boba.png"
                  alt=""
                  width={1254}
                  height={1254}
                  className="mx-auto h-auto w-44 sm:w-52"
                />
                <h2 className="mt-3 font-serif text-2xl leading-snug font-semibold sm:text-3xl">
                  {searchQuery
                    ? `No notes match “${searchQuery}”`
                    : activeName
                      ? `No ${activeName} notes yet`
                      : "I’m just here waiting for your charming notes…"}
                </h2>
                {searchQuery || activeName ? (
                  <p className="text-muted-foreground mt-2 text-sm leading-6">
                    {searchQuery
                      ? "Try another phrase or clear the search to see every note in this view."
                      : "Start one here, or choose another category to keep exploring."}
                  </p>
                ) : null}
              </div>
            </section>
          )}
        </div>
      </div>
      {undoId ? (
        <UndoDeleteBanner noteId={undoId} destination={destination} />
      ) : null}
    </main>
  );
}
