import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CategoryNav } from "@/components/notes/category-nav";
import type { Category } from "@/lib/api/types";

const categories: Category[] = [
  {
    id: 1,
    name: "Random Thoughts",
    slug: "random-thoughts",
    color_key: "random",
    note_count: 2,
  },
  {
    id: 2,
    name: "School",
    slug: "school",
    color_key: "school",
    note_count: 3,
  },
];

describe("CategoryNav", () => {
  it("shows scoped counts and exposes the active filter", () => {
    render(<CategoryNav categories={categories} activeCategory="school" />);

    const all = screen.getByRole("link", { name: /All Categories\s*5/ });
    const school = screen.getByRole("link", { name: /School\s*3/ });

    expect(all).toHaveAttribute("href", "/notes");
    expect(all).not.toHaveAttribute("aria-current");
    expect(school).toHaveAttribute("aria-current", "page");
    expect(school).toHaveAttribute("href", "/notes?category=school");
    expect(within(school).getByText("3")).toBeVisible();
  });
});
