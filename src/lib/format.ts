export const shortId = (id: string | undefined | null, len = 8): string => {
  if (!id) return "—";
  return id.slice(0, len);
};

export const formatDateTime = (iso: string | undefined | null): string => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatDate = (iso: string | undefined | null): string => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const daysUntil = (iso: string | undefined | null): number | null => {
  if (!iso) return null;
  const target = new Date(iso).getTime();
  if (Number.isNaN(target)) return null;
  const diff = target - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export const formatCurrency = (n: number | undefined | null): string => {
  if (n == null) return "—";
  return n.toLocaleString(undefined, { style: "currency", currency: "THB", maximumFractionDigits: 0 });
};

export const isUuid = (s: string): boolean =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s.trim());

const THAI_MONTHS = [
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม",
];

export const thaiDateParts = (iso: string | undefined | null): { day: string; month: string; year: string } | null => {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return {
    day: String(d.getDate()),
    month: THAI_MONTHS[d.getMonth()],
    year: String(d.getFullYear() + 543),
  };
};

export const formatThaiDate = (iso: string | undefined | null): string => {
  const p = thaiDateParts(iso);
  return p ? `${p.day} ${p.month} ${p.year}` : "—";
};

export const addDays = (iso: string | undefined | null, days: number): string | null => {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  d.setDate(d.getDate() + days);
  return d.toISOString();
};

export const randomUuid = (): string => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
