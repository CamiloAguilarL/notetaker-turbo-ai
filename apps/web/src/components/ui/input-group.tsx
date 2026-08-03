import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const inputGroupVariants = cva(
  "group/input-group flex w-full min-w-0 items-center border transition-colors outline-none",
  {
    variants: {
      variant: {
        notebook:
          "border-control-border bg-control-surface hover:border-ring hover:bg-control-hover focus-within:border-ring focus-within:bg-control-surface focus-within:ring-3 focus-within:ring-ring/25 h-dashboard-control rounded-control",
      },
    },
    defaultVariants: {
      variant: "notebook",
    },
  },
);

function InputGroup({
  className,
  variant = "notebook",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupVariants>) {
  return (
    <div
      data-slot="input-group"
      data-variant={variant}
      className={cn(inputGroupVariants({ variant, className }))}
      {...props}
    />
  );
}

function InputGroupAddon({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="input-group-addon"
      className={cn(
        "text-muted-foreground pointer-events-none flex shrink-0 items-center pl-3 [&_svg]:size-4",
        className,
      )}
      {...props}
    />
  );
}

function InputGroupInput(
  props: Omit<React.ComponentProps<typeof Input>, "variant">,
) {
  return (
    <Input data-slot="input-group-control" variant="group-search" {...props} />
  );
}

export { InputGroup, InputGroupAddon, InputGroupInput, inputGroupVariants };
