import { redirect } from "next/navigation";

import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";
import { getCurrentUser } from "@/lib/api/server";

export default async function RegisterPage() {
  if (await getCurrentUser()) redirect("/notes");

  return (
    <AuthShell mode="register">
      <AuthForm mode="register" />
    </AuthShell>
  );
}
