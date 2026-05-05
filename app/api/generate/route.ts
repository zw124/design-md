import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

function normalizeUrl(input: string) {
  if (!input) return '';
  const trimmed = input.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

function extractHexColors(text: string) {
  const matches = text.match(/#[0-9a-fA-F]{3,8}\b/g) || [];
  return matches.map((color) => color.toUpperCase());
}

function extractCssVarColors(html: string) {
  const matches = Array.from(
    html.matchAll(/--(?:color|brand|primary|bg|text|accent)[\w-]*\s*:\s*([^;]+);/gi)
  );
  const colors: string[] = [];
  for (const match of matches) {
    const value = match[1] || '';
    colors.push(...extractHexColors(value));
  }
  return colors;
}

function extractTailwindColors(html: string) {
  const blocks = Array.from(
    html.matchAll(/tailwind\.config\s*=\s*{[\s\S]*?}\s*;?/gi)
  ).map((match) => match[0]);
  const colors: string[] = [];
  for (const block of blocks) {
    colors.push(...extractHexColors(block));
  }
  return colors;
}

function extractThemeColor(html: string) {
  const match = html.match(/<meta[^>]*name=["']theme-color["'][^>]*content=["']([^"']+)["'][^>]*>/i);
  if (!match) return [];
  return extractHexColors(match[1]);
}

function extractTitle(html: string) {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return titleMatch ? titleMatch[1].trim().slice(0, 200) : '';
}

function extractMetaDescription(html: string) {
  const metaMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i);
  return metaMatch ? metaMatch[1].trim().slice(0, 300) : '';
}

function mergeUniqueColors(...groups: string[][]) {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const group of groups) {
    for (const color of group) {
      if (!seen.has(color)) {
        seen.add(color);
        result.push(color);
      }
    }
  }
  return result;
}

function extractStyleTagColors(html: string) {
  const colors: string[] = [];
  const styleBlocks = Array.from(html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi));
  for (const block of styleBlocks) {
    colors.push(...extractAllColorsFromCss(block[1] || ''));
  }
  return colors;
}

function extractAllColorsFromCss(css: string) {
  const hex = css.match(/#[0-9a-fA-F]{3,8}\b/g) || [];
  const rgb = css.match(/rgba?\([^)]+\)/g) || [];
  const hsl = css.match(/hsla?\([^)]+\)/g) || [];
  return [...hex, ...rgb, ...hsl].map((c) => c.toUpperCase());
}

function extractBodyAttributes(html: string) {
  const colors: string[] = [];
  const match = html.match(/<body[^>]*>/i);
  if (match) {
    const tag = match[0];
    const bg = tag.match(/\s(?:bgcolor|background-color)\s*=\s*["']([^"']+)["']/i);
    const text = tag.match(/\stext\s*=\s*["']([^"']+)["']/i);
    if (bg) colors.push(bg[1]);
    if (text) colors.push(text[1]);
  }
  return colors;
}

function extractClassBasedColors(html: string) {
  const tailwindMap: Record<string, Record<string, string>> = {
    slate: { '50':'#f8fafc','100':'#f1f5f9','200':'#e2e8f0','300':'#cbd5e1','400':'#94a3b8','500':'#64748b','600':'#475569','700':'#334155','800':'#1e293b','900':'#0f172a','950':'#020617' },
    gray: { '50':'#f9fafb','100':'#f3f4f6','200':'#e5e7eb','300':'#d1d5db','400':'#9ca3af','500':'#6b7280','600':'#4b5563','700':'#374151','800':'#1f2937','900':'#111827','950':'#030712' },
    zinc: { '50':'#fafafa','100':'#f4f4f5','200':'#e4e4e7','300':'#d4d4d8','400':'#a1a1aa','500':'#71717a','600':'#52525b','700':'#3f3f46','800':'#27272a','900':'#18181b','950':'#09090b' },
    neutral: { '50':'#fafafa','100':'#f5f5f5','200':'#e5e5e5','300':'#d4d4d4','400':'#a3a3a3','500':'#737373','600':'#525252','700':'#404040','800':'#262626','900':'#171717','950':'#0a0a0a' },
    stone: { '50':'#fafaf9','100':'#f5f5f4','200':'#e7e5e4','300':'#d6d3d1','400':'#a8a29e','500':'#78716c','600':'#57534e','700':'#44403c','800':'#292524','900':'#1c1917','950':'#0c0a09' },
    red: { '50':'#fef2f2','100':'#fee2e2','200':'#fecaca','300':'#fca5a5','400':'#f87171','500':'#ef4444','600':'#dc2626','700':'#b91c1c','800':'#991b1b','900':'#7f1d1d','950':'#450a0a' },
    orange: { '50':'#fff7ed','100':'#ffedd5','200':'#fed7aa','300':'#fdba74','400':'#fb923c','500':'#f97316','600':'#ea580c','700':'#c2410c','800':'#9a3412','900':'#7c2d12','950':'#431407' },
    amber: { '50':'#fffbeb','100':'#fef3c7','200':'#fde68a','300':'#fcd34d','400':'#fbbf24','500':'#f59e0b','600':'#d97706','700':'#b45309','800':'#92400e','900':'#78350f','950':'#451a03' },
    yellow: { '50':'#fefce8','100':'#fef9c3','200':'#fef08a','300':'#fde047','400':'#facc15','500':'#eab308','600':'#ca8a04','700':'#a16207','800':'#854d0e','900':'#713f12','950':'#422006' },
    lime: { '50':'#f7fee7','100':'#ecfccb','200':'#d9f99d','300':'#bef264','400':'#a3e635','500':'#84cc16','600':'#65a30d','700':'#4d7c0f','800':'#3f6212','900':'#365314','950':'#1a2e05' },
    green: { '50':'#f0fdf4','100':'#dcfce7','200':'#bbf7d0','300':'#86efac','400':'#4ade80','500':'#22c55e','600':'#16a34a','700':'#15803d','800':'#166534','900':'#14532d','950':'#052e16' },
    emerald: { '50':'#ecfdf5','100':'#d1fae5','200':'#a7f3d0','300':'#6ee7b7','400':'#34d399','500':'#10b981','600':'#059669','700':'#047857','800':'#065f46','900':'#064e3b','950':'#022c22' },
    teal: { '50':'#f0fdfa','100':'#ccfbf1','200':'#99f6e4','300':'#5eead4','400':'#2dd4bf','500':'#14b8a6','600':'#0d9488','700':'#0f766e','800':'#115e59','900':'#134e4a','950':'#042f2e' },
    cyan: { '50':'#ecfeff','100':'#cffafe','200':'#a5f3fc','300':'#67e8f9','400':'#22d3ee','500':'#06b6d4','600':'#0891b2','700':'#0e7490','800':'#155e75','900':'#164e63','950':'#083344' },
    sky: { '50':'#f0f9ff','100':'#e0f2fe','200':'#bae6fd','300':'#7dd3fc','400':'#38bdf8','500':'#0ea5e9','600':'#0284c7','700':'#0369a1','800':'#075985','900':'#0c4a6e','950':'#082f49' },
    blue: { '50':'#eff6ff','100':'#dbeafe','200':'#bfdbfe','300':'#93c5fd','400':'#60a5fa','500':'#3b82f6','600':'#2563eb','700':'#1d4ed8','800':'#1e40af','900':'#1e3a8a','950':'#172554' },
    indigo: { '50':'#eef2ff','100':'#e0e7ff','200':'#c7d2fe','300':'#a5b4fc','400':'#818cf8','500':'#6366f1','600':'#4f46e5','700':'#4338ca','800':'#3730a3','900':'#312e81','950':'#1e1b4b' },
    violet: { '50':'#f5f3ff','100':'#ede9fe','200':'#ddd6fe','300':'#c4b5fd','400':'#a78bfa','500':'#8b5cf6','600':'#7c3aed','700':'#6d28d9','800':'#5b21b6','900':'#4c1d95','950':'#2e1065' },
    purple: { '50':'#faf5ff','100':'#f3e8ff','200':'#e9d5ff','300':'#d8b4fe','400':'#c084fc','500':'#a855f7','600':'#9333ea','700':'#7e22ce','800':'#6b21a8','900':'#581c87','950':'#3b0764' },
    fuchsia: { '50':'#fdf4ff','100':'#fae8ff','200':'#f5d0fe','300':'#f0abfc','400':'#e879f9','500':'#d946ef','600':'#c026d3','700':'#a21caf','800':'#86198f','900':'#701a75','950':'#4a044e' },
    pink: { '50':'#fdf2f8','100':'#fce7f3','200':'#fbcfe8','300':'#f9a8d4','400':'#f472b6','500':'#ec4899','600':'#db2777','700':'#be185d','800':'#9d174d','900':'#831843','950':'#500724' },
    rose: { '50':'#fff1f2','100':'#ffe4e6','200':'#fecdd3','300':'#fda4af','400':'#fb7185','500':'#f43f5e','600':'#e11d48','700':'#be123c','800':'#9f1239','900':'#881337','950':'#4c0519' },
  };
  const colors: string[] = [];
  const classPattern = /\b(?:bg|text|border|ring|shadow|accent|caret|fill|stroke|from|via|to|decoration|outline|divide|placeholder|ring-offset)-([a-z]+)-(\d+|black|white|transparent|current)\b/gi;
  const matches = Array.from(html.matchAll(classPattern));
  for (const m of matches) {
    const family = m[1].toLowerCase();
    const shade = m[2].toLowerCase();
    const map = tailwindMap[family];
    if (map && map[shade]) colors.push(map[shade].toUpperCase());
  }
  return colors;
}

function extractLinkStylesheetUrls(html: string) {
  const matches = Array.from(
    html.matchAll(/<link[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi)
  );
  return matches.map((m) => m[1]).filter(Boolean);
}

function hexToRgb(hex: string) {
  hex = hex.replace('#', '');
  if (hex.length === 3) {
    hex = hex.split('').map((char) => char + char).join('');
  }
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return { r, g, b };
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

function isTransparent(color: string) {
  const lower = color.toLowerCase().trim();
  return lower === 'transparent' || lower === 'none' || lower === 'rgba(0,0,0,0)' || lower === 'rgba(0, 0, 0, 0)';
}

function parseColorToHex(color: string) {
  const trimmed = color.trim();
  if (trimmed.startsWith('#')) {
    const cleaned = trimmed.replace('#', '').toLowerCase();
    if (!/^[0-9a-f]{3}([0-9a-f]{3})?$/.test(cleaned)) return null;
    if (cleaned.length === 3) {
      return `#${cleaned[0]}${cleaned[0]}${cleaned[1]}${cleaned[1]}${cleaned[2]}${cleaned[2]}`.toUpperCase();
    }
    return `#${cleaned}`.toUpperCase();
  }
  const rgbMatch = trimmed.match(/^rgba?\(\s*(\d+)(?:,|\s)+(\d+)(?:,|\s)+(\d+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/i);
  if (rgbMatch) {
    const alpha = rgbMatch[4];
    if (alpha === '0' || alpha === '0%') return null;
    const r = parseInt(rgbMatch[1]);
    const g = parseInt(rgbMatch[2]);
    const b = parseInt(rgbMatch[3]);
    const toHex = (n: number) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
  }
  return null;
}

function extractMicrolinkPalette(payload: any) {
  const screenshot = payload?.data?.screenshot;
  const palette = Array.isArray(screenshot?.palette) ? screenshot.palette : [];
  return [
    screenshot?.background_color,
    screenshot?.color,
    screenshot?.alternative_color,
    ...palette,
  ]
    .filter((color): color is string => typeof color === 'string' && color.length > 0)
    .map((color) => color.toUpperCase());
}

function isSimilarColor(hex1: string, hex2: string) {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  const dr = rgb1.r - rgb2.r;
  const dg = rgb1.g - rgb2.g;
  const db = rgb1.b - rgb2.b;
  const distance = Math.sqrt(dr * dr + dg * dg + db * db);
  return distance < 30;
}

function extractInlineStyleColors(html: string) {
  const matches = Array.from(
    html.matchAll(/style=["']([^"']+)["']/gi)
  );
  const colors: string[] = [];
  for (const match of matches) {
    const style = match[1] || '';
    colors.push(...extractHexColors(style));
    const rgbMatches = style.match(/rgba?\([^)]+\)/g) || [];
    for (const rgb of rgbMatches) {
      colors.push(rgb);
    }
  }
  return colors;
}

type ExtractedColor = {
  hex: string;
  source: 'css-variable' | 'theme-color' | 'inline-style' | 'stylesheet' | 'logo' | 'screenshot';
  role?: 'background' | 'surface' | 'text' | 'muted' | 'accent' | 'brand' | 'neutral';
  name?: string;
  confidence: number;
  frequency?: number;
};

type DesignInsights = {
  aiStatus: 'generated' | 'fallback';
  aiModel: string;
  aiReason: string;
  visualPhilosophy: string;
  personalityKeywords: string;
  targetAudience: string;
  aestheticDirection: string;
  typographyGuidance: string;
  layoutGuidance: string;
  componentGuidance: string;
  motionGuidance: string;
  imageryGuidance: string;
  voiceGuidance: string;
};

const DEFAULT_INSIGHTS: DesignInsights = {
  aiStatus: 'fallback',
  aiModel: 'none',
  aiReason: 'AI analysis was not available, so default guidance was used.',
  visualPhilosophy: 'A restrained, product-led interface that prioritizes clarity, confidence, and direct access to content over decorative complexity.',
  personalityKeywords: 'precise, polished, minimal, accessible, product-focused',
  targetAudience: 'Visitors evaluating products, content, services, or platform information from the source site.',
  aestheticDirection: 'Use clear hierarchy, generous whitespace, high-quality imagery, and a small verified palette.',
  typographyGuidance: 'Use a simple hierarchy with strong headings, readable body copy, and compact supporting labels.',
  layoutGuidance: 'Favor generous whitespace, predictable grids, and section spacing that keeps content easy to scan.',
  componentGuidance: 'Keep components quiet, direct, and consistent with the verified palette.',
  motionGuidance: 'Use short transitions for hover, focus, menus, and page-level movement while respecting reduced motion.',
  imageryGuidance: 'Use crisp product or contextual imagery that directly supports the page goal.',
  voiceGuidance: 'Keep copy concise, direct, and aligned with visual hierarchy.',
};

function getSiteName(targetUrl: string, title: string) {
  if (title && title !== 'Not specified in extracted data') return title;
  try {
    return new URL(targetUrl).hostname.replace(/^www\./, '');
  } catch {
    return targetUrl;
  }
}

function colorToken(color: ExtractedColor, index: number) {
  if (color.role === 'brand' || color.role === 'accent') return index === 0 ? '--color-primary' : `--color-primary-${index + 1}`;
  if (color.role === 'background') return '--color-background';
  if (color.role === 'surface') return '--color-surface';
  if (color.role === 'text') return '--color-text';
  if (color.role === 'muted') return '--color-muted';
  return `--color-neutral-${index + 1}`;
}

function buildColorRows(colors: ExtractedColor[]) {
  if (!colors.length) {
    return '| `--color-primary` | Not detected | Not detected | Not detected | Not detected |';
  }
  return colors
    .map((color, index) => {
      const role = color.role || 'neutral';
      return `| \`${colorToken(color, index)}\` | \`${color.hex}\` | ${color.source} | ${Math.round(color.confidence * 100)}% | ${role} |`;
    })
    .join('\n');
}

function parseInsights(raw: string): DesignInsights {
  try {
    const fenced = raw.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
    const objectMatch = fenced.match(/\{[\s\S]*\}/);
    const cleaned = objectMatch ? objectMatch[0] : fenced;
    const parsed = JSON.parse(cleaned);
    return {
      aiStatus: 'generated',
      aiModel: 'unknown',
      aiReason: 'AI analysis generated successfully.',
      visualPhilosophy: typeof parsed.visualPhilosophy === 'string' ? parsed.visualPhilosophy : DEFAULT_INSIGHTS.visualPhilosophy,
      personalityKeywords: typeof parsed.personalityKeywords === 'string' ? parsed.personalityKeywords : DEFAULT_INSIGHTS.personalityKeywords,
      targetAudience: typeof parsed.targetAudience === 'string' ? parsed.targetAudience : DEFAULT_INSIGHTS.targetAudience,
      aestheticDirection: typeof parsed.aestheticDirection === 'string' ? parsed.aestheticDirection : DEFAULT_INSIGHTS.aestheticDirection,
      typographyGuidance: typeof parsed.typographyGuidance === 'string' ? parsed.typographyGuidance : DEFAULT_INSIGHTS.typographyGuidance,
      layoutGuidance: typeof parsed.layoutGuidance === 'string' ? parsed.layoutGuidance : DEFAULT_INSIGHTS.layoutGuidance,
      componentGuidance: typeof parsed.componentGuidance === 'string' ? parsed.componentGuidance : DEFAULT_INSIGHTS.componentGuidance,
      motionGuidance: typeof parsed.motionGuidance === 'string' ? parsed.motionGuidance : DEFAULT_INSIGHTS.motionGuidance,
      imageryGuidance: typeof parsed.imageryGuidance === 'string' ? parsed.imageryGuidance : DEFAULT_INSIGHTS.imageryGuidance,
      voiceGuidance: typeof parsed.voiceGuidance === 'string' ? parsed.voiceGuidance : DEFAULT_INSIGHTS.voiceGuidance,
    };
  } catch {
    return {
      ...DEFAULT_INSIGHTS,
      aiReason: 'AI returned text that was not valid JSON, so default guidance was used.',
    };
  }
}

async function generateDesignInsights(input: {
  targetUrl: string;
  title: string;
  description: string;
  colors: ExtractedColor[];
}) {
  if (!process.env.OPENAI_API_KEY) {
    return {
      ...DEFAULT_INSIGHTS,
      aiReason: 'OPENAI_API_KEY is missing.',
    };
  }

  const apiUrl = (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
  const isNvidiaApi = apiUrl.includes('nvidia.com');
  const rawModel = process.env.OPENAI_MODEL || 'gpt-4o';
  const model = isNvidiaApi && (rawModel.startsWith('gpt-') || rawModel === 'gpt-4o')
    ? (process.env.NVIDIA_MODEL || 'meta/llama-3.1-70b-instruct')
    : rawModel;

  const colorSummary = input.colors
    .map((color) => `${color.hex} (${color.source}, ${color.role || 'neutral'}, ${Math.round(color.confidence * 100)}%)`)
    .join(', ') || 'None';

  try {
    const response = await fetch(`${apiUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        stream: false,
        temperature: 0.2,
        max_tokens: 900,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: 'Return only compact valid JSON. Do not include markdown. Do not invent color hex values.',
          },
          {
            role: 'user',
            content: `Analyze this website for design-system guidance. URL: ${input.targetUrl}
Title: ${input.title}
Description: ${input.description}
Verified colors: ${colorSummary}

Return JSON with exactly these string keys:
visualPhilosophy, personalityKeywords, targetAudience, aestheticDirection, typographyGuidance, layoutGuidance, componentGuidance, motionGuidance, imageryGuidance, voiceGuidance.
Keep each value concise and specific to the site. Do not include any hex colors except verified colors listed above.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      return {
        ...DEFAULT_INSIGHTS,
        aiModel: model,
        aiReason: `AI request failed with status ${response.status}${errorText ? `: ${errorText.slice(0, 180)}` : ''}`,
      };
    }
    const payload = await response.json();
    const content = payload?.choices?.[0]?.message?.content;
    if (typeof content !== 'string') {
      return {
        ...DEFAULT_INSIGHTS,
        aiModel: model,
        aiReason: 'AI response did not include message content.',
      };
    }
    return {
      ...parseInsights(content),
      aiModel: model,
    };
  } catch (error: any) {
    return {
      ...DEFAULT_INSIGHTS,
      aiModel: model,
      aiReason: `AI request error: ${error?.message || 'unknown error'}`,
    };
  }
}

function buildDesignMarkdown(input: {
  targetUrl: string;
  title: string;
  description: string;
  colors: ExtractedColor[];
  insights: DesignInsights;
}) {
  const siteName = getSiteName(input.targetUrl, input.title);
  const insights = input.insights;
  const primary = input.colors.find((color) => color.role === 'brand' || color.role === 'accent');
  const neutral = input.colors.find((color) => color.role === 'background' || color.role === 'surface' || color.role === 'neutral');
  const text = input.colors.find((color) => color.role === 'text' || color.role === 'muted');
  const primaryHex = primary?.hex ? `\`${primary.hex}\`` : 'Not detected';
  const neutralHex = neutral?.hex ? `\`${neutral.hex}\`` : 'Not detected';
  const textHex = text?.hex ? `\`${text.hex}\`` : 'Not detected';
  const description = input.description && input.description !== 'Not specified in extracted data'
    ? input.description
    : 'No meta description was detected from the fetched page.';

  return `# DESIGN.md - ${siteName}

> Generated by DESIGN.MD for ${input.targetUrl}

## AI Analysis Status

- **Status:** ${insights.aiStatus}
- **Model:** ${insights.aiModel}
- **Reason:** ${insights.aiReason}

## 01. Brand Identity

- **Visual philosophy:** ${insights.visualPhilosophy}
- **Personality keywords:** ${insights.personalityKeywords}
- **Target audience:** ${insights.targetAudience}
- **Aesthetic direction:** ${insights.aestheticDirection}
- **Source description:** ${description}

## 02. Color System

### Verified Colors

Every hex value in this table is source-backed. Values marked as \`screenshot\` come from the captured above-the-fold screenshot palette, not from AI generation.

| Token | Hex | Source | Confidence | Usage |
| --- | --- | --- | --- | --- |
${buildColorRows(input.colors)}

### Required Groups

- **Primary:** ${primaryHex}
- **Neutral:** ${neutralHex}
- **Text / muted:** ${textHex}
- **Semantic success:** Not detected
- **Semantic warning:** Not detected
- **Semantic error:** Not detected
- **Semantic info:** Not detected

### Color Rules

- Do not add extra brand colors unless they are found in a future extraction run.
- Do not create 50-900 scales from the detected colors.
- Do not substitute generic green, yellow, red, or blue semantic colors.
- Use \`Not detected\` when the source site does not expose a semantic role.

## 03. Typography

### Type Scale Recommendation

| Name | Size | Line Height | Weight | Letter Spacing | Usage |
| --- | --- | --- | --- | --- | --- |
| Display | 48px | 56px | 600 | 0 | Primary hero or campaign heading |
| H1 | 40px | 48px | 600 | 0 | Page title |
| H2 | 32px | 40px | 600 | 0 | Major section heading |
| H3 | 24px | 32px | 600 | 0 | Component or content heading |
| Body | 16px | 24px | 400 | 0 | Default paragraph text |
| Body small | 14px | 20px | 400 | 0 | Secondary copy |
| Caption | 12px | 16px | 400 | 0 | Metadata and labels |
| Code | 13px | 20px | 400 | 0 | Token names and technical values |

### Typography Rules

- Minimum readable size: 14px for supporting text and 16px for primary body copy.
- Maximum line length: keep paragraphs around 60-80 characters.
- Heading hierarchy: use one H1 per page, then descend without skipping levels.
- Link styling: preserve clear color contrast and add an underline or visible hover state.
- Site-specific guidance: ${insights.typographyGuidance}

## 04. Spacing & Layout

### Spacing Scale

| Token | Value | Pixels | Use case |
| --- | --- | --- | --- |
| \`--space-1\` | 0.25rem | 4px | Tight gaps |
| \`--space-2\` | 0.5rem | 8px | Icon and label spacing |
| \`--space-3\` | 0.75rem | 12px | Compact controls |
| \`--space-4\` | 1rem | 16px | Default component padding |
| \`--space-6\` | 1.5rem | 24px | Card and section rhythm |
| \`--space-8\` | 2rem | 32px | Major layout separation |
| \`--space-12\` | 3rem | 48px | Page section spacing |
| \`--space-16\` | 4rem | 64px | Large editorial spacing |

### Grid System

- Columns: 4 on mobile, 8 on tablet, 12 on desktop.
- Gutter: 16px on mobile, 24px on larger screens.
- Page margin: 16px mobile, 32px tablet, 48px desktop.
- Max content width: 1200px for broad layout, 760px for reading.
- Breakpoints: 640px, 768px, 1024px, 1280px.
- Site-specific guidance: ${insights.layoutGuidance}

## 05. Elevation & Shadow

| Level | CSS Value | Usage |
| --- | --- | --- |
| 0 | \`none\` | Flat surfaces |
| 1 | \`0 1px 2px rgba(0,0,0,0.08)\` | Subtle cards |
| 2 | \`0 4px 12px rgba(0,0,0,0.12)\` | Hovered cards and menus |
| 3 | \`0 12px 32px rgba(0,0,0,0.16)\` | Dialogs and popovers |

## 06. Component Library

### Buttons

| Variant | Background | Text | Border | Hover | Active | Disabled |
| --- | --- | --- | --- | --- | --- | --- |
| Primary | ${primaryHex} | ${textHex} | transparent | Increase contrast or darken detected primary | Slightly reduce opacity | 50% opacity |
| Secondary | ${neutralHex} | ${textHex} | detected neutral border | Subtle surface shift | Pressed inset state | 50% opacity |
| Ghost | transparent | ${textHex} | transparent | Subtle neutral background | Stronger neutral background | 50% opacity |

### Form Elements

- Input: 40px height, 12-16px horizontal padding, visible border, and a clear focus ring.
- Textarea: same border and focus behavior as input, with a minimum height of 96px.
- Select: match input height and preserve a visible trigger affordance.
- Checkbox and radio: 16-20px control size with a high-contrast checked state.
- Toggle: use a clear on/off thumb position, not color alone.

### Navigation

- Top nav: compact, horizontally scannable, and visually separated from content.
- Mobile nav: collapse into a drawer or menu with large touch targets.
- Active and hover states: use underline, surface change, or verified primary color.
- Breadcrumb: use muted text with the current page in stronger contrast.

### Cards

- Default: neutral surface, clear heading, restrained border, and consistent padding.
- Interactive: add a subtle hover shadow or border emphasis.
- Featured: use verified primary sparingly as an accent, not a full-card wash.

### Feedback Components

- Toast: short message, optional action, and clear close affordance.
- Badge: compact label using neutral styling unless a verified semantic color exists.
- Tooltip: concise helper copy with strong contrast.
- Loading: skeletons should match the target layout dimensions.
- Site-specific guidance: ${insights.componentGuidance}

## 07. Motion & Animation

### Duration Scale

| Name | Duration | Usage |
| --- | --- | --- |
| Fast | 100ms | Small hover states |
| Normal | 200ms | Buttons, menus, focus transitions |
| Slow | 300ms | Drawers and larger UI movement |
| Slower | 500ms | Page-level transitions |

### Easing Functions

| Name | CSS Value | Usage |
| --- | --- | --- |
| Ease out | \`cubic-bezier(0, 0, 0.2, 1)\` | Elements entering |
| Ease in | \`cubic-bezier(0.4, 0, 1, 1)\` | Elements leaving |
| Standard | \`cubic-bezier(0.2, 0, 0, 1)\` | General UI motion |

### Animation Principles

- Animate opacity, transform, and small surface changes.
- Avoid animating layout dimensions when it causes content jumps.
- Respect reduced motion preferences.
- Keep page transitions fast and purposeful.
- Site-specific guidance: ${insights.motionGuidance}

## 08. Iconography

- Icon style: simple line icons or product-native icons.
- Size scale: 16px, 20px, 24px, and 32px.
- Stroke width: 1.5-2px for interface icons.
- Icon and label spacing: 6-8px for compact controls.

## 09. Imagery & Media

- Photography: use crisp product or contextual imagery that directly supports the page goal.
- Illustration: keep visual language consistent with the verified palette.
- Aspect ratios: use 16:9, 4:3, 1:1, and device-specific crops where appropriate.
- Loading: reserve image dimensions to prevent layout shift.
- Site-specific guidance: ${insights.imageryGuidance}

## 10. Voice & Tone in Design

- Copy/design relationship: copy should be concise, direct, and aligned with visual hierarchy.
- Capitalization: prefer sentence case for UI labels and buttons.
- Button labels: use short verb-led labels.
- Error tone: be specific, actionable, and calm.
- Site-specific guidance: ${insights.voiceGuidance}

## 11. Accessibility Standards

- Color contrast: target WCAG AA, with 4.5:1 for body text.
- Focus indicator: always visible and not color-only.
- Touch target: minimum 44px for primary interactive controls.
- Screen reader: use semantic landmarks and descriptive labels.

## 12. Implementation Notes

- CSS approach: expose verified colors as CSS custom properties.
- Naming: keep tokens semantic and stable, such as \`--color-primary\` and \`--color-surface\`.
- Token format: maintain CSS variables first, then export JSON if needed.
- Figma structure: separate foundations, components, and page patterns.
`;
}

function sseEvent(event: string, payload: unknown) {
  return `event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`;
}

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const targetUrl = normalizeUrl(prompt);

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        let isClosed = false;

        const safeClose = () => {
          if (!isClosed) {
            isClosed = true;
            controller.close();
          }
        };

        try {
          let extracted = {
            title: '',
            description: '',
            themeColors: [] as string[],
            cssVarColors: [] as string[],
            tailwindColors: [] as string[],
            inlineColors: [] as string[],
            styleColors: [] as string[],
            bodyColors: [] as string[],
            classColors: [] as string[],
            logoColors: [] as string[],
            screenshotColors: [] as string[],
            logoUrl: '',
            actualColors: [] as ExtractedColor[],
          };
          try {
            const htmlController = new AbortController();
            const timeoutId = setTimeout(() => htmlController.abort(), 3000);
            const pageResponse = await fetch(targetUrl, {
              method: 'GET',
              signal: htmlController.signal,
              headers: {
                'User-Agent': 'DESIGN.MD/1.0',
                'Accept': 'text/html,application/xhtml+xml',
              },
            });
            clearTimeout(timeoutId);

            if (!pageResponse.ok) {
              throw new Error(`Page fetch failed with status ${pageResponse.status}`);
            }

            const html = await pageResponse.text();
            extracted.title = extractTitle(html);
            extracted.description = extractMetaDescription(html);
            extracted.cssVarColors = extractCssVarColors(html);
            extracted.tailwindColors = extractTailwindColors(html);
            extracted.themeColors = extractThemeColor(html);
            extracted.inlineColors = extractInlineStyleColors(html);
            extracted.styleColors = extractStyleTagColors(html);
            extracted.bodyColors = extractBodyAttributes(html);
            extracted.classColors = extractClassBasedColors(html);

            // Fetch external stylesheets for additional colors
            const stylesheetUrls = extractLinkStylesheetUrls(html);
            const cssPromises = stylesheetUrls.slice(0, 3).map(async (sheetUrl) => {
              try {
                const absoluteUrl = new URL(sheetUrl, targetUrl).href;
                const cssController = new AbortController();
                const cssTimeout = setTimeout(() => cssController.abort(), 2000);
                const sheetRes = await fetch(absoluteUrl, {
                  method: 'GET',
                  signal: cssController.signal,
                  headers: {
                    'User-Agent': 'DESIGN.MD/1.0',
                    'Accept': 'text/css,*/*',
                  },
                });
                clearTimeout(cssTimeout);
                if (sheetRes.ok) {
                  const cssText = await sheetRes.text();
                  return extractAllColorsFromCss(cssText);
                }
              } catch {
                // ignore stylesheet fetch errors
              }
              return [];
            });
            const sheetColors = (await Promise.all(cssPromises)).flat();
            extracted.styleColors = mergeUniqueColors(extracted.styleColors, sheetColors);

            const logoController = new AbortController();
            const logoTimeoutId = setTimeout(() => logoController.abort(), 3000);
            const previewResponse = await fetch(
              `https://api.microlink.io/?url=${encodeURIComponent(targetUrl)}&screenshot=true&palette=true&meta=false&embed=logo.url`,
              {
                method: 'GET',
                signal: logoController.signal,
              }
            );
            clearTimeout(logoTimeoutId);

            if (previewResponse.ok) {
              const previewPayload = await previewResponse.json();
              extracted.screenshotColors = extractMicrolinkPalette(previewPayload);
              const logoUrl = previewPayload?.data?.logo?.url || '';
              extracted.logoUrl = logoUrl;

              if (logoUrl) {
                const logoPaletteResponse = await fetch(
                  `https://api.microlink.io/?url=${encodeURIComponent(logoUrl)}&palette=true&meta=false`,
                  { method: 'GET' }
                );
                if (logoPaletteResponse.ok) {
                  const logoPalettePayload = await logoPaletteResponse.json();
                  const logoPalette = Array.isArray(logoPalettePayload?.data?.palette)
                    ? logoPalettePayload.data.palette
                        .map((entry: { hex?: string }) => entry?.hex)
                        .filter(Boolean)
                    : [];
                  extracted.logoColors = logoPalette.map((c: string) => c.toUpperCase());
                }
              }
            }

            const collected: ExtractedColor[] = [];
            const addColors = (colors: string[], source: ExtractedColor['source'], confidence: number) => {
              for (const color of colors) {
                if (!color || isTransparent(color)) continue;
                const hex = parseColorToHex(color);
                if (!hex) continue;
                collected.push({ hex, source, confidence });
              }
            };

            addColors(extracted.cssVarColors, 'css-variable', 0.9);
            addColors(extracted.tailwindColors, 'stylesheet', 0.7);
            addColors(extracted.themeColors, 'theme-color', 0.85);
            addColors(extracted.inlineColors, 'inline-style', 0.6);
            addColors(extracted.styleColors, 'stylesheet', 0.65);
            addColors(extracted.bodyColors, 'inline-style', 0.7);
            addColors(extracted.classColors, 'stylesheet', 0.5);
            addColors(extracted.logoColors, 'logo', 0.4);
            addColors(extracted.screenshotColors, 'screenshot', 0.75);

            const byHex = new Map<string, ExtractedColor>();
            for (const entry of collected) {
              const existing = Array.from(byHex.values()).find((item) => isSimilarColor(item.hex, entry.hex));
              if (existing) {
                existing.confidence = Math.max(existing.confidence, entry.confidence);
                existing.frequency = (existing.frequency || 1) + 1;
              } else {
                byHex.set(entry.hex, { ...entry, frequency: 1 });
              }
            }

            const withRoles = Array.from(byHex.values()).map((entry) => {
              const { r, g, b } = hexToRgb(entry.hex);
              const { s, l } = rgbToHsl(r, g, b);
              let role: ExtractedColor['role'] = 'neutral';
              if (l > 85) role = 'background';
              else if (l > 70) role = 'surface';
              else if (l < 18) role = 'text';
              else if (s > 35) role = 'brand';
              else if (l < 35) role = 'muted';
              return { ...entry, role };
            });

            extracted.actualColors = withRoles
              .filter((entry) => entry.confidence >= 0.4)
              .sort((a, b) => (b.confidence - a.confidence) || ((b.frequency || 0) - (a.frequency || 0)))
              .slice(0, 10);
          } catch (error) {
            try {
              const fallbackResponse = await fetch(
                `https://api.microlink.io/?url=${encodeURIComponent(targetUrl)}&screenshot=true&palette=true&meta=false`,
                { method: 'GET' }
              );
              if (fallbackResponse.ok) {
                const fallbackPayload = await fallbackResponse.json();
                extracted.screenshotColors = extractMicrolinkPalette(fallbackPayload);
                extracted.actualColors = extracted.screenshotColors
                  .map((color): ExtractedColor | null => {
                    const hex = parseColorToHex(color);
                    if (!hex || isTransparent(hex)) return null;
                    const { r, g, b } = hexToRgb(hex);
                    const { s, l } = rgbToHsl(r, g, b);
                    let role: ExtractedColor['role'] = 'neutral';
                    if (l > 85) role = 'background';
                    else if (l > 70) role = 'surface';
                    else if (l < 18) role = 'text';
                    else if (s > 35) role = 'brand';
                    else if (l < 35) role = 'muted';
                    return { hex, source: 'screenshot', confidence: 0.75, role, frequency: 1 };
                  })
                  .filter((entry): entry is ExtractedColor => Boolean(entry))
                  .slice(0, 10);
              }
            } catch {
              // Continue with an empty verified color set when all extraction methods fail.
            }
          }

          const titleValue = extracted.title || 'Not specified in extracted data';
          const descriptionValue = extracted.description || 'Not specified in extracted data';
          const insights = await generateDesignInsights({
            targetUrl,
            title: titleValue,
            description: descriptionValue,
            colors: extracted.actualColors,
          });

          const colorsPayload = {
            actualColors: extracted.actualColors,
          };

          controller.enqueue(encoder.encode(sseEvent('colors', colorsPayload)));
          const markdown = buildDesignMarkdown({
            targetUrl,
            title: titleValue,
            description: descriptionValue,
            colors: extracted.actualColors,
            insights,
          });
          controller.enqueue(encoder.encode(sseEvent('markdown', { content: markdown })));

          safeClose();
        } catch (error) {
          console.error('Streaming error:', error);
          if (!isClosed) {
            controller.error(error);
          }
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to generate model' },
      { status: 500 }
    );
  }
}
