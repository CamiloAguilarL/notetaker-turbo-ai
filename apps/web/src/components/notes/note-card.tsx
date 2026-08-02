import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import type { Category, Note } from "@/lib/api/types";
import { categoryThemes } from "@/lib/category-theme";
import { formatNoteDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";

type NoteCardProps = {
  note: Note;
  category: Category;
  returnCategory?: string;
};

export function NoteCard({ note, category, returnCategory }: NoteCardProps) {
  const theme = categoryThemes[category.color_key];
  const href = returnCategory
    ? `/notes/${note.id}?from=${encodeURIComponent(returnCategory)}`
    : `/notes/${note.id}`;

  return (
    <article
      className={cn(
        "group relative min-h-72 border-2 transition-transform motion-safe:hover:-translate-y-1",
        theme.surface,
        theme.border,
      )}
    >
      <Link
        href={href}
        aria-label={`Open ${note.title || "untitled note"}`}
        className="focus-visible:ring-ring/70 flex h-full min-h-72 flex-col p-6 outline-none focus-visible:ring-4 focus-visible:ring-inset"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="font-mono text-[0.68rem] font-semibold tracking-[0.14em] uppercase">
              {category.name}
            </p>
            <time
              dateTime={note.updated_at}
              className="text-foreground block text-xs"
            >
              {formatNoteDate(note.updated_at)}
            </time>
          </div>
          <ArrowUpRight
            aria-hidden="true"
            className="size-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </div>

        <h2 className="mt-10 line-clamp-2 font-serif text-3xl leading-tight font-semibold tracking-[-0.02em]">
          {note.title || "Untitled note"}
        </h2>
        <p className="text-foreground mt-4 line-clamp-4 text-sm leading-6 whitespace-pre-line">
          {note.content || "No content yet. Open this note and start writing."}
        </p>
      </Link>
    </article>
  );
}
