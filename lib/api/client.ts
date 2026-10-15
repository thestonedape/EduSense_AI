import axios from "axios";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const isDevelopment = process.env.NODE_ENV === "development";
const shouldLogApiTimings = isDevelopment || process.env.LOG_API_TIMINGS === "true";

export const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 180000,
});

export const hasApiBaseUrl = Boolean(apiBaseUrl);

// Share only simultaneous token requests. Do not cache resolved tokens across
// operations, so a logout or account change cannot reuse old credentials.
let inflightToken: Promise<string> | null = null;
function getBackendToken(): Promise<string> {
  if (!inflightToken) {
    inflightToken = (async () => {
      const response = await fetch("/api/auth/backend-token", { cache: "no-store" });
      if (!response.ok) throw new Error("Unauthorized");
      const body = await response.json();
      if (typeof body.token !== "string") throw new Error("Invalid backend token");
      return body.token as string;
    })().finally(() => { inflightToken = null; });
  }
  return inflightToken;
}

api.interceptors.request.use(async (config) => {
  const token = await getBackendToken();
  config.headers.Authorization = `Bearer ${token}`;
  if (shouldLogApiTimings) {
    (config as typeof config & { metadata?: { startedAt: number } }).metadata = {
      startedAt: Date.now(),
    };
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    if (shouldLogApiTimings) {
      const metadata = (response.config as typeof response.config & { metadata?: { startedAt: number } }).metadata;
      if (metadata?.startedAt) {
        const duration = Date.now() - metadata.startedAt;
        if (duration >= 250) {
          console.info(
            `[api-timing] ${response.config.method?.toUpperCase() || "GET"} ${response.config.url} ${duration}ms (${typeof window === "undefined" ? "server" : "client"})`,
          );
        }
      }
    }
    return response;
  },
  (error) => {
    if (shouldLogApiTimings && error?.config) {
      const metadata = (error.config as typeof error.config & { metadata?: { startedAt: number } }).metadata;
      if (metadata?.startedAt) {
        const duration = Date.now() - metadata.startedAt;
        console.info(
          `[api-timing] ${error.config.method?.toUpperCase() || "GET"} ${error.config.url} failed after ${duration}ms (${typeof window === "undefined" ? "server" : "client"})`,
        );
      }
    }
    return Promise.reject(error);
  },
);
