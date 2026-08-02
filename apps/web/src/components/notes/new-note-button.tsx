"use client";

import { LoaderCircle, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { createNote } from "@/lib/api/notes";

export function NewNoteButton({
  category,
  returnQuery,
}: {
  category?: string;
  returnQuery?: string;
}) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string>();

  async function handleCreate() {
    setIsPending(true);
    setError(undefined);
    try {
      const note = await createNote(category);
      const query = returnQuery
        ? `?return=${encodeURIComponent(returnQuery)}`
        : "";
      router.push(`/notes/${note.id}${query}`);
    } catch {
      setError("We couldn’t create your note. Please try again.");
      setIsPending(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <Button
        type="button"
        size="lg"
        onClick={handleCreate}
        disabled={isPending}
      >
        {isPending ? (
          <LoaderCircle aria-hidden="true" className="animate-spin" />
        ) : (
          <Plus aria-hidden="true" />
        )}
        {isPending ? "Opening…" : "New Note"}
      </Button>
      <p
        role={error ? "alert" : undefined}
        className="text-destructive max-w-64 text-right text-xs"
      >
        {error}
      </p>
    </div>
  );
}
