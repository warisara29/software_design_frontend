"use client";

import Chip, { type ChipProps } from "@mui/material/Chip";
import type {
  AcquisitionStatus,
  ContractStatus,
  CoverageStatus,
} from "@/lib/types";

type AnyStatus = ContractStatus | AcquisitionStatus | CoverageStatus;

const COLORS: Record<AnyStatus, ChipProps["color"]> = {
  // Contract
  DRAFT: "default",
  PENDING_SIGN: "warning",
  SIGNED: "success",
  CANCELLED: "error",
  // Acquisition
  SURVEYED: "info",
  APPROVAL_REQUESTED: "warning",
  APPROVED: "success",
  CONTRACT_DRAFTED: "primary",
  REJECTED: "error",
  // Coverage
  PENDING: "warning",
  COVERED: "success",
};

export const StatusBadge = ({ status, size = "small" }: { status: AnyStatus | undefined; size?: ChipProps["size"] }) => {
  if (!status) return <Chip size={size} label="—" />;
  return (
    <Chip
      size={size}
      label={status.replace(/_/g, " ")}
      color={COLORS[status] ?? "default"}
      variant={COLORS[status] === "default" ? "outlined" : "filled"}
      sx={{ fontWeight: 600, letterSpacing: 0.3 }}
    />
  );
};
