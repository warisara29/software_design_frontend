import type { ServiceName } from "./services";
import type {
  Contract,
  Acquisition,
  AcquisitionStatus,
  Warranty,
  WarrantyClaim,
} from "./types";

const PROXY_PREFIX = "/api/proxy";

export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, body: unknown, message: string) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

const buildUrl = (service: ServiceName, path: string, query?: Record<string, string | undefined>) => {
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  const url = new URL(`${PROXY_PREFIX}/${service}/${cleanPath}`, getOrigin());
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== "") url.searchParams.set(k, v);
    }
  }
  return url.toString().replace(getOrigin(), "");
};

const getOrigin = () => {
  if (typeof window !== "undefined") return window.location.origin;
  return "http://localhost";
};

const request = async <T>(service: ServiceName, path: string, query?: Record<string, string | undefined>): Promise<T> => {
  const url = buildUrl(service, path, query);
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  const text = await res.text();
  let body: unknown = undefined;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }
  if (!res.ok) {
    const msg = typeof body === "object" && body && "error" in body ? String((body as { error?: unknown }).error) : `HTTP ${res.status}`;
    throw new ApiError(res.status, body, msg);
  }
  return body as T;
};

export const contractApi = {
  list: (customerId?: string) =>
    request<Contract[]>("contract", "/api/contracts", { customerId }),
  get: (id: string) => request<Contract>("contract", `/api/contracts/${id}`),
};

export const acquisitionApi = {
  list: (status?: AcquisitionStatus) =>
    request<Acquisition[]>("acquisition", "/api/acquisitions", { status }),
  get: (id: string) => request<Acquisition>("acquisition", `/api/acquisitions/${id}`),
};

export const warrantyApi = {
  getByContract: (contractId: string) =>
    request<Warranty>("warranty", `/api/warranties/${contractId}`),
  listClaims: (warrantyId: string) =>
    request<WarrantyClaim[]>("warranty", `/api/warranties/${warrantyId}/claims`),
};
