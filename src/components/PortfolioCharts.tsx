"use client";

import React from "react";
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { SectorSummary } from "@/types/portfolio";
import { formatCurrency } from "@/utils/formatters";

interface PortfolioChartsProps {
    sectors: SectorSummary[];
}

const CHART_COLORS = [
    "#3B82F6", // blue
    "#8B5CF6", // purple
    "#F59E0B", // amber
    "#10B981", // emerald
    "#06B6D4", // cyan
    "#64748B", // slate
];

export default function PortfolioCharts({ sectors }: PortfolioChartsProps) {
    const pieData = sectors.map((s, i) => ({
        name: s.sector,
        value: s.totalInvestment,
        color: CHART_COLORS[i % CHART_COLORS.length],
    }));

    const barData = sectors.map((s, i) => ({
        name: s.sector,
        investment: s.totalInvestment,
        presentValue: s.totalPresentValue ?? 0,
        gainLoss: s.gainLoss ?? 0,
        fill: CHART_COLORS[i % CHART_COLORS.length],
    }));

    const PieTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) => {
        if (!active || !payload || !payload.length) return null;
        const data = payload[0];
        const total = pieData.reduce((sum, d) => sum + d.value, 0);
        const percent = ((data.value / total) * 100).toFixed(1);
        return (
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 shadow-xl">
                <p className="text-white text-sm font-medium">{data.name}</p>
                <p className="text-neutral-300 text-xs">{formatCurrency(data.value)}</p>
                <p className="text-neutral-400 text-xs">{percent}% of portfolio</p>
            </div>
        );
    };

    const BarTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; dataKey: string }>; label?: string }) => {
        if (!active || !payload || !payload.length) return null;
        return (
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 shadow-xl">
                <p className="text-white text-sm font-medium mb-1">{label}</p>
                {payload.map((entry, i) => (
                    <p key={i} className="text-neutral-300 text-xs">
                        {entry.dataKey === "investment" ? "Investment" : "Present Value"}:{" "}
                        {formatCurrency(entry.value)}
                    </p>
                ))}
            </div>
        );
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8" id="charts-section">
            <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 mb-4">
                    Sector Allocation
                </h3>
                <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={65}
                            outerRadius={110}
                            paddingAngle={3}
                            dataKey="value"
                            stroke="none"
                            animationBegin={0}
                            animationDuration={800}
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} opacity={0.85} />
                            ))}
                        </Pie>
                        <Tooltip content={<PieTooltip />} />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            formatter={(value: string) => (
                                <span className="text-neutral-400 text-xs">{value}</span>
                            )}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 mb-4">
                    Investment vs Present Value
                </h3>
                <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={barData} barCategoryGap="20%">
                        <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                        <XAxis
                            dataKey="name"
                            tick={{ fill: "#737373", fontSize: 11 }}
                            axisLine={{ stroke: "#404040" }}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{ fill: "#737373", fontSize: 11 }}
                            axisLine={{ stroke: "#404040" }}
                            tickLine={false}
                            tickFormatter={(value) =>
                                value >= 100000 ? `₹${(value / 100000).toFixed(0)}L` : `₹${(value / 1000).toFixed(0)}K`
                            }
                        />
                        <Tooltip content={<BarTooltip />} />
                        <Legend
                            formatter={(value: string) => (
                                <span className="text-neutral-400 text-xs capitalize">{value === "investment" ? "Investment" : "Present Value"}</span>
                            )}
                        />
                        <Bar dataKey="investment" fill="#3B82F6" radius={[4, 4, 0, 0]} opacity={0.7} />
                        <Bar dataKey="presentValue" fill="#8B5CF6" radius={[4, 4, 0, 0]} opacity={0.7} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
