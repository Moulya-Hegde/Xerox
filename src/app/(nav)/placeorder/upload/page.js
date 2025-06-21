"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { genUploader } from "uploadthing/client";
import { CheckCircle } from "lucide-react";

import UploadDropzone from "./UploadDropzone";
import PDFPreviewCard from "./PDFPreviewCard";
import getPdfPageCount from "./utils/getPdfPageCount";
import validatePageRanges from "./utils/validatePageRanges";

const {uploadFiles} = genUploader();

export default function UploadPage() {
  const router = useRouter();
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("pendingUploads");
    if (stored) setFileList(JSON.parse(stored));
  }, []);

  useEffect(() => {
    sessionStorage.setItem("pendingUploads", JSON.stringify(fileList));
  }, [fileList]);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];
    const pageCount = await getPdfPageCount(file);
    const newEntry = {
      id: Date.now(),
      file,
      pageCount,
      colorMode: "none",
      colorPages: "",
      bwMode: "none",
      bwPages: "",
      printStyle: "single",
      copies: 1,
    };
    setFileList((prev) => [...prev, newEntry]);
  }, []);

  const updatePrintOption = (id, field, value) => {
    setFileList((prev) =>
      prev.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  const deleteEntry = (id) => {
    setFileList((prev) => prev.filter((entry) => entry.id !== id));
  };

  const handleSubmit = async () => {
    if (fileList.length === 0) return alert("No files to upload.");

    for (let entry of fileList) {
      if (
        (entry.colorMode === "custom" &&
          !validatePageRanges(entry.colorPages, entry.pageCount)) ||
        (entry.bwMode === "custom" &&
          !validatePageRanges(entry.bwPages, entry.pageCount)) ||
        (entry.colorMode === "all" && entry.bwMode === "all") ||
        (entry.colorMode === "none" && entry.bwMode === "none") ||
        entry.copies < 1
      ) {
        alert(`Please check print options for "${entry.file.name}"`);
        return;
      }
    }

    setUploading(true);
    try {
      const results = await Promise.all(
        fileList.map((entry) =>
          uploadFiles("pdfUploader", {
            files: [entry.file],
          })
        )
      );

      const allOrders = fileList.map((entry, idx) => ({
        fileName: entry.file.name,
        fileSize: entry.file.size,
        fileUrl: results[idx]?.[0]?.ufsUrl,
        pageCount: entry.pageCount,
        printOptions: {
          colorPages: entry.colorPages,
          bwPages: entry.bwPages,
          printStyle: entry.printStyle,
          copies: entry.copies,
        },
      }));

      sessionStorage.removeItem("pendingUploads");
      sessionStorage.setItem("orderSummary", JSON.stringify(allOrders));
      setUploaded(true);
      setFileList([]);
      router.push("/placeorder/summary");
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Upload PDFs</h1>

      {!uploaded ? (
        <>
          <UploadDropzone onDrop={onDrop} disabled={uploading} />
          {fileList.map((entry) => (
            <PDFPreviewCard
              key={entry.id}
              entry={entry}
              onChange={updatePrintOption}
              onDelete={deleteEntry}
            />
          ))}
          <button
  onClick={handleSubmit}
  disabled={uploading || fileList.length === 0}
  className={`mt-6 w-full py-3 rounded font-semibold flex justify-center items-center gap-2 ${
    uploading
      ? "bg-gray-400 text-white cursor-not-allowed"
      : "bg-teal-600 hover:bg-teal-700 text-white"
  }`}
>
  {uploading ? (
    <>
      <svg
        className="animate-spin h-5 w-5 text-white"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        ></path>
      </svg>
      <span className="ml-2">Uploading...</span>
    </>
  ) : (
    `Upload ${fileList.length} file${fileList.length > 1 ? "s" : ""}`
  )}
</button>

        </>
      ) : (
        <div className="mt-6 p-6 bg-green-900 text-center rounded-lg">
          <CheckCircle className="mx-auto mb-2 text-green-300" size={36} />
          <p className="text-lg font-medium">All PDFs uploaded successfully!</p>
        </div>
      )}
    </main>
  );
}

