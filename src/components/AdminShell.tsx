"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import HomeWorkRoundedIcon from "@mui/icons-material/HomeWorkRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { useColorMode } from "@/theme/ColorModeContext";
import { HealthBadges } from "./HealthBadges";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: <DashboardRoundedIcon /> },
  { href: "/admin/acquisitions", label: "Acquisitions", icon: <HomeWorkRoundedIcon /> },
  { href: "/admin/contracts", label: "Contracts", icon: <DescriptionRoundedIcon /> },
  { href: "/admin/warranty", label: "Warranty Lookup", icon: <ShieldRoundedIcon /> },
  { href: "/admin/triggers", label: "Test Triggers", icon: <BoltRoundedIcon /> },
];

const DRAWER_WIDTH = 240;

export const AdminShell = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const { mode, toggle } = useColorMode();

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            borderRight: 1,
            borderColor: "divider",
          },
        }}
      >
        <Toolbar sx={{ px: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Admin Console
          </Typography>
        </Toolbar>
        <Divider />
        <List>
          {NAV.map((item) => {
            const active = item.href === "/admin" ? pathname === "/admin" : pathname?.startsWith(item.href);
            return (
              <ListItem key={item.href} disablePadding>
                <ListItemButton component={Link} href={item.href} selected={Boolean(active)}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
        <Divider />
        <Box sx={{ p: 2 }}>
          <Typography variant="overline" color="text.secondary" sx={{ display: "block", mb: 1 }}>
            Service health
          </Typography>
          <HealthBadges />
        </Box>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton component={Link} href="/">
              <ListItemIcon>
                <LogoutRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="ออกไปหน้าลูกค้า" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <AppBar
          position="sticky"
          elevation={0}
          color="default"
          sx={{ borderBottom: 1, borderColor: "divider", backdropFilter: "blur(8px)" }}
        >
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
              Real Estate · Admin
            </Typography>
            <Tooltip title={mode === "dark" ? "Light mode" : "Dark mode"}>
              <IconButton onClick={toggle} aria-label="toggle theme">
                {mode === "dark" ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
        <Box component="main" sx={{ p: { xs: 2, md: 4 }, flexGrow: 1 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};
