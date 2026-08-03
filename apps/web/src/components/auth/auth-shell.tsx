import Image from "next/image";

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
      data-auth-mode={mode}
      className="pt-auth-top font-auth flex min-h-dvh justify-center overflow-x-hidden px-6 pb-16"
    >
      <section className="max-w-auth w-full text-center">
        <div className="h-auth-art-stage flex items-start justify-center">
          <Image
            data-slot="auth-illustration"
            src={
              isLogin
                ? "/illustrations/auth-cactus.png"
                : "/illustrations/auth-cat.png"
            }
            alt=""
            width={isLogin ? 243 : 290}
            height={isLogin ? 290 : 207}
            priority
            unoptimized
            className={
              isLogin
                ? "w-auth-login-art mt-px h-auto select-none"
                : "w-auth-register-art h-auto select-none"
            }
          />
        </div>
        <h1 className="text-auth-ink mt-auth-heading-gap sm:text-auth-title relative left-1/2 w-max -translate-x-1/2 font-serif text-4xl font-bold whitespace-nowrap">
          {isLogin ? "Yay, You're Back!" : "Yay, New Friend!"}
        </h1>
        <div className="mt-auth-form-gap text-left">{children}</div>
      </section>
    </main>
  );
}
