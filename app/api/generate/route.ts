import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getOrCreateSessionUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { generations } from '@/lib/db/schema';

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
  dos: string[];
  donts: string[];
  agentRules: string[];
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
  dos: [
    'Use the verified primary color for one dominant action per viewport.',
    'Keep body text at 16px with a 24px line height for readable passages.',
    'Use 24px spacing between related content groups.',
    'Keep navigation height between 56px and 72px.',
    'Use a 44px minimum touch target for interactive controls.',
    'Use neutral surfaces for cards and reserve brand colors for actions.',
    'Apply 8px border radius to compact controls.',
    'Use 1200px as the maximum content container for wide layouts.',
    'Use 200ms transitions for hover and focus states.',
    'Preserve visible focus rings with a 2px outline or box shadow.',
  ],
  donts: [
    'Do not invent colors that were not found in extraction.',
    'Do not generate synthetic 50-900 color scales from one color.',
    'Do not use more than one primary action in the same compact area.',
    'Do not reduce body text below 14px.',
    'Do not hide focus states.',
    'Do not animate layout width or height when opacity or transform works.',
    'Do not use low-contrast text over image or glass surfaces.',
    'Do not use decorative gradients unless they are visible on the source site.',
    'Do not stack cards inside cards.',
    'Do not rely on color alone to show status.',
  ],
  agentRules: [
    'Start with the verified primary, neutral, text, surface, and border tokens before writing components.',
    'Set the page max width to 1200px and center content with 24px mobile padding.',
    'Use one H1 per page at 40px desktop and 32px mobile.',
    'Use 44px minimum height for buttons and inputs.',
    'Use 8px radius for buttons, inputs, and cards unless the source site shows sharper corners.',
    'Use rgba borders at 12% opacity for subtle separation.',
    'Use 200ms ease-out transitions on hover and focus.',
    'Use verified colors only; mark unknown semantic colors as not detected.',
    'Collapse navigation into a menu below 768px.',
    'Verify body text contrast against WCAG AA before shipping.',
  ],
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

