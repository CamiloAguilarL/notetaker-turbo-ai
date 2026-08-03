"use client";

import { Select as SelectPrimitive } from "@base-ui/react/select";
import { cva, type VariantProps } from "class-variance-authority";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const Select = SelectPrimitive.Root;

const selectTriggerVariants = cva(
  "border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground flex w-fit items-center justify-between gap-1.5 rounded-lg border bg-transparent py-2 pr-2 pl-2.5 text-sm whitespace-nowrap transition-colors outline-none select-none focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3 data-[size=default]:h-8 data-[size=sm]:h-7 data-[size=sm]:rounded-[min(var(--radius-md),10px)] *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "",
        category:
          "text-foreground before:border-control-border before:bg-control-surface hover:before:bg-card focus-visible:before:border-ring focus-visible:before:ring-ring/25 [&_[data-slot=select-icon]]:text-control-icon relative h-11 w-category-trigger rounded-control border-0 py-0 pr-1.5 pl-category-label-inset text-control-caption font-normal shadow-none before:pointer-events-none before:absolute before:inset-x-0 before:inset-y-category-visual-inset before:rounded-control before:border before:transition-colors hover:bg-transparent focus-visible:border-0 focus-visible:ring-0 focus-visible:before:ring-2 *:data-[slot=select-value]:relative *:data-[slot=select-value]:z-10 [&_[data-slot=select-icon]]:relative [&_[data-slot=select-icon]]:z-10 [&_[data-slot=select-icon]]:size-8 [&_[data-slot=select-icon]]:stroke-[1.5]",
        ordering:
          "border-primary/35 text-foreground focus-visible:ring-ring/40 hover:bg-card/45 h-10 min-w-40 rounded-full px-4 focus-visible:ring-3",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const selectContentVariants = cva(
  "bg-popover text-popover-foreground ring-foreground/10 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 relative isolate z-50 max-h-(--available-height) w-(--anchor-width) min-w-36 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-lg shadow-md ring-1 duration-100 data-[align-trigger=true]:animate-none",
  {
    variants: {
      variant: {
        default: "",
        category:
          "border-control-border bg-control-surface rounded-control border p-0 shadow-lg ring-0",
        ordering:
          "border-primary/35 bg-control-surface rounded-xl border p-0 shadow-lg ring-0",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const selectItemVariants = cva(
  "focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground relative flex w-full cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
  {
    variants: {
      variant: {
        default: "",
        category: "min-h-9 rounded-control-item px-2.5 py-1.5 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function SelectGroup({ className, ...props }: SelectPrimitive.Group.Props) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn("scroll-my-1 p-1", className)}
      {...props}
    />
  );
}

function SelectValue({ className, ...props }: SelectPrimitive.Value.Props) {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      className={cn("flex flex-1 text-left", className)}
      {...props}
    />
  );
}

function SelectTrigger({
  className,
  size = "default",
  variant = "default",
  children,
  ...props
}: SelectPrimitive.Trigger.Props & {
  size?: "sm" | "default";
} & VariantProps<typeof selectTriggerVariants>) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      data-variant={variant}
      className={cn(selectTriggerVariants({ variant, className }))}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon
        render={
          <ChevronDownIcon
            data-slot="select-icon"
            className="text-muted-foreground pointer-events-none size-4"
          />
        }
      />
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  variant = "default",
  side = "bottom",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  alignItemWithTrigger = true,
  ...props
}: SelectPrimitive.Popup.Props &
  Pick<
    SelectPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset" | "alignItemWithTrigger"
  > &
  VariantProps<typeof selectContentVariants>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        alignItemWithTrigger={alignItemWithTrigger}
        className="isolate z-50"
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          data-align-trigger={alignItemWithTrigger}
          data-variant={variant}
          className={cn(selectContentVariants({ variant, className }))}
          {...props}
        >
          <SelectScrollUpButton />
          <SelectPrimitive.List>{children}</SelectPrimitive.List>
          <SelectScrollDownButton />
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({
  className,
  ...props
}: SelectPrimitive.GroupLabel.Props) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      className={cn("text-muted-foreground px-1.5 py-1 text-xs", className)}
      {...props}
    />
  );
}

function SelectItem({
  className,
  children,
  variant = "default",
  ...props
}: SelectPrimitive.Item.Props & VariantProps<typeof selectItemVariants>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      data-variant={variant}
      className={cn(selectItemVariants({ variant, className }))}
      {...props}
    >
      <SelectPrimitive.ItemText className="flex flex-1 shrink-0 gap-2 whitespace-nowrap">
        {children}
      </SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator
        render={
          <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center" />
        }
      >
        <CheckIcon className="pointer-events-none" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({
  className,
  ...props
}: SelectPrimitive.Separator.Props) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("bg-border pointer-events-none -mx-1 my-1 h-px", className)}
      {...props}
    />
  );
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpArrow>) {
  return (
    <SelectPrimitive.ScrollUpArrow
      data-slot="select-scroll-up-button"
      className={cn(
        "bg-popover top-0 z-10 flex w-full cursor-default items-center justify-center py-1 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <ChevronUpIcon />
    </SelectPrimitive.ScrollUpArrow>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownArrow>) {
  return (
    <SelectPrimitive.ScrollDownArrow
      data-slot="select-scroll-down-button"
      className={cn(
        "bg-popover bottom-0 z-10 flex w-full cursor-default items-center justify-center py-1 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <ChevronDownIcon />
    </SelectPrimitive.ScrollDownArrow>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  selectContentVariants,
  selectItemVariants,
  selectTriggerVariants,
};
