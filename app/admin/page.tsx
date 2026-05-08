"use client"

import { useEffect, useMemo, useState } from "react"
import { Plus, Save, Trash2 } from "lucide-react"
import { Nav } from "@/components/nav"
import { Footer } from "@/components/footer"
import {
  GALLERY_STORAGE_KEY,
  type GalleryColor,
  type GalleryItem,
  normalizeGalleryUrl,
  screenshotUrl,
} from "@/lib/gallery-data"

const ADMIN_CODE = "Kai@1124"

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

function loadCustomItems() {
  try {
    const stored = localStorage.getItem(GALLERY_STORAGE_KEY)
    return stored ? (JSON.parse(stored) as GalleryItem[]) : []
  } catch {
    return []
  }
}

function saveCustomItems(items: GalleryItem[]) {
  localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(items))
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
  const [form, setForm] = useState<FormState>(EMPTY_FORM)

  useEffect(() => {
    setAuthed(localStorage.getItem("designmd:admin") === "true")
    setItems(loadCustomItems())
  }, [])

  const normalized = useMemo(() => normalizeGalleryUrl(form.urlInput), [form.urlInput])

  const login = () => {
    if (code === ADMIN_CODE) {
      localStorage.setItem("designmd:admin", "true")
      setAuthed(true)
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

  const upload = () => {
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

    const nextItems = [nextItem, ...items]
    setItems(nextItems)
    saveCustomItems(nextItems)
    setForm(EMPTY_FORM)
  }

  const deleteItem = (id: string) => {
    const nextItems = items.filter((item) => item.id !== id)
    setItems(nextItems)
    saveCustomItems(nextItems)
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
            Add a URL, fill simple comma-separated fields, write the gallery DESIGN.md, and upload. The Gallery card and detail view will use the same format as the existing examples.
          </p>
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

              <Field label="Gallery DESIGN.md">
                <textarea
                  value={form.markdown}
                  onChange={(event) => setForm({ ...form, markdown: event.target.value })}
                  className={`${inputClass} min-h-64 resize-y leading-6`}
                  placeholder="# DESIGN.md - Mocha..."
                />
              </Field>

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
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-muted">Uploaded items</p>
              <div className="space-y-3">
                {items.length === 0 ? (
                  <p className="text-sm text-muted">No custom gallery items yet.</p>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-3 rounded border border-border p-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">{item.name}</p>
                        <p className="truncate text-xs text-muted">{item.url}</p>
                      </div>
                      <button
                        onClick={() => deleteItem(item.id)}
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
