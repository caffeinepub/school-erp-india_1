import {
  BookOpen,
  Calendar,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  MessageSquare,
  Plus,
  Printer,
  ScrollText,
  Search,
  Trash2,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// ─── Number to Words Helper ──────────────────────────────────────────────────
function numberToWords(num: number): string {
  if (num === 0) return "Zero";
  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tensArr = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];
  function twoDigits(v: number): string {
    if (v < 20) return ones[v];
    return (
      tensArr[Math.floor(v / 10)] + (v % 10 !== 0 ? ` ${ones[v % 10]}` : "")
    );
  }
  function threeDigits(v: number): string {
    if (v >= 100)
      return `${ones[Math.floor(v / 100)]} Hundred${v % 100 !== 0 ? ` ${twoDigits(v % 100)}` : ""}`;
    return twoDigits(v);
  }
  let result = "";
  let rem = num;
  if (rem >= 10000000) {
    result += `${threeDigits(Math.floor(rem / 10000000))} Crore `;
    rem %= 10000000;
  }
  if (rem >= 100000) {
    result += `${threeDigits(Math.floor(rem / 100000))} Lakh `;
    rem %= 100000;
  }
  if (rem >= 1000) {
    result += `${threeDigits(Math.floor(rem / 1000))} Thousand `;
    rem %= 1000;
  }
  if (rem > 0) result += threeDigits(rem);
  return result.trim();
}

// ─── Receipt Print Modal ──────────────────────────────────────────────────────

interface ReceiptPrintModalProps {
  open: boolean;
  onClose: () => void;
  receiptNo: string;
  date: string;
  student: {
    admNo: string;
    name: string;
    fatherName?: string;
    className: string;
    rollNo: string;
    contact: string;
  } | null;
  selectedMonths: string[];
  feeRows: Array<{
    feeHead: string;
    months: Record<string, number>;
    checked: boolean;
  }>;
  totalFees: number;
  otherTotal: number;
  concessionAmt: number;
  netFees: number;
  receiptAmt: number;
  section?: string;
  sid?: string;
  regNo?: string;
  sess?: string;
  motherName?: string;
  paymentMode?: string;
  otherChargeType?: string;
  sessionDues?: number;
}

