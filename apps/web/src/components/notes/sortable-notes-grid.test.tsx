import type {
  DndContext,
  DragCancelEvent,
  DragEndEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps, PropsWithChildren } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SortableNotesGrid } from "@/components/notes/sortable-notes-grid";
import { reorderNotes } from "@/lib/api/notes";
import type { Category, Note } from "@/lib/api/types";

type MockDndContextProps = PropsWithChildren<
  Pick<
    ComponentProps<typeof DndContext>,
    "accessibility" | "onDragStart" | "onDragCancel" | "onDragEnd"
  >
>;

const activeSecond = { active: { id: "second" } } as DragStartEvent;
const secondOverFirst = {
  active: { id: "second" },
  over: { id: "first" },
} as DragEndEvent;
const secondUnchanged = {
  active: { id: "second" },
  over: { id: "second" },
} as DragEndEvent;
const secondWithoutTarget = {
  active: { id: "second" },
  over: null,
} as DragEndEvent;

vi.mock("@dnd-kit/core", async () => {
  const React = await import("react");
  return {
    closestCenter: vi.fn(),
    KeyboardSensor: class KeyboardSensor {},
    PointerSensor: class PointerSensor {},
    useSensor: vi.fn((sensor, options) => ({ sensor, options })),
    useSensors: vi.fn((...sensors) => sensors),
    DndContext: ({
      children,
      accessibility,
      onDragStart,
      onDragCancel,
      onDragEnd,
    }: MockDndContextProps) => {
      const announcements = accessibility?.announcements;
      announcements?.onDragStart(activeSecond);
      announcements?.onDragOver(secondOverFirst);
      announcements?.onDragEnd(secondOverFirst);
      announcements?.onDragCancel({
        ...secondWithoutTarget,
        active: activeSecond.active,
      } as DragCancelEvent);
      return React.createElement(
        React.Fragment,
        null,
        React.createElement(
          "button",
          { onClick: () => onDragStart?.(activeSecond) },
          "Simulate drag start",
        ),
        React.createElement(
          "button",
          {
            onClick: () =>
              onDragCancel?.({
                ...secondWithoutTarget,
                active: activeSecond.active,
              } as DragCancelEvent),
          },
          "Simulate drag cancel",
        ),
        React.createElement(
          "button",
          { onClick: () => onDragEnd?.(secondOverFirst) },
          "Simulate reorder",
        ),
        React.createElement(
          "button",
          { onClick: () => onDragEnd?.(secondUnchanged) },
          "Simulate unchanged drop",
        ),
        React.createElement(
          "button",
          { onClick: () => onDragEnd?.(secondWithoutTarget) },
          "Simulate missing target",
        ),
        children,
      );
    },
  };
});

vi.mock("@dnd-kit/sortable", () => ({
  arrayMove: <T,>(items: T[], from: number, to: number) => {
    const next = [...items];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    return next;
  },
  rectSortingStrategy: vi.fn(),
  sortableKeyboardCoordinates: vi.fn(),
  SortableContext: ({ children }: PropsWithChildren) => children,
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setActivatorNodeRef: vi.fn(),
    setNodeRef: vi.fn(),
    transform: null,
    transition: undefined,
    isDragging: false,
  }),
}));

vi.mock("@/lib/api/notes", () => ({ reorderNotes: vi.fn() }));

const mockedReorderNotes = vi.mocked(reorderNotes);

const categories: Category[] = [
  {
    id: 1,
    name: "School",
    slug: "school",
    color_key: "school",
    note_count: 1,
  },
  {
    id: 2,
    name: "Personal",
    slug: "personal",
    color_key: "personal",
    note_count: 1,
  },
];

const notes: Note[] = [
  {
    id: "first",
    category: "school",
    title: "First note",
    content: "First body",
    manual_order: 0,
    created_at: "2026-08-02T12:00:00Z",
    updated_at: "2026-08-02T12:00:00Z",
  },
  {
    id: "second",
    category: "personal",
    title: "Second note",
    content: "Second body",
    manual_order: 1,
    created_at: "2026-08-02T12:01:00Z",
    updated_at: "2026-08-02T12:01:00Z",
  },
];

function renderGrid() {
  render(
    <SortableNotesGrid
      notes={notes.map((note) => ({
        note,
        category: categories.find(({ slug }) => slug === note.category)!,
        displayDate: "Yesterday",
      }))}
      returnQuery="ordering=manual"
    />,
  );
}

describe("SortableNotesGrid", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("persists a manual move and exposes the new accessible positions", async () => {
    const user = userEvent.setup();
    let finishSave: (() => void) | undefined;
    mockedReorderNotes.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          finishSave = resolve;
        }),
    );
    renderGrid();

    expect(
      screen.getByRole("listitem", { name: "First note, position 1 of 2" }),
    ).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Drag Second note to reorder" }),
    ).toBeEnabled();
    await user.click(
      screen.getByRole("button", { name: "Move Second note earlier" }),
    );

    expect(mockedReorderNotes).toHaveBeenCalledWith(["second", "first"]);
    expect(screen.getByText("Saving manual order…")).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Drag Second note to reorder" }),
    ).toBeDisabled();
    finishSave?.();

    expect(await screen.findByText("Manual order saved.")).toBeVisible();
    expect(
      screen.getByRole("listitem", { name: "Second note, position 1 of 2" }),
    ).toBeVisible();
  });

  it("rolls back the visible order after a persistence failure", async () => {
    const user = userEvent.setup();
    mockedReorderNotes.mockRejectedValue(new TypeError("Failed to fetch"));
    renderGrid();

    await user.click(
      screen.getByRole("button", { name: "Move Second note earlier" }),
    );

    expect(
      await screen.findByText(
        "We couldn’t save that order. Your previous order was restored.",
      ),
    ).toHaveAttribute("role", "alert");
    expect(
      screen.getByRole("listitem", { name: "First note, position 1 of 2" }),
    ).toBeVisible();
  });

  it("persists the same ordering contract after a drag operation", async () => {
    const user = userEvent.setup();
    mockedReorderNotes.mockResolvedValue();
    renderGrid();

    await user.click(
      screen.getByRole("button", { name: "Simulate drag start" }),
    );
    expect(screen.getByText("Moving Second note…")).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Simulate reorder" }));

    expect(mockedReorderNotes).toHaveBeenCalledWith(["second", "first"]);
    expect(await screen.findByText("Manual order saved.")).toBeVisible();
  });

  it("reports cancelled and unchanged moves without persisting", () => {
    renderGrid();

    fireEvent.click(
      screen.getByRole("button", { name: "Simulate drag cancel" }),
    );
    expect(screen.getByText("Moving Second note was cancelled.")).toBeVisible();
    fireEvent.click(
      screen.getByRole("button", { name: "Simulate unchanged drop" }),
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Simulate missing target" }),
    );

    expect(screen.getByText("Order unchanged.")).toBeVisible();
    expect(mockedReorderNotes).not.toHaveBeenCalled();
  });
});
