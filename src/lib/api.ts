import type { ServiceName } from "./services";
import type {
  Contract,
  Acquisition,
  AcquisitionStatus,
  Warranty,
  WarrantyClaim,
  DefectCategory,
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

const request = async <T>(
  service: ServiceName,
  path: string,
  query?: Record<string, string | undefined>,
  init?: { method?: string; body?: unknown },
): Promise<T> => {
  const url = buildUrl(service, path, query);
  const res = await fetch(url, {
    method: init?.method ?? "GET",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: init?.body !== undefined ? JSON.stringify(init.body) : undefined,
  });
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

export interface BookingConfirmedPayload {
  bookingId: string;
  unitId: string;
  customerId: string;
}
export interface PropertySurveyedPayload {
  surveyId: string;
  propertyId: string;
  address?: string;
  areaSqm?: number;
  estimatedValue?: number;
  zoneType?: string;
  sellerId?: string;
  sellerName?: string;
  sellerContact?: string;
}
export interface AcquisitionApprovedPayload {
  acquisitionId: string;
  approvedPrice?: number;
  approvedBy?: string;
}
export interface WarrantyRegisteredPayload {
  contractId: string;
  unitId: string;
  customerId: string;
  startsAt: string;
  endsAt: string;
  coveredCategories?: DefectCategory[];
}
export interface DefectReportedPayload {
  defectId: string;
  contractId: string;
  unitId: string;
  customerId: string;
  defectCategory: DefectCategory;
  description?: string;
  reportedAt?: string;
}

export const triggerApi = {
  bookingConfirmed: (body: BookingConfirmedPayload) =>
    request<unknown>("contract", "/api/inbound/booking-confirmed", undefined, { method: "POST", body }),
  propertySurveyed: (body: PropertySurveyedPayload) =>
    request<unknown>("acquisition", "/api/inbound/property-surveyed", undefined, { method: "POST", body }),
  acquisitionApproved: (body: AcquisitionApprovedPayload) =>
    request<unknown>("acquisition", "/api/inbound/acquisition-approved", undefined, { method: "POST", body }),
  warrantyRegistered: (body: WarrantyRegisteredPayload) =>
    request<unknown>("warranty", "/api/inbound/warranty-registered", undefined, { method: "POST", body }),
  defectReported: (body: DefectReportedPayload) =>
    request<unknown>("warranty", "/api/inbound/defect-reported", undefined, { method: "POST", body }),
};

export const healthApi = {
  contract: () => request<{ status?: string; service?: string }>("contract", "/health"),
  acquisition: () => request<{ status?: string; service?: string }>("acquisition", "/health"),
  warranty: () => request<{ status?: string; service?: string }>("warranty", "/health"),
};
