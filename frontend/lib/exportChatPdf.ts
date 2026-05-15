import { jsPDF } from "jspdf";

export type PdfChatMsg = { role: "user" | "assistant"; content: string };

function stripMarkdown(s: string): string {
  return s
    .replace(/\r\n/g, "\n")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`{1,3}[^`]*`{1,3}/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^\s*[-*]\s+/gm, "• ");
}

export function downloadChatPdf(messages: PdfChatMsg[], title = "HealthBot chat"): void {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentW = pageW - margin * 2;
  const bodyIndent = 4;
  let y = margin;

  function ensureSpace(mm: number): void {
    if (y + mm > pageH - margin) {
      doc.addPage();
      y = margin;
    }
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(15, 118, 110);
  doc.text(title, margin, y);
  y += 7;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  const exported = new Date().toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
  doc.text(`Exported ${exported}`, margin, y);
  y += 6;

  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.35);
  doc.line(margin, y, pageW - margin, y);
  y += 8;

  const lineHeight = 4.55;
  for (let i = 0; i < messages.length; i++) {
    const m = messages[i];
    const isUser = m.role === "user";
    const body = stripMarkdown(m.content).trim();
    if (!body) continue;

    ensureSpace(14);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(isUser ? 13 : 71, isUser ? 148 : 85, isUser ? 136 : 105);
    doc.text(isUser ? "You" : "Assistant", margin, y);
    y += 5.5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(30, 41, 59);
    const lines = doc.splitTextToSize(body, contentW - bodyIndent);
    for (const line of lines) {
      ensureSpace(lineHeight);
      doc.text(line, margin + bodyIndent, y);
      y += lineHeight;
    }
    y += 4;

    if (i < messages.length - 1) {
      ensureSpace(2);
      doc.setDrawColor(241, 245, 249);
      doc.setLineWidth(0.25);
      doc.line(margin + bodyIndent, y - 1, pageW - margin, y - 1);
      y += 3;
    }
  }

  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(`HealthBot · Page ${p} of ${totalPages}`, margin, pageH - 7);
  }

  doc.save("healthbot-chat.pdf");
}
