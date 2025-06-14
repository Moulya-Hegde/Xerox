"use client";
import { useState } from "react";

export default function UploadPage() {
  const [documents, setDocuments] = useState([
    {
      file: null,
      name: "",
      pages: "",
      colorPages: "",
      bwPages: "",
      copies: 1,
      size: "A4",
    },
  ]);

  const handleAddDocument = () => {
    setDocuments([
      ...documents,
      {
        file: null,
        name: "",
        pages: "",
        colorPages: "",
        bwPages: "",
        copies: 1,
        size: "A4",
      },
    ]);
  };

  const handleChange = (index, field, value) => {
    const updated = [...documents];
    updated[index][field] = value;
    setDocuments(updated);
  };

  return (
    <section className="min-h-screen px-6 py-20 bg-black text-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left Pane - Upload */}
        <div className="flex flex-col gap-6">
          {documents.map((doc, index) => (
            <div key={index} className="bg-white/5 p-6 rounded-xl shadow-md backdrop-blur border border-white/10">
              <h2 className="text-xl font-semibold mb-4">Document {index + 1}</h2>

              <input
                type="file"
                accept="application/pdf,image/*"
                onChange={(e) =>
                  handleChange(index, "file", e.target.files[0])
                }
                className="w-full mb-4 bg-black/20 p-2 rounded text-sm"
              />

              <input
                type="text"
                placeholder="Order / Document Name"
                value={doc.name}
                onChange={(e) =>
                  handleChange(index, "name", e.target.value)
                }
                className="w-full mb-3 bg-black/20 p-2 rounded"
              />

              <input
                type="number"
                placeholder="Total Number of Pages"
                value={doc.pages}
                onChange={(e) =>
                  handleChange(index, "pages", e.target.value)
                }
                className="w-full mb-3 bg-black/20 p-2 rounded"
              />

              <input
                type="text"
                placeholder="Color Print Pages (e.g., 1,3-5)"
                value={doc.colorPages}
                onChange={(e) =>
                  handleChange(index, "colorPages", e.target.value)
                }
                className="w-full mb-3 bg-black/20 p-2 rounded"
              />

              <input
                type="text"
                placeholder="B&W Print Pages (e.g., 2,4,6-8)"
                value={doc.bwPages}
                onChange={(e) =>
                  handleChange(index, "bwPages", e.target.value)
                }
                className="w-full mb-3 bg-black/20 p-2 rounded"
              />

              <div className="flex gap-4">
                <input
                  type="number"
                  placeholder="Copies"
                  value={doc.copies}
                  onChange={(e) =>
                    handleChange(index, "copies", e.target.value)
                  }
                  className="w-1/2 bg-black/20 p-2 rounded"
                />

                <select
                  value={doc.size}
                  onChange={(e) =>
                    handleChange(index, "size", e.target.value)
                  }
                  className="w-1/2 bg-black/20 p-2 rounded"
                >
                  <option value="A4">A4</option>
                  <option value="A3">A3</option>
                </select>
              </div>
            </div>
          ))}

          <button
            onClick={handleAddDocument}
            className="mt-2 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
          >
            + Add Another Document
          </button>
        </div>

        {/* Right Pane - Preview */}
        <div className="bg-white/5 p-6 rounded-xl shadow-md border border-white/10 flex flex-col items-center justify-center min-h-[400px]">
          <h2 className="text-xl font-semibold mb-4">Preview</h2>
          {documents[0].file ? (
            <p className="text-sm text-white/80">
              File Selected: <span className="font-medium">{documents[0].file.name}</span>
            </p>
          ) : (
            <p className="text-white/50">No file selected yet</p>
          )}
        </div>
      </div>
    </section>
  );
}
