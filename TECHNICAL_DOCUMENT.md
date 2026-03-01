# Technical Document: Portfolio Dashboard
## Key Challenges & Solutions

---

### 1. API Limitations — No Official Financial APIs

**Challenge:**
Both Yahoo Finance and Google Finance do not provide official public APIs. The assignment
requires fetching CMP from Yahoo and P/E/EPS from Google Finance.

**Solution:**
- **Yahoo Finance**: Used the unofficial `query1.finance.yahoo.com/v8/finance/chart/` endpoint
  which returns JSON data for stock prices. This is the same endpoint used by popular open-source
  libraries like `yahoo-finance2`.
- **Google Finance**: Google Finance has no usable API at all (not even unofficial). The data
  shown on Google Finance is actually sourced from exchanges and has no query endpoint.
  **Decision**: Both CMP and fundamentals (P/E, EPS) are fetched from Yahoo Finance, which
  provides comprehensive stock data. This is documented as a deliberate design decision.
- **Fallback Strategy**: If the primary Yahoo quoteSummary endpoint fails, the system falls back
  to extracting P/E from the chart API metadata.

**Risk Mitigation:**
- API endpoints may change or become unavailable
- Added error handling at every fetch layer
- Cached responses survive temporary API outages
- UI shows "last known values" when refresh fails

---

### 2. Rate Limiting & Performance

**Challenge:**
With 26 stocks requiring data, making 26+ individual API calls every 15 seconds would
quickly hit rate limits and degrade performance.

**Solution:**
- **Server-Side Caching**: Implemented an in-memory cache with 15-second TTL on the
  API route. Repeated requests within the cache window return cached data instantly.
- **Batch Requests**: All stock symbols are sent in a single API call to our backend,
  which then fetches data in parallel using `Promise.all()`.
- **Next.js Fetch Caching**: Leveraged Next.js's built-in `revalidate` option on fetch
  calls for additional caching at the framework level.
- **Staggered Cache**: CMP data uses a 15s cache, while fundamentals (P/E, EPS) use a
  60s cache since they change less frequently.

---

### 3. Real-Time Updates Without WebSockets

**Challenge:**
The dashboard needs to show "live" data updating every 15 seconds.

**Solution:**
- Used `setInterval` in a custom React hook (`usePortfolioData`) to trigger re-fetches
  every 15 seconds.
- The interval is properly cleaned up in `useEffect` cleanup to prevent memory leaks.
- A visual indicator (pulsing dot + "Updating..." text) shows when a refresh is in progress.
- Manual refresh button is also provided for on-demand updates.

**Why not WebSockets:**
WebSockets would require a persistent connection to a data provider. Since we're using
unofficial APIs that don't support WebSocket connections, polling is the appropriate choice.

---

### 4. Data Transformation & Calculated Fields

**Challenge:**
The raw API data doesn't match the required table schema. Several columns are computed:
- Investment = Purchase Price × Quantity
- Portfolio % = Investment / Total Investment
- Present Value = CMP × Quantity
- Gain/Loss = Present Value - Investment

**Solution:**
- All transformations happen in the `usePortfolioData` hook after API data is received.
- Portfolio data (from Excel) is stored as a static array in `src/data/portfolio.ts`.
- Market data from the API is merged with portfolio data using a `Map` for O(1) lookups.
- Sector summaries are computed by grouping stocks and aggregating values.

---

### 5. TypeScript Type Safety

**Challenge:**
Financial data involves many nullable fields (API might fail for specific stocks),
which can easily lead to runtime errors if not handled properly.

**Solution:**
- Defined strict TypeScript interfaces (`StockHolding`, `StockWithMarketData`,
  `SectorSummary`, `PortfolioSummary`) in `src/types/portfolio.ts`.
- All nullable fields (cmp, peRatio, eps, presentValue, gainLoss) are typed as
  `number | null` — not `undefined` — for explicit null handling.
- Utility functions handle `null` gracefully, displaying "—" for missing values.

---

### 6. UI/UX Design Decisions

**Sector Grouping:**
- Sectors are collapsible accordion-style sections, each with its own summary row.
- This allows users to focus on specific sectors while seeing overall performance.

**Color Coding:**
- Green (`text-emerald-400`) for positive gain/loss values
- Red (`text-red-400`) for negative values
- Neutral slate for null/unavailable data

**Loading States:**
- Full-page skeleton loader on initial load
- Subtle "refreshing" indicator during subsequent updates
- Error banner that doesn't block the UI when cached data is available

**Responsive Design:**
- Summary cards stack on mobile (1 column → 2 columns → 4 columns)
- Charts stack vertically on mobile
- Portfolio table scrolls horizontally on small screens

---

### 7. Performance Optimization

- **React.memo equivalent**: Components receive data as props and only re-render
  when their specific data changes.
- **useMemo**: Column definitions in `PortfolioTable` are memoized to prevent
  unnecessary re-renders.
- **useCallback**: Fetch function is memoized with `useCallback` to maintain
  stable reference for `useEffect` dependencies.
- **Next.js App Router**: Leverages React Server Components where possible,
  with client components only where interactivity is needed.

---

### 8. Error Handling Strategy

The application implements a multi-layer error handling approach:

1. **API Level**: Each Yahoo Finance fetch is wrapped in try/catch with fallback values.
2. **Route Level**: The API route handler catches all errors and returns structured error responses.
3. **Client Level**: The `usePortfolioData` hook distinguishes between:
   - Initial load errors (full error screen with retry)
   - Refresh errors (warning banner, keeps showing cached data)
4. **UI Level**: Components handle null values gracefully, showing "—" instead of crashing.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                      │
│                                                          │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │  Header   │  │ SummaryCards  │  │ PortfolioCharts  │   │
│  └──────────┘  └──────────────┘  └──────────────────┘   │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │              PortfolioTable                       │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐            │   │
│  │  │Sector 1 │ │Sector 2 │ │Sector N │  ...        │   │
│  │  └─────────┘ └─────────┘ └─────────┘            │   │
│  └──────────────────────────────────────────────────┘   │
│                         │                                │
│              usePortfolioData (hook)                     │
│                    setInterval(15s)                       │
└────────────────────────┬────────────────────────────────┘
                         │ fetch()
                         ▼
┌─────────────────────────────────────────────────────────┐
│              SERVER (Next.js API Route)                   │
│                                                          │
│  /api/market-data                                        │
│     ├── Cache Layer (in-memory, 15s TTL)                 │
│     ├── Yahoo Finance Chart API → CMP                    │
│     └── Yahoo Finance QuoteSummary → P/E, EPS            │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│            Yahoo Finance (Unofficial API)                 │
│  query1.finance.yahoo.com/v8/finance/chart/              │
│  query1.finance.yahoo.com/v10/finance/quoteSummary/      │
└─────────────────────────────────────────────────────────┘
```
