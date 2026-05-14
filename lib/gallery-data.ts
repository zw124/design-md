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
export const LEGACY_DEFAULT_GALLERY_IDS = [
  "stripe",
  "linear",
  "apple",
  "curated-stripe",
  "curated-linear",
  "curated-vercel",
  "curated-apple",
  "curated-openai",
  "curated-anthropic",
  "curated-cursor",
  "curated-figma",
  "curated-notion",
  "curated-airbnb",
  "curated-github",
  "curated-shopify",
  "curated-webflow",
  "curated-ramp",
  "curated-retool",
  "curated-supabase",
  "curated-clerk",
  "curated-framer",
  "curated-raycast",
  "curated-perplexity",
]
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

type CuratedGalleryInput = Omit<GalleryItem, "markdown">

function createCuratedMarkdown(item: CuratedGalleryInput) {
  const primary = item.colors[0]
  const secondary = item.colors[1] || primary
  const surface = item.colors[2] || primary

  return `# Design System Inspired by ${item.name}

## 1. Visual Theme & Atmosphere

${item.name}'s interface is a strong reference for ${item.description.toLowerCase()}. The system uses a clear product hierarchy, direct interaction patterns, and a disciplined palette built around ${primary.name} (${primary.value}), ${secondary.name} (${secondary.value}), and ${surface.name} (${surface.value}). The layout should feel precise, scannable, and agent-friendly, with every section organized around reusable UI rules rather than loose visual description.

**Key Characteristics**
- Page types: ${item.pageTypes.join(", ")}
- UX patterns: ${item.uxPatterns.join(", ")}
- UI elements: ${item.uiElements.join(", ")}
- Primary color reference: ${primary.name} (${primary.value})
- Secondary color reference: ${secondary.name} (${secondary.value})
- Surface color reference: ${surface.name} (${surface.value})
- Use compact, high-signal sections with clear labels
- Keep screenshots and component notes tied to the original source URL: ${item.href}

## 2. Color Palette & Roles

### Primary

- **Primary Action ${primary.name}** (\`${primary.value}\`): Use for primary actions, selected states, active controls, and high-emphasis links.
- **Primary Hover** (\`${primary.value}\`): Use the same verified color with a 6-10% darker overlay when a separate hover token is not directly verified.
- **Primary Press** (\`${primary.value}\`): Use the same verified color with a 12-16% darker overlay for pressed states.

### Neutral Scale

${item.colors
  .map((color) => `- **${color.name}** (\`${color.value}\`): Verified gallery palette color for ${item.name}.`)
  .join("\n")}

### Surface & Borders

- **Surface Base:** Use ${surface.value} for the dominant panel or page surface when appropriate.
- **Border Implicit:** Use \`rgba(255, 255, 255, 0.12)\` on dark layouts or \`rgba(0, 0, 0, 0.10)\` on light layouts.
- **Navigation Surface:** Use \`rgba(255, 255, 255, 0.82)\` for light glass navigation or \`rgba(10, 10, 12, 0.78)\` for dark glass navigation.

## 3. Typography Rules

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|------|--------|-------------|----------------|-------|
| Display Hero | Modern sans-serif | 48px | 650 | 56px | 0px | Product hero and top-level page heading |
| Heading Large | Modern sans-serif | 32px | 620 | 40px | 0px | Section headings and primary card titles |
| Heading Primary | Modern sans-serif | 24px | 600 | 32px | 0px | Card headlines and modal titles |
| Body Default | Modern sans-serif | 16px | 400 | 24px | 0px | Paragraph and content text |
| Body Compact | Modern sans-serif | 14px | 450 | 20px | 0px | Navigation, labels, and dense UI rows |
| Small Label | Modern sans-serif | 12px | 500 | 16px | 0px | Captions, badges, metadata |
| Button | Modern sans-serif | 14px | 600 | 20px | 0px | Primary and secondary button text |
| Code | Monospace | 13px | 400 | 20px | 0px | Tokens, CSS values, implementation notes |

## 4. Component Stylings

### Buttons

#### Primary Button
- **Background:** \`${primary.value}\`
- **Text Color:** \`#FFFFFF\`
- **Font:** Modern sans-serif, 14px, weight 600, line-height 20px
- **Padding:** \`10px 16px\`
- **Border Radius:** \`8px\`
- **Border:** none
- **Box Shadow:** \`0 8px 24px rgba(0, 0, 0, 0.16)\`
- **Hover State:** increase brightness by 6%
- **Active State:** decrease brightness by 8%
- **Height:** 40px minimum

#### Secondary Button
- **Background:** transparent
- **Text Color:** \`${primary.value}\`
- **Font:** Modern sans-serif, 14px, weight 600, line-height 20px
- **Padding:** \`10px 16px\`
- **Border Radius:** \`8px\`
- **Border:** \`1px solid ${primary.value}\`
- **Box Shadow:** none
- **Hover State:** \`rgba(255, 255, 255, 0.06)\` on dark surfaces or \`rgba(0, 0, 0, 0.04)\` on light surfaces
- **Height:** 40px minimum

### Cards & Containers

- **Hero Card:** background \`${surface.value}\`, padding \`48px\`, border radius \`12px\`, border \`1px solid rgba(255,255,255,0.10)\`.
- **Feature Card:** background \`rgba(255,255,255,0.04)\`, padding \`24px\`, border radius \`10px\`, border \`1px solid rgba(255,255,255,0.10)\`.
- **Label Card:** background transparent, font size 12px, line-height 16px, opacity 72%.
- **Navigation:** height 64px, padding \`0 24px\`, background \`rgba(10, 10, 12, 0.78)\`, backdrop blur \`16px\`.
- **Inputs:** height 44px, padding \`0 14px\`, border \`1px solid rgba(255,255,255,0.14)\`, focus ring \`0 0 0 3px rgba(110,231,249,0.18)\`.

## 5. Layout Principles

- **Base Unit:** 4px
- **Container Width:** 1200px-1280px for marketing layouts, 1440px for dense dashboards
- **Grid:** 1 column mobile, 2 columns tablet, 3 columns desktop
- **Gutter:** 16px mobile, 24px tablet, 32px desktop
- **Section Padding:** 64px desktop, 40px tablet, 24px mobile
- **Card Padding:** 20px-32px depending on density

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat | \`box-shadow: none\` | Standard surfaces |
| Subtle | \`0 1px 2px rgba(0,0,0,0.10)\` | Inline cards |
| Medium | \`0 12px 32px rgba(0,0,0,0.18)\` | Menus and panels |
| Deep | \`0 28px 80px rgba(0,0,0,0.28)\` | Modals and hero focus states |

## 7. Do's and Don'ts

### Do

- Use ${primary.value} only where the user needs a clear action or selected state
- Keep card padding between 20px and 32px
- Use page sections with visible hierarchy and strong labels
- Keep interactive controls at least 40px tall
- Match screenshots, tags, and metadata to ${item.url}
- Document every repeated component as a reusable rule
- Use direct nouns for UI labels
- Keep color roles tied to verified palette values
- Use consistent border and radius values across related components
- Write rules that an implementation agent can follow without guessing

### Don't

- Do not invent extra brand colors beyond the verified gallery palette
- Do not use color alone for hierarchy
- Do not mix unrelated corner radius values in one component family
- Do not create vague component notes without CSS values
- Do not use more than 3 columns for card galleries
- Do not bury source URLs or screenshot context
- Do not make buttons smaller than 40px tall
- Do not create decorative shadows unless they clarify layer depth
- Do not let typography scale randomly between sections
- Do not omit responsive behavior

## 8. Responsive Behavior

| Breakpoint | Width | Key Changes |
|------------|-------|------------|
| Mobile | 320px-767px | Single column, 24px page padding, 40px controls |
| Tablet | 768px-1023px | Two columns, 32px section rhythm |
| Desktop | 1024px-1440px | Three columns, 1200px-1280px content width |
| Large Desktop | 1441px+ | Centered max-width layout, no uncontrolled stretching |

## 9. Agent Prompt Guide

### Quick Color Reference

- **Primary CTA:** ${primary.name} (\`${primary.value}\`)
- **Secondary Reference:** ${secondary.name} (\`${secondary.value}\`)
- **Surface Reference:** ${surface.name} (\`${surface.value}\`)
- **Source URL:** ${item.href}

### Iteration Guide

1. Build the interface around ${item.pageTypes.join(" and ")} page patterns.
2. Use ${primary.value} for primary interaction only.
3. Use ${surface.value} as the main surface or background reference.
4. Keep cards at 8px-12px radius unless the source clearly differs.
5. Use 40px-44px minimum height for all controls.
6. Keep section spacing between 40px and 64px.
7. Use ${item.uiElements.slice(0, 4).join(", ")} as the first component set.
8. Use ${item.uxPatterns.slice(0, 4).join(", ")} as the primary UX pattern references.
9. Keep the layout responsive with 1/2/3 column behavior.
10. Do not invent palette values outside the listed colors.
`
}

