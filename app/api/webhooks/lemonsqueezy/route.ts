import crypto from 'crypto';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { lemonSqueezyEvents, users } from '@/lib/db/schema';
import { getPlanForVariant, PLAN_CONFIG } from '@/lib/plans';

export const runtime = 'nodejs';

function verifySignature(rawBody: string, signature: string | null) {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  const digest = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
}

function subscriptionStatus(payload: any) {
  return String(payload?.data?.attributes?.status || 'inactive');
}

function subscriptionId(payload: any) {
  return String(payload?.data?.id || payload?.data?.attributes?.first_subscription_item?.subscription_id || '');
}

function customerId(payload: any) {
  return String(payload?.data?.attributes?.customer_id || '');
}

function variantId(payload: any) {
  return String(
    payload?.data?.attributes?.variant_id ||
    payload?.data?.attributes?.first_subscription_item?.variant_id ||
    ''
  );
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get('x-signature');

  if (!verifySignature(rawBody, signature)) {
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
  }

  const payload = JSON.parse(rawBody);
  const eventName = String(payload?.meta?.event_name || '');
  const eventId = String(payload?.meta?.webhook_id || payload?.data?.id || crypto.randomUUID());
  const customData = payload?.meta?.custom_data || {};
  const authUserId = customData.auth_user_id;
  const planFromCustom = customData.plan;
  const planFromVariant = getPlanForVariant(variantId(payload));
  const plan = planFromVariant || (planFromCustom === 'team' ? 'team' : planFromCustom === 'pro' ? 'pro' : null);

  await db
    .insert(lemonSqueezyEvents)
    .values({
      eventId,
      eventName,
      payload,
    })
    .onConflictDoNothing();

  if (!authUserId || !plan) {
    return NextResponse.json({ ok: true, ignored: 'missing auth user or plan' });
  }

  const status = subscriptionStatus(payload);
  const activeStatuses = new Set(['active', 'on_trial', 'paused', 'past_due']);
  const tier = activeStatuses.has(status) ? plan : 'free';
  const planConfig = tier === 'free' ? null : PLAN_CONFIG[tier];

  await db
    .update(users)
    .set({
      lemonSqueezyCustomerId: customerId(payload) || null,
      lemonSqueezySubscriptionId: subscriptionId(payload) || null,
      lemonSqueezyVariantId: variantId(payload) || null,
      subscriptionTier: tier,
      subscriptionStatus: status,
      generationsLimit: planConfig?.generationsLimit || 3,
      updatedAt: new Date(),
    })
    .where(eq(users.authUserId, authUserId));

  return NextResponse.json({ ok: true });
}
