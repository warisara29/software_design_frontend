"use client";

import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

const DEMO_PDF_URL =
  "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf";

const isLikelyReachable = (url: string | undefined | null): boolean => {
  if (!url) return false;
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
};

interface Props {
  open: boolean;
  onClose: () => void;
  fileUrl: string | undefined;
  title?: string;
}

export const PdfViewerDialog = ({ open, onClose, fileUrl, title = "Contract PDF" }: Props) => {
  const [useDemo, setUseDemo] = useState(false);

  useEffect(() => {
    if (open) {
      const looksLikeSeed = fileUrl?.includes("storage.realestate.com");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUseDemo(Boolean(looksLikeSeed));
    }
  }, [open, fileUrl]);

  const effectiveUrl = useDemo ? DEMO_PDF_URL : fileUrl;
  const seedLooking = fileUrl?.includes("storage.realestate.com");

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
          <Typography variant="h6" component="span">
            {title}
          </Typography>
          {useDemo ? <Chip size="small" label="Demo PDF" color="warning" /> : null}
        </Stack>
        <IconButton onClick={onClose} aria-label="close">
          <CloseRoundedIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 0, height: "75vh", display: "flex", flexDirection: "column" }}>
        {seedLooking && !useDemo ? (
          <Alert severity="info" sx={{ m: 2, borderRadius: 2 }}>
            URL นี้เป็น seed placeholder (`storage.realestate.com`) ไม่ได้ host ไฟล์จริง — เปิด switch ด้านล่างเพื่อใช้ PDF ตัวอย่างสำหรับ demo
          </Alert>
        ) : null}
        {!isLikelyReachable(effectiveUrl) ? (
          <Box sx={{ p: 4 }}>
            <Alert severity="warning">ไม่มี URL สำหรับเปิด PDF</Alert>
          </Box>
        ) : (
          <Box
            component="iframe"
            src={effectiveUrl ?? ""}
            title={title}
            sx={{
              flexGrow: 1,
              width: "100%",
              border: 0,
              backgroundColor: "background.default",
            }}
          />
        )}
        <Box sx={{ p: 1.5, borderTop: 1, borderColor: "divider", bgcolor: "background.default" }}>
          <Typography variant="caption" color="text.secondary" sx={{ wordBreak: "break-all" }}>
            URL: {effectiveUrl ?? "—"}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-between", flexWrap: "wrap", gap: 1, px: 3 }}>
        <FormControlLabel
          control={<Switch checked={useDemo} onChange={(e) => setUseDemo(e.target.checked)} />}
          label="ใช้ PDF ตัวอย่าง (Mozilla)"
        />
        <Stack direction="row" spacing={1}>
          {effectiveUrl ? (
            <Button
              startIcon={<OpenInNewRoundedIcon />}
              component="a"
              href={effectiveUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              เปิด tab ใหม่
            </Button>
          ) : null}
          <Button onClick={onClose} variant="contained">
            ปิด
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};
