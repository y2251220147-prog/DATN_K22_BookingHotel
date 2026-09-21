import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { MiniStatsTablePayload } from "@/app/(dashboard)/components/statistical/MiniStatsDashboard";
import { formatDate } from "./formatDate";

// ─── Config ────────────────────────────────────────────────────────────────────
const LAST_COL = "E";

const C = {
    indigo600: "FF4F46E5",
    indigo500: "FF6366F1",
    indigoLight: "FFE0E7FF",
    indigoText: "FF3730A3",
    gray800: "FF1F2937",
    gray700: "FF374151",
    gray50: "FFF9FAFB",
    emerald600: "FF059669",
    emeraldLight: "FFD1FAE5",
    white: "FFFFFFFF",
    borderLight: "FFE5E7EB",
    borderMed: "FFD1D5DB",
    textDark: "FF111827",
    subtext: "FF9CA3AF",
    totalBg: "FFEEF2FF", // indigo-50 — nổi bật hơn gray
} as const;

// ─── Style helpers ─────────────────────────────────────────────────────────────
const fill = (argb: string): ExcelJS.Fill =>
    ({ type: "pattern", pattern: "solid", fgColor: { argb } });

const border = (style: ExcelJS.BorderStyle, color: string): Partial<ExcelJS.Border> =>
    ({ style, color: { argb: color } });

const allBorder = (s: ExcelJS.BorderStyle, clr: string): Partial<ExcelJS.Borders> => ({
    top: border(s, clr), bottom: border(s, clr),
    left: border(s, clr), right: border(s, clr),
});

const rowBorder = (clr: string = C.borderLight): Partial<ExcelJS.Borders> => allBorder("thin", clr);

const headerBorder = (clr: string = C.gray700): Partial<ExcelJS.Borders> => ({
    top: border("medium", clr),
    bottom: border("medium", clr),
    left: border("thin", clr),
    right: border("thin", clr),
});

const totalBorder = (): Partial<ExcelJS.Borders> => ({
    top: border("medium", C.indigo500),
    bottom: border("medium", C.indigo500),
    left: border("thin", C.borderMed),
    right: border("thin", C.borderMed),
});

// ─── Số học ────────────────────────────────────────────────────────────────────
type ColType = "currency" | "number" | "percent" | "text" | undefined;

function numFmt(type: ColType): string | undefined {
    switch (type) {
        case "currency": return '#,##0" ₫"';
        case "number": return "#,##0";
        // FIX: percent — nếu backend trả 0–100 thì chia 100 khi gán value
        // nếu backend trả 0.0–1.0 thì dùng "0.0%" trực tiếp
        case "percent": return "0.00%";
        default: return undefined;
    }
}

/**
 * FIX: normalize percent value
 * Nếu giá trị > 1 (ví dụ 100, 85.5) → đây là dạng "phần trăm nguyên" → chia 100
 * Nếu giá trị <= 1 (ví dụ 0.85) → đã đúng dạng thập phân
 */
function castValue(raw: unknown, type: ColType): ExcelJS.CellValue {
    if (type === "currency" || type === "number") return Number(raw) || 0;
    if (type === "percent") {
        const n = Number(raw) || 0;
        return n > 1 ? n / 100 : n; // normalize 100 → 1.0, 0.85 → 0.85
    }
    return raw as ExcelJS.CellValue;
}

function isKpiTable(rows: Record<string, unknown>[]): boolean {
    return (
        rows.length > 0 &&
        rows.every((r) => typeof r.metric === "string" && r.metric.trim() && "value" in r)
    );
}

// ─── Section title row ─────────────────────────────────────────────────────────
function writeSectionTitle(
    sheet: ExcelJS.Worksheet,
    row: number,
    text: string,
    bgColor: string
) {
    sheet.mergeCells(`A${row}:${LAST_COL}${row}`);
    const cell = sheet.getCell(`A${row}`);
    cell.value = text.toUpperCase();
    cell.font = { name: "Arial", size: 11, bold: true, color: { argb: C.white } };
    cell.fill = fill(bgColor);
    cell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
    sheet.getRow(row).height = 28;
}

