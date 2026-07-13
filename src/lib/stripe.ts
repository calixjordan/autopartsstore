import Stripe from "stripe";

const PLACEHOLDER_KEYS = [
  "sk_test_YOUR_STRIPE_SECRET_KEY_HERE",
  "sk_test_YOUR_KEY",
  "",
  undefined,
];

function getStripeKey(): string {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || PLACEHOLDER_KEYS.includes(key)) {
    throw new Error(
      "STRIPE_SECRET_KEY is not configured. Please add your real Stripe test key to .env.local"
    );
  }
  return key;
}

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(getStripeKey(), {
      apiVersion: "2024-06-20",
      typescript: true,
    });
  }
  return _stripe;
}

// Keep backward compat export — but now lazy
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return getStripe()[prop as keyof Stripe];
  },
});
