import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { CategorySelect } from "@/components/notes/category-select";
import { NoteOrderingSelect } from "@/components/notes/note-ordering-select";
import {
  selectContentVariants,
  selectItemVariants,
} from "@/components/ui/select";
import type { Category } from "@/lib/api/types";

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
    note_count: 0,
  },
];

const orderingOptions = [
  { value: "-updated_at" as const, label: "Recently edited" },
  { value: "updated_at" as const, label: "Oldest edited" },
];

describe("NotebookSelect", () => {
  it("keeps category and ordering controls on the same visual contract", () => {
    const onCategoryChange = vi.fn();
    const onOrderingChange = vi.fn();

    render(
      <>
        <CategorySelect
          categories={categories}
          value="random-thoughts"
          onValueChange={onCategoryChange}
        />
        <NoteOrderingSelect
          options={orderingOptions}
          value="-updated_at"
          onValueChange={onOrderingChange}
        />
      </>,
    );

    const categoryTrigger = screen.getByRole("combobox", {
      name: "Category",
    });
    const orderingTrigger = screen.getByRole("combobox", {
      name: "Sort notes",
    });

    expect(categoryTrigger).toHaveAttribute("data-variant", "notebook");
    expect(orderingTrigger).toHaveAttribute("data-variant", "notebook");
    expect(categoryTrigger.className).toBe(orderingTrigger.className);
    expect(categoryTrigger.className).toContain(
      "data-[size=default]:h-dashboard-control",
    );
    expect(categoryTrigger.className).toContain("border-control-border");
    expect(categoryTrigger.className).toContain("bg-control-surface");
    expect(selectContentVariants({ variant: "notebook" })).toContain(
      "bg-control-surface",
    );
    expect(selectItemVariants({ variant: "notebook" })).toContain(
      "data-selected:bg-accent",
    );
  });
});
