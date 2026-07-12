"use client"

import { useEffect, useState } from "react"

import type { MarketData, NewsItem, StockQuote } from "./market-types"
import { MARKET_SNAPSHOT } from "./market-snapshot"

// Robinhood-replica panel for the "my trading portfolio" note. Like the rest
// of Kaynote it is a deliberate design-system exception — do not reuse these
// styles elsewhere. Data comes from /api/kynotes/market (refreshed daily);
// the bundled snapshot is the offline fallback. Share counts are masked on
// purpose — only tickers and market prices are real.
const GREEN = "#00c805"
const RED = "#ff5000"
const TEXT = "#f5f5f7"
const MUTED = "#9c9ca0"
const BORDER = "#2d2d2f"

function timeAgo(iso: string): string {
  const mins = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60000))
  if (mins < 60) return `${mins}m`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours}h`
  return `${Math.round(hours / 24)}d`
}

function fmtPrice(n: number): string {
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function fmtPct(n: number, withSign: boolean): string {
  const abs = Math.abs(n).toFixed(2)
  if (!withSign) return `${abs}%`
  return `${n >= 0 ? "+" : "-"}${abs}%`
}

function Sparkline({ quote }: { quote: StockQuote }) {
  const w = 74
  const h = 30
  const data = quote.closes.length >= 2 ? quote.closes : [quote.prevClose, quote.price]
  const min = Math.min(...data, quote.prevClose)
  const max = Math.max(...data, quote.prevClose)
  const range = max - min || 1
  const x = (i: number) => (i / (data.length - 1)) * w
  const y = (v: number) => h - 2 - ((v - min) / range) * (h - 4)
  const points = data.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ")
  const color = quote.changePct >= 0 ? GREEN : RED
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      <line
        x1="0"
        x2={w}
        y1={y(quote.prevClose)}
        y2={y(quote.prevClose)}
        stroke="#5a5a5e"
        strokeWidth="1"
        strokeDasharray="1.5 3"
      />
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.4" />
    </svg>
  )
}

function Arrow({ up }: { up: boolean }) {
  return (
    <span className="rh-arrow" style={{ color: up ? GREEN : RED }}>
      {up ? "▲" : "▼"}
    </span>
  )
}

function NewsRow({ item, quotes }: { item: NewsItem; quotes: Map<string, StockQuote> }) {
  const q = quotes.get(item.symbol)
  return (
    <a className="rh-news-item" href={item.link} target="_blank" rel="noopener noreferrer">
      <span className="rh-news-meta">
        <b>{item.source}</b> {timeAgo(item.pubDate)}
      </span>
      <span className="rh-news-headline">{item.title}</span>
      {q && (
        <span className="rh-news-ticker">
          {item.symbol} <Arrow up={q.changePct >= 0} />{" "}
          <span style={{ color: q.changePct >= 0 ? GREEN : RED }}>
            {fmtPct(q.changePct, false)}
          </span>
        </span>
      )}
    </a>
  )
}

// Fetched once per page load, then kept here so re-opening the note is
// instant (the panel remounts on every note switch).
let sessionData: MarketData | null = null

export default function TradingPanel() {
  const [data, setData] = useState<MarketData | null>(null)

  useEffect(() => {
    if (sessionData) {
      setData(sessionData)
      return
    }
    let alive = true
    // paint yesterday's bundled snapshot immediately — no skeleton wait —
    // and swap in fresh numbers when the API answers
    setData(MARKET_SNAPSHOT)
    fetch("/api/kynotes/market")
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
      .then((fresh: MarketData) => {
        sessionData = fresh
        if (alive) setData(fresh)
      })
      .catch(() => {
        // API unreachable: the snapshot already on screen stays
        sessionData = MARKET_SNAPSHOT
      })
    return () => {
      alive = false
    }
  }, [])

  const quotes = new Map((data?.stocks ?? []).map((q) => [q.symbol, q]))

  return (
    <div className="rh">
      {/* ── top nav ── */}
      <div className="rh-nav">
        <a
          className="rh-legend"
          href="https://robinhood.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Robinhood Legend ↗
        </a>
        <a
          className="rh-nav-account"
          href="https://robinhood.com/login"
          target="_blank"
          rel="noopener noreferrer"
        >
          Account
        </a>
      </div>

      {data === null ? (
        <div className="rh-loading">
          {[0, 1, 2, 3, 4].map((i) => (
            <span className="rh-skel" key={i} style={{ width: `${88 - i * 9}%` }} />
          ))}
        </div>
      ) : (
        <>
          {/* ── index strip ── */}
          <div className="rh-strip">
            {data.indices.map((ix) => (
              <span className="rh-index" key={ix.symbol}>
                <b>{ix.label}</b>
                <span className="rh-index-price">
                  {ix.symbol === "BTC-USD" ? fmtPrice(ix.price) : ix.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <Arrow up={ix.changePct >= 0} />
                <span style={{ color: ix.changePct >= 0 ? GREEN : RED }}>
                  {fmtPct(ix.changePct, false)}
                </span>
              </span>
            ))}
          </div>

          <div className="rh-grid">
            {/* ── news ── */}
            <div className="rh-news">
              <div className="rh-news-title">
                News <span className="rh-info">ⓘ</span>
              </div>
              {data.news.length === 0 && (
                <span className="rh-news-meta">no headlines right now, market is quiet :)</span>
              )}
              {data.news.map((item) => (
                <NewsRow item={item} quotes={quotes} key={item.link} />
              ))}
            </div>

            {/* ── stocks watchlist ── */}
            <div className="rh-stocks">
              <div className="rh-stocks-title">Stocks</div>
              {data.stocks.map((q) => (
                <a
                  className="rh-stock-row"
                  key={q.symbol}
                  href={`https://robinhood.com/stocks/${q.symbol}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="rh-stock-name">
                    <b>{q.symbol}</b>
                    <span className="rh-shares">** shares</span>
                  </span>
                  <Sparkline quote={q} />
                  <span className="rh-stock-price">
                    <b>{fmtPrice(q.price)}</b>
                    <span style={{ color: q.changePct >= 0 ? GREEN : RED }}>
                      {fmtPct(q.changePct, true)}
                    </span>
                  </span>
                </a>
              ))}
              <div className="rh-lists">
                Lists <span className="rh-lists-plus">＋</span>
              </div>
            </div>
          </div>

          <div className="rh-foot">
            prices &amp; headlines auto-update daily via yahoo finance · as of{" "}
            {new Date(data.asOf).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}{" "}
            · share counts are masked on purpose · not financial advice :)
          </div>
        </>
      )}

      {/* global (rh- prefixed) because scoped styled-jsx doesn't reach
          child components like NewsRow/Sparkline */}
      <style jsx global>{`
        .rh {
          color: ${TEXT};
          margin-top: 8px;
        }

        /* ── nav ── */
        .rh-nav {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 4px 0 16px;
          border-bottom: 1px solid ${BORDER};
        }
        .rh-legend {
          flex-shrink: 0;
          background: #ccff00;
          color: #000;
          font-size: 12px;
          font-weight: 700;
          border-radius: 999px;
          padding: 6px 12px;
          white-space: nowrap;
          text-decoration: none;
        }
        .rh-legend:hover {
          background: #e0ff4f;
        }
        .rh-nav-account {
          margin-left: auto;
          font-size: 13px;
          font-weight: 600;
          color: ${TEXT};
          text-decoration: none;
          white-space: nowrap;
        }
        .rh-nav-account:hover {
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        /* ── loading skeleton ── */
        .rh-loading {
          display: flex;
          flex-direction: column;
          gap: 14px;
          padding: 24px 0;
        }
        .rh-skel {
          height: 16px;
          border-radius: 4px;
          background: #202022;
          animation: rh-pulse 1.2s ease-in-out infinite;
        }
        @keyframes rh-pulse {
          0%,
          100% {
            opacity: 0.55;
          }
          50% {
            opacity: 1;
          }
        }

        /* ── index strip ── */
        .rh-strip {
          display: flex;
          flex-wrap: wrap;
          gap: 12px 36px;
          background: #1b1b1d;
          border-radius: 10px;
          padding: 16px 20px;
          margin: 20px 0 8px;
          font-size: 14px;
        }
        .rh-index {
          display: flex;
          align-items: baseline;
          gap: 8px;
        }
        .rh-index b {
          font-weight: 700;
        }
        .rh-index-price {
          color: ${TEXT};
        }
        .rh-arrow {
          font-size: 9px;
        }

        /* ── layout ── */
        .rh-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 320px;
          gap: 32px;
          align-items: start;
          margin-top: 16px;
        }

        /* ── news ── */
        .rh-news-title {
          font-size: 24px;
          font-weight: 700;
          padding: 8px 0 14px;
          border-bottom: 1px solid ${BORDER};
        }
        .rh-info {
          font-size: 13px;
          color: ${MUTED};
          font-weight: 400;
        }
        .rh-news-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 16px 0;
          border-bottom: 1px solid ${BORDER};
          text-decoration: none;
          color: ${TEXT};
        }
        .rh-news-item:hover .rh-news-headline {
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .rh-news-meta {
          font-size: 12px;
          color: ${MUTED};
        }
        .rh-news-meta b {
          color: ${TEXT};
          font-weight: 600;
          margin-right: 4px;
        }
        .rh-news-headline {
          font-size: 16px;
          font-weight: 600;
          line-height: 1.35;
        }
        .rh-news-ticker {
          font-size: 12px;
          font-weight: 700;
          color: ${TEXT};
        }

        /* ── stocks ── */
        .rh-stocks {
          border: 1px solid ${BORDER};
          border-radius: 12px;
          padding: 4px 16px 0;
        }
        .rh-stocks-title {
          font-size: 15px;
          font-weight: 700;
          padding: 12px 0;
          border-bottom: 1px solid ${BORDER};
        }
        .rh-stock-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 0 -10px;
          padding: 9px 10px;
          border-radius: 8px;
          text-decoration: none;
          color: ${TEXT};
        }
        .rh-stock-row:hover {
          background: #1a1a1c;
        }
        .rh-stock-name {
          display: flex;
          flex-direction: column;
          gap: 2px;
          width: 62px;
          flex-shrink: 0;
        }
        .rh-stock-name b {
          font-size: 13px;
          font-weight: 700;
        }
        .rh-shares {
          font-size: 12px;
          color: ${MUTED};
        }
        .rh-stock-price {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 2px;
          margin-left: auto;
          font-size: 13px;
        }
        .rh-stock-price b {
          font-weight: 600;
        }
        .rh-lists {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 15px;
          font-weight: 700;
          padding: 12px 0 14px;
          border-top: 1px solid ${BORDER};
          margin-top: 4px;
        }
        .rh-lists-plus {
          color: ${MUTED};
          font-weight: 400;
        }

        .rh-foot {
          font-size: 12px;
          color: ${MUTED};
          margin-top: 28px;
        }

        @media (max-width: 900px) {
          .rh-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }
      `}</style>
    </div>
  )
}
