"use client";

import Link from "next/link";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import { useColorMode } from "@/theme/ColorModeContext";
import type { ReactNode } from "react";

export const AppShell = ({ children }: { children: ReactNode }) => {
  const { mode, toggle } = useColorMode();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="sticky" elevation={0} sx={{ backdropFilter: "blur(8px)", borderBottom: 1, borderColor: "divider" }}>
        <Toolbar sx={{ gap: 2 }}>
          <Stack direction="row" spacing={1} component={Link} href="/" sx={{ alignItems: "center", textDecoration: "none", color: "inherit" }}>
            <HomeRoundedIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Real Estate Portal
            </Typography>
          </Stack>
          <Box sx={{ flexGrow: 1 }} />
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Button component={Link} href="/contracts" startIcon={<DescriptionRoundedIcon />} color="inherit">
              สัญญาของฉัน
            </Button>
            <Button component={Link} href="/admin" startIcon={<AdminPanelSettingsRoundedIcon />} color="inherit">
              Admin
            </Button>
            <Tooltip title={mode === "dark" ? "Light mode" : "Dark mode"}>
              <IconButton onClick={toggle} color="inherit" aria-label="toggle theme">
                {mode === "dark" ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
              </IconButton>
            </Tooltip>
          </Stack>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
      <Box component="footer" sx={{ py: 3, px: 2, mt: 4, borderTop: 1, borderColor: "divider" }}>
        <Container maxWidth="lg">
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ alignItems: { sm: "center" }, justifyContent: "space-between" }}>
            <Typography variant="body2" color="text.secondary">
              CS621 Term Project — Legal domain demo
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button size="small" component={Link} href="/admin" color="inherit">
                Admin Console
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};