function ReceiptPrintModal({
  open,
  onClose,
  receiptNo,
  date,
  student,
  selectedMonths,
  feeRows,
  totalFees: _totalFees,
  otherTotal,
  concessionAmt,
  netFees,
  receiptAmt,
  section,
  sid,
  regNo,
  sess,
  motherName,
  paymentMode: receiptPaymentMode,
  otherChargeType,
  sessionDues,
}: ReceiptPrintModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<1 | 2 | 3 | 4>(1);
  if (!open) return null;

  const schoolName = (() => {
    try {
      return (
        JSON.parse(localStorage.getItem("erp_school_profile") || "{}").name ||
        "Delhi Public School"
      );
    } catch {
      return "Delhi Public School";
    }
  })();
  const schoolAddress = (() => {
    try {
      return (
        JSON.parse(localStorage.getItem("erp_school_profile") || "{}")
          .address || "Sector 14, Dwarka, New Delhi"
      );
    } catch {
      return "Sector 14, Dwarka, New Delhi";
    }
  })();

  const rowsForPrint = feeRows.filter(
    (r) =>
      r.checked &&
      selectedMonths.reduce((s, m) => s + (r.months[m] || 0), 0) > 0,
  );
  const monthsLabel = selectedMonths.join(", ");

  const printReceipt = () => {
    const el = document.getElementById("fee-receipt-print-area");
    if (!el) return;
    const isBharatiFormat = selectedTemplate === 4;
    const win = window.open(
      "",
      "_blank",
      isBharatiFormat ? "width=420,height=580" : "width=800,height=600",
    );
    if (!win) return;
    const pageStyle = isBharatiFormat
      ? "@page { size: 105mm 145mm; margin: 0; } body { margin: 0; padding: 0; width: 105mm; overflow: hidden; display: block; }"
      : "@page { margin: 10mm; } body { margin: 0; font-family: Arial, sans-serif; }";
    win.document.write(`<html><head><title>Fee Receipt - ${receiptNo}</title><style>
      ${pageStyle}
      * { box-sizing: border-box; }
      body { margin: 0; padding: 0; display: block; }
      table { border-collapse: collapse; width: 100%; }
      th, td { border: 1px solid #ccc; padding: 4px 8px; font-size: 11px; }
      th { background: #f0f2f5; font-weight: 600; }
      .dashed { border-top: 2px dashed #999; margin: 8px 0; }
    </style></head><body><div style="margin:0;padding:0;">${el.innerHTML}</div></body></html>`);
    win.document.close();
    win.focus();
    setTimeout(() => {
      win.print();
      win.close();
    }, 400);
  };

  const renderTemplate1 = () => (
    <div
      style={{
        background: "#fff",
        padding: 16,
        fontFamily: "Arial, sans-serif",
        fontSize: 11,
        color: "#1a1a1a",
        minWidth: 500,
      }}
    >
      <div
        style={{
          textAlign: "center",
          marginBottom: 8,
          borderBottom: "2px solid #1e3a5f",
          paddingBottom: 8,
        }}
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: 16,
            color: "#1e3a5f",
            letterSpacing: 1,
          }}
        >
          {schoolName.toUpperCase()}
        </div>
        <div style={{ fontSize: 10, color: "#6b7280" }}>{schoolAddress}</div>
        <div
          style={{
            fontWeight: 700,
            fontSize: 13,
            marginTop: 6,
            color: "#374151",
          }}
        >
          FEE RECEIPT
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 8,
          fontSize: 10,
        }}
      >
        <span>
          <b>Receipt No.:</b> {receiptNo}
        </span>
        <span>
          <b>Date:</b> {date}
        </span>
      </div>
      {student && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "2px 16px",
            marginBottom: 10,
            fontSize: 10,
          }}
        >
          <span>
            <b>Adm. No.:</b> {student.admNo}
          </span>
          <span>
            <b>Class:</b> {student.className}
          </span>
          <span>
            <b>Name:</b> {student.name}
          </span>
          <span>
            <b>Roll No.:</b> {student.rollNo}
          </span>
          <span>
            <b>Father:</b> {student.fatherName || "-"}
          </span>
          <span>
            <b>Months:</b> {monthsLabel || "-"}
          </span>
        </div>
      )}
      <table style={{ marginBottom: 8 }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left" }}>Fee Head</th>
            <th style={{ textAlign: "right" }}>Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          {rowsForPrint.map((r) => {
            const total = selectedMonths.reduce(
              (s, m) => s + (r.months[m] || 0),
              0,
            );
            return (
              <tr key={r.feeHead}>
                <td>{r.feeHead}</td>
                <td style={{ textAlign: "right" }}>
                  ₹{total.toLocaleString("en-IN")}
                </td>
              </tr>
            );
          })}
          {otherTotal > 0 && (
            <tr>
              <td>{otherChargeType || "Other Charges"}</td>
              <td style={{ textAlign: "right" }}>
                ₹{otherTotal.toLocaleString("en-IN")}
              </td>
            </tr>
          )}
          {concessionAmt > 0 && (
            <tr>
              <td style={{ color: "#16a34a" }}>Concession</td>
              <td style={{ textAlign: "right", color: "#16a34a" }}>
                - ₹{concessionAmt.toLocaleString("en-IN")}
              </td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr style={{ background: "#e8f0fe" }}>
            <td>
              <b>Net Fees</b>
            </td>
            <td style={{ textAlign: "right" }}>
              <b>₹{netFees.toLocaleString("en-IN")}</b>
            </td>
          </tr>
          <tr style={{ background: "#d1fae5" }}>
            <td>
              <b>Amount Received</b>
            </td>
            <td style={{ textAlign: "right" }}>
              <b>₹{receiptAmt.toLocaleString("en-IN")}</b>
            </td>
          </tr>
        </tfoot>
      </table>
      {sessionDues !== undefined && sessionDues > 0 && (
        <div
          style={{
            fontSize: 10,
            marginTop: 8,
            padding: "4px 8px",
            background: "#fff3cd",
            border: "1px solid #f59e0b",
            borderRadius: 4,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontWeight: 700 }}>Session Total Dues:</span>
          <span style={{ fontWeight: 700, color: "#dc2626" }}>
            ₹{sessionDues.toLocaleString("en-IN")}
          </span>
        </div>
      )}
      <div
        style={{
          fontSize: 10,
          marginTop: 16,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>Date: _____________</span>
        <span>Received by: _____________</span>
      </div>
    </div>
  );

  const renderTemplate2 = () => {
    const copyBlock = (label: string) => (
      <div
        style={{
          background: "#fff",
          padding: 12,
          fontFamily: "Arial, sans-serif",
          fontSize: 10,
          color: "#1a1a1a",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: 6,
            borderBottom: "1px solid #ccc",
            paddingBottom: 4,
          }}
        >
          <b style={{ fontSize: 13, color: "#1e3a5f" }}>{schoolName}</b>
          <div style={{ color: "#6b7280", fontSize: 9 }}>{schoolAddress}</div>
          <b style={{ fontSize: 11 }}>FEE RECEIPT</b>
          <span
            style={{
              float: "right",
              background: "#e0f0ff",
              padding: "1px 6px",
              borderRadius: 2,
              fontSize: 9,
            }}
          >
            {label}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 4,
          }}
        >
          <span>
            <b>Receipt:</b> {receiptNo}
          </span>
          <span>
            <b>Date:</b> {date}
          </span>
        </div>
        {student && (
          <div style={{ marginBottom: 4 }}>
            <b>Student:</b> {student.name} | <b>Adm No:</b> {student.admNo} |{" "}
            <b>Class:</b> {student.className}
          </div>
        )}
        <div style={{ marginBottom: 4 }}>
          <b>Months:</b> {monthsLabel || "-"}
        </div>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 9,
            marginBottom: 6,
          }}
        >
          <tbody>
            {rowsForPrint.map((r) => {
              const total = selectedMonths.reduce(
                (s, m) => s + (r.months[m] || 0),
                0,
              );
              return (
                <tr key={r.feeHead}>
                  <td
                    style={{ borderBottom: "1px solid #eee", padding: "1px 0" }}
                  >
                    {r.feeHead}
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    ₹{total.toLocaleString("en-IN")}
                  </td>
                </tr>
              );
            })}
            {otherTotal > 0 && (
              <tr key="other-charges">
                <td
                  style={{ borderBottom: "1px solid #eee", padding: "1px 0" }}
                >
                  {otherChargeType || "Other Charges"}
                </td>
                <td
                  style={{ textAlign: "right", borderBottom: "1px solid #eee" }}
                >
                  ₹{otherTotal.toLocaleString("en-IN")}
                </td>
              </tr>
            )}
            <tr style={{ fontWeight: 700, borderTop: "2px solid #1e3a5f" }}>
              <td>Amount Paid</td>
              <td style={{ textAlign: "right" }}>
                ₹{receiptAmt.toLocaleString("en-IN")}
              </td>
            </tr>
          </tbody>
        </table>
        <div
          style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}
        >
          <span style={{ fontSize: 9 }}>Cashier Signature: ___________</span>
        </div>
      </div>
    );
    return (
      <div>
        {copyBlock("SCHOOL COPY")}
        <div
          style={{
            borderTop: "2px dashed #999",
            margin: "8px 0",
            textAlign: "center",
            fontSize: 9,
            color: "#999",
          }}
        >
          ✂ cut here
        </div>
        {copyBlock("STUDENT COPY")}
      </div>
    );
  };

  const renderTemplate3 = () => (
    <div
      style={{
        background: "#fff",
        fontFamily: "Arial, sans-serif",
        fontSize: 11,
        color: "#1a1a1a",
        minWidth: 500,
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg,#1e3a5f,#1565c0)",
          padding: "16px 20px",
          color: "#fff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 44,
              height: 44,
              background: "rgba(255,255,255,0.2)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
            }}
          >
            🏫
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, letterSpacing: 0.5 }}>
              {schoolName.toUpperCase()}
            </div>
            <div style={{ fontSize: 9, opacity: 0.8 }}>{schoolAddress}</div>
          </div>
          <div style={{ marginLeft: "auto", textAlign: "right" }}>
            <div style={{ fontWeight: 700, fontSize: 18, letterSpacing: 2 }}>
              FEE RECEIPT
            </div>
            <div style={{ fontSize: 10, opacity: 0.85 }}>{receiptNo}</div>
          </div>
        </div>
      </div>
      <div style={{ padding: 16 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
            marginBottom: 12,
            background: "#f8faff",
            padding: 10,
            borderRadius: 6,
            fontSize: 10,
          }}
        >
          {student && (
            <>
              <div>
                <span style={{ color: "#6b7280" }}>Student Name</span>
                <br />
                <b>{student.name}</b>
              </div>
              <div>
                <span style={{ color: "#6b7280" }}>Adm. No.</span>
                <br />
                <b>{student.admNo}</b>
              </div>
              <div>
                <span style={{ color: "#6b7280" }}>Class</span>
                <br />
                <b>{student.className}</b>
              </div>
              <div>
                <span style={{ color: "#6b7280" }}>Date</span>
                <br />
                <b>{date}</b>
              </div>
              <div>
                <span style={{ color: "#6b7280" }}>Father Name</span>
                <br />
                <b>{student.fatherName || "-"}</b>
              </div>
              <div>
                <span style={{ color: "#6b7280" }}>Months</span>
                <br />
                <b>{monthsLabel || "-"}</b>
              </div>
            </>
          )}
        </div>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: 8,
            fontSize: 11,
          }}
        >
          <thead>
            <tr style={{ background: "#e8f0fe" }}>
              <th
                style={{
                  textAlign: "left",
                  padding: "6px 8px",
                  border: "1px solid #dde6f4",
                }}
              >
                Fee Head
              </th>
              <th
                style={{
                  textAlign: "right",
                  padding: "6px 8px",
                  border: "1px solid #dde6f4",
                }}
              >
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {rowsForPrint.map((r, i) => {
              const total = selectedMonths.reduce(
                (s, m) => s + (r.months[m] || 0),
                0,
              );
              return (
                <tr
                  key={r.feeHead}
                  style={{ background: i % 2 === 0 ? "#fff" : "#f8faff" }}
                >
                  <td style={{ padding: "5px 8px", border: "1px solid #eee" }}>
                    {r.feeHead}
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      padding: "5px 8px",
                      border: "1px solid #eee",
                    }}
                  >
                    ₹{total.toLocaleString("en-IN")}
                  </td>
                </tr>
              );
            })}
            {otherTotal > 0 && (
              <tr>
                <td style={{ padding: "5px 8px", border: "1px solid #eee" }}>
                  {otherChargeType || "Other Charges"}
                </td>
                <td
                  style={{
                    textAlign: "right",
                    padding: "5px 8px",
                    border: "1px solid #eee",
                  }}
                >
                  ₹{otherTotal.toLocaleString("en-IN")}
                </td>
              </tr>
            )}
            {concessionAmt > 0 && (
              <tr>
                <td
                  style={{
                    padding: "5px 8px",
                    border: "1px solid #eee",
                    color: "#16a34a",
                  }}
                >
                  Concession
                </td>
                <td
                  style={{
                    textAlign: "right",
                    padding: "5px 8px",
                    border: "1px solid #eee",
                    color: "#16a34a",
                  }}
                >
                  - ₹{concessionAmt.toLocaleString("en-IN")}
                </td>
              </tr>
            )}
            <tr style={{ background: "#1e3a5f", color: "#fff" }}>
              <td style={{ padding: "7px 8px", fontWeight: 700 }}>
                Amount Received
              </td>
              <td
                style={{
                  textAlign: "right",
                  padding: "7px 8px",
                  fontWeight: 700,
                  fontSize: 13,
                }}
              >
                ₹{receiptAmt.toLocaleString("en-IN")}
              </td>
            </tr>
          </tbody>
        </table>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 12,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              border: "1.5px dashed #94a3b8",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 9,
              color: "#94a3b8",
              textAlign: "center",
            }}
          >
            OFFICIAL
            <br />
            SEAL
          </div>
          <div style={{ textAlign: "right", fontSize: 10 }}>
            <div style={{ marginBottom: 20 }}>Authorized Signature</div>
            <div
              style={{ borderTop: "1px solid #333", paddingTop: 4, width: 140 }}
            >
              Cashier / Accountant
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTemplate4 = () => {
    const schoolProfile = (() => {
      try {
        return JSON.parse(localStorage.getItem("erp_school_profile") || "{}");
      } catch {
        return {};
      }
    })();
    const t4SchoolName = schoolProfile.name || "School Name";
    const t4Address = schoolProfile.address || "";
    const t4Website = schoolProfile.website || "www.DigitalSchoolERP.com";
    const t4SchoolCode = schoolProfile.schoolCode || schoolProfile.code || "";
    const t4Mobile = schoolProfile.mobile || schoolProfile.phone || "";
    const t4AffiliationNo =
      schoolProfile.affiliationNo || schoolProfile.affiliation || "";
    const t4SchoolNo = schoolProfile.schoolNo || "";

    const checkedRowsT4 = feeRows.filter(
      (r) =>
        r.checked &&
        selectedMonths.reduce((s, m) => s + (r.months[m] || 0), 0) > 0,
    );
    const monthsCount = selectedMonths.length;
    const monthsLabelT4 = selectedMonths.join(" ");
    const balance = netFees - receiptAmt;
    const amountInWords = numberToWords(receiptAmt);

    // Inline SVG logo - floral/lotus motif
    const logoSvg = (
      <svg
        width="40"
        height="40"
        viewBox="0 0 50 50"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="25" cy="25" r="5" fill="#c00" />
        <ellipse cx="25" cy="12" rx="4" ry="8" fill="#c00" opacity="0.8" />
        <ellipse cx="25" cy="38" rx="4" ry="8" fill="#c00" opacity="0.8" />
        <ellipse cx="12" cy="25" rx="8" ry="4" fill="#2d7a2d" opacity="0.8" />
        <ellipse cx="38" cy="25" rx="8" ry="4" fill="#2d7a2d" opacity="0.8" />
        <ellipse
          cx="15"
          cy="15"
          rx="4"
          ry="8"
          fill="#c00"
          opacity="0.6"
          transform="rotate(-45 15 15)"
        />
        <ellipse
          cx="35"
          cy="35"
          rx="4"
          ry="8"
          fill="#c00"
          opacity="0.6"
          transform="rotate(-45 35 35)"
        />
        <ellipse
          cx="35"
          cy="15"
          rx="4"
          ry="8"
          fill="#2d7a2d"
          opacity="0.6"
          transform="rotate(45 35 15)"
        />
        <ellipse
          cx="15"
          cy="35"
          rx="4"
          ry="8"
          fill="#2d7a2d"
          opacity="0.6"
          transform="rotate(45 15 35)"
        />
        <circle cx="25" cy="25" r="4" fill="#fff" />
        <circle cx="25" cy="25" r="2" fill="#c00" />
      </svg>
    );

    // Scannable QR code with receipt data
    const qrData = `Receipt:${receiptNo}|Student:${student?.name || ""}|Adm:${student?.admNo || ""}|Class:${student?.className || ""}|Months:${selectedMonths.join(",")}|Amount:${receiptAmt}|Date:${date}|Mode:${receiptPaymentMode || "Cash"}`;
    const qrSvg = (
      <img
        src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(qrData)}`}
        width={55}
        height={55}
        alt="QR Code"
        style={{ border: "1px solid #888" }}
        crossOrigin="anonymous"
      />
    );

    // Student photo placeholder SVG
    const photoSvg = (
      <svg
        width="50"
        height="65"
        viewBox="0 0 60 75"
        xmlns="http://www.w3.org/2000/svg"
        style={{ border: "1px solid #aaa" }}
        aria-hidden="true"
      >
        <rect width="60" height="75" fill="#f0f4ff" />
        <circle cx="30" cy="25" r="12" fill="#9ca3af" />
        <ellipse cx="30" cy="60" rx="18" ry="14" fill="#9ca3af" />
      </svg>
    );

    return (
      <div
        style={{
          background: "#fff",
          fontFamily: "Arial, sans-serif",
          fontSize: 10,
          color: "#1a1a1a",
          border: "1px solid #888",
          width: "397px",
          height: "549px",
          minWidth: "397px",
          maxWidth: "397px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            padding: "8px 10px 6px 10px",
            borderBottom: "1px solid #bbb",
            gap: 10,
          }}
        >
          <div style={{ flexShrink: 0 }}>{logoSvg}</div>
          <div style={{ flex: 1, textAlign: "center" }}>
            <div
              style={{
                fontWeight: 700,
                fontSize: 15,
                color: "#c00",
                letterSpacing: 0.5,
                lineHeight: 1.2,
              }}
            >
              {t4SchoolName}
            </div>
            <div style={{ fontSize: 11, color: "#1a1a1a", marginTop: 2 }}>
              {t4Address}
            </div>
            <div style={{ fontSize: 10, color: "#2d7a2d", marginTop: 1 }}>
              {t4Website}
            </div>
            <div style={{ fontSize: 9, color: "#555", marginTop: 2 }}>
              {t4SchoolCode ? `Sch. Code: ${t4SchoolCode}` : ""}
              {t4SchoolCode && t4Mobile ? " | " : ""}
              {t4Mobile ? `Mob: ${t4Mobile}` : ""}
            </div>
            <div style={{ fontSize: 9, color: "#555", marginTop: 1 }}>
              {t4AffiliationNo ? `Affiliation No: ${t4AffiliationNo}` : ""}
              {t4AffiliationNo && t4SchoolNo ? " | " : ""}
              {t4SchoolNo ? `School No: ${t4SchoolNo}` : ""}
            </div>
          </div>
          <div style={{ flexShrink: 0, textAlign: "right" }}>
            <div
              style={{
                fontWeight: 700,
                fontSize: 11,
                color: "#1a1a1a",
                border: "1px solid #888",
                padding: "2px 6px",
                borderRadius: 2,
              }}
            >
              FEES RECEIPT
            </div>
            <div style={{ fontSize: 9, color: "#555", marginTop: 3 }}>
              Receipt No: {receiptNo}
            </div>
          </div>
        </div>

        {/* Student Info Block */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            padding: "6px 10px",
            borderBottom: "1px solid #bbb",
            gap: 8,
          }}
        >
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "2px 10px",
                marginBottom: 4,
                fontSize: 10,
              }}
            >
              <span>
                <b>R.No:</b> {student?.rollNo || "-"}
              </span>
              <span>
                <b>Date:</b> {date}
              </span>
              <span>
                <b>Class:</b> {student?.className || "-"}
              </span>
              <span>
                <b>Sec.:</b> {section || "A"}
              </span>
              <span>
                <b>SID:</b> {sid || student?.admNo || "-"}
              </span>
              <span>
                <b>Reg.:</b> {regNo || "-"}
              </span>
              <span>
                <b>Sess.:</b> {sess || "2025-26"}
              </span>
            </div>
            <div style={{ marginBottom: 2, fontSize: 10 }}>
              <span
                style={{ display: "inline-block", width: 60, color: "#555" }}
              >
                Student:
              </span>
              <b style={{ color: "#1a3a8f" }}>{student?.name || "-"}</b>
            </div>
            <div style={{ marginBottom: 2, fontSize: 10 }}>
              <span
                style={{ display: "inline-block", width: 60, color: "#555" }}
              >
                Father:
              </span>
              <b style={{ color: "#1a3a8f" }}>{student?.fatherName || "-"}</b>
            </div>
            <div style={{ marginBottom: 2, fontSize: 10 }}>
              <span
                style={{ display: "inline-block", width: 60, color: "#555" }}
              >
                Mother:
              </span>
              <b style={{ color: "#1a3a8f" }}>{motherName || "-"}</b>
            </div>
          </div>
          <div style={{ flexShrink: 0 }}>{photoSvg}</div>
        </div>

        {/* Months Highlight */}
        <div
          style={{
            padding: "5px 10px",
            borderBottom: "1px solid #bbb",
            textAlign: "center",
          }}
        >
          <span style={{ color: "#c00", fontWeight: 700, fontSize: 12 }}>
            ▶ {monthsLabelT4} ({monthsCount} month{monthsCount !== 1 ? "s" : ""}
            ) ◀
          </span>
        </div>

        {/* Fee Table + QR */}
        <div style={{ display: "flex", borderBottom: "1px solid #bbb" }}>
          <div style={{ flex: 1 }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 10,
              }}
            >
              <thead>
                <tr style={{ background: "#f0f2f5" }}>
                  <th
                    style={{
                      border: "1px solid #bbb",
                      padding: "4px 6px",
                      textAlign: "center",
                      width: 28,
                    }}
                  >
                    Sr.
                  </th>
                  <th
                    style={{
                      border: "1px solid #bbb",
                      padding: "4px 6px",
                      textAlign: "left",
                    }}
                  >
                    PARTICULARS
                  </th>
                  <th
                    style={{
                      border: "1px solid #bbb",
                      padding: "4px 6px",
                      textAlign: "right",
                      width: 70,
                    }}
                  >
                    AMOUNT
                  </th>
                </tr>
              </thead>
              <tbody>
                {checkedRowsT4.map((r, i) => {
                  const total = selectedMonths.reduce(
                    (s, m) => s + (r.months[m] || 0),
                    0,
                  );
                  return (
                    <tr key={r.feeHead}>
                      <td
                        style={{
                          border: "1px solid #ddd",
                          padding: "3px 6px",
                          textAlign: "center",
                        }}
                      >
                        {i + 1}
                      </td>
                      <td
                        style={{ border: "1px solid #ddd", padding: "3px 6px" }}
                      >
                        {r.feeHead}
                      </td>
                      <td
                        style={{
                          border: "1px solid #ddd",
                          padding: "3px 6px",
                          textAlign: "right",
                        }}
                      >
                        {total.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  );
                })}
                {otherTotal > 0 && (
                  <tr>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "3px 6px",
                        textAlign: "center",
                      }}
                    >
                      {checkedRowsT4.length + 1}
                    </td>
                    <td
                      style={{ border: "1px solid #ddd", padding: "3px 6px" }}
                    >
                      {otherChargeType || "Other Charges"}
                    </td>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "3px 6px",
                        textAlign: "right",
                      }}
                    >
                      {otherTotal.toLocaleString("en-IN")}
                    </td>
                  </tr>
                )}
                {concessionAmt > 0 && (
                  <tr>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "3px 6px",
                        textAlign: "center",
                      }}
                    >
                      -
                    </td>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "3px 6px",
                        color: "#16a34a",
                      }}
                    >
                      Concession
                    </td>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "3px 6px",
                        textAlign: "right",
                        color: "#16a34a",
                      }}
                    >
                      -{concessionAmt.toLocaleString("en-IN")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div
            style={{
              flexShrink: 0,
              padding: "8px 8px",
              borderLeft: "1px solid #bbb",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
            }}
          >
            {qrSvg}
            <div style={{ fontSize: 8, color: "#888", textAlign: "center" }}>
              Scan QR
            </div>
          </div>
        </div>

        {/* Summary */}
        <div style={{ padding: "6px 10px", borderBottom: "1px solid #bbb" }}>
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 10 }}
          >
            <tbody>
              <tr>
                <td style={{ padding: "2px 6px", color: "#555" }}>Total Fee</td>
                <td
                  style={{
                    padding: "2px 6px",
                    textAlign: "right",
                    fontWeight: 600,
                  }}
                >
                  {netFees.toLocaleString("en-IN")}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "2px 6px", color: "#555" }}>Net Fee</td>
                <td
                  style={{
                    padding: "2px 6px",
                    textAlign: "right",
                    fontWeight: 700,
                    color: "#1a3a8f",
                  }}
                >
                  {netFees.toLocaleString("en-IN")}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "2px 6px", color: "#555" }}>
                  Amount Received
                </td>
                <td
                  style={{
                    padding: "2px 6px",
                    textAlign: "right",
                    fontWeight: 700,
                    color: "#16a34a",
                  }}
                >
                  {receiptAmt.toLocaleString("en-IN")}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "2px 6px", color: "#555" }}>Balance</td>
                <td
                  style={{
                    padding: "2px 6px",
                    textAlign: "right",
                    fontWeight: 700,
                    color: "#c00",
                  }}
                >
                  {balance.toLocaleString("en-IN")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            padding: "6px 10px",
            fontSize: 10,
          }}
        >
          <div>
            <div>
              <b>Received In:</b> {receiptPaymentMode || "Cash"}
            </div>
            <div style={{ marginTop: 2 }}>
              <b>Paid Amount:</b> ₹ {receiptAmt.toLocaleString("en-IN")}
            </div>
            <div style={{ marginTop: 2, color: "#555" }}>
              (₹ {amountInWords} only)
            </div>
          </div>
          <div style={{ textAlign: "right", paddingTop: 4 }}>
            <div>Received By: ................</div>
          </div>
        </div>
      </div>
    );
  };

  const templates = [
    {
      id: 1 as const,
      label: "Simple / Plain",
      desc: "Clean letterhead with fee table",
    },
    {
      id: 2 as const,
      label: "Duplicate Copy",
      desc: "School copy + Student copy with cut line",
    },
    {
      id: 3 as const,
      label: "Modern Branded",
      desc: "Colored header, two-column layout",
    },
    {
      id: 4 as const,
      label: "Bharati Format",
      desc: "Professional format with logo, QR & detailed fields",
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div
        className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        data-ocid="collect.print.modal"
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-700 flex-shrink-0">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <Printer size={15} /> Print Fee Receipt — Select Template
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
            data-ocid="collect.print.close_button"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex gap-2 px-5 py-3 border-b border-gray-700 flex-shrink-0">
          {templates.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelectedTemplate(t.id)}
              className={`flex-1 p-2 rounded border text-xs text-left transition ${selectedTemplate === t.id ? "border-blue-500 bg-blue-900/30 text-white" : "border-gray-600 text-gray-400 hover:border-gray-400"}`}
              data-ocid={`collect.template.${t.id}.toggle`}
            >
              <div className="font-semibold mb-0.5">{t.label}</div>
              <div className="text-[10px] opacity-70">{t.desc}</div>
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-auto p-5">
          <div
            id="fee-receipt-print-area"
            className="bg-white rounded shadow-lg mx-auto"
            style={{ maxWidth: 560 }}
          >
            {selectedTemplate === 1 && renderTemplate1()}
            {selectedTemplate === 2 && renderTemplate2()}
            {selectedTemplate === 3 && renderTemplate3()}
            {selectedTemplate === 4 && renderTemplate4()}
          </div>
        </div>
        <div className="flex gap-2 px-5 py-3 border-t border-gray-700 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded border border-gray-600 text-gray-400 text-sm hover:text-white transition"
            data-ocid="collect.print.cancel_button"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={printReceipt}
            className="flex-1 px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold flex items-center justify-center gap-2 transition"
            data-ocid="collect.print.primary_button"
          >
            <Printer size={14} /> Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
}

interface FeeRecord {
  id: number;
  receiptNo: string;
  studentName: string;
  className: string;
  feeType: string;
  amount: number;
  paymentMode: string;
  date: string;
  status: "Paid" | "Pending" | "Due";
}

const initialFees: FeeRecord[] = [];

const _feeTypes = [
  "Tuition Fee",
  "Exam Fee",
  "Transport Fee",
  "Library Fee",
  "Sports Fee",
  "Laboratory Fee",
  "Annual Fee",
];
const _paymentModes = ["Cash", "Online", "Cheque", "DD"];
const _students = [
  "Aarav Sharma",
  "Priya Patel",
  "Rohit Kumar",
  "Ananya Singh",
  "Vikram Joshi",
  "Neha Gupta",
  "Arjun Verma",
  "Kavya Nair",
  "Ravi Mehta",
  "Shreya Agarwal",
];

const ALL_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const SCHOOL_MONTHS = [
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
  "Jan",
  "Feb",
  "Mar",
];

const RECEIPT_STUDENTS = [
  {
    admNo: "ADM-001",
    name: "Aarav Sharma",
    fatherName: "Ramesh Sharma",
    motherName: "Sunita Sharma",
    className: "Class 10-A",
    rollNo: "05",
    contact: "9876543210",
    city: "Delhi",
    category: "General",
    route: "Route 1",
    oldBalance: 0,
  },
  {
    admNo: "ADM-002",
    name: "Priya Patel",
    fatherName: "Suresh Patel",
    motherName: "Kavita Patel",
    className: "Class 7-B",
    rollNo: "12",
    contact: "9812345678",
    city: "Mumbai",
    category: "OBC",
    route: "Route 2",
    oldBalance: 500,
  },
  {
    admNo: "ADM-003",
    name: "Rohit Kumar",
    fatherName: "Mohan Kumar",
    motherName: "Geeta Kumar",
    className: "Class 5-C",
    rollNo: "03",
    contact: "9887654321",
    city: "Jaipur",
    category: "SC",
    route: "Route 3",
    oldBalance: 0,
  },
];

const SAMPLE_FEE_TYPES = [
  { type: "Tuition Fee", amount: 1500 },
  { type: "Exam Fee", amount: 200 },
  { type: "Library Fee", amount: 100 },
  { type: "Sports Fee", amount: 150 },
  { type: "Laboratory Fee", amount: 300 },
];

interface FeeHeading {
  id: number;
  heading: string;
  group: string;
  account: string;
  frequency: string;
  months: string[];
}

const initialHeadings: FeeHeading[] = [
  {
    id: 1,
    heading: "Admission Fee",
    group: "General",
    account: "Admission Fees",
    frequency: "Annual",
    months: [],
  },
  {
    id: 2,
    heading: "Computer Fee/P.C.",
    group: "General",
    account: "Computer",
    frequency: "Annual",
    months: [],
  },
  {
    id: 3,
    heading: "Development Charge",
    group: "General",
    account: "Vikas Shulk",
    frequency: "Annual",
    months: ["Aug", "Sep"],
  },
  {
    id: 4,
    heading: "Exam Fee",
    group: "General",
    account: "Examination",
    frequency: "Four Monthly",
    months: ["Mar", "Jul", "Oct"],
  },
  {
    id: 5,
    heading: "Mar",
    group: "General",
    account: "old year",
    frequency: "Annual",
    months: [],
  },
  {
    id: 6,
    heading: "Monthly Fee",
    group: "General",
    account: "Tuition Fees",
    frequency: "Monthly",
    months: [...ALL_MONTHS],
  },
  {
    id: 7,
    heading: "Progress card",
    group: "General",
    account: "TDS",
    frequency: "Annual",
    months: ["Apr"],
  },
];

interface FeePlan {
  id: number;
  className: string;
  category: string;
  feesHead: string;
  value: number;
}

const initialPlans: FeePlan[] = [
  {
    id: 1,
    className: "10th",
    category: "English New Student",
    feesHead: "Admission Fee",
    value: 600,
  },
  {
    id: 2,
    className: "10th",
    category: "English New Student",
    feesHead: "Computer Fee/P.C.",
    value: 600,
  },
  {
    id: 3,
    className: "10th",
    category: "English New Student",
    feesHead: "Development Charge",
    value: 300,
  },
  {
    id: 4,
    className: "10th",
    category: "English New Student",
    feesHead: "Exam Fee",
    value: 200,
  },
  {
    id: 5,
    className: "10th",
    category: "English Old Student",
    feesHead: "Development Charge",
    value: 300,
  },
  {
    id: 6,
    className: "10th",
    category: "English Old Student",
    feesHead: "Exam Fee",
    value: 200,
  },
  {
    id: 7,
    className: "10th",
    category: "New Student",
    feesHead: "Admission Fee",
    value: 200,
  },
  {
    id: 8,
    className: "10th",
    category: "New Student",
    feesHead: "Development Charge",
    value: 300,
  },
  {
    id: 9,
    className: "10th",
    category: "New Student",
    feesHead: "Exam Fee",
    value: 200,
  },
  {
    id: 10,
    className: "10th",
    category: "New Student",
    feesHead: "Monthly Fee",
    value: 400,
  },
  {
    id: 11,
    className: "10th",
    category: "Old Student",
    feesHead: "Development Charge",
    value: 300,
  },
  {
    id: 12,
    className: "10th",
    category: "Old Student",
    feesHead: "Exam Fee",
    value: 200,
  },
  {
    id: 13,
    className: "9th",
    category: "New Student",
    feesHead: "Admission Fee",
    value: 200,
  },
  {
    id: 14,
    className: "9th",
    category: "New Student",
    feesHead: "Monthly Fee",
    value: 380,
  },
  {
    id: 15,
    className: "9th",
    category: "Old Student",
    feesHead: "Monthly Fee",
    value: 350,
  },
];

const CLASS_LIST = [
  "1st",
  "2nd",
  "3rd",
  "4th",
  "5th",
  "6th",
  "7th",
  "8th",
  "9th",
  "10th",
  "11th",
  "12th",
];
const CATEGORIES = [
  "English New Student",
  "English Old Student",
  "New Student",
  "Old Student",
];
const GROUPS = ["General", "Transport", "Sports", "Lab"];
const ACCOUNTS = [
  "Admission Fees",
  "Tuition Fees",
  "Computer",
  "Vikas Shulk",
  "Examination",
  "TDS",
  "old year",
];
const FREQUENCIES = [
  "Annual",
  "Monthly",
  "Quarterly",
  "Four Monthly",
  "Half Yearly",
];

function fmt(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

function today() {
  return new Date().toISOString().split("T")[0];
}

// ─── CollectFeesTab ───────────────────────────────────────────────────────────
interface FeeRow {
  id: number;
  feeHead: string;
  months: Record<string, number>;
  checked: boolean;
}

interface StudentRecord {
  admNo: string;
  name: string;
  fatherName: string;
  motherName: string;
  className: string;
  rollNo: string;
  contact: string;
  city: string;
  category: string;
  route: string;
  oldBalance: number;
}

interface PaymentRecord {
  id: string;
  receiptNo: string;
  date: string;
  admNo: string;
  studentName: string;
  className: string;
  months: string[];
  feeRows: FeeRow[];
  otherCharges: OtherChargeItem[];
  concessionPct: number;
  concessionAmt: number;
  netFees: number;
  receiptAmt: number;
  balance: number;
  paymentMode: string;
  remarks: string;
}

interface OtherChargeItem {
  id: string;
  type: string;
  paid: number;
  due: number;
}

function getNextReceiptNo(): string {
  const year = new Date().getFullYear() % 100;
  const payments: PaymentRecord[] = (() => {
    try {
      return JSON.parse(localStorage.getItem("erp_fee_payments") || "[]");
    } catch {
      return [];
    }
  })();
  const seq = payments.length + 1;
  return `R${String(year).padStart(2, "0")}-${String(seq).padStart(4, "0")}`;
}

function loadFeeHeadsForStudent(student: StudentRecord): FeeRow[] {
  try {
    const plans = JSON.parse(
      localStorage.getItem("erp_fee_plans") || "[]",
    ) as Array<{ className: string; feesHead: string; value: number }>;
    const heads = plans.filter((p) => p.className === student.className);
    if (heads.length > 0) {
      return heads.map((h, i) => ({
        id: i + 1,
        feeHead: h.feesHead,
        months: {},
        checked: true,
      }));
    }
  } catch {
    /* ignore */
  }
  // fallback to sample fee types
  return SAMPLE_FEE_TYPES.map((ft, i) => ({
    id: i + 1,
    feeHead: ft.type,
    months: {},
    checked: true,
  }));
}

function CollectFeesTab() {
  const [date, setDate] = useState(today());
  const [receiptNo] = useState(getNextReceiptNo);
  const [admNo, setAdmNo] = useState("");
  const [student, setStudent] = useState<StudentRecord | null>(null);
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [feeRows, setFeeRows] = useState<FeeRow[]>([]);
  const [concessionPct, setConcessionPct] = useState(0);
  const [concessionAmt, setConcessionAmt] = useState(0);
  const [receiptAmt, setReceiptAmt] = useState("");
  const [remarks, setRemarks] = useState("");
  const [otherCharges, setOtherCharges] = useState<OtherChargeItem[]>([
    { id: "oc-1", type: "Other Charge", paid: 0, due: 0 },
  ]);
  const [showOtherCharges, setShowOtherCharges] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<StudentRecord[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Derived totals
  const totalFees = feeRows
    .filter((r) => r.checked)
    .reduce(
      (sum, row) =>
        sum + selectedMonths.reduce((s, m) => s + (row.months[m] || 0), 0),
      0,
    );
  const otherTotal = otherCharges.reduce((s, r) => s + r.paid, 0);
  const netFees = totalFees + otherTotal - concessionAmt;
  const rcptAmt = Number(receiptAmt) || 0;
  const balanceAmt = netFees - rcptAmt;

  const toggleMonth = (m: string) => {
    setSelectedMonths((prev) => {
      const next = prev.includes(m)
        ? prev.filter((x) => x !== m)
        : [...prev, m];
      setSelectAll(next.length === SCHOOL_MONTHS.length);
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedMonths([]);
      setSelectAll(false);
    } else {
      setSelectedMonths([...SCHOOL_MONTHS]);
      setSelectAll(true);
    }
  };

  const handleOK = () => {
    if (!student) {
      toast.error("Enter a valid Admission No. first");
      return;
    }
    if (selectedMonths.length === 0) {
      toast.error("Select at least one month");
      return;
    }
    const rows = loadFeeHeadsForStudent(student);
    // Assign per-month amounts
    const populated = rows.map((row) => {
      const months: Record<string, number> = {};
      for (const m of selectedMonths) {
        const val =
          SAMPLE_FEE_TYPES.find((ft) => ft.type === row.feeHead)?.amount || 0;
        months[m] = val;
      }
      return { ...row, months };
    });
    setFeeRows(populated);
  };

  const loadAllStudents = (): StudentRecord[] => {
    try {
      const ls = JSON.parse(
        localStorage.getItem("erp_students") || "[]",
      ) as StudentRecord[];
      return ls.length > 0 ? ls : RECEIPT_STUDENTS;
    } catch {
      return RECEIPT_STUDENTS;
    }
  };

  const handleDynamicSearch = (q: string) => {
    setSearchQuery(q);
    setAdmNo(q);
    if (!q.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }
    const all = loadAllStudents();
    const ql = q.toLowerCase();
    const results = all
      .filter(
        (s) =>
          s.admNo.toLowerCase().includes(ql) ||
          s.name.toLowerCase().includes(ql),
      )
      .slice(0, 8);
    setSearchResults(results);
    setShowDropdown(results.length > 0);
  };

  const selectStudentFromDropdown = (s: StudentRecord) => {
    setStudent(s);
    setAdmNo(s.admNo);
    setSearchQuery(`${s.admNo} - ${s.name}`);
    setShowDropdown(false);
    setSearchResults([]);
    setFeeRows([]);
    setSelectedMonths([]);
    setSelectAll(false);
    toast.success(`Student loaded: ${s.name}`);
  };

  const handleAdmNoSearch = () => {
    if (!admNo.trim()) return;
    const all = loadAllStudents();
    const found = all.find(
      (s) =>
        s.admNo === admNo.trim() ||
        s.name.toLowerCase() === admNo.trim().toLowerCase(),
    );
    if (found) {
      setStudent(found);
      setSearchQuery(`${found.admNo} - ${found.name}`);
      setShowDropdown(false);
      toast.success(`Student loaded: ${found.name}`);
    } else {
      toast.error("Student not found. Try typing name or admission no.");
      setStudent(null);
    }
    setFeeRows([]);
    setSelectedMonths([]);
    setSelectAll(false);
  };

  const handleNew = () => {
    setAdmNo("");
    setSearchQuery("");
    setSearchResults([]);
    setShowDropdown(false);
    setStudent(null);
    setFeeRows([]);
    setSelectedMonths([]);
    setSelectAll(false);
    setConcessionPct(0);
    setConcessionAmt(0);
    setReceiptAmt("");
    setRemarks("");
    setPaymentMode("Cash");
  };

  const handleSave = () => {
    if (!student || feeRows.length === 0) {
      toast.error("Load a student and select months first");
      return;
    }
    const record: PaymentRecord = {
      id: Date.now().toString(),
      receiptNo,
      date,
      admNo: student.admNo,
      studentName: student.name,
      className: student.className,
      months: selectedMonths,
      feeRows,
      otherCharges,
      concessionPct,
      concessionAmt,
      netFees,
      receiptAmt: rcptAmt,
      balance: balanceAmt,
      paymentMode,
      remarks,
    };
    const existing: PaymentRecord[] = (() => {
      try {
        return JSON.parse(localStorage.getItem("erp_fee_payments") || "[]");
      } catch {
        return [];
      }
    })();
    localStorage.setItem(
      "erp_fee_payments",
      JSON.stringify([...existing, record]),
    );
    setShowSaveDialog(true);
  };

  const handleWhatsAppDue = () => {
    if (!student) return;
    const msg = encodeURIComponent(
      `Dear ${student.fatherName || "Parent"}, fees of ₹${netFees.toLocaleString("en-IN")} are due for ${student.name} (Adm. No. ${student.admNo}). Please pay at the earliest. - School ERP`,
    );
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  };

  const handleWhatsAppReceipt = () => {
    if (!student) return;
    const msg = encodeURIComponent(
      `Dear ${student.fatherName || "Parent"}, fees receipt of ₹${rcptAmt.toLocaleString("en-IN")} has been generated for ${student.name} (Adm. No. ${student.admNo}). Receipt No: ${receiptNo}. Thank you. - School ERP`,
    );
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  };

  const handleDelete = () => {
    try {
      const existing: PaymentRecord[] = JSON.parse(
        localStorage.getItem("erp_fee_payments") || "[]",
      );
      const updated = existing.filter((p) => p.receiptNo !== receiptNo);
      localStorage.setItem("erp_fee_payments", JSON.stringify(updated));
      toast.success("Receipt deleted");
      handleNew();
    } catch {
      toast.error("Error deleting receipt");
    }
  };

  const updateOtherCharge = (
    i: number,
    field: keyof OtherChargeItem,
    val: string | number,
  ) => {
    setOtherCharges((prev) =>
      prev.map((r, idx) => (idx === i ? { ...r, [field]: val } : r)),
    );
  };

  const toggleFeeRow = (id: number) => {
    setFeeRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, checked: !r.checked } : r)),
    );
  };

  const ic =
    "bg-gray-900 border border-gray-600 rounded px-2 py-1 text-white text-xs outline-none focus:border-blue-400 w-full";
  const lbl = "text-gray-400 text-[10px] block mb-0.5";

  return (
    <div
      style={{
        background: "#0d111c",
        border: "1px solid #2d3748",
        borderRadius: 8,
      }}
    >
      {/* ── HEADER BAR ── */}
      <div
        style={{
          background: "linear-gradient(135deg, #0f4c81 0%, #1565c0 100%)",
          borderRadius: "8px 8px 0 0",
        }}
        className="px-4 py-2.5"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-white font-bold text-sm tracking-wider">
              FEES RECEIPT
            </span>
            <span className="text-blue-200 text-xs">
              Ledger Bal. ={" "}
              <span className="font-semibold text-yellow-300">
                {(() => {
                  if (!student) return "₹0.00";
                  try {
                    const payments = JSON.parse(
                      localStorage.getItem("erp_fee_payments") || "[]",
                    ) as PaymentRecord[];
                    const sessionDues = payments
                      .filter((p) => p.admNo === student.admNo && p.balance > 0)
                      .reduce((s, p) => s + p.balance, 0);
                    const total = sessionDues + (student.oldBalance || 0);
                    return fmt(total);
                  } catch {
                    return fmt(student.oldBalance || 0);
                  }
                })()}
              </span>{" "}
              Dr.
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleSave}
              data-ocid="collect.save.primary_button"
              className="bg-white text-blue-900 hover:bg-blue-50 text-xs px-3 py-1 rounded font-semibold flex items-center gap-1 transition"
            >
              <Printer size={11} />
              Save
            </button>
            <button
              type="button"
              onClick={handleWhatsAppDue}
              data-ocid="collect.whatsappduebutton"
              className="bg-green-600 hover:bg-green-500 text-white text-xs px-3 py-1 rounded font-medium flex items-center gap-1 transition"
            >
              <MessageSquare size={11} />
              WA Due
            </button>
            <button
              type="button"
              onClick={() => {
                if (!student || feeRows.length === 0) {
                  toast.error("Load student and fees first");
                  return;
                }
                setShowPrintModal(true);
              }}
              data-ocid="collect.print.button"
              className="bg-white text-blue-900 hover:bg-blue-50 text-xs px-3 py-1 rounded font-medium flex items-center gap-1 transition"
            >
              <Printer size={11} />
              Print
            </button>
            <button
              type="button"
              onClick={handleWhatsAppReceipt}
              data-ocid="collect.whatsappreceiptbutton"
              className="bg-green-600 hover:bg-green-500 text-white text-xs px-3 py-1 rounded font-medium flex items-center gap-1 transition"
            >
              <MessageSquare size={11} />
              WA Receipt
            </button>
            <button
              type="button"
              onClick={handleDelete}
              data-ocid="collect.delete.delete_button"
              className="bg-red-600 hover:bg-red-500 text-white text-xs px-3 py-1 rounded font-medium flex items-center gap-1 transition"
            >
              <Trash2 size={11} />
              Delete
            </button>
            <button
              type="button"
              onClick={handleNew}
              data-ocid="collect.close.button"
              className="bg-white text-blue-900 hover:bg-blue-50 text-xs px-3 py-1 rounded font-medium flex items-center gap-1 transition"
            >
              <X size={11} />
              Close
            </button>
          </div>
        </div>
      </div>

      {/* ── ROW 1: Date / Receipt No / Adm No ── */}
      <div
        className="flex items-center gap-3 px-4 py-2.5"
        style={{ background: "#111827", borderBottom: "1px solid #2d3748" }}
      >
        <div style={{ width: 130 }}>
          <span className={lbl}>Date</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={ic}
            data-ocid="collect.date.input"
          />
        </div>
        <div style={{ width: 130 }}>
          <span className={lbl}>Receipt No.</span>
          <input
            type="text"
            value={receiptNo}
            readOnly
            className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-gray-400 text-xs w-full"
          />
        </div>
        <div className="flex-1 max-w-sm" style={{ position: "relative" }}>
          <span className={lbl}>Search by Admission No. or Student Name</span>
          <div className="flex gap-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleDynamicSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setShowDropdown(false);
                  handleAdmNoSearch();
                }
                if (e.key === "Escape") setShowDropdown(false);
              }}
              onFocus={() =>
                searchQuery && setShowDropdown(searchResults.length > 0)
              }
              placeholder="Type name or admission no..."
              className={ic}
              data-ocid="collect.admno.input"
              autoComplete="off"
            />
            <button
              type="button"
              onClick={() => {
                setShowDropdown(false);
                handleAdmNoSearch();
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 rounded transition flex-shrink-0"
              data-ocid="collect.search.button"
            >
              <Search size={13} />
            </button>
          </div>
          {showDropdown && searchResults.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 32,
                zIndex: 100,
                background: "#1a1f2e",
                border: "1px solid #3b82f6",
                borderRadius: 6,
                marginTop: 2,
                maxHeight: 220,
                overflowY: "auto",
                boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
              }}
            >
              {searchResults.map((s) => (
                <button
                  key={s.admNo}
                  type="button"
                  className="w-full text-left px-3 py-2 hover:bg-blue-900/40 flex items-center gap-2 transition"
                  onClick={() => selectStudentFromDropdown(s)}
                >
                  <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {s.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-white text-xs font-medium">
                      {s.name}
                    </div>
                    <div className="text-gray-400 text-[10px]">
                      {s.admNo} &bull; {s.className}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── STUDENT INFO + MONTH SELECTOR ── */}
      <div className="flex" style={{ borderBottom: "1px solid #2d3748" }}>
        {/* Left: photo + links */}
        <div
          className="p-3 flex-shrink-0"
          style={{ width: 110, borderRight: "1px solid #2d3748" }}
        >
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded bg-gray-700 border border-gray-600 flex items-center justify-center mb-2">
              {student ? (
                <span className="text-white text-xl font-bold">
                  {student.name.charAt(0)}
                </span>
              ) : (
                <User size={28} className="text-gray-500" />
              )}
            </div>
            <div className="flex gap-2 mb-2">
              <Printer
                size={12}
                className="text-gray-400 cursor-pointer hover:text-white"
              />
              <Search
                size={12}
                className="text-gray-400 cursor-pointer hover:text-white"
              />
            </div>
            <button
              type="button"
              className="text-blue-400 text-[10px] hover:underline block mb-0.5"
              data-ocid="collect.feescard.button"
            >
              Fees Card
            </button>
            <button
              type="button"
              className="text-blue-400 text-[10px] hover:underline block"
              data-ocid="collect.ledger.button"
            >
              Ledger
            </button>
          </div>
        </div>

        {/* Center: student fields */}
        <div className="flex-1 p-3 grid grid-cols-2 gap-x-6 gap-y-1.5 content-start">
          <div>
            <span className={lbl}>Student Name</span>
            <input
              type="text"
              readOnly
              value={student?.name || ""}
              className={ic}
            />
          </div>
          <div>
            <span className={lbl}>Class Name</span>
            <input
              type="text"
              readOnly
              value={student?.className || ""}
              className={ic}
            />
          </div>
          <div>
            <span className={lbl}>Father's Name</span>
            <input
              type="text"
              readOnly
              value={student?.fatherName || ""}
              className={ic}
            />
          </div>
          <div>
            <span className={lbl}>Roll No.</span>
            <input
              type="text"
              readOnly
              value={student?.rollNo || ""}
              className={ic}
            />
          </div>
          <div>
            <span className={lbl}>Mother's Name</span>
            <input
              type="text"
              readOnly
              value={student?.motherName || ""}
              className={ic}
            />
          </div>
          <div>
            <span className={lbl}>Contact No.</span>
            <input
              type="text"
              readOnly
              value={student?.contact || ""}
              className={ic}
            />
          </div>
          <div>
            <span className={lbl}>Category</span>
            <input
              type="text"
              readOnly
              value={student?.category || ""}
              className={ic}
            />
          </div>
          <div>
            <span className={lbl}>Village / City</span>
            <input
              type="text"
              readOnly
              value={student?.city || ""}
              className={ic}
            />
          </div>
          <div>
            <span className={lbl}>Route</span>
            <input
              type="text"
              readOnly
              value={student?.route || ""}
              className={ic}
            />
          </div>
          <div>
            <span className={lbl}>Old Balance</span>
            <input
              type="text"
              readOnly
              value={student ? fmt(student.oldBalance) : ""}
              className={`${ic} ${student && student.oldBalance > 0 ? "text-red-400" : ""}`}
            />
          </div>
        </div>

        {/* Right: Month selector */}
        <div
          className="p-3 flex-shrink-0"
          style={{ width: 150, borderLeft: "1px solid #2d3748" }}
        >
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
                className="accent-blue-500 w-3 h-3"
              />
              <span className="text-gray-300 text-[11px]">Select All</span>
            </label>
            <span className="text-blue-400 text-[11px] font-semibold">
              {selectedMonths.length}
            </span>
          </div>
          <div
            style={{ background: "#1a1f2e", borderRadius: 4 }}
            className="px-2 py-1 mb-1"
          >
            <span className="text-gray-400 text-[10px] font-semibold tracking-wider">
              MONTH
            </span>
          </div>
          <div
            className="space-y-0.5 mb-2"
            style={{ maxHeight: 180, overflowY: "auto" }}
          >
            {SCHOOL_MONTHS.map((m) => (
              <label
                key={m}
                className="flex items-center gap-1.5 px-1 py-0.5 cursor-pointer hover:bg-gray-800 rounded"
              >
                <input
                  type="checkbox"
                  checked={selectedMonths.includes(m)}
                  onChange={() => toggleMonth(m)}
                  className="accent-blue-500 w-3 h-3"
                />
                <span className="text-gray-300 text-[11px]">{m}</span>
              </label>
            ))}
          </div>
          <button
            type="button"
            onClick={handleOK}
            data-ocid="collect.months.primary_button"
            className="w-full text-white text-xs py-1.5 rounded font-bold tracking-wider transition"
            style={{ background: "linear-gradient(135deg, #0f4c81, #1565c0)" }}
          >
            OK
          </button>
        </div>
      </div>

      {/* ── FEE GRID ── */}
      <div style={{ borderBottom: "1px solid #2d3748" }}>
        <div style={{ overflowX: "auto", maxHeight: 200, overflowY: "auto" }}>
          <table className="w-full text-xs" style={{ minWidth: 400 }}>
            <thead
              style={{
                background: "#1a1f2e",
                position: "sticky",
                top: 0,
                zIndex: 1,
              }}
            >
              <tr>
                <th
                  style={{ width: 28 }}
                  className="px-2 py-1.5 text-gray-400 text-left"
                >
                  <input
                    type="checkbox"
                    className="accent-blue-500 w-3 h-3"
                    onChange={() =>
                      setFeeRows((p) =>
                        p.map((r) => ({
                          ...r,
                          checked: !p.every((x) => x.checked),
                        })),
                      )
                    }
                    checked={
                      feeRows.length > 0 && feeRows.every((r) => r.checked)
                    }
                    readOnly
                  />
                </th>
                <th className="px-3 py-1.5 text-gray-400 font-medium text-left">
                  Fees Head
                </th>
                {selectedMonths.map((m) => (
                  <th
                    key={m}
                    className="px-2 py-1.5 text-gray-400 font-medium text-right"
                  >
                    {m}
                  </th>
                ))}
                {selectedMonths.length > 0 && (
                  <th className="px-3 py-1.5 text-gray-400 font-medium text-right">
                    Total
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {feeRows.length === 0
                ? Array.from({ length: 5 }, (_, i) => (
                    <tr
                      key={`skeleton-row-${i + 1}`}
                      style={{
                        background: i % 2 === 0 ? "#111827" : "#0d111c",
                      }}
                    >
                      <td className="px-2 py-1.5 text-gray-700">
                        <div className="w-3 h-3 bg-gray-800 rounded" />
                      </td>
                      <td className="px-3 py-1.5 text-gray-700">—</td>
                    </tr>
                  ))
                : feeRows.map((row, i) => {
                    const rowTotal = selectedMonths.reduce(
                      (s, m) => s + (row.months[m] || 0),
                      0,
                    );
                    return (
                      <tr
                        key={row.id}
                        style={{
                          background: i % 2 === 0 ? "#111827" : "#0d111c",
                        }}
                        data-ocid={`collect.fee.item.${i + 1}`}
                      >
                        <td className="px-2 py-1.5">
                          <input
                            type="checkbox"
                            checked={row.checked}
                            onChange={() => toggleFeeRow(row.id)}
                            className="accent-blue-500 w-3 h-3"
                          />
                        </td>
                        <td className="px-3 py-1.5 text-white">
                          {row.feeHead}
                        </td>
                        {selectedMonths.map((m) => (
                          <td
                            key={m}
                            className="px-2 py-1.5 text-gray-300 text-right"
                          >
                            {row.months[m] ? fmt(row.months[m]) : "—"}
                          </td>
                        ))}
                        <td className="px-3 py-1.5 text-green-400 text-right font-medium">
                          {fmt(rowTotal)}
                        </td>
                      </tr>
                    );
                  })}
              {feeRows.length > 0 && (
                <tr
                  style={{
                    background: "#1a1f2e",
                    borderTop: "2px solid #2d3748",
                  }}
                >
                  <td />
                  <td className="px-3 py-1.5 text-gray-400 font-semibold text-xs">
                    TOTAL
                  </td>
                  {selectedMonths.map((m) => (
                    <td
                      key={m}
                      className="px-2 py-1.5 text-right text-gray-300 font-semibold"
                    >
                      {fmt(
                        feeRows
                          .filter((r) => r.checked)
                          .reduce((s, r) => s + (r.months[m] || 0), 0),
                      )}
                    </td>
                  ))}
                  <td className="px-3 py-1.5 text-right text-red-400 font-bold">
                    {fmt(totalFees)}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── OTHER CHARGES COLLAPSIBLE ── */}
      <div style={{ borderBottom: "1px solid #2d3748" }}>
        <button
          type="button"
          onClick={() => setShowOtherCharges((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-2 text-xs font-medium text-yellow-400 hover:bg-gray-800/30 transition"
          data-ocid="collect.othercharges.toggle"
        >
          <span>Other Charges {showOtherCharges ? "▲" : "▼"}</span>
          <span className="text-gray-500 text-[10px]">
            Paid: ₹
            {otherCharges
              .reduce((s, r) => s + r.paid, 0)
              .toLocaleString("en-IN")}{" "}
            | Due: ₹
            {otherCharges
              .reduce((s, r) => s + r.due, 0)
              .toLocaleString("en-IN")}
          </span>
        </button>
        {showOtherCharges && (
          <div className="px-4 pb-3">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ background: "#1a1f2e" }}>
                  {["Type", "Paid Amount (₹)", "Due Amount (₹)"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-3 py-1.5 text-gray-400 font-medium"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {otherCharges.map((row, rowIdx) => (
                  <tr
                    key={row.id}
                    style={{
                      background: rowIdx % 2 === 0 ? "#111827" : "#0d111c",
                      borderBottom: "1px solid #2d3748",
                    }}
                    data-ocid={`collect.othercharges.item.${rowIdx + 1}`}
                  >
                    <td className="px-3 py-1.5">
                      <input
                        type="text"
                        value={row.type}
                        onChange={(e) =>
                          updateOtherCharge(rowIdx, "type", e.target.value)
                        }
                        placeholder="Type anything..."
                        className="bg-gray-900 border border-gray-600 rounded px-1.5 py-0.5 text-white text-xs w-full outline-none focus:border-blue-400"
                        data-ocid="collect.othercharges.input"
                      />
                    </td>
                    <td className="px-3 py-1.5">
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={row.paid === 0 ? "0" : String(row.paid)}
                        onFocus={(e) => {
                          if (e.target.value === "0") e.target.select();
                        }}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/[^0-9]/g, "");
                          const stripped = raw.replace(/^0+(\d)/, "$1") || "0";
                          updateOtherCharge(rowIdx, "paid", Number(stripped));
                        }}
                        className="bg-gray-900 border border-gray-600 rounded px-1.5 py-0.5 text-white text-xs w-24"
                      />
                    </td>
                    <td className="px-3 py-1.5">
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={row.due === 0 ? "0" : String(row.due)}
                        onFocus={(e) => {
                          if (e.target.value === "0") e.target.select();
                        }}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/[^0-9]/g, "");
                          const stripped = raw.replace(/^0+(\d)/, "$1") || "0";
                          updateOtherCharge(rowIdx, "due", Number(stripped));
                        }}
                        className="bg-gray-900 border border-gray-600 rounded px-1.5 py-0.5 text-white text-xs w-24"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── SUMMARY BAR ── */}
      <div
        style={{ background: "#111827", borderBottom: "1px solid #2d3748" }}
        className="px-3 py-2.5"
      >
        <div className="flex items-center gap-2 flex-wrap">
          {[
            {
              label: "TOTAL FEES",
              value: fmt(totalFees),
              edit: false,
              red: false,
            },
            {
              label: "OTHER CHARGES",
              value: fmt(otherTotal),
              edit: false,
              red: false,
            },
            { label: "LATE FEES", value: "₹0", edit: false, red: false },
          ].map(({ label, value, red }) => (
            <div key={label} className="flex flex-col items-center">
              <span className="text-gray-500 text-[9px] font-semibold tracking-wider mb-0.5">
                {label}
              </span>
              <div
                className="bg-gray-900 border border-gray-600 rounded px-2 py-1 text-xs font-semibold"
                style={{
                  minWidth: 80,
                  textAlign: "center",
                  color: red ? "#f87171" : "#e5e7eb",
                }}
              >
                {value}
              </div>
            </div>
          ))}
          <div className="flex flex-col items-center">
            <span className="text-gray-500 text-[9px] font-semibold tracking-wider mb-0.5">
              CONCESSION [%]
            </span>
            <input
              type="number"
              min={0}
              max={100}
              value={concessionPct}
              onChange={(e) => {
                const p = Number(e.target.value);
                setConcessionPct(p);
                setConcessionAmt(Math.round((totalFees * p) / 100));
              }}
              className="bg-gray-900 border border-blue-500 rounded px-2 py-1 text-blue-300 text-xs font-semibold outline-none"
              style={{ width: 70, textAlign: "center" }}
              data-ocid="collect.concession.input"
            />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-gray-500 text-[9px] font-semibold tracking-wider mb-0.5">
              CONCESSION AMT
            </span>
            <div
              className="bg-gray-900 border border-gray-600 rounded px-2 py-1 text-xs font-semibold text-gray-200"
              style={{ minWidth: 80, textAlign: "center" }}
            >
              {fmt(concessionAmt)}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-gray-500 text-[9px] font-semibold tracking-wider mb-0.5">
              NET FEES
            </span>
            <div
              className="bg-gray-900 border border-gray-600 rounded px-2 py-1 text-xs font-bold text-red-400"
              style={{ minWidth: 90, textAlign: "center" }}
            >
              {fmt(netFees)}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-gray-500 text-[9px] font-semibold tracking-wider mb-0.5">
              RECEIPT AMT
            </span>
            <input
              type="number"
              min={0}
              value={receiptAmt}
              onChange={(e) => setReceiptAmt(e.target.value)}
              placeholder="0"
              className="bg-gray-900 border border-green-500 rounded px-2 py-1 text-green-300 text-xs font-semibold outline-none"
              style={{ width: 90, textAlign: "center" }}
              data-ocid="collect.receiptamt.input"
            />
          </div>
        </div>
      </div>

      {/* ── BOTTOM ROW ── */}
      <div
        className="flex items-center gap-3 px-4 py-2.5"
        style={{ background: "#0d111c" }}
      >
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-gray-400 text-[10px] font-semibold">
            BALANCE AMT
          </span>
          <div
            className="bg-gray-900 border border-gray-600 rounded px-3 py-1.5 text-sm font-bold"
            style={{
              minWidth: 90,
              textAlign: "center",
              color: balanceAmt > 0 ? "#f87171" : "#4ade80",
            }}
          >
            {fmt(balanceAmt)}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {[
            { icon: <ChevronFirst size={13} />, ocid: "collect.nav.first" },
            { icon: <ChevronLeft size={13} />, ocid: "collect.nav.prev" },
            { icon: <ChevronRight size={13} />, ocid: "collect.nav.next" },
            { icon: <ChevronLast size={13} />, ocid: "collect.nav.last" },
          ].map(({ icon, ocid }) => (
            <button
              key={ocid}
              type="button"
              data-ocid={ocid}
              className="border border-gray-600 rounded p-1 text-gray-400 hover:text-white hover:border-gray-400 transition"
            >
              {icon}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-gray-400 text-xs flex-shrink-0">
            Payment Mode
          </span>
          <select
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value)}
            className="bg-gray-900 border border-purple-500 rounded px-2 py-1.5 text-purple-300 text-xs font-semibold outline-none"
            data-ocid="collect.paymentmode.select"
          >
            {["Cash", "Online/UPI", "Cheque", "DD", "Card", "NEFT/RTGS"].map(
              (m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ),
            )}
          </select>
        </div>
        <div className="flex items-center gap-2 flex-1">
          <span className="text-gray-400 text-xs flex-shrink-0">Remarks</span>
          <input
            type="text"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="e.g. Reason for concession"
            className="flex-1 bg-gray-900 border border-gray-700 rounded px-2 py-1.5 text-white text-xs outline-none focus:border-blue-500"
            data-ocid="collect.remarks.input"
          />
        </div>
        <button
          type="button"
          onClick={handleNew}
          className="border border-gray-600 text-gray-400 text-xs px-3 py-1.5 rounded hover:text-white transition"
          data-ocid="collect.new.button"
        >
          New
        </button>
      </div>
      {showSaveDialog && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          data-ocid="collect.save.dialog"
        >
          <div
            className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-sm shadow-2xl"
            style={{ borderTop: "3px solid #22c55e" }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-green-400 text-2xl mb-1">✓</div>
                <h3 className="text-white font-bold text-base">
                  Receipt Saved Successfully
                </h3>
                <p className="text-gray-400 text-xs mt-1">
                  Receipt No:{" "}
                  <span className="text-blue-400 font-semibold">
                    {receiptNo}
                  </span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowSaveDialog(false);
                  handleNew();
                }}
                className="text-gray-400 hover:text-white"
                data-ocid="collect.save.close_button"
              >
                <X size={18} />
              </button>
            </div>
            <p className="text-gray-400 text-xs mb-4">
              What would you like to do next?
            </p>
            <div className="flex gap-3 mb-4">
              <button
                type="button"
                onClick={() => {
                  setShowSaveDialog(false);
                  setShowPrintModal(true);
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 rounded-lg transition"
                data-ocid="collect.save.print_button"
              >
                🖨️ Print Receipt
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSaveDialog(false);
                  handleWhatsAppReceipt();
                  handleNew();
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2.5 rounded-lg transition"
                data-ocid="collect.save.whatsapp_button"
              >
                📱 Send WhatsApp
              </button>
            </div>
            <p className="text-gray-600 text-[10px] text-center">
              You can also access this receipt from Fee Register
            </p>
          </div>
        </div>
      )}
      {showPrintModal && (
        <ReceiptPrintModal
          open={showPrintModal}
          onClose={() => setShowPrintModal(false)}
          receiptNo={receiptNo}
          date={date}
          student={student}
          selectedMonths={selectedMonths}
          feeRows={feeRows}
          totalFees={totalFees}
          otherTotal={otherTotal}
          concessionAmt={concessionAmt}
          netFees={netFees}
          receiptAmt={rcptAmt}
          section={"A"}
          sid={student?.admNo || ""}
          regNo={student?.rollNo || ""}
          sess={"2025-26"}
          motherName={student?.motherName || ""}
          paymentMode={paymentMode}
          otherChargeType={otherCharges[0]?.type || "Other Charges"}
          sessionDues={(() => {
            if (!student) return 0;
            try {
              const payments = JSON.parse(
                localStorage.getItem("erp_fee_payments") || "[]",
              ) as PaymentRecord[];
              const dues = payments
                .filter((p) => p.admNo === student.admNo && p.balance > 0)
                .reduce((s, p) => s + p.balance, 0);
              return dues + (student.oldBalance || 0);
            } catch {
              return student.oldBalance || 0;
            }
          })()}
        />
      )}
    </div>
  );
}

// ─── Fees Register Tab ────────────────────────────────────────────────────────
function FeesRegisterTab() {
  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [filterMode, setFilterMode] = useState("");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");

  const payments: PaymentRecord[] = (() => {
    try {
      return JSON.parse(localStorage.getItem("erp_fee_payments") || "[]");
    } catch {
      return [];
    }
  })();

  const filtered = payments.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      p.studentName.toLowerCase().includes(q) ||
      p.admNo.toLowerCase().includes(q) ||
      p.receiptNo.toLowerCase().includes(q);
    const matchClass = !filterClass || p.className === filterClass;
    const matchMode = !filterMode || (p.paymentMode || "Cash") === filterMode;
    const matchFrom = !filterFrom || p.date >= filterFrom;
    const matchTo = !filterTo || p.date <= filterTo;
    return matchSearch && matchClass && matchMode && matchFrom && matchTo;
  });

  const totalCollected = filtered.reduce((s, p) => s + p.receiptAmt, 0);
  const totalNet = filtered.reduce((s, p) => s + p.netFees, 0);
  const totalBalance = filtered.reduce((s, p) => s + p.balance, 0);

  const classes = [...new Set(payments.map((p) => p.className))].sort();
  const modes = ["Cash", "Online/UPI", "Cheque", "DD", "Card", "NEFT/RTGS"];

  const printRegister = () => {
    const el = document.getElementById("fee-register-print");
    if (!el) return;
    const win = window.open("", "_blank", "width=1100,height=700");
    if (!win) return;
    win.document.write(
      `<html><head><title>Fees Register</title><style>@page{margin:10mm}body{margin:0;font-family:Arial,sans-serif;font-size:10px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ccc;padding:4px 6px}th{background:#e8f0fe;font-weight:600}.summary{background:#f0fdf4;font-weight:bold}</style></head><body>${el.innerHTML}</body></html>`,
    );
    win.document.close();
    setTimeout(() => {
      win.print();
      win.close();
    }, 400);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <BookOpen size={16} className="text-blue-400" />
          <h3 className="text-white font-bold text-sm tracking-wide">
            FEES RECEIPT REGISTER
          </h3>
          <span className="bg-blue-900/50 text-blue-300 text-[10px] px-2 py-0.5 rounded-full">
            {filtered.length} records
          </span>
        </div>
        <button
          type="button"
          onClick={printRegister}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded font-medium transition"
          data-ocid="register.print.button"
        >
          <Printer size={13} /> Print Register
        </button>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          {
            label: "Total Collected",
            value: `₹${totalCollected.toLocaleString("en-IN")}`,
            color: "text-green-400",
            bg: "bg-green-900/20 border-green-800",
          },
          {
            label: "Total Net Fees",
            value: `₹${totalNet.toLocaleString("en-IN")}`,
            color: "text-blue-400",
            bg: "bg-blue-900/20 border-blue-800",
          },
          {
            label: "Total Balance Due",
            value: `₹${totalBalance.toLocaleString("en-IN")}`,
            color: totalBalance > 0 ? "text-red-400" : "text-green-400",
            bg: "bg-red-900/20 border-red-800",
          },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`rounded-lg p-3 border ${bg}`}>
            <div className="text-gray-400 text-[10px] font-semibold tracking-wider mb-1">
              {label}
            </div>
            <div className={`text-lg font-bold ${color}`}>{value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div
        className="flex flex-wrap items-center gap-2 mb-3 p-3 rounded-lg"
        style={{ background: "#1a1f2e", border: "1px solid #374151" }}
      >
        <div className="flex items-center gap-1.5 bg-gray-800 border border-gray-700 rounded px-2 py-1.5 flex-1 min-w-48">
          <Search size={13} className="text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, adm no, receipt..."
            className="bg-transparent text-gray-300 text-xs outline-none w-full"
            data-ocid="register.search.input"
          />
        </div>
        <select
          value={filterClass}
          onChange={(e) => setFilterClass(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-gray-300 text-xs outline-none"
          data-ocid="register.class.filter"
        >
          <option value="">All Classes</option>
          {classes.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={filterMode}
          onChange={(e) => setFilterMode(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-gray-300 text-xs outline-none"
          data-ocid="register.mode.filter"
        >
          <option value="">All Modes</option>
          {modes.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-1.5">
          <span className="text-gray-500 text-xs">From:</span>
          <input
            type="date"
            value={filterFrom}
            onChange={(e) => setFilterFrom(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-gray-300 text-xs outline-none"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-gray-500 text-xs">To:</span>
          <input
            type="date"
            value={filterTo}
            onChange={(e) => setFilterTo(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-gray-300 text-xs outline-none"
          />
        </div>
        <button
          type="button"
          onClick={() => {
            setSearch("");
            setFilterClass("");
            setFilterMode("");
            setFilterFrom("");
            setFilterTo("");
          }}
          className="text-gray-500 hover:text-white text-xs px-2 py-1.5 rounded border border-gray-700 hover:border-gray-500 transition"
        >
          Clear
        </button>
      </div>

      {/* Register Table */}
      <div
        id="fee-register-print"
        className="rounded-lg overflow-hidden border border-gray-700"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-xs" style={{ minWidth: 900 }}>
            <thead>
              <tr style={{ background: "#1a1f2e" }}>
                {[
                  "#",
                  "Receipt No.",
                  "Date",
                  "Adm. No.",
                  "Student Name",
                  "Class",
                  "Months",
                  "Other Charges (₹)",
                  "Net Fees (₹)",
                  "Paid (₹)",
                  "Balance (₹)",
                  "Mode",
                  "Concession",
                  "Remarks",
                  "Status",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-3 py-2 text-gray-400 font-medium whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={15}
                    className="px-3 py-8 text-center text-gray-500"
                  >
                    No payment records found. Collect fees first to see them
                    here.
                  </td>
                </tr>
              ) : (
                filtered.map((p, i) => {
                  const paid = p.receiptAmt;
                  const bal = p.balance;
                  const status =
                    bal <= 0 ? "Paid" : paid > 0 ? "Partial" : "Due";
                  return (
                    <tr
                      key={p.id}
                      style={{
                        background: i % 2 === 0 ? "#111827" : "#0f1117",
                        borderBottom: "1px solid #1f2937",
                      }}
                    >
                      <td className="px-3 py-2 text-gray-500">{i + 1}</td>
                      <td className="px-3 py-2 text-blue-400 font-medium">
                        {p.receiptNo}
                      </td>
                      <td className="px-3 py-2 text-gray-300 whitespace-nowrap">
                        {p.date}
                      </td>
                      <td className="px-3 py-2 text-yellow-400">{p.admNo}</td>
                      <td className="px-3 py-2 text-white font-medium">
                        {p.studentName}
                      </td>
                      <td className="px-3 py-2 text-gray-300">{p.className}</td>
                      <td className="px-3 py-2 text-gray-400 text-[10px]">
                        {p.months.join(", ")}
                      </td>
                      <td
                        className="px-3 py-2 text-right font-medium"
                        style={{
                          color:
                            p.otherCharges?.reduce(
                              (s: number, r: OtherChargeItem) => s + r.paid,
                              0,
                            ) > 0
                              ? "#4ade80"
                              : "#6b7280",
                        }}
                      >
                        ₹
                        {(
                          p.otherCharges?.reduce(
                            (s: number, r: OtherChargeItem) => s + r.paid,
                            0,
                          ) || 0
                        ).toLocaleString("en-IN")}
                      </td>
                      <td className="px-3 py-2 text-right text-gray-200 font-medium">
                        ₹{p.netFees.toLocaleString("en-IN")}
                      </td>
                      <td className="px-3 py-2 text-right text-green-400 font-medium">
                        ₹{paid.toLocaleString("en-IN")}
                      </td>
                      <td
                        className="px-3 py-2 text-right font-medium"
                        style={{ color: bal > 0 ? "#f87171" : "#4ade80" }}
                      >
                        ₹{bal.toLocaleString("en-IN")}
                      </td>
                      <td className="px-3 py-2">
                        <span className="flex items-center gap-1">
                          <CreditCard size={10} className="text-purple-400" />
                          <span className="text-purple-300">
                            {p.paymentMode || "Cash"}
                          </span>
                        </span>
                      </td>
                      <td className="px-3 py-2 text-gray-400">
                        {p.concessionAmt > 0
                          ? `₹${p.concessionAmt.toLocaleString("en-IN")} (${p.concessionPct}%)`
                          : "—"}
                      </td>
                      <td
                        className="px-3 py-2 text-gray-500 max-w-24 truncate"
                        title={p.remarks}
                      >
                        {p.remarks || "—"}
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-medium ${status === "Paid" ? "bg-green-900/50 text-green-400" : status === "Partial" ? "bg-yellow-900/50 text-yellow-400" : "bg-red-900/50 text-red-400"}`}
                        >
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            {filtered.length > 0 && (
              <tfoot>
                <tr
                  style={{
                    background: "#1a1f2e",
                    borderTop: "2px solid #374151",
                  }}
                >
                  <td
                    colSpan={7}
                    className="px-3 py-2 text-gray-400 font-semibold text-right"
                  >
                    TOTALS:
                  </td>
                  <td className="px-3 py-2 text-right text-gray-200 font-bold">
                    ₹{totalNet.toLocaleString("en-IN")}
                  </td>
                  <td className="px-3 py-2 text-right text-green-400 font-bold">
                    ₹{totalCollected.toLocaleString("en-IN")}
                  </td>
                  <td
                    className="px-3 py-2 text-right font-bold"
                    style={{ color: totalBalance > 0 ? "#f87171" : "#4ade80" }}
                  >
                    ₹{totalBalance.toLocaleString("en-IN")}
                  </td>
                  <td colSpan={4} />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── DuesFeesTab ─────────────────────────────────────────────────────────────
const DUES_FEE_HEADS = [
  "Tuition Fee",
  "Exam Fee",
  "Library Fee",
  "Sports Fee",
  "Laboratory Fee",
  "Transport Fee",
  "Annual Fee",
];

function DuesFeesTab({ onCollect }: { onCollect: () => void }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [student, setStudent] = useState<StudentRecord | null>(null);
  const [searchResults, setSearchResults] = useState<StudentRecord[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [monthsCount, setMonthsCount] = useState(3);

  const loadAllStudents = (): StudentRecord[] => {
    try {
      const ls = JSON.parse(
        localStorage.getItem("erp_students") || "[]",
      ) as StudentRecord[];
      return ls.length > 0 ? ls : RECEIPT_STUDENTS;
    } catch {
      return RECEIPT_STUDENTS;
    }
  };

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    if (!q.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }
    const all = loadAllStudents();
    const ql = q.toLowerCase();
    const results = all
      .filter(
        (s) =>
          s.admNo.toLowerCase().includes(ql) ||
          s.name.toLowerCase().includes(ql),
      )
      .slice(0, 8);
    setSearchResults(results);
    setShowDropdown(results.length > 0);
  };

  const selectStudent = (s: StudentRecord) => {
    setStudent(s);
    setSearchQuery(`${s.admNo} - ${s.name}`);
    setShowDropdown(false);
    setSearchResults([]);
  };

  // Compute dues data from erp_fee_payments
  const duesData = (() => {
    if (!student)
      return { months: [], duesGrid: {}, totalDue: 0, monthsWithDues: 0 };
    try {
      const payments = JSON.parse(
        localStorage.getItem("erp_fee_payments") || "[]",
      ) as PaymentRecord[];
      const studentPayments = payments.filter((p) => p.admNo === student.admNo);

      // Get last N months from SCHOOL_MONTHS pattern
      const allMonths = [
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
        "Jan",
        "Feb",
        "Mar",
      ];
      const curMonthIdx = new Date().getMonth();
      // Map JS month index to school month
      const jsToSchool: Record<number, string> = {
        3: "Apr",
        4: "May",
        5: "Jun",
        6: "Jul",
        7: "Aug",
        8: "Sep",
        9: "Oct",
        10: "Nov",
        11: "Dec",
        0: "Jan",
        1: "Feb",
        2: "Mar",
      };
      const curSchoolMonth = jsToSchool[curMonthIdx] || "Apr";
      const curPos = allMonths.indexOf(curSchoolMonth);
      const selectedMonthsList: string[] = [];
      for (let i = 0; i < monthsCount; i++) {
        const idx = (curPos - i + allMonths.length) % allMonths.length;
        selectedMonthsList.unshift(allMonths[idx]);
      }

      // Build dues grid: feeHead -> month -> amount due
      const duesGrid: Record<string, Record<string, number>> = {};
      for (const feeHead of DUES_FEE_HEADS) {
        duesGrid[feeHead] = {};
        for (const month of selectedMonthsList) {
          // Find if this feeHead+month was paid
          const paid = studentPayments.some(
            (p) =>
              p.months.includes(month) &&
              p.feeRows.some((r) => r.feeHead === feeHead && r.checked),
          );
          // If not paid, show sample amount as due
          if (!paid) {
            const sampleAmt =
              SAMPLE_FEE_TYPES.find((ft) => ft.type === feeHead)?.amount || 0;
            if (sampleAmt > 0) duesGrid[feeHead][month] = sampleAmt;
          }
        }
      }

      let totalDue = 0;
      let monthsWithDues = 0;
      const monthDueTotals: Record<string, number> = {};
      for (const month of selectedMonthsList) {
        let monthTotal = 0;
        for (const feeHead of DUES_FEE_HEADS) {
          monthTotal += duesGrid[feeHead][month] || 0;
        }
        monthDueTotals[month] = monthTotal;
        if (monthTotal > 0) monthsWithDues++;
        totalDue += monthTotal;
      }

      return {
        months: selectedMonthsList,
        duesGrid,
        totalDue,
        monthsWithDues,
        monthDueTotals,
      };
    } catch {
      return {
        months: [],
        duesGrid: {},
        totalDue: 0,
        monthsWithDues: 0,
        monthDueTotals: {},
      };
    }
  })();

  const ic =
    "bg-gray-900 border border-gray-600 rounded px-2 py-1.5 text-white text-xs outline-none focus:border-blue-400 w-full";

  return (
    <div
      style={{
        background: "#0d111c",
        border: "1px solid #2d3748",
        borderRadius: 8,
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
          borderRadius: "8px 8px 0 0",
        }}
        className="px-4 py-3"
      >
        <div className="flex items-center gap-2">
          <span className="text-white font-bold text-sm tracking-wider">
            💸 DUES FEES
          </span>
          <span className="text-purple-200 text-xs">
            Month-wise fee dues for a student
          </span>
        </div>
      </div>

      <div className="p-4">
        {/* Student search */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="col-span-2">
            <label
              htmlFor="dues-search"
              className="text-gray-400 text-[10px] block mb-0.5"
            >
              Search Student (Name or Adm. No.)
            </label>
            <div className="relative">
              <div className="flex items-center bg-gray-900 border border-gray-600 rounded overflow-hidden">
                <Search
                  size={13}
                  className="text-gray-400 ml-2 flex-shrink-0"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  id="dues-search"
                  placeholder="Type name or admission number..."
                  className="flex-1 bg-transparent px-2 py-1.5 text-white text-xs outline-none"
                  data-ocid="duesfees.search_input"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setStudent(null);
                      setSearchResults([]);
                      setShowDropdown(false);
                    }}
                    className="text-gray-400 hover:text-white mr-2"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
              {showDropdown && searchResults.length > 0 && (
                <div
                  className="absolute left-0 right-0 top-full z-20 rounded-b shadow-xl"
                  style={{
                    background: "#1a1f2e",
                    border: "1px solid #374151",
                    borderTop: "none",
                  }}
                >
                  {searchResults.map((s) => (
                    <button
                      key={s.admNo}
                      type="button"
                      onClick={() => selectStudent(s)}
                      className="w-full text-left px-3 py-1.5 text-xs hover:bg-blue-900/40 flex items-center gap-2"
                      data-ocid="duesfees.student.button"
                    >
                      <User size={11} className="text-blue-400" />
                      <span className="text-blue-300">{s.admNo}</span>
                      <span className="text-white">{s.name}</span>
                      <span className="text-gray-400 ml-auto">
                        {s.className}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div>
            <label
              htmlFor="dues-months-input"
              className="text-gray-400 text-[10px] block mb-0.5"
            >
              Show Dues for Last N Months (1-12)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={12}
                value={monthsCount}
                onChange={(e) =>
                  setMonthsCount(
                    Math.min(12, Math.max(1, Number(e.target.value))),
                  )
                }
                id="dues-months-input"
                className={ic}
                style={{ width: 60 }}
                data-ocid="duesfees.months.input"
              />
              <input
                type="range"
                min={1}
                max={12}
                value={monthsCount}
                onChange={(e) => setMonthsCount(Number(e.target.value))}
                className="flex-1 accent-purple-500"
                data-ocid="duesfees.months.range"
              />
              <span className="text-purple-400 text-xs font-bold">
                {monthsCount}
              </span>
            </div>
          </div>
        </div>

        {/* Student info bar */}
        {student && (
          <div
            className="flex items-center gap-4 mb-4 px-4 py-2 rounded-lg text-xs"
            style={{ background: "#1a1f2e", border: "1px solid #374151" }}
          >
            <div className="flex items-center gap-2">
              <User size={14} className="text-purple-400" />
              <span className="text-white font-semibold">{student.name}</span>
            </div>
            <span className="text-gray-400">
              Adm: <span className="text-blue-400">{student.admNo}</span>
            </span>
            <span className="text-gray-400">
              Class: <span className="text-gray-200">{student.className}</span>
            </span>
            <span className="text-gray-400">
              Old Bal:{" "}
              <span className="text-red-400">
                ₹{(student.oldBalance || 0).toLocaleString("en-IN")}
              </span>
            </span>
            <button
              type="button"
              onClick={onCollect}
              className="ml-auto bg-green-700 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-medium transition"
              data-ocid="duesfees.collect_button"
            >
              Collect Fees
            </button>
          </div>
        )}

        {!student ? (
          <div
            className="text-center py-16 text-gray-500 rounded-lg"
            style={{ background: "#111827", border: "1px dashed #374151" }}
            data-ocid="duesfees.empty_state"
          >
            <div className="text-4xl mb-2">💸</div>
            <div className="text-sm">
              Search for a student to view month-wise dues
            </div>
          </div>
        ) : (
          <>
            {/* Summary KPIs */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div
                className="rounded-lg p-3"
                style={{ background: "#1a1f2e", border: "1px solid #374151" }}
              >
                <p className="text-gray-400 text-[10px]">Total Dues</p>
                <p className="text-red-400 text-xl font-bold">
                  ₹{duesData.totalDue.toLocaleString("en-IN")}
                </p>
              </div>
              <div
                className="rounded-lg p-3"
                style={{ background: "#1a1f2e", border: "1px solid #374151" }}
              >
                <p className="text-gray-400 text-[10px]">Months with Dues</p>
                <p className="text-yellow-400 text-xl font-bold">
                  {duesData.monthsWithDues}
                </p>
              </div>
              <div
                className="rounded-lg p-3"
                style={{ background: "#1a1f2e", border: "1px solid #374151" }}
              >
                <p className="text-gray-400 text-[10px]">Months Checked</p>
                <p className="text-purple-400 text-xl font-bold">
                  {monthsCount}
                </p>
              </div>
            </div>

            {/* Dues Grid */}
            <div
              className="rounded-lg overflow-x-auto"
              style={{ border: "1px solid #374151" }}
            >
              <table
                className="w-full text-xs"
                style={{ borderCollapse: "collapse" }}
              >
                <thead>
                  <tr style={{ background: "#1a1f2e" }}>
                    <th
                      className="text-left px-3 py-2 text-gray-400 font-medium"
                      style={{ minWidth: 120 }}
                    >
                      Fee Head
                    </th>
                    {duesData.months.map((m) => (
                      <th
                        key={m}
                        className="px-3 py-2 text-gray-400 font-medium text-right"
                        style={{ minWidth: 80 }}
                      >
                        {m}
                      </th>
                    ))}
                    <th
                      className="px-3 py-2 text-gray-400 font-medium text-right"
                      style={{ minWidth: 80 }}
                    >
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {DUES_FEE_HEADS.map((feeHead, i) => {
                    const rowTotal = duesData.months.reduce(
                      (s, m) =>
                        s + ((duesData.duesGrid as any)[feeHead]?.[m] || 0),
                      0,
                    );
                    return (
                      <tr
                        key={feeHead}
                        style={{
                          background: i % 2 === 0 ? "#111827" : "#0d111c",
                          borderBottom: "1px solid #1f2937",
                        }}
                      >
                        <td className="px-3 py-2 text-white">{feeHead}</td>
                        {duesData.months.map((m) => {
                          const amt =
                            (duesData.duesGrid as any)[feeHead]?.[m] || 0;
                          return (
                            <td
                              key={m}
                              className="px-3 py-2 text-right font-medium"
                              style={{ color: amt > 0 ? "#f87171" : "#4b5563" }}
                            >
                              {amt > 0
                                ? `₹${amt.toLocaleString("en-IN")}`
                                : "—"}
                            </td>
                          );
                        })}
                        <td
                          className="px-3 py-2 text-right font-bold"
                          style={{
                            color: rowTotal > 0 ? "#f87171" : "#4b5563",
                          }}
                        >
                          {rowTotal > 0
                            ? `₹${rowTotal.toLocaleString("en-IN")}`
                            : "—"}
                        </td>
                      </tr>
                    );
                  })}
                  {/* Column totals row */}
                  <tr
                    style={{
                      background: "#1a1f2e",
                      borderTop: "2px solid #374151",
                    }}
                  >
                    <td className="px-3 py-2 text-gray-400 font-semibold">
                      TOTAL DUE
                    </td>
                    {duesData.months.map((m) => {
                      const colTotal =
                        (duesData.monthDueTotals as any)?.[m] || 0;
                      return (
                        <td
                          key={m}
                          className="px-3 py-2 text-right font-bold"
                          style={{
                            color: colTotal > 0 ? "#fbbf24" : "#4b5563",
                          }}
                        >
                          {colTotal > 0
                            ? `₹${colTotal.toLocaleString("en-IN")}`
                            : "—"}
                        </td>
                      );
                    })}
                    <td className="px-3 py-2 text-right font-bold text-red-400">
                      ₹{duesData.totalDue.toLocaleString("en-IN")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function Fees() {
  const [tab, setTab] = useState<
    | "collect"
    | "search"
    | "due"
    | "duesfees"
    | "master"
    | "plan"
    | "othercharges"
    | "register"
  >("collect");
  const [fees, _setFees] = useState<FeeRecord[]>(initialFees);
  const [search, setSearch] = useState("");

  // Other Charges state (for the OtherCharges tab)
  const [otherCharges, setOtherCharges] = useState([
    { id: "oc-1", type: "Other Charge", paid: 0, due: 0 },
  ]);
  // Master tab state
  const [headings, setHeadings] = useState<FeeHeading[]>(initialHeadings);
  const [selectedHeading, setSelectedHeading] = useState<FeeHeading | null>(
    null,
  );
  const [masterForm, setMasterForm] = useState({
    heading: "",
    group: "General",
    account: "Admission Fees",
    frequency: "Annual",
    months: [] as string[],
  });

  // Plan tab state
  const [plans, setPlans] = useState<FeePlan[]>(initialPlans);
  const [selectedPlan, setSelectedPlan] = useState<FeePlan | null>(null);

  const [planForm, setPlanForm] = useState({
    feesHead: "Admission Fee",
    value: "",
    classes: [] as string[],
    categories: [] as string[],
    selectAll: false,
  });

  const filtered = fees.filter(
    (f) =>
      f.studentName.toLowerCase().includes(search.toLowerCase()) ||
      f.receiptNo.toLowerCase().includes(search.toLowerCase()),
  );
  const due = fees.filter((f) => f.status !== "Paid");

  const toggleMonth = (month: string) => {
    setMasterForm((p) => ({
      ...p,
      months: p.months.includes(month)
        ? p.months.filter((m) => m !== month)
        : [...p.months, month],
    }));
  };

  const addHeading = () => {
    if (!masterForm.heading.trim()) return;
    setHeadings((p) => [
      ...p,
      {
        id: headings.length + 1,
        heading: masterForm.heading,
        group: masterForm.group,
        account: masterForm.account,
        frequency: masterForm.frequency,
        months: masterForm.months,
      },
    ]);
    setMasterForm({
      heading: "",
      group: "General",
      account: "Admission Fees",
      frequency: "Annual",
      months: [],
    });
  };

  const deleteHeading = () => {
    if (!selectedHeading) return;
    setHeadings((p) => p.filter((h) => h.id !== selectedHeading.id));
    setSelectedHeading(null);
  };

  const savePlan = () => {
    if (
      !planForm.feesHead ||
      !planForm.value ||
      planForm.classes.length === 0 ||
      planForm.categories.length === 0
    )
      return;
    let nextId = plans.length + 1;
    const newRows: FeePlan[] = [];
    for (const cls of planForm.classes) {
      for (const cat of planForm.categories) {
        newRows.push({
          id: nextId++,
          className: cls,
          category: cat,
          feesHead: planForm.feesHead,
          value: Number(planForm.value),
        });
      }
    }
    setPlans((p) => [...p, ...newRows]);
    setPlanForm((p) => ({
      ...p,
      value: "",
      classes: [],
      categories: [],
      selectAll: false,
    }));
  };

  const deletePlan = () => {
    if (!selectedPlan) return;
    setPlans((p) => p.filter((r) => r.id !== selectedPlan.id));
    setSelectedPlan(null);
  };

  const toggleClass = (cls: string) => {
    setPlanForm((p) => {
      const next = p.classes.includes(cls)
        ? p.classes.filter((c) => c !== cls)
        : [...p.classes, cls];
      return {
        ...p,
        classes: next,
        selectAll: next.length === CLASS_LIST.length,
      };
    });
  };

  const toggleCategory = (cat: string) => {
    setPlanForm((p) => ({
      ...p,
      categories: p.categories.includes(cat)
        ? p.categories.filter((c) => c !== cat)
        : [...p.categories, cat],
    }));
  };

  const toggleSelectAll = () => {
    setPlanForm((p) => ({
      ...p,
      selectAll: !p.selectAll,
      classes: !p.selectAll ? [...CLASS_LIST] : [],
    }));
  };

  const tabLabel = (t: string) => {
    if (t === "collect") return "Collect Fees";
    if (t === "search") return "Search Fees";
    if (t === "due") return "Due Fees";
    if (t === "duesfees") return "💸 Dues Fees";
    if (t === "master") return "Fees Master";
    if (t === "plan") return "Fees Plan";
    if (t === "othercharges") return "Other Charges";
    if (t === "register") return "📋 Fee Register";
    return t;
  };

  const _inputCls =
    "bg-gray-900 border border-gray-600 rounded px-2 py-1 text-white text-xs outline-none focus:border-blue-500 w-full";
  const _labelCls = "text-gray-400 text-[10px] block mb-0.5";

  return (
    <div>
      <h2 className="text-white text-lg font-semibold mb-4">Fees Collection</h2>
      <div className="flex flex-wrap gap-1 mb-4">
        {(
          [
            "collect",
            "register",
            "search",
            "due",
            "duesfees",
            "master",
            "plan",
            "othercharges",
          ] as const
        ).map((t) => (
          <button
            type="button"
            key={t}
            onClick={() => setTab(t)}
            data-ocid={`fees.${t}.tab`}
            className={`px-4 py-1.5 rounded text-xs font-medium capitalize transition ${
              tab === t
                ? "bg-green-600 text-white"
                : "bg-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            {tabLabel(t)}
          </button>
        ))}
      </div>

      {/* ── COLLECT TAB (Fees Receipt) ── */}
      {tab === "collect" && <CollectFeesTab />}

      {/* ── FEE REGISTER TAB ── */}
      {tab === "register" && <FeesRegisterTab />}

      {/* ── SEARCH TAB ── */}
      {tab === "search" && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center bg-gray-800 border border-gray-700 rounded px-2 py-1.5 flex-1 max-w-xs">
              <Search size={14} className="text-gray-400 mr-1" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or receipt..."
                className="bg-transparent text-gray-300 text-xs outline-none w-full"
              />
            </div>
          </div>
          <div className="rounded-lg overflow-hidden border border-gray-700">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ background: "#1a1f2e" }}>
                  {[
                    "Receipt No",
                    "Student",
                    "Class",
                    "Fee Type",
                    "Amount",
                    "Mode",
                    "Date",
                    "Status",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-3 py-2 text-gray-400 font-medium"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((f, i) => (
                  <tr
                    key={f.id}
                    style={{ background: i % 2 === 0 ? "#111827" : "#0f1117" }}
                  >
                    <td className="px-3 py-2 text-blue-400">{f.receiptNo}</td>
                    <td className="px-3 py-2 text-white">{f.studentName}</td>
                    <td className="px-3 py-2 text-gray-300">{f.className}</td>
                    <td className="px-3 py-2 text-gray-300">{f.feeType}</td>
                    <td className="px-3 py-2 text-green-400">
                      ₹{f.amount.toLocaleString("en-IN")}
                    </td>
                    <td className="px-3 py-2 text-gray-400">
                      {f.paymentMode || "-"}
                    </td>
                    <td className="px-3 py-2 text-gray-400">{f.date || "-"}</td>
                    <td className="px-3 py-2">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] ${f.status === "Paid" ? "bg-green-900/50 text-green-400" : f.status === "Pending" ? "bg-yellow-900/50 text-yellow-400" : "bg-red-900/50 text-red-400"}`}
                      >
                        {f.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── DUE TAB (simple summary) ── */}
      {tab === "due" && (
        <div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div
              className="rounded-lg p-3"
              style={{ background: "#1a1f2e", border: "1px solid #374151" }}
            >
              <p className="text-gray-400 text-xs">Due/Pending Students</p>
              <p className="text-red-400 text-2xl font-bold">{due.length}</p>
            </div>
            <div
              className="rounded-lg p-3"
              style={{ background: "#1a1f2e", border: "1px solid #374151" }}
            >
              <p className="text-gray-400 text-xs">Due Amount</p>
              <p className="text-yellow-400 text-2xl font-bold">
                ₹{due.reduce((s, f) => s + f.amount, 0).toLocaleString("en-IN")}
              </p>
            </div>
          </div>
          <div className="rounded-lg overflow-hidden border border-gray-700">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ background: "#1a1f2e" }}>
                  {[
                    "Student",
                    "Class",
                    "Fee Type",
                    "Amount",
                    "Status",
                    "Action",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-3 py-2 text-gray-400 font-medium"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {due.map((f, i) => (
                  <tr
                    key={f.id}
                    style={{ background: i % 2 === 0 ? "#111827" : "#0f1117" }}
                  >
                    <td className="px-3 py-2 text-white">{f.studentName}</td>
                    <td className="px-3 py-2 text-gray-300">{f.className}</td>
                    <td className="px-3 py-2 text-gray-300">{f.feeType}</td>
                    <td className="px-3 py-2 text-red-400">
                      ₹{f.amount.toLocaleString("en-IN")}
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] ${f.status === "Pending" ? "bg-yellow-900/50 text-yellow-400" : "bg-red-900/50 text-red-400"}`}
                      >
                        {f.status}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <button
                        type="button"
                        onClick={() => setTab("collect")}
                        className="bg-green-700 hover:bg-green-600 text-white px-2 py-0.5 rounded text-[10px]"
                      >
                        Collect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── DUES FEES TAB (month-wise dues) ── */}
      {tab === "duesfees" && (
        <DuesFeesTab onCollect={() => setTab("collect")} />
      )}

      {/* ── FEES MASTER TAB ── */}
      {tab === "master" && (
        <div>
          <div
            className="rounded-lg p-4 mb-4"
            style={{ background: "#1a1f2e", border: "1px solid #374151" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={15} className="text-blue-400" />
              <h3 className="text-white text-xs font-bold tracking-widest uppercase">
                Create Fees Heading
              </h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label
                  htmlFor="master-heading"
                  className="text-gray-400 text-xs w-28 shrink-0"
                >
                  Fees Heading
                </label>
                <input
                  id="master-heading"
                  type="text"
                  value={masterForm.heading}
                  onChange={(e) =>
                    setMasterForm((p) => ({ ...p, heading: e.target.value }))
                  }
                  placeholder="Enter fees heading"
                  data-ocid="master.heading.input"
                  className="flex-1 bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-white text-xs outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <label
                  htmlFor="master-group"
                  className="text-gray-400 text-xs w-28 shrink-0"
                >
                  Group Name
                </label>
                <select
                  id="master-group"
                  value={masterForm.group}
                  onChange={(e) =>
                    setMasterForm((p) => ({ ...p, group: e.target.value }))
                  }
                  data-ocid="master.group.select"
                  className="w-36 bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-white text-xs outline-none"
                >
                  {GROUPS.map((g) => (
                    <option key={g}>{g}</option>
                  ))}
                </select>
                <label
                  htmlFor="master-account"
                  className="text-gray-400 text-xs ml-2 shrink-0"
                >
                  Account Name
                </label>
                <select
                  id="master-account"
                  value={masterForm.account}
                  onChange={(e) =>
                    setMasterForm((p) => ({ ...p, account: e.target.value }))
                  }
                  data-ocid="master.account.select"
                  className="w-36 bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-white text-xs outline-none"
                >
                  {ACCOUNTS.map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label
                  htmlFor="master-frequency"
                  className="text-gray-400 text-xs w-28 shrink-0"
                >
                  Frequency
                </label>
                <select
                  id="master-frequency"
                  value={masterForm.frequency}
                  onChange={(e) =>
                    setMasterForm((p) => ({ ...p, frequency: e.target.value }))
                  }
                  data-ocid="master.frequency.select"
                  className="w-44 bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-white text-xs outline-none"
                >
                  {FREQUENCIES.map((f) => (
                    <option key={f}>{f}</option>
                  ))}
                </select>
              </div>
              <div className="mt-2">
                <p className="text-orange-400 text-[11px] italic mb-2">
                  Select Months in which this fees becomes due towards student
                </p>
                <div className="grid grid-cols-4 gap-0 rounded overflow-hidden border border-gray-700">
                  {ALL_MONTHS.map((month, idx) => (
                    <label
                      key={month}
                      className={`flex items-center gap-2 px-3 py-1.5 cursor-pointer text-xs ${Math.floor(idx / 4) % 2 === 0 ? "bg-gray-800/60" : "bg-gray-700/30"}`}
                    >
                      <input
                        type="checkbox"
                        checked={masterForm.months.includes(month)}
                        onChange={() => toggleMonth(month)}
                        className="accent-blue-500 w-3 h-3"
                      />
                      <span className="text-gray-300">{month}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={addHeading}
                  data-ocid="master.heading.primary_button"
                  className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-1.5 rounded font-medium"
                >
                  <Plus size={13} /> New
                </button>
              </div>
            </div>
          </div>
          <div className="rounded-lg overflow-hidden border border-gray-700 mb-1">
            <div className="overflow-x-auto">
              <table className="w-full text-xs min-w-max">
                <thead>
                  <tr style={{ background: "#1a1f2e" }}>
                    <th className="text-left px-2 py-2 text-gray-400 font-medium w-8">
                      #
                    </th>
                    <th className="text-left px-2 py-2 text-gray-400 font-medium">
                      Fees Heading
                    </th>
                    <th className="text-left px-2 py-2 text-gray-400 font-medium">
                      Group
                    </th>
                    <th className="text-left px-2 py-2 text-gray-400 font-medium">
                      Account
                    </th>
                    <th className="text-left px-2 py-2 text-gray-400 font-medium">
                      Frequency
                    </th>
                    {ALL_MONTHS.map((m) => (
                      <th
                        key={m}
                        className="text-center px-1 py-2 text-gray-400 font-medium w-8"
                      >
                        {m}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {headings.map((h, i) => (
                    <tr
                      key={h.id}
                      onClick={() =>
                        setSelectedHeading(
                          selectedHeading?.id === h.id ? null : h,
                        )
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ")
                          setSelectedHeading(
                            selectedHeading?.id === h.id ? null : h,
                          );
                      }}
                      tabIndex={0}
                      className="cursor-pointer"
                      style={{
                        background:
                          selectedHeading?.id === h.id
                            ? "#1e3a5f"
                            : i % 2 === 0
                              ? "#111827"
                              : "#0f1117",
                      }}
                    >
                      <td className="px-2 py-1.5 text-gray-400">{i + 1}</td>
                      <td className="px-2 py-1.5 text-white">{h.heading}</td>
                      <td className="px-2 py-1.5 text-gray-300">{h.group}</td>
                      <td className="px-2 py-1.5 text-gray-300">{h.account}</td>
                      <td className="px-2 py-1.5 text-gray-300">
                        {h.frequency}
                      </td>
                      {ALL_MONTHS.map((m) => (
                        <td key={m} className="text-center px-1 py-1.5">
                          {h.months.includes(m) ? (
                            <span className="text-green-400 font-bold">✓</span>
                          ) : (
                            <span className="text-gray-700">-</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div
            className="flex items-center gap-3 mt-2 p-2 rounded"
            style={{ background: "#1a1f2e", border: "1px solid #374151" }}
          >
            <button
              type="button"
              onClick={deleteHeading}
              disabled={!selectedHeading}
              data-ocid="master.heading.delete_button"
              className="flex items-center gap-1 bg-red-700 hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs px-3 py-1.5 rounded"
            >
              <Trash2 size={12} /> Delete
            </button>
            <div className="flex items-center gap-4 text-xs flex-1">
              <span className="text-gray-500">
                Fees Name:{" "}
                <span className="text-gray-200">
                  {selectedHeading?.heading || "—"}
                </span>
              </span>
              <span className="text-gray-500">
                Group:{" "}
                <span className="text-gray-200">
                  {selectedHeading?.group || "—"}
                </span>
              </span>
              <span className="text-gray-500">
                Account Name:{" "}
                <span className="text-gray-200">
                  {selectedHeading?.account || "—"}
                </span>
              </span>
              <span className="text-gray-500">
                Frequency:{" "}
                <span className="text-gray-200">
                  {selectedHeading?.frequency || "—"}
                </span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── FEES PLAN TAB ── */}
      {tab === "plan" && (
        <div>
          <div
            className="rounded-lg p-4 mb-4"
            style={{ background: "#1a1f2e", border: "1px solid #374151" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <ScrollText size={15} className="text-blue-400" />
              <h3 className="text-white text-xs font-bold tracking-widest uppercase">
                Configure Fees Plan
              </h3>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div>
                <label
                  htmlFor="plan-feeshead"
                  className="text-gray-400 text-xs block mb-1"
                >
                  Select Fees Heading
                </label>
                <select
                  id="plan-feeshead"
                  value={planForm.feesHead}
                  onChange={(e) =>
                    setPlanForm((p) => ({ ...p, feesHead: e.target.value }))
                  }
                  data-ocid="plan.feeshead.select"
                  className="w-48 bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-white text-xs outline-none"
                >
                  {headings.map((h) => (
                    <option key={h.id}>{h.heading}</option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="plan-value"
                  className="text-gray-400 text-xs block mb-1"
                >
                  Fees Value
                </label>
                <input
                  id="plan-value"
                  type="number"
                  value={planForm.value}
                  onChange={(e) =>
                    setPlanForm((p) => ({ ...p, value: e.target.value }))
                  }
                  placeholder="0"
                  data-ocid="plan.value.input"
                  className="w-28 bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-white text-xs outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <p className="text-red-400 text-[11px] italic mb-3">
              Enter Value for selected fees heading and select classes and
              categories to which this fees value is applicable
            </p>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                id="selectAllClasses"
                checked={planForm.selectAll}
                onChange={toggleSelectAll}
                className="accent-blue-500 w-3 h-3"
              />
              <label
                htmlFor="selectAllClasses"
                className="text-gray-300 text-xs cursor-pointer"
              >
                Select All
              </label>
              <span className="text-gray-400 text-xs ml-2">Choose Classes</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="border border-gray-700 rounded overflow-hidden">
                <div className="bg-gray-700/40 px-3 py-1.5">
                  <span className="text-gray-300 text-xs font-medium">
                    Classes
                  </span>
                </div>
                <div className="max-h-40 overflow-y-auto">
                  {CLASS_LIST.map((cls, idx) => (
                    <label
                      key={cls}
                      className={`flex items-center gap-2 px-3 py-1.5 cursor-pointer text-xs ${idx % 2 === 0 ? "bg-gray-800/60" : "bg-gray-700/20"}`}
                    >
                      <input
                        type="checkbox"
                        checked={planForm.classes.includes(cls)}
                        onChange={() => toggleClass(cls)}
                        className="accent-blue-500 w-3 h-3"
                      />
                      <span className="text-gray-300">{cls}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="border border-gray-700 rounded overflow-hidden">
                <div className="bg-gray-700/40 px-3 py-1.5">
                  <span className="text-gray-300 text-xs font-medium">
                    Choose Category
                  </span>
                </div>
                <div>
                  {CATEGORIES.map((cat, idx) => (
                    <label
                      key={cat}
                      className={`flex items-center gap-2 px-3 py-1.5 cursor-pointer text-xs ${idx % 2 === 0 ? "bg-gray-800/60" : "bg-gray-700/20"}`}
                    >
                      <input
                        type="checkbox"
                        checked={planForm.categories.includes(cat)}
                        onChange={() => toggleCategory(cat)}
                        className="accent-blue-500 w-3 h-3"
                      />
                      <span className="text-gray-300">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-3">
              <button
                type="button"
                onClick={savePlan}
                data-ocid="plan.save.primary_button"
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-5 py-1.5 rounded font-medium"
              >
                Save
              </button>
            </div>
          </div>
          <div className="rounded-lg overflow-hidden border border-gray-700 mb-1">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ background: "#1a1f2e" }}>
                  {["Class", "Category", "Fees Head", "Value"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-3 py-2 text-gray-400 font-medium"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {plans.map((row, i) => (
                  <tr
                    key={row.id}
                    onClick={() =>
                      setSelectedPlan(selectedPlan?.id === row.id ? null : row)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ")
                        setSelectedPlan(
                          selectedPlan?.id === row.id ? null : row,
                        );
                    }}
                    tabIndex={0}
                    className="cursor-pointer"
                    style={{
                      background:
                        selectedPlan?.id === row.id
                          ? "#1e3a5f"
                          : i % 2 === 0
                            ? "#111827"
                            : "#0f1117",
                    }}
                  >
                    <td className="px-3 py-1.5 text-white">{row.className}</td>
                    <td className="px-3 py-1.5 text-gray-300">
                      {row.category}
                    </td>
                    <td className="px-3 py-1.5 text-gray-300">
                      {row.feesHead}
                    </td>
                    <td className="px-3 py-1.5 text-green-400">
                      ₹{row.value.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div
            className="flex items-center gap-3 mt-2 p-2 rounded"
            style={{ background: "#1a1f2e", border: "1px solid #374151" }}
          >
            <button
              type="button"
              onClick={deletePlan}
              disabled={!selectedPlan}
              data-ocid="plan.row.delete_button"
              className="flex items-center gap-1 bg-red-700 hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs px-3 py-1.5 rounded"
            >
              <Trash2 size={12} /> Delete
            </button>
            <div className="flex items-center gap-4 text-xs flex-1">
              <span className="text-gray-500">
                Fees Head:{" "}
                <span className="text-gray-200">
                  {selectedPlan?.feesHead || "—"}
                </span>
              </span>
              <span className="text-gray-500">
                Class:{" "}
                <span className="text-gray-200">
                  {selectedPlan?.className || "—"}
                </span>
              </span>
              <span className="text-gray-500">
                Category:{" "}
                <span className="text-gray-200">
                  {selectedPlan?.category || "—"}
                </span>
              </span>
              <span className="text-gray-500">
                Fees Value:{" "}
                <span className="text-green-300">
                  {selectedPlan
                    ? `₹${selectedPlan.value.toLocaleString("en-IN")}`
                    : "—"}
                </span>
              </span>
            </div>
          </div>
        </div>
      )}
      {tab === "othercharges" && (
        <div
          style={{
            background: "#0f1117",
            border: "1px solid #374151",
            borderRadius: 8,
          }}
        >
          <div
            style={{
              background: "#1a1f2e",
              borderBottom: "1px solid #374151",
              borderRadius: "8px 8px 0 0",
            }}
            className="flex items-center justify-between px-4 py-2"
          >
            <span className="text-white font-bold text-sm">OTHER CHARGES</span>
            <button
              type="button"
              onClick={() => {
                toast.success("Other charges saved");
              }}
              data-ocid="othercharges.save.primary_button"
              className="bg-green-600 hover:bg-green-700 text-white text-xs px-4 py-1.5 rounded font-medium transition"
            >
              Save
            </button>
          </div>
          <div className="p-4">
            <OtherChargesTable rows={otherCharges} onChange={setOtherCharges} />
            <div className="mt-3 flex items-center gap-4 text-xs">
              <span className="text-gray-400">
                Total Paid:{" "}
                <strong className="text-green-400">
                  ₹
                  {otherCharges
                    .reduce((s, r) => s + r.paid, 0)
                    .toLocaleString("en-IN")}
                </strong>
              </span>
              <span className="text-gray-400">
                Total Due:{" "}
                <strong className="text-red-400">
                  ₹
                  {otherCharges
                    .reduce((s, r) => s + r.due, 0)
                    .toLocaleString("en-IN")}
                </strong>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── OtherChargesTable component ───
interface OtherChargeRow {
  id: string;
  type: string;
  paid: number;
  due: number;
}

function OtherChargesTable({
  rows,
  onChange,
}: {
  rows: OtherChargeRow[];
  typeLabel?: string;
  onTypeLabelChange?: (v: string) => void;
  onChange: (rows: OtherChargeRow[]) => void;
}) {
  const update = (
    i: number,
    field: keyof OtherChargeRow,
    val: string | number,
  ) => {
    onChange(rows.map((r, idx) => (idx === i ? { ...r, [field]: val } : r)));
  };

  const addRow = () => {
    onChange([
      ...rows,
      { id: `oc-${Date.now()}`, type: "Other Charge", paid: 0, due: 0 },
    ]);
  };

  return (
    <div>
      <table className="w-full text-xs" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#1a1f2e" }}>
            <th className="text-left px-3 py-1.5 text-gray-400 font-medium">
              Type (Description)
            </th>
            <th className="text-left px-3 py-1.5 text-gray-400 font-medium">
              Paid Amount (₹)
            </th>
            <th className="text-left px-3 py-1.5 text-gray-400 font-medium">
              Due Amount (₹)
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIdx) => (
            <tr
              key={row.id}
              style={{
                background: rowIdx % 2 === 0 ? "#111827" : "#0f1117",
                borderBottom: "1px solid #374151",
              }}
              data-ocid={`othercharges.item.${rowIdx + 1}`}
            >
              <td className="px-3 py-1.5">
                <input
                  type="text"
                  value={row.type}
                  onChange={(e) => update(rowIdx, "type", e.target.value)}
                  placeholder="Type anything..."
                  className="bg-gray-900 border border-gray-600 rounded px-1.5 py-0.5 text-white text-xs outline-none focus:border-blue-400 w-full"
                  data-ocid="othercharges.input"
                />
              </td>
              <td className="px-3 py-1.5">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={row.paid === 0 ? "0" : String(row.paid)}
                  onFocus={(e) => {
                    if (e.target.value === "0") e.target.select();
                  }}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9]/g, "");
                    const stripped = raw.replace(/^0+(\d)/, "$1") || "0";
                    update(rowIdx, "paid", Number(stripped));
                  }}
                  className="bg-gray-900 border border-gray-600 rounded px-1.5 py-0.5 text-white text-xs outline-none focus:border-blue-400 w-full"
                  data-ocid={`othercharges.paid.${rowIdx + 1}`}
                />
              </td>
              <td className="px-3 py-1.5">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={row.due === 0 ? "0" : String(row.due)}
                  onFocus={(e) => {
                    if (e.target.value === "0") e.target.select();
                  }}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9]/g, "");
                    const stripped = raw.replace(/^0+(\d)/, "$1") || "0";
                    update(rowIdx, "due", Number(stripped));
                  }}
                  className="bg-gray-900 border border-gray-600 rounded px-1.5 py-0.5 text-white text-xs outline-none focus:border-blue-400 w-full"
                  data-ocid={`othercharges.due.${rowIdx + 1}`}
                />
              </td>
            </tr>
          ))}
          <tr style={{ background: "#1a1f2e", borderTop: "2px solid #374151" }}>
            <td className="px-3 py-1.5 text-gray-400 font-semibold">Total</td>
            <td className="px-3 py-1.5 text-green-400 font-semibold">
              ₹{rows.reduce((s, r) => s + r.paid, 0).toLocaleString("en-IN")}
            </td>
            <td className="px-3 py-1.5 text-red-400 font-semibold">
              ₹{rows.reduce((s, r) => s + r.due, 0).toLocaleString("en-IN")}
            </td>
          </tr>
        </tbody>
      </table>
      <button
        type="button"
        onClick={addRow}
        className="mt-2 flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition"
        data-ocid="othercharges.add_button"
      >
        + Add Another Row
      </button>
    </div>
  );
}
