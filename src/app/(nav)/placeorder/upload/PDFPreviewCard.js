import { Trash2 } from "lucide-react";

export default function PDFPreviewCard({ entry, onChange, onDelete }) {
  return (
    <div className="mb-4 p-4 bg-gray-800 rounded shadow">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-white">
          {entry.file.name} – {(entry.file.size / 1024).toFixed(1)} KB
        </span>
        <button
          onClick={() => onDelete(entry.id)}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="mb-2 text-sm text-gray-200">
        Total Pages: <span className="font-semibold">{entry.pageCount}</span>
      </div>

      <div className="space-y-2">
        <div>
          <label>Color Pages</label>
          <select
            className="w-full p-2 rounded bg-gray-700"
            value={entry.colorMode}
            onChange={(e) => {
              const value = e.target.value;
              onChange(entry.id, "colorMode", value);
              if (value !== "custom") {
                onChange(entry.id, "colorPages", value);
              }
            }}
          >
            <option value="none">None</option>
            <option value="all">All</option>
            <option value="rest">Rest</option>
            <option value="custom">Custom</option>
          </select>
          {entry.colorMode === "custom" && (
            <input
              className="w-full mt-1 p-2 rounded bg-gray-700"
              value={entry.colorPages}
              onChange={(e) => onChange(entry.id, "colorPages", e.target.value)}
              placeholder="e.g. 1,3-5"
            />
          )}
        </div>

        <div>
          <label>B&W Pages</label>
          <select
            className="w-full p-2 rounded bg-gray-700"
            value={entry.bwMode}
            onChange={(e) => {
              const value = e.target.value;
              onChange(entry.id, "bwMode", value);
              if (value !== "custom") {
                onChange(entry.id, "bwPages", value);
              }
            }}
            disabled={entry.colorMode === "all"}
          >
            <option value="none">None</option>
            <option value="all">All</option>
            <option value="rest">Rest</option>
            <option value="custom">Custom</option>
          </select>
          {entry.bwMode === "custom" && (
            <input
              className="w-full mt-1 p-2 rounded bg-gray-700"
              value={entry.bwPages}
              onChange={(e) => onChange(entry.id, "bwPages", e.target.value)}
              placeholder="e.g. 2,4-6"
            />
          )}
        </div>

        <div>
          <label>Printing Style</label>
          <select
            className="w-full p-2 rounded bg-gray-700"
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
            className="w-full p-2 rounded bg-gray-700"
            value={entry.copies}
            onChange={(e) =>
              onChange(entry.id, "copies", parseInt(e.target.value))
            }
          />
        </div>

        <div>
          <label>Binding</label>
          <select
            className="w-full p-2 rounded bg-gray-700"
            value={entry.binding}
            onChange={(e) => onChange(entry.id, "binding", e.target.value)}
          >
            <option value="none">None</option>
            <option value="spiral">Spiral</option>
            <option value="soft">Soft Binding</option>
          </select>
        </div>
      </div>
    </div>
  );
}
