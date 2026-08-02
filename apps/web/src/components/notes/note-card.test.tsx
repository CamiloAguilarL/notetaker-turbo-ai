import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { NoteCard } from "@/components/notes/note-card";
import type { Category, Note } from "@/lib/api/types";

const category: Category = {
  id: 2,
  name: "School",
  slug: "school",
  color_key: "school",
  note_count: 1,
};

const note: Note = {
  id: "8ff50ae7-a153-49cd-ab60-2c865f3d82a1",
  category: "school",
  title: "Read the architecture chapter",
  content: "Capture the important tradeoffs before Friday.",
  created_at: "2026-08-02T12:00:00Z",
  updated_at: "2026-08-03T12:00:00Z",
};

describe("NoteCard", () => {
  it("presents note metadata and preserves the active filter", () => {
    render(
      <NoteCard note={note} category={category} returnCategory="school" />,
    );

    expect(screen.getByText("School")).toBeVisible();
    expect(screen.getByText("Read the architecture chapter")).toBeVisible();
    expect(
      screen.getByText("Capture the important tradeoffs before Friday."),
    ).toBeVisible();
    expect(screen.getByRole("time")).toHaveAttribute(
      "datetime",
      note.updated_at,
    );
    expect(
      screen.getByRole("link", {
        name: "Open Read the architecture chapter",
      }),
    ).toHaveAttribute("href", `/notes/${note.id}?from=school`);
  });

  it("gives blank notes a useful accessible name", () => {
    render(
      <NoteCard
        note={{ ...note, title: "", content: "" }}
        category={category}
      />,
    );

    expect(screen.getByText("Untitled note")).toBeVisible();
    expect(
      screen.getByRole("link", { name: "Open untitled note" }),
    ).toHaveAttribute("href", `/notes/${note.id}`);
  });
});
