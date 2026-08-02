"use client";

import type { ApiErrorBody } from "@/lib/api/types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly fields: Record<string, string[] | string>;

  constructor(status: number, body: ApiErrorBody) {
    super(body.error?.message ?? "The request could not be completed.");
    this.name = "ApiError";
    this.status = status;
    this.code = body.error?.code ?? "request_error";
    this.fields = body.error?.fields ?? {};
  }

  fieldMessage(name: string): string | undefined {
    const value = this.fields[name];
    return Array.isArray(value) ? value[0] : value;
  }
}

function readCookie(name: string): string | undefined {
  const prefix = `${encodeURIComponent(name)}=`;
  const cookie = document.cookie
    .split(";")
    .map((value) => value.trim())
    .find((value) => value.startsWith(prefix));

  return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : undefined;
}

async function csrfToken(): Promise<string> {
  let token = readCookie("csrftoken");
  if (token) return token;

  const response = await fetch(`${API_URL}/auth/csrf/`, {
    credentials: "include",
    cache: "no-store",
  });
  if (!response.ok) {
    throw new ApiError(
      response.status,
      (await response.json()) as ApiErrorBody,
    );
  }

  token = readCookie("csrftoken");
  if (!token) {
    throw new Error("The CSRF cookie was not issued by the API.");
  }
  return token;
}

function isUnsafe(method: string): boolean {
  return !["GET", "HEAD", "OPTIONS"].includes(method.toUpperCase());
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const method = init.method ?? "GET";
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (isUnsafe(method)) {
    headers.set("X-CSRFToken", await csrfToken());
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    method,
    headers,
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as ApiErrorBody;
    throw new ApiError(response.status, body);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}
