"use client";

import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { DocField, DocFooter, DocSection, DocTitle, SignatureBlock } from "./DocumentChrome";
import { formatDate, formatDateTime, shortId } from "@/lib/format";
import type { Contract } from "@/lib/types";

const STATUS_TH: Record<NonNullable<Contract["status"]>, string> = {
  DRAFT: "ฉบับร่าง",
  PENDING_SIGN: "รอลงนาม",
  SIGNED: "ลงนามแล้ว",
  CANCELLED: "ยกเลิก",
};

export const ContractDocumentView = ({ contract }: { contract: Contract }) => {
  const created = formatDate(contract.createdAt);

  return (
    <>
      <DocTitle
        title="หนังสือสัญญาจะซื้อจะขาย"
        subtitle="(Real Estate Purchase Agreement)"
        refNo={contract.contractId ?? "—"}
      />

      <Box sx={{ mb: 3, lineHeight: 2 }}>
        <Typography component="div" sx={{ textIndent: "3em" }}>
          หนังสือสัญญาฉบับนี้ทำขึ้น ณ วันที่ <b>{created}</b> ระหว่าง <b>ผู้จะขาย</b> ซึ่งมีรหัสประจำตัวเลขที่{" "}
          <code>{contract.sellerId ?? "—"}</code> ฝ่ายหนึ่ง กับ <b>ผู้จะซื้อ</b> ซึ่งมีรหัสประจำตัวเลขที่{" "}
          <code>{contract.buyerId ?? contract.customerId ?? "—"}</code> อีกฝ่ายหนึ่ง
          ทั้งสองฝ่ายตกลงทำสัญญากันโดยมีข้อความและเงื่อนไขดังต่อไปนี้
        </Typography>
      </Box>

      <DocSection number={1} heading="ทรัพย์ที่จะซื้อจะขาย">
        ผู้จะขายตกลงจะขายและผู้จะซื้อตกลงจะซื้อทรัพย์สินซึ่งเป็นห้องชุด/ที่ดินพร้อมสิ่งปลูกสร้าง ตามรายละเอียดต่อไปนี้
        <Stack spacing={0} sx={{ mt: 1.5 }}>
          <DocField label="หมายเลขห้อง / Unit ID" value={contract.unitId ?? "—"} />
          <DocField label="หมายเลขการจอง / Booking ID" value={contract.bookingId ?? "—"} />
          <DocField label="เลขที่สัญญา / Contract ID" value={contract.contractId ?? "—"} />
        </Stack>
      </DocSection>

      <DocSection number={2} heading="คู่สัญญา">
        <Stack spacing={0}>
          <DocField label="ผู้จะขาย (Seller)" value={contract.sellerId ?? "—"} />
          <DocField label="ผู้จะซื้อ (Buyer)" value={contract.buyerId ?? "—"} />
          <DocField label="ลูกค้า (Customer)" value={contract.customerId ?? "—"} />
        </Stack>
      </DocSection>

      <DocSection number={3} heading="แบบของสัญญา">
        สัญญาฉบับนี้จัดทำตามแบบมาตรฐาน หมายเลขแม่แบบ <code>{contract.templateId ?? "—"}</code>
        {contract.draft?.draftId ? (
          <>
            {" "}และมีฉบับร่างเลขที่ <code>{contract.draft.draftId}</code> จัดทำเมื่อ{" "}
            <b>{formatDateTime(contract.draft.draftedAt)}</b>
          </>
        ) : null}
      </DocSection>

      <DocSection number={4} heading="สถานะปัจจุบัน">
        ขณะออกเอกสารฉบับนี้ สัญญามีสถานะ <b>{contract.status ? STATUS_TH[contract.status] : "—"}</b>
        <Typography component="div" sx={{ mt: 1, fontSize: 13, color: "#555" }}>
          DRAFT → PENDING_SIGN → SIGNED · ระบบจะอัปเดตสถานะอัตโนมัติเมื่อมีเหตุการณ์เกิดขึ้น
        </Typography>
      </DocSection>

      <DocSection number={5} heading="ข้อตกลงทั่วไป">
        คู่สัญญาทั้งสองฝ่ายได้อ่านและเข้าใจข้อความในสัญญาฉบับนี้โดยตลอดแล้ว เห็นว่าตรงตามเจตนารมณ์ของตน
        จึงได้ลงลายมือชื่อไว้เป็นสำคัญต่อหน้าพยาน
      </DocSection>

      <Stack direction="row" spacing={4} sx={{ mt: 6 }}>
        <SignatureBlock partyLabel="ผู้จะขาย" nameOrId={shortId(contract.sellerId, 12) + "…"} date={created} />
        <SignatureBlock partyLabel="ผู้จะซื้อ" nameOrId={shortId(contract.buyerId ?? contract.customerId, 12) + "…"} date={created} />
        <SignatureBlock partyLabel="พยาน" nameOrId="—" />
      </Stack>

      <DocFooter />
    </>
  );
};
