"use client";

import Link from "next/link";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import HandymanRoundedIcon from "@mui/icons-material/HandymanRounded";
import { AppShell } from "@/components/AppShell";

const features = [
  {
    icon: <DescriptionRoundedIcon fontSize="large" color="primary" />,
    title: "สัญญาดิจิทัล",
    body: "ติดตามสถานะสัญญาทุกฉบับ DRAFT → PENDING_SIGN → SIGNED ในที่เดียว",
  },
  {
    icon: <ShieldRoundedIcon fontSize="large" color="secondary" />,
    title: "Warranty",
    body: "ดูระยะรับประกัน หมวดที่ครอบคลุม และสถานะ claim ของคุณ",
  },
  {
    icon: <HandymanRoundedIcon fontSize="large" color="primary" />,
    title: "Admin Tools",
    body: "ทีม Operation ดู Acquisitions, Contracts, Warranty Claims ได้ในที่เดียว",
  },
];

export default function LandingPage() {
  return (
    <AppShell>
      <Box
        sx={{
          background:
            "radial-gradient(ellipse at top, rgba(14,107,168,0.18), transparent 60%)",
          py: { xs: 6, md: 10 },
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={4} sx={{ alignItems: "center", textAlign: "center" }}>
            <Typography variant="overline" color="primary" sx={{ letterSpacing: 4 }}>
              CS621 · LEGAL DOMAIN DEMO
            </Typography>
            <Typography variant="h2" sx={{ maxWidth: 820 }}>
              ดูสัญญา การรับประกัน และข้อมูลโครงการของคุณได้ในที่เดียว
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, fontWeight: 400 }}>
              พอร์ทัลลูกค้าสำหรับโครงการอสังหาริมทรัพย์ — เชื่อมกับ microservices
              Contract / Acquisition / Warranty ของทีม Legal
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Button
                size="large"
                variant="contained"
                component={Link}
                href="/contracts"
                startIcon={<DescriptionRoundedIcon />}
              >
                ค้นหาสัญญาของฉัน
              </Button>
              <Button size="large" variant="outlined" component={Link} href="/admin">
                เข้าหน้า Admin
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Grid container spacing={3}>
          {features.map((f) => (
            <Grid key={f.title} size={{ xs: 12, md: 4 }}>
              <Card variant="outlined" sx={{ height: "100%" }}>
                <CardContent>
                  <Stack spacing={1.5}>
                    {f.icon}
                    <Typography variant="h6">{f.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {f.body}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </AppShell>
  );
}
