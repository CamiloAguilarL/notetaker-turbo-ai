export const DEFAULT_NOTE_ORDERING = "-updated_at";
export const MAX_SEARCH_LENGTH = 200;

export const noteOrderingOptions = [
  { value: "-updated_at", label: "Recently edited" },
  { value: "updated_at", label: "Oldest edited" },
  { value: "category", label: "Category" },
] as const;

export type NoteOrdering = (typeof noteOrderingOptions)[number]["value"];

type NotesQuery = {
  category?: string;
  search?: string;
  ordering?: NoteOrdering;
  undo?: string;
};

export function normalizeSearchQuery(value?: string): string {
  return (value ?? "").trim().slice(0, MAX_SEARCH_LENGTH);
}

export function normalizeNoteOrdering(
  value: string | undefined,
  hasCategory: boolean,
): NoteOrdering {
  const isKnown = noteOrderingOptions.some((option) => option.value === value);
  if (!isKnown || (hasCategory && value === "category")) {
    return DEFAULT_NOTE_ORDERING;
  }
  return value as NoteOrdering;
}

export function buildNotesSearchParams({
  category,
  search,
  ordering = DEFAULT_NOTE_ORDERING,
  undo,
}: NotesQuery): URLSearchParams {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (search) params.set("q", normalizeSearchQuery(search));
  if (ordering !== DEFAULT_NOTE_ORDERING) params.set("ordering", ordering);
  if (undo) params.set("undo", undo);
  return params;
}

export function buildNotesHref(query: NotesQuery): string {
  const params = buildNotesSearchParams(query).toString();
  return params ? `/notes?${params}` : "/notes";
}