function clampChannel(value: number) {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function shiftHex(hex: string, amount: number) {
  const { r, g, b } = hexToRgb(hex);
  const shift = (channel: number) => clampChannel(channel + amount).toString(16).padStart(2, '0');
  return `#${shift(r)}${shift(g)}${shift(b)}`.toUpperCase();
}

function hexToRgbaValue(hex: string, alpha: number) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function colorValue(color: ExtractedColor | undefined, fallback: string) {
  return color?.hex || fallback;
}

function listItems(items: string[]) {
  return items.map((item, index) => `${index + 1}. ${item}`).join('\n');
}

function colorFrequency(color: ExtractedColor | undefined) {
  if (!color) return '0 sightings';
  return `${color.frequency || 1} extraction sighting${(color.frequency || 1) === 1 ? '' : 's'}`;
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
      dos: Array.isArray(parsed.dos) ? parsed.dos.filter((item: unknown) => typeof item === 'string').slice(0, 10) : DEFAULT_INSIGHTS.dos,
      donts: Array.isArray(parsed.donts) ? parsed.donts.filter((item: unknown) => typeof item === 'string').slice(0, 10) : DEFAULT_INSIGHTS.donts,
      agentRules: Array.isArray(parsed.agentRules) ? parsed.agentRules.filter((item: unknown) => typeof item === 'string').slice(0, 10) : DEFAULT_INSIGHTS.agentRules,
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
            content: 'Return only valid JSON. Do not include markdown. Use concrete values. Do not invent color hex values outside the verified color list; when a value is not directly known, derive rgba only from verified colors and label semantic colors as not detected.',
          },
          {
            role: 'user',
            content: `Analyze this website for a production DESIGN.md design-system document. URL: ${input.targetUrl}
Title: ${input.title}
Description: ${input.description}
Verified colors: ${colorSummary}

Return JSON with exactly these string keys:
visualPhilosophy, personalityKeywords, targetAudience, aestheticDirection, typographyGuidance, layoutGuidance, componentGuidance, motionGuidance, imageryGuidance, voiceGuidance.
Also return these array keys with exactly 10 strings each: dos, donts, agentRules.

The final document will contain ALL of these sections, so make your values specific enough for them:
1. Brand Identity: visual philosophy, keywords, audience.
2. Color System: exact hex values, rgba values, usage frequency, primary hover/active/pressed states, neutral scale, surface/border rgba, and frosted-glass navigation rgba.
3. Typography: full role table for Display, H1, H2, H3, Body, Body Small, Caption, Code, Button, Link, Eyebrow with font family, size, weight, line height, letter spacing, and usage notes.
4. Component Stylings: exact CSS values for Buttons, Cards, Navigation, and Inputs.
5. Layout Principles: spacing scale with px values, max container width, grid columns.
6. Depth & Elevation: exact box-shadow CSS values for levels 0-4.
7. Do's and Don'ts: 10 specific do's and 10 specific don'ts based on the actual site's patterns.
8. Responsive Behavior: breakpoint table, touch targets, collapsing strategy for nav/grid/typography/spacing.
9. Agent Prompt Guide: quick color reference table and 10 implementation rules.

The rendered markdown must be at least 1500 words and must use concrete pixel values, hex codes, and rgba values throughout. No vague descriptions. Do not include any hex colors except verified colors listed above.`,
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
  const surface = input.colors.find((color) => color.role === 'surface') || neutral;
  const muted = input.colors.find((color) => color.role === 'muted') || text;
  const primaryHex = colorValue(primary, '#2563EB');
  const neutralHex = colorValue(neutral, '#F5F5F5');
  const textHex = colorValue(text, '#111111');
  const surfaceHex = colorValue(surface, '#FFFFFF');
  const mutedHex = colorValue(muted, '#666666');
  const borderRgba = hexToRgbaValue(textHex, 0.14);
  const navRgba = hexToRgbaValue(surfaceHex, 0.72);
  const primaryHover = shiftHex(primaryHex, -18);
  const primaryActive = shiftHex(primaryHex, -32);
  const primaryPressed = shiftHex(primaryHex, -46);
  const colorReferenceRows = input.colors.length
    ? input.colors.map((color, index) => `| ${colorToken(color, index)} | \`${color.hex}\` | \`${hexToRgbaValue(color.hex, 1)}\` | ${color.source} | ${colorFrequency(color)} | ${color.role || 'neutral'} |`).join('\n')
    : `| --color-primary | \`${primaryHex}\` | \`${hexToRgbaValue(primaryHex, 1)}\` | fallback | 0 sightings | primary |`;
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

### Verified Color Inventory

Every hex value in this table is source-backed from HTML, CSS, inline style, logo, or screenshot extraction. RGBA values are deterministic conversions from those verified hex values, not invented AI colors.

| Token | Hex | RGBA | Source | Frequency | Usage |
| --- | --- | --- | --- | --- | --- |
${colorReferenceRows}

### Primary Colors

- Primary base: \`${primaryHex}\`; use for the main CTA, selected nav item, active link underline, and any single highest-priority action in a viewport. Frequency: ${colorFrequency(primary)}.
- Primary hover: \`${primaryHover}\`; use on mouse hover for buttons and links with a 200ms \`ease-out\` transition.
- Primary active: \`${primaryActive}\`; use while pressing buttons and controls.
- Primary pressed: \`${primaryPressed}\`; use for toggled selected states where the component remains active after click.
- Primary subtle surface: \`${hexToRgbaValue(primaryHex, 0.10)}\`; use behind selected pills, soft badges, and lightweight focus backgrounds.
- Primary focus ring: \`0 0 0 3px ${hexToRgbaValue(primaryHex, 0.28)}\`; apply to buttons, links, inputs, and menu items.

### Neutral, Surface, Border, and Navigation Colors

- Text dominant: \`${textHex}\`; use for H1, H2, button labels, and primary body text. RGBA: \`${hexToRgbaValue(textHex, 1)}\`.
- Text secondary: \`${hexToRgbaValue(textHex, 0.72)}\`; use for descriptions, helper copy, and secondary nav links.
- Text tertiary: \`${hexToRgbaValue(textHex, 0.52)}\`; use for timestamps, captions, disabled labels, and metadata.
- Muted neutral: \`${mutedHex}\`; use for low-emphasis labels when this color is verified. RGBA: \`${hexToRgbaValue(mutedHex, 1)}\`.
- Page background: \`${neutralHex}\`; use as the dominant page canvas.
- Surface base: \`${surfaceHex}\`; use for cards, input fields, menus, and sticky panels.
- Surface translucent: \`${hexToRgbaValue(surfaceHex, 0.86)}\`; use for overlays where the background context should remain visible.
- Border default: \`${borderRgba}\`; use for card outlines, input borders, dividers, and nav separators.
- Border strong: \`${hexToRgbaValue(textHex, 0.24)}\`; use for active cards, focused inputs, and selected filter chips.
- Navigation frosted glass: \`${navRgba}\` with \`backdrop-filter: blur(18px) saturate(160%)\`; use on sticky top navigation.
- Navigation bottom border: \`1px solid ${hexToRgbaValue(textHex, 0.10)}\`.
- Semantic success: Not detected. Do not substitute generic green unless the source site exposes one.
- Semantic warning: Not detected. Do not substitute generic yellow unless the source site exposes one.
- Semantic error: Not detected. Do not substitute generic red unless the source site exposes one.
- Semantic info: Not detected. Use \`${primaryHex}\` only if the source design uses primary color for informational states.

## 03. Typography

Use the source site's visible system direction: ${insights.typographyGuidance}. When the exact font file cannot be confirmed from extraction, use a native system stack that preserves metrics and renders consistently.

| Role | Font Family | Size | Weight | Line Height | Letter Spacing | Usage notes |
| --- | --- | --- | --- | --- | --- | --- |
| Display | \`-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif\` | 56px desktop / 40px mobile | 700 | 64px / 48px | 0 | Use only for first-screen hero claims. Keep max width under 900px. |
| H1 | \`-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif\` | 44px desktop / 34px mobile | 650 | 52px / 42px | 0 | Page-level heading below the hero or detail page title. |
| H2 | \`-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif\` | 32px | 650 | 40px | 0 | Major section heading with 32px margin-bottom. |
| H3 | \`-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif\` | 24px | 600 | 32px | 0 | Card title, feature heading, or grouped panel title. |
| Body | \`-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif\` | 16px | 400 | 24px | 0 | Default paragraphs and readable explanatory copy. |
| Body Small | \`-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif\` | 14px | 400 | 20px | 0 | Secondary text, compact list descriptions, helper text. |
| Caption | \`-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif\` | 12px | 500 | 16px | 0.02em | Metadata, timestamps, small labels, and legal copy. |
| Code | \`"SFMono-Regular", Consolas, "Liberation Mono", monospace\` | 13px | 400 | 20px | 0 | Token names, CSS snippets, URLs, and generated values. |
| Button | \`-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif\` | 14px | 600 | 20px | 0 | Primary and secondary action labels. |
| Link | \`-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif\` | 14px | 500 | 20px | 0 | Navigation links and inline actions. |
| Eyebrow | \`"SFMono-Regular", Consolas, "Liberation Mono", monospace\` | 12px | 600 | 16px | 0.08em | Uppercase or compact pre-heading labels. |

## 04. Component Stylings

### Buttons

| Component | Background | Text | Font | Padding | Radius | Border | Shadow | Hover | Active | Height |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Primary Button | \`${primaryHex}\` | \`${surfaceHex}\` | 14px / 600 / 20px | 0 18px | 8px | 1px solid transparent | \`0 1px 2px ${hexToRgbaValue(textHex, 0.14)}\` | \`${primaryHover}\`, transform translateY(-1px) | \`${primaryActive}\`, transform translateY(0) | 44px |
| Secondary Button | \`${surfaceHex}\` | \`${textHex}\` | 14px / 600 / 20px | 0 18px | 8px | \`1px solid ${borderRgba}\` | \`0 1px 2px ${hexToRgbaValue(textHex, 0.08)}\` | \`${hexToRgbaValue(textHex, 0.04)}\` overlay | \`${hexToRgbaValue(textHex, 0.08)}\` overlay | 44px |
| Ghost Button | transparent | \`${textHex}\` | 14px / 600 / 20px | 0 14px | 8px | 1px solid transparent | none | \`${hexToRgbaValue(textHex, 0.06)}\` background | \`${hexToRgbaValue(textHex, 0.10)}\` background | 40px |

### Cards

| Component | Background | Text | Padding | Radius | Border | Shadow | Hover | Active | Height |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hero Card | \`${surfaceHex}\` | \`${textHex}\` | 40px desktop / 24px mobile | 12px | \`1px solid ${borderRgba}\` | \`0 20px 60px ${hexToRgbaValue(textHex, 0.14)}\` | none | none | auto, min-height 360px |
| Feature Card | \`${surfaceHex}\` | \`${textHex}\` | 24px | 10px | \`1px solid ${borderRgba}\` | \`0 4px 16px ${hexToRgbaValue(textHex, 0.08)}\` | border \`${hexToRgbaValue(textHex, 0.22)}\`, translateY(-2px) | translateY(0) | min-height 180px |
| Label Card | \`${hexToRgbaValue(primaryHex, 0.10)}\` | \`${textHex}\` | 6px 10px | 999px | \`1px solid ${hexToRgbaValue(primaryHex, 0.22)}\` | none | background \`${hexToRgbaValue(primaryHex, 0.14)}\` | background \`${hexToRgbaValue(primaryHex, 0.18)}\` | 28px |

### Navigation

- Height: 64px desktop, 56px mobile.
- Background: \`${navRgba}\`.
- Backdrop: \`backdrop-filter: blur(18px) saturate(160%)\`.
- Padding: 24px desktop horizontal, 16px mobile horizontal.
- Border: \`1px solid ${hexToRgbaValue(textHex, 0.10)}\` on the bottom edge.
- Link hover: color \`${textHex}\`, background \`${hexToRgbaValue(textHex, 0.06)}\`, radius 8px, transition 200ms.
- Active nav item: color \`${primaryHex}\`, underline height 2px, underline color \`${primaryHex}\`.

### Inputs

- Height: 44px for URL and text fields.
- Padding: 0 14px for single-line fields; 14px for textarea.
- Border: \`1px solid ${borderRgba}\`.
- Border radius: 8px.
- Background: \`${surfaceHex}\`.
- Text: \`${textHex}\`.
- Placeholder: \`${hexToRgbaValue(textHex, 0.46)}\`.
- Focus border: \`${primaryHex}\`.
- Focus ring: \`0 0 0 3px ${hexToRgbaValue(primaryHex, 0.24)}\`.
- Disabled state: opacity 0.5 and cursor not-allowed.
- Component guidance: ${insights.componentGuidance}

## 05. Layout Principles

| Token | Pixels | Usage context |
| --- | --- | --- |
| \`--space-1\` | 4px | Icon nudges, hairline gaps, dense metadata |
| \`--space-2\` | 8px | Button icon gap, compact chip padding, inline controls |
| \`--space-3\` | 12px | Form group spacing, card internal row gap |
| \`--space-4\` | 16px | Mobile page padding, input padding, default stack gap |
| \`--space-5\` | 20px | Compact section rhythm and card header spacing |
| \`--space-6\` | 24px | Desktop card padding and two-column gutter |
| \`--space-8\` | 32px | Section header to content, major panel spacing |
| \`--space-10\` | 40px | Hero card padding and dashboard band spacing |
| \`--space-12\` | 48px | Section-to-section spacing on desktop |
| \`--space-16\` | 64px | Large landing sections and first viewport rhythm |

- Max container width: 1200px for product pages, 960px for generation forms, and 760px for long reading text.
- Grid columns: 4 columns below 640px, 8 columns from 768px, 12 columns from 1024px.
- Grid gutter: 16px mobile, 24px tablet, 32px desktop.
- Page margin: 16px mobile, 24px tablet, 48px desktop.
- Layout guidance: ${insights.layoutGuidance}

## 06. Depth & Elevation

| Level | Box shadow CSS | Usage |
| --- | --- | --- |
| 0 | \`none\` | Flat page background and disabled elements |
| 1 | \`0 1px 2px ${hexToRgbaValue(textHex, 0.08)}\` | Buttons, chips, low emphasis controls |
| 2 | \`0 4px 12px ${hexToRgbaValue(textHex, 0.10)}\` | Cards, dropdown menus, sticky nav edge |
| 3 | \`0 12px 32px ${hexToRgbaValue(textHex, 0.14)}\` | Dialogs, popovers, floating preview panels |
| 4 | \`0 24px 80px ${hexToRgbaValue(textHex, 0.18)}\` | High-priority modal, command palette, full-screen generated result |

## 07. Do's and Don'ts

### Do

${listItems(insights.dos)}

### Don't

${listItems(insights.donts)}

## 08. Responsive Behavior

| Breakpoint | Width | Typography | Grid | Navigation | Spacing | Touch target |
| --- | --- | --- | --- | --- | --- | --- |
| Mobile | 0-639px | Display 40px, H1 34px, body 16px | 4 columns | Collapse links into menu button | 16px page padding, 32px section gap | 44px minimum |
| Tablet | 640-1023px | Display 48px, H1 38px, body 16px | 8 columns | Show key links, hide secondary actions | 24px page padding, 40px section gap | 44px minimum |
| Desktop | 1024-1279px | Display 56px, H1 44px, body 16px | 12 columns | Full horizontal navigation | 32px gutters, 48px section gap | 40px minimum for dense nav |
| Wide | 1280px+ | Display 64px max, H1 48px max | 12 columns in 1200px container | Full nav with account/action area | 48px page margin, 64px section gap | 44px for primary actions |

- Nav collapsing strategy: below 768px, hide secondary links, keep logo left and a 44px menu or login action right.
- Grid collapsing strategy: 3-column feature grids become 2 columns at 768px and 1 column below 640px.
- Typography collapsing strategy: reduce display size by 16px on mobile, keep body text at 16px, never use negative letter spacing.
- Spacing collapsing strategy: reduce section padding from 64px desktop to 32px mobile, but keep component internal padding above 12px.
- Motion behavior: keep hover transitions at 200ms desktop; remove transform movement when \`prefers-reduced-motion: reduce\` is enabled.

## 09. Agent Prompt Guide

### Quick Color Reference

| Role | Value | RGBA | Implementation note |
| --- | --- | --- | --- |
| Primary | \`${primaryHex}\` | \`${hexToRgbaValue(primaryHex, 1)}\` | Main CTA, active underline, selected state |
| Primary hover | \`${primaryHover}\` | \`${hexToRgbaValue(primaryHover, 1)}\` | Button hover and link hover |
| Primary active | \`${primaryActive}\` | \`${hexToRgbaValue(primaryActive, 1)}\` | Pressed state |
| Text dominant | \`${textHex}\` | \`${hexToRgbaValue(textHex, 1)}\` | H1, H2, body, button text when on light surface |
| Text secondary | \`${textHex}\` | \`${hexToRgbaValue(textHex, 0.72)}\` | Descriptions and muted navigation |
| Surface | \`${surfaceHex}\` | \`${hexToRgbaValue(surfaceHex, 1)}\` | Cards, inputs, menus |
| Border | \`${textHex}\` | \`${borderRgba}\` | Dividers, card borders, input borders |
| Navigation glass | \`${surfaceHex}\` | \`${navRgba}\` | Sticky frosted navigation |

### Implementation Rules

${listItems(insights.agentRules)}

Use this prompt when asking an AI agent to recreate the system: "Build a responsive interface for ${siteName} using \`${primaryHex}\` as the only primary color, \`${textHex}\` as dominant text, \`${surfaceHex}\` as the component surface, \`${borderRgba}\` as the default border, 44px minimum controls, 8px radius, 1200px max container, 12-column desktop grid, 16px mobile page padding, and the exact typography table above. Do not invent semantic colors. Use not detected when a source color is missing."
`;
}

function sseEvent(event: string, payload: unknown) {
  return `event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`;
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const appUser = session?.user?.email
      ? await getOrCreateSessionUser(session).catch((error) => {
          console.warn('Signed-in user lookup failed; continuing anonymously:', error);
          return null;
        })
      : null;

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

          if (appUser) {
          try {
            await db.insert(generations).values({
              userId: appUser.id,
              url: targetUrl,
              markdown,
              colors: extracted.actualColors.map((color) => ({
                hex: color.hex,
                source: color.source,
                role: color.role,
                confidence: color.confidence,
              })),
              aiStatus: insights.aiStatus,
              aiModel: insights.aiModel,
            });
          } catch (saveError) {
            console.warn('Generation completed but history save failed:', saveError);
          }
          }

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
