import { createApi } from "@my-app/api";
import { headers } from "next/headers";

export async function HealthCard() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  const baseUrl = host ? `${proto}://${host}` : "";

  const api = createApi({ baseUrl });
  const data = await api.get<{ ok: boolean; now: string }>("/api/health", { cache: "no-store" });

  return (
    <div className="stack">
      <div className="muted">ok：{String(data.ok)}</div>
      <div className="muted">now：{data.now}</div>
    </div>
  );
}
