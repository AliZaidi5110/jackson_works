# JDM Engine Store Preview

A responsive Next.js storefront concept for a UK Japanese-engine parts and workshop business. The business name, contact details, stock, prices, warranty, delivery and legal terms are not confirmed. Sample products and interface figures are for demonstration only.

## Run locally

Requirements: Node.js and npm.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Included in this preview

- Storefront, engine and make landing pages, product detail pages, search and catalogue filters.
- Sample categories for engine packages, complete engines, engine parts, TCUs and gearbox kits.
- Client-side basket, saved wishlist and VAT display toggle.
- Owner product editor with draft/publish, edit, duplicate, delete and CSV import/export. Product changes are stored in that browser's local storage and are not shared with visitors.
- Contact and workshop enquiry forms, delivered to the configured owner email through Resend.
- Checkout layout with a sample 10% deposit calculation. Online payment is not configured; no order or payment is created.
- `/admin` product tools alongside sample dashboard, order and enquiry screens. Owner sign-in supports email, password and TOTP using the server settings below; product changes remain browser-local.
- Draft Prisma schema and `.env.example` for future integration planning.

## Not connected yet

Stripe checkout/webhooks, order persistence, customer accounts, shared product storage, staff roles, product image uploads, database migrations and a seed script are not connected yet. Owner sign-in needs `ADMIN_EMAIL`, `ADMIN_PASSWORD`, a Base32 `ADMIN_TOTP_SECRET` and a long random `ADMIN_SESSION_SECRET`. Enquiry delivery needs `RESEND_API_KEY`, `ENQUIRY_TO_EMAIL` and a verified `RESEND_FROM_EMAIL`. Do not use the sample catalogue or deposit flow to take orders or collect payment details.

## Before launch

- Confirm business name, logo, company/VAT details, address, opening hours, phone and email.
- Supply real stock, SKUs, product photos, prices, mileage, test results, fitment, and availability.
- Confirm warranty, shipping, deposit, cancellation, returns, privacy, terms and cookie wording; obtain appropriate professional review for legal terms.
- Choose and configure a database, authentication, payment provider, email service and image storage.
- Replace browser-local product storage with the shared database, then secure admin roles and add order persistence, payment webhooks, balance collection and audit logging.
- Replace all sample reviews, ratings, stock levels, delivery figures, and product claims with verifiable business data.
- Configure domain, analytics, search console, sitemap and production deployment.

## Project structure

- `app/` — App Router pages
- `components/` — shared navigation, footer and policy placeholder
- `lib/jdm-catalog.ts` — sample makes, engines, parts and package data
- `lib/jdm-context.tsx` — browser-side basket, wishlist, vehicle and VAT state
- `prisma/schema.prisma` — draft data model only; no migrations are included

All amounts and product records in the current catalogue are sample data. Confirm VAT treatment and pricing before using them commercially.
