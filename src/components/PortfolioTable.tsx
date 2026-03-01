"use client";

import React, { useState, useMemo } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getExpandedRowModel,
    flexRender,
    ColumnDef,
    SortingState,
} from "@tanstack/react-table";
import { SectorSummary, StockWithMarketData } from "@/types/portfolio";
import { sectorColors } from "@/data/portfolio";
import {
    formatCurrency,
    formatNumber,
    formatPercent,
    getGainLossClass,
} from "@/utils/formatters";
import { LuChevronRight } from "react-icons/lu";

interface PortfolioTableProps {
    sectors: SectorSummary[];
}

export default function PortfolioTable({ sectors }: PortfolioTableProps) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [expandedSectors, setExpandedSectors] = useState<Set<string>>(
        new Set(sectors.map((s) => s.sector))
    );

    const toggleSector = (sector: string) => {
        setExpandedSectors((prev) => {
            const next = new Set(prev);
            if (next.has(sector)) next.delete(sector);
            else next.add(sector);
            return next;
        });
    };

    const columns = useMemo<ColumnDef<StockWithMarketData>[]>(
        () => [
            {
                accessorKey: "name",
                header: "Particulars",
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-white">{row.original.name}</span>
                    </div>
                ),
                size: 160,
            },
            {
                accessorKey: "purchasePrice",
                header: "Purchase Price",
                cell: ({ getValue }) => (
                    <span className="text-neutral-300">{formatCurrency(getValue() as number)}</span>
                ),
                size: 130,
            },
            {
                accessorKey: "quantity",
                header: "Qty",
                cell: ({ getValue }) => (
                    <span className="text-neutral-300">{getValue() as number}</span>
                ),
                size: 60,
            },
            {
                accessorKey: "investment",
                header: "Investment",
                cell: ({ getValue }) => (
                    <span className="text-neutral-300 font-medium">{formatCurrency(getValue() as number)}</span>
                ),
                size: 130,
            },
            {
                accessorKey: "portfolioPercent",
                header: "Portfolio %",
                cell: ({ getValue }) => (
                    <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5 rounded-full bg-neutral-700 overflow-hidden">
                            <div
                                className="h-full rounded-full bg-linear-to-r from-blue-500 to-purple-500 transition-all duration-500"
                                style={{ width: `${Math.min((getValue() as number), 100)}%` }}
                            />
                        </div>
                        <span className="text-neutral-400 text-xs">
                            {formatNumber(getValue() as number, 1)}%
                        </span>
                    </div>
                ),
                size: 120,
            },
            {
                accessorKey: "symbol",
                header: "NSE/BSE",
                cell: ({ getValue }) => (
                    <span className="text-xs font-mono text-neutral-500 bg-neutral-800 px-1.5 py-0.5 rounded">
                        {(getValue() as string).replace(/\.(NS|BO)$/, "")}
                    </span>
                ),
                size: 120,
            },
            {
                accessorKey: "cmp",
                header: "CMP",
                cell: ({ getValue }) => {
                    const value = getValue() as number | null;
                    return (
                        <span className={`font-semibold ${value !== null ? "text-white" : "text-neutral-500"}`}>
                            {value !== null ? formatCurrency(value) : (
                                <span className="inline-flex items-center gap-1">
                                    <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                                    <span className="text-xs">Loading</span>
                                </span>
                            )}
                        </span>
                    );
                },
                size: 130,
            },
            {
                accessorKey: "presentValue",
                header: "Present Value",
                cell: ({ getValue }) => (
                    <span className="text-neutral-300 font-medium">
                        {formatCurrency(getValue() as number | null)}
                    </span>
                ),
                size: 130,
            },
            {
                accessorKey: "gainLoss",
                header: "Gain/Loss",
                cell: ({ row }) => {
                    const value = row.original.gainLoss;
                    const percent = row.original.gainLossPercent;
                    return (
                        <div className="space-y-0.5">
                            <span className={`font-semibold ${getGainLossClass(value)}`}>
                                {formatCurrency(value)}
                            </span>
                            {percent !== null && (
                                <p className={`text-xs ${getGainLossClass(value)}`}>
                                    {formatPercent(percent)}
                                </p>
                            )}
                        </div>
                    );
                },
                size: 130,
            },
            {
                accessorKey: "peRatio",
                header: "P/E Ratio",
                cell: ({ getValue }) => (
                    <span className="text-neutral-400">
                        {formatNumber(getValue() as number | null, 2)}
                    </span>
                ),
                size: 90,
            },
            {
                accessorKey: "latestEarnings",
                header: "EPS",
                cell: ({ getValue }) => (
                    <span className="text-neutral-400">
                        {formatNumber(getValue() as number | null, 2)}
                    </span>
                ),
                size: 90,
            },
        ],
        []
    );

    return (
        <div className="space-y-4" id="portfolio-table">
            {sectors.map((sector) => {
                const isExpanded = expandedSectors.has(sector.sector);
                const colors = sectorColors[sector.sector] || sectorColors.Others;

                return (
                    <div
                        key={sector.sector}
                        id={`sector-${sector.sector.toLowerCase()}`}
                        className="rounded-xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm overflow-hidden transition-all duration-300"
                    >
                        {/* Sector Header */}
                        <button
                            onClick={() => toggleSector(sector.sector)}
                            className={`w-full flex items-center justify-between p-4 ${colors.bg} border-b ${colors.border} hover:bg-white/5 transition-colors duration-200`}
                            id={`sector-toggle-${sector.sector.toLowerCase()}`}
                        >
                            <div className="flex items-center gap-3">
                                <LuChevronRight
                                    className={`w-4 h-4 transition-transform duration-200 text-neutral-400 ${isExpanded ? "rotate-90" : ""}`}
                                />
                                <span className={`text-sm font-bold uppercase tracking-wider ${colors.text}`}>
                                    {sector.sector} Sector
                                </span>
                                <span className="text-xs text-neutral-500 bg-neutral-800 px-2 py-0.5 rounded-full">
                                    {sector.stocks.length} stocks
                                </span>
                            </div>

                            {/* Sector Summary */}
                            <div className="flex items-center gap-6 text-xs">
                                <div className="text-right">
                                    <span className="text-neutral-500 block">Investment</span>
                                    <span className="text-neutral-300 font-medium">
                                        {formatCurrency(sector.totalInvestment)}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="text-neutral-500 block">Present Value</span>
                                    <span className="text-neutral-300 font-medium">
                                        {formatCurrency(sector.totalPresentValue)}
                                    </span>
                                </div>
                                <div className="text-right min-w-[100px]">
                                    <span className="text-neutral-500 block">Gain/Loss</span>
                                    <span className={`font-semibold ${getGainLossClass(sector.gainLoss)}`}>
                                        {formatCurrency(sector.gainLoss)}
                                        {sector.gainLossPercent !== null && (
                                            <span className="ml-1">({formatPercent(sector.gainLossPercent)})</span>
                                        )}
                                    </span>
                                </div>
                            </div>
                        </button>

                        {isExpanded && (
                            <SectorTable stocks={sector.stocks} columns={columns} sorting={sorting} setSorting={setSorting} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

function SectorTable({
    stocks,
    columns,
    sorting,
    setSorting,
}: {
    stocks: StockWithMarketData[];
    columns: ColumnDef<StockWithMarketData>[];
    sorting: SortingState;
    setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
}) {
    const table = useReactTable({
        data: stocks,
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
    });

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id} className="border-b border-neutral-800">
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 cursor-pointer hover:text-neutral-300 transition-colors select-none"
                                    style={{ width: header.getSize() }}
                                    onClick={header.column.getToggleSortingHandler()}
                                >
                                    <div className="flex items-center gap-1">
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                        {{
                                            asc: " ↑",
                                            desc: " ↓",
                                        }[header.column.getIsSorted() as string] ?? ""}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row, index) => (
                        <tr
                            key={row.id}
                            className={`border-b border-neutral-800/50 hover:bg-white/5 transition-colors duration-150 ${index % 2 === 0 ? "bg-neutral-900/30" : ""
                                }`}
                        >
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id} className="px-4 py-3 text-sm whitespace-nowrap">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
