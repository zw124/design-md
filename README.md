# DESIGN.MD

DESIGN.MD is a Next.js app that turns a live website URL into a clean `DESIGN.md` design-system document.

The app combines deterministic Markdown generation with AI-written site guidance. Code owns the document structure and verified color table, so output stays readable and valid. AI only supplies structured analysis text.

## Features

- URL input with quick examples.
- Full-screen result view after generation.
- AI analysis status and site-specific guidance.
- Source-backed color extraction from HTML, CSS, logo data, and screenshot palette.
- Clean `DESIGN.md` rendering with Markdown tables, headings, and lists.
- Above-the-fold screenshot preview.
- Copy and download `.md` actions.
- Responsive layout for desktop and mobile.

## Tech Stack

- Next.js 16 App Router
- React 19
- Tailwind CSS 4
- OpenAI-compatible chat completions API
- Microlink screenshot and palette API

## Requirements

- Node.js 20+
- pnpm
- An OpenAI-compatible API key

## Environment Variables

Create `.env` in the project root. Use `.env.example` as a template.

```bash
OPENAI_API_KEY=your_provider_key_here
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o
```

Groq example:

```bash
OPENAI_API_KEY=gsk-...
OPENAI_BASE_URL=https://api.groq.com/openai/v1
OPENAI_MODEL=llama-3.3-70b-versatile
```

`.env` is ignored by git. Do not commit provider keys.

## Local Development

```bash
pnpm install
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production Build

```bash
pnpm run build
pnpm run start
```

## How Generation Works

1. The client sends `POST /api/generate` with `{ "prompt": "https://example.com" }`.
2. The server fetches page HTML and stylesheets.
3. The server extracts verified colors from CSS variables, inline styles, theme color, Tailwind classes, logo palette, and screenshot palette.
4. The server asks the AI for compact JSON design guidance only.
5. The server builds the final `DESIGN.md` from a deterministic Markdown template.
6. The API streams two SSE events:
   - `colors`: extracted colors for the right-side palette UI.
   - `markdown`: final Markdown content for the left pane.

## Important Design Choice

The AI does not directly write the full Markdown file. That prevents malformed headings, broken tables, invented colors, and compressed output. The app uses AI for analysis, then inserts that analysis into a code-owned Markdown template.

## Scripts

```bash
pnpm run dev
pnpm run build
pnpm run start
```

## Current Scope

This is a single-purpose generator site. Pricing, account history, team billing, and persistent dashboards are intentionally not exposed in the public UI.
