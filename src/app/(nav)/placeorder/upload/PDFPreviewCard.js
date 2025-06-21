import { Trash2 } from "lucide-react";

export default function PDFPreviewCard({ entry, onChange, onDelete }) {
  return (
    <div className="mb-4 p-4 bg-white dark:bg-gray-800 rounded shadow">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-black dark:text-white">
          {entry.file.name} – {(entry.file.size / 1024).toFixed(1)} KB
        </span>
        <button
          onClick={() => onDelete(entry.id)}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="mb-2 text-sm text-gray-800 dark:text-gray-200">
        Total Pages: <span className="font-semibold">{entry.pageCount}</span>
      </div>

      <div className="space-y-2">
        <div>
          <label>Color Pages</label>
          <select
            className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700"
            value={entry.colorMode}
            onChange={(e) => onChange(entry.id, "colorMode", e.target.value)}
          >
            <option value="none">None</option>
            <option value="all">All</option>
            <option value="rest">Rest</option>
            <option value="custom">Custom</option>
          </select>
          {entry.colorMode === "custom" && (
            <input
              className="w-full mt-1 p-2 rounded bg-gray-50 dark:bg-gray-700"
              value={entry.colorPages}
              onChange={(e) => onChange(entry.id, "colorPages", e.target.value)}
              placeholder="e.g. 1,3-5"
            />
          )}
        </div>

        <div>
          <label>B&W Pages</label>
          <select
            className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700"
            value={entry.bwMode}
            onChange={(e) => onChange(entry.id, "bwMode", e.target.value)}
            disabled={entry.colorMode === "all"}
          >
            <option value="none">None</option>
            <option value="all">All</option>
            <option value="rest">Rest</option>
            <option value="custom">Custom</option>
          </select>
          {entry.bwMode === "custom" && (
            <input
              className="w-full mt-1 p-2 rounded bg-gray-50 dark:bg-gray-700"
              value={entry.bwPages}
              onChange={(e) => onChange(entry.id, "bwPages", e.target.value)}
              placeholder="e.g. 2,4-6"
            />
          )}
        </div>

        <div>
          <label>Printing Style</label>
          <select
            className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700"
            value={entry.printStyle}
            onChange={(e) => onChange(entry.id, "printStyle", e.target.value)}
          >
            <option value="single">Single Side</option>
            <option value="double">Front-Back</option>
          </select>
        </div>

        <div>
          <label>No. of Copies</label>
          <input
            type="number"
            min="1"
            className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700"
            value={entry.copies}
            onChange={(e) =>
              onChange(entry.id, "copies", parseInt(e.target.value))
            }
          />
        </div>
      </div>
    </div>
  );
}
