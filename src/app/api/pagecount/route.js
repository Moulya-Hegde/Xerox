// app/api/pagecount/route.js
export const runtime = "nodejs"; 

export async function GET() {
  console.log("GET /api/pagecount");
  return Response.json({ pages: 0 });
}

export async function POST(req) {
  const { pdfBase64 } = await req.json();

  const buffer = Buffer.from(pdfBase64.split(',')[1], 'base64');

  // Dynamically import
  const pdfParse = (await import('pdf-parse')).default;

  const data = await pdfParse(buffer);

  return Response.json({ pages: data.numpages });
}
