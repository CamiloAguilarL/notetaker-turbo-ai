"use client";

import { RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotesError({ reset }: { reset: () => void }) {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="grid min-h-[70dvh] place-items-center px-6 py-16 text-center"
    >
      <div className="max-w-md">
        <p className="text-destructive tracking-eyebrow font-mono text-xs font-semibold uppercase">
          Notebook unavailable
        </p>
        <h1 className="mt-4 font-serif text-4xl font-semibold text-balance">
          We couldn’t load your notes.
        </h1>
        <p className="text-muted-foreground mt-4 leading-7">
          Your writing is still safe. Check the local API and try again.
        </p>
        <Button type="button" className="mt-8" onClick={reset}>
          <RefreshCw aria-hidden="true" />
          Try again
        </Button>
      </div>
    </main>
  );
}
