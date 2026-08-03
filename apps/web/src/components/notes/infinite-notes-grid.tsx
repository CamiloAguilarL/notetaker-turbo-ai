"use client";

import { LoaderCircle } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  AnimatedNotesGrid,
  type NotesGridItem,
} from "@/components/notes/animated-notes-grid";
import { Button } from "@/components/ui/button";
import { getNotesPage } from "@/lib/api/notes";
import type { Category } from "@/lib/api/types";
import { formatNoteDate } from "@/lib/format-date";
import type { NoteOrdering } from "@/lib/notes-query";

type InfiniteNotesGridProps = {
  label: string;
  initialNotes: NotesGridItem[];
  categories: Category[];
  nextPage: number | null;
  totalCount: number;
  dateReference: string;
  category?: string;
  search?: string;
  ordering: NoteOrdering;
  returnQuery?: string;
};

type LoadStatus = "idle" | "loading" | "error";

export function InfiniteNotesGrid({
  label,
  initialNotes,
  categories,
  nextPage: initialNextPage,
  totalCount,
  dateReference,
  category,
  search,
  ordering,
  returnQuery,
}: InfiniteNotesGridProps) {
  const [notes, setNotes] = useState(initialNotes);
  const [nextPage, setNextPage] = useState(initialNextPage);
  const [status, setStatus] = useState<LoadStatus>("idle");
  const sentinelRef = useRef<HTMLDivElement>(null);
  const isLoadingRef = useRef(false);
  const categoryBySlug = useMemo(
    () => new Map(categories.map((item) => [item.slug, item])),
    [categories],
  );

  const loadMore = useCallback(async () => {
    if (nextPage === null || isLoadingRef.current) return;

    isLoadingRef.current = true;
    setStatus("loading");
    try {
      const response = await getNotesPage({
        category,
        search,
        ordering,
        page: nextPage,
      });
      const reference = new Date(dateReference);
      const items = response.results.flatMap((note) => {
        const noteCategory = categoryBySlug.get(note.category);
        return noteCategory
          ? [
              {
                note,
                category: noteCategory,
                displayDate: formatNoteDate(note.updated_at, reference),
              },
            ]
          : [];
      });
      setNotes((current) => {
        const currentIds = new Set(current.map(({ note }) => note.id));
        return [
          ...current,
          ...items.filter(({ note }) => !currentIds.has(note.id)),
        ];
      });
      setNextPage(response.next_page);
      setStatus("idle");
    } catch {
      setStatus("error");
    } finally {
      isLoadingRef.current = false;
    }
  }, [category, categoryBySlug, dateReference, nextPage, ordering, search]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || nextPage === null || !("IntersectionObserver" in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) void loadMore();
      },
      { rootMargin: "320px 0px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore, nextPage]);

  const hasProgressivePages =
    initialNextPage !== null || notes.length < totalCount;

  return (
    <div>
      <AnimatedNotesGrid
        label={label}
        notes={notes}
        returnQuery={returnQuery}
      />

      {nextPage !== null ? (
        <div
          ref={sentinelRef}
          className="flex min-h-24 flex-col items-center justify-center gap-2 pt-5"
        >
          {status === "error" ? (
            <p role="alert" className="text-destructive text-sm">
              More notes couldn’t be loaded.
            </p>
          ) : null}
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={status === "loading"}
            onClick={() => void loadMore()}
          >
            {status === "loading" ? (
              <LoaderCircle aria-hidden="true" className="animate-spin" />
            ) : null}
            {status === "loading"
              ? "Loading more notes…"
              : status === "error"
                ? "Try again"
                : "Load more notes"}
          </Button>
        </div>
      ) : hasProgressivePages ? (
        <p
          aria-live="polite"
          className="text-muted-foreground py-8 text-center text-xs"
        >
          All {totalCount} {totalCount === 1 ? "note" : "notes"} loaded.
        </p>
      ) : null}
    </div>
  );
}
