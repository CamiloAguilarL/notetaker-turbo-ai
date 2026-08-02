import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { NewNoteButton } from "@/components/notes/new-note-button";
import { createNote } from "@/lib/api/notes";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

vi.mock("@/lib/api/notes", () => ({
  createNote: vi.fn(),
}));

const mockedCreateNote = vi.mocked(createNote);

describe("NewNoteButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates in the active category and opens the editor", async () => {
    const user = userEvent.setup();
    mockedCreateNote.mockResolvedValue({
      id: "8ff50ae7-a153-49cd-ab60-2c865f3d82a1",
      category: "school",
      title: "",
      content: "",
      created_at: "2026-08-02T12:00:00Z",
      updated_at: "2026-08-02T12:00:00Z",
    });

    render(<NewNoteButton category="school" />);
    await user.click(screen.getByRole("button", { name: "New Note" }));

    expect(mockedCreateNote).toHaveBeenCalledWith("school");
    await waitFor(() =>
      expect(push).toHaveBeenCalledWith(
        "/notes/8ff50ae7-a153-49cd-ab60-2c865f3d82a1?from=school",
      ),
    );
  });

  it("keeps a recoverable action when creation fails", async () => {
    const user = userEvent.setup();
    mockedCreateNote.mockRejectedValue(new TypeError("Failed to fetch"));

    render(<NewNoteButton />);
    await user.click(screen.getByRole("button", { name: "New Note" }));

    expect(
      await screen.findByText(
        "We couldn’t create your note. Please try again.",
      ),
    ).toHaveAttribute("role", "alert");
    expect(screen.getByRole("button", { name: "New Note" })).toBeEnabled();
  });
});
