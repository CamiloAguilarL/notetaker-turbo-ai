import "server-only";

import { cookies } from "next/headers";

import type { User } from "@/lib/api/types";

const API_URL = process.env.API_INTERNAL_URL ?? "http://localhost:8000/api/v1";

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const response = await fetch(`${API_URL}/auth/me/`, {
    headers: { Cookie: cookieStore.toString() },
    cache: "no-store",
  });

  if (response.status === 401 || response.status === 403) return null;
  if (!response.ok) {
    throw new Error(`Unable to load the current user (${response.status}).`);
  }
  return (await response.json()) as User;
}
