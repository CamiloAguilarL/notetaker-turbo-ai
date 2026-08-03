import Link from "next/link";
import type { ReactNode } from "react";

import type { Category, Note } from "@/lib/api/types";
import { categoryThemes } from "@/lib/category-theme";
import { cn } from "@/lib/utils";

type NoteCardProps = {
  note: Note;
  category: Category;
  displayDate: string;
  returnQuery?: string;
  action?: ReactNode;
};

export function NoteCard({
  note,
  category,
  displayDate,
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
        "group border-note h-note-card relative min-w-0 overflow-hidden rounded-2xl transition-transform motion-safe:hover:-translate-y-0.5",
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
        className="focus-visible:ring-ring/60 rounded-note-inner compact:p-5 flex h-full min-w-0 flex-col p-4 outline-none focus-visible:ring-4 focus-visible:ring-inset xl:p-6"
      >
        <p
          className={cn(
            "text-foreground/75 flex flex-wrap items-center gap-x-2 text-xs",
            action && "pr-24",
          )}
        >
          <time dateTime={note.updated_at} className="font-bold">
            {displayDate}
          </time>
          <span aria-hidden="true">·</span>
          <span className="min-w-0 wrap-anywhere">{category.name}</span>
        </p>

        <h2 className="tracking-note-heading xl:text-note-title mt-4 line-clamp-2 min-w-0 font-serif text-2xl leading-tight font-semibold wrap-anywhere">
          {note.title || "Untitled note"}
        </h2>
        <p className="text-foreground/85 compact:line-clamp-4 compact:leading-6 mt-3 line-clamp-3 min-w-0 text-sm leading-5 wrap-anywhere whitespace-pre-line xl:line-clamp-6">
          {note.content || "No content yet. Open this note and start writing."}
        </p>
      </Link>
    </article>
  );
}
