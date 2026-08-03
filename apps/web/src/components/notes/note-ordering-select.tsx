"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
    <div className="flex items-center gap-2 text-sm font-medium">
      <span className="sr-only sm:not-sr-only">Sort by</span>
      <Select
        name="note-ordering"
        items={options}
        value={value}
        onValueChange={(nextValue) => {
          if (nextValue) onValueChange(nextValue);
        }}
      >
        <SelectTrigger
          aria-label="Sort notes"
          className="border-primary/35 text-foreground focus-visible:ring-ring/40 hover:bg-card/45 h-10 min-w-40 rounded-full bg-transparent px-4 focus-visible:ring-3"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent
          align="end"
          alignItemWithTrigger={false}
          className="border-primary/35 bg-control-surface rounded-xl border p-0 shadow-lg ring-0"
        >
          <SelectGroup>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
