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
  const allOrdering =
    searchQuery && ordering === "manual" ? "-updated_at" : ordering;

  return (
    <nav aria-label="Note categories">
      <ul className="app-scrollbar flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
        <li className="shrink-0">
          <Link
            href={buildNotesHref({
              search: searchQuery,
              ordering: allOrdering,
            })}
            scroll={false}
            aria-current={!activeCategory ? "page" : undefined}
            className={cn(
              "focus-visible:ring-ring/40 flex min-h-11 items-center gap-3 rounded-full border px-4 text-sm font-semibold transition-colors outline-none focus-visible:ring-3 lg:min-h-9 lg:w-full lg:rounded-md lg:border-transparent lg:px-1.5",
              !activeCategory
                ? "border-primary/55 bg-secondary/45 text-foreground lg:bg-transparent lg:font-bold lg:underline lg:decoration-1 lg:underline-offset-4"
                : "border-input/70 hover:border-primary/45 hover:bg-secondary/30 lg:font-bold",
            )}
          >
            <span>All Categories</span>
            <span className="text-muted-foreground ml-auto font-mono text-xs font-normal">
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
                  ordering:
                    ordering === "category" || ordering === "manual"
                      ? "-updated_at"
                      : ordering,
                })}
                scroll={false}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "focus-visible:ring-ring/40 flex min-h-11 items-center gap-3 rounded-full border px-4 text-sm font-medium transition-colors outline-none focus-visible:ring-3 lg:min-h-9 lg:w-full lg:rounded-md lg:border-transparent lg:px-1.5",
                  isActive
                    ? "border-primary/45 bg-secondary/35 font-semibold lg:bg-transparent lg:underline lg:decoration-1 lg:underline-offset-4"
                    : "border-input/70 hover:border-primary/45 hover:bg-secondary/30 lg:hover:bg-secondary/25",
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
