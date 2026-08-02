import { ArrowUpRight, Boxes, Database, PanelsTopLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

const services = [
  {
    name: "Next.js",
    detail: "Web · :3000",
    icon: PanelsTopLeft,
    tone: "bg-note-random border-note-random-border",
    rotation: "-rotate-2",
  },
  {
    name: "Django REST",
    detail: "API · :8000",
    icon: Boxes,
    tone: "bg-note-school border-note-school-border",
    rotation: "rotate-1",
  },
  {
    name: "PostgreSQL",
    detail: "Data · :5432",
    icon: Database,
    tone: "bg-note-personal border-note-personal-border",
    rotation: "-rotate-1",
  },
] as const;

export default function Home() {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

  return (
    <main className="mx-auto grid min-h-dvh w-full max-w-6xl items-center gap-14 px-6 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
      <section className="max-w-xl">
        <p className="mb-5 font-mono text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
          Foundation checkpoint
        </p>
        <h1 className="max-w-lg font-serif text-5xl leading-[0.96] font-semibold tracking-[-0.035em] sm:text-7xl">
          The notebook is open.
        </h1>
        <p className="mt-7 max-w-lg text-base leading-7 text-muted-foreground sm:text-lg">
          Next.js, Django REST Framework, and PostgreSQL now share one local
          workflow. Product slices can start from a reproducible, tested base.
        </p>
        <Button asChild variant="outline" size="lg" className="mt-8">
          <a href={`${apiUrl}/health/`}>
            Check the API
            <ArrowUpRight aria-hidden="true" />
          </a>
        </Button>
      </section>

      <section
        aria-label="Local services"
        className="relative mx-auto w-full max-w-xl"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          {services.map(({ name, detail, icon: Icon, tone, rotation }, index) => (
            <article
              key={name}
              className={`min-h-48 border-2 p-6 shadow-[4px_5px_0_var(--foreground)] ${tone} ${rotation} ${index === 2 ? "sm:col-span-2 sm:mx-auto sm:w-[calc(50%-0.625rem)]" : ""}`}
            >
              <div className="flex items-start justify-between gap-4">
                <Icon aria-hidden="true" className="size-5" strokeWidth={1.75} />
                <span className="font-mono text-xs text-foreground/70">
                  0{index + 1}
                </span>
              </div>
              <h2 className="mt-12 font-serif text-2xl font-semibold">{name}</h2>
              <p className="mt-1 text-sm text-foreground/70">{detail}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
