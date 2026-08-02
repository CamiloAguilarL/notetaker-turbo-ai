"use client";

import { apiRequest } from "@/lib/api/client";
import type { Note } from "@/lib/api/types";

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
