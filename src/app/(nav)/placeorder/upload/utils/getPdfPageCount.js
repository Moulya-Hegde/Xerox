import { PDFDocument } from "pdf-lib";

export default async function getPdfPageCount(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  return pdfDoc.getPageCount();
}
