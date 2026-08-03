import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { NoteEditorSkeleton } from "@/components/notes/note-editor-skeleton";
import { NotesDashboardSkeleton } from "@/components/notes/notes-dashboard-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

describe("notes loading skeletons", () => {
  it("mirrors the populated dashboard without exposing duplicate content", () => {
    const { container } = render(<NotesDashboardSkeleton />);
    const dashboard = container.querySelector(
      '[data-slot="notes-dashboard-skeleton"]',
    );

    expect(dashboard).toHaveAttribute("aria-hidden", "true");
    expect(
      container.querySelector('[data-slot="category-nav-skeleton"]'),
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-slot="notes-toolbar-skeleton"]'),
    ).toBeInTheDocument();
    expect(
      container.querySelectorAll('[data-slot="note-card-skeleton"]'),
    ).toHaveLength(6);
  });

  it("keeps the editor placeholder decorative and non-interactive", () => {
    const { container } = render(<NoteEditorSkeleton />);
    const editor = container.querySelector(
      '[data-slot="note-editor-skeleton"]',
    );

    expect(editor).toHaveAttribute("aria-hidden", "true");
    expect(
      container.querySelector("button, input, textarea, select"),
    ).toBeNull();
    expect(
      container.querySelectorAll('[data-slot="skeleton"]').length,
    ).toBeGreaterThan(8);
  });

  it("keeps the shadcn primitive token-driven by default", () => {
    const { getByTestId } = render(<Skeleton data-testid="skeleton" />);

    expect(getByTestId("skeleton")).toHaveClass(
      "animate-pulse",
      "rounded-md",
      "bg-skeleton",
    );
  });
});
