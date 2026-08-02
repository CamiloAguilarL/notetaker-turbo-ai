"use client";

import { RotateCcw, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { restoreNote } from "@/lib/api/notes";

const UNDO_WINDOW = 8_000;

type UndoDeleteBannerProps = {
  noteId: string;
  destination: string;
};

export function UndoDeleteBanner({
  noteId,
  destination,
}: UndoDeleteBannerProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string>();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (isPending) return;
    const timer = window.setTimeout(() => {
      setIsVisible(false);
      router.replace(destination);
    }, UNDO_WINDOW);
    return () => window.clearTimeout(timer);
  }, [destination, isPending, router]);

  async function handleRestore() {
    setIsPending(true);
    setError(undefined);
    try {
      await restoreNote(noteId);
      router.replace(destination);
      router.refresh();
    } catch {
      setError("We couldn’t restore the note. Please try again.");
      setIsPending(false);
    }
  }

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Deleted note actions"
      className="border-foreground bg-card fixed right-4 bottom-4 left-4 z-40 mx-auto flex max-w-xl flex-wrap items-center gap-3 rounded-xl border-2 p-3 shadow-[4px_5px_0_var(--foreground)] sm:left-auto sm:p-4"
    >
      <div className="min-w-0 flex-1">
        <p className="font-semibold">Note deleted</p>
        <p className="text-muted-foreground text-xs">
          Undo is available for a few seconds.
        </p>
        {error ? (
          <p role="alert" className="text-destructive mt-1 text-xs">
            {error}
          </p>
        ) : null}
      </div>
      <Button
        type="button"
        variant="secondary"
        onClick={handleRestore}
        disabled={isPending}
      >
        <RotateCcw aria-hidden="true" />
        {isPending ? "Restoring…" : "Undo"}
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Dismiss undo"
        onClick={() => {
          setIsVisible(false);
          router.replace(destination);
        }}
      >
        <X aria-hidden="true" />
      </Button>
    </aside>
  );
}
