"use client";

import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import { isUuid } from "@/lib/format";
import { SAMPLE_CUSTOMER_IDS } from "@/lib/services";

export const CustomerIdInput = ({ onSubmit }: { onSubmit: (customerId: string) => void }) => {
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);
  const valid = value === "" || isUuid(value);

  const submit = (id: string) => {
    if (!isUuid(id)) {
      setTouched(true);
      return;
    }
    onSubmit(id.trim());
  };

  return (
    <Card variant="outlined" sx={{ maxWidth: 640, mx: "auto" }}>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h5">ค้นหาสัญญาของคุณ</Typography>
          <Typography variant="body2" color="text.secondary">
            กรอก Customer ID (UUID) เพื่อดูสัญญาทั้งหมดของคุณ
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
            <TextField
              fullWidth
              placeholder="00000000-0000-0000-0000-000000000000"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onBlur={() => setTouched(true)}
              error={touched && !valid}
              helperText={touched && !valid ? "Customer ID ต้องเป็น UUID ที่ถูกต้อง" : " "}
            />
            <Button
              variant="contained"
              size="large"
              onClick={() => submit(value)}
              sx={{ minWidth: 140 }}
              disabled={!value || !valid}
            >
              ค้นหา
            </Button>
          </Stack>
          <Stack spacing={1}>
            <Typography variant="caption" color="text.secondary">
              ตัวอย่าง Customer ID จาก seed data:
            </Typography>
            <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
              {SAMPLE_CUSTOMER_IDS.map((id) => (
                <Chip
                  key={id}
                  label={id.slice(0, 8) + "…"}
                  variant="outlined"
                  onClick={() => submit(id)}
                  clickable
                />
              ))}
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
