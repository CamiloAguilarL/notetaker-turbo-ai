"use client";

import { apiRequest } from "@/lib/api/client";
import type { User } from "@/lib/api/types";

type Credentials = {
  email: string;
  password: string;
};

export function register(credentials: Credentials): Promise<User> {
  return apiRequest<User>("/auth/register/", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export function logIn(credentials: Credentials): Promise<User> {
  return apiRequest<User>("/auth/login/", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export function logOut(): Promise<void> {
  return apiRequest<void>("/auth/logout/", { method: "POST" });
}
