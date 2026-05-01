"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { darkTheme, lightTheme } from "./theme";

type Mode = "light" | "dark";

interface ColorModeCtx {
  mode: Mode;
  toggle: () => void;
  setMode: (m: Mode) => void;
}

const Ctx = createContext<ColorModeCtx | null>(null);

const STORAGE_KEY = "rep:color-mode";

export const ColorModeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<Mode>("light");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    const next: Mode | null =
      saved === "light" || saved === "dark"
        ? saved
        : window.matchMedia?.("(prefers-color-scheme: dark)").matches
          ? "dark"
          : null;
    if (next) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMode(next);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  const value = useMemo<ColorModeCtx>(
    () => ({
      mode,
      toggle: () => setMode((m) => (m === "light" ? "dark" : "light")),
      setMode,
    }),
    [mode],
  );

  const theme = mode === "dark" ? darkTheme : lightTheme;

  return (
    <Ctx.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </Ctx.Provider>
  );
};

export const useColorMode = (): ColorModeCtx => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useColorMode must be used inside ColorModeProvider");
  return v;
};
