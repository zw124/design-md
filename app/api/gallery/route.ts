import { NextRequest } from "next/server"
import { listGalleryItems, requireAdminCode, upsertGalleryItem } from "@/lib/gallery-server"

export const runtime = "nodejs"

export async function GET() {
  try {
    const items = await listGalleryItems()
    return Response.json({ items })
  } catch (error) {
    console.error("Gallery read failed", error)
    return Response.json({ items: [], fallback: true })
  }
}

export async function POST(request: NextRequest) {
  const unauthorized = requireAdminCode(request)
  if (unauthorized) return unauthorized

  try {
    const item = await request.json()
    await upsertGalleryItem(item)
    const items = await listGalleryItems()
    return Response.json({ items })
  } catch (error) {
    console.error("Gallery write failed", error)
    return Response.json({ error: "Failed to save gallery item" }, { status: 500 })
  }
}
