import "server-only";
import { createHmac } from "node:crypto";
import type { SessionUser } from "./auth";

export function backendToken(user: SessionUser): string {
  const secret = process.env.INTERNAL_API_KEY;
  if (!secret) throw new Error("INTERNAL_API_KEY is not configured.");
  const payload = Buffer.from(JSON.stringify({ email: user.email, role: user.role, exp: Math.floor(Date.now() / 1000) + 300 })).toString("base64url");
  return `${payload}.${createHmac("sha256", secret).update(payload).digest("base64url")}`;
}
