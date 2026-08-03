import Link from "next/link";
import type { ReactNode } from "react";

import type { Category, Note } from "@/lib/api/types";
import { categoryThemes } from "@/lib/category-theme";
import { formatNoteDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";

type NoteCardProps = {
  note: Note;
  category: Category;
  returnQuery?: string;
  action?: ReactNode;
};

export function NoteCard({
  note,
  category,
  returnQuery,
  action,
}: NoteCardProps) {
  const theme = categoryThemes[category.color_key];
  const href = returnQuery
    ? `/notes/${note.id}?return=${encodeURIComponent(returnQuery)}`
    : `/notes/${note.id}`;

  return (
    <article
      className={cn(
        "group border-note relative h-full min-h-72 overflow-hidden rounded-2xl transition-transform motion-safe:hover:-translate-y-0.5",
        theme.surface,
        theme.border,
      )}
    >
      {action ? (
        <div className="absolute top-3 right-3 z-10">{action}</div>
      ) : null}
      <Link
        href={href}
        aria-label={`Open ${note.title || "untitled note"}`}
        className="focus-visible:ring-ring/60 rounded-note-inner flex h-full min-h-72 flex-col p-5 outline-none focus-visible:ring-4 focus-visible:ring-inset sm:p-6"
      >
        <p
          className={cn(
            "text-foreground/75 flex flex-wrap items-center gap-x-2 text-xs",
            action && "pr-24",
          )}
        >
          <time dateTime={note.updated_at} className="font-bold">
            {formatNoteDate(note.updated_at)}
          </time>
          <span aria-hidden="true">·</span>
          <span>{category.name}</span>
        </p>

        <h2 className="tracking-note-heading sm:text-note-title mt-4 line-clamp-2 font-serif text-2xl leading-tight font-semibold">
          {note.title || "Untitled note"}
        </h2>
        <p className="text-foreground/85 mt-3 line-clamp-6 text-sm leading-6 whitespace-pre-line">
          {note.content || "No content yet. Open this note and start writing."}
        </p>
      </Link>
    </article>
  );
}
