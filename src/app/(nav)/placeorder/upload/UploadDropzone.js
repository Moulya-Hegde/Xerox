import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";

export default function UploadDropzone({ onDrop, disabled }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
    disabled,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-md p-8 mb-4 text-center cursor-pointer transition ${
        isDragActive
          ? "bg-teal-100 text-black border-teal-500"
          : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
      }`}
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto h-8 w-8 mb-2 text-teal-600" />
      <p>
        Drag or click to add a <span className="font-medium text-teal-700">PDF</span>
      </p>
    </div>
  );
}
