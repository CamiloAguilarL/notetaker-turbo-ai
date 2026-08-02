import Link from "next/link";
import { NotebookPen, Sparkles } from "lucide-react";

type AuthShellProps = {
  children: React.ReactNode;
  mode: "login" | "register";
};

export function AuthShell({ children, mode }: AuthShellProps) {
  const isLogin = mode === "login";

  return (
    <main className="grid min-h-dvh lg:grid-cols-[minmax(0,1fr)_minmax(30rem,0.82fr)]">
      <section className="border-foreground/80 bg-note-school relative hidden overflow-hidden border-r-2 p-12 lg:flex lg:flex-col lg:justify-between">
        <Link
          href="/"
          className="focus-visible:ring-ring/50 inline-flex w-fit items-center gap-3 rounded-full text-sm font-bold tracking-tight focus-visible:ring-3 focus-visible:outline-none"
        >
          <span className="border-foreground bg-card grid size-10 place-items-center rounded-full border-2 shadow-[2px_3px_0_var(--foreground)]">
            <NotebookPen aria-hidden="true" className="size-5" />
          </span>
          Turbo Notes
        </Link>

        <div className="relative mx-auto w-full max-w-lg py-16">
          <div className="border-note-personal-border bg-note-personal absolute top-0 right-2 w-64 rotate-3 border-2 p-6 shadow-[5px_6px_0_var(--foreground)]">
            <p className="font-mono text-[0.65rem] tracking-[0.16em] uppercase">
              Personal
            </p>
            <p className="mt-14 font-serif text-3xl leading-tight font-semibold">
              Keep the thought before it wanders off.
            </p>
          </div>
          <div className="border-note-random-border bg-note-random relative mt-20 w-72 -rotate-2 border-2 p-6 shadow-[5px_6px_0_var(--foreground)]">
            <Sparkles aria-hidden="true" className="size-5" />
            <p className="mt-16 font-serif text-3xl leading-tight font-semibold">
              Ideas belong somewhere warm and easy to find.
            </p>
          </div>
        </div>

        <p className="text-foreground/70 max-w-sm text-sm leading-6">
          A private, focused notebook for the things worth returning to.
        </p>
      </section>

      <section className="flex min-h-dvh items-center justify-center px-6 py-12 sm:px-10 lg:px-16">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="mb-14 inline-flex items-center gap-2 font-semibold lg:hidden"
          >
            <NotebookPen aria-hidden="true" className="size-5" />
            Turbo Notes
          </Link>
          <p className="text-muted-foreground font-mono text-xs font-semibold tracking-[0.18em] uppercase">
            {isLogin ? "Welcome back" : "A fresh page"}
          </p>
          <h1 className="mt-4 font-serif text-5xl leading-none font-semibold tracking-[-0.035em] sm:text-6xl">
            {isLogin ? "Yay, You’re Back!" : "Yay, New Friend!"}
          </h1>
          <p className="text-muted-foreground mt-5 max-w-sm leading-7">
            {isLogin
              ? "Sign in and pick up exactly where your last thought left off."
              : "Create your private notebook and give every thought a place."}
          </p>
          <div className="mt-10">{children}</div>
        </div>
      </section>
    </main>
  );
}
