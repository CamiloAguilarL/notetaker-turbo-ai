import Image from "next/image";
import Link from "next/link";

type AuthShellProps = {
  children: React.ReactNode;
  mode: "login" | "register";
};

export function AuthShell({ children, mode }: AuthShellProps) {
  const isLogin = mode === "login";

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="relative flex min-h-dvh justify-center overflow-hidden px-6 pt-[11dvh] pb-52 sm:px-10 sm:pt-[14dvh] sm:pb-60"
    >
      <section className="relative z-10 w-full max-w-sm">
        <Link
          href="/"
          className="focus-visible:ring-ring/40 text-muted-foreground mx-auto mb-10 block w-fit rounded-full text-sm font-semibold focus-visible:ring-3 focus-visible:outline-none"
        >
          Turbo Notes
        </Link>
        <div className="text-center">
          <h1 className="font-serif text-4xl leading-none font-semibold tracking-[-0.03em] text-balance sm:text-5xl">
            {isLogin ? "Yay, You’re Back!" : "Yay, New Friend!"}
          </h1>
          <div className="mt-8 text-left">{children}</div>
        </div>
      </section>

      <Image
        src="/illustrations/auth-friends.png"
        alt=""
        width={1823}
        height={863}
        priority
        className="pointer-events-none absolute bottom-0 left-1/2 h-auto w-[36rem] max-w-none -translate-x-1/2 select-none sm:w-[68rem] lg:w-[82rem]"
      />
    </main>
  );
}
