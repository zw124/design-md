export type BillingPlan = 'pro' | 'team';

export const PLAN_CONFIG: Record<BillingPlan, {
  name: string;
  price: number;
  variantEnv: 'LEMONSQUEEZY_PRO_VARIANT_ID' | 'LEMONSQUEEZY_TEAM_VARIANT_ID';
  generationsLimit: number;
}> = {
  pro: {
    name: 'Pro',
    price: 12,
    variantEnv: 'LEMONSQUEEZY_PRO_VARIANT_ID',
    generationsLimit: 1000,
  },
  team: {
    name: 'Team',
    price: 49,
    variantEnv: 'LEMONSQUEEZY_TEAM_VARIANT_ID',
    generationsLimit: 10000,
  },
};

export function getPlanForVariant(variantId?: string | number | null): BillingPlan | null {
  const normalized = variantId ? String(variantId) : '';
  if (normalized && normalized === process.env.LEMONSQUEEZY_PRO_VARIANT_ID) return 'pro';
  if (normalized && normalized === process.env.LEMONSQUEEZY_TEAM_VARIANT_ID) return 'team';
  return null;
}
