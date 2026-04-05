# BrewScanner MVP

Alcohol price comparison platform for the UAE market.

**Live:** https://brewscanner-mvp.vercel.app

---

## What it is

BrewScanner aggregates product listings from 25+ stores across all 7 Emirates. Users can compare prices for the same product across multiple retailers and choose between home delivery or click & collect. Built as an MVP with static data to validate the concept fast.

## Features

- **Price comparison** across 500+ products — spirits, wine, beer, champagne, liqueurs
- **Emirate selector** on entry — filters stores and delivery options by location
- **Age verification gate** (21+)
- **Sort & filter** by price, popularity, rating, and category
- **Cart + checkout flow**
- **Product detail pages** with store availability and pricing breakdown

## Stack

- Next.js 14 / React 18 / Tailwind CSS
- Static product and vendor data (no external backend)
- Deployed on Vercel

## Structure

```
src/
├── app/
│   ├── page.js                  # Homepage
│   ├── checkout/page.js
│   └── products/[slug]/page.js  # Dynamic product pages
├── components/
│   ├── Navbar.js
│   ├── ProductCard.js
│   ├── CartSidebar.js
│   └── WelcomeModal.js          # Emirate + delivery preference
├── context/
│   └── AppContext.js             # Global state (cart, emirate, prefs)
└── data/
    ├── products.js               # Static product catalog
    └── vendors.js                # Store data
```

## Notes

MVP architecture — all data is hardcoded in `/src/data/`. The goal was to ship a working, navigable product fast. Next step would be replacing the static data layer with a real backend and scraper.
