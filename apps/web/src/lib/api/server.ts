import "server-only";

import { cookies } from "next/headers";

import type { Category, Note, User } from "@/lib/api/types";

const API_URL = process.env.API_INTERNAL_URL ?? "http://localhost:8000/api/v1";

async function serverApiRequest(path: string): Promise<Response> {
  const cookieStore = await cookies();
  return fetch(`${API_URL}${path}`, {
    headers: { Cookie: cookieStore.toString() },
    cache: "no-store",
  });
}

async function readApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`The notes service returned ${response.status}.`);
  }
  return (await response.json()) as T;
}

export async function getCurrentUser(): Promise<User | null> {
  const response = await serverApiRequest("/auth/me/");

  if (response.status === 401 || response.status === 403) return null;
  return readApiResponse<User>(response);
}

export async function getCategories(): Promise<Category[]> {
  return readApiResponse<Category[]>(await serverApiRequest("/categories/"));
}

export async function getNotes(category?: string): Promise<Note[]> {
  const query = category ? `?category=${encodeURIComponent(category)}` : "";
  return readApiResponse<Note[]>(await serverApiRequest(`/notes/${query}`));
}
