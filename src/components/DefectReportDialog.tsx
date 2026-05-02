"use client";

import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import { useReportDefect } from "@/lib/queries";
import { DEFECT_CATEGORIES, type DefectCategory, type Warranty } from "@/lib/types";
import { randomUuid } from "@/lib/format";
import { ApiError } from "@/lib/api";

interface Props {
  open: boolean;
  onClose: () => void;
  warranty: Warranty;
}

export const DefectReportDialog = ({ open, onClose, warranty }: Props) => {
  const [category, setCategory] = useState<DefectCategory>("FINISHING");
  const [description, setDescription] = useState("");
  const mutation = useReportDefect(warranty.contractId);

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCategory("FINISHING");
      setDescription("");
      mutation.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const submit = () => {
    if (!warranty.contractId || !warranty.unitId || !warranty.customerId) return;
    mutation.mutate({
      defectId: randomUuid(),
      contractId: warranty.contractId,
      unitId: warranty.unitId,
      customerId: warranty.customerId,
      defectCategory: category,
      description: description.trim() || undefined,
      reportedAt: new Date().toISOString(),
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>รายงานข้อบกพร่อง (Claim)</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {mutation.isSuccess ? (
            <Alert severity="success">
              ส่ง claim สำเร็จ — ระบบกำลัง process และจะอัปเดตสถานะภายใน 1–2 วินาที
            </Alert>
          ) : null}
          {mutation.error ? (
            <Alert severity="error">
              {mutation.error instanceof ApiError ? `${mutation.error.status} — ${mutation.error.message}` : String(mutation.error)}
            </Alert>
          ) : null}

          <TextField
            select
            label="หมวดข้อบกพร่อง"
            value={category}
            onChange={(e) => setCategory(e.target.value as DefectCategory)}
            disabled={mutation.isPending || mutation.isSuccess}
          >
            {DEFECT_CATEGORIES.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="รายละเอียด"
            multiline
            minRows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="เช่น น้ำรั่วที่ฝ้าห้องครัว, ปลั๊กไฟห้องนอนใช้ไม่ได้"
            disabled={mutation.isPending || mutation.isSuccess}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={mutation.isPending}>
          ปิด
        </Button>
        <Button
          variant="contained"
          onClick={submit}
          disabled={mutation.isPending || mutation.isSuccess}
        >
          {mutation.isPending ? "กำลังส่ง..." : "ส่ง claim"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
