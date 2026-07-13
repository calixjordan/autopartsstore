# AutoPartsIndia — Maruti Suzuki Spare Parts E-Commerce

> Full-stack Next.js 14 App Router e-commerce store for genuine Maruti Suzuki automotive spare parts.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Database | Prisma ORM + SQLite (dev) |
| Payments | Stripe Checkout (INR) |
| Icons | Lucide React |
| State | Zustand (persisted cart) |
| Language | TypeScript |

## File Structure

```
autoparts-store/
├── prisma/
│   ├── schema.prisma          # DB schema (Product, Order, User, OrderItem)
│   └── seed.ts                # 16 Maruti Suzuki parts seed data
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout (Navbar, CartSidebar, Toaster)
│   │   ├── page.tsx           # Homepage / Storefront
│   │   ├── globals.css        # Global styles + Tailwind
│   │   ├── api/
│   │   │   ├── products/
│   │   │   │   ├── route.ts           # GET /api/products (filter, search, paginate)
│   │   │   │   └── [id]/route.ts      # GET /api/products/:id
│   │   │   ├── checkout/
│   │   │   │   └── route.ts           # POST /api/checkout (Stripe session)
│   │   │   └── webhook/
│   │   │       └── stripe/route.ts    # POST /api/webhook/stripe
│   │   ├── products/
│   │   │   └── [id]/page.tsx  # Product detail page
│   │   ├── checkout/
│   │   │   ├── success/page.tsx
│   │   │   └── cancelled/page.tsx
│   │   └── orders/
│   │       └── page.tsx
│   ├── components/
│   │   ├── Navbar.tsx         # Sticky nav with search + cart badge
│   │   ├── CartSidebar.tsx    # Slide-out cart with checkout
│   │   ├── ProductCard.tsx    # Product card with compatibility warning
│   │   ├── CategoryFilter.tsx # Horizontal category pills
│   │   └── ui/
│   │       └── Toaster.tsx    # Toast notification system
│   ├── lib/
│   │   ├── prisma.ts          # Prisma client singleton
│   │   └── stripe.ts          # Stripe singleton
│   ├── store/
│   │   └── cartStore.ts       # Zustand cart store (persisted)
│   └── types/
│       └── index.ts           # Shared TypeScript types
├── .env.local                 # Environment variables (fill in Stripe keys)
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Quick Start

### Prerequisites
- [Node.js 18+](https://nodejs.org) — **required, install if not present**
- A [Stripe account](https://stripe.com) for payment keys (test mode is fine)

### 1. Install Dependencies
```bash
cd autoparts-store
npm install
```

### 2. Configure Environment Variables
Edit `.env.local` and replace the placeholder values:
```env
DATABASE_URL="file:./dev.db"
STRIPE_SECRET_KEY="sk_test_YOUR_KEY"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_YOUR_KEY"
STRIPE_WEBHOOK_SECRET="whsec_YOUR_SECRET"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```
> Get your keys from: https://dashboard.stripe.com/test/apikeys

### 3. Initialize Database & Seed
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

### 4. Start Development Server
```bash
npm run dev
```

Open **http://localhost:3000** 🎉

### One-Liner Setup (Steps 1–4)
```bash
npm install && npx prisma generate && npx prisma db push && npx prisma db seed && npm run dev
```

## Seeded Products (16 Parts)

| Category | Parts |
|----------|-------|
| Engine | Dzire Air Filter, Alto K10 Oil Filter, Baleno Spark Plugs, Swift Timing Chain |
| Exterior | Swift Front Bumper (Pearl White), Vitara Brezza Chrome Grille, Baleno Rear Spoiler |
| Brakes | Alto 800 Brake Pads, Dzire Drum Brake Shoes, Baleno Disc Rotor |
| Electronics | Baleno LED Headlamp, Wagon R Alternator, Swift Parking Sensor Kit, Ertiga ECU |
| Suspension | Swift Front Shock Absorbers (Pair), Baleno Strut Mount Kit |

## Features

- 🔍 **Search** by part name, part number, or compatible model
- 🏷️ **Category filter** with 8 categories (Engine, Exterior, Brakes, Electronics, Suspension…)
- 🛒 **Persistent cart** via Zustand (survives page reload)
- ⚠️ **Compatibility warnings** on every product card and detail page
- 💳 **Stripe Checkout** (INR currency, India shipping, phone collection)
- 📦 **Order tracking** via Stripe webhook → Prisma DB update
- 🚚 **Free shipping** threshold at ₹2,000
- 📱 **Fully responsive** mobile-first design

## Deploying to Production

1. Switch Prisma datasource to PostgreSQL
2. Set `DATABASE_URL` to your PostgreSQL connection string
3. Run `npx prisma migrate deploy`
4. Deploy to Vercel: `npx vercel`
5. Update `NEXT_PUBLIC_BASE_URL` to your production domain
6. Register Stripe webhook pointing to `https://yourdomain.com/api/webhook/stripe`
