import {
  DEFAULT_DESIGN_STRUCTURE,
  DESIGN_STRUCTURE_VERSION,
  LEGACY_DEFAULT_GALLERY_IDS,
  type GalleryItem,
} from "@/lib/gallery-data"
import { assertDatabaseConfigured, sql } from "@/lib/db"

type GalleryRow = {
  id: string
  name: string
  description: string
  url: string
  href: string
  page_types: string[]
  ux_patterns: string[]
  ui_elements: string[]
  colors: GalleryItem["colors"]
  markdown: string
}

export function requireAdminCode(request: Request) {
  const code = request.headers.get("x-admin-code")
  if (code !== "Kai@1124") {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }
  return null
}

export function toGalleryItem(row: GalleryRow): GalleryItem {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    url: row.url,
    href: row.href,
    pageTypes: row.page_types || [],
    uxPatterns: row.ux_patterns || [],
    uiElements: row.ui_elements || [],
    colors: row.colors || [],
    markdown: row.markdown,
  }
}

async function ensureGalleryTables() {
  assertDatabaseConfigured()

  await sql`
    create table if not exists gallery_items (
      id text primary key,
      name text not null,
      description text not null,
      url text not null,
      href text not null,
      page_types jsonb not null default '[]'::jsonb,
      ux_patterns jsonb not null default '[]'::jsonb,
      ui_elements jsonb not null default '[]'::jsonb,
      colors jsonb not null default '[]'::jsonb,
      markdown text not null,
      visible boolean not null default true,
      sort_order integer not null default 0,
      created_at timestamp default now(),
      updated_at timestamp default now()
    )
  `

  await sql`
    create table if not exists app_settings (
      key text primary key,
      value text not null,
      updated_at timestamp default now()
    )
  `

  for (const id of LEGACY_DEFAULT_GALLERY_IDS) {
    await sql`
      update gallery_items
      set visible = false, updated_at = now()
      where id = ${id}
    `
  }

  await sql`
    insert into app_settings (key, value)
    values ('design_structure', ${DEFAULT_DESIGN_STRUCTURE})
    on conflict (key) do nothing
  `

  const versionRows = (await sql`
    select value from app_settings where key = 'design_structure_version' limit 1
  `) as Array<{ value: string }>

  if (versionRows[0]?.value !== DESIGN_STRUCTURE_VERSION) {
    await sql`
      insert into app_settings (key, value, updated_at)
      values ('design_structure', ${DEFAULT_DESIGN_STRUCTURE}, now())
      on conflict (key) do update set value = excluded.value, updated_at = now()
    `
    await sql`
      insert into app_settings (key, value, updated_at)
      values ('design_structure_version', ${DESIGN_STRUCTURE_VERSION}, now())
      on conflict (key) do update set value = excluded.value, updated_at = now()
    `
  }
}

export async function listGalleryItems() {
  await ensureGalleryTables()
  const rows = (await sql`
    select
      id,
      name,
      description,
      url,
      href,
      page_types,
      ux_patterns,
      ui_elements,
      colors,
      markdown
    from gallery_items
    where visible = true
    order by sort_order asc, created_at desc
  `) as GalleryRow[]
  return rows.map(toGalleryItem)
}

export async function upsertGalleryItem(item: GalleryItem) {
  await ensureGalleryTables()
  await sql`
    insert into gallery_items (
      id,
      name,
      description,
      url,
      href,
      page_types,
      ux_patterns,
      ui_elements,
      colors,
      markdown,
      visible,
      sort_order,
      updated_at
    )
    values (
      ${item.id},
      ${item.name},
      ${item.description},
      ${item.url},
      ${item.href},
      ${JSON.stringify(item.pageTypes)}::jsonb,
      ${JSON.stringify(item.uxPatterns)}::jsonb,
      ${JSON.stringify(item.uiElements)}::jsonb,
      ${JSON.stringify(item.colors)}::jsonb,
      ${item.markdown},
      true,
      0,
      now()
    )
    on conflict (id) do update set
      name = excluded.name,
      description = excluded.description,
      url = excluded.url,
      href = excluded.href,
      page_types = excluded.page_types,
      ux_patterns = excluded.ux_patterns,
      ui_elements = excluded.ui_elements,
      colors = excluded.colors,
      markdown = excluded.markdown,
      visible = true,
      updated_at = now()
  `
}

export async function hideGalleryItem(id: string) {
  await ensureGalleryTables()
  await sql`
    update gallery_items
    set visible = false, updated_at = now()
    where id = ${id}
  `
}

export async function getDesignStructure() {
  await ensureGalleryTables()
  const rows = (await sql`
    select value from app_settings where key = 'design_structure' limit 1
  `) as Array<{ value: string }>
  return rows[0]?.value || DEFAULT_DESIGN_STRUCTURE
}

export async function saveDesignStructure(value: string) {
  await ensureGalleryTables()
  await sql`
    insert into app_settings (key, value, updated_at)
    values ('design_structure', ${value}, now())
    on conflict (key) do update set value = excluded.value, updated_at = now()
  `
  await sql`
    insert into app_settings (key, value, updated_at)
    values ('design_structure_version', ${DESIGN_STRUCTURE_VERSION}, now())
    on conflict (key) do update set value = excluded.value, updated_at = now()
  `
}
