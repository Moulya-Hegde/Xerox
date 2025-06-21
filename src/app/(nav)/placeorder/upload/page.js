// "use client";

// import { useState, useCallback, useEffect } from "react";
// import { useDropzone } from "react-dropzone";
// import { genUploader } from "uploadthing/client";
// import { Upload, Trash2, CheckCircle } from "lucide-react";
// import { useRouter } from "next/navigation";

// const uploadFiles = genUploader();

// export default function UploadPage() {
//   const router = useRouter();

//   const [fileList, setFileList] = useState([]);
//   const [uploading, setUploading] = useState(false);
//   const [uploaded, setUploaded] = useState(false);

//   // Load from sessionStorage
//   useEffect(() => {
//     const stored = sessionStorage.getItem("pendingUploads");
//     if (stored) setFileList(JSON.parse(stored));
//   }, []);

//   useEffect(() => {
//     sessionStorage.setItem("pendingUploads", JSON.stringify(fileList));
//   }, [fileList]);

//   const getPageCount = async (file) => {
//     const base64 = await new Promise((resolve) => {
//       const reader = new FileReader();
//       reader.onload = () => resolve(reader.result);
//       reader.readAsDataURL(file);
//     });

//     const res = await fetch("/api/pagecount", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ pdfBase64: base64 }),
//     });

//     const data = await res.json();
//     return res.ok ? data.pages : 1;
//   };

//   const onDrop = useCallback(async (acceptedFiles) => {
//     if (acceptedFiles.length === 0) return;

//     const file = acceptedFiles[0];
//     const pageCount = await getPageCount(file);

//     const newEntry = {
//       id: Date.now(),
//       file,
//       pageCount,
//       colorMode: "none",
//       colorPages: "",
//       bwMode: "none",
//       bwPages: "",
//       printStyle: "single",
//       copies: 1,
//     };
//     setFileList((prev) => [...prev, newEntry]);
//   }, []);

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     accept: { "application/pdf": [".pdf"] },
//     multiple: false,
//     disabled: uploading || uploaded,
//   });

//   const updatePrintOption = (id, field, value) => {
//     setFileList((prev) =>
//       prev.map((entry) =>
//         entry.id === id ? { ...entry, [field]: value } : entry
//       )
//     );
//   };

//   const deleteEntry = (id) => {
//     setFileList((prev) => prev.filter((entry) => entry.id !== id));
//   };

//   const validateCustomPages = (input, totalPages) => {
//     if (!input.trim()) return false;
//     const parts = input.split(",");
//     for (const part of parts) {
//       if (/^\d+$/.test(part)) {
//         const num = parseInt(part);
//         if (num < 1 || num > totalPages) return false;
//       } else if (/^\d+-\d+$/.test(part)) {
//         const [start, end] = part.split("-").map(Number);
//         if (start > end || start < 1 || end > totalPages) return false;
//       } else {
//         return false;
//       }
//     }
//     return true;
//   };

//   const handleSubmit = async () => {
//     if (fileList.length === 0) return alert("No files to upload.");

//     for (let entry of fileList) {
//       const { colorMode, colorPages, bwMode, bwPages, pageCount, copies } = entry;

//       if (colorMode === "custom" && !validateCustomPages(colorPages, pageCount)) {
//         alert(`Invalid color page range for ${entry.file.name}`);
//         return;
//       }

//       if (bwMode === "custom" && !validateCustomPages(bwPages, pageCount)) {
//         alert(`Invalid B&W page range for ${entry.file.name}`);
//         return;
//       }

//       if (colorMode === "all" && bwMode === "all") {
//         alert(`File "${entry.file.name}" can't be fully color and fully B&W at the same time.`);
//         return;
//       }

//       if (colorMode === "none" && bwMode === "none") {
//         alert(`Please select either color or B&W pages for "${entry.file.name}".`);
//         return;
//       }

//       if (copies < 1) {
//         alert(`Invalid number of copies for "${entry.file.name}"`);
//         return;
//       }
//     }

//     setUploading(true);

//     try {
//       const results = await Promise.all(
//         fileList.map((entry) =>
//           uploadFiles("pdfUploader", {
//             files: [entry.file],
//             onUploadBegin: ({ file }) =>
//               console.log("Started:", file.name),
//             onUploadProgress: ({ file, progress }) =>
//               console.log("Progress:", file.name, progress),
//           })
//         )
//       );

//       const allOrders = fileList.map((entry, idx) => ({
//         fileName: entry.file.name,
//         fileSize: entry.file.size,
//         fileUrl: results[idx]?.[0]?.ufsUrl,
//         pageCount: entry.pageCount,
//         printOptions: {
//           colorPages: entry.colorPages,
//           bwPages: entry.bwPages,
//           printStyle: entry.printStyle,
//           copies: entry.copies,
//         },
//       }));

//       setUploaded(true);
//       sessionStorage.removeItem("pendingUploads");
//       setFileList([]);
//       sessionStorage.setItem("orderSummary", JSON.stringify(allOrders));
//       router.push("/placeorder/summary");
//     } catch (err) {
//       console.error("Upload failed:", err);
//       alert("Upload failed. Please try again.");
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <main className="min-h-screen bg-black text-white p-6">
//       <h1 className="text-3xl font-bold text-center mb-6">Upload PDFs</h1>

