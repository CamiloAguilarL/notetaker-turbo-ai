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
    <header className="border-foreground/80 flex items-center justify-between border-b-2 px-5 py-4 sm:px-8">
      <div className="flex items-center gap-3 font-semibold">
        <span className="border-foreground bg-note-school grid size-9 place-items-center rounded-full border-2">
          <NotebookPen aria-hidden="true" className="size-4" />
        </span>
        Turbo Notes
      </div>
      <div className="flex items-center gap-3">
        <p
          role={error ? "alert" : undefined}
          className="text-destructive text-xs"
        >
          {error}
        </p>
        <span className="text-muted-foreground hidden max-w-52 truncate text-sm sm:block">
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
