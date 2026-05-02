"use client";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Fill } from "./Fill";
import { formatThaiDate, thaiDateParts, addDays, shortId } from "@/lib/format";
import type { Contract } from "@/lib/types";

const Clause = ({ no, title, children }: { no: string; title: string; children: React.ReactNode }) => (
  <Box sx={{ mb: 2 }}>
    <Typography component="p" sx={{ textIndent: "2.5em", fontSize: 16 }}>
      <b>ข้อ {no}.</b> {title}
    </Typography>
    <Box sx={{ mt: 0.5 }}>{children}</Box>
  </Box>
);

const Para = ({ children, indent = false }: { children: React.ReactNode; indent?: boolean }) => (
  <Typography
    component="p"
    sx={{
      textIndent: indent ? "2.5em" : 0,
      fontSize: 16,
      lineHeight: 1.9,
      m: 0,
      mb: 0.5,
    }}
  >
    {children}
  </Typography>
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

export const ContractDocumentView = ({ contract }: { contract: Contract }) => {
  const dateParts = thaiDateParts(contract.createdAt);
  const transferDate = formatThaiDate(addDays(contract.createdAt, 90));
  const sellerRef = contract.sellerId ?? null;
  const buyerRef = contract.buyerId ?? contract.customerId ?? null;

  return (
    <Box
      sx={{
        fontSize: 16,
        lineHeight: 1.9,
        color: "#000",
      }}
    >
      <Typography
        component="div"
        sx={{ textAlign: "center", fontSize: 22, fontWeight: 700, letterSpacing: 0.5, mb: 3 }}
      >
        สัญญาจะซื้อจะขายอาคารชุด &ldquo;ห้องชุด&rdquo;
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
        ในหนังสือสัญญานี้ &ldquo;ผู้ขาย&rdquo; ให้หมายถึง <Fill width={260} /> อายุ <Fill width={40} /> ปี
        บัตรประจำตัว <Fill width={120} /> เลขที่ <Fill width={180} mono value={sellerRef ? shortId(sellerRef, 16) : ""} />
        {" "}อยู่บ้านเลขที่ <Fill width={80} /> หมู่ที่ <Fill width={50} /> ตรอก/ซอย <Fill width={120} /> ถนน <Fill width={120} /> แขวง/ตำบล <Fill width={120} /> เขต/อำเภอ <Fill width={120} /> จังหวัด <Fill width={140} />
      </Para>

      <Para indent>
        &ldquo;ผู้ซื้อ&rdquo; ให้หมายถึง <Fill width={260} /> อายุ <Fill width={40} /> ปี
        บัตรประจำตัว <Fill width={120} /> เลขที่ <Fill width={180} mono value={buyerRef ? shortId(buyerRef, 16) : ""} />
        {" "}อยู่บ้านเลขที่ <Fill width={80} /> หมู่ที่ <Fill width={50} /> ตรอก/ซอย <Fill width={120} /> ถนน <Fill width={120} /> แขวง/ตำบล <Fill width={120} /> เขต/อำเภอ <Fill width={120} /> จังหวัด <Fill width={140} />
      </Para>

      <Para indent>ผู้ขายและผู้ซื้อตกลงทำสัญญาจะซื้อจะขายกันดังมีข้อความต่อไปนี้</Para>

      <Clause no="1" title="">
        <Para>
          ผู้ขายตกลงจะขาย ผู้ซื้อตกลงจะซื้อห้องชุดเลขที่ <Fill width={180} mono value={contract.unitId ? shortId(contract.unitId, 16) : ""} />
          {" "}ชั้นที่ <Fill width={60} /> อาคารเลขที่ <Fill width={100} /> ชื่ออาคารชุด <Fill width={200} />
          {" "}เนื้อที่ <Fill width={70} /> ตารางเมตร จำนวน <Fill width={50} value="1" /> ห้องชุด
          ซึ่งตั้งอยู่บนเนื้อที่ดินโฉนดที่ <Fill width={100} /> เลขที่ดิน <Fill width={100} />
          {" "}ตำบล <Fill width={120} /> อำเภอ <Fill width={120} /> จังหวัด <Fill width={140} />
        </Para>
      </Clause>

      <Clause no="2" title="">
        <Para>
          นอกจากการซื้อกรรมสิทธิ์ห้องชุดดังกล่าวในข้อ 1. แล้วผู้ซื้อยังมีกรรมสิทธิ์ร่วมในทรัพย์ส่วนกลางตามที่กำหนดไว้ในพระราชบัญญัติอาคารชุด พ.ศ. 2522 ด้วย
        </Para>
      </Clause>

      <Clause no="3" title="การชำระเงิน">
        <Para>
          คู่สัญญาตกลงจะซื้อจะขายห้องชุดในข้อ 1. ในราคา <Fill width={140} /> บาท ( <Fill width={260} /> )
          ราคาซื้อขายนี้เป็นการซื้อขายตามเนื้อที่ที่ปรากฏในหน้าโฉนด
        </Para>
        <Para>
          (1) ชำระในวันทำสัญญานี้จำนวน <Fill width={140} /> บาท ( <Fill width={240} /> )
          โดยจ่ายเป็นเช็คธนาคาร <Fill width={140} /> สาขา <Fill width={120} /> เช็คเลขที่ <Fill width={120} /> ลงวันที่ <Fill width={140} />
          {" "}สั่งจ่ายเงินจำนวน <Fill width={140} /> บาทให้แก่ผู้จะขาย ผู้จะขายได้รับไว้เรียบร้อยแล้ว
          โดยถือเป็นเงินมัดจำ และถือว่าเป็นส่วนหนึ่งของการชำระเงินตามสัญญานี้
        </Para>
        <Para>
          (2) เงินส่วนที่เหลือจำนวน <Fill width={140} /> บาท ( <Fill width={240} /> )
          ผู้จะซื้อจะชำระในวันที่ทำการจดทะเบียนโอนกรรมสิทธิ์ที่ดินดังกล่าว
        </Para>
      </Clause>

      <Clause no="4" title="การจดทะเบียนโอนกรรมสิทธิ์">
        <Para>
          ผู้จะขายตกลงจะไปจดทะเบียนโอนกรรมสิทธิ์ห้องชุดดังกล่าวข้างต้นให้แก่ผู้จะซื้อภายในวันที่{" "}
          <Fill width={200} value={transferDate !== "—" ? transferDate : ""} />
          {" "}โดยผู้จะซื้อต้องชำระเงินส่วนที่เหลือตามข้อ 3 (ข) ให้แก่ผู้จะขาย ณ สำนักงานที่ดิน <Fill width={180} />
          {" "}และผู้จะซื้อตกลงชำระค่านายหน้า ค่าธรรมเนียมค่าอากรและค่าใช้จ่ายต่าง ๆ
          ในการจดทะเบียนโอนกรรมสิทธิ์ รวมทั้งค่าภาษี
        </Para>
      </Clause>

      <Clause no="5" title="คำรับรองของผู้จะขาย">
        <Para>
          ผู้จะขายขอรับรองว่าห้องชุดดังกล่าวจะซื้อขายนี้ไม่มีภาระผูกพันใด ๆ และจะไม่นำห้องชุดนี้ไปก่อภาระผูกพันใด ๆ ทั้งสิ้น
        </Para>
      </Clause>

      <Clause no="6" title="การลงชื่อผู้ถือกรรมสิทธิ์">
        <Para>
          คู่สัญญาตกลงกันว่า ในวันจดทะเบียนโอนกรรมสิทธิ์ ผู้จะขายยินยอมให้ผู้จะซื้อลงชื่อบุคคลใด ๆ
          หรือนิติบุคคลใด ๆ เป็นผู้รับโอนกรรมสิทธิ์ที่ดินตามสัญญานี้ได้
        </Para>
      </Clause>

      <Clause no="7" title="กรณีผิดสัญญา">
        <Para>
          ในกรณีที่ผู้จะซื้อผิดสัญญาไม่ไปจดทะเบียนรับโอนกรรมสิทธิ์ห้องชุดดังกล่าวตามสัญญาและชำระเงินส่วนที่เหลือ
          ก็ให้สัญญานี้เป็นอันเลิกกัน ผู้จะขายมีสิทธิรับเงินที่ได้รับไว้แล้วทั้งหมดได้
        </Para>
        <Para indent>
          ในทำนองเดียวกัน หากผู้จะขายผิดสัญญาไม่ไปจดทะเบียนโอนกรรมสิทธิ์ที่ดินให้แก่ผู้จะซื้อ
          ผู้ซื้อมีสิทธิ์ฟ้องบังคับให้ปฏิบัติตามสัญญา รวมถึงสิทธิเรียกร้องค่าเสียประการอื่นได้
        </Para>
      </Clause>

      <Para indent>
        สัญญานี้ทำขึ้นเป็นสองฉบับ มีข้อความถูกต้องตรงกัน ทั้งสองฝ่ายต่างได้อ่านและเข้าใจข้อความโดยตลอดคดีแล้ว
        เห็นว่าถูกต้องตรงตามเจตนา เพื่อเป็นหลักฐานจึงได้ลงลายมือชื่อไว้เป็นสำคัญ
      </Para>

      <Box sx={{ mt: 6 }}>
        <SignatureLine role="ผู้จะขาย" refId={sellerRef} />
        <SignatureLine role="ผู้จะซื้อ" refId={buyerRef} />
        <SignatureLine role="พยาน" />
        <SignatureLine role="พยาน" />
      </Box>

      <Typography component="div" sx={{ mt: 4, fontSize: 11, color: "#888", textAlign: "center" }}>
        เอกสารฉบับนี้สร้างจากระบบ Real Estate Portal · Contract ID {contract.contractId ?? "—"}
      </Typography>
    </Box>
  );
};
