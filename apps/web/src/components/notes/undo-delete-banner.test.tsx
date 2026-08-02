import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { UndoDeleteBanner } from "@/components/notes/undo-delete-banner";
import { restoreNote } from "@/lib/api/notes";

const replace = vi.fn();
const refresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace, refresh }),
}));

vi.mock("@/lib/api/notes", () => ({
  restoreNote: vi.fn(),
}));

const mockedRestoreNote = vi.mocked(restoreNote);
const noteId = "8ff50ae7-a153-49cd-ab60-2c865f3d82a1";

describe("UndoDeleteBanner", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("restores the note and refreshes its previous category", async () => {
    const user = userEvent.setup();
    mockedRestoreNote.mockResolvedValue({
      id: noteId,
      category: "school",
      title: "Restored",
      content: "Body",
      manual_order: 0,
      created_at: "2026-08-02T12:00:00Z",
      updated_at: "2026-08-02T12:05:00Z",
    });
    render(
      <UndoDeleteBanner noteId={noteId} destination="/notes?category=school" />,
    );

    await user.click(screen.getByRole("button", { name: "Undo" }));

    expect(mockedRestoreNote).toHaveBeenCalledWith(noteId);
    await waitFor(() =>
      expect(replace).toHaveBeenCalledWith("/notes?category=school"),
    );
    expect(refresh).toHaveBeenCalledOnce();
  });

  it("keeps undo available after a recoverable failure", async () => {
    const user = userEvent.setup();
    mockedRestoreNote.mockRejectedValue(new TypeError("Failed to fetch"));
    render(<UndoDeleteBanner noteId={noteId} destination="/notes" />);

    await user.click(screen.getByRole("button", { name: "Undo" }));

    expect(
      await screen.findByText(
        "We couldn’t restore the note. Please try again.",
      ),
    ).toHaveAttribute("role", "alert");
    expect(screen.getByRole("button", { name: "Undo" })).toBeEnabled();
  });

  it("dismisses the temporary action without restoring", async () => {
    vi.useFakeTimers();
    render(<UndoDeleteBanner noteId={noteId} destination="/notes" />);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(8_000);
    });

    expect(screen.queryByText("Note deleted")).not.toBeInTheDocument();
    expect(mockedRestoreNote).not.toHaveBeenCalled();
    expect(replace).toHaveBeenCalledWith("/notes");
  });
});
