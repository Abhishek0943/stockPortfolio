// Types for the Portfolio Dashboard

export interface StockHolding {
    id: number;
    name: string;
    purchasePrice: number;
    quantity: number;
    sector: string;
    symbol: string;
}

export interface StockWithMarketData extends StockHolding {
    cmp: number | null;
    peRatio: number | null;
    latestEarnings: number | null;
    investment: number;
    portfolioPercent: number;
    presentValue: number | null;
    gainLoss: number | null;
    gainLossPercent: number | null;
}

export interface SectorSummary {
    sector: string;
    totalInvestment: number;
    totalPresentValue: number | null;
    gainLoss: number | null;
    gainLossPercent: number | null;
    stocks: StockWithMarketData[];
}

export interface PortfolioSummary {
    totalInvestment: number;
    totalPresentValue: number | null;
    totalGainLoss: number | null;
    totalGainLossPercent: number | null;
    sectors: SectorSummary[];
    lastUpdated: string | null;
}

export interface MarketDataResponse {
    symbol: string;
    cmp: number | null;
    peRatio: number | null;
    eps: number | null;
    error?: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    timestamp: string;
}
