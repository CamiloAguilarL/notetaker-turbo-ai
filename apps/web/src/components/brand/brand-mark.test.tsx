import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BrandMark } from "@/components/brand/brand-mark";

describe("BrandMark", () => {
  it("uses the generated app icon as a decorative, responsive mark", () => {
    const { container } = render(<BrandMark size="md" priority />);

    const mark = container.querySelector("img");
    expect(mark).not.toBeNull();
    expect(mark?.getAttribute("src")).toContain("icon.png");
    expect(mark).toHaveAttribute("aria-hidden", "true");
    expect(mark).toHaveClass("size-7", "shrink-0");
  });
});
