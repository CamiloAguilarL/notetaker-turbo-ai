"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type NotebookSelectOption<TValue extends string = string> = {
  value: TValue;
  label: string;
  dotClassName?: string;
};

type NotebookSelectProps<TValue extends string> = {
  align?: "start" | "center" | "end";
  ariaLabel: string;
  name: string;
  options: NotebookSelectOption<TValue>[];
  value: TValue;
  onValueChange: (value: TValue) => void;
};

export function NotebookSelect<TValue extends string>({
  align = "start",
  ariaLabel,
  name,
  options,
  value,
  onValueChange,
}: NotebookSelectProps<TValue>) {
  const selectedOption =
    options.find((option) => option.value === value) ?? options[0];
  const items = options.map(({ label, value: optionValue }) => ({
    label,
    value: optionValue,
  }));

  return (
    <Select
      name={name}
      items={items}
      value={value}
      onValueChange={(nextValue) => {
        if (nextValue) onValueChange(nextValue as TValue);
      }}
    >
      <SelectTrigger aria-label={ariaLabel} variant="notebook">
        {selectedOption?.dotClassName ? (
          <span
            aria-hidden="true"
            className={cn(
              "relative z-10 size-2.5 shrink-0 rounded-full",
              selectedOption.dotClassName,
            )}
          />
        ) : null}
        <SelectValue />
      </SelectTrigger>
      <SelectContent
        align={align}
        alignItemWithTrigger={false}
        sideOffset={0}
        variant="notebook"
      >
        <SelectGroup>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              variant="notebook"
            >
              {option.dotClassName ? (
                <span
                  aria-hidden="true"
                  className={cn(
                    "size-2.5 shrink-0 rounded-full",
                    option.dotClassName,
                  )}
                />
              ) : null}
              <span>{option.label}</span>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
