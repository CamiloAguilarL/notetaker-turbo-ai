"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Category } from "@/lib/api/types";
import { categoryThemes } from "@/lib/category-theme";
import { cn } from "@/lib/utils";

type CategorySelectProps = {
  categories: Category[];
  value: string;
  onValueChange: (value: string) => void;
};

export function CategorySelect({
  categories,
  value,
  onValueChange,
}: CategorySelectProps) {
  const selectedCategory =
    categories.find((category) => category.slug === value) ?? categories[0];
  const selectedTheme = categoryThemes[selectedCategory?.color_key ?? "random"];
  const items = categories.map((category) => ({
    label: category.name,
    value: category.slug,
  }));

  return (
    <div className="shrink-0">
      <Select
        name="category"
        items={items}
        value={value}
        onValueChange={(nextValue) => {
          if (nextValue) onValueChange(nextValue);
        }}
      >
        <SelectTrigger
          aria-label="Category"
          className="text-foreground before:border-control-border before:bg-control-surface hover:before:bg-card focus-visible:before:border-ring focus-visible:before:ring-ring/25 [&_[data-slot=select-icon]]:text-control-icon relative h-11 w-[12.125rem] rounded-[0.375rem] border-0 bg-transparent py-0 pr-1.5 pl-[0.8125rem] text-[0.6875rem] leading-none font-normal shadow-none before:pointer-events-none before:absolute before:inset-x-0 before:inset-y-[0.3125rem] before:rounded-[0.375rem] before:border before:transition-colors hover:bg-transparent focus-visible:border-0 focus-visible:ring-0 focus-visible:before:ring-2 [&_[data-slot=select-icon]]:relative [&_[data-slot=select-icon]]:z-10 [&_[data-slot=select-icon]]:size-8 [&_[data-slot=select-icon]]:stroke-[1.5]"
        >
          <span
            aria-hidden="true"
            className={cn(
              "relative z-10 size-2.5 rounded-full",
              selectedTheme.dot,
            )}
          />
          <SelectValue className="relative z-10" />
        </SelectTrigger>
        <SelectContent
          align="start"
          alignItemWithTrigger={false}
          sideOffset={0}
          className="border-control-border bg-control-surface rounded-[0.375rem] border p-0 shadow-lg ring-0"
        >
          <SelectGroup>
            {categories.map((category) => {
              const theme = categoryThemes[category.color_key];

              return (
                <SelectItem
                  key={category.id}
                  value={category.slug}
                  className="min-h-9 rounded-[0.25rem] px-2.5 py-1.5 text-xs"
                >
                  <span
                    aria-hidden="true"
                    className={cn("size-2.5 rounded-full", theme.dot)}
                  />
                  <span>{category.name}</span>
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
