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
  manual_order: 0,
  created_at: "2026-08-02T12:00:00Z",
  updated_at: "2026-08-03T12:00:00Z",
};

describe("NoteCard", () => {
  it("presents metadata and preserves dashboard query state", () => {
    render(
      <NoteCard
        note={note}
        category={category}
        displayDate="Yesterday"
        returnQuery="category=school&q=architecture&ordering=updated_at"
      />,
    );

    expect(screen.getByText("School")).toBeVisible();
    expect(screen.getByRole("time")).toHaveTextContent("Yesterday");
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
    ).toHaveAttribute(
      "href",
      `/notes/${note.id}?return=category%3Dschool%26q%3Darchitecture%26ordering%3Dupdated_at`,
    );
  });

  it("gives blank notes a useful accessible name", () => {
    render(
      <NoteCard
        note={{ ...note, title: "", content: "" }}
        category={category}
        displayDate="Aug 3"
      />,
    );

    expect(screen.getByText("Untitled note")).toBeVisible();
    expect(
      screen.getByRole("link", { name: "Open untitled note" }),
    ).toHaveAttribute("href", `/notes/${note.id}`);
  });

  it("truncates titles normally and softly fades overflowing previews", () => {
    const { container } = render(
      <NoteCard
        note={{
          ...note,
          title: "A title that can occupy more than one line",
          content: "A long preview ".repeat(80),
        }}
        category={category}
        displayDate="Today"
      />,
    );

    expect(screen.getByRole("heading", { level: 2 })).toHaveClass(
      "line-clamp-2",
    );
    expect(
      container.querySelector('[data-slot="note-card-preview"]'),
    ).toHaveClass("note-preview-fade", "h-full", "overflow-hidden");
  });
});
