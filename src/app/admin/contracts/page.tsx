"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useContracts } from "@/lib/queries";
import { StatusBadge } from "@/components/StatusBadge";
import { ErrorState } from "@/components/ErrorState";
import { formatDateTime, isUuid, shortId } from "@/lib/format";
import type { Contract } from "@/lib/types";

const columns: GridColDef<Contract>[] = [
  {
    field: "contractId",
    headerName: "Contract",
    flex: 1.2,
    minWidth: 220,
    renderCell: (p) => (
      <Link href={`/contracts/${p.value}`} style={{ fontFamily: "monospace", color: "inherit" }}>
        {shortId(p.value as string, 12)}…
      </Link>
    ),
  },
  {
    field: "status",
    headerName: "Status",
    width: 160,
    renderCell: (p) => <StatusBadge status={p.value as Contract["status"]} />,
  },
  {
    field: "customerId",
    headerName: "Customer",
    flex: 1,
    minWidth: 200,
    valueFormatter: (v) => (v ? `${shortId(String(v))}…` : "—"),
  },
  {
    field: "unitId",
    headerName: "Unit",
    flex: 1,
    minWidth: 200,
    valueFormatter: (v) => (v ? `${shortId(String(v))}…` : "—"),
  },
  {
    field: "createdAt",
    headerName: "Created",
    width: 180,
    valueFormatter: (v) => formatDateTime(v as string | undefined),
  },
];

export default function AdminContractsPage() {
  const [search, setSearch] = useState("");
  const [filterId, setFilterId] = useState<string | undefined>(undefined);

  const { data, isLoading, error, refetch } = useContracts(filterId);

  const rows = useMemo(() => (data ?? []).map((c) => ({ id: c.contractId, ...c })), [data]);

  const apply = () => {
    const v = search.trim();
    setFilterId(v && isUuid(v) ? v : undefined);
  };

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" gutterBottom>
          Contracts
        </Typography>
        <Typography variant="body1" color="text.secondary">
          ค้นหาตาม Customer ID หรือดูสัญญาทั้งหมดในระบบ
        </Typography>
      </Box>

      <Card variant="outlined">
        <CardContent>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              fullWidth
              size="small"
              label="Customer ID (UUID)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              error={search !== "" && !isUuid(search)}
              helperText={search !== "" && !isUuid(search) ? "ต้องเป็น UUID" : " "}
            />
            <Button variant="contained" onClick={apply} disabled={search !== "" && !isUuid(search)}>
              ค้นหา
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                setSearch("");
                setFilterId(undefined);
              }}
            >
              ล้าง
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {error ? <ErrorState error={error} onRetry={() => refetch()} /> : null}

      <Card variant="outlined">
        <Box sx={{ height: 600 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            loading={isLoading}
            disableRowSelectionOnClick
            initialState={{
              pagination: { paginationModel: { pageSize: 25 } },
            }}
            pageSizeOptions={[10, 25, 50]}
          />
        </Box>
      </Card>
    </Stack>
  );
}
