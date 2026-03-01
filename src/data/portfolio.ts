import { StockHolding } from "@/types/portfolio";

// Portfolio data from the Excel sheet
export const portfolioData: StockHolding[] = [
    // Financial Sector
    { id: 1, name: "HDFC Bank", purchasePrice: 1490, quantity: 50, sector: "Financial", symbol: "HDFCBANK.NS" },
    { id: 2, name: "Bajaj Finance", purchasePrice: 6466, quantity: 15, sector: "Financial", symbol: "BAJFINANCE.NS" },
    { id: 3, name: "ICICI Bank", purchasePrice: 780, quantity: 84, sector: "Financial", symbol: "ICICIBANK.NS" },
    { id: 4, name: "Bajaj Housing", purchasePrice: 130, quantity: 504, sector: "Financial", symbol: "BAJAJHFL.NS" },
    { id: 5, name: "Savani Financials", purchasePrice: 24, quantity: 1080, sector: "Financial", symbol: "SAVANI.BO" },

    // Tech Sector
    { id: 6, name: "Affle India", purchasePrice: 1151, quantity: 50, sector: "Technology", symbol: "AFFLE.NS" },
    { id: 7, name: "LTI Mindtree", purchasePrice: 4775, quantity: 16, sector: "Technology", symbol: "LTIM.NS" },
    { id: 8, name: "KPIT Tech", purchasePrice: 672, quantity: 61, sector: "Technology", symbol: "KPITTECH.NS" },
    { id: 9, name: "Tata Tech", purchasePrice: 1072, quantity: 63, sector: "Technology", symbol: "TATATECH.NS" },
    { id: 10, name: "BLS E-Services", purchasePrice: 232, quantity: 191, sector: "Technology", symbol: "BLSE.NS" },
    { id: 11, name: "Tanla", purchasePrice: 1134, quantity: 45, sector: "Technology", symbol: "TANLA.NS" },

    // Consumer Sector
    { id: 12, name: "Dmart", purchasePrice: 3777, quantity: 27, sector: "Consumer", symbol: "DMART.NS" },
    { id: 13, name: "Tata Consumer", purchasePrice: 845, quantity: 90, sector: "Consumer", symbol: "TATACONSUM.NS" },
    { id: 14, name: "Pidilite", purchasePrice: 2376, quantity: 36, sector: "Consumer", symbol: "PIDILITIND.NS" },

    // Power Sector
    { id: 15, name: "Tata Power", purchasePrice: 224, quantity: 225, sector: "Power", symbol: "TATAPOWER.NS" },
    { id: 16, name: "KPI Green", purchasePrice: 875, quantity: 50, sector: "Power", symbol: "KPIGREEN.NS" },
    { id: 17, name: "Suzlon", purchasePrice: 44, quantity: 450, sector: "Power", symbol: "SUZLON.NS" },
    { id: 18, name: "Gensol", purchasePrice: 998, quantity: 45, sector: "Power", symbol: "GENSOL.NS" },

    // Pipe Sector
    { id: 19, name: "Hariom Pipes", purchasePrice: 580, quantity: 60, sector: "Pipes", symbol: "HARIOMPIPE.NS" },
    { id: 20, name: "Astral", purchasePrice: 1517, quantity: 56, sector: "Pipes", symbol: "ASTRAL.NS" },
    { id: 21, name: "Polycab", purchasePrice: 2818, quantity: 28, sector: "Pipes", symbol: "POLYCAB.NS" },

    // Others
    { id: 22, name: "Clean Science", purchasePrice: 1610, quantity: 32, sector: "Others", symbol: "CLEAN.NS" },
    { id: 23, name: "Deepak Nitrite", purchasePrice: 2248, quantity: 27, sector: "Others", symbol: "DEEPAKNTR.NS" },
    { id: 24, name: "Fine Organic", purchasePrice: 4284, quantity: 16, sector: "Others", symbol: "FINEORG.NS" },
    { id: 25, name: "Gravita", purchasePrice: 2037, quantity: 8, sector: "Others", symbol: "GRAVITA.NS" },
    { id: 26, name: "SBI Life", purchasePrice: 1197, quantity: 49, sector: "Others", symbol: "SBILIFE.NS" },
];

// Sector display order
export const sectorOrder = ["Financial", "Technology", "Consumer", "Power", "Pipes", "Others"];

// Sector color mapping for visual differentiation
export const sectorColors: Record<string, { bg: string; border: string; text: string }> = {
    Financial: { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-400" },
    Technology: { bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-400" },
    Consumer: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400" },
    Power: { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-400" },
    Pipes: { bg: "bg-cyan-500/10", border: "border-cyan-500/30", text: "text-cyan-400" },
    Others: { bg: "bg-slate-500/10", border: "border-slate-500/30", text: "text-slate-400" },
};
