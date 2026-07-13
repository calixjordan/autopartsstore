import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { CheckoutItem } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function POST(request: NextRequest) {
  // Guard: detect missing or placeholder Stripe key upfront
  let stripeClient;
  try {
    stripeClient = getStripe();
  } catch (e) {
    return NextResponse.json(
      {
        error:
          "⚠️ Stripe is not configured. Open .env.local, replace STRIPE_SECRET_KEY with your real key from https://dashboard.stripe.com/test/apikeys, then restart the dev server.",
      },
      { status: 402 }
    );
  }

  try {
    const body = await request.json();
    const { items, userId, couponCode }: { items: CheckoutItem[]; userId?: string; couponCode?: string } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Validate items and build Stripe line items
    const lineItems = await Promise.all(
      items.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new Error(`Product ${item.productId} not found`);
        }
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}`);
        }

        return {
          price_data: {
            currency: "inr",
            product_data: {
              name: product.name,
              description: `Part No: ${product.partNumber} | Brand: ${product.brand}`,
              images: [product.imageUrl],
              metadata: {
                productId: product.id,
                partNumber: product.partNumber,
              },
            },
            unit_amount: Math.round(product.price * 100), // paise
          },
          quantity: item.quantity,
        };
      })
    );

    const subtotal = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    let discount = 0;
    if (couponCode === "RAIN15") {
      discount = subtotal * 0.15;
    } else if (couponCode === "UPI10") {
      discount = subtotal * 0.10;
    }

    let shipping = subtotal > 4999 || couponCode === "FREESHIP" ? 0 : 150;
    const finalTotal = subtotal - discount + shipping;

    const finalLineItems = [...lineItems];
    if (discount > 0) {
      finalLineItems.push({
        price_data: {
          currency: "inr",
          product_data: {
            name: `Discount (${couponCode})`,
            description: `Promotional Coupon Applied`,
            images: [],
            metadata: { productId: "discount", partNumber: couponCode ?? "" },
          },
          unit_amount: -Math.round(discount * 100),
        },
        quantity: 1,
      });
    }

    if (shipping > 0) {
      finalLineItems.push({
        price_data: {
          currency: "inr",
          product_data: {
            name: "Express Delivery Fee",
            description: "Pan-India Secure Shipping",
            images: [],
            metadata: { productId: "shipping", partNumber: "SHIP-001" },
          },
          unit_amount: Math.round(shipping * 100),
        },
        quantity: 1,
      });
    }

    // Create Stripe Checkout Session
    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: finalLineItems,
      mode: "payment",
      success_url: `${BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/checkout/cancelled`,
      metadata: {
        orderItems: JSON.stringify(
          items.map((i) => ({ productId: i.productId, quantity: i.quantity }))
        ),
      },
      shipping_address_collection: { allowed_countries: ["IN"] },
      phone_number_collection: { enabled: true },
    });

    // Persist pending order in DB
    await prisma.order.create({
      data: {
        stripeSessionId: session.id,
        status: "pending",
        userId: userId || null,
        total: finalTotal,
        currency: "INR",
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("[API /checkout] Error:", error);
    const message = error instanceof Error ? error.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