// ─── Main export ───────────────────────────────────────────────────────────────
export const exportDashboardToExcel = async (
    payload: MiniStatsTablePayload,
    hotelName = "DAU HOTEL"
) => {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Admin System";
    workbook.created = new Date();

    const sheet = workbook.addWorksheet("Báo Cáo Tổng Quan", {
        views: [{ state: "frozen", ySplit: 3, showGridLines: false }],
    });

    // FIX: column width trước tiên — set trước mọi mergeCells
    sheet.columns = [
        { width: 32 }, // A — label / tên
        { width: 22 }, // B
        { width: 18 }, // C
        { width: 24 }, // D — email dài
        { width: 16 }, // E
    ];

    // ── Header ──────────────────────────────────────────────────────────────────
    sheet.mergeCells("A1:E1");
    Object.assign(sheet.getCell("A1"), {
        value: `BÁO CÁO THỐNG KÊ — ${hotelName.toUpperCase()}`,
        font: { name: "Arial", size: 16, bold: true, color: { argb: C.white } },
        fill: fill(C.indigo600),
        alignment: { vertical: "middle", horizontal: "center" },
    });
    sheet.getRow(1).height = 46;

    sheet.mergeCells("A2:E2");
    Object.assign(sheet.getCell("A2"), {
        value: `Kỳ báo cáo: ${payload.period.label}   (${formatDate(payload.period.from)} — ${formatDate(payload.period.to)})`,
        font: { name: "Arial", size: 10, italic: true, color: { argb: C.subtext } },
        fill: fill(C.indigoLight),
        alignment: { vertical: "middle", horizontal: "center" },
    });
    sheet.getRow(2).height = 24;

    sheet.getRow(3).height = 8; // spacer
    let r = 4;

    // ── Tables ──────────────────────────────────────────────────────────────────
    for (const table of payload.tables) {
        writeSectionTitle(sheet, r, table.title, C.gray700);
        r++;

        if (isKpiTable(table.rows)) {
            // KPI block: label (A–B merge) | value (C–E merge) — FULL width
            for (const kpi of table.rows) {
                const zebra = r % 2 === 0 ? C.white : C.gray50;

                // Label: A–B
                sheet.mergeCells(`A${r}:B${r}`);
                const lc = sheet.getCell(`A${r}`);
                lc.value = kpi.metric as string;
                lc.font = { name: "Arial", size: 10, bold: true, color: { argb: C.textDark } };
                lc.fill = fill(zebra);
                lc.alignment = { vertical: "middle", horizontal: "left", indent: 2 };
                lc.border = rowBorder();

                // Value: C–E (right-aligned, colored)
                sheet.mergeCells(`C${r}:${LAST_COL}${r}`);
                const vc = sheet.getCell(`C${r}`);
                const type = kpi.type as ColType;
                vc.value = castValue(kpi.value, type);
                vc.font = { name: "Arial", size: 11, bold: true, color: { argb: C.indigoText } };
                vc.fill = fill(zebra);
                vc.alignment = { vertical: "middle", horizontal: "right", indent: 2 };
                vc.border = rowBorder();
                const fmt = numFmt(type);
                if (fmt) vc.numFmt = fmt;

                sheet.getRow(r).height = 24;
                r++;
            }
        } else {
            // Table header
            const hrow = sheet.getRow(r);
            for (const [ci, col] of table.columns.entries()) {
                const cell = hrow.getCell(ci + 1);
                cell.value = col.label;
                cell.font = { name: "Arial", size: 10, bold: true, color: { argb: C.white } };
                cell.fill = fill(C.indigo500);
                cell.alignment = { vertical: "middle", horizontal: "center" };
                cell.border = headerBorder();
            }
            hrow.height = 26;
            const dataStart = r + 1;
            r++;

            // Data rows
            for (const rowObj of table.rows) {
                const zebra = r % 2 === 0 ? C.white : C.gray50;
                const drow = sheet.getRow(r);

                for (const [ci, col] of table.columns.entries()) {
                    const cell = drow.getCell(ci + 1);
                    const type = col.type as ColType;
                    cell.value = castValue(rowObj[col.key], type);
                    cell.fill = fill(zebra);
                    cell.border = rowBorder();
                    cell.alignment = {
                        vertical: "middle",
                        horizontal: ci === 0 ? "left" : "center",
                        indent: ci === 0 ? 1 : 0,
                    };
                    const fmt = numFmt(type);
                    if (fmt) cell.numFmt = fmt;
                }
                drow.height = 21;
                r++;
            }

            // FIX: dòng tổng — chỉ với cột currency / number
            const summableCols = table.columns.filter(
                (c) => c.type === "currency" || c.type === "number"
            );
            if (summableCols.length > 0 && table.rows.length > 1) {
                const trow = sheet.getRow(r);
                for (const [ci, col] of table.columns.entries()) {
                    const cell = trow.getCell(ci + 1);
                    const colLetter = String.fromCharCode(65 + ci);
                    const type = col.type as ColType;

                    if (ci === 0) {
                        cell.value = "TỔNG CỘNG";
                    } else if (type === "currency" || type === "number") {
                        cell.value = { formula: `SUM(${colLetter}${dataStart}:${colLetter}${r - 1})` };
                    }
                    cell.font = { name: "Arial", size: 10, bold: true, color: { argb: C.indigoText } };
                    cell.fill = fill(C.totalBg);
                    cell.border = totalBorder();
                    cell.alignment = { vertical: "middle", horizontal: ci === 0 ? "left" : "center", indent: ci === 0 ? 1 : 0 };
                    const fmt = numFmt(type);
                    if (fmt) cell.numFmt = fmt;
                }
                trow.height = 24;
                r++;
            }
        }

        // Spacer giữa các bảng
        sheet.getRow(r).height = 8;
        r++;
    }

    // ── Charts data ─────────────────────────────────────────────────────────────
    if (payload.charts?.length) {
        for (const chart of payload.charts) {
            writeSectionTitle(sheet, r, `Dữ liệu biểu đồ — ${chart.title}`, C.emerald600);
            r++;

            // Chart header: 2 cột chiếm A–B và C–E
            sheet.mergeCells(`A${r}:B${r}`);
            const ch1 = sheet.getCell(`A${r}`);
            ch1.value = "Phân loại";
            ch1.font = { name: "Arial", size: 10, bold: true, color: { argb: C.textDark } };
            ch1.fill = fill(C.emeraldLight);
            ch1.alignment = { vertical: "middle", horizontal: "center" };
            ch1.border = headerBorder(C.emerald600);

            sheet.mergeCells(`C${r}:${LAST_COL}${r}`);
            const ch2 = sheet.getCell(`C${r}`);
            ch2.value = "Giá trị";
            ch2.font = { name: "Arial", size: 10, bold: true, color: { argb: C.textDark } };
            ch2.fill = fill(C.emeraldLight);
            ch2.alignment = { vertical: "middle", horizontal: "center" };
            ch2.border = headerBorder(C.emerald600);
            sheet.getRow(r).height = 24;
            r++;

            for (const d of chart.data) {
                const zebra = r % 2 === 0 ? C.white : C.gray50;
                const type = chart.valueType as ColType;
                const val = castValue(d[chart.dataKey], type);
                const fmt = numFmt(type) ?? "#,##0";

                sheet.mergeCells(`A${r}:B${r}`);
                const c1 = sheet.getCell(`A${r}`);
                c1.value = d[chart.nameKey] as string;
                c1.fill = fill(zebra);
                c1.border = rowBorder();
                c1.alignment = { vertical: "middle", horizontal: "left", indent: 2 };

                sheet.mergeCells(`C${r}:${LAST_COL}${r}`);
                const c2 = sheet.getCell(`C${r}`);
                c2.value = val;
                c2.numFmt = fmt;
                c2.fill = fill(zebra);
                c2.border = rowBorder();
                c2.alignment = { vertical: "middle", horizontal: "right", indent: 2 };
                c2.font = { name: "Arial", size: 10, color: { argb: C.textDark } };

                sheet.getRow(r).height = 21;
                r++;
            }

            sheet.getRow(r).height = 8;
            r++;
        }
    }

    // ── Footer ──────────────────────────────────────────────────────────────────
    sheet.mergeCells(`A${r}:${LAST_COL}${r}`);
    const footer = sheet.getCell(`A${r}`);
    footer.value = `Báo cáo tự động — ${new Date().toLocaleDateString("vi-VN")}`;
    footer.font = { name: "Arial", size: 9, italic: true, color: { argb: C.subtext } };
    footer.alignment = { horizontal: "center", vertical: "middle" };
    sheet.getRow(r).height = 20;

    // ── Export ──────────────────────────────────────────────────────────────────
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(
        new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
        `Bao_Cao_${payload.period.label.replace(/\s+/g, "_")}.xlsx`
    );
};