import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AuthForm } from "@/components/auth/auth-form";
import { ApiError } from "@/lib/api/client";
import { logIn, register } from "@/lib/api/auth";

const replace = vi.fn();
const refresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace, refresh }),
}));

vi.mock("@/lib/api/auth", () => ({
  logIn: vi.fn(),
  register: vi.fn(),
}));

const mockedLogIn = vi.mocked(logIn);
const mockedRegister = vi.mocked(register);

describe("AuthForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("signs in and opens the notebook", async () => {
    const user = userEvent.setup();
    mockedLogIn.mockResolvedValue({ id: 1, email: "reader@example.com" });

    render(<AuthForm mode="login" />);
    await user.type(screen.getByLabelText("Email"), "reader@example.com");
    await user.type(screen.getByLabelText("Password"), "a-secure-password");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(mockedLogIn).toHaveBeenCalledWith({
      email: "reader@example.com",
      password: "a-secure-password",
    });
    expect(mockedRegister).not.toHaveBeenCalled();
    await waitFor(() => expect(replace).toHaveBeenCalledWith("/notes"));
    expect(refresh).toHaveBeenCalledOnce();
  });

  it("shows API validation beside its field", async () => {
    const user = userEvent.setup();
    mockedRegister.mockRejectedValue(
      new ApiError(400, {
        error: {
          code: "validation_error",
          message: "Please correct the highlighted fields.",
          fields: { email: ["A user with this email already exists."] },
        },
      }),
    );

    render(<AuthForm mode="register" />);
    await user.type(screen.getByLabelText("Email"), "reader@example.com");
    await user.type(screen.getByLabelText("Password"), "a-secure-password");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(
      await screen.findByText("A user with this email already exists."),
    ).toBeVisible();
    expect(screen.getByLabelText("Email")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("shows a recoverable message when the service is unavailable", async () => {
    const user = userEvent.setup();
    mockedLogIn.mockRejectedValue(new TypeError("Failed to fetch"));

    render(<AuthForm mode="login" />);
    await user.type(screen.getByLabelText("Email"), "reader@example.com");
    await user.type(screen.getByLabelText("Password"), "a-secure-password");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(
      await screen.findByText("The service is unavailable. Please try again."),
    ).toBeVisible();
  });
});
