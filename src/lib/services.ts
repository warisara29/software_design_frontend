export const SERVICE_URLS = {
  contract: "https://contract-service-h5fs.onrender.com",
  acquisition: "https://acquisition-service.onrender.com",
  warranty: "https://warranty-service-gtv0.onrender.com",
} as const;

export type ServiceName = keyof typeof SERVICE_URLS;

export const isServiceName = (v: string): v is ServiceName =>
  Object.prototype.hasOwnProperty.call(SERVICE_URLS, v);

export const SAMPLE_CUSTOMER_IDS = [
  "db2599b3-c530-4626-8ee2-1c1490675275",
  "dce313fa-c4c2-47c3-8585-58cef56905a3",
  "5118cc44-6611-42a2-98ba-5cd457aca7de",
] as const;
