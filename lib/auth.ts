import { cookies } from "next/headers";
import { cache } from "react";

export type UserRole = "student" | "admin";

export type SessionUser = {
  name: string;
  email: string;
  role: UserRole;
};

const SESSION_COOKIE = "edusense_session";

type SupabaseAuthUser = {
  email?: string | null;
  app_metadata?: Record<string, unknown> | null;
  user_metadata?: Record<string, unknown> | null;
};

type SupabaseAuthPayload = {
  user?: SupabaseAuthUser | null;
  session?: { access_token?: string | null } | null;
  error_description?: string;
  msg?: string;
  code?: string;
};

function base64UrlEncode(value: string): string {
  return Buffer.from(value, "utf-8").toString("base64url");
}

function base64UrlDecode(value: string): string {
  return Buffer.from(value, "base64url").toString("utf-8");
}

function authSecret(): string {
  const value = process.env.AUTH_SECRET || "dev-auth-secret-change-me";
  if (process.env.NODE_ENV === "production" && value === "dev-auth-secret-change-me") {
    throw new Error("AUTH_SECRET must be configured in production.");
  }
  return value;
}

function supabaseUrl(): string {
  return (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim();
}

function supabaseAnonKey(): string {
  return (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim();
}

function parseEmailList(value: string | undefined): Set<string> {
  return new Set(
    (value || "")
      .split(",")
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean),
  );
}

function resolveRole(user: SupabaseAuthUser): UserRole {
  const email = String(user.email || "").trim().toLowerCase();
  const appRole = typeof user.app_metadata?.role === "string" ? user.app_metadata.role : null;
  const userRole = typeof user.user_metadata?.role === "string" ? user.user_metadata.role : null;
  const normalizedMetadataRole = (appRole || userRole || "").trim().toLowerCase();
  if (normalizedMetadataRole === "admin" || normalizedMetadataRole === "student") {
    return normalizedMetadataRole;
  }

  const adminEmails = parseEmailList(process.env.ADMIN_ALLOWED_EMAILS);
  if (adminEmails.has(email)) {
    return "admin";
  }

  return "student";
}

function resolveDisplayName(user: SupabaseAuthUser): string {
  const fromMetadata =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.user_metadata?.display_name;
  if (typeof fromMetadata === "string" && fromMetadata.trim()) {
    return fromMetadata.trim();
  }
  const email = String(user.email || "").trim();
  if (email) {
    return email.split("@")[0];
  }
  return "EduSense User";
}

async function signValue(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(authSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return Buffer.from(signature).toString("base64url");
}

export async function authenticateUser(
  email: string,
  password: string,
  requestedRole: UserRole,
): Promise<{ user: SessionUser | null; message?: string }> {
  if (!supabaseUrl() || !supabaseAnonKey()) {
    return {
      user: null,
      message: "Supabase Auth is not configured yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    };
  }

  const response = await fetch(`${supabaseUrl()}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: supabaseAnonKey(),
    },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });

  const payload = (await response.json().catch(() => null)) as SupabaseAuthPayload | null;

  if (!response.ok || !payload?.user) {
    return {
      user: null,
      message: payload?.error_description || payload?.msg || "Invalid email or password.",
    };
  }

  const actualRole = resolveRole(payload.user);
  if (requestedRole === "admin" && actualRole !== "admin") {
    return {
      user: null,
      message: "This account is not allowed to access the admin portal.",
    };
  }

  return {
    user: {
      name: resolveDisplayName(payload.user),
      email: String(payload.user.email || email).trim().toLowerCase(),
      role: actualRole,
    },
  };
}

export async function registerStudent(email: string, password: string): Promise<{ user: SessionUser | null; message?: string }> {
  const response = await fetch(`${supabaseUrl()}/auth/v1/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: supabaseAnonKey(),
    },
    body: JSON.stringify({
      email,
      password,
      data: { role: "student" },
    }),
    cache: "no-store",
  });

  const payload = (await response.json().catch(() => null)) as SupabaseAuthPayload | null;

  if (!response.ok || !payload?.user) {
    return {
      user: null,
      message: payload?.error_description || payload?.msg || "Student sign-up failed.",
    };
  }

  const emailAddress = String(payload.user.email || email).trim().toLowerCase();
  const sessionUser: SessionUser = {
    name: resolveDisplayName(payload.user),
    email: emailAddress,
    role: "student",
  };

  if (payload.session?.access_token) {
    return { user: sessionUser };
  }

  return {
    user: null,
    message: "Student account created. Confirm the email in Supabase, then sign in again.",
  };
}

export async function encodeSession(user: SessionUser): Promise<string> {
  const payload = base64UrlEncode(JSON.stringify(user));
  const signature = await signValue(payload);
  return `${payload}.${signature}`;
}

export async function decodeSession(raw: string | undefined): Promise<SessionUser | null> {
  if (!raw) return null;
  const [payload, signature] = raw.split(".");
  if (!payload || !signature) return null;

  const expectedSignature = await signValue(payload);
  if (signature !== expectedSignature) {
    return null;
  }

  try {
    return JSON.parse(base64UrlDecode(payload)) as SessionUser;
  } catch {
    return null;
  }
}

export const getSessionUser = cache(async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const raw = store.get(SESSION_COOKIE)?.value;
  return decodeSession(raw);
});

export async function createSessionCookie(user: SessionUser) {
  return {
    name: SESSION_COOKIE,
    value: await encodeSession(user),
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  };
}

export const authPaths = {
  studentLogin: "/login",
  adminLogin: "/admin/login",
};
