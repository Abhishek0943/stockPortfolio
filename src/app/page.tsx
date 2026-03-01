"use client";

import React from "react";
import Header from "@/components/Header";
import SummaryCards from "@/components/SummaryCards";
import PortfolioCharts from "@/components/PortfolioCharts";
import PortfolioTable from "@/components/PortfolioTable";
import LoadingSpinner, { ErrorDisplay } from "@/components/LoadingSpinner";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { LuTriangleAlert } from "react-icons/lu";

export default function DashboardPage() {
  const { portfolio, loading, error, lastUpdated, isRefreshing, refresh } =
    usePortfolioData();

  if (loading && !portfolio) {
    return <LoadingSpinner />;
  }

  if (error && !portfolio) {
    return <ErrorDisplay message={error} onRetry={refresh} />;
  }

  if (!portfolio) return null;

  return (
    <div className="min-h-screen bg-black">
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6" id="main-content">
        <Header
          lastUpdated={lastUpdated}
          isRefreshing={isRefreshing}
          onRefresh={refresh}
        />

        {error && (
          <div
            className="mb-6 flex items-center gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-300"
            id="error-banner"
          >
            <LuTriangleAlert className="w-5 h-5 shrink-0" />
            <span>
              Failed to refresh data: {error}. Showing last known values.
            </span>
          </div>
        )}

        <SummaryCards portfolio={portfolio} />

        <PortfolioCharts sectors={portfolio.sectors} />
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white tracking-tight">
              Holdings by Sector
            </h2>
            <p className="text-xs text-slate-500">
              Click column headers to sort • Click sectors to collapse
            </p>
          </div>
          <PortfolioTable sectors={portfolio.sectors} />
        </div>

        <footer className="mt-12 mb-6 text-center" id="dashboard-footer">
          <div className="space-y-1">
            <p className="text-xs text-slate-600">
              ⚠️ Data sourced from Yahoo Finance (unofficial API). Prices may be
              delayed and should not be used for trading decisions.
            </p>
            <p className="text-xs text-slate-700">
              Built with Next.js • TypeScript • Tailwind CSS • Recharts
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
