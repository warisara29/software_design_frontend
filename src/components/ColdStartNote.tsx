"use client";

import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

export const ColdStartNote = () => (
  <Alert severity="info" variant="outlined" sx={{ borderRadius: 3 }}>
    <AlertTitle>กำลังเรียกข้อมูลจาก backend</AlertTitle>
    Render free tier จะ sleep หลัง 15 นาที — request แรกอาจใช้เวลา ~30 วินาที กรุณารอสักครู่
  </Alert>
);
