"use client";

import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    <section
      aria-label="Find and sort notes"
      className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center"
    >
      <div className="flex min-w-0 flex-1 gap-1 sm:max-w-md">
        <div className="relative min-w-0 flex-1">
          <label htmlFor="note-search" className="sr-only">
            Search notes
          </label>
          <Search
            aria-hidden="true"
            className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
          />
          <Input
            id="note-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.currentTarget.value)}
            maxLength={MAX_SEARCH_LENGTH}
            placeholder="Search your notes"
            className="border-primary/35 bg-transparent pl-10"
          />
        </div>
        {search ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Clear search"
            onClick={clearSearch}
            className="size-10"
          >
            <X aria-hidden="true" />
          </Button>
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <p aria-live="polite" className="text-muted-foreground text-sm">
          {isPending
            ? "Updating notes…"
            : `${resultCount} ${resultCount === 1 ? "note" : "notes"}`}
        </p>
        <label className="flex items-center gap-2 text-sm font-medium">
          <span className="sr-only sm:not-sr-only">Sort by</span>
          <select
            aria-label="Sort notes"
            value={ordering}
            onChange={(event) => changeOrdering(event.currentTarget.value)}
            className="border-primary/35 focus-visible:ring-ring/40 min-h-10 rounded-full border bg-transparent px-4 outline-none focus-visible:ring-3"
          >
            {availableOrderings.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}
