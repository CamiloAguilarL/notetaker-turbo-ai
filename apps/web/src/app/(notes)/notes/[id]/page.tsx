import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { NoteEditor } from "@/components/notes/note-editor";
import { getCategories, getNote } from "@/lib/api/server";
import {
  buildNotesHref,
  normalizeNoteOrdering,
  normalizeSearchQuery,
} from "@/lib/notes-query";

export const metadata: Metadata = {
  title: "Edit note",
  description: "Edit a private note in Turbo Notes.",
};

type NotePageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ return?: string | string[] }>;
};

export default async function NotePage({
  params,
  searchParams,
}: NotePageProps) {
  const { id } = await params;
  const [note, categories] = await Promise.all([getNote(id), getCategories()]);
  if (!note) notFound();

  const requestedReturn = (await searchParams).return;
  const returnParam = Array.isArray(requestedReturn)
    ? requestedReturn[0]
    : requestedReturn;
  const returnParams = new URLSearchParams(returnParam ?? "");
  const requestedCategory = returnParams.get("category") ?? undefined;
  const returnCategory = categories.some(
    (category) => category.slug === requestedCategory,
  )
    ? requestedCategory
    : undefined;
  const returnSearch = normalizeSearchQuery(returnParams.get("q") ?? undefined);
  const returnOrdering = normalizeNoteOrdering(
    returnParams.get("ordering") ?? undefined,
    Boolean(returnCategory),
  );
  const returnTo = buildNotesHref({
    category: returnCategory,
    search: returnSearch,
    ordering: returnOrdering,
  });

  return <NoteEditor note={note} categories={categories} returnTo={returnTo} />;
}
