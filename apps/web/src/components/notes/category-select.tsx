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
        <SelectTrigger aria-label="Category" variant="category">
          <span
            aria-hidden="true"
            className={cn(
              "relative z-10 size-2.5 rounded-full",
              selectedTheme.dot,
            )}
          />
          <SelectValue />
        </SelectTrigger>
        <SelectContent
          align="start"
          alignItemWithTrigger={false}
          sideOffset={0}
          variant="category"
        >
          <SelectGroup>
            {categories.map((category) => {
              const theme = categoryThemes[category.color_key];

              return (
                <SelectItem
                  key={category.id}
                  value={category.slug}
                  variant="category"
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
