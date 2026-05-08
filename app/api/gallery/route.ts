import { NextRequest } from "next/server"
import { DEFAULT_GALLERY_ITEMS } from "@/lib/gallery-data"
import { listGalleryItems, requireAdminCode, restoreDefaultGalleryItems, upsertGalleryItem } from "@/lib/gallery-server"

export const runtime = "nodejs"

export async function GET() {
  try {
    const items = await listGalleryItems()
    return Response.json({ items })
  } catch (error) {
    console.error("Gallery read failed", error)
    return Response.json({ items: DEFAULT_GALLERY_ITEMS, fallback: true })
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

export async function PATCH(request: NextRequest) {
  const unauthorized = requireAdminCode(request)
  if (unauthorized) return unauthorized

  try {
    const body = await request.json()
    if (body?.action !== "restore-defaults") {
      return Response.json({ error: "Unsupported action" }, { status: 400 })
    }
    await restoreDefaultGalleryItems()
    const items = await listGalleryItems()
    return Response.json({ items })
  } catch (error) {
    console.error("Gallery restore failed", error)
    return Response.json({ error: "Failed to restore defaults" }, { status: 500 })
  }
}
