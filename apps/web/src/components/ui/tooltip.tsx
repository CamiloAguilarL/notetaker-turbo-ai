"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Tooltip as TooltipPrimitive } from "radix-ui";
import * as React from "react";

import { cn } from "@/lib/utils";

const tooltipTriggerVariants = cva("", {
  variants: {
    variant: {
      default: "",
      truncated:
        "text-muted-foreground focus-visible:ring-ring hidden max-w-52 truncate rounded-sm text-xs outline-none focus-visible:ring-2 sm:block",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const tooltipContentVariants = cva(
  "border-primary/35 bg-card text-card-foreground data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1 data-[state=delayed-open]:animate-in data-[state=delayed-open]:zoom-in-95 data-[state=instant-open]:animate-in data-[state=instant-open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 z-50 inline-flex w-fit max-w-xs origin-(--radix-tooltip-content-transform-origin) items-center rounded-lg border px-3 py-2 text-xs shadow-lg",
  {
    variants: {
      variant: {
        default: "",
        "long-text":
          "max-w-[min(var(--layout-tooltip-max-width),calc(100vw-2rem))] break-all",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function TooltipProvider({
  delayDuration = 250,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  );
}

function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />;
}

function TooltipTrigger({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger> &
  VariantProps<typeof tooltipTriggerVariants>) {
  return (
    <TooltipPrimitive.Trigger
      data-slot="tooltip-trigger"
      data-variant={variant}
      className={cn(tooltipTriggerVariants({ variant, className }))}
      {...props}
    />
  );
}

function TooltipContent({
  className,
  sideOffset = 4,
  variant = "default",
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content> &
  VariantProps<typeof tooltipContentVariants>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        data-variant={variant}
        sideOffset={sideOffset}
        className={cn(tooltipContentVariants({ variant, className }))}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow
          aria-hidden="true"
          className="fill-card stroke-primary/35 stroke-1"
        />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  tooltipContentVariants,
  tooltipTriggerVariants,
};
