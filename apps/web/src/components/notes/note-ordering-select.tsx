"use client";

import { NotebookSelect } from "@/components/notes/notebook-select";
import type { NoteOrdering } from "@/lib/notes-query";

type OrderingOption = {
  value: NoteOrdering;
  label: string;
};

type NoteOrderingSelectProps = {
  options: OrderingOption[];
  value: NoteOrdering;
  onValueChange: (value: NoteOrdering) => void;
};

export function NoteOrderingSelect({
  options,
  value,
  onValueChange,
}: NoteOrderingSelectProps) {
  return (
    <div className="flex shrink-0 items-center gap-2 text-sm font-medium sm:ml-auto">
      <span className="sr-only sm:not-sr-only">Sort by</span>
      <NotebookSelect
        align="end"
        ariaLabel="Sort notes"
        name="note-ordering"
        options={options}
        value={value}
        onValueChange={onValueChange}
      />
    </div>
  );
}
