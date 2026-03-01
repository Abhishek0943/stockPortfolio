import { NextRequest, NextResponse } from "next/server";
import { MarketDataResponse } from "@/types/portfolio";

const cache: Map<string, { data: MarketDataResponse; timestamp: number }> = new Map();
const CACHE_DURATION = 15000; // 15 seconds cache


async function fetchYahooFinanceData(symbol: string): Promise<{ cmp: number | null }> {
    try {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`;

        const response = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            },
            next: { revalidate: 15 }, // Next.js cache revalidation
        });

        if (!response.ok) {
            console.error(`Yahoo Finance API error for ${symbol}: ${response.status}`);
            return { cmp: null };
        }

        const data = await response.json();
        const result = data?.chart?.result?.[0];

        if (!result) {
            return { cmp: null };
        }
        const meta = result.meta;
        const cmp = meta?.regularMarketPrice ?? null;

        return { cmp };
    } catch (error) {
        console.error(`Error fetching Yahoo data for ${symbol}:`, error);
        return { cmp: null };
    }
}

async function fetchFundamentalsData(symbol: string): Promise<{ peRatio: number | null; eps: number | null }> {
    try {
        const url = `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${encodeURIComponent(symbol)}?modules=defaultKeyStatistics,earnings,financialData`;

        const response = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            },
            next: { revalidate: 60 },
        });

        if (!response.ok) {
            return await fetchPEFromChart(symbol);
        }

        const data = await response.json();
        const summary = data?.quoteSummary?.result?.[0];

        const peRatio = summary?.defaultKeyStatistics?.trailingPE?.raw ??
            summary?.defaultKeyStatistics?.forwardPE?.raw ?? null;
        const eps = summary?.financialData?.earningsPerShare?.raw ??
            summary?.defaultKeyStatistics?.trailingEps?.raw ?? null;

        return { peRatio, eps };
    } catch (error) {
        console.error(`Error fetching fundamentals for ${symbol}:`, error);
        return await fetchPEFromChart(symbol);
    }
}

async function fetchPEFromChart(symbol: string): Promise<{ peRatio: number | null; eps: number | null }> {
    try {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=5d`;
        const response = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            },
        });

        if (!response.ok) return { peRatio: null, eps: null };

        const data = await response.json();
        const meta = data?.chart?.result?.[0]?.meta;

        return {
            peRatio: meta?.trailingPE ?? null,
            eps: meta?.epsTrailingTwelveMonths ?? null,
        };
    } catch {
        return { peRatio: null, eps: null };
    }
}
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const symbolsParam = searchParams.get("symbols");

        if (!symbolsParam) {
            return NextResponse.json(
                { success: false, error: "No symbols provided", timestamp: new Date().toISOString() },
                { status: 400 }
            );
        }

        const symbols = symbolsParam.split(",").map(s => s.trim()).filter(Boolean);

        if (symbols.length === 0) {
            return NextResponse.json(
                { success: false, error: "Invalid symbols", timestamp: new Date().toISOString() },
                { status: 400 }
            );
        }

        const results: MarketDataResponse[] = await Promise.all(
            symbols.map(async (symbol) => {
                const cached = cache.get(symbol);
                if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
                    return cached.data;
                }

                const [priceData, fundamentals] = await Promise.all([
                    fetchYahooFinanceData(symbol),
                    fetchFundamentalsData(symbol),
                ]);

                const result: MarketDataResponse = {
                    symbol,
                    cmp: priceData.cmp,
                    peRatio: fundamentals.peRatio,
                    eps: fundamentals.eps,
                };

                cache.set(symbol, { data: result, timestamp: Date.now() });

                return result;
            })
        );

        return NextResponse.json({
            success: true,
            data: results,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error("Market data API error:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch market data",
                timestamp: new Date().toISOString(),
            },
            { status: 500 }
        );
    }
}
