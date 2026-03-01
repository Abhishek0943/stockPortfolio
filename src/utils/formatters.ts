
export function formatCurrency(value: number | null): string {
    if (value === null) return "—";
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}

export function formatNumber(value: number | null, decimals = 2): string {
    if (value === null) return "—";
    return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(value);
}

export function formatPercent(value: number | null): string {
    if (value === null) return "—";
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(2)}%`;
}

export function getGainLossClass(value: number | null): string {
    if (value === null) return "text-slate-400";
    if (value > 0) return "text-emerald-400";
    if (value < 0) return "text-red-400";
    return "text-slate-400";
}

export function formatRelativeTime(isoString: string | null): string {
    if (!isoString) return "Never";
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);

    if (diffSecs < 5) return "Just now";
    if (diffSecs < 60) return `${diffSecs}s ago`;
    if (diffSecs < 3600) return `${Math.floor(diffSecs / 60)}m ago`;
    return date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
    });
}