const CURATED_GALLERY_INPUTS: CuratedGalleryInput[] = [
  {
    id: "curated-stripe",
    name: "Stripe",
    description: "Payments infrastructure, pricing, dashboard, and trust-heavy product pages",
    url: "stripe.com",
    href: "https://stripe.com",
    pageTypes: ["Product Page & Landing", "Dashboard", "Pricing Page"],
    uxPatterns: ["Product Features", "Social Proof", "Feature Comparison", "Developer Docs"],
    uiElements: ["Navigation Bar", "Button", "Cards & Tiles", "Tabs", "Code Block", "Icon"],
    colors: [
      { name: "Stripe Purple", value: "#635BFF" },
      { name: "Navy", value: "#0A2540" },
      { name: "Cloud", value: "#F6F9FC" },
      { name: "Slate", value: "#425466" },
    ],
  },
  {
    id: "curated-linear",
    name: "Linear",
    description: "Issue tracking, planning, changelog, command menu, and polished SaaS workflows",
    url: "linear.app",
    href: "https://linear.app",
    pageTypes: ["Product Page & Landing", "Product Details", "Changelog"],
    uxPatterns: ["Command Menu", "Product Features", "Testimonials", "Roadmap"],
    uiElements: ["Cards & Tiles", "Button", "Carousel", "Navigation Bar", "Keyboard Shortcut", "Modal"],
    colors: [
      { name: "Linear Indigo", value: "#5E6AD2" },
      { name: "Black", value: "#08090A" },
      { name: "Mist", value: "#F7F8FA" },
      { name: "Gray", value: "#8A8F98" },
    ],
  },
  {
    id: "curated-vercel",
    name: "Vercel",
    description: "Developer platform, deployment dashboards, docs, and enterprise conversion pages",
    url: "vercel.com",
    href: "https://vercel.com",
    pageTypes: ["Product Page & Landing", "Dashboard", "Docs"],
    uxPatterns: ["Developer Onboarding", "Product Features", "Integration Page", "Enterprise CTA"],
    uiElements: ["Navigation Bar", "Button", "Code Block", "Tabs", "Cards & Tiles", "Status Badge"],
    colors: [
      { name: "Black", value: "#000000" },
      { name: "White", value: "#FFFFFF" },
      { name: "Gray 900", value: "#111111" },
      { name: "Gray 500", value: "#666666" },
    ],
  },
  {
    id: "curated-apple",
    name: "Apple",
    description: "Consumer product storytelling, minimal commerce, hero campaigns, and product navigation",
    url: "apple.com",
    href: "https://apple.com",
    pageTypes: ["Home Page", "Product Page & Landing", "Catalog Page"],
    uxPatterns: ["Hero Campaign", "Product Features", "Navigation", "Product Comparison"],
    uiElements: ["Navigation Bar", "Button", "Cards & Tiles", "Carousel", "Icon", "Footer"],
    colors: [
      { name: "Black", value: "#000000" },
      { name: "Blue", value: "#0071E3" },
      { name: "Cotton", value: "#F5F5F7" },
      { name: "Gray", value: "#6E6E73" },
    ],
  },
  {
    id: "curated-openai",
    name: "OpenAI",
    description: "AI research, product marketing, model pages, docs, and trust-centered enterprise flows",
    url: "openai.com",
    href: "https://openai.com",
    pageTypes: ["Home Page", "Product Page & Landing", "Docs"],
    uxPatterns: ["Editorial Storytelling", "Product Features", "Research Index", "Enterprise CTA"],
    uiElements: ["Navigation Bar", "Button", "Cards & Tiles", "Accordion & Collapse", "Footer", "Article List"],
    colors: [
      { name: "Near Black", value: "#0D0D0D" },
      { name: "White", value: "#FFFFFF" },
      { name: "Soft Gray", value: "#F4F4F4" },
      { name: "Muted Gray", value: "#6E6E6E" },
    ],
  },
  {
    id: "curated-anthropic",
    name: "Anthropic",
    description: "AI model product pages, research content, safety positioning, and enterprise funnels",
    url: "anthropic.com",
    href: "https://anthropic.com",
    pageTypes: ["Product Page & Landing", "Research Page", "Company Page"],
    uxPatterns: ["Editorial Storytelling", "Feature Comparison", "Enterprise CTA", "Resource Library"],
    uiElements: ["Navigation Bar", "Button", "Cards & Tiles", "Article Card", "Footer", "Icon"],
    colors: [
      { name: "Claude Orange", value: "#D97757" },
      { name: "Ink", value: "#1F1F1F" },
      { name: "Cream", value: "#F7F2E8" },
      { name: "Stone", value: "#8A8178" },
    ],
  },
  {
    id: "curated-cursor",
    name: "Cursor",
    description: "AI code editor landing pages, install flows, feature pages, and developer conversion",
    url: "cursor.com",
    href: "https://cursor.com",
    pageTypes: ["Product Page & Landing", "Download Page", "Pricing Page"],
    uxPatterns: ["Product Features", "Code Demo", "Testimonials", "Pricing Toggle"],
    uiElements: ["Button", "Code Block", "Cards & Tiles", "Navigation Bar", "Badge", "Video Preview"],
    colors: [
      { name: "Black", value: "#050505" },
      { name: "White", value: "#FFFFFF" },
      { name: "Blue", value: "#4C8DFF" },
      { name: "Muted", value: "#9CA3AF" },
    ],
  },
  {
    id: "curated-figma",
    name: "Figma",
    description: "Collaborative design software, templates, community, product education, and signup flows",
    url: "figma.com",
    href: "https://figma.com",
    pageTypes: ["Product Page & Landing", "Template Gallery", "Community Page"],
    uxPatterns: ["Product Features", "Template Browsing", "Collaboration", "Education"],
    uiElements: ["Navigation Bar", "Button", "Cards & Tiles", "Gallery Grid", "Tabs", "Avatar"],
    colors: [
      { name: "Figma Blue", value: "#1ABCFE" },
      { name: "Figma Green", value: "#0ACF83" },
      { name: "Figma Red", value: "#F24E1E" },
      { name: "Black", value: "#000000" },
    ],
  },
  {
    id: "curated-notion",
    name: "Notion",
    description: "Workspace software, templates, product education, onboarding, and team collaboration",
    url: "notion.so",
    href: "https://www.notion.so",
    pageTypes: ["Product Page & Landing", "Template Gallery", "Team Page"],
    uxPatterns: ["Template Browsing", "Product Features", "Onboarding", "Use Case Grid"],
    uiElements: ["Cards & Tiles", "Button", "Navigation Bar", "Search", "Icon", "Sidebar & Drawer"],
    colors: [
      { name: "Ink", value: "#191919" },
      { name: "White", value: "#FFFFFF" },
      { name: "Warm Gray", value: "#F7F6F3" },
      { name: "Blue", value: "#2383E2" },
    ],
  },
  {
    id: "curated-airbnb",
    name: "Airbnb",
    description: "Marketplace search, listing pages, booking flow, filters, and trust-centered checkout",
    url: "airbnb.com",
    href: "https://airbnb.com",
    pageTypes: ["Marketplace", "Search Results", "Product Details", "Checkout"],
    uxPatterns: ["Filter & Sorting", "Map Search", "Booking Flow", "Trust Signals"],
    uiElements: ["Search", "Cards & Tiles", "Button", "Map", "Carousel", "Calendar"],
    colors: [
      { name: "Raush", value: "#FF385C" },
      { name: "Black", value: "#222222" },
      { name: "White", value: "#FFFFFF" },
      { name: "Gray", value: "#717171" },
    ],
  },
  {
    id: "curated-github",
    name: "GitHub",
    description: "Developer collaboration, repository pages, code review, docs, and enterprise workflows",
    url: "github.com",
    href: "https://github.com",
    pageTypes: ["Dashboard", "Product Details", "Docs", "Profile & Account"],
    uxPatterns: ["Code Review", "Issue Tracking", "Search", "Developer Onboarding"],
    uiElements: ["Navigation Bar", "Button", "Tabs", "Code Block", "Table", "Badge"],
    colors: [
      { name: "Black", value: "#0D1117" },
      { name: "Blue", value: "#0969DA" },
      { name: "Canvas", value: "#FFFFFF" },
      { name: "Gray", value: "#57606A" },
    ],
  },
  {
    id: "curated-shopify",
    name: "Shopify",
    description: "Commerce platform marketing, admin workflows, checkout, product catalog, and pricing",
    url: "shopify.com",
    href: "https://shopify.com",
    pageTypes: ["Product Page & Landing", "Dashboard", "Pricing Page", "Checkout"],
    uxPatterns: ["Product Features", "Pricing", "Onboarding", "Store Setup"],
    uiElements: ["Button", "Cards & Tiles", "Navigation Bar", "Form", "List", "Status Badge"],
    colors: [
      { name: "Shopify Green", value: "#95BF47" },
      { name: "Ink", value: "#002E25" },
      { name: "Cream", value: "#F3FCF4" },
      { name: "Gray", value: "#6B7177" },
    ],
  },
  {
    id: "curated-webflow",
    name: "Webflow",
    description: "Visual website builder, templates, product marketing, education, and conversion flows",
    url: "webflow.com",
    href: "https://webflow.com",
    pageTypes: ["Product Page & Landing", "Template Gallery", "Pricing Page"],
    uxPatterns: ["Product Features", "Template Browsing", "Education", "Feature Comparison"],
    uiElements: ["Navigation Bar", "Button", "Cards & Tiles", "Carousel", "Tabs", "Video Preview"],
    colors: [
      { name: "Webflow Blue", value: "#146EF5" },
      { name: "Black", value: "#080808" },
      { name: "White", value: "#FFFFFF" },
      { name: "Gray", value: "#6B7280" },
    ],
  },
  {
    id: "curated-ramp",
    name: "Ramp",
    description: "Finance platform dashboards, expense workflows, approval flows, and enterprise pages",
    url: "ramp.com",
    href: "https://ramp.com",
    pageTypes: ["Product Page & Landing", "Dashboard", "Enterprise Page"],
    uxPatterns: ["Product Features", "Stats", "Approval Flow", "Customer Proof"],
    uiElements: ["Cards & Tiles", "Button", "Table", "Chart", "Navigation Bar", "Badge"],
    colors: [
      { name: "Ramp Green", value: "#00C775" },
      { name: "Black", value: "#0A0F0D" },
      { name: "White", value: "#FFFFFF" },
      { name: "Mint", value: "#E6FFF4" },
    ],
  },
  {
    id: "curated-retool",
    name: "Retool",
    description: "Internal tools, data app dashboards, workflow builders, and developer-first demos",
    url: "retool.com",
    href: "https://retool.com",
    pageTypes: ["Product Page & Landing", "Dashboard", "Integration Page"],
    uxPatterns: ["Product Features", "Workflow Builder", "Developer Docs", "Use Case Grid"],
    uiElements: ["Cards & Tiles", "Button", "Table", "Code Block", "Chart", "Form"],
    colors: [
      { name: "Retool Blue", value: "#3B82F6" },
      { name: "Ink", value: "#0F172A" },
      { name: "White", value: "#FFFFFF" },
      { name: "Slate", value: "#64748B" },
    ],
  },
  {
    id: "curated-supabase",
    name: "Supabase",
    description: "Backend platform docs, dashboard workflows, database UI, and developer onboarding",
    url: "supabase.com",
    href: "https://supabase.com",
    pageTypes: ["Product Page & Landing", "Docs", "Dashboard"],
    uxPatterns: ["Developer Onboarding", "Product Features", "Docs Navigation", "Integration Page"],
    uiElements: ["Navigation Bar", "Button", "Code Block", "Table", "Tabs", "Cards & Tiles"],
    colors: [
      { name: "Supabase Green", value: "#3ECF8E" },
      { name: "Black", value: "#121212" },
      { name: "White", value: "#FFFFFF" },
      { name: "Gray", value: "#A1A1AA" },
    ],
  },
  {
    id: "curated-clerk",
    name: "Clerk",
    description: "Authentication components, account management, docs, pricing, and developer setup",
    url: "clerk.com",
    href: "https://clerk.com",
    pageTypes: ["Product Page & Landing", "Docs", "Pricing Page", "Profile & Account"],
    uxPatterns: ["Developer Onboarding", "Auth Flow", "Product Features", "Pricing"],
    uiElements: ["Button", "Form", "Avatar", "Sidebar & Drawer", "Code Block", "Tabs"],
    colors: [
      { name: "Clerk Purple", value: "#6C47FF" },
      { name: "Black", value: "#131316" },
      { name: "White", value: "#FFFFFF" },
      { name: "Lavender", value: "#F1EEFF" },
    ],
  },
  {
    id: "curated-framer",
    name: "Framer",
    description: "Website builder marketing, templates, animation patterns, and publishing workflows",
    url: "framer.com",
    href: "https://framer.com",
    pageTypes: ["Product Page & Landing", "Template Gallery", "Pricing Page"],
    uxPatterns: ["Template Browsing", "Animation", "Product Features", "Publishing Flow"],
    uiElements: ["Button", "Cards & Tiles", "Carousel", "Navigation Bar", "Video Preview", "Badge"],
    colors: [
      { name: "Framer Blue", value: "#0099FF" },
      { name: "Black", value: "#050505" },
      { name: "White", value: "#FFFFFF" },
      { name: "Gray", value: "#999999" },
    ],
  },
  { id: "curated-dropbox", name: "Dropbox", description: "File collaboration, team storage, sharing workflows, and polished productivity onboarding", url: "dropbox.com", href: "https://dropbox.com", pageTypes: ["Product Page & Landing", "Team Page", "Pricing Page"], uxPatterns: ["Product Features", "Collaboration", "File Sharing", "Enterprise CTA"], uiElements: ["Navigation Bar", "Button", "Cards & Tiles", "Illustration", "Tabs", "Form"], colors: [{ name: "Dropbox Blue", value: "#0061FF" }, { name: "Ink", value: "#1E1919" }, { name: "White", value: "#FFFFFF" }, { name: "Cream", value: "#F7F5F2" }] },
  { id: "curated-slack", name: "Slack", description: "Team messaging, collaboration product pages, integration galleries, and enterprise conversion", url: "slack.com", href: "https://slack.com", pageTypes: ["Product Page & Landing", "Integration Page", "Enterprise Page"], uxPatterns: ["Collaboration", "Integration Page", "Product Features", "Social Proof"], uiElements: ["Navigation Bar", "Button", "Cards & Tiles", "Logo Grid", "Tabs", "Form"], colors: [{ name: "Slack Purple", value: "#611F69" }, { name: "Green", value: "#2EB67D" }, { name: "Yellow", value: "#ECB22E" }, { name: "Red", value: "#E01E5A" }] },
  { id: "curated-discord", name: "Discord", description: "Community platform marketing, download flows, creator pages, and playful interaction patterns", url: "discord.com", href: "https://discord.com", pageTypes: ["Home Page", "Download Page", "Product Page & Landing"], uxPatterns: ["Community", "Product Features", "Download Flow", "Playful Branding"], uiElements: ["Button", "Navigation Bar", "Cards & Tiles", "Illustration", "Badge", "Footer"], colors: [{ name: "Blurple", value: "#5865F2" }, { name: "Dark", value: "#23272A" }, { name: "White", value: "#FFFFFF" }, { name: "Green", value: "#57F287" }] },
  { id: "curated-asana", name: "Asana", description: "Work management product pages, workflow templates, dashboards, and team planning use cases", url: "asana.com", href: "https://asana.com", pageTypes: ["Product Page & Landing", "Template Gallery", "Use Case Page"], uxPatterns: ["Product Features", "Workflow Builder", "Template Browsing", "Customer Proof"], uiElements: ["Cards & Tiles", "Button", "Navigation Bar", "Tabs", "List", "Chart"], colors: [{ name: "Asana Coral", value: "#F06A6A" }, { name: "Purple", value: "#796EFF" }, { name: "Ink", value: "#151B26" }, { name: "Mist", value: "#F6F8F9" }] },
  { id: "curated-monday", name: "monday.com", description: "Work OS dashboards, colorful workflow boards, pricing flows, and enterprise productivity pages", url: "monday.com", href: "https://monday.com", pageTypes: ["Product Page & Landing", "Dashboard", "Pricing Page"], uxPatterns: ["Workflow Builder", "Product Features", "Use Case Grid", "Enterprise CTA"], uiElements: ["Cards & Tiles", "Button", "Table", "Chart", "Navigation Bar", "Badge"], colors: [{ name: "Monday Blue", value: "#00A9FF" }, { name: "Purple", value: "#A25DDC" }, { name: "Green", value: "#00CA72" }, { name: "Ink", value: "#181B34" }] },
  { id: "curated-atlassian", name: "Atlassian", description: "Enterprise software suites, product navigation, solution pages, docs, and team workflow content", url: "atlassian.com", href: "https://atlassian.com", pageTypes: ["Product Page & Landing", "Docs", "Enterprise Page"], uxPatterns: ["Product Suite", "Feature Comparison", "Developer Docs", "Enterprise CTA"], uiElements: ["Navigation Bar", "Button", "Cards & Tiles", "Tabs", "Logo Grid", "Footer"], colors: [{ name: "Atlassian Blue", value: "#0052CC" }, { name: "Navy", value: "#172B4D" }, { name: "White", value: "#FFFFFF" }, { name: "Light Blue", value: "#DEEBFF" }] },
  { id: "curated-miro", name: "Miro", description: "Collaborative whiteboard templates, product education, boards, integrations, and workshop flows", url: "miro.com", href: "https://miro.com", pageTypes: ["Product Page & Landing", "Template Gallery", "Integration Page"], uxPatterns: ["Collaboration", "Template Browsing", "Product Features", "Education"], uiElements: ["Canvas", "Button", "Cards & Tiles", "Navigation Bar", "Search", "Avatar"], colors: [{ name: "Miro Yellow", value: "#FFD02F" }, { name: "Black", value: "#050038" }, { name: "White", value: "#FFFFFF" }, { name: "Blue", value: "#4262FF" }] },
  { id: "curated-canva", name: "Canva", description: "Design editor marketing, template galleries, education flows, brand kits, and creator onboarding", url: "canva.com", href: "https://www.canva.com", pageTypes: ["Product Page & Landing", "Template Gallery", "Editor"], uxPatterns: ["Template Browsing", "Creator Onboarding", "Product Features", "Search"], uiElements: ["Gallery Grid", "Button", "Cards & Tiles", "Search", "Navigation Bar", "Avatar"], colors: [{ name: "Canva Cyan", value: "#00C4CC" }, { name: "Purple", value: "#7D2AE8" }, { name: "White", value: "#FFFFFF" }, { name: "Ink", value: "#0E1318" }] },
  { id: "curated-loom", name: "Loom", description: "Video messaging product pages, recording workflows, team use cases, and async collaboration", url: "loom.com", href: "https://www.loom.com", pageTypes: ["Product Page & Landing", "Use Case Page", "Pricing Page"], uxPatterns: ["Product Demo", "Collaboration", "Social Proof", "Team Onboarding"], uiElements: ["Video Preview", "Button", "Cards & Tiles", "Navigation Bar", "Avatar", "Badge"], colors: [{ name: "Loom Purple", value: "#625DF5" }, { name: "Ink", value: "#0B1020" }, { name: "White", value: "#FFFFFF" }, { name: "Lavender", value: "#EDEBFF" }] },
  { id: "curated-typeform", name: "Typeform", description: "Form builder marketing, template discovery, conversational surveys, and conversion funnels", url: "typeform.com", href: "https://www.typeform.com", pageTypes: ["Product Page & Landing", "Template Gallery", "Pricing Page"], uxPatterns: ["Form Flow", "Template Browsing", "Product Features", "Conversational UX"], uiElements: ["Form", "Button", "Cards & Tiles", "Search", "Navigation Bar", "Tabs"], colors: [{ name: "Typeform Black", value: "#000000" }, { name: "Sand", value: "#F4EFEA" }, { name: "Blue", value: "#3B82F6" }, { name: "White", value: "#FFFFFF" }] },
  { id: "curated-zapier", name: "Zapier", description: "Automation product pages, app directory, workflow builder examples, and onboarding funnels", url: "zapier.com", href: "https://zapier.com", pageTypes: ["Product Page & Landing", "Integration Page", "Dashboard"], uxPatterns: ["Workflow Builder", "Integration Page", "Search", "Developer Onboarding"], uiElements: ["Cards & Tiles", "Button", "Search", "Icon", "Navigation Bar", "Form"], colors: [{ name: "Zapier Orange", value: "#FF4A00" }, { name: "Ink", value: "#201515" }, { name: "White", value: "#FFFFFF" }, { name: "Cream", value: "#FFF7F0" }] },
  { id: "curated-airtable", name: "Airtable", description: "Database-spreadsheet workflows, templates, interface builder pages, and team operations", url: "airtable.com", href: "https://airtable.com", pageTypes: ["Product Page & Landing", "Template Gallery", "Dashboard"], uxPatterns: ["Template Browsing", "Data Grid", "Workflow Builder", "Use Case Grid"], uiElements: ["Table", "Cards & Tiles", "Button", "Tabs", "Navigation Bar", "Form"], colors: [{ name: "Airtable Blue", value: "#18BFFF" }, { name: "Yellow", value: "#FECB2E" }, { name: "Red", value: "#F82B60" }, { name: "Ink", value: "#1D1F25" }] },
  { id: "curated-coda", name: "Coda", description: "Document-app workflows, template galleries, product education, and collaboration pages", url: "coda.io", href: "https://coda.io", pageTypes: ["Product Page & Landing", "Template Gallery", "Docs"], uxPatterns: ["Template Browsing", "Document Editor", "Product Features", "Collaboration"], uiElements: ["Cards & Tiles", "Button", "Table", "Navigation Bar", "Icon", "Tabs"], colors: [{ name: "Coda Orange", value: "#F46A54" }, { name: "Ink", value: "#1F1F1F" }, { name: "White", value: "#FFFFFF" }, { name: "Cream", value: "#FFF7ED" }] },
  { id: "curated-pitch", name: "Pitch", description: "Presentation software marketing, template browsing, collaboration workflows, and editor pages", url: "pitch.com", href: "https://pitch.com", pageTypes: ["Product Page & Landing", "Template Gallery", "Team Page"], uxPatterns: ["Template Browsing", "Collaboration", "Product Features", "Editor Preview"], uiElements: ["Cards & Tiles", "Button", "Carousel", "Navigation Bar", "Avatar", "Video Preview"], colors: [{ name: "Pitch Purple", value: "#6C5CFF" }, { name: "Ink", value: "#0E1020" }, { name: "White", value: "#FFFFFF" }, { name: "Pink", value: "#FF5E9E" }] },
  { id: "curated-mailchimp", name: "Mailchimp", description: "Email marketing campaigns, audience dashboards, automation flows, and playful brand pages", url: "mailchimp.com", href: "https://mailchimp.com", pageTypes: ["Product Page & Landing", "Dashboard", "Pricing Page"], uxPatterns: ["Product Features", "Campaign Builder", "Audience Management", "Pricing"], uiElements: ["Button", "Cards & Tiles", "Form", "Navigation Bar", "Chart", "Illustration"], colors: [{ name: "Cavendish", value: "#FFE01B" }, { name: "Ink", value: "#241C15" }, { name: "White", value: "#FFFFFF" }, { name: "Blue", value: "#007C89" }] },
  { id: "curated-intercom", name: "Intercom", description: "Customer support AI, inbox workflows, messenger UI, help center pages, and enterprise funnels", url: "intercom.com", href: "https://www.intercom.com", pageTypes: ["Product Page & Landing", "Dashboard", "Docs"], uxPatterns: ["Chat", "Support Inbox", "Product Features", "Help Center"], uiElements: ["Chat Widget", "Button", "Cards & Tiles", "Navigation Bar", "Tabs", "Avatar"], colors: [{ name: "Intercom Blue", value: "#286EFA" }, { name: "Black", value: "#0A0A0A" }, { name: "White", value: "#FFFFFF" }, { name: "Sky", value: "#E7F0FF" }] },
  { id: "curated-zendesk", name: "Zendesk", description: "Support software, help center patterns, ticketing dashboards, and enterprise solution pages", url: "zendesk.com", href: "https://www.zendesk.com", pageTypes: ["Product Page & Landing", "Enterprise Page", "Docs"], uxPatterns: ["Support Inbox", "Help Center", "Product Features", "Enterprise CTA"], uiElements: ["Cards & Tiles", "Button", "Navigation Bar", "Form", "Table", "Article List"], colors: [{ name: "Zendesk Green", value: "#03363D" }, { name: "Mint", value: "#D6EEF2" }, { name: "White", value: "#FFFFFF" }, { name: "Lime", value: "#C7D92C" }] },
  { id: "curated-hubspot", name: "HubSpot", description: "CRM marketing, sales dashboards, pricing pages, resource libraries, and conversion funnels", url: "hubspot.com", href: "https://www.hubspot.com", pageTypes: ["Product Page & Landing", "Pricing Page", "Resource Library"], uxPatterns: ["Product Suite", "Lead Capture", "Resource Library", "Pricing"], uiElements: ["Button", "Cards & Tiles", "Form", "Navigation Bar", "Table", "Badge"], colors: [{ name: "HubSpot Orange", value: "#FF5C35" }, { name: "Navy", value: "#213343" }, { name: "White", value: "#FFFFFF" }, { name: "Cream", value: "#F6F9FC" }] },
  { id: "curated-wise", name: "Wise", description: "Fintech transfer flows, rate comparison pages, account onboarding, and trust-first product UI", url: "wise.com", href: "https://wise.com", pageTypes: ["Product Page & Landing", "Checkout", "Pricing Page"], uxPatterns: ["Calculator", "Trust Signals", "Onboarding", "Feature Comparison"], uiElements: ["Form", "Button", "Cards & Tiles", "Table", "Navigation Bar", "Badge"], colors: [{ name: "Wise Green", value: "#9FE870" }, { name: "Ink", value: "#163300" }, { name: "White", value: "#FFFFFF" }, { name: "Blue", value: "#00B9FF" }] },
  { id: "curated-mercury", name: "Mercury", description: "Startup banking dashboards, onboarding flows, finance product pages, and card/account UI", url: "mercury.com", href: "https://mercury.com", pageTypes: ["Product Page & Landing", "Dashboard", "Company Page"], uxPatterns: ["Financial Dashboard", "Onboarding", "Trust Signals", "Product Features"], uiElements: ["Cards & Tiles", "Button", "Chart", "Table", "Navigation Bar", "Form"], colors: [{ name: "Mercury Blue", value: "#335CFF" }, { name: "Ink", value: "#0F172A" }, { name: "White", value: "#FFFFFF" }, { name: "Mist", value: "#F4F7FB" }] },
  { id: "curated-brex", name: "Brex", description: "Corporate card workflows, expense dashboards, finance product pages, and enterprise trust flows", url: "brex.com", href: "https://www.brex.com", pageTypes: ["Product Page & Landing", "Dashboard", "Enterprise Page"], uxPatterns: ["Financial Dashboard", "Approval Flow", "Product Features", "Customer Proof"], uiElements: ["Cards & Tiles", "Button", "Table", "Chart", "Navigation Bar", "Badge"], colors: [{ name: "Brex Blue", value: "#0055FF" }, { name: "Black", value: "#0B0B0F" }, { name: "White", value: "#FFFFFF" }, { name: "Gray", value: "#6B7280" }] },
  { id: "curated-deel", name: "Deel", description: "Global HR platform pages, payroll workflows, compliance dashboards, and pricing funnels", url: "deel.com", href: "https://www.deel.com", pageTypes: ["Product Page & Landing", "Dashboard", "Pricing Page"], uxPatterns: ["Product Features", "Compliance Flow", "Use Case Grid", "Enterprise CTA"], uiElements: ["Cards & Tiles", "Button", "Form", "Table", "Navigation Bar", "Badge"], colors: [{ name: "Deel Purple", value: "#5B35D5" }, { name: "Ink", value: "#101828" }, { name: "White", value: "#FFFFFF" }, { name: "Lavender", value: "#F3F0FF" }] },
  { id: "curated-rippling", name: "Rippling", description: "Workforce platform product suites, admin dashboards, app grids, and enterprise automation", url: "rippling.com", href: "https://www.rippling.com", pageTypes: ["Product Page & Landing", "Dashboard", "Enterprise Page"], uxPatterns: ["Product Suite", "Admin Dashboard", "Workflow Builder", "Enterprise CTA"], uiElements: ["Cards & Tiles", "Button", "Table", "Navigation Bar", "Icon", "Chart"], colors: [{ name: "Rippling Green", value: "#00A878" }, { name: "Ink", value: "#0E1116" }, { name: "White", value: "#FFFFFF" }, { name: "Mist", value: "#F5F7F8" }] },
  { id: "curated-gusto", name: "Gusto", description: "Payroll and benefits workflows, small business onboarding, pricing, and trust-centered forms", url: "gusto.com", href: "https://gusto.com", pageTypes: ["Product Page & Landing", "Pricing Page", "Onboarding"], uxPatterns: ["Onboarding", "Form Flow", "Product Features", "Trust Signals"], uiElements: ["Form", "Button", "Cards & Tiles", "Navigation Bar", "Illustration", "Table"], colors: [{ name: "Gusto Coral", value: "#F45D48" }, { name: "Ink", value: "#1F2A37" }, { name: "Cream", value: "#FFF8F0" }, { name: "Blue", value: "#2E5AAC" }] },
  { id: "curated-plaid", name: "Plaid", description: "Financial API docs, product education, developer onboarding, and institution connection flows", url: "plaid.com", href: "https://plaid.com", pageTypes: ["Product Page & Landing", "Docs", "Integration Page"], uxPatterns: ["Developer Onboarding", "Integration Page", "Product Features", "Trust Signals"], uiElements: ["Code Block", "Button", "Cards & Tiles", "Navigation Bar", "Tabs", "Form"], colors: [{ name: "Plaid Green", value: "#00D46A" }, { name: "Ink", value: "#111111" }, { name: "White", value: "#FFFFFF" }, { name: "Mint", value: "#E9FFF3" }] },
  { id: "curated-twilio", name: "Twilio", description: "Developer communications APIs, docs, pricing, console workflows, and integration pages", url: "twilio.com", href: "https://www.twilio.com", pageTypes: ["Product Page & Landing", "Docs", "Pricing Page"], uxPatterns: ["Developer Onboarding", "Product Features", "Integration Page", "Pricing"], uiElements: ["Code Block", "Button", "Cards & Tiles", "Navigation Bar", "Tabs", "Form"], colors: [{ name: "Twilio Red", value: "#F22F46" }, { name: "Navy", value: "#0D122B" }, { name: "White", value: "#FFFFFF" }, { name: "Gray", value: "#606B85" }] },
  { id: "curated-segment", name: "Segment", description: "Customer data platform pages, event pipelines, integration catalogs, and developer docs", url: "segment.com", href: "https://segment.com", pageTypes: ["Product Page & Landing", "Docs", "Integration Page"], uxPatterns: ["Data Pipeline", "Integration Page", "Developer Docs", "Product Features"], uiElements: ["Code Block", "Cards & Tiles", "Button", "Table", "Navigation Bar", "Diagram"], colors: [{ name: "Segment Green", value: "#52BD95" }, { name: "Ink", value: "#0B1320" }, { name: "White", value: "#FFFFFF" }, { name: "Mist", value: "#F5FAF8" }] },
  { id: "curated-datadog", name: "Datadog", description: "Observability dashboards, monitoring product pages, enterprise docs, and metrics-heavy UI", url: "datadoghq.com", href: "https://www.datadoghq.com", pageTypes: ["Product Page & Landing", "Dashboard", "Docs"], uxPatterns: ["Monitoring Dashboard", "Product Suite", "Developer Docs", "Enterprise CTA"], uiElements: ["Chart", "Table", "Cards & Tiles", "Button", "Navigation Bar", "Code Block"], colors: [{ name: "Datadog Purple", value: "#632CA6" }, { name: "Ink", value: "#1F2937" }, { name: "White", value: "#FFFFFF" }, { name: "Lavender", value: "#F4EEFF" }] },
  { id: "curated-sentry", name: "Sentry", description: "Error monitoring, issue detail pages, developer onboarding, release health, and docs", url: "sentry.io", href: "https://sentry.io", pageTypes: ["Product Page & Landing", "Dashboard", "Docs"], uxPatterns: ["Issue Tracking", "Developer Onboarding", "Monitoring Dashboard", "Product Features"], uiElements: ["Code Block", "Table", "Cards & Tiles", "Button", "Navigation Bar", "Chart"], colors: [{ name: "Sentry Purple", value: "#362D59" }, { name: "Violet", value: "#6C5FC7" }, { name: "White", value: "#FFFFFF" }, { name: "Gray", value: "#80708F" }] },
  { id: "curated-hashicorp", name: "HashiCorp", description: "Infrastructure product suite, docs navigation, cloud workflows, and enterprise conversion pages", url: "hashicorp.com", href: "https://www.hashicorp.com", pageTypes: ["Product Page & Landing", "Docs", "Enterprise Page"], uxPatterns: ["Product Suite", "Developer Docs", "Enterprise CTA", "Feature Comparison"], uiElements: ["Navigation Bar", "Button", "Cards & Tiles", "Code Block", "Tabs", "Diagram"], colors: [{ name: "Hashi Purple", value: "#844FBA" }, { name: "Ink", value: "#0C111D" }, { name: "White", value: "#FFFFFF" }, { name: "Gray", value: "#6B7280" }] },
  { id: "curated-docker", name: "Docker", description: "Developer platform pages, docs, product onboarding, pricing, and container workflow examples", url: "docker.com", href: "https://www.docker.com", pageTypes: ["Product Page & Landing", "Docs", "Pricing Page"], uxPatterns: ["Developer Onboarding", "Product Features", "Docs Navigation", "Pricing"], uiElements: ["Code Block", "Button", "Cards & Tiles", "Navigation Bar", "Tabs", "Icon"], colors: [{ name: "Docker Blue", value: "#2496ED" }, { name: "Navy", value: "#0B214A" }, { name: "White", value: "#FFFFFF" }, { name: "Mist", value: "#F0F7FF" }] },
  { id: "curated-netlify", name: "Netlify", description: "Web deployment platform, docs, templates, build workflows, and developer conversion pages", url: "netlify.com", href: "https://www.netlify.com", pageTypes: ["Product Page & Landing", "Docs", "Template Gallery"], uxPatterns: ["Developer Onboarding", "Product Features", "Template Browsing", "Integration Page"], uiElements: ["Code Block", "Button", "Cards & Tiles", "Navigation Bar", "Tabs", "Badge"], colors: [{ name: "Netlify Teal", value: "#00C7B7" }, { name: "Navy", value: "#014847" }, { name: "White", value: "#FFFFFF" }, { name: "Mint", value: "#E6FFFB" }] },
  { id: "curated-railway", name: "Railway", description: "Cloud deployment dashboards, project templates, developer onboarding, and infrastructure product pages", url: "railway.app", href: "https://railway.app", pageTypes: ["Product Page & Landing", "Dashboard", "Template Gallery"], uxPatterns: ["Developer Onboarding", "Project Dashboard", "Template Browsing", "Product Features"], uiElements: ["Cards & Tiles", "Button", "Code Block", "Navigation Bar", "Status Badge", "Chart"], colors: [{ name: "Railway Purple", value: "#A855F7" }, { name: "Black", value: "#0B0D12" }, { name: "White", value: "#FFFFFF" }, { name: "Gray", value: "#9CA3AF" }] },
  { id: "curated-neon", name: "Neon", description: "Serverless Postgres product pages, docs, database dashboards, and developer onboarding", url: "neon.tech", href: "https://neon.tech", pageTypes: ["Product Page & Landing", "Docs", "Dashboard"], uxPatterns: ["Developer Onboarding", "Database Dashboard", "Product Features", "Pricing"], uiElements: ["Code Block", "Button", "Cards & Tiles", "Table", "Navigation Bar", "Tabs"], colors: [{ name: "Neon Green", value: "#00E599" }, { name: "Black", value: "#050505" }, { name: "White", value: "#FFFFFF" }, { name: "Cyan", value: "#00D9FF" }] },
  { id: "curated-prisma", name: "Prisma", description: "Database tooling docs, product pages, ORM examples, and developer-first education flows", url: "prisma.io", href: "https://www.prisma.io", pageTypes: ["Product Page & Landing", "Docs", "Developer Tool"], uxPatterns: ["Developer Docs", "Product Features", "Code Demo", "Education"], uiElements: ["Code Block", "Button", "Cards & Tiles", "Navigation Bar", "Tabs", "Diagram"], colors: [{ name: "Prisma Blue", value: "#2D3748" }, { name: "Teal", value: "#0CBAA6" }, { name: "White", value: "#FFFFFF" }, { name: "Mist", value: "#F7FAFC" }] },
  { id: "curated-tailwind", name: "Tailwind CSS", description: "Framework docs, component examples, marketing pages, and utility-first developer education", url: "tailwindcss.com", href: "https://tailwindcss.com", pageTypes: ["Docs", "Product Page & Landing", "Component Gallery"], uxPatterns: ["Developer Docs", "Code Demo", "Education", "Component Gallery"], uiElements: ["Code Block", "Button", "Cards & Tiles", "Navigation Bar", "Search", "Tabs"], colors: [{ name: "Tailwind Sky", value: "#38BDF8" }, { name: "Slate", value: "#0F172A" }, { name: "White", value: "#FFFFFF" }, { name: "Cyan", value: "#06B6D4" }] },
  { id: "curated-storybook", name: "Storybook", description: "Component documentation, design system pages, addon marketplace, and developer education", url: "storybook.js.org", href: "https://storybook.js.org", pageTypes: ["Docs", "Product Page & Landing", "Component Gallery"], uxPatterns: ["Component Gallery", "Developer Docs", "Education", "Add-on Marketplace"], uiElements: ["Cards & Tiles", "Button", "Code Block", "Navigation Bar", "Search", "Tabs"], colors: [{ name: "Storybook Pink", value: "#FF4785" }, { name: "Ink", value: "#2E3438" }, { name: "White", value: "#FFFFFF" }, { name: "Blue", value: "#1EA7FD" }] },
  { id: "curated-observable", name: "Observable", description: "Data notebook pages, charts, dashboards, documentation, and collaborative analytics examples", url: "observablehq.com", href: "https://observablehq.com", pageTypes: ["Product Page & Landing", "Dashboard", "Docs"], uxPatterns: ["Data Visualization", "Notebook", "Collaboration", "Developer Docs"], uiElements: ["Chart", "Code Block", "Cards & Tiles", "Button", "Navigation Bar", "Table"], colors: [{ name: "Observable Blue", value: "#4269D0" }, { name: "Ink", value: "#1B1E23" }, { name: "White", value: "#FFFFFF" }, { name: "Gold", value: "#E6AB02" }] },
  { id: "curated-coinbase", name: "Coinbase", description: "Crypto onboarding, account pages, trading flows, trust messaging, and financial product UX", url: "coinbase.com", href: "https://www.coinbase.com", pageTypes: ["Product Page & Landing", "Dashboard", "Onboarding"], uxPatterns: ["Financial Dashboard", "Onboarding", "Trust Signals", "Product Features"], uiElements: ["Button", "Cards & Tiles", "Chart", "Table", "Navigation Bar", "Form"], colors: [{ name: "Coinbase Blue", value: "#0052FF" }, { name: "Ink", value: "#0A0B0D" }, { name: "White", value: "#FFFFFF" }, { name: "Mist", value: "#EEF4FF" }] },
  { id: "curated-spotify", name: "Spotify", description: "Music product pages, creator tools, plan comparison, editorial campaigns, and media-rich UI", url: "spotify.com", href: "https://www.spotify.com", pageTypes: ["Product Page & Landing", "Pricing Page", "Campaign Page"], uxPatterns: ["Media Browsing", "Pricing", "Product Features", "Campaign"], uiElements: ["Button", "Cards & Tiles", "Navigation Bar", "Carousel", "Media Card", "Footer"], colors: [{ name: "Spotify Green", value: "#1DB954" }, { name: "Black", value: "#191414" }, { name: "White", value: "#FFFFFF" }, { name: "Gray", value: "#B3B3B3" }] },
  { id: "curated-duolingo", name: "Duolingo", description: "Learning product onboarding, gamified lessons, pricing, and playful consumer conversion pages", url: "duolingo.com", href: "https://www.duolingo.com", pageTypes: ["Product Page & Landing", "Onboarding", "Pricing Page"], uxPatterns: ["Gamification", "Onboarding", "Product Features", "Progress Tracking"], uiElements: ["Button", "Cards & Tiles", "Progress Bar", "Icon", "Navigation Bar", "Badge"], colors: [{ name: "Duolingo Green", value: "#58CC02" }, { name: "Blue", value: "#1CB0F6" }, { name: "White", value: "#FFFFFF" }, { name: "Ink", value: "#3C3C3C" }] },
  { id: "curated-headspace", name: "Headspace", description: "Wellness onboarding, subscription pages, content libraries, and calm consumer product UX", url: "headspace.com", href: "https://www.headspace.com", pageTypes: ["Product Page & Landing", "Pricing Page", "Content Library"], uxPatterns: ["Onboarding", "Content Browsing", "Subscription", "Wellness Branding"], uiElements: ["Cards & Tiles", "Button", "Navigation Bar", "Illustration", "Carousel", "Form"], colors: [{ name: "Headspace Orange", value: "#FF7F32" }, { name: "Blue", value: "#1E6DEB" }, { name: "Cream", value: "#FFF7EF" }, { name: "Ink", value: "#1F2937" }] },
  { id: "curated-masterclass", name: "MasterClass", description: "Editorial course browsing, subscription conversion, media cards, and premium learning pages", url: "masterclass.com", href: "https://www.masterclass.com", pageTypes: ["Product Page & Landing", "Catalog Page", "Pricing Page"], uxPatterns: ["Content Browsing", "Subscription", "Editorial Storytelling", "Video Preview"], uiElements: ["Media Card", "Button", "Cards & Tiles", "Navigation Bar", "Carousel", "Badge"], colors: [{ name: "MasterClass Red", value: "#E3262E" }, { name: "Black", value: "#050505" }, { name: "White", value: "#FFFFFF" }, { name: "Gold", value: "#C9A227" }] },
  { id: "curated-patreon", name: "Patreon", description: "Creator monetization pages, membership tiers, onboarding, and community product marketing", url: "patreon.com", href: "https://www.patreon.com", pageTypes: ["Product Page & Landing", "Pricing Page", "Creator Page"], uxPatterns: ["Creator Onboarding", "Membership Tiers", "Community", "Product Features"], uiElements: ["Button", "Cards & Tiles", "Avatar", "Navigation Bar", "Pricing Card", "Form"], colors: [{ name: "Patreon Coral", value: "#FF424D" }, { name: "Ink", value: "#141518" }, { name: "White", value: "#FFFFFF" }, { name: "Cream", value: "#FFF5F2" }] },
  { id: "curated-unsplash", name: "Unsplash", description: "Photography browsing, search, creator profiles, collection grids, and media marketplace UI", url: "unsplash.com", href: "https://unsplash.com", pageTypes: ["Marketplace", "Search Results", "Profile & Account"], uxPatterns: ["Media Browsing", "Search", "Creator Profile", "Collection Grid"], uiElements: ["Gallery Grid", "Search", "Button", "Navigation Bar", "Image Card", "Modal"], colors: [{ name: "Black", value: "#000000" }, { name: "White", value: "#FFFFFF" }, { name: "Gray", value: "#767676" }, { name: "Mist", value: "#F5F5F5" }] },
  { id: "curated-dribbble", name: "Dribbble", description: "Design portfolio browsing, hiring pages, profile grids, marketplace patterns, and visual search", url: "dribbble.com", href: "https://dribbble.com", pageTypes: ["Marketplace", "Profile & Account", "Search Results"], uxPatterns: ["Portfolio Grid", "Search", "Creator Profile", "Hiring Flow"], uiElements: ["Gallery Grid", "Cards & Tiles", "Button", "Avatar", "Navigation Bar", "Search"], colors: [{ name: "Dribbble Pink", value: "#EA4C89" }, { name: "Ink", value: "#0D0C22" }, { name: "White", value: "#FFFFFF" }, { name: "Gray", value: "#6E6D7A" }] },
]

export const DEFAULT_GALLERY_ITEMS: GalleryItem[] = CURATED_GALLERY_INPUTS.map((item) => {
  const galleryItem = {
    ...item,
    id: item.id.replace("curated-", "showcase-"),
    markdown: "",
  }

  return {
    ...galleryItem,
    markdown: createCuratedMarkdown(galleryItem),
  }
})

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

type ScreenshotPreset = "card" | "detail"

export function screenshotUrl(href: string, preset: ScreenshotPreset = "card") {
  const params = new URLSearchParams({
    url: href,
    screenshot: "true",
    meta: "false",
    embed: "screenshot.url",
    type: "jpeg",
    waitUntil: "networkidle2",
    adblock: "true",
    hideCookieBanner: "true",
    quality: "82",
    "viewport.width": preset === "detail" ? "1440" : "1280",
    "viewport.height": preset === "detail" ? "900" : "800",
    deviceScaleFactor: "1",
  })

  return `https://api.microlink.io/?${params.toString()}`
}

export function fallbackScreenshotUrl(href: string) {
  return `https://image.thum.io/get/width/1600/crop/1000/noanimate/${encodeURIComponent(href)}`
}
