"use client";

import { apiRequest } from "@/lib/api/client";
import type { Note, NotePage } from "@/lib/api/types";
import { buildNotesSearchParams, type NoteOrdering } from "@/lib/notes-query";

export type NoteUpdate = Partial<Pick<Note, "category" | "title" | "content">>;

export function createNote(category?: string): Promise<Note> {
  return apiRequest<Note>("/notes/", {
    method: "POST",
    body: JSON.stringify(category ? { category } : {}),
  });
}

export function updateNote(id: string, changes: NoteUpdate): Promise<Note> {
  return apiRequest<Note>(`/notes/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(changes),
  });
}

export function deleteNote(id: string): Promise<void> {
  return apiRequest<void>(`/notes/${id}/`, { method: "DELETE" });
}

export function restoreNote(id: string): Promise<Note> {
  return apiRequest<Note>(`/notes/${id}/restore/`, { method: "POST" });
}

export function reorderNotes(noteIds: string[]): Promise<void> {
  return apiRequest<void>("/notes/reorder/", {
    method: "POST",
    body: JSON.stringify({ note_ids: noteIds }),
  });
}

export function getNotesPage(options: {
  category?: string;
  search?: string;
  ordering: NoteOrdering;
  page: number;
}): Promise<NotePage> {
  const query = buildNotesSearchParams(options);
  if (options.page > 1) query.set("page", String(options.page));
  const suffix = query.toString();
  return apiRequest<NotePage>(`/notes/page/${suffix ? `?${suffix}` : ""}`);
}
