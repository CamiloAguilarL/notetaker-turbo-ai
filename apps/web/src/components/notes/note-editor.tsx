"use client";

import { Check, LoaderCircle, RotateCcw, Trash2, X } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Category, Note } from "@/lib/api/types";
import { deleteNote, updateNote, type NoteUpdate } from "@/lib/api/notes";
import { categoryThemes } from "@/lib/category-theme";
import { formatNoteTimestamp } from "@/lib/format-date";
import { cn } from "@/lib/utils";

type SaveStatus = "dirty" | "saving" | "saved" | "error";

type NoteEditorProps = {
  note: Note;
  categories: Category[];
  returnTo?: string;
};

const SAVE_DELAY = 650;

function signature(draft: NoteUpdate): string {
  return JSON.stringify(draft);
}

export function NoteEditor({
  note,
  categories,
  returnTo = "/notes",
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
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string>();
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

    if (signature(draft) === savedSignatureRef.current) {
      setStatus("saved");
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

  const flushLatest = useCallback(async () => {
    clearTimeout(timerRef.current);
    await saveQueueRef.current.catch(() => undefined);
    const latest = draftRef.current;
    if (signature(latest) !== savedSignatureRef.current) {
      await queueSave(latest);
    }
  }, [queueSave]);

  async function handleClose() {
    setIsClosing(true);

    try {
      await flushLatest();
      router.replace(returnTo);
      router.refresh();
    } catch {
      setIsClosing(false);
    }
  }

  async function handleDelete() {
    setIsDeleting(true);
    setDeleteError(undefined);

    try {
      await flushLatest();
      await deleteNote(note.id);
      const query = new URLSearchParams(returnTo.split("?")[1] ?? "");
      query.set("undo", note.id);
      router.replace(`/notes?${query.toString()}`);
      router.refresh();
    } catch {
      setDeleteError("We couldn’t delete the note. Please try again.");
      setIsDeleting(false);
    }
  }

  const selectedCategory =
    categories.find((category) => category.slug === draft.category) ??
    categories[0];
  const theme = categoryThemes[selectedCategory?.color_key ?? "random"];

  return (
    <main className="mx-auto w-full max-w-[82rem] px-4 pt-1 pb-5 sm:px-8 lg:px-10">
      <h1 className="sr-only">Edit note</h1>
      <div className="flex min-h-14 items-center justify-between gap-4 pb-3">
        <label className="flex items-center gap-2 text-sm font-medium">
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
            className="border-primary/35 focus-visible:ring-ring/40 min-h-10 rounded-full border bg-transparent px-4 outline-none focus-visible:ring-3"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-center gap-1">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                disabled={isClosing || isDeleting}
              >
                <Trash2 aria-hidden="true" />
                {isDeleting ? "Deleting…" : "Delete"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this note?</AlertDialogTitle>
                <AlertDialogDescription>
                  It will disappear from your notebook. You’ll have a few
                  seconds to undo this action without losing any writing.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep note</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={() => void handleDelete()}
                >
                  Delete note
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button
            type="button"
            variant="ghost"
            size="icon-lg"
            aria-label={isClosing ? "Closing…" : "Close"}
            onClick={handleClose}
            disabled={isClosing || isDeleting}
          >
            {isClosing ? (
              <LoaderCircle aria-hidden="true" className="animate-spin" />
            ) : (
              <X aria-hidden="true" />
            )}
          </Button>
        </div>
      </div>

      {deleteError ? (
        <p role="alert" className="text-destructive mb-3 text-sm font-semibold">
          {deleteError}
        </p>
      ) : null}

      <motion.div
        initial={{ y: 6 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.28 }}
        className={cn(
          "min-h-[calc(100dvh-9rem)] rounded-2xl border-[3px] p-6 transition-colors sm:p-10 lg:p-12",
          theme.surface,
          theme.border,
        )}
      >
        <div className="mx-auto max-w-5xl">
          <div className="text-foreground/85 flex min-h-10 flex-wrap items-center justify-end gap-x-4 gap-y-1 text-xs">
            <p>
              Last Edited:{" "}
              <time dateTime={lastEdited}>
                {formatNoteTimestamp(lastEdited)}
              </time>
            </p>
            <div
              aria-live="polite"
              aria-atomic="true"
              className="flex min-h-8 items-center gap-1.5 font-medium"
            >
              {status === "saving" ? (
                <LoaderCircle
                  aria-hidden="true"
                  className="size-3.5 animate-spin"
                />
              ) : null}
              {status === "saved" ? (
                <Check aria-hidden="true" className="size-3.5" />
              ) : null}
              <motion.span
                key={status}
                initial={{ y: 2 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.16 }}
              >
                {status === "dirty" ? "Unsaved changes" : null}
                {status === "saving" ? "Saving…" : null}
                {status === "saved" ? "Saved" : null}
                {status === "error" ? "Couldn’t save" : null}
              </motion.span>
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
          </div>

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
            className="placeholder:text-foreground/35 focus-visible:ring-ring/50 mt-4 w-full rounded-sm border-0 bg-transparent font-serif text-3xl leading-tight font-semibold tracking-[-0.025em] outline-none focus-visible:ring-2 sm:mt-6 sm:text-4xl"
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
            className="placeholder:text-foreground/35 focus-visible:ring-ring/50 mt-5 min-h-[calc(100dvh-24rem)] w-full resize-none rounded-sm border-0 bg-transparent text-base leading-7 outline-none focus-visible:ring-2 sm:mt-7 sm:min-h-[calc(100dvh-25rem)]"
          />
        </div>
      </motion.div>
    </main>
  );
}
