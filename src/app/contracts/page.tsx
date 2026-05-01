"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { AppShell } from "@/components/AppShell";
import { CustomerIdInput } from "@/components/CustomerIdInput";
import { ContractList } from "@/components/ContractList";
import { ColdStartNote } from "@/components/ColdStartNote";

const Inner = () => {
  const router = useRouter();
  const params = useSearchParams();
  const customerId = params.get("customerId") ?? undefined;

  const setCustomerId = (id: string) => {
    router.push(`/contracts?customerId=${encodeURIComponent(id)}`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Stack spacing={4}>
        <Box>
          <Typography variant="h3" gutterBottom>
            สัญญาของฉัน
          </Typography>
          <Typography variant="body1" color="text.secondary">
            ดูรายการสัญญาทั้งหมดที่ผูกกับ Customer ID ของคุณ
          </Typography>
        </Box>

        {!customerId ? (
          <Stack spacing={2}>
            <CustomerIdInput onSubmit={setCustomerId} />
            <ColdStartNote />
          </Stack>
        ) : (
          <ContractList customerId={customerId} onChangeCustomer={() => router.push("/contracts")} />
        )}
      </Stack>
    </Container>
  );
};

export default function ContractsPage() {
  return (
    <AppShell>
      <Suspense fallback={<Box sx={{ p: 6 }} />}>
        <Inner />
      </Suspense>
    </AppShell>
  );
}
