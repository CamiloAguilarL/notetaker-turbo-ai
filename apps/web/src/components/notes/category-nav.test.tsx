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
    render(
      <CategoryNav
        categories={categories}
        activeCategory="school"
        searchQuery="systems"
        ordering="updated_at"
      />,
    );

    const all = screen.getByRole("link", { name: /All Categories\s*5/ });
    const school = screen.getByRole("link", { name: /School\s*3/ });
    const categoryList = screen.getByRole("list");

    expect(categoryList.className).toContain("app-scrollbar");
    expect(all).toHaveAttribute("href", "/notes?q=systems&ordering=updated_at");
    expect(all).not.toHaveAttribute("aria-current");
    expect(school).toHaveAttribute("aria-current", "page");
    expect(school).toHaveAttribute(
      "href",
      "/notes?category=school&q=systems&ordering=updated_at",
    );
    expect(within(school).getByText("3")).toBeVisible();
  });

  it("keeps manual order only in the complete collection", () => {
    render(<CategoryNav categories={categories} ordering="manual" />);

    expect(
      screen.getByRole("link", { name: /All Categories\s*5/ }),
    ).toHaveAttribute("href", "/notes?ordering=manual");
    expect(screen.getByRole("link", { name: /School\s*3/ })).toHaveAttribute(
      "href",
      "/notes?category=school",
    );
  });
});
