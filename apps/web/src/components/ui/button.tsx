import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-full border bg-clip-padding text-sm font-semibold whitespace-nowrap transition-[background-color,color,border-color,transform] outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/35 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "border-primary/65 bg-transparent text-primary hover:border-primary hover:bg-secondary/60",
        outline:
          "border-input bg-transparent text-foreground hover:border-primary/55 hover:bg-secondary/45 aria-expanded:border-primary/55 aria-expanded:bg-secondary/45",
        secondary:
          "border-transparent bg-secondary/70 text-secondary-foreground hover:bg-secondary aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "border-transparent bg-transparent hover:bg-muted/70 hover:text-foreground aria-expanded:bg-muted/70 aria-expanded:text-foreground",
        "destructive-ghost":
          "border-transparent bg-transparent text-destructive hover:bg-destructive/10 hover:text-destructive aria-expanded:bg-destructive/10 aria-expanded:text-destructive",
        "note-control":
          "border-transparent bg-transparent hover:bg-background/85 hover:text-foreground aria-expanded:bg-background/85 aria-expanded:text-foreground",
        destructive:
          "border-destructive bg-destructive text-primary-foreground hover:bg-destructive-hover focus-visible:border-destructive focus-visible:ring-destructive/30",
        link: "border-transparent bg-transparent text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-10 gap-2 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-control-compact in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-11 gap-2 px-5 has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        header: "h-11 gap-1 px-3 sm:h-10 sm:px-4",
        icon: "size-8",
        "icon-touch": "size-10 sm:size-11",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
