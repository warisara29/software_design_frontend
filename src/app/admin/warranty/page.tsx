"use client";

import { useState } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Skeleton from "@mui/material/Skeleton";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import Grid from "@mui/material/Grid";
import { useWarrantyByContract } from "@/lib/queries";
import { ErrorState } from "@/components/ErrorState";
import { StatusBadge } from "@/components/StatusBadge";
import { daysUntil, formatDate, formatDateTime, isUuid, shortId } from "@/lib/format";

export default function AdminWarrantyLookupPage() {
  const [input, setInput] = useState("");
  const [contractId, setContractId] = useState<string | undefined>(undefined);
  const { data: warranty, isLoading, error, refetch } = useWarrantyByContract(contractId);

  const submit = () => {
    if (isUuid(input.trim())) setContractId(input.trim());
  };

  const remaining = daysUntil(warranty?.coverageEndsAt);

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" gutterBottom>
          Warranty Lookup
        </Typography>
        <Typography variant="body1" color="text.secondary">
          ค้นหา warranty + claims ตาม Contract ID
        </Typography>
      </Box>

      <Card variant="outlined">
        <CardContent>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              fullWidth
              size="small"
              label="Contract ID (UUID)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              error={input !== "" && !isUuid(input)}
              helperText={input !== "" && !isUuid(input) ? "ต้องเป็น UUID" : " "}
            />
            <Button variant="contained" onClick={submit} disabled={!isUuid(input.trim())}>
              ค้นหา
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {error ? <ErrorState error={error} onRetry={() => refetch()} /> : null}
      {isLoading ? <Skeleton variant="rounded" height={200} /> : null}

      {warranty ? (
        <Card variant="outlined">
          <CardContent>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ justifyContent: "space-between" }}
            >
              <Box>
                <Typography variant="overline" color="text.secondary">
                  Warranty
                </Typography>
                <Typography variant="h5" sx={{ fontFamily: "monospace" }}>
                  {shortId(warranty.warrantyId, 12)}…
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatDate(warranty.coverageStartsAt)} → {formatDate(warranty.coverageEndsAt)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="overline" color="text.secondary">
                  เหลือเวลา
                </Typography>
                <Typography
                  variant="h4"
                  color={remaining != null && remaining < 30 ? "warning.main" : "success.main"}
                >
                  {remaining != null && remaining > 0 ? `${remaining} วัน` : "หมดอายุ"}
                </Typography>
              </Box>
            </Stack>

            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  Customer
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                  {warranty.customerId}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  Unit
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                  {warranty.unitId}
                </Typography>
              </Grid>
            </Grid>

            <Box sx={{ mt: 2 }}>
              <Typography variant="overline" color="text.secondary">
                หมวดที่คุ้มครอง
              </Typography>
              <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap", mt: 1 }}>
                {(warranty.coveredCategories ?? []).map((c) => (
                  <Chip key={c} label={c} color="secondary" variant="outlined" />
                ))}
              </Stack>
            </Box>

            <Box sx={{ mt: 3 }}>
              <Typography variant="h6">Claims ({warranty.claims?.length ?? 0})</Typography>
              {warranty.claims?.length ? (
                <TableContainer sx={{ mt: 1 }}>
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
                      {warranty.claims.map((claim) => (
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
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  ยังไม่มี claim
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>
      ) : null}
    </Stack>
  );
}
