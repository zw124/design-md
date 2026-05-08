export type GalleryColor = {
  name: string
  value: string
}

export type GalleryItem = {
  id: string
  name: string
  description: string
  url: string
  href: string
  pageTypes: string[]
  uxPatterns: string[]
  uiElements: string[]
  colors: GalleryColor[]
  markdown: string
}

export const GALLERY_STORAGE_KEY = "designmd:gallery-items"
export const GALLERY_DELETED_DEFAULTS_KEY = "designmd:gallery-deleted-defaults"
export const DESIGN_STRUCTURE_STORAGE_KEY = "designmd:design-structure"
export const LEGACY_DEFAULT_GALLERY_IDS = ["stripe", "linear", "apple"]

export const DEFAULT_DESIGN_STRUCTURE = `# DESIGN.md - [Website Name]

> Source: [Website URL]
> Screenshot: [Above-the-fold screenshot URL or capture note]

## 01. Brand Identity

- **Visual philosophy:** [Concrete visual direction in one sentence]
- **Personality keywords:** [Keyword 1], [Keyword 2], [Keyword 3], [Keyword 4]
- **Target audience:** [Primary users and use case]
- **Aesthetic direction:** [Precise layout, density, tone, and interaction feel]

## 02. Color System

### Primary Colors

| Token | Hex | RGB / RGBA | Usage | Interaction State |
| --- | --- | --- | --- | --- |
| \`--color-primary\` | \`#[HEX]\` | \`rgb(r, g, b)\` | Main CTA / selected state | Default |
| \`--color-primary-hover\` | \`#[HEX]\` | \`rgb(r, g, b)\` | CTA hover | Hover |
| \`--color-primary-active\` | \`#[HEX]\` | \`rgb(r, g, b)\` | CTA pressed | Active |

### Neutral, Surface, Border

| Token | Hex | RGBA | Usage |
| --- | --- | --- | --- |
| \`--color-text\` | \`#[HEX]\` | \`rgba(r, g, b, 1)\` | Primary text |
| \`--color-text-secondary\` | \`#[HEX]\` | \`rgba(r, g, b, 0.__)\` | Secondary text |
| \`--color-surface\` | \`#[HEX]\` | \`rgba(r, g, b, 1)\` | Cards / panels |
| \`--color-border\` | \`#[HEX]\` | \`rgba(r, g, b, 0.__)\` | Dividers / outlines |
| \`--color-nav-glass\` | \`#[HEX]\` | \`rgba(r, g, b, 0.__)\` | Navigation surface |

## 03. Typography

| Role | Font Family | Size | Weight | Line Height | Letter Spacing | Usage Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Display | [Font] | [px] | [weight] | [px] | 0 | Hero headline |
| H1 | [Font] | [px] | [weight] | [px] | 0 | Page title |
| H2 | [Font] | [px] | [weight] | [px] | 0 | Major section |
| H3 | [Font] | [px] | [weight] | [px] | 0 | Card or panel title |
| Body | [Font] | [px] | [weight] | [px] | 0 | Paragraphs |
| Body Small | [Font] | [px] | [weight] | [px] | 0 | Support text |
| Caption | [Font] | [px] | [weight] | [px] | 0 | Metadata |
| Code | [Font] | [px] | [weight] | [px] | 0 | Tokens / code |
| Button | [Font] | [px] | [weight] | [px] | 0 | Button labels |
| Link | [Font] | [px] | [weight] | [px] | 0 | Text links |
| Eyebrow | [Font] | [px] | [weight] | [px] | [value] | Section labels |

## 04. Component Stylings

### Buttons

| Variant | Background | Text | Font | Padding | Radius | Border | Shadow | Height | Hover | Active |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Primary | [hex/rgba] | [hex] | [font] [size]/[line-height] [weight] | [px] | [px] | [value] | [value] | [px] | [value] | [value] |
| Secondary | [hex/rgba] | [hex] | [font] [size]/[line-height] [weight] | [px] | [px] | [value] | [value] | [px] | [value] | [value] |
| Ghost | [hex/rgba] | [hex] | [font] [size]/[line-height] [weight] | [px] | [px] | [value] | [value] | [px] | [value] | [value] |

### Cards, Navigation, Inputs

- **Hero card:** background [value], padding [px], radius [px], border [value], shadow [value].
- **Feature card:** background [value], padding [px], radius [px], border [value], shadow [value].
- **Label card:** background [value], padding [px], radius [px], border [value], shadow [value].
- **Navigation:** height [px], background [rgba], padding [px], hover [value], active [value].
- **Inputs:** height [px], padding [px], border [value], radius [px], focus ring \`0 0 0 [px] rgba(...)\`.

## 05. Layout Principles

| Token | Pixels | Usage Context |
| --- | --- | --- |
| \`--space-1\` | 4px | Tight inline spacing |
| \`--space-2\` | 8px | Icon and label gap |
| \`--space-3\` | 12px | Compact controls |
| \`--space-4\` | 16px | Default padding |
| \`--space-6\` | 24px | Card rhythm |
| \`--space-8\` | 32px | Section rhythm |
| \`--space-12\` | 48px | Page sections |
| \`--space-16\` | 64px | Large hero gaps |

- **Max container width:** [px]
- **Grid columns:** [mobile/tablet/desktop]
- **Gutters:** [px values by breakpoint]

## 06. Depth & Elevation

| Level | Box Shadow | Usage |
| --- | --- | --- |
| 0 | \`none\` | Flat surface |
| 1 | \`[exact CSS]\` | Cards |
| 2 | \`[exact CSS]\` | Hover |
| 3 | \`[exact CSS]\` | Menus |
| 4 | \`[exact CSS]\` | Dialogs |

## 07. Do's and Don'ts

### Do
1. [Specific rule with value]
2. [Specific rule with value]
3. [Specific rule with value]
4. [Specific rule with value]
5. [Specific rule with value]
6. [Specific rule with value]
7. [Specific rule with value]
8. [Specific rule with value]
9. [Specific rule with value]
10. [Specific rule with value]

### Don't
1. [Specific anti-pattern]
2. [Specific anti-pattern]
3. [Specific anti-pattern]
4. [Specific anti-pattern]
5. [Specific anti-pattern]
6. [Specific anti-pattern]
7. [Specific anti-pattern]
8. [Specific anti-pattern]
9. [Specific anti-pattern]
10. [Specific anti-pattern]

## 08. Responsive Behavior

| Breakpoint | Width | Navigation | Grid | Typography | Spacing | Touch Targets |
| --- | --- | --- | --- | --- | --- | --- |
| Mobile | 0-639px | [strategy] | [columns] | [sizes] | [values] | 44px minimum |
| Tablet | 640-1023px | [strategy] | [columns] | [sizes] | [values] | 44px minimum |
| Desktop | 1024px+ | [strategy] | [columns] | [sizes] | [values] | 40-44px minimum |

## 09. Agent Prompt Guide

### Quick Color Reference

| Role | Value |
| --- | --- |
| Primary | [hex] |
| Background | [hex] |
| Surface | [hex/rgba] |
| Text | [hex] |
| Border | [rgba] |

### Implementation Rules
1. Use [font] for all primary UI text.
2. Keep main container width at [px].
3. Use [primary hex] only for [specific usage].
4. Use [surface rgba] for navigation.
5. Set buttons to [height px] with [radius px].
6. Use [shadow] for cards and [shadow] for dialogs.
7. Keep body text at [px]/[px].
8. Collapse grids to [columns] under [breakpoint].
9. Use focus ring [exact CSS].
10. Do not invent colors outside the verified palette.
`

export const DEFAULT_GALLERY_ITEMS: GalleryItem[] = []

export function normalizeGalleryUrl(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return { href: "", url: "" }
  const href = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
  try {
    const parsed = new URL(href)
    return {
      href: parsed.toString().replace(/\/$/, ""),
      url: parsed.hostname.replace(/^www\./, ""),
    }
  } catch {
    return { href, url: trimmed.replace(/^https?:\/\//i, "").replace(/\/$/, "") }
  }
}

export function screenshotUrl(href: string) {
  return `https://api.microlink.io/?url=${encodeURIComponent(href)}&screenshot=true&meta=false&embed=screenshot.url`
}
