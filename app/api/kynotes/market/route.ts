import { NextResponse } from "next/server"
import type { IndexQuote, MarketData, NewsItem, StockQuote } from "../../../kynotes/market-types"

// Refreshes once a day (ISR): the first request after 24h re-fetches from
// Yahoo Finance, everyone else gets the cached copy. No API key needed.
// Quotes come from ONE batched `spark` call — Yahoo 429s bursts of
// per-symbol requests, so never fan out one request per ticker here.
export const revalidate = 86400
export const maxDuration = 30

// Keep this UA short and generic. Yahoo's rate limiter scores browser-like
// UAs from non-browser clients much harder — the plain one sails through.
const HEADERS = { "User-Agent": "Mozilla/5.0" }

const TICKERS = [
  "NVDA", "GOOGL", "HOOD", "ORCL", "CRM", "HSAI", "AMBA",
  "MBLY", "ASML", "QCOM", "CLSK", "MU", "NBIS", "SLV",
]

const INDICES: [symbol: string, label: string][] = [
  ["^GSPC", "S&P 500"],
  ["^NDX", "Nasdaq-100"],
  ["BTC-USD", "Bitcoin"],
]

// A handful of feeds is plenty; headlines overlap heavily across tickers.
const NEWS_FEEDS = ["NVDA", "GOOGL", "ASML", "HOOD", "MU"]

const SOURCE_NAMES: Record<string, string> = {
  "fool.com": "The Motley Fool",
  "benzinga.com": "Benzinga",
  "simplywall.st": "Simply Wall St",
  "finance.yahoo.com": "Yahoo Finance",
  "yahoo.com": "Yahoo Finance",
  "investors.com": "Investor's Business Daily",
  "marketwatch.com": "MarketWatch",
  "cnbc.com": "CNBC",
  "reuters.com": "Reuters",
  "barrons.com": "Barron's",
  "wsj.com": "WSJ",
  "bloomberg.com": "Bloomberg",
  "insidermonkey.com": "Insider Monkey",
  "zacks.com": "Zacks",
  "thestreet.com": "TheStreet",
  "investopedia.com": "Investopedia",
  "businessinsider.com": "Business Insider",
  "gurufocus.com": "GuruFocus",
  "tipranks.com": "TipRanks",
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

function parseChartResult(symbol: string, resp: unknown): StockQuote | null {
  const result = resp as {
    meta?: { regularMarketPrice?: number; previousClose?: number; chartPreviousClose?: number }
    indicators?: { quote?: { close?: (number | null)[] }[] }
  } | null
  const meta = result?.meta
  const price = meta?.regularMarketPrice
  const prevClose = meta?.previousClose ?? meta?.chartPreviousClose
  if (typeof price !== "number" || typeof prevClose !== "number" || prevClose === 0) return null
  const raw = result?.indicators?.quote?.[0]?.close ?? []
  const closes = raw.filter((n): n is number => typeof n === "number")
  const step = Math.max(1, Math.ceil(closes.length / 40))
  return {
    symbol,
    price,
    prevClose,
    changePct: ((price - prevClose) / prevClose) * 100,
    closes: closes.filter((_, i) => i % step === 0),
  }
}

/** One batched request for every symbol's price, previous close and intraday closes. */
async function fetchSpark(symbols: string[]): Promise<Map<string, StockQuote>> {
  const query = `v7/finance/spark?symbols=${encodeURIComponent(symbols.join(","))}&range=1d&interval=15m`
  let res: Response | null = null
  for (const host of ["query1", "query2"]) {
    res = await fetch(`https://${host}.finance.yahoo.com/${query}`, {
      headers: HEADERS,
      next: { revalidate: 86400 },
    })
    if (res.ok) break
    await sleep(2000)
  }
  if (!res || !res.ok) throw new Error(`spark: HTTP ${res?.status}`)
  const json = await res.json()
  const quotes = new Map<string, StockQuote>()
  for (const entry of json?.spark?.result ?? []) {
    const q = parseChartResult(entry.symbol, entry?.response?.[0])
    if (q) quotes.set(entry.symbol, q)
  }
  return quotes
}

/**
 * Fallback when the batched spark call is rate-limited: Yahoo's limiter
 * scores big multi-symbol requests much harder than single-symbol ones,
 * so one-at-a-time usually still works.
 */
async function fetchChartsIndividually(symbols: string[]): Promise<Map<string, StockQuote>> {
  const quotes = new Map<string, StockQuote>()
  for (const symbol of symbols) {
    try {
      const url = `https://query2.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=1d&interval=15m`
      const res = await fetch(url, { headers: HEADERS, next: { revalidate: 86400 } })
      if (res.ok) {
        const json = await res.json()
        const q = parseChartResult(symbol, json?.chart?.result?.[0])
        if (q) quotes.set(symbol, q)
      }
    } catch {
      // skip this symbol; the panel just shows one row fewer
    }
    await sleep(250)
  }
  return quotes
}

function decodeEntities(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .trim()
}

function sourceFromLink(link: string): string {
  try {
    const host = new URL(link).hostname.replace(/^www\./, "")
    if (SOURCE_NAMES[host]) return SOURCE_NAMES[host]
    const parent = host.split(".").slice(-2).join(".")
    if (SOURCE_NAMES[parent]) return SOURCE_NAMES[parent]
    const name = parent.split(".")[0]
    return name.charAt(0).toUpperCase() + name.slice(1)
  } catch {
    return "News"
  }
}

async function fetchNews(symbol: string): Promise<NewsItem[]> {
  const url = `https://feeds.finance.yahoo.com/rss/2.0/headline?s=${encodeURIComponent(symbol)}&region=US&lang=en-US`
  const res = await fetch(url, { headers: HEADERS, next: { revalidate: 86400 } })
  if (!res.ok) throw new Error(`${symbol} rss: HTTP ${res.status}`)
  const xml = await res.text()
  const items: NewsItem[] = []
  for (const [, block] of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
    const title = decodeEntities(block.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "")
    const link = decodeEntities(block.match(/<link>([\s\S]*?)<\/link>/)?.[1] ?? "")
    const pubDateRaw = block.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] ?? ""
    const pubDate = new Date(pubDateRaw)
    if (!title || !link || Number.isNaN(pubDate.getTime())) continue
    items.push({ title, link, source: sourceFromLink(link), pubDate: pubDate.toISOString(), symbol })
    if (items.length >= 5) break
  }
  return items
}

