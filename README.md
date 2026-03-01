# 📊 Dynamic Portfolio Dashboard

A real-time stock portfolio dashboard built with **Next.js**, **TypeScript**, **Tailwind CSS**, and **Node.js**. The application displays portfolio holdings with live market data, sector-wise grouping, interactive charts, and automatic price updates.

![Dashboard](https://img.shields.io/badge/Next.js-16-black?logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript) ![Tailwind](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)

---

## 🚀 Features

- **Real-Time Stock Prices**: Fetches Current Market Price (CMP) from Yahoo Finance API
- **Financial Fundamentals**: Retrieves P/E Ratio and EPS data
- **Auto-Refresh**: Prices update automatically every 15 seconds
- **Sector Grouping**: Stocks organized by sector (Financial, Technology, Consumer, Power, Pipes, Others) with sector-level summaries
- **Gain/Loss Color Coding**: Green for profits, Red for losses
- **Interactive Charts**: 
  - Sector allocation donut chart
  - Investment vs Present Value comparison bar chart
- **Sortable Columns**: Click any column header to sort
- **Collapsible Sectors**: Click sector headers to expand/collapse
- **Error Handling**: Graceful error states with retry capability
- **Responsive Design**: Works across desktop, tablet, and mobile
- **Caching**: Server-side caching to reduce API calls and handle rate limits

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js (React Framework) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Table | @tanstack/react-table |
| Charts | Recharts |
| HTTP Client | Fetch API |
| Data Source | Yahoo Finance (unofficial API) |

---

## 📦 Installation & Setup

### Prerequisites
- Node.js v18+ 
- npm v9+

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/Abhishek0943/stockPortfolio
   cd portfolio-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Production Build
```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
portfolio-dashboard/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── market-data/
│   │   │       └── route.ts          # Backend API route for market data
│   │   ├── globals.css               # Global styles
│   │   ├── layout.tsx                # Root layout with SEO metadata
│   │   └── page.tsx                  # Main dashboard page
│   ├── components/
│   │   ├── Header.tsx                # Dashboard header with refresh controls
│   │   ├── LoadingSpinner.tsx        # Loading & error states
│   │   ├── PortfolioCharts.tsx       # Pie & bar charts (Recharts)
│   │   ├── PortfolioTable.tsx        # Stock table with sector grouping
│   │   └── SummaryCards.tsx          # Portfolio summary metric cards
│   ├── data/
│   │   └── portfolio.ts             # Stock holdings data from Excel
│   ├── hooks/
│   │   └── usePortfolioData.ts       # Custom hook for data fetching & state
│   ├── types/
│   │   └── portfolio.ts             # TypeScript type definitions
│   └── utils/
│       └── formatters.ts            # Currency, number, percentage formatters
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

---

## 🔌 API Architecture

### Data Flow
```
Excel Data → Static Portfolio Holdings (client)
                    ↓
        /api/market-data (server)
                    ↓
    Yahoo Finance API (external)
                    ↓
      Cache Layer (15s TTL)
                    ↓
    Merged Data → Dashboard UI
```

### API Endpoint

**GET** `/api/market-data?symbols=SYMBOL1,SYMBOL2,...`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "symbol": "HDFCBANK.NS",
      "cmp": 1700.15,
      "peRatio": 19.5,
      "eps": 87.2
    }
  ],
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

---

## ⚙️ Configuration

| Setting | Default | Description |
|---------|---------|-------------|
| Refresh Interval | 15 seconds | Auto-refresh frequency for CMP data |
| Cache Duration | 15 seconds | Server-side cache TTL |
| Fundamentals Cache | 60 seconds | P/E and EPS data cache TTL |

---

## 📊 Portfolio Data

The portfolio contains **26 stocks** across **6 sectors**:

- **Financial** (5 stocks): HDFC Bank, Bajaj Finance, ICICI Bank, Bajaj Housing, Savani Financials
- **Technology** (6 stocks): Affle India, LTI Mindtree, KPIT Tech, Tata Tech, BLS E-Services, Tanla
- **Consumer** (3 stocks): Dmart, Tata Consumer, Pidilite
- **Power** (4 stocks): Tata Power, KPI Green, Suzlon, Gensol
- **Pipes** (3 stocks): Hariom Pipes, Astral, Polycab
- **Others** (5 stocks): Clean Science, Deepak Nitrite, Fine Organic, Gravita, SBI Life

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## ⚠️ Disclaimer

This application uses unofficial Yahoo Finance API endpoints. Data may be delayed and should not be used for actual trading decisions. The API endpoints may change or become unavailable without notice.
