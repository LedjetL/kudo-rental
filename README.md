# Ku'do Rental

Website for **Ku'do Rental**, a premium car rental business based in Albania. Built to make it easy for clients to browse the fleet, check availability, and reserve a vehicle — directly from their phone or desktop.

## About the Project

The goal is simple: give a local car rental business a professional online presence that converts visitors into bookings. The site is fast, mobile-first, and designed to feel premium without being complicated.

**Live on:** Vercel

---

## Features

- **Hero booking widget** — pick-up location, pick-up date, and return date right on the homepage; dates carry over to the booking form
- **Fleet browser** — horizontal card layout with category filters (All / Sedan / Premium / SUV), image lightbox, and availability status
- **3-step booking flow** — Dates & Extras → Your Details → Review & Confirm
- **WhatsApp integration** — every car card has a direct WhatsApp inquiry button; booking confirmation links to a pre-filled WhatsApp message
- **Email confirmations** — via EmailJS (one email to the owner, one to the customer) — requires setup
- **"How It Works" section** — 3-step visual guide with trust badges
- **About section** — who Ku'do Rental is and what makes them different
- **Testimonials** — client reviews with star ratings
- **Floating WhatsApp button** — always accessible across the site
- **Form validation** — email format check, phone number check, date logic (min 1 day), inline error messages
- **Mobile sticky price bar** — shows running total and action button while scrolling on mobile

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| Vite + React + TypeScript | Frontend framework |
| react-router-dom | Client-side routing |
| @emailjs/browser | Email confirmations (no backend needed) |
| Google Fonts | Cormorant Garamond + Montserrat |
| Vercel | Hosting & deployment |

---

## Getting Started

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

---

## Setup Required Before Going Live

### 1. Car Images
Add photos to `/public/cars/`:
- `jetta-brown.jpg`
- `jetta-black.jpg`
- `audi-a7.jpg`
- `volvo-xc90.jpg`

### 2. Hero Image
Add `/public/hero.jpg` — a wide landscape photo of a car or road in Albania.

### 3. Logo
Add `/public/logo.png` — the Ku'do Rental logo (transparent background recommended).

### 4. EmailJS (optional but recommended)
Sign up at [emailjs.com](https://www.emailjs.com/) and fill in the values at the top of `src/pages/BookingPage.tsx`:

```ts
const EMAILJS_SERVICE_ID       = 'your_service_id'
const EMAILJS_TEMPLATE_OWNER   = 'your_owner_template_id'
const EMAILJS_TEMPLATE_CUSTOMER = 'your_customer_template_id'
const EMAILJS_PUBLIC_KEY       = 'your_public_key'
const OWNER_EMAIL              = 'your@email.com'
```

If EmailJS is not configured, the booking confirmation step will fall back to the WhatsApp confirmation flow.

---

## Fleet & Pricing

| Car | Category | Price |
|-----|---------|-------|
| VW Jetta 2013 (×2) | Sedan | €35/day |
| Audi A7 2013 | Premium | €70/day |
| Volvo XC90 2006 | SUV | €70/day |

To update fleet data, edit `src/data/cars.ts`.

To mark a car as booked, set `available: false` or add a `bookedUntil` date:

```ts
{
  id: 'audi-a7',
  available: true,
  bookedUntil: '2026-04-15', // shows "Available from 15 April 2026"
}
```

---

## Contact

**WhatsApp:** +355 68 521 6312
**Location:** Albania
