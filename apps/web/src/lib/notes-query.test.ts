import { describe, expect, it } from "vitest";

import {
  buildNotesHref,
  buildNotesSearchParams,
  DEFAULT_NOTE_ORDERING,
  MAX_SEARCH_LENGTH,
  normalizeNoteOrdering,
  normalizeSearchQuery,
} from "@/lib/notes-query";

describe("notes query state", () => {
  it("normalizes external search and ordering values", () => {
    expect(normalizeSearchQuery(`  ${"x".repeat(250)}  `)).toHaveLength(
      MAX_SEARCH_LENGTH,
    );
    expect(normalizeNoteOrdering("updated_at", false)).toBe("updated_at");
    expect(normalizeNoteOrdering("category", true)).toBe(DEFAULT_NOTE_ORDERING);
    expect(normalizeNoteOrdering("unknown", false)).toBe(DEFAULT_NOTE_ORDERING);
  });

  it("builds canonical URLs and omits default state", () => {
    expect(buildNotesHref({})).toBe("/notes");
    expect(
      buildNotesHref({
        category: "school",
        search: "  systems  ",
        ordering: "updated_at",
      }),
    ).toBe("/notes?category=school&q=systems&ordering=updated_at");
    expect(buildNotesSearchParams({ undo: "note-id" }).toString()).toBe(
      "undo=note-id",
    );
  });
});
