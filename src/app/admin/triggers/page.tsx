"use client";

import { useState, type ReactNode } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import Chip from "@mui/material/Chip";
import {
  useTriggerApproval,
  useTriggerBooking,
  useTriggerSurvey,
  useTriggerWarranty,
} from "@/lib/queries";
import { ApiError } from "@/lib/api";
import { DEFECT_CATEGORIES, type DefectCategory } from "@/lib/types";
import { isUuid, randomUuid } from "@/lib/format";
import { SAMPLE_CUSTOMER_IDS } from "@/lib/services";

const TriggerCard = ({
  title,
  description,
  pending,
  result,
  error,
  onSubmit,
  disabled,
  children,
}: {
  title: string;
  description: string;
  pending: boolean;
  result?: unknown;
  error?: unknown;
  onSubmit: () => void;
  disabled?: boolean;
  children: ReactNode;
}) => (
  <Card variant="outlined">
    <CardContent>
      <Stack spacing={2}>
        <Box>
          <Typography variant="h6">{title}</Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </Box>
        <Stack spacing={2}>{children}</Stack>
        <Box>
          <Button variant="contained" onClick={onSubmit} disabled={pending || disabled}>
            {pending ? "กำลังยิง..." : "Trigger"}
          </Button>
        </Box>
        {error ? (
          <Alert severity="error">
            {error instanceof ApiError ? `${error.status} — ${error.message}` : String(error)}
          </Alert>
        ) : null}
        {result ? (
          <Alert severity="success" sx={{ wordBreak: "break-word" }}>
            <Typography variant="caption" sx={{ fontFamily: "monospace" }}>
              {JSON.stringify(result, null, 2)}
            </Typography>
          </Alert>
        ) : null}
      </Stack>
    </CardContent>
  </Card>
);

const BookingForm = () => {
  const [bookingId, setBookingId] = useState(randomUuid());
  const [unitId, setUnitId] = useState(randomUuid());
  const [customerId, setCustomerId] = useState<string>(SAMPLE_CUSTOMER_IDS[0]);
  const m = useTriggerBooking();

  const valid = isUuid(bookingId) && isUuid(unitId) && isUuid(customerId);

  return (
    <TriggerCard
      title="Booking Confirmed (Contract)"
      description="POST /api/inbound/booking-confirmed → สร้าง contract draft ใหม่"
      pending={m.isPending}
      result={m.data}
      error={m.error}
      disabled={!valid}
      onSubmit={() => m.mutate({ bookingId, unitId, customerId })}
    >
      <TextField label="Booking ID" value={bookingId} onChange={(e) => setBookingId(e.target.value)} error={!isUuid(bookingId)} />
      <TextField label="Unit ID" value={unitId} onChange={(e) => setUnitId(e.target.value)} error={!isUuid(unitId)} />
      <TextField label="Customer ID" value={customerId} onChange={(e) => setCustomerId(e.target.value)} error={!isUuid(customerId)} />
      <Button size="small" onClick={() => { setBookingId(randomUuid()); setUnitId(randomUuid()); }}>
        Random Booking + Unit IDs
      </Button>
    </TriggerCard>
  );
};

const SurveyForm = () => {
  const [surveyId, setSurveyId] = useState(randomUuid());
  const [propertyId, setPropertyId] = useState(randomUuid());
  const [address, setAddress] = useState("99/1 Sukhumvit Rd, Bangkok");
  const [areaSqm, setAreaSqm] = useState("180");
  const [estimatedValue, setEstimatedValue] = useState("7500000");
  const [zoneType, setZoneType] = useState("RESIDENTIAL");
  const m = useTriggerSurvey();
  const valid = isUuid(surveyId) && isUuid(propertyId);

  return (
    <TriggerCard
      title="Property Surveyed (Acquisition)"
      description="POST /api/inbound/property-surveyed → สร้าง acquisition ใหม่"
      pending={m.isPending}
      result={m.data}
      error={m.error}
      disabled={!valid}
      onSubmit={() =>
        m.mutate({
          surveyId,
          propertyId,
          address,
          areaSqm: Number(areaSqm) || undefined,
          estimatedValue: Number(estimatedValue) || undefined,
          zoneType,
        })
      }
    >
      <TextField label="Survey ID" value={surveyId} onChange={(e) => setSurveyId(e.target.value)} error={!isUuid(surveyId)} />
      <TextField label="Property ID" value={propertyId} onChange={(e) => setPropertyId(e.target.value)} error={!isUuid(propertyId)} />
      <TextField label="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
      <Grid container spacing={2}>
        <Grid size={4}>
          <TextField fullWidth label="Area (sqm)" type="number" value={areaSqm} onChange={(e) => setAreaSqm(e.target.value)} />
        </Grid>
        <Grid size={4}>
          <TextField fullWidth label="Est. Value (THB)" type="number" value={estimatedValue} onChange={(e) => setEstimatedValue(e.target.value)} />
        </Grid>
        <Grid size={4}>
          <TextField fullWidth label="Zone" value={zoneType} onChange={(e) => setZoneType(e.target.value)} />
        </Grid>
      </Grid>
    </TriggerCard>
  );
};

