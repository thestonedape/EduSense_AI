import "server-only";
import axios from "axios";
import { getSessionUser } from "@/lib/auth";
import { backendToken } from "@/lib/backend-auth";

export const hasApiBaseUrl = Boolean(process.env.NEXT_PUBLIC_API_BASE_URL);
export const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, timeout: 180_000 });
api.interceptors.request.use(async (config) => {
  const user = await getSessionUser();
  if (!user) throw new Error("Unauthorized");
  config.headers.Authorization = `Bearer ${backendToken(user)}`;
  return config;
});
