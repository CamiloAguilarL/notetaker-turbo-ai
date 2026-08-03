"use client";

import { NotebookSelect } from "@/components/notes/notebook-select";
import type { Category } from "@/lib/api/types";
import { categoryThemes } from "@/lib/category-theme";

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
  const items = categories.map((category) => ({
    label: category.name,
    value: category.slug,
    dotClassName: categoryThemes[category.color_key].dot,
  }));

  return (
    <div className="shrink-0">
      <NotebookSelect
        ariaLabel="Category"
        name="category"
        options={items}
        value={value}
        onValueChange={onValueChange}
      />
    </div>
  );
}