//       {!uploaded && (
//         <>
//           <div
//             {...getRootProps()}
//             className={`border-2 border-dashed rounded-md p-8 mb-4 text-center cursor-pointer transition ${
//               isDragActive
//                 ? "bg-teal-100 text-black border-teal-500"
//                 : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
//             }`}
//           >
//             <input {...getInputProps()} />
//             <Upload className="mx-auto h-8 w-8 mb-2 text-teal-600" />
//             <p>
//               Drag or click to add a{" "}
//               <span className="font-medium text-teal-700">PDF</span>
//             </p>
//           </div>

//           {fileList.map((entry) => (
//             <div
//               key={entry.id}
//               className="mb-4 p-4 bg-white dark:bg-gray-800 rounded shadow"
//             >
//               <div className="flex justify-between items-center mb-2">
//                 <span className="text-sm text-black dark:text-white">
//                   {entry.file.name} – {(entry.file.size / 1024).toFixed(1)} KB
//                 </span>
//                 <button
//                   onClick={() => deleteEntry(entry.id)}
//                   className="text-red-500 hover:text-red-700"
//                 >
//                   <Trash2 size={18} />
//                 </button>
//               </div>

//               {/* Page Count Display */}
//               <div className="mb-2 text-sm text-gray-800 dark:text-gray-200">
//                 Total Pages: <span className="font-semibold">{entry.pageCount}</span>
//               </div>

//               {/* Print Options */}
//               <div className="space-y-2">
//                 {/* Color */}
//                 <div>
//                   <label>Color Pages</label>
//                   <select
//                     className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700"
//                     value={entry.colorMode}
//                     onChange={(e) =>
//                       updatePrintOption(entry.id, "colorMode", e.target.value)
//                     }
//                   >
//                     <option value="none">None</option>
//                     <option value="all">All</option>
//                     <option value="rest">Rest</option>
//                     <option value="custom">Custom</option>
//                   </select>
//                   {entry.colorMode === "custom" && (
//                     <input
//                       className="w-full mt-1 p-2 rounded bg-gray-50 dark:bg-gray-700"
//                       value={entry.colorPages}
//                       onChange={(e) =>
//                         updatePrintOption(entry.id, "colorPages", e.target.value)
//                       }
//                       placeholder="e.g. 1,3-5"
//                     />
//                   )}
//                 </div>

//                 {/* B&W */}
//                 <div>
//                   <label>B&W Pages</label>
//                   <select
//                     className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700"
//                     value={entry.bwMode}
//                     onChange={(e) =>
//                       updatePrintOption(entry.id, "bwMode", e.target.value)
//                     }
//                     disabled={entry.colorMode === "all"}
//                   >
//                     <option value="none">None</option>
//                     <option value="all">All</option>
//                     <option value="rest">Rest</option>
//                     <option value="custom">Custom</option>
//                   </select>
//                   {entry.bwMode === "custom" && (
//                     <input
//                       className="w-full mt-1 p-2 rounded bg-gray-50 dark:bg-gray-700"
//                       value={entry.bwPages}
//                       onChange={(e) =>
//                         updatePrintOption(entry.id, "bwPages", e.target.value)
//                       }
//                       placeholder="e.g. 2,4-6"
//                     />
//                   )}
//                 </div>

//                 {/* Print Style */}
//                 <div>
//                   <label>Printing Style</label>
//                   <select
//                     className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700"
//                     value={entry.printStyle}
//                     onChange={(e) =>
//                       updatePrintOption(entry.id, "printStyle", e.target.value)
//                     }
//                   >
//                     <option value="single">Single Side</option>
//                     <option value="double">Front-Back</option>
//                   </select>
//                 </div>

//                 {/* Copies */}
//                 <div>
//                   <label>No. of Copies</label>
//                   <input
//                     type="number"
//                     min="1"
//                     className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700"
//                     value={entry.copies}
//                     onChange={(e) =>
//                       updatePrintOption(entry.id, "copies", parseInt(e.target.value))
//                     }
//                   />
//                 </div>
//               </div>
//             </div>
//           ))}

//           <button
//             onClick={handleSubmit}
//             disabled={uploading || fileList.length === 0}
//             className={`mt-6 w-full py-3 rounded font-semibold flex justify-center items-center gap-2 ${
//               uploading
//                 ? "bg-gray-400 text-white cursor-not-allowed"
//                 : "bg-teal-600 hover:bg-teal-700 text-white"
//             }`}
//           >
//             {uploading ? (
//               <>
//                 <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                   ></circle>
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
//                   ></path>
//                 </svg>
//                 Uploading...
//               </>
//             ) : (
//               <>
//                 <Upload size={18} />
//                 Submit & Upload {fileList.length} file
//                 {fileList.length > 1 ? "s" : ""}
//               </>
//             )}
//           </button>
//         </>
//       )}

//       {uploaded && (
//         <div className="mt-6 p-6 bg-green-100 dark:bg-green-900 text-center rounded-lg">
//           <CheckCircle
//             className="mx-auto mb-2 text-green-600 dark:text-green-300"
//             size={36}
//           />
//           <p className="text-lg font-medium">All PDFs uploaded successfully!</p>
//         </div>
//       )}
//     </main>
//   );
// }
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
        <div className="mt-6 p-6 bg-green-100 dark:bg-green-900 text-center rounded-lg">
          <CheckCircle className="mx-auto mb-2 text-green-600 dark:text-green-300" size={36} />
          <p className="text-lg font-medium">All PDFs uploaded successfully!</p>
        </div>
      )}
    </main>
  );
}

