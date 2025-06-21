"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { genUploader } from "uploadthing/client";
import { CheckCircle } from "lucide-react";

import UploadDropzone from "./UploadDropzone";
import PDFPreviewCard from "./PDFPreviewCard";
import getPdfPageCount from "./utils/getPdfPageCount";
import validatePageRanges from "./utils/validatePageRanges";
import { useOrder } from "@/app/context/OrderContext";

const { uploadFiles } = genUploader();

export default function UploadPage() {
  const router = useRouter();
  const { addFiles, clearOrder } = useOrder();

  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];
    const pageCount = await getPdfPageCount(file);
    const newEntry = {
      id: Date.now(),
      file,
      pageCount,
      colorMode: "none",
      colorPages: "none",
      bwMode: "none",
      bwPages: "none",
      printStyle: "single",
      copies: 1,
      binding: "none",
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
      const { file, colorMode, colorPages, bwMode, bwPages, pageCount, copies } = entry;

      if (colorMode === "custom" && !validatePageRanges(colorPages.trim(), pageCount)) {
        alert(`Invalid custom Color Pages in "${file.name}". Please use format like 1,3-5 and stay within ${pageCount} pages.`);
        return;
      }

      if (bwMode === "custom" && !validatePageRanges(bwPages.trim(), pageCount)) {
        alert(`Invalid custom B&W Pages in "${file.name}". Please use format like 2,4-6 and stay within ${pageCount} pages.`);
        return;
      }

      if (colorMode === "all" && bwMode === "all") {
        alert(`Both Color and B&W can't be set to "All" in "${file.name}". Choose one or split pages.`);
        return;
      }

      if (colorMode === "none" && bwMode === "none") {
        alert(`You must select either Color or B&W pages to print in "${file.name}".`);
        return;
      }

      if (copies < 1) {
        alert(`Please enter at least 1 copy for "${file.name}".`);
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

      const uploadedFiles = fileList.map((entry, idx) => ({
        file: {
          name: entry.file.name,
          size: entry.file.size,
          type: entry.file.type,
        },
        uploadData: {
          url: results[idx]?.[0]?.url || results[idx]?.[0]?.ufsUrl || null,
          key: results[idx]?.[0]?.key || null,
          filename: results[idx]?.[0]?.name || entry.file.name,
        },
        printOptions: {
          colorPages: entry.colorPages,
          bwPages: entry.bwPages,
          printStyle: entry.printStyle,
          copies: entry.copies,
          binding: entry.binding,
        },
      }));

      clearOrder(); // optional: reset before adding new
      addFiles(uploadedFiles);

      // 🔄 Add short delay to ensure context update is persisted before navigation
      setTimeout(() => {
        setUploaded(true);
        setFileList([]);
        router.push("/placeorder/summary");
      }, 100); // 100ms is enough
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
