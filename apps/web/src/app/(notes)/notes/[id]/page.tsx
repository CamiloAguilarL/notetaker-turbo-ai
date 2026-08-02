import { notFound } from "next/navigation";

import { NoteEditor } from "@/components/notes/note-editor";
import { getCategories, getNote } from "@/lib/api/server";

type NotePageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string | string[] }>;
};

export default async function NotePage({
  params,
  searchParams,
}: NotePageProps) {
  const { id } = await params;
  const [note, categories] = await Promise.all([getNote(id), getCategories()]);
  if (!note) notFound();

  const requestedReturn = (await searchParams).from;
  const returnParam = Array.isArray(requestedReturn)
    ? requestedReturn[0]
    : requestedReturn;
  const returnCategory = categories.some(
    (category) => category.slug === returnParam,
  )
    ? returnParam
    : undefined;

  return (
    <NoteEditor
      note={note}
      categories={categories}
      returnCategory={returnCategory}
    />
  );
}
