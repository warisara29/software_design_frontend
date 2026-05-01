import { useQuery } from "@tanstack/react-query";
import { acquisitionApi, contractApi, warrantyApi } from "./api";
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
