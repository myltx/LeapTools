export type ApiErrorInfo = {
  status: number;
  statusText: string;
  url: string;
  body?: string;
};

export class ApiError extends Error {
  public readonly info: ApiErrorInfo;

  constructor(info: ApiErrorInfo) {
    super(`[${info.status}] ${info.statusText}: ${info.url}`);
    this.name = "ApiError";
    this.info = info;
  }
}

export type ApiClientOptions = {
  baseUrl?: string;
  defaultHeaders?: Record<string, string>;
};

export type ApiClient = {
  get<T>(path: string, init?: RequestInit): Promise<T>;
  post<T>(path: string, body?: unknown, init?: RequestInit): Promise<T>;
};

