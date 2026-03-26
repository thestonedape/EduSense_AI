import { cookies } from "next/headers";

export type UserRole = "student" | "admin";

export type SessionUser = {
  name: string;
  email: string;
  role: UserRole;
};

const SESSION_COOKIE = "edusense_session";

const mockUsers: Record<UserRole, { email: string; password: string; name: string }> = {
  student: {
    email: "student@edusense.ai",
    password: "student123",
    name: "Nishant",
  },
  admin: {
    email: "admin@edusense.ai",
    password: "admin123",
    name: "Faculty Admin",
  },
};

export function authenticateUser(email: string, password: string, role: UserRole): SessionUser | null {
  const user = mockUsers[role];
  if (email.toLowerCase() !== user.email || password !== user.password) {
    return null;
  }

  return {
    name: user.name,
    email: user.email,
    role,
  };
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const raw = store.get(SESSION_COOKIE)?.value;
  if (!raw) return null;

  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export function createSessionCookie(user: SessionUser) {
  return {
    name: SESSION_COOKIE,
    value: JSON.stringify(user),
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
