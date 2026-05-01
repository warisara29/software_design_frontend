"use client";

import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Button from "@mui/material/Button";
import { ApiError } from "@/lib/api";

export const ErrorState = ({ error, onRetry }: { error: unknown; onRetry?: () => void }) => {
  const message =
    error instanceof ApiError
      ? `${error.status} — ${error.message}`
      : error instanceof Error
        ? error.message
        : "Unknown error";
  return (
    <Alert
      severity="error"
      variant="outlined"
      sx={{ borderRadius: 3 }}
      action={
        onRetry ? (
          <Button color="inherit" size="small" onClick={onRetry}>
            ลองใหม่
          </Button>
        ) : undefined
      }
    >
      <AlertTitle>โหลดข้อมูลไม่สำเร็จ</AlertTitle>
      {message}
    </Alert>
  );
};
