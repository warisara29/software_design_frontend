"use client";

import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { DocField, DocFooter, DocSection, DocTitle, SignatureBlock } from "./DocumentChrome";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/format";
import type { Acquisition } from "@/lib/types";

export const WillingContractDocumentView = ({ acquisition }: { acquisition: Acquisition }) => {
  const wc = acquisition.willingContract;
  const drafted = wc?.draftedAt ? formatDate(wc.draftedAt) : formatDate(acquisition.createdAt);

  return (
    <>
      <DocTitle
        title="หนังสือแสดงเจตจำนงในการซื้อขาย"
        subtitle="(Willing-to-Sell Contract)"
        refNo={wc?.willingContractId ?? acquisition.acquisitionId ?? "—"}
      />

      <Box sx={{ mb: 3, lineHeight: 2 }}>
        <Typography component="div" sx={{ textIndent: "3em" }}>
          หนังสือฉบับนี้ทำขึ้น ณ วันที่ <b>{drafted}</b> โดย <b>{acquisition.sellerName ?? "ผู้จะขาย"}</b>
          {acquisition.sellerId ? <> (รหัส <code>{acquisition.sellerId}</code>)</> : null} ในฐานะเจ้าของทรัพย์สินตามรายละเอียดด้านล่าง
          แสดงเจตจำนงต่อบริษัทฯ ในการขายทรัพย์สินดังกล่าวภายใต้เงื่อนไขที่ระบุไว้
        </Typography>
      </Box>

      <DocSection number={1} heading="รายละเอียดทรัพย์สิน">
        <Stack spacing={0}>
          <DocField label="เลขที่ทรัพย์ / Property ID" value={acquisition.propertyId ?? "—"} />
          <DocField label="ที่อยู่" value={acquisition.address ?? "—"} />
          <DocField
            label="พื้นที่"
            value={acquisition.areaSqm != null ? `${acquisition.areaSqm.toLocaleString()} ตร.ม.` : "—"}
          />
          <DocField label="ประเภทพื้นที่ (Zone)" value={acquisition.zoneType ?? "—"} />
          <DocField label="เลขที่การสำรวจ / Survey ID" value={acquisition.surveyId ?? "—"} />
        </Stack>
      </DocSection>

      <DocSection number={2} heading="ราคาและเงื่อนไข">
        <Stack spacing={0}>
          <DocField label="ราคาประเมิน" value={formatCurrency(acquisition.estimatedValue ?? null)} />
          <DocField
            label="ราคาที่ตกลง (Agreed Price)"
            value={
              wc?.agreedPrice != null ? (
                <b>{formatCurrency(wc.agreedPrice)}</b>
              ) : (
                "ยังไม่กำหนด"
              )
            }
          />
        </Stack>
      </DocSection>

      <DocSection number={3} heading="ผู้จะขาย">
        <Stack spacing={0}>
          <DocField label="ชื่อผู้จะขาย" value={acquisition.sellerName ?? "—"} />
          <DocField label="รหัสผู้จะขาย / Seller ID" value={acquisition.sellerId ?? "—"} />
        </Stack>
      </DocSection>

      <DocSection number={4} heading="แบบและสถานะ">
        เอกสารฉบับนี้จัดทำตามแม่แบบเลขที่ <code>{wc?.templateId ?? "—"}</code> สถานะปัจจุบันของกระบวนการ acquisition คือ{" "}
        <b>{acquisition.status ?? "—"}</b>
        {acquisition.approvedAt ? (
          <>
            {" "}อนุมัติเมื่อ <b>{formatDateTime(acquisition.approvedAt)}</b>
          </>
        ) : null}
      </DocSection>

      <DocSection number={5} heading="ข้อตกลง">
        ผู้จะขายยืนยันว่ามีกรรมสิทธิ์อย่างถูกต้องในทรัพย์สินตามที่ระบุข้างต้น และยินยอมให้บริษัทฯ
        ดำเนินการตรวจสอบเอกสารสิทธิ์เพื่อจัดทำสัญญาจะซื้อจะขายฉบับสมบูรณ์ในลำดับต่อไป
      </DocSection>

      <Stack direction="row" spacing={4} sx={{ mt: 6 }}>
        <SignatureBlock partyLabel="ผู้จะขาย" nameOrId={acquisition.sellerName ?? acquisition.sellerId} date={drafted} />
        <SignatureBlock partyLabel="ตัวแทนบริษัทฯ" nameOrId="Acquisition Officer" date={drafted} />
        <SignatureBlock partyLabel="พยาน" nameOrId="—" />
      </Stack>

      <DocFooter />
    </>
  );
};
