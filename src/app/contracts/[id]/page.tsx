"use client";

import { use, useState } from "react";
import Link from "next/link";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { AppShell } from "@/components/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import { ErrorState } from "@/components/ErrorState";
import { PdfViewerDialog } from "@/components/PdfViewerDialog";
import { useContract } from "@/lib/queries";
import { formatDateTime, shortId } from "@/lib/format";
import type { ContractStatus } from "@/lib/types";

const STEPS: ContractStatus[] = ["DRAFT", "PENDING_SIGN", "SIGNED"];

const stepIndex = (status: ContractStatus | undefined): number => {
  if (status === "CANCELLED") return -1;
  if (!status) return 0;
  return STEPS.indexOf(status);
};

const Field = ({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) => (
  <Stack spacing={0.5}>
    <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 1 }}>
      {label}
    </Typography>
    <Typography variant="body2" sx={mono ? { fontFamily: "monospace" } : undefined}>
      {value ?? "—"}
    </Typography>
  </Stack>
);

const ContractDetailInner = ({ id }: { id: string }) => {
  const { data: contract, isLoading, error, refetch } = useContract(id);
  const [pdfOpen, setPdfOpen] = useState(false);

  if (isLoading) {
    return (
      <Stack spacing={2}>
        <Skeleton variant="rounded" height={120} />
        <Skeleton variant="rounded" height={240} />
      </Stack>
    );
  }
  if (error) return <ErrorState error={error} onRetry={() => refetch()} />;
  if (!contract) return <ErrorState error={new Error("Contract not found")} />;

  const active = stepIndex(contract.status);
  const cancelled = contract.status === "CANCELLED";

  return (
    <Stack spacing={3}>
      <Button component={Link} href="/contracts" startIcon={<ArrowBackRoundedIcon />} sx={{ alignSelf: "flex-start" }}>
        กลับไปยังรายการสัญญา
      </Button>

      <Card variant="outlined">
        <CardContent>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ justifyContent: "space-between", alignItems: { sm: "center" } }}>
            <Box>
              <Typography variant="overline" color="text.secondary">
                Contract
              </Typography>
              <Typography variant="h4" sx={{ fontFamily: "monospace" }}>
                {shortId(contract.contractId, 12)}…
              </Typography>
              <Typography variant="caption" color="text.secondary">
                สร้างเมื่อ {formatDateTime(contract.createdAt)}
              </Typography>
            </Box>
            <StatusBadge status={contract.status} size="medium" />
          </Stack>
        </CardContent>
      </Card>

      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            ขั้นตอนของสัญญา
          </Typography>
          <Stepper activeStep={cancelled ? 0 : active} alternativeLabel sx={{ mt: 2 }}>
            {STEPS.map((s, i) => (
              <Step key={s} completed={!cancelled && i < active}>
                <StepLabel error={cancelled}>{s.replace(/_/g, " ")}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {cancelled ? (
            <Typography variant="body2" color="error" sx={{ mt: 2 }}>
              สัญญาฉบับนี้ถูกยกเลิก
            </Typography>
          ) : null}
        </CardContent>
      </Card>

      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            รายละเอียดสัญญา
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Field label="Unit ID" value={contract.unitId} mono />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Field label="Booking ID" value={contract.bookingId} mono />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Field label="Customer ID" value={contract.customerId} mono />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Field label="Buyer ID" value={contract.buyerId} mono />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Field label="Seller ID" value={contract.sellerId} mono />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Field label="Template ID" value={contract.templateId} mono />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {contract.draft ? (
        <Card variant="outlined">
          <CardContent>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ justifyContent: "space-between", alignItems: { sm: "center" } }}>
              <Box>
                <Typography variant="h6">เอกสารฉบับร่าง (Draft)</Typography>
                <Typography variant="caption" color="text.secondary">
                  จัดทำเมื่อ {formatDateTime(contract.draft.draftedAt)} · Draft ID {shortId(contract.draft.draftId)}
                </Typography>
              </Box>
              <Button
                variant="contained"
                endIcon={<OpenInNewRoundedIcon />}
                onClick={() => setPdfOpen(true)}
                disabled={!contract.draft.fileUrl}
              >
                ดู PDF
              </Button>
            </Stack>
          </CardContent>
        </Card>
      ) : null}

      {contract.contractId ? (
        <Box>
          <Button
            variant="outlined"
            size="large"
            startIcon={<VerifiedRoundedIcon />}
            component={Link}
            href={`/warranty/${contract.contractId}`}
          >
            ดู Warranty ของสัญญานี้
          </Button>
        </Box>
      ) : null}

      <PdfViewerDialog
        open={pdfOpen}
        onClose={() => setPdfOpen(false)}
        fileUrl={contract.draft?.fileUrl}
        title={`Contract Draft · ${shortId(contract.contractId, 8)}`}
      />
    </Stack>
  );
};

export default function ContractDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <AppShell>
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <ContractDetailInner id={id} />
      </Container>
    </AppShell>
  );
}
