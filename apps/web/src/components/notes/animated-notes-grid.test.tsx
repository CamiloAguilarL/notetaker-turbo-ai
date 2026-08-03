import { render, screen } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { describe, expect, it, vi } from "vitest";

import { AnimatedNotesGrid } from "@/components/notes/animated-notes-grid";
import type { Category, Note } from "@/lib/api/types";

vi.mock("motion/react", () => ({
  motion: {
    div: ({
      children,
      className,
    }: PropsWithChildren<{ className?: string }>) => (
      <div className={className}>{children}</div>
    ),
  },
}));

const categories: Category[] = [
  {
    id: 1,
    name: "Random Thoughts",
    slug: "random-thoughts",
    color_key: "random",
    note_count: 1,
  },
  {
    id: 2,
    name: "School",
    slug: "school",
    color_key: "school",
    note_count: 1,
  },
];

const notes: Note[] = [
  {
    id: "first",
    category: "random-thoughts",
    title: "First note",
    content: "First body",
    manual_order: 0,
    created_at: "2026-08-02T12:00:00Z",
    updated_at: "2026-08-02T12:00:00Z",
  },
  {
    id: "second",
    category: "school",
    title: "Second note",
    content: "Second body",
    manual_order: 1,
    created_at: "2026-08-02T12:01:00Z",
    updated_at: "2026-08-02T12:01:00Z",
  },
];

describe("AnimatedNotesGrid", () => {
  it("keeps every animated card discoverable and preserves query state", () => {
    render(
      <AnimatedNotesGrid
        label="All notes"
        notes={notes.map((note, index) => ({
          note,
          category: categories[index],
          displayDate: index === 0 ? "Yesterday" : "Today",
        }))}
        returnQuery="ordering=category"
      />,
    );

    expect(screen.getByRole("region", { name: "All notes" })).toBeVisible();
    expect(
      screen.getByRole("link", { name: "Open First note" }),
    ).toHaveAttribute("href", "/notes/first?return=ordering%3Dcategory");
    expect(
      screen.getByRole("link", { name: "Open Second note" }),
    ).toBeVisible();
  });
});
