"use client";

import { Check, LoaderCircle, RotateCcw, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import type { Category, Note } from "@/lib/api/types";
import { updateNote, type NoteUpdate } from "@/lib/api/notes";
import { categoryThemes } from "@/lib/category-theme";
import { formatNoteTimestamp } from "@/lib/format-date";
import { cn } from "@/lib/utils";

type SaveStatus = "dirty" | "saving" | "saved" | "error";

type NoteEditorProps = {
  note: Note;
  categories: Category[];
  returnCategory?: string;
};

const SAVE_DELAY = 650;

function signature(draft: NoteUpdate): string {
  return JSON.stringify(draft);
}

export function NoteEditor({
  note,
  categories,
  returnCategory,
}: NoteEditorProps) {
  const router = useRouter();
  const initialDraft: NoteUpdate = {
    category: note.category,
    title: note.title,
    content: note.content,
  };
  const [draft, setDraft] = useState(initialDraft);
  const [status, setStatus] = useState<SaveStatus>("saved");
  const [lastEdited, setLastEdited] = useState(note.updated_at);
  const [isClosing, setIsClosing] = useState(false);
  const draftRef = useRef(initialDraft);
  const savedSignatureRef = useRef(signature(initialDraft));
  const saveQueueRef = useRef<Promise<void>>(Promise.resolve());
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const didMountRef = useRef(false);

  const queueSave = useCallback(
    (target: NoteUpdate): Promise<void> => {
      const targetSignature = signature(target);
      setStatus("saving");

      const operation = saveQueueRef.current
        .catch(() => undefined)
        .then(async () => {
          const saved = await updateNote(note.id, target);
          savedSignatureRef.current = targetSignature;
          setLastEdited(saved.updated_at);
          setStatus(
            signature(draftRef.current) === targetSignature ? "saved" : "dirty",
          );
        })
        .catch((error: unknown) => {
          if (signature(draftRef.current) === targetSignature) {
            setStatus("error");
          }
          throw error;
        });

      saveQueueRef.current = operation;
      return operation;
    },
    [note.id],
  );

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    setStatus("dirty");
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      void queueSave(draft).catch(() => undefined);
    }, SAVE_DELAY);

    return () => clearTimeout(timerRef.current);
  }, [draft, queueSave]);

  useEffect(() => {
    function protectUnsavedChanges(event: BeforeUnloadEvent) {
      if (status === "saved") return;
      event.preventDefault();
    }

    window.addEventListener("beforeunload", protectUnsavedChanges);
    return () =>
      window.removeEventListener("beforeunload", protectUnsavedChanges);
  }, [status]);

  function changeDraft(changes: NoteUpdate) {
    setDraft((current) => {
      const next = { ...current, ...changes };
      draftRef.current = next;
      return next;
    });
  }

  async function handleClose() {
    setIsClosing(true);
    clearTimeout(timerRef.current);

    try {
      await saveQueueRef.current.catch(() => undefined);
      const latest = draftRef.current;
      if (signature(latest) !== savedSignatureRef.current) {
        await queueSave(latest);
      }
      const destination = returnCategory
        ? `/notes?category=${encodeURIComponent(returnCategory)}`
        : "/notes";
      router.replace(destination);
      router.refresh();
    } catch {
      setIsClosing(false);
    }
  }

  const selectedCategory =
    categories.find((category) => category.slug === draft.category) ??
    categories[0];
  const theme = categoryThemes[selectedCategory?.color_key ?? "random"];

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-8 sm:py-8 lg:px-10">
      <div
        className={cn(
          "min-h-[calc(100dvh-8rem)] border-2 p-5 transition-colors sm:p-8 lg:p-12",
          theme.surface,
          theme.border,
        )}
      >
        <h1 className="sr-only">Edit note</h1>
        <div className="border-foreground/25 flex flex-wrap items-center justify-between gap-4 border-b pb-5">
          <label className="flex items-center gap-3 text-sm font-semibold">
            <span
              aria-hidden="true"
              className={cn("size-2.5 rounded-full", theme.dot)}
            />
            <span className="sr-only">Category</span>
            <select
              value={draft.category}
              onChange={(event) =>
                changeDraft({ category: event.currentTarget.value })
              }
              className="border-foreground/40 bg-card/70 focus-visible:ring-ring/60 min-h-11 rounded-full border px-4 outline-none focus-visible:ring-3"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <Button
            type="button"
            variant="outline"
            className="bg-card text-foreground hover:bg-card/80 hover:text-foreground"
            onClick={handleClose}
            disabled={isClosing}
          >
            {isClosing ? (
              <LoaderCircle aria-hidden="true" className="animate-spin" />
            ) : (
              <X aria-hidden="true" />
            )}
            {isClosing ? "Closing…" : "Close"}
          </Button>
        </div>

        <div className="mx-auto max-w-3xl py-10 sm:py-14">
          <label htmlFor="note-title" className="sr-only">
            Note title
          </label>
          <input
            id="note-title"
            value={draft.title}
            onChange={(event) =>
              changeDraft({ title: event.currentTarget.value })
            }
            maxLength={120}
            placeholder="Note title"
            className="placeholder:text-foreground/35 focus-visible:ring-ring/60 w-full rounded-sm border-0 bg-transparent font-serif text-4xl leading-tight font-semibold tracking-[-0.03em] outline-none focus-visible:ring-2 sm:text-6xl"
          />

          <label htmlFor="note-content" className="sr-only">
            Note content
          </label>
          <textarea
            id="note-content"
            value={draft.content}
            onChange={(event) =>
              changeDraft({ content: event.currentTarget.value })
            }
            maxLength={10_000}
            placeholder="Start writing…"
            className="placeholder:text-foreground/35 focus-visible:ring-ring/60 mt-8 min-h-[45dvh] w-full resize-none rounded-sm border-0 bg-transparent text-base leading-8 outline-none focus-visible:ring-2 sm:text-lg"
          />

          <footer className="border-foreground/25 mt-8 flex flex-wrap items-center justify-between gap-3 border-t pt-5 text-sm">
            <p className="text-foreground">
              Last edited{" "}
              <time dateTime={lastEdited}>
                {formatNoteTimestamp(lastEdited)}
              </time>
            </p>
            <div
              aria-live="polite"
              aria-atomic="true"
              className="flex min-h-10 items-center gap-2 font-semibold"
            >
              {status === "saving" ? (
                <LoaderCircle
                  aria-hidden="true"
                  className="size-4 animate-spin"
                />
              ) : null}
              {status === "saved" ? (
                <Check aria-hidden="true" className="size-4" />
              ) : null}
              <span>
                {status === "dirty" ? "Unsaved changes" : null}
                {status === "saving" ? "Saving…" : null}
                {status === "saved" ? "Saved" : null}
                {status === "error" ? "Couldn’t save" : null}
              </span>
              {status === "error" ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    void queueSave(draftRef.current).catch(() => undefined)
                  }
                >
                  <RotateCcw aria-hidden="true" />
                  Retry
                </Button>
              ) : null}
            </div>
          </footer>
        </div>
      </div>
    </main>
  );
}
