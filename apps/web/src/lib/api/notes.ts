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
