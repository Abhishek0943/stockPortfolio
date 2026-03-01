"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { portfolioData, sectorOrder } from "@/data/portfolio";
import {
    StockWithMarketData,
    SectorSummary,
    PortfolioSummary,
    MarketDataResponse,
    ApiResponse,
} from "@/types/portfolio";

const REFRESH_INTERVAL = 15000;

export function usePortfolioData() {
    const [portfolio, setPortfolio] = useState<PortfolioSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<string | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const totalInvestment = portfolioData.reduce(
        (sum, stock) => sum + stock.purchasePrice * stock.quantity,
        0
    );


    const fetchMarketData = useCallback(async (isInitial = false) => {
        try {
            if (isInitial) setLoading(true);
            else setIsRefreshing(true);

            setError(null);
            const symbols = portfolioData.map((s) => s.symbol).join(",");

            const response = await fetch(`/api/market-data?symbols=${encodeURIComponent(symbols)}`);
            const result: ApiResponse<MarketDataResponse[]> = await response.json();

            if (!result.success || !result.data) {
                throw new Error(result.error || "Failed to fetch market data");
            }
            const marketDataMap = new Map<string, MarketDataResponse>();
            result.data.forEach((item) => {
                marketDataMap.set(item.symbol, item);
            });

            const enrichedStocks: StockWithMarketData[] = portfolioData.map((stock) => {
                const marketData = marketDataMap.get(stock.symbol);
                const investment = stock.purchasePrice * stock.quantity;
                const cmp = marketData?.cmp ?? null;
                const presentValue = cmp !== null ? cmp * stock.quantity : null;
                const gainLoss = presentValue !== null ? presentValue - investment : null;
                const gainLossPercent =
                    gainLoss !== null ? (gainLoss / investment) * 100 : null;

                return {
                    ...stock,
                    investment,
                    portfolioPercent: (investment / totalInvestment) * 100,
                    cmp,
                    presentValue,
                    gainLoss,
                    gainLossPercent,
                    peRatio: marketData?.peRatio ?? null,
                    latestEarnings: marketData?.eps ?? null,
                };
            });

            const sectorMap = new Map<string, StockWithMarketData[]>();
            enrichedStocks.forEach((stock) => {
                const existing = sectorMap.get(stock.sector) || [];
                existing.push(stock);
                sectorMap.set(stock.sector, existing);
            });

            const sectors: SectorSummary[] = sectorOrder
                .filter((sector) => sectorMap.has(sector))
                .map((sector) => {
                    const stocks = sectorMap.get(sector)!;
                    const sectorInvestment = stocks.reduce((sum, s) => sum + s.investment, 0);
                    const sectorPresentValue = stocks.reduce(
                        (sum, s) => sum + (s.presentValue ?? s.investment), 0
                    );
                    const sectorGainLoss = sectorPresentValue - sectorInvestment;

                    return {
                        sector,
                        totalInvestment: sectorInvestment,
                        totalPresentValue: sectorPresentValue,
                        gainLoss: sectorGainLoss,
                        gainLossPercent:
                            sectorGainLoss !== null
                                ? (sectorGainLoss / sectorInvestment) * 100
                                : null,
                        stocks,
                    };
                });

            const totalPresentValue = enrichedStocks.reduce(
                (sum, s) => sum + (s.presentValue ?? s.investment), 0
            );
            const totalGainLoss = totalPresentValue - totalInvestment;

            const now = new Date().toISOString();

            setPortfolio({
                totalInvestment,
                totalPresentValue,
                totalGainLoss,
                totalGainLossPercent:
                    totalGainLoss !== null
                        ? (totalGainLoss / totalInvestment) * 100
                        : null,
                sectors,
                lastUpdated: now,
            });

            setLastUpdated(now);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Unknown error occurred";
            setError(message);
            console.error("Portfolio data fetch error:", err);
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    }, [totalInvestment]);

    useEffect(() => {
        fetchMarketData(true);

        intervalRef.current = setInterval(() => {
            fetchMarketData(false);
        }, REFRESH_INTERVAL);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [fetchMarketData]);

    const refresh = useCallback(() => {
        fetchMarketData(false);
    }, [fetchMarketData]);

    return {
        portfolio,
        loading,
        error,
        lastUpdated,
        isRefreshing,
        refresh,
    };
}
