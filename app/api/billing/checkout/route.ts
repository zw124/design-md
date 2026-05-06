import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateCurrentUser } from '@/lib/auth';
import { PLAN_CONFIG, type BillingPlan } from '@/lib/plans';

export const runtime = 'nodejs';

function getBaseUrl(req: NextRequest) {
  const origin = req.headers.get('origin');
  if (origin) return origin;
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const appUser = await getOrCreateCurrentUser();
  if (!appUser) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const { plan } = await req.json() as { plan?: BillingPlan };
  if (!plan || !(plan in PLAN_CONFIG)) {
    return NextResponse.json({ error: 'Invalid billing plan' }, { status: 400 });
  }

  const config = PLAN_CONFIG[plan];
  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  const storeId = process.env.LEMONSQUEEZY_STORE_ID;
  const variantId = process.env[config.variantEnv];

  if (!apiKey || !storeId || !variantId) {
    return NextResponse.json(
      { error: `Missing Lemon Squeezy environment variables for ${config.name}` },
      { status: 500 }
    );
  }

  const baseUrl = getBaseUrl(req);
  const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      data: {
        type: 'checkouts',
        attributes: {
          checkout_options: {
            embed: false,
          },
          checkout_data: {
            email: appUser.email,
            custom: {
              clerk_user_id: appUser.clerkId,
              app_user_id: String(appUser.id),
              plan,
            },
          },
          product_options: {
            redirect_url: `${baseUrl}/?checkout=success&plan=${plan}`,
          },
        },
        relationships: {
          store: {
            data: {
              type: 'stores',
              id: storeId,
            },
          },
          variant: {
            data: {
              type: 'variants',
              id: variantId,
            },
          },
        },
      },
    }),
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    return NextResponse.json(
      { error: payload?.errors?.[0]?.detail || payload?.errors?.[0]?.title || 'Failed to create checkout' },
      { status: response.status }
    );
  }

  const url = payload?.data?.attributes?.url;
  if (!url) {
    return NextResponse.json({ error: 'Lemon Squeezy did not return a checkout URL' }, { status: 502 });
  }

  return NextResponse.json({ url });
}
