import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const skeletonVariants = cva("animate-pulse", {
  variants: {
    shape: {
      default: "rounded-md",
      line: "rounded-full",
      control: "rounded-full",
    },
    tone: {
      default: "bg-skeleton",
      ink: "bg-skeleton-ink",
    },
  },
  defaultVariants: {
    shape: "default",
    tone: "default",
  },
});

function Skeleton({
  className,
  shape,
  tone,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof skeletonVariants>) {
  return (
    <div
      data-slot="skeleton"
      className={cn(skeletonVariants({ shape, tone, className }))}
      {...props}
    />
  );
}

export { Skeleton, skeletonVariants };
