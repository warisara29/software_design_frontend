import { NextRequest } from "next/server";
import { SERVICE_URLS, isServiceName } from "@/lib/services";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RETRY_DELAY_MS = 2000;
const MAX_ATTEMPTS = 3;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const proxy = async (req: NextRequest, ctx: { params: Promise<{ service: string; path: string[] }> }) => {
  const { service, path } = await ctx.params;
  if (!isServiceName(service)) {
    return Response.json({ error: `unknown service: ${service}` }, { status: 400 });
  }
  const upstreamBase = SERVICE_URLS[service];
  const upstreamUrl = new URL(`${upstreamBase}/${path.join("/")}`);
  for (const [k, v] of req.nextUrl.searchParams.entries()) {
    upstreamUrl.searchParams.set(k, v);
  }

  const init: RequestInit = {
    method: req.method,
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    cache: "no-store",
  };
  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = await req.text();
  }

  let lastError: unknown = null;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const res = await fetch(upstreamUrl.toString(), init);
      const text = await res.text();
      return new Response(text, {
        status: res.status,
        headers: {
          "Content-Type": res.headers.get("Content-Type") ?? "application/json",
          "X-Proxy-Attempt": String(attempt),
        },
      });
    } catch (err) {
      lastError = err;
      if (attempt < MAX_ATTEMPTS) await sleep(RETRY_DELAY_MS * attempt);
    }
  }
  return Response.json(
    {
      error: "upstream unreachable",
      detail: lastError instanceof Error ? lastError.message : String(lastError),
    },
    { status: 502 },
  );
};

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
