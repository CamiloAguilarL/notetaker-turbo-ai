import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const textareaVariants = cva(
  "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/35 disabled:bg-input/30 aria-invalid:border-destructive aria-invalid:ring-destructive/20 field-sizing-content min-h-16 w-full rounded-lg border bg-transparent px-3 py-2 text-base transition-colors outline-none focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3 md:text-sm",
  {
    variants: {
      variant: {
        default: "",
        "editor-body":
          "notebook-scrollbar placeholder:text-foreground/35 caret-foreground mt-5 field-sizing-fixed min-h-[calc(100dvh-24rem)] resize-none overflow-y-auto rounded-none border-0 px-0 py-0 text-base leading-7 shadow-none ring-0 focus-visible:border-0 focus-visible:ring-0 sm:mt-7 sm:min-h-[calc(100dvh-25rem)] md:text-base",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Textarea({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"textarea"> & VariantProps<typeof textareaVariants>) {
  return (
    <textarea
      data-slot="textarea"
      data-variant={variant}
      className={cn(textareaVariants({ variant, className }))}
      {...props}
    />
  );
}

export { Textarea, textareaVariants };
