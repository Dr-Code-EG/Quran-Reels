import { NextRequest } from "next/server";

const QURAN_API = "https://api.alquran.cloud/v1";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const surah = searchParams.get("surah");
  const edition = searchParams.get("edition") || "ar.alafasy";

  if (!surah) {
    return Response.json({ error: "surah parameter is required" }, { status: 400 });
  }

  const res = await fetch(`${QURAN_API}/surah/${surah}/${edition}`);
  const data = await res.json();

  return Response.json(data, {
    headers: {
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
