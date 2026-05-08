import { NextRequest } from "next/server"
import { hideGalleryItem, listGalleryItems, requireAdminCode } from "@/lib/gallery-server"

export const runtime = "nodejs"

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = requireAdminCode(request)
  if (unauthorized) return unauthorized

  try {
    const { id } = await params
    await hideGalleryItem(decodeURIComponent(id))
    const items = await listGalleryItems()
    return Response.json({ items })
  } catch (error) {
    console.error("Gallery delete failed", error)
    return Response.json({ error: "Failed to delete gallery item" }, { status: 500 })
  }
}
