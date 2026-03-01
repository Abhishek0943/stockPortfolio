"use client";

import React from "react";
import { formatRelativeTime } from "@/utils/formatters";
import { LuTrendingUp, LuRefreshCcw } from "react-icons/lu";

interface HeaderProps {
    lastUpdated: string | null;
    isRefreshing: boolean;
    onRefresh: () => void;
}

export default function Header({ lastUpdated, isRefreshing, onRefresh }: HeaderProps) {
    return (
        <header className="mb-8" id="dashboard-header">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <LuTrendingUp className="w-7 h-7 text-white" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-black animate-pulse" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">
                            Portfolio Dashboard
                        </h1>
                        <p className="text-sm text-neutral-400">
                            Real-time stock portfolio tracker • Auto-refreshes every 15s
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-xs text-neutral-400 bg-neutral-900 rounded-lg px-3 py-2 border border-neutral-800">
                        <div className={`w-2 h-2 rounded-full ${isRefreshing ? "bg-amber-400 animate-pulse" : "bg-emerald-400"}`} />
                        <span>
                            {isRefreshing ? "Updating..." : `Updated ${formatRelativeTime(lastUpdated)}`}
                        </span>
                    </div>

                    <button
                        onClick={onRefresh}
                        disabled={isRefreshing}
                        id="refresh-button"
                        className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-linear-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-500 hover:to-purple-500 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-blue-500/20"
                    >
                        <LuRefreshCcw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
                        Refresh
                    </button>
                </div>
            </div>
        </header>
    );
}
