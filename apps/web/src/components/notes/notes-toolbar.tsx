"use client";

import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  buildNotesHref,
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
      startTransition(() => {
        router.replace(
          buildNotesHref({
            category: activeCategory,
            search: nextSearch,
            ordering: nextOrdering,
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

  const availableOrderings = activeCategory
    ? noteOrderingOptions.filter((option) => option.value !== "category")
    : noteOrderingOptions;

  return (
    <section
      aria-label="Find and sort notes"
      className="border-foreground/20 bg-card/40 mb-5 flex flex-col gap-3 border p-3 sm:flex-row sm:items-center sm:p-4"
    >
      <div className="flex min-w-0 flex-1 gap-1">
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
            className="bg-card h-11 pl-10"
          />
        </div>
        {search ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Clear search"
            onClick={clearSearch}
            className="size-11"
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
        <label className="flex items-center gap-2 text-sm font-semibold">
          <span className="sr-only sm:not-sr-only">Sort by</span>
          <select
            aria-label="Sort notes"
            value={ordering}
            onChange={(event) => changeOrdering(event.currentTarget.value)}
            className="border-foreground/40 bg-card focus-visible:ring-ring/60 min-h-11 rounded-full border px-4 outline-none focus-visible:ring-3"
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
