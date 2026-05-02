import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  acquisitionApi,
  contractApi,
  healthApi,
  triggerApi,
  warrantyApi,
  type DefectReportedPayload,
  type BookingConfirmedPayload,
  type PropertySurveyedPayload,
  type AcquisitionApprovedPayload,
  type WarrantyRegisteredPayload,
} from "./api";
import type { AcquisitionStatus } from "./types";

export const useContracts = (customerId?: string) =>
  useQuery({
    queryKey: ["contracts", { customerId: customerId ?? null }],
    queryFn: () => contractApi.list(customerId),
  });

export const useContract = (id: string | undefined) =>
  useQuery({
    queryKey: ["contract", id],
    queryFn: () => contractApi.get(id!),
    enabled: Boolean(id),
  });

export const useAcquisitions = (status?: AcquisitionStatus) =>
  useQuery({
    queryKey: ["acquisitions", { status: status ?? null }],
    queryFn: () => acquisitionApi.list(status),
  });

export const useAcquisition = (id: string | undefined) =>
  useQuery({
    queryKey: ["acquisition", id],
    queryFn: () => acquisitionApi.get(id!),
    enabled: Boolean(id),
  });

export const useWarrantyByContract = (contractId: string | undefined) =>
  useQuery({
    queryKey: ["warranty", contractId],
    queryFn: () => warrantyApi.getByContract(contractId!),
    enabled: Boolean(contractId),
    retry: 1,
  });

export const useReportDefect = (contractId: string | undefined) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: DefectReportedPayload) => triggerApi.defectReported(payload),
    onSuccess: () => {
      if (contractId) qc.invalidateQueries({ queryKey: ["warranty", contractId] });
    },
  });
};

const invalidateAll = (qc: ReturnType<typeof useQueryClient>) => {
  qc.invalidateQueries({ queryKey: ["contracts"] });
  qc.invalidateQueries({ queryKey: ["acquisitions"] });
};

export const useTriggerBooking = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: BookingConfirmedPayload) => triggerApi.bookingConfirmed(p),
    onSuccess: () => invalidateAll(qc),
  });
};

export const useTriggerSurvey = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: PropertySurveyedPayload) => triggerApi.propertySurveyed(p),
    onSuccess: () => invalidateAll(qc),
  });
};

export const useTriggerApproval = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: AcquisitionApprovedPayload) => triggerApi.acquisitionApproved(p),
    onSuccess: () => invalidateAll(qc),
  });
};

export const useTriggerWarranty = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: WarrantyRegisteredPayload) => triggerApi.warrantyRegistered(p),
    onSuccess: () => invalidateAll(qc),
  });
};

export const useHealthAll = () =>
  useQuery({
    queryKey: ["health-all"],
    queryFn: async () => {
      const [contract, acquisition, warranty] = await Promise.allSettled([
        healthApi.contract(),
        healthApi.acquisition(),
        healthApi.warranty(),
      ]);
      return {
        contract: contract.status === "fulfilled",
        acquisition: acquisition.status === "fulfilled",
        warranty: warranty.status === "fulfilled",
      };
    },
    refetchInterval: 60_000,
    staleTime: 30_000,
  });
