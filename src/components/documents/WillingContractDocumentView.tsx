"use client";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Fill } from "./Fill";
import { formatThaiDate, thaiDateParts, shortId } from "@/lib/format";
import type { Acquisition } from "@/lib/types";

const Para = ({ children, indent = false }: { children: React.ReactNode; indent?: boolean }) => (
  <Typography
    component="p"
    sx={{ textIndent: indent ? "2.5em" : 0, fontSize: 16, lineHeight: 1.9, m: 0, mb: 0.5 }}
  >
    {children}
  </Typography>
);

const Clause = ({ no, title, children }: { no: string; title: string; children: React.ReactNode }) => (
  <Box sx={{ mb: 2 }}>
    <Typography component="p" sx={{ textIndent: "2.5em", fontSize: 16 }}>
      <b>ข้อ {no}.</b> {title}
    </Typography>
    <Box sx={{ mt: 0.5 }}>{children}</Box>
  </Box>
);

const SignatureLine = ({ role, refId }: { role: string; refId?: string | null }) => (
  <Stack spacing={0.25} sx={{ alignItems: "flex-end", mb: 1.5 }}>
    <Typography component="div" sx={{ fontSize: 16 }}>
      ลงชื่อ <Fill width={200} value="" /> {role}
    </Typography>
    <Typography component="div" sx={{ fontSize: 15 }}>
      ( <Fill width={180} mono value={refId ? shortId(refId, 16) : ""} /> )
    </Typography>
  </Stack>
);

export const WillingContractDocumentView = ({ acquisition }: { acquisition: Acquisition }) => {
  const wc = acquisition.willingContract;
  const drafted = wc?.draftedAt ?? acquisition.createdAt;
  const dateParts = thaiDateParts(drafted);
  const approvedDate = formatThaiDate(acquisition.approvedAt);

  const priceDisplay = wc?.agreedPrice != null ? wc.agreedPrice.toLocaleString() : "";
  const estimatedDisplay = acquisition.estimatedValue != null ? acquisition.estimatedValue.toLocaleString() : "";

  return (
    <Box sx={{ fontSize: 16, lineHeight: 1.9, color: "#000" }}>
      <Typography
        component="div"
        sx={{ textAlign: "center", fontSize: 22, fontWeight: 700, letterSpacing: 0.5, mb: 3 }}
      >
        หนังสือแสดงเจตจำนงในการซื้อขายอสังหาริมทรัพย์
      </Typography>

      <Stack spacing={0.5} sx={{ alignItems: "flex-end", mb: 3 }}>
        <Typography component="div">
          ทำที่ <Fill width={260} value="สำนักงานบริษัท Real Estate จำกัด" />
        </Typography>
        <Typography component="div">
          วันที่ <Fill width={50} value={dateParts?.day} /> เดือน <Fill width={120} value={dateParts?.month} /> พ.ศ. <Fill width={70} value={dateParts?.year} />
        </Typography>
      </Stack>

      <Para indent>
        ในหนังสือฉบับนี้ &ldquo;ผู้แสดงเจตจำนง&rdquo; (ผู้จะขาย) ให้หมายถึง <Fill width={260} value={acquisition.sellerName ?? ""} />
        {" "}เลขประจำตัว <Fill width={180} mono value={acquisition.sellerId ? shortId(acquisition.sellerId, 16) : ""} />
        {" "}อยู่ที่ <Fill width={320} /> และ &ldquo;ผู้รับเจตจำนง&rdquo; ให้หมายถึง บริษัท Real Estate จำกัด
        ทั้งสองฝ่ายตกลงกันดังมีข้อความต่อไปนี้
      </Para>

      <Clause no="1" title="รายละเอียดทรัพย์สินที่จะซื้อขาย">
        <Para>
          ผู้แสดงเจตจำนงเป็นเจ้าของทรัพย์สินซึ่งมีรายละเอียดดังนี้ ที่อยู่ <Fill width={360} value={acquisition.address ?? ""} block />
        </Para>
        <Para>
          เลขที่ทรัพย์ <Fill width={180} mono value={acquisition.propertyId ? shortId(acquisition.propertyId, 16) : ""} />
          {" "}เลขที่การสำรวจ <Fill width={180} mono value={acquisition.surveyId ? shortId(acquisition.surveyId, 16) : ""} />
          {" "}เนื้อที่ <Fill width={80} value={acquisition.areaSqm != null ? acquisition.areaSqm.toString() : ""} /> ตารางเมตร
          {" "}ประเภทพื้นที่ <Fill width={140} value={acquisition.zoneType ?? ""} />
        </Para>
      </Clause>

      <Clause no="2" title="ราคาประเมินและราคาที่ตกลง">
        <Para>
          ราคาประเมินของทรัพย์สินตามผลการสำรวจคือ <Fill width={140} value={estimatedDisplay} /> บาท
          และคู่สัญญาตกลงราคาซื้อขายเบื้องต้นที่ <Fill width={140} value={priceDisplay} /> บาท
          ( <Fill width={260} /> ) โดยราคานี้ยังอยู่ภายใต้การตรวจสอบเอกสารสิทธิ์และการอนุมัติของบริษัทฯ
        </Para>
      </Clause>

      <Clause no="3" title="สถานะของกระบวนการ">
        <Para>
          ขณะออกหนังสือฉบับนี้ acquisition มีสถานะ <Fill width={180} value={acquisition.status ?? ""} mono />
          {acquisition.approvedAt ? (
            <>
              {" "}และได้รับการอนุมัติเมื่อวันที่ <Fill width={200} value={approvedDate !== "—" ? approvedDate : ""} />
            </>
          ) : null}
        </Para>
      </Clause>

      <Clause no="4" title="คำรับรองของผู้แสดงเจตจำนง">
        <Para>
          ผู้แสดงเจตจำนงขอรับรองว่า เป็นเจ้าของกรรมสิทธิ์อย่างถูกต้องในทรัพย์สินดังกล่าว ทรัพย์ไม่ติดภาระผูกพันใด ๆ
          และยินยอมให้บริษัทฯ ตรวจสอบเอกสารสิทธิ์เพื่อจัดทำสัญญาจะซื้อจะขายฉบับสมบูรณ์ในลำดับต่อไป
        </Para>
      </Clause>

      <Clause no="5" title="การยกเลิก">
        <Para>
          หากผลการตรวจสอบพบว่าทรัพย์สินไม่เป็นไปตามที่แสดงเจตจำนงไว้ บริษัทฯ มีสิทธิ์ยกเลิกหนังสือฉบับนี้
          โดยไม่ต้องเสียค่าใช้จ่ายใด ๆ
        </Para>
      </Clause>

      <Para indent>
        ทั้งสองฝ่ายได้อ่านและเข้าใจข้อความในหนังสือฉบับนี้โดยตลอดแล้ว เห็นว่าถูกต้องตรงตามเจตนา
        จึงได้ลงลายมือชื่อไว้เป็นสำคัญ
      </Para>

      <Box sx={{ mt: 6 }}>
        <SignatureLine role="ผู้แสดงเจตจำนง (ผู้จะขาย)" refId={acquisition.sellerId} />
        <SignatureLine role="ตัวแทนบริษัทฯ" />
        <SignatureLine role="พยาน" />
        <SignatureLine role="พยาน" />
      </Box>

      <Typography component="div" sx={{ mt: 4, fontSize: 11, color: "#888", textAlign: "center" }}>
        เอกสารฉบับนี้สร้างจากระบบ Real Estate Portal · Acquisition ID {acquisition.acquisitionId ?? "—"}
      </Typography>
    </Box>
  );
};
