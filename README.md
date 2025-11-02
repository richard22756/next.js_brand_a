    Brand A — Single-Tenant E-Commerce Prototype

    This project is a single-tenant e-commerce prototype built with Next.js 14 (App Router).
    It demonstrates a brand-specific storefront for Brand A, showcasing key concepts such as Server-Side Rendering (SSR), Incremental Static Regeneration (ISR), API-based checkout simulation, and race condition handling for concurrency safety.

    | Layer              | Technology                                      |
    | ------------------ | ----------------------------------------------- |
    | Frontend           | Next.js 14 (App Router)                         |
    | Styling            | Tailwind CSS                                    |
    | Backend Simulation | Next.js API Routes with Node.js `fs` module     |
    | Data Storage       | JSON mock data (`products.json`, `orders.json`) |
    | Language           | TypeScript                                      |
    | Rendering          | SSR + ISR (Incremental Static Regeneration)     |


    /app
    ┣ /components
    ┃ ┣ ProductTabs.tsx → Client-side tab UI for product details
    ┃ ┗ BuyButton.tsx → Client-side checkout button
    ┣ /products
    ┃ ┣ page.tsx → Product catalog (SSR + ISR)
    ┃ ┗ [id]/page.tsx → Product detail page with tabs & buy action
    ┣ /api
    ┃ ┣ /checkout/route.ts → Handles simulated checkout and stock updates
    ┃ ┗ /revalidate/route.ts → Optional cache invalidation endpoint
    ┣ layout.tsx → Root layout and metadata
    ┗ page.tsx → Homepage

    /data
    ┣ products.json → Mock product data with stock info
    ┗ orders.json → Simulated order persistence


    ✨ Key Features
    🧱 1. Product Catalog & Detail Page
    * Built using Server-Side Rendering (SSR) and Incremental Static Regeneration (ISR).
    * Each product page is cached and revalidated every 60 seconds (export const revalidate = 60).

    🧭 2. Interactive Tabs (Client Component)
    * Each product detail page includes a tabbed interface (Description, Reviews, Specifications).
    * Implemented as a client component using React state hooks.

    💳 3. Simulated Checkout API
    * The /api/checkout route simulates purchase transactions.
    * It validates stock availability, applies an artificial delay, and records successful orders in orders.json.

    ⚔️ 4. Race Condition Handling
    * The API introduces a 1-second delay (await delay(1000)) to mimic concurrent requests.
    * When two users attempt to buy the same product simultaneously:
        * The first request succeeds and updates the stock.
        * The second request fails with: “Out of stock”.
    * This demonstrates manual concurrency testing and safe stock mutation.

    🔄 5. Caching & Invalidation (ISR)
    * Each product page is cached for 60 seconds.
    * After a checkout, a revalidation can be triggered manually by calling:
        POST /api/revalidate
        {
        "path": "/products/[id]"
        }
    * This simulates cache invalidation after stock changes.

    | Scenario           | Action                                            | Expected Result
    ----------------------------------------------------------------------------------------------------
    | Normal checkout    | Buy a product with stock available                | ✅ Order succeeds, stock decreases            |                                                   |
    | Out-of-stock       | Buy a product with 0 stock                        | ❌ “Out of stock” error                |                                                   |
    | Race condition     | Open two tabs and buy same product simultaneously | One success, one failure              |                                                   |
    | Cache invalidation | Trigger `/api/revalidate`                         | Page regenerates with updated stock                |                                                   |


    To observe the race condition:
    1. Start the dev server with npm run dev.
    2. Open the same product page in two browser tabs.
    3. Quickly press “Buy Now” on both — one will succeed, the other will fail.


    Architecture Overview
    User Browser
        │
        ▼
    Next.js Frontend (App Router)
        │
        ├── SSR / ISR for catalog & product pages
        ├── Client Components (Tabs, BuyButton)
        │
        ▼
    API Layer
        ├── /api/checkout → Create order + update product stock
        └── /api/revalidate → Trigger cache invalidation
        │
        ▼
    File System (products.json, orders.json)


    | Decision                               | Benefit                                | Trade-off
    --------------------------------------------------------------------------------------------------------
    | Use of JSON files instead of a real DB | Simple, lightweight, easy to reset     | Not scalable for real-time concurrency                    |                                        |
    | Simulated delay in API                 | Demonstrates race condition clearly    | Slower test execution                                |                                        |
    | ISR caching                            | Performance optimization for SSR pages | Slight delay before updated stock appears                    |                                        |
    | Manual invalidation route              | Developer control of cache lifecycle   | Requires explicit trigger                                  |                                        |
