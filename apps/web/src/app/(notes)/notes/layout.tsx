import { redirect } from "next/navigation";

import { AccountBar } from "@/components/auth/account-bar";
import { getCurrentUser } from "@/lib/api/server";

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
