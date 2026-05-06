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
- Clerk authentication
- Lemon Squeezy checkout and webhooks are scaffolded but currently disabled
- Neon Postgres with Drizzle ORM
- Microlink screenshot and palette API

## Requirements

- Node.js 20+
- pnpm
- An OpenAI-compatible API key
- Clerk application keys
- Neon Postgres database URL
- Lemon Squeezy keys are optional while billing is disabled

## Environment Variables

Create `.env` in the project root. Use `.env.example` as a template.

```bash
OPENAI_API_KEY=your_provider_key_here
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o

NEXT_PUBLIC_APP_URL=http://localhost:3000

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key

DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# Optional: billing is currently disabled in /api/billing/checkout
# LEMONSQUEEZY_API_KEY=your_lemon_squeezy_api_key
# LEMONSQUEEZY_STORE_ID=your_store_id
# LEMONSQUEEZY_PRO_VARIANT_ID=your_pro_variant_id
# LEMONSQUEEZY_TEAM_VARIANT_ID=your_team_variant_id
# LEMONSQUEEZY_WEBHOOK_SECRET=your_webhook_secret
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
pnpm drizzle-kit push
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production Build

```bash
pnpm run build
pnpm run start
```

## Vercel Deployment

1. Create a Neon database and copy its pooled connection string into `DATABASE_URL`.
2. Add all environment variables from `.env.example` to Vercel Project Settings.
3. Set `NEXT_PUBLIC_APP_URL` to the deployed Vercel URL.
4. Run `pnpm drizzle-kit push` locally against the Neon database, or run the same command from a trusted deployment setup.
5. Payment UI is currently hidden and `/api/billing/checkout` returns disabled. When billing is ready, enable the route and add Lemon Squeezy variables in Vercel.

## How Generation Works

1. The client sends `POST /api/generate` with `{ "prompt": "https://example.com" }`.
2. Clerk verifies the signed-in user.
3. The server fetches page HTML and stylesheets.
4. The server extracts verified colors from CSS variables, inline styles, theme color, Tailwind classes, logo palette, and screenshot palette.
5. The server asks the AI for compact JSON design guidance only.
6. The server builds the final `DESIGN.md` from a deterministic Markdown template.
7. The generated result is saved to Neon.
8. The API streams two SSE events:
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

## Billing Flow

- Clerk handles sign-in and user identity.
- Lemon Squeezy code is scaffolded for future use.
- Payment entry points are currently hidden from the UI.
- `/api/billing/checkout` intentionally returns `503` while billing is paused.