const ApprovalForm = () => {
  const [acquisitionId, setAcquisitionId] = useState("");
  const [approvedPrice, setApprovedPrice] = useState("7000000");
  const [approvedBy, setApprovedBy] = useState("admin@cs621.dev");
  const m = useTriggerApproval();
  const valid = isUuid(acquisitionId);

  return (
    <TriggerCard
      title="Acquisition Approved"
      description="POST /api/inbound/acquisition-approved → อัปเดต acquisition ที่มีอยู่ให้ APPROVED"
      pending={m.isPending}
      result={m.data}
      error={m.error}
      disabled={!valid}
      onSubmit={() =>
        m.mutate({
          acquisitionId,
          approvedPrice: Number(approvedPrice) || undefined,
          approvedBy: approvedBy.trim() || undefined,
        })
      }
    >
      <TextField
        label="Acquisition ID"
        value={acquisitionId}
        onChange={(e) => setAcquisitionId(e.target.value)}
        error={acquisitionId !== "" && !isUuid(acquisitionId)}
        helperText="copy จาก /admin/acquisitions"
      />
      <TextField label="Approved Price" type="number" value={approvedPrice} onChange={(e) => setApprovedPrice(e.target.value)} />
      <TextField label="Approved By" value={approvedBy} onChange={(e) => setApprovedBy(e.target.value)} />
    </TriggerCard>
  );
};

const WarrantyForm = () => {
  const [contractId, setContractId] = useState("");
  const [unitId, setUnitId] = useState(randomUuid());
  const [customerId, setCustomerId] = useState<string>(SAMPLE_CUSTOMER_IDS[0]);
  const [categories, setCategories] = useState<DefectCategory[]>(["STRUCTURAL", "ELECTRICAL", "PLUMBING"]);
  const m = useTriggerWarranty();
  const valid = isUuid(contractId) && isUuid(unitId) && isUuid(customerId);

  const submit = () => {
    const now = new Date();
    const ends = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
    m.mutate({
      contractId,
      unitId,
      customerId,
      startsAt: now.toISOString(),
      endsAt: ends.toISOString(),
      coveredCategories: categories,
    });
  };

  return (
    <TriggerCard
      title="Warranty Registered"
      description="POST /api/inbound/warranty-registered → สร้าง warranty ใหม่ (1 ปี)"
      pending={m.isPending}
      result={m.data}
      error={m.error}
      disabled={!valid}
      onSubmit={submit}
    >
      <TextField
        label="Contract ID"
        value={contractId}
        onChange={(e) => setContractId(e.target.value)}
        error={contractId !== "" && !isUuid(contractId)}
        helperText="copy จาก /admin/contracts"
      />
      <TextField label="Unit ID" value={unitId} onChange={(e) => setUnitId(e.target.value)} error={!isUuid(unitId)} />
      <TextField label="Customer ID" value={customerId} onChange={(e) => setCustomerId(e.target.value)} error={!isUuid(customerId)} />
      <FormControl>
        <InputLabel>Covered Categories</InputLabel>
        <Select
          multiple
          value={categories}
          onChange={(e) => setCategories(typeof e.target.value === "string" ? (e.target.value.split(",") as DefectCategory[]) : (e.target.value as DefectCategory[]))}
          input={<OutlinedInput label="Covered Categories" />}
          renderValue={(selected) => (
            <Stack direction="row" spacing={0.5} useFlexGap sx={{ flexWrap: "wrap" }}>
              {(selected as DefectCategory[]).map((c) => (
                <Chip key={c} label={c} size="small" />
              ))}
            </Stack>
          )}
        >
          {DEFECT_CATEGORIES.map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Typography variant="caption" color="text.secondary">
        Coverage: ตอนกด trigger → 365 วันถัดไป
      </Typography>
    </TriggerCard>
  );
};

export default function AdminTriggersPage() {
  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" gutterBottom>
          Test Triggers
        </Typography>
        <Typography variant="body1" color="text.secondary">
          ยิง inbound events ตรงเข้า microservices (Kafka REST fallback) เพื่อสร้าง test data ระหว่าง demo
        </Typography>
      </Box>
      <Alert severity="warning" variant="outlined" sx={{ borderRadius: 3 }}>
        endpoint เหล่านี้คือ <code>/api/inbound/*</code> ของแต่ละ service — ใช้สำหรับ test เท่านั้น
        ทุก trigger จะ persist ลง DB จริงและอาจ publish Kafka event ตามมา
      </Alert>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <BookingForm />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <SurveyForm />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <ApprovalForm />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <WarrantyForm />
        </Grid>
      </Grid>
    </Stack>
  );
}
