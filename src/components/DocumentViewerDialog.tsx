"use client";

import type { ReactNode } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PrintRoundedIcon from "@mui/icons-material/PrintRounded";

interface Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export const DocumentViewerDialog = ({ open, onClose, title = "เอกสาร", children }: Props) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
          <Typography variant="h6" component="span">
            {title}
          </Typography>
          <Chip size="small" label="Mock document" color="info" variant="outlined" />
        </Stack>
        <IconButton onClick={onClose} aria-label="close">
          <CloseRoundedIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        dividers
        sx={{
          p: { xs: 1.5, sm: 3 },
          backgroundColor: (t) => (t.palette.mode === "dark" ? "#0b1320" : "#e9ecef"),
        }}
      >
        <Box
          className="print-area"
          sx={{
            mx: "auto",
            maxWidth: "210mm",
            minHeight: "297mm",
            backgroundColor: "#ffffff",
            color: "#1a1a1a",
            boxShadow: "0 6px 24px rgba(0,0,0,0.18)",
            p: { xs: 4, sm: 8 },
            fontFamily: '"Sarabun", "IBM Plex Sans Thai", serif',
            fontSize: 14,
            lineHeight: 1.7,
          }}
        >
          {children}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, justifyContent: "space-between" }}>
        <Typography variant="caption" color="text.secondary">
          เอกสารนี้สร้างจากข้อมูลจริงใน database — ไม่ใช่ไฟล์ PDF
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button startIcon={<PrintRoundedIcon />} onClick={handlePrint}>
            พิมพ์ / Save as PDF
          </Button>
          <Button onClick={onClose} variant="contained">
            ปิด
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};
