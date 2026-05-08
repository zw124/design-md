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
export const DESIGN_STRUCTURE_VERSION = "apple-standard-v1"

export const DEFAULT_DESIGN_STRUCTURE = `# Design System Inspired by [Website Name]

## 1. Visual Theme & Atmosphere

[Website Name]'s design system embodies [visual philosophy] paired with [atmosphere]. The aesthetic prioritizes [clarity, density, motion, or hierarchy] through [spacing approach], [typography approach], and a carefully orchestrated color palette dominated by [dominant palette] and [accent palette]. The system exudes [brand quality] through precise spacing, deliberate hierarchy, and subtle depth, creating an atmosphere of [primary emotion] tempered by [secondary emotion]. Every interface element serves a purpose, with decorative elements used only when they reinforce the product goal. The visual language conveys [brand personality] while keeping core workflows intuitive and accessible.

**Key Characteristics**
- [Specific layout philosophy]
- [Dominant palette and accent behavior]
- [Whitespace or density rule]
- [Typography hierarchy rule]
- [Surface, glass, border, or depth rule]
- [Interaction paradigm]
- [Padding and spacing behavior]
- [Distinction between interactive and static elements]

## 2. Color Palette & Roles

### Primary

- **Primary Action [Name]** (\`#[HEX]\`): Used for primary call-to-action buttons, active states, and critical interactive elements requiring immediate user attention
- **Primary [Name] Hover** (\`#[HEX]\`): Interactive state for primary elements when hovered or focused
- **Primary [Name] Press** (\`#[HEX]\`): Pressed/active state for primary interactive elements

### Interactive

- **Interactive [Name]** (\`#[HEX]\`): Specialized accent for specific interactive contexts and secondary prominence elements

### Neutral Scale

- **Text Dominant** (\`#[HEX]\`): Primary text color for all body copy, headings, and standard text content, used most frequently throughout the system
- **Text Secondary** (\`#[HEX]\`): Secondary text for less emphasized content, subheadings, and supporting information
- **Text Tertiary** (\`#[HEX]\`): Tertiary text for captions, timestamps, and minimal-emphasis supporting text
- **Text Inverse** (\`#[HEX]\`): Inverse or maximum contrast text for critical emphasis
- **Neutral Lightest** (\`#[HEX]\`): Lightest background and content surface
- **Neutral Dark Medium** (\`#[HEX]\`): Dark neutral for subtle backgrounds and card bases
- **Neutral Dark Deep** (\`#[HEX]\`): Deep neutral for premium dark mode or high-contrast backgrounds

### Surface & Borders

- **Surface Light** (\`#[HEX]\`): Subtle background for bordered containers, dividers, and light surface differentiation
- **Navigation Surface** (\`rgba(r, g, b, a)\`): Semi-transparent surface for floating navigation bars with frosted-glass effect
- **Border Implicit** (\`rgba(r, g, b, a)\`): Soft implicit border color for subtle visual separation
- **Overlay Soft** (\`rgba(r, g, b, a)\`): Semi-transparent overlay for secondary text and muted contexts

## 3. Typography Rules

### Font Family

**Primary:** [Primary font], -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif

**Secondary:** [Secondary font], -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|------|--------|-------------|----------------|-------|
| Display Hero | [Secondary font] | [px] | [weight] | [px] | 0px | Large hero headlines on landing pages and feature sections |
| Heading Large | [Secondary font] | [px] | [weight] | [px] | 0px | Major section headings and primary card titles |
| Heading Primary | [Secondary font] | [px] | [weight] | [px] | 0px | Card headlines and prominent content headers |
| Heading Secondary | [Primary font] | [px] | [weight] | [px] | 0px | Large subheadings and prominent titles |
| Body Default | [Primary font] | [px] | [weight] | [px] | 0px | Standard paragraph text and body content |
| Body Compact | [Primary font] | [px] | [weight] | [px] | 0px | Navigation links and compact text elements |
| Small Label | [Primary font] | [px] | [weight] | [px] | 0px | Caption, meta information, and supporting labels |
| Eyebrow | [Primary font] | [px] | [weight] | [px] | 0px | Descriptive labels above headings |
| Button | [Primary font] | [px] | [weight] | [px] | 0px | Primary and secondary button text |
| Link | [Primary font] | [px] | [weight] | [px] | 0px | Interactive link text with weight emphasis |
| Code | [Code font] | [px] | [weight] | [px] | 0px | Monospaced code blocks and technical content |

### Principles

- Typography establishes visual hierarchy through weight and scale rather than color differentiation
- Line height maintains generous vertical rhythm, improving readability across screen sizes
- Font weight progression creates clear distinction between content importance levels
- System fonts ensure platform-native rendering and accessibility optimization
- Text color inherits semantic meaning from palette, not from typography role alone
- Generous line heights reduce cognitive load on long-form content

## 4. Component Stylings

### Buttons

#### Primary Button
- **Background:** \`#[HEX]\`
- **Text Color:** \`#[HEX]\`
- **Font:** [Font], [px], weight [weight], line-height [px]
- **Padding:** \`[px] [px]\`
- **Border Radius:** \`[px or %]\`
- **Border:** [value]
- **Box Shadow:** [value]
- **Hover State:** Background \`#[HEX]\`
- **Active State:** Background \`#[HEX]\`
- **Height:** [px] minimum touch target
- **Width:** auto or [specific value]

#### Secondary Button
- **Background:** [value]
- **Text Color:** \`#[HEX]\`
- **Font:** [Font], [px], weight [weight], line-height [px]
- **Padding:** \`[px] [px]\`
- **Border Radius:** \`[px or %]\`
- **Border:** \`[width] solid #[HEX]\`
- **Box Shadow:** [value]
- **Hover State:** Background \`rgba(r, g, b, a)\`, Border Color \`#[HEX]\`
- **Active State:** Border \`[width] solid #[HEX]\`
- **Height:** [px]
- **Width:** auto or [specific value]

#### Ghost Button
- **Background:** transparent
- **Text Color:** \`#[HEX]\`
- **Font:** [Font], [px], weight [weight], line-height [px]
- **Padding:** \`[px] [px]\`
- **Border Radius:** [px]
- **Border:** none
- **Box Shadow:** none
- **Hover State:** Background \`rgba(r, g, b, a)\`
- **Active State:** Background \`rgba(r, g, b, a)\`
- **Height:** [px]
- **Width:** auto

### Cards & Containers

#### Hero Card
- **Background:** \`#[HEX]\`
- **Text Color:** \`#[HEX]\`
- **Font:** [Font], [px], weight [weight], line-height [px]
- **Padding:** \`[px]\`
- **Border Radius:** [px]
- **Border:** [value]
- **Box Shadow:** [value]
- **Min Height:** [px]
- **Max Width:** [px]

#### Feature Card
- **Background:** \`rgba(r, g, b, a)\`
- **Text Color:** \`#[HEX]\`
- **Font:** [Font], [px], weight [weight], line-height [px]
- **Padding:** \`[px] [px]\`
- **Border Radius:** [px]
- **Border:** \`[width] solid #[HEX]\`
- **Box Shadow:** [value]

#### Label Card (Meta)
- **Background:** transparent
- **Text Color:** \`rgba(r, g, b, a)\`
- **Font:** [Font], [px], weight [weight], line-height [px]
- **Padding:** \`[px] [px]\`
- **Border Radius:** [px]
- **Border:** none
- **Box Shadow:** none

### Navigation

#### Top Navigation Bar
- **Background:** \`rgba(r, g, b, a)\`
- **Text Color:** \`#[HEX]\`
- **Font:** [Font], [px], weight [weight], line-height [px]
- **Padding:** \`[px] [px]\`
- **Border Radius:** [px]
- **Border:** \`[width] solid rgba(r, g, b, a)\`
- **Box Shadow:** [value]
- **Height:** [px]
- **Width:** 100%
- **Nav Item Padding:** \`[px] [px]\`
- **Hover State:** Text Color \`#[HEX]\`

#### Navigation Link
- **Background:** transparent
- **Text Color:** \`rgba(r, g, b, a)\`
- **Font:** [Font], [px], weight [weight], line-height [px]
- **Padding:** \`[px] [px]\`
- **Border Radius:** [px]
- **Border:** none
- **Box Shadow:** none
- **Height:** [px]
- **Hover State:** Text Color \`#[HEX]\`
- **Active State:** Text Color \`#[HEX]\`

### Inputs & Forms

#### Text Input
- **Background:** \`#[HEX]\`
- **Text Color:** \`#[HEX]\`
- **Placeholder Color:** \`#[HEX]\`
- **Font:** [Font], [px], weight [weight], line-height [px]
- **Padding:** \`[px] [px]\`
- **Border Radius:** [px]
- **Border:** \`[width] solid #[HEX]\`
- **Box Shadow:** [value]
- **Height:** [px]
- **Focus State:** Border Color \`#[HEX]\`, Box Shadow \`0 0 0 [px] rgba(r, g, b, a)\`

#### Form Label
- **Font:** [Font], [px], weight [weight], line-height [px]
- **Text Color:** \`#[HEX]\`
- **Margin Bottom:** [px]
- **Display:** block

### Links

#### Standard Link
- **Text Color:** \`#[HEX]\`
- **Font:** [Font], [px], weight [weight], line-height [px]
- **Text Decoration:** none
- **Hover State:** Text Color \`#[HEX]\`, Text Decoration underline
- **Active State:** Text Color \`#[HEX]\`

#### Subtle Link
- **Text Color:** \`rgba(r, g, b, a)\`
- **Font:** [Font], [px], weight [weight], line-height [px]
- **Text Decoration:** none
- **Hover State:** Text Color \`#[HEX]\`

## 5. Layout Principles

### Spacing System

**Base Unit:** [px]

**Scale:**
- \`[px]\` — Compact padding for inline elements and tight spacing
- \`[px]\` — Small margin between related components
- \`[px]\` — Standard padding for content containers
- \`[px]\` — Default margin between sections
- \`[px]\` — Comfortable padding for card interiors
- \`[px]\` — Large spacing for major section separation
- \`[px]\` — Premium padding for feature cards
- \`[px]\` — Extra-large padding for hero sections
- \`[px]\` — Vertical rhythm base and touch target height
- \`[px]\` — Hero section internal spacing
- \`[px]\` — Extra-large gaps between major sections
- \`[px]\` — Maximum section separation

**Usage Context:**
- Components typically use [px]-[px] internal padding
- Sections separated by [px]-[px] vertical margin
- Navigation and buttons maintain [px] height minimum for touch
- Hero sections employ [px]-[px] padding
- Inline spacing follows [px]-[px] increments

### Grid & Container

- **Max Container Width:** [px] (measured from main hero or content container)
- **Column Strategy:** Flexible grid adapting to content; typically 1-3 columns on desktop
- **Section Pattern:** Full-width sections with centered max-width containers
- **Gutter:** [px]-[px] between columns
- **Margin Symmetry:** Equal left/right margins maintaining visual centering

### Whitespace Philosophy

[Website Name]'s design treats negative space as an active design element. Whitespace reduces cognitive load, emphasizes content, and creates visual hierarchy without excessive decoration. The system uses intentional padding and margins to ensure components never feel cramped. Empty space contributes to perceived quality and clarity.

### Border Radius Scale

- \`[px]\` — Cards, containers, and large surfaces
- \`[px]\` — Input fields and form elements
- \`[px or %]\` — Buttons and contained interaction targets

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat (None) | No shadow, solid backgrounds | Standard cards, text, and primary content surfaces |
| Subtle (Raised) | \`box-shadow: [exact CSS]\` | Floating buttons and secondary surfaces |
| Medium (Floating) | \`box-shadow: [exact CSS]\` | Modals, popovers, and prominent overlays |
| Deep (Emphasis) | \`box-shadow: [exact CSS]\` | High-priority modals and critical overlays |

**Shadow Philosophy:**

[Website Name]'s elevation system uses [minimal/subtle/expressive] shadows to maintain clarity. Shadows are achieved through [blur, opacity, offset, or layered surfaces] rather than heavy decoration. Semi-transparent navigation bars may use frosted-glass effects to establish layering without heavy shadows. Depth is primarily conveyed through color, positioning, scale, and surface treatment.

## 7. Do's and Don'ts

### Do

- Use \`#[HEX]\` exclusively for primary interactive elements requiring user attention
- Maintain [px] minimum height for all touch-target buttons and navigation elements
- Apply generous padding ([px]-[px]) inside major containers to prevent visual crowding
- Stack sections with [px]-[px] vertical margin for clear visual separation
- Use [primary font] for body content and [secondary font] for prominent headlines
- Implement [surface treatment] for navigation surfaces when depth is needed
- Maintain consistent [radius] border radius for [specific component family]
- Group related content with [border/shadow/surface value] rather than excessive decoration
- Employ text color hierarchy (primary -> secondary -> tertiary) to establish reading order
- Scale typography by weight before increasing font size for hierarchy

### Don't

- Use shadows as the primary depth mechanism unless the source site clearly does
- Exceed [px] container width on desktop to maintain comfortable content width
- Apply borders to all card types if the source uses open whitespace
- Mix multiple accent colors unless they are verified from the site
- Reduce padding below [px] in standard contexts
- Apply rounded corners inconsistently across large containers
- Exceed [weight] font weight for body text
- Use more than 2-3 font sizes in a single layout section
- Stack components without clear spacing; maintain minimum [px] margin between elements
- Employ color alone to communicate hierarchy; combine color with typography weight and scale

## 8. Responsive Behavior

### Breakpoints

| Breakpoint | Width | Key Changes |
|------------|-------|------------|
| Mobile | 320px-767px | Single column, full-width containers, increased padding, large touch targets |
| Tablet | 768px-1023px | Two-column layouts, reduced padding, optimized for portrait/landscape |
| Desktop | 1024px-1440px | Three-column layouts, max-width container, standard padding |
| Large Desktop | 1441px+ | Desktop layout maintained, centered container with symmetric margins |

### Touch Targets

- **Minimum Height:** [px] for all interactive elements (buttons, links, navigation items)
- **Minimum Width:** [px] for button and clickable icons
- **Padding Around Target:** Minimum [px] between adjacent touch targets
- **Hover Zone Expansion:** [px] padding around target expands effective touch area on hover
- **Mobile Optimization:** Touch targets at screen bottom include additional [px] bottom margin for thumb accessibility

### Collapsing Strategy

- **Navigation:** [specific collapse behavior] below [breakpoint]
- **Grid Columns:** Reduce from 3 columns (desktop) -> 2 columns (tablet) -> 1 column (mobile)
- **Hero Sections:** Reduce padding from [px] (desktop) -> [px] (tablet) -> [px] (mobile)
- **Typography:** Reduce Display role sizes by [px] on tablet, [px] on mobile
- **Spacing:** Reduce all margins by [percentage] on tablet, [percentage] on mobile (minimum [px])
- **Container Padding:** Maintain horizontal padding minimum of [px] on mobile

## 9. Agent Prompt Guide

### Quick Color Reference

- **Primary CTA:** [Name] (\`#[HEX]\`)
- **Primary CTA Hover:** [Name] (\`#[HEX]\`)
- **Primary CTA Active:** [Name] (\`#[HEX]\`)
- **Primary Text:** [Name] (\`#[HEX]\`)
- **Secondary Text:** [Name] (\`#[HEX]\`)
- **Tertiary Text / Captions:** [Name] (\`#[HEX]\`)
- **Background:** [Name] (\`#[HEX]\`)
- **Surface / Card Borders:** [Name] (\`#[HEX]\`)
- **Navigation Background:** [Name] (\`rgba(r, g, b, a)\`)
- **Overlay / Muted Text:** [Name] (\`rgba(r, g, b, a)\`)
- **Dark Surface:** [Name] (\`#[HEX]\`)

### Iteration Guide

1. **All interactive elements use \`#[HEX]\` for primary actions.** Hover states transition to \`#[HEX]\`, active states to \`#[HEX]\`. Do not invent other accent colors.

2. **Button minimum height is [px].** Buttons use [radius] border radius. Primary buttons are filled; secondary buttons use [border treatment]; ghost buttons use [ghost behavior].

3. **Maintain spacing hierarchy:** [px]-[px] internal padding for cards, [px]-[px] between sections. Minimum [px] margins between adjacent components.

4. **Typography uses [font count] font families:** [secondary font] for headlines and [primary font] for body. Line height scales proportionally; larger text uses proportionally larger line height.

5. **Cards and containers use [radius rule].** Borders on cards are [required/optional]; use \`[border value]\` only for secondary grouping.

6. **Navigation bars use \`rgba(r, g, b, a)\` with [surface treatment].** Standard cards use \`#[HEX]\`. Reserve shadows for [specific overlay use].

7. **Text hierarchy prioritizes weight escalation over size growth.** Body text is [px] weight [weight]; headlines increase to weight [weight] before increasing size.

8. **Neutral palette dominates:** \`#[HEX]\` for primary text, \`#[HEX]\` for secondary, \`#[HEX]\` for captions. These colors paired with whitespace create the system's aesthetic.

9. **Responsive collapsing:** Mobile uses single columns with [px]-[px] padding. Tablet uses two columns. Desktop uses three columns with max-width [px] container.

10. **Every interactive element respects [px] touch minimum.** Navigation items, buttons, and links all maintain [px] height. Input fields are [px] tall with [px] horizontal padding.
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
