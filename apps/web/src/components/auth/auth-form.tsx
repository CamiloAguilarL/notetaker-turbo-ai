"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api/client";
import { logIn, register } from "@/lib/api/auth";

type AuthFormProps = {
  mode: "login" | "register";
};

type FieldErrors = {
  email?: string;
  password?: string;
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string>();
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const isLogin = mode === "login";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setFormError(undefined);
    setFieldErrors({});

    const form = new FormData(event.currentTarget);
    const credentials = {
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
    };

    try {
      if (isLogin) await logIn(credentials);
      else await register(credentials);
      router.replace("/notes");
      router.refresh();
    } catch (error) {
      if (error instanceof ApiError) {
        const nextFieldErrors = {
          email: error.fieldMessage("email"),
          password: error.fieldMessage("password"),
        };
        setFieldErrors(nextFieldErrors);
        setFormError(error.fieldMessage("non_field_errors") ?? error.message);
        if (nextFieldErrors.email) emailRef.current?.focus();
        else if (nextFieldErrors.password) passwordRef.current?.focus();
      } else {
        setFormError("The service is unavailable. Please try again.");
      }
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col">
      <div className="gap-auth-field-gap flex flex-col">
        <label htmlFor="email" className="sr-only">
          Email
        </label>
        <Input
          ref={emailRef}
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          spellCheck={false}
          required
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={fieldErrors.email ? "email-error" : undefined}
          placeholder="Email address"
          variant="auth"
        />
        {fieldErrors.email ? (
          <p id="email-error" className="text-destructive -mt-2 text-xs">
            {fieldErrors.email}
          </p>
        ) : null}

        <label htmlFor="password" className="sr-only">
          Password
        </label>
        <div className="relative">
          <Input
            ref={passwordRef}
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete={isLogin ? "current-password" : "new-password"}
            required
            minLength={8}
            aria-invalid={Boolean(fieldErrors.password)}
            aria-describedby={
              fieldErrors.password ? "password-error" : undefined
            }
            placeholder="Password"
            variant="auth-password"
          />
          <Button
            type="button"
            variant="auth-icon"
            size="icon-auth"
            className="absolute top-1/2 right-0.5 -translate-y-1/2"
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            onClick={() => setShowPassword((isVisible) => !isVisible)}
          >
            {showPassword ? (
              <EyeOff aria-hidden="true" />
            ) : (
              <Eye aria-hidden="true" />
            )}
          </Button>
        </div>
        {fieldErrors.password ? (
          <p id="password-error" className="text-destructive -mt-2 text-xs">
            {fieldErrors.password}
          </p>
        ) : null}
      </div>

      <div aria-live="polite" aria-atomic="true">
        {formError ? (
          <p className="text-destructive mt-2 text-xs">{formError}</p>
        ) : null}
      </div>

      <Button
        type="submit"
        variant="auth"
        size="auth"
        className="mt-auth-action-gap w-full"
        disabled={isPending}
      >
        {isPending ? (
          <LoaderCircle aria-hidden="true" className="animate-spin" />
        ) : null}
        {isPending ? "Opening your notebook…" : isLogin ? "Login" : "Sign Up"}
      </Button>

      <p className="mt-auth-link-gap text-auth-copy text-auth-link text-center leading-none">
        <Link
          href={isLogin ? "/register" : "/login"}
          className="focus-visible:ring-auth-border/30 rounded-sm underline focus-visible:ring-2 focus-visible:outline-none"
        >
          {isLogin
            ? "Oops! I’ve never been here before"
            : "We’re already friends!"}
        </Link>
      </p>
    </form>
  );
}
