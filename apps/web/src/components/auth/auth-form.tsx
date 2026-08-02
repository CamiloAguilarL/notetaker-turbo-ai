"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { LoaderCircle } from "lucide-react";

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
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-medium">
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
          placeholder="you@example.com"
          className="border-primary/45 bg-card/20 focus-visible:border-primary h-11 rounded-lg"
        />
        {fieldErrors.email ? (
          <p id="email-error" className="text-destructive text-sm">
            {fieldErrors.email}
          </p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <Input
          ref={passwordRef}
          id="password"
          name="password"
          type="password"
          autoComplete={isLogin ? "current-password" : "new-password"}
          required
          minLength={8}
          aria-invalid={Boolean(fieldErrors.password)}
          aria-describedby={fieldErrors.password ? "password-error" : undefined}
          placeholder="At least 8 characters…"
          className="border-primary/45 bg-card/20 focus-visible:border-primary h-11 rounded-lg"
        />
        {fieldErrors.password ? (
          <p id="password-error" className="text-destructive text-sm">
            {fieldErrors.password}
          </p>
        ) : null}
      </div>

      <div aria-live="polite" aria-atomic="true" className="min-h-5">
        {formError ? (
          <p className="text-destructive text-sm">{formError}</p>
        ) : null}
      </div>

      <Button type="submit" className="mt-1 w-full" disabled={isPending}>
        {isPending ? (
          <LoaderCircle aria-hidden="true" className="animate-spin" />
        ) : null}
        {isPending
          ? "Opening your notebook…"
          : isLogin
            ? "Sign in"
            : "Create account"}
      </Button>

      <p className="text-muted-foreground pt-1 text-center text-sm">
        {isLogin ? "New around here?" : "Already have a notebook?"}{" "}
        <Link
          href={isLogin ? "/register" : "/login"}
          className="text-foreground font-semibold underline decoration-2 underline-offset-4"
        >
          {isLogin ? "Create an account" : "Sign in"}
        </Link>
      </p>
    </form>
  );
}
