import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token")
  if (!process.env.PREVIEW_TOKEN || token !== process.env.PREVIEW_TOKEN) {
    return NextResponse.json({ ok: false, message: "unauthorized" }, { status: 401 })
  }

  // Set a short-lived cookie to enable draft reads client-side if needed (we only read server-side)
  const res = NextResponse.json({ ok: true })
  res.cookies.set("_preview", "1", { maxAge: 60 * 30, httpOnly: true, sameSite: "lax" })
  return res
}


