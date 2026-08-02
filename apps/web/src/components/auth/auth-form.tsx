"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";

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
        setFieldErrors({
          email: error.fieldMessage("email"),
          password: error.fieldMessage("password"),
        });
        setFormError(error.fieldMessage("non_field_errors") ?? error.message);
      } else {
        setFormError("The service is unavailable. Please try again.");
      }
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-semibold">
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={fieldErrors.email ? "email-error" : undefined}
          placeholder="you@example.com"
          className="border-foreground/40 focus-visible:border-primary h-12 rounded-none border-0 border-b-2 bg-transparent px-0 shadow-none focus-visible:ring-0"
        />
        {fieldErrors.email ? (
          <p id="email-error" className="text-destructive text-sm">
            {fieldErrors.email}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-semibold">
          Password
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete={isLogin ? "current-password" : "new-password"}
          required
          minLength={8}
          aria-invalid={Boolean(fieldErrors.password)}
          aria-describedby={fieldErrors.password ? "password-error" : undefined}
          placeholder="At least 8 characters"
          className="border-foreground/40 focus-visible:border-primary h-12 rounded-none border-0 border-b-2 bg-transparent px-0 shadow-none focus-visible:ring-0"
        />
        {fieldErrors.password ? (
          <p id="password-error" className="text-destructive text-sm">
            {fieldErrors.password}
          </p>
        ) : null}
      </div>

      <div aria-live="polite" aria-atomic="true" className="min-h-6">
        {formError ? (
          <p className="text-destructive text-sm">{formError}</p>
        ) : null}
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={isPending}>
        {isPending ? (
          <LoaderCircle aria-hidden="true" className="animate-spin" />
        ) : null}
        {isPending
          ? "Opening your notebook…"
          : isLogin
            ? "Sign in"
            : "Create account"}
        {!isPending ? <ArrowRight aria-hidden="true" /> : null}
      </Button>

      <p className="text-muted-foreground text-center text-sm">
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
