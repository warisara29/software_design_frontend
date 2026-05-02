"use client";

import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import CircleIcon from "@mui/icons-material/Circle";
import { useHealthAll } from "@/lib/queries";

const Dot = ({ ok, loading }: { ok: boolean | undefined; loading: boolean }) => (
  <CircleIcon
    sx={{
      fontSize: 10,
      color: loading ? "text.disabled" : ok ? "success.main" : "error.main",
    }}
  />
);

export const HealthBadges = () => {
  const { data, isLoading } = useHealthAll();

  const rows: { label: string; key: "contract" | "acquisition" | "warranty" }[] = [
    { label: "Contract", key: "contract" },
    { label: "Acquisition", key: "acquisition" },
    { label: "Warranty", key: "warranty" },
  ];

  return (
    <Stack spacing={0.5}>
      {rows.map((r) => (
        <Chip
          key={r.key}
          size="small"
          variant="outlined"
          icon={<Dot ok={data?.[r.key]} loading={isLoading} />}
          label={r.label}
          sx={{ justifyContent: "flex-start", "& .MuiChip-icon": { ml: 1 } }}
        />
      ))}
    </Stack>
  );
};
