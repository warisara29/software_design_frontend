"use client";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import type { ReactNode } from "react";

export const DocTitle = ({
  title,
  subtitle,
  refNo,
}: {
  title: string;
  subtitle?: string;
  refNo?: string;
}) => (
  <Stack spacing={0.5} sx={{ textAlign: "center", mb: 4 }}>
    <Typography component="div" sx={{ fontSize: 24, fontWeight: 700, letterSpacing: 1 }}>
      {title}
    </Typography>
    {subtitle ? (
      <Typography component="div" sx={{ fontSize: 16, color: "#444" }}>
        {subtitle}
      </Typography>
    ) : null}
    {refNo ? (
      <Typography component="div" sx={{ fontSize: 12, color: "#777", fontFamily: "monospace" }}>
        เลขที่ {refNo}
      </Typography>
    ) : null}
  </Stack>
);

export const DocSection = ({
  number,
  heading,
  children,
}: {
  number?: string | number;
  heading: string;
  children: ReactNode;
}) => (
  <Box sx={{ mb: 2.5 }}>
    <Typography component="div" sx={{ fontWeight: 700, mb: 0.5 }}>
      {number != null ? `ข้อ ${number}. ` : ""}
      {heading}
    </Typography>
    <Box sx={{ pl: number != null ? 3 : 0, color: "#333" }}>{children}</Box>
  </Box>
);

export const DocField = ({ label, value }: { label: string; value: ReactNode }) => (
  <Box sx={{ display: "flex", borderBottom: "1px dashed #aaa", py: 0.75 }}>
    <Box sx={{ width: 180, fontWeight: 600, color: "#444" }}>{label}</Box>
    <Box sx={{ flexGrow: 1, fontFamily: "monospace", fontSize: 13 }}>{value ?? "—"}</Box>
  </Box>
);

export const SignatureBlock = ({
  partyLabel,
  nameOrId,
  date,
}: {
  partyLabel: string;
  nameOrId?: string | null;
  date?: string;
}) => (
  <Stack spacing={0.5} sx={{ flex: 1, alignItems: "center", textAlign: "center" }}>
    <Box
      sx={{
        width: "80%",
        borderBottom: "1px solid #333",
        height: 60,
      }}
    />
    <Typography component="div" sx={{ fontSize: 13 }}>
      ลงชื่อ {partyLabel}
    </Typography>
    <Typography component="div" sx={{ fontSize: 12, color: "#555", fontFamily: "monospace" }}>
      {nameOrId ?? "—"}
    </Typography>
    {date ? (
      <Typography component="div" sx={{ fontSize: 12, color: "#777" }}>
        วันที่ {date}
      </Typography>
    ) : null}
  </Stack>
);

export const DocFooter = ({ note }: { note?: string }) => (
  <Box sx={{ mt: 4 }}>
    <Divider sx={{ my: 2 }} />
    <Typography component="div" sx={{ fontSize: 11, color: "#888", textAlign: "center" }}>
      {note ?? "เอกสารนี้สร้างโดยระบบอัตโนมัติ — CS621 Legal Microservices"}
    </Typography>
  </Box>
);
