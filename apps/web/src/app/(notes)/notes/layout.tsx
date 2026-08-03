import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AccountBar } from "@/components/auth/account-bar";
import { getCurrentUser } from "@/lib/api/server";

export const metadata: Metadata = {
  title: {
    default: "Notes",
    template: "%s · Turbo Notes",
  },
  description: "Your private Turbo Notes notebook.",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
};

export default async function NotesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-dvh">
      <AccountBar user={user} />
      {children}
    </div>
  );
}
