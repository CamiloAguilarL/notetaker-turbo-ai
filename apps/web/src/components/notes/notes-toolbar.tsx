"use client";

import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NoteOrderingSelect } from "@/components/notes/note-ordering-select";
import {
  buildNotesHref,
  DEFAULT_NOTE_ORDERING,
  MAX_SEARCH_LENGTH,
  noteOrderingOptions,
  normalizeSearchQuery,
  type NoteOrdering,
} from "@/lib/notes-query";

type NotesToolbarProps = {
  initialSearch: string;
  ordering: NoteOrdering;
  activeCategory?: string;
  resultCount: number;
};

const SEARCH_DELAY = 350;

export function NotesToolbar({
  initialSearch,
  ordering,
  activeCategory,
  resultCount,
}: NotesToolbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(initialSearch);
  const [isPending, startTransition] = useTransition();

  const navigate = useCallback(
    (nextSearch: string, nextOrdering: NoteOrdering) => {
      const safeOrdering =
        nextOrdering === "manual" && (activeCategory || nextSearch)
          ? DEFAULT_NOTE_ORDERING
          : nextOrdering;
      startTransition(() => {
        router.replace(
          buildNotesHref({
            category: activeCategory,
            search: nextSearch,
            ordering: safeOrdering,
          }),
        );
      });
    },
    [activeCategory, router],
  );

  useEffect(() => {
    const normalized = normalizeSearchQuery(search);
    const current = normalizeSearchQuery(searchParams.get("q") ?? undefined);
    if (normalized === current) return;

    const timer = window.setTimeout(
      () => navigate(normalized, ordering),
      SEARCH_DELAY,
    );
    return () => window.clearTimeout(timer);
  }, [navigate, ordering, search, searchParams]);

  function clearSearch() {
    setSearch("");
    navigate("", ordering);
  }

  function changeOrdering(value: string) {
    const nextOrdering = value as NoteOrdering;
    navigate(normalizeSearchQuery(search), nextOrdering);
  }

  const availableOrderings = noteOrderingOptions.filter((option) => {
    if (activeCategory && option.value === "category") return false;
    if (
      (activeCategory || normalizeSearchQuery(search)) &&
      option.value === "manual"
    ) {
      return false;
    }
    return true;
  });

  return (
    <section aria-label="Find and sort notes" className="mb-6">
      <div
        data-slot="notes-toolbar-controls"
        className="flex flex-col gap-3 sm:flex-row sm:items-center"
      >
        <div className="relative min-w-0 flex-1 sm:max-w-md">
          <label htmlFor="note-search" className="sr-only">
            Search notes
          </label>
          <Search
            aria-hidden="true"
            className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
          />
          <Input
            id="note-search"
            name="note-search"
            type="search"
            autoComplete="off"
            value={search}
            onChange={(event) => setSearch(event.currentTarget.value)}
            maxLength={MAX_SEARCH_LENGTH}
            placeholder="Search your notes"
            variant="search"
          />
          {search ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Clear search"
              className="absolute top-1/2 right-2 -translate-y-1/2"
              onClick={clearSearch}
            >
              <X aria-hidden="true" />
            </Button>
          ) : null}
        </div>
        <NoteOrderingSelect
          options={availableOrderings}
          value={ordering}
          onValueChange={changeOrdering}
        />
      </div>
      <p
        data-slot="notes-result-count"
        aria-live="polite"
        className="text-muted-foreground mt-2 text-xs"
      >
        {isPending
          ? "Updating notes…"
          : `${resultCount} ${resultCount === 1 ? "note" : "notes"}`}
      </p>
    </section>
  );
}
