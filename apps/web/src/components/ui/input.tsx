import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const inputVariants = cva(
  "border-input file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/35 disabled:bg-input/30 aria-invalid:border-destructive aria-invalid:ring-destructive/20 h-10 w-full min-w-0 rounded-lg border bg-transparent px-3 py-2 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-3 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3 md:text-sm",
  {
    variants: {
      variant: {
        default: "",
        auth: "border-primary/45 bg-card/20 focus-visible:border-primary h-11",
        search: "border-primary/35 pl-10",
        "editor-title":
          "placeholder:text-foreground/35 caret-foreground mt-4 h-auto rounded-none border-0 px-0 py-0 font-serif text-3xl leading-tight font-semibold tracking-editor-title shadow-none ring-0 focus-visible:border-0 focus-visible:ring-0 sm:mt-6 sm:text-4xl md:text-4xl",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Input({
  className,
  type,
  variant = "default",
  ...props
}: React.ComponentProps<"input"> & VariantProps<typeof inputVariants>) {
  return (
    <input
      type={type}
      data-slot="input"
      data-variant={variant}
      className={cn(inputVariants({ variant, className }))}
      {...props}
    />
  );
}

export { Input, inputVariants };
