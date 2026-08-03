import Image from "next/image";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

const brandMarkSizes = {
  sm: "size-6",
  md: "size-7",
  lg: "size-8",
} as const;

type BrandMarkProps = Omit<
  ComponentProps<typeof Image>,
  "alt" | "height" | "src" | "width"
> & {
  size?: keyof typeof brandMarkSizes;
  priority?: boolean;
};

export function BrandMark({
  className,
  priority = false,
  size = "sm",
  ...props
}: BrandMarkProps) {
  return (
    <Image
      src="/icon.png"
      alt=""
      aria-hidden="true"
      width={32}
      height={32}
      priority={priority}
      className={cn("shrink-0", brandMarkSizes[size], className)}
      {...props}
    />
  );
}
