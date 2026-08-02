import { Layers3 } from "lucide-react";
import Link from "next/link";

import type { Category } from "@/lib/api/types";
import { categoryThemes } from "@/lib/category-theme";
import { buildNotesHref, type NoteOrdering } from "@/lib/notes-query";
import { cn } from "@/lib/utils";

type CategoryNavProps = {
  categories: Category[];
  activeCategory?: string;
  searchQuery?: string;
  ordering?: NoteOrdering;
};

export function CategoryNav({
  categories,
  activeCategory,
  searchQuery,
  ordering,
}: CategoryNavProps) {
  const allCount = categories.reduce(
    (total, category) => total + category.note_count,
    0,
  );

  return (
    <nav aria-label="Note categories">
      <ul className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
        <li className="shrink-0">
          <Link
            href={buildNotesHref({ search: searchQuery, ordering })}
            aria-current={!activeCategory ? "page" : undefined}
            className={cn(
              "focus-visible:ring-ring/50 flex min-h-11 items-center gap-3 rounded-full border px-4 text-sm font-semibold transition-colors outline-none focus-visible:ring-3 lg:w-full lg:rounded-lg",
              !activeCategory
                ? "border-foreground bg-foreground text-background"
                : "hover:border-border hover:bg-card border-transparent",
            )}
          >
            <Layers3 aria-hidden="true" className="size-4" />
            <span>All Categories</span>
            <span className="ml-auto font-mono text-xs opacity-70">
              {allCount}
            </span>
          </Link>
        </li>
        {categories.map((category) => {
          const isActive = category.slug === activeCategory;
          const theme = categoryThemes[category.color_key];

          return (
            <li key={category.id} className="shrink-0">
              <Link
                href={buildNotesHref({
                  category: category.slug,
                  search: searchQuery,
                  ordering: ordering === "category" ? "-updated_at" : ordering,
                })}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "focus-visible:ring-ring/50 flex min-h-11 items-center gap-3 rounded-full border px-4 text-sm font-semibold transition-colors outline-none focus-visible:ring-3 lg:w-full lg:rounded-lg",
                  isActive
                    ? "border-foreground bg-card"
                    : "hover:border-border hover:bg-card border-transparent",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn("size-2.5 rounded-full", theme.dot)}
                />
                <span>{category.name}</span>
                <span className="text-muted-foreground ml-auto font-mono text-xs">
                  {category.note_count}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
