"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut } from "lucide-react";

import { BrandMark } from "@/components/brand/brand-mark";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
    <header className="max-w-app mx-auto flex min-h-14 w-full items-center justify-between px-5 py-2 sm:px-8 lg:px-10">
      <Link
        href="/notes"
        className="focus-visible:ring-ring/40 flex items-center gap-2 rounded-full text-sm font-semibold outline-none focus-visible:ring-3"
      >
        <BrandMark priority />
        Turbo Notes
      </Link>
      <div className="flex items-center gap-3">
        <p
          role={error ? "alert" : undefined}
          className="text-destructive max-w-52 text-right text-xs"
        >
          {error}
        </p>
        <Tooltip>
          <TooltipTrigger asChild variant="truncated">
            <span tabIndex={0}>{user.email}</span>
          </TooltipTrigger>
          <TooltipContent
            side="bottom"
            align="end"
            sideOffset={6}
            variant="long-text"
          >
            {user.email}
          </TooltipContent>
        </Tooltip>
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
