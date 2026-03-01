"use client";

import React from "react";
import { PortfolioSummary } from "@/types/portfolio";
import { formatCurrency, formatPercent, getGainLossClass } from "@/utils/formatters";
import { LuIndianRupee, LuTrendingUp, LuChartBar, LuBriefcase } from "react-icons/lu";

interface SummaryCardsProps {
    portfolio: PortfolioSummary;
}

export default function SummaryCards({ portfolio }: SummaryCardsProps) {
    const cards = [
        {
            id: "total-investment",
            title: "Total Investment",
            value: formatCurrency(portfolio.totalInvestment),
            icon: (
                <LuIndianRupee className="w-6 h-6" />
            ),
            color: "bg-neutral-950 border-neutral-800",
            iconColor: "text-blue-400",
        },
        {
            id: "present-value",
            title: "Present Value",
            value: formatCurrency(portfolio.totalPresentValue),
            icon: (
                <LuTrendingUp className="w-6 h-6" />
            ),
            color: "bg-neutral-950 border-neutral-800",
            iconColor: "text-purple-400",
        },
        {
            id: "total-gain-loss",
            title: "Total Gain/Loss",
            value: formatCurrency(portfolio.totalGainLoss),
            subtitle: formatPercent(portfolio.totalGainLossPercent),
            icon: (
                <LuChartBar className="w-6 h-6" />
            ),
            color: "bg-neutral-950 border-neutral-800",
            iconColor: getGainLossClass(portfolio.totalGainLoss),
        },
        {
            id: "total-stocks",
            title: "Total Holdings",
            value: portfolio.sectors.reduce((sum, s) => sum + s.stocks.length, 0).toString(),
            subtitle: `${portfolio.sectors.length} Sectors`,
            icon: (
                <LuBriefcase className="w-6 h-6" />
            ),
            color: "bg-neutral-950 border-neutral-800",
            iconColor: "text-amber-400",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8" id="summary-cards">
            {cards.map((card) => (
                <div
                    key={card.id}
                    id={card.id}
                    className={`relative overflow-hidden rounded-xl border ${card.color} p-5 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-black/20`}
                >
                    {/* Subtle glow effect */}
                    <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-white/5 blur-2xl" />

                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">
                                {card.title}
                            </p>
                            <p className="text-2xl font-bold text-white">{card.value}</p>
                            {card.subtitle && (
                                <p className={`text-sm font-medium ${card.iconColor}`}>
                                    {card.subtitle}
                                </p>
                            )}
                        </div>
                        <div className={`rounded-lg bg-white/5 p-2.5 ${card.iconColor}`}>
                            {card.icon}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
