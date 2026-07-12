// Shared shape for the trading-note market data: produced by
// app/api/kaynote/market/route.ts, consumed by trading-panel.tsx,
// with market-snapshot.ts as the bundled fallback.

export type StockQuote = {
  symbol: string
  price: number
  prevClose: number
  changePct: number
  closes: number[] // intraday closes, downsampled, for the sparkline
}

export type IndexQuote = {
  symbol: string
  label: string
  price: number
  changePct: number
}

export type NewsItem = {
  title: string
  link: string
  source: string
  pubDate: string // ISO
  symbol: string
}

export type MarketData = {
  asOf: string // ISO
  indices: IndexQuote[]
  stocks: StockQuote[]
  news: NewsItem[]
}
