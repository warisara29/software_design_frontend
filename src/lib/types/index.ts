import type { components as ContractComponents } from "./contract";
import type { components as AcquisitionComponents } from "./acquisition";
import type { components as WarrantyComponents } from "./warranty";

export type Contract = ContractComponents["schemas"]["ContractView"];
export type ContractStatus = NonNullable<Contract["status"]>;

export type Acquisition = AcquisitionComponents["schemas"]["AcquisitionView"];
export type AcquisitionStatus = AcquisitionComponents["schemas"]["AcquisitionStatus"];

export type Warranty = WarrantyComponents["schemas"]["WarrantyView"];
export type WarrantyClaim = WarrantyComponents["schemas"]["WarrantyClaimView"];
export type DefectCategory = WarrantyComponents["schemas"]["DefectCategory"];
export type CoverageStatus = WarrantyComponents["schemas"]["CoverageStatus"];

export const CONTRACT_STATUSES: ContractStatus[] = [
  "DRAFT",
  "PENDING_SIGN",
  "SIGNED",
  "CANCELLED",
];

export const ACQUISITION_STATUSES: AcquisitionStatus[] = [
  "SURVEYED",
  "APPROVAL_REQUESTED",
  "APPROVED",
  "CONTRACT_DRAFTED",
  "REJECTED",
];

export const COVERAGE_STATUSES: CoverageStatus[] = ["PENDING", "COVERED", "REJECTED"];

export const DEFECT_CATEGORIES: DefectCategory[] = [
  "STRUCTURAL",
  "ELECTRICAL",
  "PLUMBING",
  "FINISHING",
  "APPLIANCE",
  "OTHER",
];
