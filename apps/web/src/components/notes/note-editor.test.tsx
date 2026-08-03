import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { PropsWithChildren } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { NoteEditor } from "@/components/notes/note-editor";
import type { Category, Note } from "@/lib/api/types";
import { deleteNote, updateNote } from "@/lib/api/notes";

const replace = vi.fn();
const refresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace, refresh }),
}));

vi.mock("motion/react", () => ({
  motion: {
    div: ({
      children,
      className,
    }: PropsWithChildren<{ className?: string }>) => (
      <div className={className}>{children}</div>
    ),
    span: ({ children }: PropsWithChildren) => <span>{children}</span>,
  },
}));

vi.mock("@/lib/api/notes", () => ({
  deleteNote: vi.fn(),
  updateNote: vi.fn(),
}));

const mockedDeleteNote = vi.mocked(deleteNote);
const mockedUpdateNote = vi.mocked(updateNote);

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

const note: Note = {
  id: "8ff50ae7-a153-49cd-ab60-2c865f3d82a1",
  category: "random-thoughts",
  title: "Before",
  content: "Original body",
  manual_order: 0,
  created_at: "2026-08-02T12:00:00Z",
  updated_at: "2026-08-02T12:00:00Z",
};

function savedNote(changes: Partial<Note> = {}): Note {
  return {
    ...note,
    updated_at: "2026-08-02T12:05:00Z",
    ...changes,
  };
}

describe("NoteEditor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("keeps an unchanged note in the saved state", async () => {
    vi.useFakeTimers();
    render(<NoteEditor note={note} categories={categories} />);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(650);
    });

    expect(screen.getByText("Saved")).toBeVisible();
    expect(screen.queryByText("Unsaved changes")).not.toBeInTheDocument();
    expect(mockedUpdateNote).not.toHaveBeenCalled();
  });

  it("autosaves the latest draft after a short pause", async () => {
    vi.useFakeTimers();
    mockedUpdateNote.mockResolvedValue(savedNote({ title: "After" }));
    render(<NoteEditor note={note} categories={categories} />);

    fireEvent.change(screen.getByLabelText("Note title"), {
      target: { value: "After" },
    });
    expect(screen.getByText("Unsaved changes")).toBeVisible();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(650);
    });

    expect(mockedUpdateNote).toHaveBeenCalledOnce();
    expect(mockedUpdateNote).toHaveBeenCalledWith(note.id, {
      category: "random-thoughts",
      title: "After",
      content: "Original body",
    });
    expect(screen.getByText("Saved")).toBeVisible();
  });

  it("flushes pending content and returns to the active filter", async () => {
    mockedUpdateNote.mockResolvedValue(savedNote({ content: "Latest body" }));
    render(
      <NoteEditor
        note={note}
        categories={categories}
        returnTo="/notes?category=random-thoughts"
      />,
    );

    fireEvent.change(screen.getByLabelText("Note content"), {
      target: { value: "Latest body" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Close" }));

    await waitFor(() =>
      expect(mockedUpdateNote).toHaveBeenCalledWith(note.id, {
        category: "random-thoughts",
        title: "Before",
        content: "Latest body",
      }),
    );
    await waitFor(() =>
      expect(replace).toHaveBeenCalledWith("/notes?category=random-thoughts"),
    );
    expect(refresh).toHaveBeenCalledOnce();
  });

  it("keeps the draft available and retries a failed close", async () => {
    const user = userEvent.setup();
    mockedUpdateNote
      .mockRejectedValueOnce(new TypeError("Failed to fetch"))
      .mockResolvedValueOnce(savedNote({ category: "school" }));
    render(<NoteEditor note={note} categories={categories} />);

    await user.click(screen.getByRole("combobox", { name: "Category" }));
    await user.click(await screen.findByRole("option", { name: "School" }));
    await user.click(screen.getByRole("button", { name: "Close" }));

    expect(await screen.findByText("Couldn’t save")).toBeVisible();
    expect(
      screen.getByRole("combobox", { name: "Category" }),
    ).toHaveTextContent("School");
    await user.click(screen.getByRole("button", { name: "Retry" }));

    expect(await screen.findByText("Saved")).toBeVisible();
    expect(mockedUpdateNote).toHaveBeenCalledTimes(2);
  });

  it("flushes the latest draft before a confirmed deletion", async () => {
    const user = userEvent.setup();
    mockedUpdateNote.mockResolvedValue(savedNote({ content: "Keep in undo" }));
    mockedDeleteNote.mockResolvedValue();
    render(
      <NoteEditor
        note={note}
        categories={categories}
        returnTo="/notes?category=random-thoughts"
      />,
    );

    await user.clear(screen.getByLabelText("Note content"));
    await user.type(screen.getByLabelText("Note content"), "Keep in undo");
    await user.click(screen.getByRole("button", { name: "Delete" }));
    const dialog = await screen.findByRole("alertdialog", {
      name: "Delete this note?",
    });
    await user.click(
      within(dialog).getByRole("button", { name: "Delete note" }),
    );

    await waitFor(() => expect(mockedDeleteNote).toHaveBeenCalledWith(note.id));
    expect(mockedUpdateNote).toHaveBeenCalledWith(note.id, {
      category: "random-thoughts",
      title: "Before",
      content: "Keep in undo",
    });
    expect(mockedUpdateNote.mock.invocationCallOrder[0]).toBeLessThan(
      mockedDeleteNote.mock.invocationCallOrder[0],
    );
    expect(replace).toHaveBeenCalledWith(
      `/notes?category=random-thoughts&undo=${note.id}`,
    );
  });

  it("shows a recoverable message when deletion fails", async () => {
    const user = userEvent.setup();
    mockedDeleteNote.mockRejectedValue(new TypeError("Failed to fetch"));
    render(<NoteEditor note={note} categories={categories} />);

    await user.click(screen.getByRole("button", { name: "Delete" }));
    const dialog = await screen.findByRole("alertdialog", {
      name: "Delete this note?",
    });
    await user.click(
      within(dialog).getByRole("button", { name: "Delete note" }),
    );

    expect(
      await screen.findByText("We couldn’t delete the note. Please try again."),
    ).toHaveAttribute("role", "alert");
    expect(screen.getByRole("button", { name: "Delete" })).toBeEnabled();
  });
});
