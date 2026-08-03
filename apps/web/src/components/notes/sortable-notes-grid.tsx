"use client";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type Announcements,
  type DragCancelEvent,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ArrowDown, ArrowUp, GripVertical, LoaderCircle } from "lucide-react";
import { useState } from "react";

import { NoteCard } from "@/components/notes/note-card";
import { Button } from "@/components/ui/button";
import { reorderNotes } from "@/lib/api/notes";
import type { Category, Note } from "@/lib/api/types";
import { cn } from "@/lib/utils";

type SortableNote = {
  note: Note;
  category: Category;
};

type SortableNotesGridProps = {
  notes: SortableNote[];
  returnQuery?: string;
};

function noteName(note: Note): string {
  return note.title || "Untitled note";
}

function SortableNoteCard({
  item,
  index,
  count,
  returnQuery,
  disabled,
  onMoveEarlier,
  onMoveLater,
}: {
  item: SortableNote;
  index: number;
  count: number;
  returnQuery?: string;
  disabled: boolean;
  onMoveEarlier: () => void;
  onMoveLater: () => void;
}) {
  const {
    attributes,
    listeners,
    setActivatorNodeRef,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.note.id, disabled });
  const title = noteName(item.note);

  return (
    <li
      ref={setNodeRef}
      aria-label={`${title}, position ${index + 1} of ${count}`}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 20 : undefined,
      }}
      className={cn("relative", isDragging && "opacity-70 select-none")}
    >
      <NoteCard
        note={item.note}
        category={item.category}
        returnQuery={returnQuery}
        action={
          <div className="bg-background/55 backdrop-blur-note-controls flex rounded-full p-0.5">
            <Button
              type="button"
              variant="note-control"
              size="icon-sm"
              aria-label={`Move ${title} earlier`}
              title="Move earlier"
              disabled={disabled || index === 0}
              onClick={onMoveEarlier}
            >
              <ArrowUp aria-hidden="true" />
            </Button>
            <Button
              ref={setActivatorNodeRef}
              type="button"
              variant="note-control"
              size="icon-sm"
              aria-label={`Drag ${title} to reorder`}
              title="Drag to reorder"
              disabled={disabled}
              className="cursor-grab touch-none active:cursor-grabbing"
              {...attributes}
              {...listeners}
            >
              <GripVertical aria-hidden="true" />
            </Button>
            <Button
              type="button"
              variant="note-control"
              size="icon-sm"
              aria-label={`Move ${title} later`}
              title="Move later"
              disabled={disabled || index === count - 1}
              onClick={onMoveLater}
            >
              <ArrowDown aria-hidden="true" />
            </Button>
          </div>
        }
      />
    </li>
  );
}

export function SortableNotesGrid({
  notes: initialNotes,
  returnQuery,
}: SortableNotesGridProps) {
  const [notes, setNotes] = useState(initialNotes);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(
    "Drag a handle or use Space and the arrow keys to reorder notes.",
  );
  const [error, setError] = useState<string>();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const ids = notes.map(({ note }) => note.id);

  function positionOf(id: string | number): number {
    return notes.findIndex(({ note }) => note.id === id) + 1;
  }

  function titleOf(id: string | number): string {
    const item = notes.find(({ note }) => note.id === id);
    return item ? noteName(item.note) : "Note";
  }

  const announcements: Announcements = {
    onDragStart({ active }) {
      return `${titleOf(active.id)} picked up. Position ${positionOf(active.id)} of ${notes.length}.`;
    },
    onDragOver({ active, over }) {
      if (!over || active.id === over.id) return undefined;
      return `${titleOf(active.id)} moved to position ${positionOf(over.id)} of ${notes.length}.`;
    },
    onDragEnd({ active, over }) {
      if (!over) return `${titleOf(active.id)} was not moved.`;
      return `${titleOf(active.id)} dropped at position ${positionOf(over.id)} of ${notes.length}.`;
    },
    onDragCancel({ active }) {
      return `Moving ${titleOf(active.id)} was cancelled.`;
    },
  };

  function handleDragStart({ active }: DragStartEvent) {
    setError(undefined);
    setMessage(`Moving ${titleOf(active.id)}…`);
  }

  function handleDragCancel({ active }: DragCancelEvent) {
    setMessage(`Moving ${titleOf(active.id)} was cancelled.`);
  }

  async function persistMove(oldIndex: number, newIndex: number) {
    if (
      isSaving ||
      oldIndex < 0 ||
      newIndex < 0 ||
      oldIndex >= notes.length ||
      newIndex >= notes.length ||
      oldIndex === newIndex
    ) {
      setMessage("Order unchanged.");
      return;
    }

    const previous = notes;
    const next = arrayMove(notes, oldIndex, newIndex);
    setNotes(next);
    setIsSaving(true);
    setError(undefined);
    setMessage("Saving manual order…");

    try {
      await reorderNotes(next.map(({ note }) => note.id));
      setMessage("Manual order saved.");
    } catch {
      setNotes(previous);
      setError(
        "We couldn’t save that order. Your previous order was restored.",
      );
      setMessage("Manual order was not saved.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) {
      setMessage("Order unchanged.");
      return;
    }

    const oldIndex = notes.findIndex(({ note }) => note.id === active.id);
    const newIndex = notes.findIndex(({ note }) => note.id === over.id);
    await persistMove(oldIndex, newIndex);
  }

  return (
    <div>
      <div className="mb-3 flex min-h-6 items-center justify-end gap-2 text-xs">
        {isSaving ? (
          <LoaderCircle aria-hidden="true" className="size-3.5 animate-spin" />
        ) : null}
        <p aria-live="polite" className="text-muted-foreground">
          {message}
        </p>
      </div>
      {error ? (
        <p role="alert" className="text-destructive mb-3 text-right text-sm">
          {error}
        </p>
      ) : null}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        accessibility={{
          announcements,
          screenReaderInstructions: {
            draggable:
              "Press Space or Enter to pick up a note, use the arrow keys to move it, press Space or Enter to drop it, or Escape to cancel.",
          },
        }}
        onDragStart={handleDragStart}
        onDragCancel={handleDragCancel}
        onDragEnd={(event) => void handleDragEnd(event)}
      >
        <SortableContext items={ids} strategy={rectSortingStrategy}>
          <ul
            aria-label="All notes in manual order"
            className="grid min-w-0 gap-5 sm:grid-cols-2 xl:grid-cols-3"
          >
            {notes.map((item, index) => (
              <SortableNoteCard
                key={item.note.id}
                item={item}
                index={index}
                count={notes.length}
                returnQuery={returnQuery}
                disabled={isSaving}
                onMoveEarlier={() => void persistMove(index, index - 1)}
                onMoveLater={() => void persistMove(index, index + 1)}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
}
