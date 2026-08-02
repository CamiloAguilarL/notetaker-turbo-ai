"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, NotebookPen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { logOut } from "@/lib/api/auth";
import type { User } from "@/lib/api/types";

export function AccountBar({ user }: { user: User }) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string>();

  async function handleLogout() {
    setIsPending(true);
    setError(undefined);
    try {
      await logOut();
      router.replace("/login");
      router.refresh();
    } catch {
      setError("We couldn’t sign you out. Please try again.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <header className="mx-auto flex min-h-14 w-full max-w-[82rem] items-center justify-between px-5 py-2 sm:px-8 lg:px-10">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <NotebookPen aria-hidden="true" className="text-primary size-4" />
        Turbo Notes
      </div>
      <div className="flex items-center gap-3">
        <p
          role={error ? "alert" : undefined}
          className="text-destructive max-w-52 text-right text-xs"
        >
          {error}
        </p>
        <span className="text-muted-foreground hidden max-w-52 truncate text-xs sm:block">
          {user.email}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          disabled={isPending}
        >
          <LogOut aria-hidden="true" />
          {isPending ? "Signing out…" : "Sign out"}
        </Button>
      </div>
    </header>
  );
}
