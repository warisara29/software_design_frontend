"use client";

import Link from "next/link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import HomeWorkRoundedIcon from "@mui/icons-material/HomeWorkRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import HourglassTopRoundedIcon from "@mui/icons-material/HourglassTopRounded";
import { useAcquisitions, useContracts } from "@/lib/queries";
import { ErrorState } from "@/components/ErrorState";
import { ACQUISITION_STATUSES } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";

const StatCard = ({
  icon,
  label,
  value,
  href,
  loading,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  href: string;
  loading?: boolean;
}) => (
  <Card variant="outlined">
    <CardActionArea component={Link} href={href}>
      <CardContent>
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <Box sx={{ color: "primary.main" }}>{icon}</Box>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="overline" color="text.secondary">
              {label}
            </Typography>
            {loading ? (
              <Skeleton width={80} height={40} />
            ) : (
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                {value}
              </Typography>
            )}
          </Box>
        </Stack>
      </CardContent>
    </CardActionArea>
  </Card>
);

export default function AdminDashboard() {
  const contractsQ = useContracts();
  const acquisitionsQ = useAcquisitions();

  const contracts = contractsQ.data ?? [];
  const acquisitions = acquisitionsQ.data ?? [];

  const acqByStatus = ACQUISITION_STATUSES.map((s) => ({
    status: s,
    count: acquisitions.filter((a) => a.status === s).length,
  }));
  const pendingApprovals = acqByStatus.find((s) => s.status === "APPROVAL_REQUESTED")?.count ?? 0;

  const isLoading = contractsQ.isLoading || acquisitionsQ.isLoading;
  const anyError = contractsQ.error ?? acquisitionsQ.error;

  return (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h4" gutterBottom>
          Operations Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          ภาพรวมข้อมูลจาก Contract / Acquisition / Warranty services
        </Typography>
      </Box>

      {isLoading ? <LinearProgress /> : null}
      {anyError ? <ErrorState error={anyError} /> : null}

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            icon={<DescriptionRoundedIcon fontSize="large" />}
            label="Total Contracts"
            value={contracts.length}
            href="/admin/contracts"
            loading={contractsQ.isLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            icon={<HomeWorkRoundedIcon fontSize="large" />}
            label="Total Acquisitions"
            value={acquisitions.length}
            href="/admin/acquisitions"
            loading={acquisitionsQ.isLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            icon={<HourglassTopRoundedIcon fontSize="large" />}
            label="Pending Approvals"
            value={pendingApprovals}
            href="/admin/acquisitions?status=APPROVAL_REQUESTED"
            loading={acquisitionsQ.isLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            icon={<ShieldRoundedIcon fontSize="large" />}
            label="Warranty Lookup"
            value="→"
            href="/admin/warranty"
          />
        </Grid>
      </Grid>

      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Acquisition pipeline
          </Typography>
          <Stack spacing={1.5} sx={{ mt: 2 }}>
            {acqByStatus.map((row) => (
              <Stack key={row.status} direction="row" spacing={2} sx={{ alignItems: "center" }}>
                <Box sx={{ width: 200 }}>
                  <StatusBadge status={row.status} />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={acquisitions.length ? (row.count / acquisitions.length) * 100 : 0}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                <Typography variant="body2" sx={{ width: 32, textAlign: "right" }}>
                  {row.count}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
