import { NextRequest, NextResponse } from "next/server"
import { revalidatePath, revalidateTag } from "next/cache"

const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET

export async function POST(req: NextRequest) {
  try {
    const auth = req.headers.get("x-revalidate-token") || req.nextUrl.searchParams.get("secret")
    if (!REVALIDATE_SECRET || auth !== REVALIDATE_SECRET) {
      return NextResponse.json({ ok: false, message: "unauthorized" }, { status: 401 })
    }

    const body = await req.json().catch(() => ({})) as {
      type?: "origin" | "guide" | "home" | "custom"
      slug?: string
      path?: string
    }

    const paths: string[] = []
    switch (body.type) {
      case "origin":
        if (body.slug) paths.push(`/origins/${body.slug}`)
        break
      case "guide":
        if (body.slug) paths.push(`/guides/${body.slug}`)
        break
      case "home":
        paths.push("/")
        break
      case "custom":
        if (body.path) paths.push(body.path)
        break
      default:
        break
    }

    // Fallback to tag revalidation when using country code segments
    if (!paths.length) {
      // Revalidate cache tags set in queries
      // Tags are defined in lib/cms/sanity.ts fetch calls
      if (req.nextUrl.searchParams.get("tag")) {
        await revalidateTag(req.nextUrl.searchParams.get("tag") as string)
      }
      return NextResponse.json({ ok: true, paths })
    }

    // Expand paths by country code based on regions in Medusa
    const backendUrl = process.env.MEDUSA_BACKEND_URL
    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
    let countryCodes: string[] = []
    try {
      if (!backendUrl) throw new Error("missing MEDUSA_BACKEND_URL")
      const res = await fetch(`${backendUrl}/store/regions`, {
        headers: { "x-publishable-api-key": publishableKey || "" },
        cache: "no-store",
      })
      const json = await res.json()
      countryCodes = (json?.regions || [])
        .map((r: any) => (r.countries || []).map((c: any) => c.iso_2))
        .flat()
        .filter(Boolean)
    } catch {}

    if (countryCodes.length) {
      const localizedPaths = paths.flatMap((p) => countryCodes.map((cc) => `/${cc}${p}`))
      await Promise.all(localizedPaths.map((p) => revalidatePath(p)))
    } else {
      // Fallback to non-localized path revalidation
      await Promise.all(paths.map((p) => revalidatePath(p)))
    }

    return NextResponse.json({ ok: true, paths })
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, message: e?.message || "revalidate error" },
      { status: 500 }
    )
  }
}


