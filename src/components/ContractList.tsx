"use client";

import Link from "next/link";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useContracts } from "@/lib/queries";
import { StatusBadge } from "./StatusBadge";
import { ErrorState } from "./ErrorState";
import { formatDateTime, shortId } from "@/lib/format";

export const ContractList = ({
  customerId,
  onChangeCustomer,
}: {
  customerId: string;
  onChangeCustomer?: () => void;
}) => {
  const { data, isLoading, error, refetch } = useContracts(customerId);

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
        <Chip label={`Customer: ${shortId(customerId, 12)}…`} />
        {onChangeCustomer ? (
          <Button startIcon={<EditOutlinedIcon />} size="small" onClick={onChangeCustomer}>
            เปลี่ยน Customer ID
          </Button>
        ) : null}
      </Stack>

      {isLoading ? (
        <Stack spacing={1}>
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} variant="rounded" height={88} />
          ))}
        </Stack>
      ) : error ? (
        <ErrorState error={error} onRetry={() => refetch()} />
      ) : !data || data.length === 0 ? (
        <Card variant="outlined">
          <CardContent>
            <Typography variant="body1" color="text.secondary">
              ไม่พบสัญญาสำหรับ Customer ID นี้
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Stack spacing={1.5}>
          {data.map((c) => (
            <Card key={c.contractId} variant="outlined">
              <CardActionArea component={Link} href={`/contracts/${c.contractId}`}>
                <CardContent>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    sx={{ alignItems: { sm: "center" }, justifyContent: "space-between" }}
                  >
                    <Box>
                      <Typography variant="overline" color="text.secondary">
                        Contract
                      </Typography>
                      <Typography variant="h6" sx={{ fontFamily: "monospace" }}>
                        {shortId(c.contractId)}…
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Unit {shortId(c.unitId)} · สร้างเมื่อ {formatDateTime(c.createdAt)}
                      </Typography>
                    </Box>
                    <StatusBadge status={c.status} />
                  </Stack>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Stack>
      )}
    </Stack>
  );
};
