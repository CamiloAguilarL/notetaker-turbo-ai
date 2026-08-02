import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NoteNotFound() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="grid min-h-[70dvh] place-items-center px-6 py-16 text-center"
    >
      <div className="max-w-md">
        <p className="text-muted-foreground font-mono text-xs font-semibold tracking-[0.18em] uppercase">
          Missing page
        </p>
        <h1 className="mt-4 font-serif text-4xl font-semibold text-balance">
          This note isn’t here.
        </h1>
        <p className="text-muted-foreground mt-4 leading-7">
          It may belong to another notebook or no longer exist.
        </p>
        <Button asChild className="mt-8">
          <Link href="/notes">Return to all notes</Link>
        </Button>
      </div>
    </main>
  );
}
