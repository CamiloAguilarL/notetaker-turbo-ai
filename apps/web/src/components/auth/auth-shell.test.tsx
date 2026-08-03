import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AuthShell } from "@/components/auth/auth-shell";

describe("AuthShell", () => {
  it.each([
    ["register", "Yay, New Friend!", "auth-cat.png"],
    ["login", "Yay, You're Back!", "auth-cactus.png"],
  ] as const)(
    "uses the source illustration for %s",
    (mode, heading, assetName) => {
      const { container } = render(
        <AuthShell mode={mode}>
          <div>Form</div>
        </AuthShell>,
      );

      expect(screen.getByRole("heading", { name: heading })).toBeVisible();
      expect(screen.getByRole("main")).toHaveAttribute("data-auth-mode", mode);

      const illustration = container.querySelector(
        '[data-slot="auth-illustration"]',
      );
      expect(illustration).toBeInstanceOf(HTMLImageElement);
      expect(
        decodeURIComponent(illustration?.getAttribute("src") ?? ""),
      ).toContain(assetName);
    },
  );
});
