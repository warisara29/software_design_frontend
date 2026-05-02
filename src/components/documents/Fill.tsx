"use client";

import Box from "@mui/material/Box";
import type { ReactNode } from "react";

interface FillProps {
  value?: ReactNode;
  width?: number | string;
  mono?: boolean;
  block?: boolean;
}

export const Fill = ({ value, width = 140, mono, block }: FillProps) => {
  const hasValue = value !== undefined && value !== null && value !== "";
  return (
    <Box
      component={block ? "div" : "span"}
      sx={{
        display: block ? "block" : "inline-block",
        minWidth: width,
        maxWidth: "100%",
        borderBottom: "1px dotted #444",
        textAlign: "center",
        px: 0.5,
        mx: 0.25,
        fontFamily: mono ? '"JetBrains Mono", monospace' : undefined,
        fontSize: mono ? 12 : undefined,
        lineHeight: 1.4,
        verticalAlign: "baseline",
        wordBreak: "break-all",
        color: hasValue ? "#000" : "transparent",
      }}
    >
      {hasValue ? value : " "}
    </Box>
  );
};
