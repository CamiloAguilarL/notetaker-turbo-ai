import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { NotesToolbar } from "@/components/notes/notes-toolbar";

const replace = vi.fn();
let currentParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
  useSearchParams: () => currentParams,
}));

describe("NotesToolbar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    currentParams = new URLSearchParams();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("debounces search into canonical URL state", async () => {
    vi.useFakeTimers();
    render(
      <NotesToolbar initialSearch="" ordering="-updated_at" resultCount={4} />,
    );

    fireEvent.change(screen.getByLabelText("Search notes"), {
      target: { value: "  architecture  " },
    });
    expect(replace).not.toHaveBeenCalled();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(350);
    });

    expect(replace).toHaveBeenCalledWith("/notes?q=architecture");
  });

  it("clears search immediately", async () => {
    const user = userEvent.setup();
    currentParams = new URLSearchParams("q=systems");
    render(
      <NotesToolbar
        initialSearch="systems"
        ordering="-updated_at"
        resultCount={1}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Clear search" }));

    expect(screen.getByLabelText("Search notes")).toHaveValue("");
    expect(replace).toHaveBeenCalledWith("/notes");
  });

  it("removes redundant category sorting inside a category", async () => {
    const user = userEvent.setup();
    currentParams = new URLSearchParams("category=school");
    render(
      <NotesToolbar
        initialSearch=""
        ordering="-updated_at"
        activeCategory="school"
        resultCount={2}
      />,
    );

    await user.click(screen.getByRole("combobox", { name: "Sort notes" }));
    expect(screen.queryByRole("option", { name: "Category" })).toBeNull();
    await user.click(screen.getByRole("option", { name: "Oldest edited" }));

    expect(replace).toHaveBeenCalledWith(
      "/notes?category=school&ordering=updated_at",
    );
  });

  it("leaves manual order when a search starts", async () => {
    const user = userEvent.setup();
    currentParams = new URLSearchParams("ordering=manual");
    render(<NotesToolbar initialSearch="" ordering="manual" resultCount={2} />);

    fireEvent.change(screen.getByLabelText("Search notes"), {
      target: { value: "browser" },
    });
    await user.click(screen.getByRole("combobox", { name: "Sort notes" }));
    expect(screen.queryByRole("option", { name: "Manual order" })).toBeNull();

    await waitFor(() =>
      expect(replace).toHaveBeenCalledWith("/notes?q=browser"),
    );
  });
});
