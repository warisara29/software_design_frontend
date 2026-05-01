"use client";

import { use } from "react";
import Link from "next/link";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import LinearProgress from "@mui/material/LinearProgress";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { AppShell } from "@/components/AppShell";
import { ErrorState } from "@/components/ErrorState";
import { StatusBadge } from "@/components/StatusBadge";
import { useWarrantyByContract } from "@/lib/queries";
import { daysUntil, formatDate, formatDateTime, shortId } from "@/lib/format";

const Inner = ({ contractId }: { contractId: string }) => {
  const { data: warranty, isLoading, error, refetch } = useWarrantyByContract(contractId);

  if (isLoading) {
    return (
      <Stack spacing={2}>
        <Skeleton variant="rounded" height={140} />
        <Skeleton variant="rounded" height={200} />
      </Stack>
    );
  }
  if (error) return <ErrorState error={error} onRetry={() => refetch()} />;
  if (!warranty) return <ErrorState error={new Error("Warranty not found")} />;

  const remaining = daysUntil(warranty.coverageEndsAt);
  const total = warranty.coverageStartsAt && warranty.coverageEndsAt
    ? Math.max(1, Math.round((new Date(warranty.coverageEndsAt).getTime() - new Date(warranty.coverageStartsAt).getTime()) / 86_400_000))
    : null;
  const elapsed = total != null && remaining != null ? Math.max(0, total - remaining) : null;
  const percentDone = total && elapsed != null ? Math.min(100, Math.round((elapsed / total) * 100)) : 0;

  const claims = warranty.claims ?? [];

  return (
    <Stack spacing={3}>
      <Button component={Link} href={`/contracts/${contractId}`} startIcon={<ArrowBackRoundedIcon />} sx={{ alignSelf: "flex-start" }}>
        กลับไปยังสัญญา
      </Button>

      <Card variant="outlined">
        <CardContent>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ justifyContent: "space-between" }}>
            <Box>
              <Typography variant="overline" color="text.secondary">
                Warranty
              </Typography>
              <Typography variant="h4" sx={{ fontFamily: "monospace" }}>
                {shortId(warranty.warrantyId, 12)}…
              </Typography>
              <Typography variant="caption" color="text.secondary">
                จดทะเบียนเมื่อ {formatDateTime(warranty.registeredAt)}
              </Typography>
            </Box>
            <Box sx={{ textAlign: { sm: "right" } }}>
              <Typography variant="overline" color="text.secondary">
                เหลือเวลาคุ้มครอง
              </Typography>
              <Typography variant="h3" color={remaining != null && remaining < 30 ? "warning.main" : "success.main"}>
                {remaining != null && remaining > 0 ? `${remaining} วัน` : "หมดอายุแล้ว"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatDate(warranty.coverageStartsAt)} → {formatDate(warranty.coverageEndsAt)}
              </Typography>
            </Box>
          </Stack>
          {total ? (
            <Box sx={{ mt: 2 }}>
              <LinearProgress variant="determinate" value={percentDone} sx={{ height: 8, borderRadius: 4 }} />
            </Box>
          ) : null}
        </CardContent>
      </Card>

      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            หมวดที่ครอบคลุม
          </Typography>
          <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
            {(warranty.coveredCategories ?? []).map((cat) => (
              <Chip key={cat} label={cat} color="secondary" variant="outlined" />
            ))}
            {!warranty.coveredCategories?.length ? (
              <Typography variant="body2" color="text.secondary">
                ไม่มีข้อมูลหมวด
              </Typography>
            ) : null}
          </Stack>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" color="text.secondary">
                Contract ID
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                {warranty.contractId}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" color="text.secondary">
                Unit ID
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                {warranty.unitId}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Claims ({claims.length})
          </Typography>
          {claims.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              ยังไม่มี claim สำหรับ warranty นี้
            </Typography>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Claim</TableCell>
                    <TableCell>หมวด</TableCell>
                    <TableCell>รายละเอียด</TableCell>
                    <TableCell>รายงานเมื่อ</TableCell>
                    <TableCell>สถานะ</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {claims.map((claim) => (
                    <TableRow key={claim.claimId} hover>
                      <TableCell sx={{ fontFamily: "monospace" }}>{shortId(claim.claimId)}</TableCell>
                      <TableCell>
                        <Chip size="small" label={claim.defectCategory ?? "—"} variant="outlined" />
                      </TableCell>
                      <TableCell>{claim.description ?? "—"}</TableCell>
                      <TableCell>{formatDateTime(claim.reportedAt)}</TableCell>
                      <TableCell>
                        <StatusBadge status={claim.coverageStatus} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
};

export default function WarrantyPage({ params }: { params: Promise<{ contractId: string }> }) {
  const { contractId } = use(params);
  return (
    <AppShell>
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Inner contractId={contractId} />
      </Container>
    </AppShell>
  );
}