export async function GET() {
  const symbols = [...TICKERS, ...INDICES.map(([s]) => s)]
  let quotes: Map<string, StockQuote>
  try {
    quotes = await fetchSpark(symbols)
  } catch {
    quotes = await fetchChartsIndividually(symbols)
  }
  if (quotes.size === 0) {
    // Yahoo down or rate-limited: the client keeps its bundled snapshot.
    return NextResponse.json(
      { error: "market data unavailable" },
      // never cache a failure — the next request must retry Yahoo
      { status: 503, headers: { "Cache-Control": "no-store" } }
    )
  }

  const stocks = TICKERS.map((t) => quotes.get(t)).filter((q): q is StockQuote => Boolean(q))
  const indices = INDICES.flatMap(([symbol, label]): IndexQuote[] => {
    const q = quotes.get(symbol)
    return q ? [{ symbol, label, price: q.price, changePct: q.changePct }] : []
  })
  if (stocks.length === 0 || indices.length === 0) {
    return NextResponse.json(
      { error: "market data unavailable" },
      // never cache a failure — the next request must retry Yahoo
      { status: 503, headers: { "Cache-Control": "no-store" } }
    )
  }

  // News feeds fetched one at a time — parallel bursts trip Yahoo's limiter.
  const newsAll: NewsItem[] = []
  for (const feed of NEWS_FEEDS) {
    try {
      newsAll.push(...(await fetchNews(feed)))
    } catch {
      // a missing feed is fine; the panel just shows fewer headlines
    }
    await sleep(350)
  }
  const seenTitles = new Set<string>()
  const news = newsAll
    .filter((n) => {
      const key = n.title.toLowerCase()
      if (seenTitles.has(key)) return false
      seenTitles.add(key)
      return true
    })
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
    .slice(0, 8)

  const data: MarketData = { asOf: new Date().toISOString(), indices, stocks, news }
  return NextResponse.json(data, {
    headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=86400" },
  })
}
