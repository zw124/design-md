"use client"

import { useEffect, useMemo, useState } from "react"
import { Plus, Save, Trash2 } from "lucide-react"
import { Nav } from "@/components/nav"
import { Footer } from "@/components/footer"
import {
  DEFAULT_DESIGN_STRUCTURE,
  type GalleryColor,
  type GalleryItem,
  normalizeGalleryUrl,
  screenshotUrl,
} from "@/lib/gallery-data"

const ADMIN_CODE = "Kai@1124"
const ADMIN_CODE_STORAGE_KEY = "designmd:admin"

type FormState = {
  name: string
  description: string
  urlInput: string
  pageTypes: string
  uxPatterns: string
  uiElements: string
  colors: GalleryColor[]
  markdown: string
}

const EMPTY_FORM: FormState = {
  name: "",
  description: "",
  urlInput: "",
  pageTypes: "",
  uxPatterns: "",
  uiElements: "",
  colors: [
    { name: "", value: "" },
    { name: "", value: "" },
  ],
  markdown: "",
}

function splitList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
}

function downloadText(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="grid gap-2">
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted">{label}</span>
      {children}
    </label>
  )
}

const inputClass =
  "min-h-12 rounded border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-accent"

export default function AdminPage() {
  const [code, setCode] = useState("")
  const [authed, setAuthed] = useState(false)
  const [items, setItems] = useState<GalleryItem[]>([])
  const [structure, setStructure] = useState(DEFAULT_DESIGN_STRUCTURE)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const isAuthed = localStorage.getItem(ADMIN_CODE_STORAGE_KEY) === "true"
    setAuthed(isAuthed)
    if (isAuthed) {
      void refreshAdminData()
    }
  }, [])

  const normalized = useMemo(() => normalizeGalleryUrl(form.urlInput), [form.urlInput])

  const adminHeaders = () => ({
    "Content-Type": "application/json",
    "x-admin-code": ADMIN_CODE,
  })

  const refreshAdminData = async () => {
    setLoading(true)
    try {
      const [galleryResponse, structureResponse] = await Promise.all([
        fetch("/api/gallery", { cache: "no-store" }),
        fetch("/api/design-structure", { cache: "no-store" }),
      ])

      if (galleryResponse.ok) {
        const galleryData = (await galleryResponse.json()) as { items?: GalleryItem[] }
        setItems(galleryData.items || [])
      }

      if (structureResponse.ok) {
        const structureData = (await structureResponse.json()) as { structure?: string }
        setStructure(structureData.structure || DEFAULT_DESIGN_STRUCTURE)
      }
    } catch {
      setItems([])
      setStructure(DEFAULT_DESIGN_STRUCTURE)
    } finally {
      setLoading(false)
    }
  }

  const login = () => {
    if (code === ADMIN_CODE) {
      localStorage.setItem(ADMIN_CODE_STORAGE_KEY, "true")
      setAuthed(true)
      void refreshAdminData()
    }
  }

  const updateColor = (index: number, patch: Partial<GalleryColor>) => {
    setForm((current) => ({
      ...current,
      colors: current.colors.map((color, colorIndex) =>
        colorIndex === index ? { ...color, ...patch } : color
      ),
    }))
  }

  const addColor = () => {
    setForm((current) => ({
      ...current,
      colors: [...current.colors, { name: "", value: "" }],
    }))
  }

  const removeColor = (index: number) => {
    setForm((current) => ({
      ...current,
      colors: current.colors.filter((_, colorIndex) => colorIndex !== index),
    }))
  }

  const upload = async () => {
    if (!form.name.trim() || !normalized.href) {
      alert("Name and URL are required.")
      return
    }

    const nextItem: GalleryItem = {
      id: `${Date.now()}-${normalized.url}`,
      name: form.name.trim(),
      description: form.description.trim() || `${form.name.trim()} design reference`,
      url: normalized.url,
      href: normalized.href,
      pageTypes: splitList(form.pageTypes),
      uxPatterns: splitList(form.uxPatterns),
      uiElements: splitList(form.uiElements),
      colors: form.colors
        .map((color) => ({ name: color.name.trim(), value: color.value.trim() }))
        .filter((color) => color.name && color.value),
      markdown: form.markdown.trim() || `# DESIGN.md - ${form.name.trim()}\n`,
    }

    try {
      const response = await fetch("/api/gallery", {
        method: "POST",
        headers: adminHeaders(),
        body: JSON.stringify(nextItem),
      })
      if (!response.ok) throw new Error("Upload failed")
      const data = (await response.json()) as { items?: GalleryItem[] }
      setItems(data.items || [])
      setForm(EMPTY_FORM)
    } catch {
      alert("Upload failed. Check DATABASE_URL and try again.")
    }
  }

  const saveStructure = async () => {
    try {
      const response = await fetch("/api/design-structure", {
        method: "PUT",
        headers: adminHeaders(),
        body: JSON.stringify({ structure }),
      })
      if (!response.ok) throw new Error("Save failed")
      const data = (await response.json()) as { structure?: string }
      setStructure(data.structure || structure)
      alert("DESIGN.md structure saved.")
    } catch {
      alert("Structure save failed. Check DATABASE_URL and try again.")
    }
  }

  const useStructure = () => {
    setForm((current) => ({
      ...current,
      markdown: structure,
    }))
  }

  const downloadStructure = () => {
    downloadText("design-md-structure.md", structure)
  }

  const deleteItem = async (item: GalleryItem) => {
    if (!window.confirm(`Delete "${item.name}" from the Gallery?`)) return

    const typed = window.prompt(`Second confirmation: type DELETE to remove "${item.name}".`)
    if (typed !== "DELETE") return

    try {
      const response = await fetch(`/api/gallery/${encodeURIComponent(item.id)}`, {
        method: "DELETE",
        headers: adminHeaders(),
      })
      if (!response.ok) throw new Error("Delete failed")
      const data = (await response.json()) as { items?: GalleryItem[] }
      setItems(data.items || [])
    } catch {
      alert("Delete failed. Check DATABASE_URL and try again.")
    }
  }

  if (!authed) {
    return (
      <main className="min-h-screen">
        <Nav />
        <section className="mx-auto grid min-h-screen max-w-md place-items-center px-6">
          <div className="w-full rounded-lg border border-border bg-surface p-6">
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.24em] text-accent">Admin login</p>
            <h1 className="mb-6 font-display text-3xl font-bold text-foreground">Enter code</h1>
            <input
              value={code}
              onChange={(event) => setCode(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && login()}
              placeholder="Code"
              className={`${inputClass} w-full`}
              type="password"
            />
            <button
              onClick={login}
              className="mt-4 h-12 w-full rounded bg-accent px-4 text-sm font-semibold text-[#0A0A08] transition hover:bg-accent-muted"
            >
              Login
            </button>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <Nav />
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-32">
        <div className="mb-10">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.28em] text-accent">Admin</p>
          <h1 className="font-display text-4xl font-bold text-foreground">Gallery manager</h1>
          <p className="mt-4 max-w-2xl font-mono text-sm leading-7 text-muted">
            Add a URL, fill simple comma-separated fields, write the gallery DESIGN.md, and upload. Changes are saved to the shared Gallery database and show on the public site.
          </p>
          {loading ? <p className="mt-3 font-mono text-xs text-muted">Loading shared gallery data...</p> : null}
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="rounded-lg border border-border bg-[#0d0d0b] p-6">
            <div className="grid gap-5">
              <Field label="Website name">
                <input
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  className={inputClass}
                  placeholder="Mocha"
                />
              </Field>

              <Field label="URL">
                <input
                  value={form.urlInput}
                  onChange={(event) => setForm({ ...form, urlInput: event.target.value })}
                  className={inputClass}
                  placeholder="mocha.com"
                />
              </Field>

              <Field label="Description">
                <input
                  value={form.description}
                  onChange={(event) => setForm({ ...form, description: event.target.value })}
                  className={inputClass}
                  placeholder="AI-powered no-code app builder"
                />
              </Field>

              <div className="grid gap-5 md:grid-cols-3">
                <Field label="Page Types">
                  <input
                    value={form.pageTypes}
                    onChange={(event) => setForm({ ...form, pageTypes: event.target.value })}
                    className={inputClass}
                    placeholder="Product Page, Home Page"
                  />
                </Field>
                <Field label="UX Patterns">
                  <input
                    value={form.uxPatterns}
                    onChange={(event) => setForm({ ...form, uxPatterns: event.target.value })}
                    className={inputClass}
                    placeholder="FAQ, Testimonials"
                  />
                </Field>
                <Field label="UI Elements">
                  <input
                    value={form.uiElements}
                    onChange={(event) => setForm({ ...form, uiElements: event.target.value })}
                    className={inputClass}
                    placeholder="Button, Cards, Navigation"
                  />
                </Field>
              </div>

              <div className="rounded-lg border border-border bg-surface p-4">
                <div className="mb-4 flex items-center justify-between">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Colors</p>
                  <button
                    onClick={addColor}
                    className="inline-flex items-center gap-2 rounded border border-border px-3 py-2 text-xs text-muted transition hover:text-foreground"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add color
                  </button>
                </div>
                <div className="grid gap-3">
                  {form.colors.map((color, index) => (
                    <div key={index} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                      <input
                        value={color.name}
                        onChange={(event) => updateColor(index, { name: event.target.value })}
                        className={inputClass}
                        placeholder="Tea Green"
                      />
                      <input
                        value={color.value}
                        onChange={(event) => updateColor(index, { value: event.target.value })}
                        className={inputClass}
                        placeholder="#C8F04A or rgb(200, 240, 74)"
                      />
                      <button
                        onClick={() => removeColor(index)}
                        className="grid h-12 w-12 place-items-center rounded border border-border text-muted transition hover:text-foreground"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-2">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                    Gallery DESIGN.md
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={useStructure}
                      className="rounded border border-border px-3 py-2 text-xs text-muted transition hover:text-foreground"
                      type="button"
                    >
                      Use saved structure
                    </button>
                    <button
                      onClick={downloadStructure}
                      className="rounded border border-border px-3 py-2 text-xs text-muted transition hover:text-foreground"
                      type="button"
                    >
                      Download structure
                    </button>
                  </div>
                </div>
                <textarea
                  value={form.markdown}
                  onChange={(event) => setForm({ ...form, markdown: event.target.value })}
                  className={`${inputClass} min-h-64 resize-y leading-6`}
                  placeholder="# DESIGN.md - Mocha..."
                />
              </div>

              <div className="rounded-lg border border-border bg-surface p-4">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                      DESIGN.md structure
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted">
                      Edit this template once, then reuse it when writing Gallery DESIGN.md entries.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={useStructure}
                      className="rounded border border-border px-3 py-2 text-xs text-muted transition hover:text-foreground"
                      type="button"
                    >
                      Use in form
                    </button>
                    <button
                      onClick={saveStructure}
                      className="rounded border border-border px-3 py-2 text-xs text-muted transition hover:text-foreground"
                      type="button"
                    >
                      Save
                    </button>
                    <button
                      onClick={downloadStructure}
                      className="rounded bg-accent px-3 py-2 text-xs font-semibold text-[#0A0A08] transition hover:bg-accent-muted"
                      type="button"
                    >
                      Download
                    </button>
                  </div>
                </div>
                <textarea
                  value={structure}
                  onChange={(event) => setStructure(event.target.value)}
                  className={`${inputClass} min-h-96 w-full resize-y font-mono leading-6`}
                  placeholder="# DESIGN.md structure"
                />
              </div>

              <button
                onClick={upload}
                className="inline-flex h-12 w-fit items-center gap-3 rounded bg-accent px-5 text-sm font-semibold text-[#0A0A08] transition hover:bg-accent-muted"
              >
                <Save className="h-4 w-4" />
                Upload to Gallery
              </button>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-lg border border-border bg-surface p-4">
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-muted">Preview screenshot</p>
              {normalized.href ? (
                <img
                  src={screenshotUrl(normalized.href)}
                  alt="Website screenshot preview"
                  className="aspect-[16/10] w-full rounded border border-border object-cover object-top"
                />
              ) : (
                <div className="grid aspect-[16/10] place-items-center rounded border border-border text-sm text-muted">
                  Enter a URL
                </div>
              )}
            </div>

            <div className="rounded-lg border border-border bg-surface p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Gallery items</p>
              </div>
              <div className="space-y-3">
                {items.length === 0 ? (
                  <p className="text-sm text-muted">No gallery items visible.</p>
                ) : (
                  items.map((item: GalleryItem) => (
                    <div key={item.id} className="flex items-center justify-between gap-3 rounded border border-border p-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-semibold text-foreground">{item.name}</p>
                        </div>
                        <p className="truncate text-xs text-muted">{item.url}</p>
                      </div>
                      <button
                        onClick={() => deleteItem(item)}
                        className="grid h-9 w-9 shrink-0 place-items-center rounded border border-border text-muted transition hover:text-foreground"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </aside>
        </div>
      </section>
      <Footer />
    </main>
  )
}
