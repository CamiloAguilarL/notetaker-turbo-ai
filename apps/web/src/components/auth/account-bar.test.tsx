import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AccountBar } from "@/components/auth/account-bar";
import { logOut } from "@/lib/api/auth";

const replace = vi.fn();
const refresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace, refresh }),
}));

vi.mock("@/lib/api/auth", () => ({
  logOut: vi.fn(),
}));

const mockedLogOut = vi.mocked(logOut);

describe("AccountBar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("invalidates the session and leaves the private area", async () => {
    const user = userEvent.setup();
    mockedLogOut.mockResolvedValue();
    render(<AccountBar user={{ id: 1, email: "reader@example.com" }} />);

    await user.click(screen.getByRole("button", { name: "Sign out" }));

    expect(mockedLogOut).toHaveBeenCalledOnce();
    await waitFor(() => expect(replace).toHaveBeenCalledWith("/login"));
    expect(refresh).toHaveBeenCalledOnce();
  });

  it("keeps a recoverable action when logout fails", async () => {
    const user = userEvent.setup();
    mockedLogOut.mockRejectedValue(new TypeError("Failed to fetch"));
    render(<AccountBar user={{ id: 1, email: "reader@example.com" }} />);

    await user.click(screen.getByRole("button", { name: "Sign out" }));

    expect(
      await screen.findByText("We couldn’t sign you out. Please try again."),
    ).toHaveAttribute("role", "alert");
    expect(screen.getByRole("button", { name: "Sign out" })).toBeEnabled();
  });
});
