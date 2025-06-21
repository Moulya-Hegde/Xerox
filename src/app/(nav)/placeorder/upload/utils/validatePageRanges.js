export default function validatePageRanges(input, totalPages) {
  if (!input.trim()) return false;
  const parts = input.split(",");
  for (const part of parts) {
    if (/^\d+$/.test(part)) {
      const num = parseInt(part);
      if (num < 1 || num > totalPages) return false;
    } else if (/^\d+-\d+$/.test(part)) {
      const [start, end] = part.split("-").map(Number);
      if (start > end || start < 1 || end > totalPages) return false;
    } else {
      return false;
    }
  }
  return true;
}
