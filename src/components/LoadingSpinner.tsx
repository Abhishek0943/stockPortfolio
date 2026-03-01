"use client";

import React from "react";
import { LuTrendingUp, LuTriangleAlert, LuRefreshCcw } from "react-icons/lu";

interface LoadingSpinnerProps {
    message?: string;
}

export default function LoadingSpinner({ message = "Loading portfolio data..." }: LoadingSpinnerProps) {
    return (
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center" id="loading-screen">
            <div className="text-center space-y-6">
                <div className="relative inline-block">
                    <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center animate-pulse shadow-xl shadow-blue-500/30">
                        <LuTrendingUp className="w-8 h-8 text-white" />
                    </div>

                    <div className="absolute inset-0 -m-2">
                        <div className="w-20 h-20 border-2 border-transparent border-t-blue-500 border-r-purple-500 rounded-full animate-spin" />
                    </div>
                </div>

                <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-white">{message}</h2>
                    <p className="text-sm text-neutral-400">
                        Fetching real-time market data from Yahoo Finance...
                    </p>
                </div>

                <div className="w-64 mx-auto h-1 rounded-full bg-neutral-800 overflow-hidden">
                    <div className="h-full w-1/3 rounded-full bg-linear-to-r from-blue-500 to-purple-500 animate-loading-bar" />
                </div>
            </div>
        </div>
    );
}

export function ErrorDisplay({ message, onRetry }: { message: string; onRetry: () => void }) {
    return (
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center" id="error-screen">
            <div className="text-center space-y-6 max-w-md">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-linear-to-br from-red-500/20 to-red-800/20 border border-red-500/30 flex items-center justify-center">
                    <LuTriangleAlert className="w-8 h-8 text-red-400" />
                </div>

                <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-white">Unable to Load Data</h2>
                    <p className="text-sm text-neutral-400">{message}</p>
                    <p className="text-xs text-neutral-500">
                        This may be due to API rate limiting or network issues. The dashboard
                        will automatically retry fetching data.
                    </p>
                </div>

                <button
                    onClick={onRetry}
                    id="retry-button"
                    className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-linear-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-500 hover:to-purple-500 active:scale-95 transition-all duration-200 shadow-lg shadow-blue-500/20"
                >
                    <LuRefreshCcw className="w-4 h-4" />
                    Retry
                </button>
            </div>
        </div>
    );
}
