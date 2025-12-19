import { ApiError } from "./types";
import type { ApiClient, ApiClientOptions } from "./types";

function isAbsoluteUrl(url: string) {
  return /^https?:\/\//i.test(url);
}

function joinUrl(baseUrl: string, path: string) {
  if (!baseUrl) return path;
  if (isAbsoluteUrl(path)) return path;
  const base = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

async function parseBody(res: Response) {
  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) return res.json();
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export function createApi(options: ApiClientOptions = {}): ApiClient {
  const baseUrl = options.baseUrl ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
  const defaultHeaders = options.defaultHeaders ?? {};

  async function request<T>(method: string, path: string, init?: RequestInit, body?: unknown) {
    const url = joinUrl(baseUrl, path);
    const headers = new Headers(init?.headers);
    for (const [k, v] of Object.entries(defaultHeaders)) headers.set(k, v);

    const hasBody = body !== undefined && body !== null;
    if (hasBody && !headers.has("content-type")) headers.set("content-type", "application/json");

    const res = await fetch(url, {
      ...init,
      method,
      headers,
      body: hasBody ? JSON.stringify(body) : (init?.body ?? null)
    });

    if (!res.ok) {
      const bodyText = await res.text().catch(() => undefined);
      throw new ApiError({
        status: res.status,
        statusText: res.statusText,
        url,
        ...(bodyText !== undefined ? { body: bodyText } : {})
      });
    }

    return (await parseBody(res)) as T;
  }

  return {
    get: (path, init) => request("GET", path, init),
    post: (path, body, init) => request("POST", path, init, body)
  };
}
