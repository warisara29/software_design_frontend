"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useAcquisitions } from "@/lib/queries";
import { StatusBadge } from "@/components/StatusBadge";
import { ErrorState } from "@/components/ErrorState";
import { ACQUISITION_STATUSES, type Acquisition, type AcquisitionStatus } from "@/lib/types";
import { formatCurrency, formatDateTime, shortId } from "@/lib/format";

const columns: GridColDef<Acquisition>[] = [
  {
    field: "acquisitionId",
    headerName: "Acquisition",
    flex: 1.1,
    minWidth: 200,
    valueFormatter: (v) => (v ? `${shortId(String(v))}…` : "—"),
  },
  {
    field: "status",
    headerName: "Status",
    width: 200,
    renderCell: (p) => <StatusBadge status={p.value as AcquisitionStatus} />,
  },
  { field: "address", headerName: "Address", flex: 1.5, minWidth: 200 },
  {
    field: "areaSqm",
    headerName: "Area (sqm)",
    width: 120,
    valueFormatter: (v: unknown) => (typeof v === "number" ? v.toLocaleString() : "—"),
  },
  {
    field: "estimatedValue",
    headerName: "Est. Value",
    width: 160,
    valueFormatter: (v: unknown) => formatCurrency(typeof v === "number" ? v : null),
  },
  { field: "zoneType", headerName: "Zone", width: 120 },
  {
    field: "createdAt",
    headerName: "Created",
    width: 180,
    valueFormatter: (v) => formatDateTime(v as string | undefined),
  },
];

const Field = ({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) => (
  <Box>
    <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 1 }}>
      {label}
    </Typography>
    <Typography variant="body2" sx={mono ? { fontFamily: "monospace" } : undefined}>
      {value ?? "—"}
    </Typography>
  </Box>
);

const Inner = () => {
  const router = useRouter();
  const params = useSearchParams();
  const statusParam = params.get("status");
  const status = statusParam && (ACQUISITION_STATUSES as readonly string[]).includes(statusParam)
    ? (statusParam as AcquisitionStatus)
    : undefined;

  const { data, isLoading, error, refetch } = useAcquisitions(status);
  const [selected, setSelected] = useState<Acquisition | null>(null);

  const rows = useMemo(() => (data ?? []).map((a) => ({ id: a.acquisitionId, ...a })), [data]);

  const setStatus = (s: AcquisitionStatus | undefined) => {
    const next = new URLSearchParams();
    if (s) next.set("status", s);
    router.push(`/admin/acquisitions${next.toString() ? `?${next}` : ""}`);
  };

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" gutterBottom>
          Acquisitions
        </Typography>
        <Typography variant="body1" color="text.secondary">
          คลิก row เพื่อดู willingContract และข้อมูลเต็ม
        </Typography>
      </Box>

      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
        <Chip
          label="ทั้งหมด"
          color={!status ? "primary" : "default"}
          variant={!status ? "filled" : "outlined"}
          onClick={() => setStatus(undefined)}
        />
        {ACQUISITION_STATUSES.map((s) => (
          <Chip
            key={s}
            label={s.replace(/_/g, " ")}
            color={status === s ? "primary" : "default"}
            variant={status === s ? "filled" : "outlined"}
            onClick={() => setStatus(s)}
          />
        ))}
      </Stack>

      {error ? <ErrorState error={error} onRetry={() => refetch()} /> : null}

      <Card variant="outlined">
        <Box sx={{ height: 600 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            loading={isLoading}
            onRowClick={(p) => setSelected(p.row as Acquisition)}
            sx={{ "& .MuiDataGrid-row": { cursor: "pointer" } }}
            initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
            pageSizeOptions={[10, 25, 50]}
          />
        </Box>
      </Card>

      <Drawer anchor="right" open={Boolean(selected)} onClose={() => setSelected(null)}>
        <Box sx={{ width: { xs: "100vw", sm: 480 }, p: 3 }}>
          <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="h6">Acquisition Detail</Typography>
            <IconButton onClick={() => setSelected(null)}>
              <CloseRoundedIcon />
            </IconButton>
          </Stack>
          <Divider sx={{ my: 2 }} />
          {selected ? (
            <Stack spacing={2}>
              <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                <StatusBadge status={selected.status} />
                <Typography variant="body2" color="text.secondary">
                  สร้างเมื่อ {formatDateTime(selected.createdAt)}
                </Typography>
              </Stack>
              <Grid container spacing={2}>
                <Grid size={12}>
                  <Field label="Acquisition ID" value={selected.acquisitionId} mono />
                </Grid>
                <Grid size={6}>
                  <Field label="Property ID" value={selected.propertyId} mono />
                </Grid>
                <Grid size={6}>
                  <Field label="Survey ID" value={selected.surveyId} mono />
                </Grid>
                <Grid size={12}>
                  <Field label="Address" value={selected.address} />
                </Grid>
                <Grid size={6}>
                  <Field label="Area" value={selected.areaSqm ? `${selected.areaSqm} sqm` : "—"} />
                </Grid>
                <Grid size={6}>
                  <Field label="Zone" value={selected.zoneType} />
                </Grid>
                <Grid size={6}>
                  <Field label="Est. Value" value={formatCurrency(selected.estimatedValue ?? null)} />
                </Grid>
                <Grid size={6}>
                  <Field label="Approved" value={selected.approvedAt ? formatDateTime(selected.approvedAt) : "—"} />
                </Grid>
                <Grid size={12}>
                  <Field label="Seller" value={selected.sellerName ?? selected.sellerId} />
                </Grid>
              </Grid>

              {selected.willingContract ? (
                <Card variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="overline" color="text.secondary">
                    Willing Contract
                  </Typography>
                  <Stack spacing={1} sx={{ mt: 1 }}>
                    <Field label="Willing Contract ID" value={selected.willingContract.willingContractId} mono />
                    <Field label="Agreed Price" value={formatCurrency(selected.willingContract.agreedPrice)} />
                    <Field label="Drafted At" value={formatDateTime(selected.willingContract.draftedAt)} />
                    <Button
                      variant="contained"
                      endIcon={<OpenInNewRoundedIcon />}
                      component="a"
                      href={selected.willingContract.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      disabled={!selected.willingContract.fileUrl}
                    >
                      ดู PDF
                    </Button>
                  </Stack>
                </Card>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  ยังไม่มี willing contract
                </Typography>
              )}
            </Stack>
          ) : null}
        </Box>
      </Drawer>
    </Stack>
  );
};

export default function AdminAcquisitionsPage() {
  return (
    <Suspense fallback={<Box sx={{ p: 4 }} />}>
      <Inner />
    </Suspense>
  );
}
