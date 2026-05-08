import { NextRequest } from "next/server"
import { DEFAULT_DESIGN_STRUCTURE } from "@/lib/gallery-data"
import { getDesignStructure, requireAdminCode, saveDesignStructure } from "@/lib/gallery-server"

export const runtime = "nodejs"

export async function GET() {
  try {
    const structure = await getDesignStructure()
    return Response.json({ structure })
  } catch (error) {
    console.error("Design structure read failed", error)
    return Response.json({ structure: DEFAULT_DESIGN_STRUCTURE, fallback: true })
  }
}

export async function PUT(request: NextRequest) {
  const unauthorized = requireAdminCode(request)
  if (unauthorized) return unauthorized

  try {
    const body = await request.json()
    await saveDesignStructure(String(body?.structure || DEFAULT_DESIGN_STRUCTURE))
    const structure = await getDesignStructure()
    return Response.json({ structure })
  } catch (error) {
    console.error("Design structure save failed", error)
    return Response.json({ error: "Failed to save structure" }, { status: 500 })
  }
}
