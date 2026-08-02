"use client";

import { apiRequest } from "@/lib/api/client";
import type { Note } from "@/lib/api/types";

export function createNote(category?: string): Promise<Note> {
  return apiRequest<Note>("/notes/", {
    method: "POST",
    body: JSON.stringify(category ? { category } : {}),
  });
}
