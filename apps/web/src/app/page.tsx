import type { LucideIcon } from "lucide-react";
import { Check, NotebookPen, Palette, Search } from "lucide-react";
import * as motion from "motion/react-client";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/api/server";
import { cn } from "@/lib/utils";

const benefits: Array<{ label: string; icon: LucideIcon }> = [
  { label: "Autosaved", icon: Check },
  { label: "Color organized", icon: Palette },
  { label: "Easy to find", icon: Search },
];

const previewNotes = [
  {
    category: "Random Thoughts",
    date: "Today",
    title: "Tiny ideas worth keeping",
    body: "The best thoughts rarely arrive with a warning.",
    className:
      "bg-note-random border-note-random-border top-2 right-1 w-[76%] rotate-2 sm:right-5 sm:w-[68%]",
  },
  {
    category: "School",
    date: "Yesterday",
    title: "Things I want to learn",
    body: "A reading list, a question, and one brave first step.",
    className:
      "bg-note-school border-note-school-border top-32 left-0 w-[78%] -rotate-2 sm:left-5 sm:w-[70%]",
  },
  {
    category: "Personal",
    date: "Aug 2",
    title: "A gentle reminder",
    body: "Make room for the moments you want to return to.",
    className:
      "bg-note-personal border-note-personal-border right-3 bottom-1 w-[78%] rotate-1 sm:right-9 sm:w-[70%]",
  },
] as const;

export default async function Home() {
  const user = await getCurrentUser().catch(() => null);
  const primaryHref = user ? "/notes" : "/register";
  const primaryLabel = user ? "Continue to your notes" : "Start your notebook";

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto flex min-h-dvh w-full max-w-[82rem] flex-col px-5 pb-10 sm:px-8 lg:px-10"
    >
      <header className="flex min-h-16 items-center justify-between gap-4 py-2">
        <Link
          href="/"
          className="focus-visible:ring-ring/40 inline-flex items-center gap-2 rounded-full text-sm font-semibold outline-none focus-visible:ring-3"
        >
          <NotebookPen aria-hidden="true" className="text-primary size-4" />
          Turbo Notes
        </Link>
        <div className="flex items-center gap-1 sm:gap-2">
          {!user ? (
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">Sign in</Link>
            </Button>
          ) : null}
          <Button asChild size="sm" className="sm:h-10 sm:px-4">
            <Link href={primaryHref}>
              {user ? "Open notebook" : "Get started"}
            </Link>
          </Button>
        </div>
      </header>

      <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:py-14">
        <motion.section
          initial={{ y: 6 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.34 }}
          className="max-w-2xl"
        >
          <p className="text-primary text-sm font-semibold">
            A private notebook for everyday thoughts
          </p>
          <h1 className="mt-5 max-w-xl font-serif text-5xl leading-[0.96] font-semibold tracking-[-0.04em] text-balance sm:text-7xl lg:text-[5.25rem]">
            Your thoughts, in a softer place.
          </h1>
          <p className="text-muted-foreground mt-7 max-w-lg text-base leading-7 sm:text-lg sm:leading-8">
            Capture what matters, sort it by the parts of life it belongs to,
            and find it again without breaking your train of thought.
          </p>

          <Button asChild size="lg" className="mt-8">
            <Link href={primaryHref}>{primaryLabel}</Link>
          </Button>

          <ul
            aria-label="Product benefits"
            className="text-muted-foreground mt-8 flex flex-wrap gap-x-5 gap-y-3 text-sm"
          >
            {benefits.map(({ label, icon: Icon }) => (
              <li key={label} className="flex items-center gap-1.5">
                <Icon aria-hidden="true" className="text-primary size-3.5" />
                {label}
              </li>
            ))}
          </ul>
        </motion.section>

        <motion.section
          aria-label="A preview of organized notes"
          initial={{ y: 10 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.38, delay: 0.06 }}
          className="relative mx-auto h-[29rem] w-full max-w-xl sm:h-[33rem]"
        >
          <div
            aria-hidden="true"
            className="border-primary/15 bg-card/20 absolute inset-5 rounded-[2rem] border sm:inset-8"
          />
          {previewNotes.map((note) => (
            <article
              key={note.category}
              className={cn(
                "absolute min-h-52 rounded-2xl border-[3px] p-5 shadow-sm sm:min-h-56 sm:p-6",
                note.className,
              )}
            >
              <p className="text-foreground/75 flex items-center gap-2 text-xs">
                <span className="font-bold">{note.date}</span>
                <span aria-hidden="true">·</span>
                <span>{note.category}</span>
              </p>
              <h2 className="mt-4 max-w-xs font-serif text-2xl leading-tight font-semibold tracking-[-0.02em] sm:text-3xl">
                {note.title}
              </h2>
              <p className="text-foreground/80 mt-3 max-w-sm text-sm leading-6">
                {note.body}
              </p>
            </article>
          ))}
        </motion.section>
      </div>
    </main>
  );
}
