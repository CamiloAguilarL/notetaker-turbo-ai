import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { InfiniteNotesGrid } from "@/components/notes/infinite-notes-grid";
import { getNotesPage } from "@/lib/api/notes";
import type { Category, Note } from "@/lib/api/types";

vi.mock("@/lib/api/notes", () => ({
  getNotesPage: vi.fn(),
}));

const mockedGetNotesPage = vi.mocked(getNotesPage);

const category: Category = {
  id: 2,
  name: "School",
  slug: "school",
  color_key: "school",
  note_count: 2,
};

function note(id: string, title: string): Note {
  return {
    id,
    category: "school",
    title,
    content: `${title} content`,
    manual_order: 0,
    created_at: "2026-08-02T12:00:00Z",
    updated_at: "2026-08-03T12:00:00Z",
  };
}

const firstNote = note("8ff50ae7-a153-49cd-ab60-2c865f3d82a1", "First note");
const secondNote = note("2e1effcd-5c05-47a1-b0e1-9669be8b2175", "Second note");

function renderGrid() {
  return render(
    <InfiniteNotesGrid
      label="School notes"
      initialNotes={[{ note: firstNote, category, displayDate: "Yesterday" }]}
      categories={[category]}
      nextPage={2}
      totalCount={2}
      dateReference="2026-08-04T12:00:00Z"
      category="school"
      search="architecture"
      ordering="updated_at"
      returnQuery="category=school&q=architecture&ordering=updated_at"
    />,
  );
}

describe("InfiniteNotesGrid", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("loads the next page from the accessible fallback action", async () => {
    const user = userEvent.setup();
    mockedGetNotesPage.mockResolvedValue({
      count: 2,
      next_page: null,
      previous_page: 1,
      results: [secondNote],
    });
    renderGrid();

    await user.click(screen.getByRole("button", { name: "Load more notes" }));

    expect(mockedGetNotesPage).toHaveBeenCalledWith({
      category: "school",
      search: "architecture",
      ordering: "updated_at",
      page: 2,
    });
    expect(await screen.findByText("Second note")).toBeVisible();
    expect(screen.getByText("All 2 notes loaded.")).toBeVisible();
  });

  it("keeps a retry action when the next page fails", async () => {
    const user = userEvent.setup();
    mockedGetNotesPage
      .mockRejectedValueOnce(new TypeError("Failed to fetch"))
      .mockResolvedValueOnce({
        count: 2,
        next_page: null,
        previous_page: 1,
        results: [secondNote],
      });
    renderGrid();

    await user.click(screen.getByRole("button", { name: "Load more notes" }));
    expect(
      await screen.findByText("More notes couldn’t be loaded."),
    ).toHaveAttribute("role", "alert");
    await user.click(screen.getByRole("button", { name: "Try again" }));

    expect(await screen.findByText("Second note")).toBeVisible();
    expect(mockedGetNotesPage).toHaveBeenCalledTimes(2);
  });

  it("loads automatically when the sentinel approaches the viewport", async () => {
    class IntersectionObserverMock {
      constructor(callback: IntersectionObserverCallback) {
        this.callback = callback;
      }

      private readonly callback: IntersectionObserverCallback;

      observe(target: Element) {
        this.callback(
          [{ isIntersecting: true, target } as IntersectionObserverEntry],
          this as unknown as IntersectionObserver,
        );
      }

      disconnect() {}
    }

    vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);
    mockedGetNotesPage.mockResolvedValue({
      count: 2,
      next_page: null,
      previous_page: 1,
      results: [secondNote],
    });
    renderGrid();

    expect(await screen.findByText("Second note")).toBeVisible();
    expect(mockedGetNotesPage).toHaveBeenCalledTimes(1);
  });
});
