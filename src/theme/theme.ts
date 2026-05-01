"use client";

import { createTheme, type ThemeOptions } from "@mui/material/styles";

const sharedTokens: ThemeOptions = {
  shape: { borderRadius: 12 },
  typography: {
    fontFamily:
      'Inter, "IBM Plex Sans Thai", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    h1: { fontWeight: 700, letterSpacing: "-0.02em" },
    h2: { fontWeight: 700, letterSpacing: "-0.02em" },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { borderRadius: 10 } },
    },
    MuiCard: {
      styleOverrides: { root: { borderRadius: 16 } },
    },
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: "none" } },
    },
    MuiAppBar: {
      defaultProps: { color: "default" },
    },
  },
};

export const lightTheme = createTheme({
  ...sharedTokens,
  palette: {
    mode: "light",
    primary: { main: "#0e6ba8", contrastText: "#fff" },
    secondary: { main: "#0a9396", contrastText: "#fff" },
    background: { default: "#f5f8fb", paper: "#ffffff" },
    info: { main: "#1d6fa5" },
    success: { main: "#1f8a4c" },
    warning: { main: "#c98414" },
    error: { main: "#c0392b" },
  },
});

export const darkTheme = createTheme({
  ...sharedTokens,
  palette: {
    mode: "dark",
    primary: { main: "#5fb1f0" },
    secondary: { main: "#4ec1c4" },
    background: { default: "#0f1620", paper: "#161f2c" },
    info: { main: "#5fb1f0" },
    success: { main: "#3fae6b" },
    warning: { main: "#e0a13a" },
    error: { main: "#e57362" },
  },
});
