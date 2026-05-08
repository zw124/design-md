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

export const DEFAULT_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "stripe",
    name: "Stripe",
    description: "Payments infrastructure and dashboard design patterns",
    url: "stripe.com",
    href: "https://stripe.com",
    pageTypes: ["Product Page & Landing", "Dashboard"],
    uxPatterns: ["Product Features", "Pricing", "Social Proof"],
    uiElements: ["Cards & Tiles", "Button", "Navigation Bar", "Accordion & Collapse", "Footer", "Icon"],
    colors: [
      { name: "Purple", value: "#635BFF" },
      { name: "Navy", value: "#0A2540" },
      { name: "Cloud", value: "#F6F9FC" },
      { name: "Slate", value: "#425466" },
    ],
    markdown: "# DESIGN.md - Stripe\n\n## Page Types\n- Product Page & Landing\n- Dashboard\n\n## UX Patterns\n- Product Features\n- Pricing\n- Social Proof\n\n## UI Elements\n- Cards & Tiles\n- Button\n- Navigation Bar\n\n## Colors\n- Purple: #635BFF\n- Navy: #0A2540\n- Cloud: #F6F9FC\n",
  },
  {
    id: "linear",
    name: "Linear",
    description: "Issue tracking, product planning, and command-first UI",
    url: "linear.app",
    href: "https://linear.app",
    pageTypes: ["Product Page & Landing", "Product Details"],
    uxPatterns: ["Feature Comparison", "Product Features", "Testimonials"],
    uiElements: ["Cards & Tiles", "Button", "Carousel", "Navigation Bar", "Animation", "Icon"],
    colors: [
      { name: "Indigo", value: "#5E6AD2" },
      { name: "Black", value: "#08090A" },
      { name: "Mist", value: "#F7F8FA" },
      { name: "Gray", value: "#8A8F98" },
    ],
    markdown: "# DESIGN.md - Linear\n\n## Page Types\n- Product Page & Landing\n- Product Details\n\n## UX Patterns\n- Feature Comparison\n- Product Features\n- Testimonials\n\n## UI Elements\n- Cards & Tiles\n- Button\n- Carousel\n\n## Colors\n- Indigo: #5E6AD2\n- Black: #08090A\n- Mist: #F7F8FA\n",
  },
  {
    id: "apple",
    name: "Apple",
    description: "Consumer product storytelling and minimal commerce layout",
    url: "apple.com",
    href: "https://apple.com",
    pageTypes: ["Home Page", "Product Page & Landing"],
    uxPatterns: ["Hero Campaign", "Product Features", "Navigation"],
    uiElements: ["Navigation Bar", "Button", "Cards & Tiles", "Carousel", "Icon", "Footer"],
    colors: [
      { name: "Black", value: "#000000" },
      { name: "Blue", value: "#0071E3" },
      { name: "Cotton", value: "#F5F5F7" },
      { name: "Gray", value: "#6E6E73" },
    ],
    markdown: "# DESIGN.md - Apple\n\n## Page Types\n- Home Page\n- Product Page & Landing\n\n## UX Patterns\n- Hero Campaign\n- Product Features\n- Navigation\n\n## UI Elements\n- Navigation Bar\n- Button\n- Cards & Tiles\n\n## Colors\n- Black: #000000\n- Blue: #0071E3\n- Cotton: #F5F5F7\n",
  },
]

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
