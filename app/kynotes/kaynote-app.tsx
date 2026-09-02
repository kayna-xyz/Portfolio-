"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"

import IosAlert from "@/components/ios-alert"
import RestaurantMap from "./restaurant-map"
import TradingPanel from "./trading-panel"

// Kaynote is a deliberate one-page departure from the site's design system:
// an Apple Notes replica, so it uses the system SF Pro stack instead of the
// portfolio fonts. Do not reuse these styles elsewhere on the site.
const SF = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Helvetica, Arial, sans-serif'

const INK = "#1d1d1f"
const GRAY = "#8e8e93"
const LINK = "#b8860b"

type Note = {
  id: string
  title: string
  heading?: string // pane title when it should differ from the sidebar row (about → "Kayna Huang")
  snippet: string
  date: string
  searchText: string
  body: React.ReactNode
  wide?: boolean // let the body span the full note pane (e.g. the bookshelf)
  essay?: boolean // long-form note: narrower measure + draft figures in the right margin
  building?: boolean // not ready yet: the row stays listed but opens a "still building" alert instead
}

type Section = {
  label: string
  notes: Note[]
}

function NoteLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: LINK, textDecorationLine: "underline", textUnderlineOffset: "2px" }}
    >
      {children}
    </a>
  )
}

// In-app link: jumps to another note. SECTIONS is module-level so it can't
// touch component state — this dispatches an event KaynoteApp listens for.
function NoteJump({ noteId, children }: { noteId: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent("kaynotes:open-note", { detail: noteId }))}
      style={{
        color: LINK,
        textDecorationLine: "underline",
        textUnderlineOffset: "2px",
        background: "none",
        border: "none",
        padding: 0,
        font: "inherit",
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  )
}

type Book = {
  slug: string // cover file in public/kaynote/books/<slug>.webp
  title: string
  author?: string
  tag: string // genre chip shown in the hover preview
  desc: string
  h: number // spine height, px
  w: number // spine thickness, px
  bg: string // spine color, matched to the real cover
  fg: string // spine text color
  spineAuthor?: string // author lettering printed on the spine
  serif?: boolean // serif spine lettering (matches the real edition)
  bandTop?: string // printed band at the head of the spine
  bandBottom?: string // printed band at the foot of the spine
  link: string // wikipedia / douban page the spine opens on click
  tilt?: number // resting tilt, deg (a book slouching against its neighbor)
  shift?: number // extra left margin, px (negative = tucked into the neighbor)
}

// one shelf, left to right: people, business & thinking, sci-fi & dystopia.
// each spine replicates the real book: cover-matched colors, author lettering,
// printed bands, serif vs sans. tilt/shift give the row a lived-in look.
// clicking a spine opens the book's wikipedia / douban page.
const BOOKS: Book[] = [
  {
    slug: "steve-jobs",
    title: "Steve Jobs",
    author: "Walter Isaacson",
    tag: "biography",
    desc: "the definitive biography of Steve Jobs, built on more than forty interviews with Jobs himself. taste, control, and the reality distortion field.",
    link: "https://en.wikipedia.org/wiki/Steve_Jobs_(book)",
    h: 192,
    w: 30,
    bg: "#f0ede7",
    fg: "#1d1d1f",
    spineAuthor: "ISAACSON",
  },
  {
    slug: "son-masayoshi",
    title: "Aiming High",
    author: "Atsuo Inoue",
    tag: "biography",
    desc: "how Masayoshi Son built SoftBank on a 300-year vision and outrageous bets, from software distribution to the internet age.",
    link: "https://en.wikipedia.org/wiki/Masayoshi_Son",
    h: 170,
    w: 22,
    bg: "#161616",
    fg: "#f2f2f2",
    spineAuthor: "INOUE",
    tilt: -2,
  },
  {
    slug: "nvidia-huang",
    title: "黄仁勋：英伟达之芯",
    author: "斯蒂芬·威特",
    tag: "biography",
    desc: "Jensen Huang and thirty years of betting on parallel computing before the world caught up. how Nvidia became the engine of the AI era.",
    link: "https://book.douban.com/subject/37142217/",
    h: 186,
    w: 26,
    bg: "#3d9a2f",
    fg: "#ffffff",
  },
  {
    slug: "da-vinci",
    title: "Leonardo da Vinci",
    author: "Walter Isaacson",
    tag: "biography",
    desc: "Leonardo as the ultimate cross-disciplinary mind, art and science feeding each other. from the author of the Jobs biography.",
    link: "https://en.wikipedia.org/wiki/Leonardo_da_Vinci_(Isaacson_book)",
    h: 200,
    w: 32,
    bg: "#96683a",
    fg: "#f4ead8",
    serif: true,
  },
  {
    slug: "mao-zedong",
    title: "毛泽东传",
    author: "罗斯·特里尔",
    tag: "biography",
    desc: "Ross Terrill's classic biography of Mao, from a village in Hunan to the founding of modern China, with everything it cost along the way.",
    link: "https://book.douban.com/subject/5246800/",
    h: 190,
    w: 30,
    bg: "#d02418",
    fg: "#ffffff",
    spineAuthor: "罗斯·特里尔",
    serif: true,
  },
  {
    slug: "wang-xing",
    title: "王兴传",
    author: "王晶 / 陈润",
    tag: "biography",
    desc: "from Xiaonei and Fanfou to Meituan, Wang Xing kept rebuilding until one stuck. the most persistent serial founder of the Chinese internet.",
    link: "https://book.douban.com/subject/35243531/",
    h: 168,
    w: 22,
    bg: "#8f2b24",
    fg: "#f5d78e",
    tilt: 2.5,
    shift: 2,
  },
  {
    slug: "elon-musk",
    title: "Elon Musk",
    author: "Walter Isaacson",
    tag: "biography",
    desc: "Isaacson shadows Musk through Tesla, SpaceX, and Twitter, the demon mode, the risk appetite, and the cost of both.",
    link: "https://en.wikipedia.org/wiki/Elon_Musk_(book)",
    h: 196,
    w: 30,
    bg: "#101010",
    fg: "#ffffff",
    spineAuthor: "ISAACSON",
  },
  {
    slug: "zero-to-one",
    title: "Zero to One",
    author: "Peter Thiel",
    tag: "startups",
    desc: "notes on startups: competition is for losers, build a monopoly on something new. going from 0 to 1 instead of 1 to n.",
    link: "https://en.wikipedia.org/wiki/Zero_to_One",
    h: 178,
    w: 24,
    bg: "#5a6f85",
    fg: "#f2efe9",
    spineAuthor: "THIEL",
  },
  {
    slug: "duan-yongping",
    title: "段永平投资问答录",
    author: "段永平",
    tag: "investing",
    desc: "Duan Yongping's collected Q&A on business and investing. do the right thing, then do things right, and stay inside your circle of competence.",
    link: "https://book.douban.com/subject/35279134/",
    h: 192,
    w: 32,
    bg: "#3a56b4",
    fg: "#ffffff",
    bandTop: "#d94f3d",
  },
  {
    slug: "yinwei-dute",
    title: "因为独特",
    author: "李翔",
    tag: "business",
    desc: "Li Xiang's long interview with Pop Mart founder Wang Ning, why being different beats being better, and how taste and IP become a business.",
    link: "https://book.douban.com/subject/37105779/",
    h: 165,
    w: 20,
    bg: "#f2c410",
    fg: "#1d1d1f",
    spineAuthor: "李翔",
    tilt: -9,
    shift: 12,
  },
  {
    slug: "zhishen-shinei",
    title: "置身事内",
    author: "兰小欢",
    tag: "economics",
    desc: "how the Chinese government actually runs the economy, land, taxes, and local incentives explained from the inside.",
    link: "https://book.douban.com/subject/35546622/",
    h: 180,
    w: 24,
    bg: "#ece5d4",
    fg: "#8f2f27",
    spineAuthor: "兰小欢",
    serif: true,
    shift: 4,
  },
  {
    slug: "drucker-innovation",
    title: "Innovation and Entrepreneurship",
    author: "Peter F. Drucker",
    tag: "management",
    desc: "Drucker on innovation as a discipline instead of a flash of genius, where opportunities come from and how entrepreneurs find them.",
    link: "https://en.wikipedia.org/wiki/Peter_Drucker",
    h: 212,
    w: 28,
    bg: "#3a75b0",
    fg: "#f7f1dd",
  },
  {
    slug: "paranoid",
    title: "Only the Paranoid Survive",
    author: "Andrew S. Grove",
    tag: "management",
    desc: "Andy Grove on strategic inflection points, when the rules change 10x and only the paranoid survive. Intel's survival playbook.",
    link: "https://en.wikipedia.org/wiki/Only_the_Paranoid_Survive",
    h: 178,
    w: 24,
    bg: "#1a1210",
    fg: "#efe9e0",
    bandTop: "#a5211d",
  },
  {
    slug: "good-to-great",
    title: "Good to Great",
    author: "Jim Collins",
    tag: "business",
    desc: "Jim Collins on why some good companies make the leap and others don't. level 5 leaders, the flywheel, and the hedgehog concept.",
    link: "https://en.wikipedia.org/wiki/Good_to_Great",
    h: 186,
    w: 28,
    bg: "#e5391f",
    fg: "#ffffff",
    spineAuthor: "COLLINS",
    shift: -2,
  },
  {
    slug: "airbnb",
    title: "The Airbnb Story",
    author: "Leigh Gallagher",
    tag: "startups",
    desc: "how three designers turned air mattresses into a global hospitality giant, and kept the culture weird along the way.",
    link: "https://book.douban.com/subject/26944844/",
    h: 190,
    w: 24,
    bg: "#2b4fa0",
    fg: "#ffffff",
    bandBottom: "#ff5a5f",
  },
  {
    slug: "excellent-sheep",
    title: "Excellent Sheep",
    author: "William Deresiewicz",
    tag: "essays",
    desc: "a critique of elite education and the students it produces, brilliant at hoop-jumping, lost at everything else.",
    link: "https://en.wikipedia.org/wiki/Excellent_Sheep",
    h: 172,
    w: 24,
    bg: "#232a4d",
    fg: "#f0ede7",
    bandTop: "#a5263a",
    tilt: -1.5,
  },
  {
    slug: "self-made-man",
    title: "Self-Made Man",
    author: "Norah Vincent",
    tag: "experiment",
    desc: "a feminist lives undercover as a man for eighteen months to see manhood from the inside. the experiment broke her, and years later she chose to end her life.",
    link: "https://en.wikipedia.org/wiki/Self-Made_Man_(book)",
    h: 179,
    w: 22,
    bg: "#3e4a5a",
    fg: "#f0ede7",
    spineAuthor: "VINCENT",
  },
  {
    slug: "metro2033",
    title: "Metro 2033",
    author: "Dmitry Glukhovsky",
    tag: "sci-fi",
    desc: "survivors live on in the Moscow metro after nuclear war wipes out the surface. claustrophobic, rule-based horror at its best.",
    link: "https://en.wikipedia.org/wiki/Metro_2033",
    h: 183,
    w: 28,
    bg: "#201014",
    fg: "#d02c22",
    spineAuthor: "GLUKHOVSKY",
  },
  {
    slug: "brave-new-world",
    title: "Brave New World",
    author: "Aldous Huxley",
    tag: "dystopia",
    desc: "a dystopia where no one has to suffer, and that is exactly the problem. happiness engineered at scale, no freedom required.",
    link: "https://en.wikipedia.org/wiki/Brave_New_World",
    h: 187,
    w: 22,
    bg: "#d8c53e",
    fg: "#1d1d1f",
    serif: true,
    bandBottom: "#2b2724",
  },
  {
    slug: "1984",
    title: "1984",
    author: "George Orwell",
    tag: "dystopia",
    desc: "Big Brother, doublethink, and the machinery of total surveillance. the world where we live right now.",
    link: "https://en.wikipedia.org/wiki/Nineteen_Eighty-Four",
    h: 162,
    w: 18,
    bg: "#eae6dc",
    fg: "#b0342a",
    spineAuthor: "ORWELL",
    serif: true,
    bandTop: "#7fb2b5",
    tilt: -3,
    shift: 2,
  },
  {
    slug: "animal-farm",
    title: "Animal Farm",
    author: "George Orwell",
    tag: "dystopia",
    desc: "the animals take over the farm, and the revolution slowly eats itself. the sharpest political fable ever written.",
    link: "https://en.wikipedia.org/wiki/Animal_Farm",
    h: 168,
    w: 20,
    bg: "#2b2724",
    fg: "#e9a8c9",
    spineAuthor: "ORWELL",
    tilt: 2,
  },
  {
    slug: "dune",
    title: "Dune",
    author: "Frank Herbert",
    tag: "sci-fi",
    desc: "a desert planet, a precious spice, and the politics of prophecy. the epic that defined modern sci-fi.",
    link: "https://en.wikipedia.org/wiki/Dune_(novel)",
    h: 176,
    w: 24,
    bg: "#d4622a",
    fg: "#f4ead8",
    spineAuthor: "HERBERT",
    shift: -2,
  },
  {
    slug: "2001",
    title: "2001: A Space Odyssey",
    author: "Arthur C. Clarke",
    tag: "sci-fi",
    desc: "from the monolith to HAL, a story about intelligence outgrowing its makers. written alongside Kubrick's film.",
    link: "https://en.wikipedia.org/wiki/2001:_A_Space_Odyssey_(novel)",
    h: 197,
    w: 28,
    bg: "#d9a44a",
    fg: "#1d1d1f",
    shift: 3,
  },
  {
    slug: "three-body",
    title: "The Three-Body Problem",
    author: "Cixin Liu",
    tag: "sci-fi",
    desc: "first contact turns into a centuries-long game of survival between civilizations. the best sci-fi in Chinese history.",
    link: "https://en.wikipedia.org/wiki/The_Three-Body_Problem_(novel)",
    h: 186,
    w: 26,
    bg: "#274a66",
    fg: "#c8e838",
  },
]

// the Columbia lion sticker hangs on the wallpaper after this many books
const LION_AFTER = 17

function Bookshelf() {
  const [preview, setPreview] = useState<{ book: Book; x: number; y: number } | null>(null)

  // the card always hangs below the hovered spine
  const showPreview = (book: Book, el: HTMLElement) => {
    const rect = el.getBoundingClientRect()
    setPreview({
      book,
      x: Math.min(Math.max(rect.left + rect.width / 2, 150), window.innerWidth - 150),
      y: rect.bottom + 25,
    })
  }

  const spine = (book: Book) => (
    <a
      key={book.slug}
      href={book.link}
      target="_blank"
      rel="noopener noreferrer"
      className={`kn-spine${book.serif ? " kn-spine-serif" : ""}`}
      style={
        {
          height: book.h,
          width: book.w,
          background: book.bg,
          color: book.fg,
          marginLeft: book.shift,
          "--tilt": `${book.tilt ?? 0}deg`,
        } as React.CSSProperties
      }
      aria-label={book.title}
      onMouseEnter={(e) => showPreview(book, e.currentTarget)}
      onMouseLeave={() => setPreview(null)}
      onFocus={(e) => showPreview(book, e.currentTarget)}
      onBlur={() => setPreview(null)}
    >
      {book.bandTop && <span className="kn-spine-band" style={{ background: book.bandTop }} />}
      <span className="kn-spine-title">{book.title}</span>
      {book.spineAuthor && <span className="kn-spine-author">{book.spineAuthor}</span>}
      {book.bandBottom && <span className="kn-spine-band" style={{ background: book.bandBottom }} />}
    </a>
  )

  return (
    <div className="kn-shelves">
      <div className="kn-shelf-scene">
        <div className="kn-shelf-scroll">
          <div className="kn-shelf-unit">
            <div className="kn-shelf-stage">
              {/* posters sit above the wallpaper only, tucked behind the shelf */}
              <img className="kn-deco-illenium" src="/kaynote/shelf/illenium.webp" alt="" width={201} height={201} aria-hidden="true" />
              <img className="kn-deco-pf" src="/kaynote/shelf/pink-floyd.webp" alt="" width={360} height={360} aria-hidden="true" />
              <img className="kn-deco-labubu" src="/kaynote/shelf/labubu.webp" alt="" width={46} height={85} aria-hidden="true" />
              <div className="kn-spines">
                {BOOKS.slice(0, LION_AFTER).map(spine)}
                <img className="kn-deco-lion" src="/kaynote/shelf/lion.webp" alt="" width={67} height={67} aria-hidden="true" />
                {BOOKS.slice(LION_AFTER).map(spine)}
              </div>
            </div>
            <div className="kn-shelf-board" />
          </div>
        </div>
      </div>

      {preview && (
        <div
          className="kn-spine-card"
          role="tooltip"
          style={{
            left: preview.x,
            top: preview.y,
            transform: "translate(-50%, 0)",
          }}
        >
          <div className="kn-spine-card-head">
            <img
              className="kn-spine-card-cover"
              src={`/kaynote/books/${preview.book.slug}.webp`}
              alt={preview.book.title}
              width={88}
              height={126}
            />
            <div>
              <p className="kn-spine-card-title">{preview.book.title}</p>
              {preview.book.author && <p className="kn-spine-card-author">{preview.book.author}</p>}
              <p className="kn-spine-card-tag">{preview.book.tag}</p>
            </div>
          </div>
          <p className="kn-spine-card-desc">{preview.book.desc}</p>
        </div>
      )}
    </div>
  )
}

type Stamp = {
  src: string
  alt: string
  caption: string // engraved lettering, bottom left
  value: string // denomination, bottom right
  ink: string // lettering color, postal blue / red like real engraved stamps
  w: number // stamp width, px — must be a multiple of the 13px perforation tile
  h: number // stamp height, px — must be a multiple of the 13px perforation tile
  rot: number // resting tilt, deg
  left: string // scatter position within the sheet
  top: number
  pos?: string // object-position for the photo crop
}

// intro photos as postage stamps scattered on a sheet of grid paper.
// perforated edges are punched by the stamp's dotted background gradient;
// stamp dimensions stay multiples of 13 so holes land exactly on every edge.
const STAMPS: Stamp[] = [
  {
    src: "/kaynote/intro/me-1.webp",
    alt: "black-and-white portrait by a window",
    caption: "K·HUANG",
    value: "1c",
    ink: "#2b35a8",
    w: 156,
    h: 169,
    rot: -8,
    left: "1%",
    top: 42,
    pos: "center 22%",
  },
  {
    src: "/kaynote/intro/me-2.webp",
    alt: "with a snowman in front of Butler Library, Columbia University",
    caption: "COLUMBIA",
    value: "13c",
    ink: "#c2451e",
    w: 156,
    h: 195,
    rot: 5,
    left: "35%",
    top: 0,
  },
  {
    src: "/kaynote/intro/me-3.webp",
    alt: "on a street in SoHo, New York",
    caption: "SOHO NYC",
    value: "5c",
    ink: "#2b35a8",
    w: 143,
    h: 182,
    rot: -6,
    left: "68%",
    top: 82,
  },
]

// Display-only scatter — the stamps are deliberately not clickable.
// ── Draft margin: photos and scribbles taped into the blank right half of the page ──
// Each figure is tied to an underlined phrase in the text by a shared footnote number.
// The figure lives inside the paragraph/list item it belongs to (`.kn-anno`, position:
// relative) and is pushed out into the margin with per-figure offsets so the column
// never looks aligned; `Essay` nudges figures apart at runtime when two would overlap.
// Everything is a <span> so a figure is valid inside <p> and <li>.
type FigProps = {
  n: number // footnote number, same as the <Mark n> it belongs to
  caption: string
  src?: string // /kaynote/essay/*.webp
  alt?: string
  width?: number
  height?: number
  w?: number // rendered photo width in the margin
  dx?: number // distance from the text column's right edge
  dy?: number // vertical nudge from the anchor's top
  tilt?: number // degrees
  stat?: string
  source?: string
}

function Fig({ n, caption, src, alt, width, height, w = 180, dx = 60, dy = 0, tilt = 0, stat, source }: FigProps) {
  return (
    <span
      className={`kn-fig${src ? " kn-fig--photo" : ""}`}
      style={{ "--w": `${w}px`, "--dx": `${dx}px`, "--dy": `${dy}px`, "--tilt": `${tilt}deg` } as React.CSSProperties}
      aria-hidden="true"
    >
      <span className="kn-fig-n">{n}</span>
      {src && <img src={src} alt={alt ?? ""} width={width} height={height} loading="lazy" />}
      {stat && <span className="kn-fig-stat">{stat}</span>}
      <span className="kn-fig-cap">{caption}</span>
      {source && <span className="kn-fig-src">{source}</span>}
    </span>
  )
}

// the phrase a figure comments on: wavy underline + the figure's footnote number.
// Without `n` it is just an underline, for a line worth remembering on its own.
function Mark({ n, children }: { n?: number; children: React.ReactNode }) {
  return (
    <>
      <span className="kn-mark">{children}</span>
      {n !== undefined && <sup className="kn-ref">{n}</sup>}
    </>
  )
}

function Essay({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const root = ref.current
    if (!root) return
    const settle = () => {
      const figs = Array.from(root.querySelectorAll<HTMLElement>(".kn-fig"))
      const margin = window.matchMedia("(min-width: 1400px)").matches
      figs.forEach((f) => (f.style.top = ""))
      if (!margin) return
      // keep figures from landing on each other (only when they share an x range)
      const placed: DOMRect[] = []
      for (const fig of figs) {
        let r = fig.getBoundingClientRect()
        let push = 0
        for (let guard = 0; guard < 12; guard++) {
          // sub-pixel slack, otherwise a figure just pushed below a neighbour keeps
          // "hitting" it and the loop never gets to the next one
          const hit = placed.find(
            (p) => r.left < p.right + 12 && r.right > p.left - 12 && r.top < p.bottom + 15 && r.bottom > p.top,
          )
          if (!hit) break
          const need = Math.ceil(hit.bottom + 16 - r.top)
          push += need
          fig.style.top = `calc(var(--dy) + ${push}px)`
          r = fig.getBoundingClientRect()
        }
        placed.push(r)
      }
    }
    settle()
    document.fonts?.ready.then(settle)
    const imgs = Array.from(root.querySelectorAll("img"))
    imgs.forEach((im) => im.addEventListener("load", settle))
    window.addEventListener("resize", settle)
    return () => {
      window.removeEventListener("resize", settle)
      imgs.forEach((im) => im.removeEventListener("load", settle))
    }
  }, [])
  return (
    <div ref={ref} className="kn-essay">
      {children}
    </div>
  )
}

// intro paragraphs with the portrait on the right; the circle's diameter equals the
// text block's height. The two depend on each other (a wider circle narrows the text,
// which adds lines), so iterate to the fixed point after mount and on resize.
// The iteration is capped: text that wraps per character (e.g. the page run through
// Chrome's translate into Chinese) gains height faster than the circle takes width, so
// without a ceiling it diverges until the portrait fills the page.
const AVATAR_MAX = 240
function IntroWithAvatar({ children }: { children: React.ReactNode }) {
  const textRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  useLayoutEffect(() => {
    const text = textRef.current
    const img = imgRef.current
    if (!text || !img) return
    const fit = () => {
      if (window.matchMedia("(max-width: 767px)").matches) return // stacked, CSS sizes it
      const row = text.parentElement
      // never let the circle take more than ~2/5 of the row, and never past the hard cap
      const max = Math.min(AVATAR_MAX, Math.floor(((row?.clientWidth ?? 840) - 40) * 0.4))
      let size = Math.min(img.offsetHeight || 200, max)
      for (let i = 0; i < 6; i++) {
        img.style.width = `${size}px`
        img.style.height = `${size}px`
        const next = Math.min(text.offsetHeight, max)
        if (Math.abs(next - size) < 1) break
        size = next
      }
    }
    fit()
    document.fonts?.ready.then(fit)
    window.addEventListener("resize", fit)
    // re-fit when the copy itself changes under us (browser translation swaps the text nodes)
    const mo = new MutationObserver(fit)
    mo.observe(text, { childList: true, characterData: true, subtree: true })
    return () => {
      window.removeEventListener("resize", fit)
      mo.disconnect()
    }
  }, [])

  return (
    <div className="kn-intro">
      <div className="kn-intro-text" ref={textRef}>
        {children}
      </div>
      <img
        ref={imgRef}
        className="kn-intro-avatar"
        src="/kaynote/me-avatar.webp"
        alt="Kayna Huang"
        width={200}
        height={200}
      />
    </div>
  )
}

function StampScatter() {
  return (
    <div className="kn-stamp-scene">
      <div className="kn-stamps">
        {STAMPS.map((s) => (
          <figure
            key={s.src}
            className="kn-stamp"
            style={
              {
                width: s.w,
                height: s.h,
                left: s.left,
                top: s.top,
                "--rot": `${s.rot}deg`,
                "--ink": s.ink,
              } as React.CSSProperties
            }
          >
            <img src={s.src} alt={s.alt} loading="lazy" style={{ objectPosition: s.pos }} />
            <figcaption>
              <span>{s.caption}</span>
              <span>{s.value}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}

type XpCard = {
  sub: string // one-liner under the name, iOS contact-card style
  desc: string
  facts: [string, string][] // label → value rows, hairline-separated
}

type XpRow = {
  id: string
  logo: string // /kaynote/logos/*.png, or a bare emoji for personal ventures
  name: string
  role?: string
  when: string
  detail: string
  card?: XpCard // hover the logo to open it; rows without one are plain
}

// public figures only — investors, ARR, valuation all come from press
// coverage (Forbes / Sacra / company announcements), never internal data
const EXPERIENCE: XpRow[] = [
  {
    id: "opusclip",
    logo: "/kaynote/logos/opusclip.svg",
    name: "OpusClip",
    role: "Design Engineering",
    when: "Summer 2026",
    detail: "Special Projects, AI Video Editor",
    card: {
      sub: "AI video editing agent",
      desc: "An AI agent that turns long-form video into short clips people actually watch. 10M+ creators, 170M+ clips generated.",
      facts: [
        ["backed by", "SoftBank Vision Fund 2, DCM, AI Grant"],
        ["ARR", "$20M, 18 months after launch"],
        ["last round", "$215M post, Series B (2025)"],
      ],
    },
  },
  {
    id: "heygen",
    logo: "/kaynote/logos/heygen.png",
    name: "HeyGen",
    role: "Product Design Intern",
    when: "Summer 2025",
    detail: "AI Avatar Products & Mobile",
    card: {
      sub: "AI avatar video platform",
      desc: "Studio-quality avatar video generated from a script. 30M+ users in 196 countries, 85% of the Fortune 100.",
      facts: [
        ["backed by", "Benchmark, Thrive, Bond, Conviction"],
        ["ARR", "$100M → $200M+ in 8 months (2026)"],
        ["last round", "$500M post, Series A (2024)"],
      ],
    },
  },
  {
    id: "earth-odyssey",
    logo: "#e4ded7",
    name: "Earth Odyssey",
    when: "2022 – present",
    detail: "hackathons, friends & arts",
    card: {
      sub: "A long-running personal venture",
      desc: "Organizing AdventureX, China's largest hackathon, investing in friends, and making arts.",
      facts: [
        ["founded", "2022"],
        ["hq", "New York"],
      ],
    },
  },
]

const EDUCATION: XpRow[] = [
  {
    id: "columbia",
    logo: "/kaynote/logos/columbia.png",
    name: "Columbia University",
    role: "Barnard College",
    when: "",
    detail: "Cognitive Science (AI/ML), Minors in Political Science & Economics",
  },
]

// logo list with an iOS-style company card hanging off the hovered logo
function ExperienceRows({ rows }: { rows: XpRow[] }) {
  const [card, setCard] = useState<{ row: XpRow; x: number; y: number } | null>(null)

  const showCard = (row: XpRow, el: HTMLElement) => {
    if (!row.card) return
    const rect = el.getBoundingClientRect()
    setCard({
      row,
      x: Math.min(Math.max(rect.left + rect.width / 2, 160), window.innerWidth - 160),
      y: rect.bottom + 12,
    })
  }

  // logo is either an image path or a flat color swatch (personal ventures)
  const logo = (row: XpRow, size: number) =>
    row.logo.startsWith("/") ? (
      <img src={row.logo} alt={`${row.name} logo`} width={size} height={size} />
    ) : (
      <span className="kn-xp-swatch" style={{ background: row.logo }} aria-hidden="true" />
    )

  return (
    <div className="kn-xp">
      {rows.map((row) => (
        <div className="kn-xp-row" key={row.id}>
          <span
            className="kn-xp-logo"
            onMouseEnter={(e) => showCard(row, e.currentTarget)}
            onMouseLeave={() => setCard(null)}
          >
            {logo(row, 40)}
          </span>
          <div className="kn-xp-main">
            <p className="kn-xp-line1">
              <span className="kn-xp-name">
                {row.name}
                {row.role ? `, ${row.role}` : ""}
              </span>
              {row.when && <span className="kn-xp-when">{row.when}</span>}
            </p>
            <p className="kn-xp-detail">{row.detail}</p>
          </div>
        </div>
      ))}

      {card && card.row.card && (
        <div
          className="kn-co-card"
          role="tooltip"
          style={{ left: card.x, top: card.y, transform: "translate(-50%, 0)" }}
        >
          <div className="kn-co-head">
            <span className="kn-co-logo">{logo(card.row, 44)}</span>
            <div>
              <p className="kn-co-name">{card.row.name}</p>
              <p className="kn-co-sub">{card.row.card.sub}</p>
            </div>
          </div>
          <p className="kn-co-desc">{card.row.card.desc}</p>
          <div className="kn-co-facts">
            {card.row.card.facts.map(([label, value]) => (
              <p key={label}>
                <span>{label}</span>
                <span>{value}</span>
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const SECTIONS: Section[] = [
  {
    label: "intro",
    notes: [
      {
        id: "about-me",
        title: "About",
        heading: "Kayna Huang",
        snippet: "A generalist designer",
        date: "September 2, 2026 at 10:08 AM",
        searchText:
          "about me kayna huang generalist design engineer product designer cognitive science AI ML machine learning barnard columbia EEG research psychology lab frontier technology consumer product prototypes human-centered design experience opusclip design engineering special projects ai video editor heygen product design intern ai avatar products mobile earth odyssey adventurex hackathon investing friends education political science economics art facial aesthetics fashion poker zhejiang new york startups entrepreneur reach me email kh3443 on X",
        body: (
          <>
            <IntroWithAvatar>
              <p style={{ marginTop: 0 }}>
                I&apos;m a generalist design engineer and product designer, currently studying
                Cognitive Science with a focus in AI and machine learning at Barnard College,
                Columbia University, and working on EEG research at a psychology lab at Columbia.
              </p>
              <p>
                A fascination with frontier technology and products is what started my career.
                Along the way I picked up the tools and processes to turn new technology into
                consumer product prototypes, and the methods to iterate product experiences at
                scale. I focus on bringing product sense and human-centered design to thinking
                through, building, and iterating frontier products people genuinely love.
              </p>
            </IntroWithAvatar>
            <p className="kn-subhead">Experience</p>
            <ExperienceRows rows={EXPERIENCE} />
            <p className="kn-subhead">Education</p>
            <ExperienceRows rows={EDUCATION} />
            <p className="kn-subhead">Off hours</p>
            <p>
              Outside of work, I love art, fashion, and facial aesthetics! I play the occasional
              game of poker. I was born and raised in Zhejiang, China, and New York is home now.
            </p>
            <p>
              I grew up in an entrepreneur&apos;s family. My father&apos;s entrepreneurial spirit
              and engineering background shaped me deeply: they showed me how hard it is to build a
              business, and gave me a huge passion for tech startups, one I&apos;ve decided to
              devote myself to.
            </p>
            <p>
              If you have any ideas or just want to chat, you can find me on{" "}
              <NoteLink href="https://x.com/kayna_xyz">X</NoteLink>, or email me at{" "}
              <NoteLink href="mailto:kh3443@columbia.edu">kh3443@columbia.edu</NoteLink>.
            </p>
          </>
        ),
      },
    ],
  },
  {
    label: "design",
    notes: [
      {
        id: "what-i-think-about",
        title: "Software Isn't Dead",
        snippet: "Design, making things, and the collage formula",
        date: "September 2, 2026 at 11:40 AM",
        essay: true,
        searchText:
          "where is the next generation of interaction what a designer thinks about in this era software is not dead intelligent software personal agent entropy fire collage formula design making things new things are collages of mature parts cursor coding ai iphone touchscreen macos electric car battery tiktok swipe feed attention economy newton glass timing first mover second mover internet era mobile era multi-device era gui lui chatgpt bci brain computer interface ar xr robotics no-interface ai assistant instinct text it or call it voice runway real-time generative ui oura ring wearables vision pro apple neuralink noland arbaugh nori a3 humanoid household robot yc columbia bottom-up practice future of designers next application era agi model plateau recursive self-improvement rsi commodity consumers markets design is collage",
        body: (
          <Essay>
            <p style={{ marginTop: 0 }}>
              Software isn&apos;t dead. When the technology underneath it changes, software
              combines with the new technology and turns into something new. Maybe it will be
              called intelligent software, maybe a personal agent. Nobody knows yet.
            </p>
            <p>
              Every landmark consumer company was built on a shift in how we interact. There will be more
              shifts underneath us, and the way we build things will keep getting more complex.{" "}
              <Mark>
                AI arrived right on time: it lets us build more complex things in a world where
                entropy only rises, at the same cost in human time that drilling wood for fire once
                took.
              </Mark>{" "}
              As a designer, I keep coming back to one question: where is the next generation of
              interaction?
            </p>
            <p className="kn-subhead">Design, making things, and the collage formula</p>
            <p>
              I call it the collage formula: new things are not invented from nothing. They are
              collages of existing things, assembled the moment one of the parts finally matures.
            </p>
            <ul>
              <li className="kn-anno">
                Cursor = coding + models that got good enough to write it.{" "}
                <Mark n={1}>$2B in annual revenue three years after launch</Mark>, on top of
                someone else&apos;s model.
                <Fig
                  n={1}
                  stat="$2B"
                  caption="Cursor ARR, March 2026, on a model it didn't train"
                  source="TechCrunch"
                  dx={72}
                  dy={-18}
                  tilt={-3}
                  w={200}
                />
              </li>
              <li className="kn-anno">
                <Mark n={2}>iPhone</Mark> = a capacitive touchscreen that got good enough + a
                shrunken macOS. $499 on January 9, 2007.
                <Fig
                  n={2}
                  src="/kaynote/essay/iphone2007.webp"
                  alt="the original iPhone"
                  width={360}
                  height={618}
                  w={104}
                  dx={300}
                  dy={-40}
                  tilt={4}
                  caption="the first one. a touchscreen and a small mac."
                />
              </li>
              <li className="kn-anno">
                The electric car = the car we already had + a battery that got{" "}
                <Mark n={3}>cheap enough</Mark>, roughly 90% cheaper per kWh than in 2010.
                <Fig
                  n={3}
                  stat="$1,400 → $115"
                  caption="a battery pack per kWh, 2010 → 2024"
                  source="BloombergNEF"
                  dx={40}
                  dy={60}
                  tilt={2}
                  w={210}
                />
              </li>
              <li>
                TikTok = the feed + the phone&apos;s own nature. One hand, one thumb, so the move
                is a swipe. Swipe made the feed the interface, and the feed made the attention
                economy real: 100M users in nine months, a billion a month by 2021.
              </li>
            </ul>
            <p>
              But, careful. The part people miss is the timing. The parts have to have just
              crossed the line.
              Newton had the tablet in 1993 and Glass had the headset in 2013, both a decade
              early, and they are remembered as jokes. The first mover proves the demand. The
              second one, arriving once the parts are cheap and the demand is proven, usually gets
              the market.
            </p>
            <p className="kn-subhead">How the surface has moved</p>
            <p>
              The industry has gone through three surfaces, and each one was built on the one
              before it.
            </p>
            <ul>
              <li>
                The internet era. The browser, the page, the link, the search box. Google and
                Amazon were built on a text field.
              </li>
              <li className="kn-anno">
                The mobile era. The touchscreen in the pocket. Uber, Instagram, and TikTok were
                built on things a desktop never had, a location, a camera, <Mark n={4}>a thumb</Mark>.
                <Fig
                  n={4}
                  stat="30 → 9 → 2"
                  caption="months to 100M users: Instagram, TikTok, ChatGPT. each surface is faster."
                  source="UBS"
                  dx={120}
                  dy={-10}
                  tilt={-2}
                  w={220}
                />
              </li>
              <li>
                The multi-device era, now. The surface stops being one rectangle and spreads across
                the body and the room.
              </li>
            </ul>
            <p>In the multi-device era, this is where interaction stands today:</p>
            <ul>
              <li>
                GUI → LUI. Language on top of the screen. You stop learning the tool, you tell it.
                ChatGPT reached 100M users in two months, the fastest consumer product ever.
              </li>
              <li className="kn-anno">
                No-interface assistants. Voice, a chat box, an agent in the background. The best
                of them feel like instinct: you don&apos;t open them, they are just there.{" "}
                <Mark n={5}>Instinct</Mark> is the current example. You text it or call
                it, and it uses a phone and a computer the way a person would. It raised at a
                $2.5B valuation within weeks of launch while still invite-only. The interface has
                not disappeared, it has moved out of sight, and someone still has to design what
                you cannot see.
                <Fig
                  n={5}
                  src="/kaynote/essay/instinct.webp"
                  alt="Instinct's text cursor"
                  width={400}
                  height={267}
                  w={150}
                  dx={250}
                  dy={-30}
                  tilt={-3}
                  caption="Instinct's entire interface. $2.5B, August 2026."
                />
              </li>
              <li>
                Real-time generative UI. Runway&apos;s lab showed interfaces rendered as you use
                them. If the screen is generated per moment, the designer stops drawing screens
                and starts designing the rules that generate them.
              </li>
              <li className="kn-anno">
                Wearables that read you. <Mark n={6}>Oura</Mark> is a ring with no screen at
                all. You don&apos;t use it, it uses you, and the phone reads the result out. 5.5
                million rings sold, a billion dollars of revenue in 2025, and it is the first
                mass-market device where the interaction is simply wearing it.
                <Fig
                  n={6}
                  src="/kaynote/essay/oura.webp"
                  alt="Oura rings"
                  width={560}
                  height={436}
                  w={184}
                  dx={44}
                  dy={30}
                  tilt={2}
                  caption="no screen. 5.5M sold, $11B, October 2025."
                />
              </li>
              <li className="kn-anno">
                <Mark n={7}>AR / XR</Mark>. The interface leaves the rectangle and enters the
                room. Vision Pro shipped in 2024 at $3,499. The parts are here, the price has not
                crossed the line.
                <Fig
                  n={7}
                  src="/kaynote/essay/visionpro.webp"
                  alt="Apple Vision Pro"
                  width={560}
                  height={441}
                  w={190}
                  dx={256}
                  dy={-20}
                  tilt={-2}
                  caption="Vision Pro, $3,499. the Newton of the room?"
                />
              </li>
              <li className="kn-anno">
                <Mark n={8}>BCI</Mark>. Intent skips the hands. Neuralink put its first implant
                in a person in January 2024. What is a click when the signal is a thought?
                <Fig
                  n={8}
                  src="/kaynote/essay/neuralink.webp"
                  alt="Noland Arbaugh, Neuralink's first patient"
                  width={440}
                  height={544}
                  w={124}
                  dx={70}
                  dy={40}
                  tilt={3}
                  caption="Noland Arbaugh, patient one, 2024. moves a cursor by thinking."
                />
              </li>
              <li className="kn-anno">
                <Mark n={9}>Robotics</Mark>. Interaction leaves the screen entirely and gets
                a body. The parts are lining up the way they once did for the phone: first-person
                video to learn from, motors and batteries made cheap by the EV supply chain, and
                models that follow instructions. When they cross the line, the household robot
                walks into every home the way the washing machine did. Nori A3 is an early sign,
                a two-armed household robot out of YC&apos;s summer 2026 batch that costs $1,688,
                about the price of a laptop, and took $350k of orders in its first six weeks. The
                founder studied at Columbia.
                <Fig
                  n={9}
                  src="/kaynote/essay/nori.webp"
                  alt="Nori A3 robots in the workshop"
                  width={560}
                  height={315}
                  w={220}
                  dx={232}
                  dy={30}
                  tilt={-2}
                  caption="Nori A3 in the workshop. $1,688, 19 joints, ships fall 2026."
                />
              </li>
            </ul>
            <p className="kn-subhead">Where designers go from here</p>
            <p>
              I don&apos;t have the answer, and I have stopped trusting anyone who says they do.
              Interface shifts are not predicted from the top down. They show up in bottom-up
              practice, in what people actually pick up and keep using, and only in hindsight do
              they look obvious. The only way to see the future is to build in it. The first mover
              does not necessarily win.
            </p>
            <p>
              What I firmly believe: AGI, or something close enough to it that the label stops
              mattering, is here. Model capability will either hit a ceiling or fold into a
              recursive self-improvement loop, and either way the model itself stops being the
              scarce thing. It becomes a part in the collage, the way the battery did.
            </p>
            <p>
              But remember: consumers and markets never go away. And the design process follows
              the collage formula too, much like the way things get invented. A designer does not create from
              nothing, but we always have to think about which part has just matured, which
              platform it belongs on, and what we can build there. Designers hold the tools to
              make products and to tell their story, and that matters enormously. The market will
              know it more and more. Build boldly.
            </p>
          </Essay>
        ),
      },
      {
        id: "post-ai-design",
        title: "Design Engineering Fundamentals",
        snippet: "Notes, reading, and tools of a design builder",
        date: "January 19, 2026 at 8:30 PM",
        searchText:
          "design engineering fundamentals of a design builder design engineering product design vercel design playground tools reading",
        body: (
          <>
            <p>
              The fundamentals of a design builder: notes on design engineering &amp; product
              design, articles worth reading, and tools I actually use.
            </p>
            <p className="kn-subhead">Reading</p>
            <ul>
              <li>
                What design engineering takes,{" "}
                <NoteLink href="https://vercel.com/blog/design-engineering-at-vercel">
                  design engineering at Vercel
                </NoteLink>
              </li>
            </ul>
            <p className="kn-subhead">Tools</p>
            <ul>
              <li>
                A new kind of design playground,{" "}
                <NoteLink href="https://github.com/B1u3B01t/design-playground">
                  design-playground on GitHub
                </NoteLink>
              </li>
            </ul>
          </>
        ),
      },
    ],
  },
  {
    label: "lifestyle",
    notes: [
      {
        id: "reading-list",
        title: "My Reading List",
        snippet: "Everything I've been reading",
        date: "February 15, 2026 at 10:12 AM",
        wide: true,
        searchText:
          "my reading list everything I've been reading books metro 2033 brave new world 1984 animal farm dune 2001 a space odyssey the three-body problem 三体 steve jobs isaacson aiming high masayoshi son 孙正义 leonardo da vinci 达芬奇 zero to one excellent sheep self-made man norah vincent sci-fi 黄仁勋 英伟达之芯 nvidia jensen huang 毛泽东传 王兴传 美团 elon musk 马斯克 isaacson the airbnb story 爱彼迎 只有偏执狂才能生存 安迪格鲁夫 only the paranoid survive 从优秀到卓越 good to great 吉姆柯林斯 段永平投资问答录 因为独特 王宁 泡泡玛特 pop mart 置身事内 兰小欢 创新与企业家精神 彼得德鲁克 drucker innovation and entrepreneurship andy grove jim collins",
        body: (
          <>
            <p>People, business, and sci-fi, left to right. Hover on the books to see more.</p>
            <Bookshelf />
          </>
        ),
      },
      {
        id: "trading-portfolio",
        title: "Invest",
        snippet: "Pocket Robinhood",
        date: "July 11, 2026 at 11:32 AM",
        wide: true,
        searchText:
          "my trading portfolio trading investing invest crypto bitcoin btc markets stocks robinhood watchlist news prices nvda nvidia googl google hood orcl oracle crm salesforce hsai amba mbly asml qcom clsk mu micron nbis slv silver s&p 500 nasdaq dark mode",
        body: <TradingPanel />,
      },
      {
        id: "restaurants",
        title: "🍽️ Restaurants in NYC",
        snippet: "The best in New York City",
        date: "July 11, 2026 at 1:12 PM",
        wide: true,
        searchText:
          "restaurants in NYC new york food eat kayna's special collection restaurant list map japanese omakase sushi korean kotobuki kimura yakitori taisho davelle genki tsukimi sushi ikumi mori noda unique omakase ume odo ito nakaji tsubame class on 38th senya sushi noz bar masa hirohisa tosokchon samwoojung antoya moono anto korean steak house oiji mi 53 yong chuan yongchuan happy hot hunan columbia murray's cheese a pasta bar sea le jardin bistro zou zou's ping's dudleys our new york vodka le café louis vuitton",
        body: (
          <>
            <p>Kayna&apos;s special collection of foods in New York City.</p>
            <RestaurantMap />
          </>
        ),
      },
      {
        id: "artspedia",
        title: "Artspedia",
        snippet: "Still building",
        date: "September 2, 2026 at 2:40 PM",
        building: true,
        searchText:
          "artspedia arts pictures photos art collection stamps postage kayna huang columbia butler library snowman soho nyc",
        body: (
          <>
            <p style={{ marginTop: 0 }}>Arts and pictures, an ongoing collection.</p>
            <StampScatter />
          </>
        ),
      },
    ],
  },
]

function ShareIcon() {
  return (
    <svg
      width="17"
      height="20"
      viewBox="0 0 18 21"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 7H4.5A1.5 1.5 0 0 0 3 8.5v9A1.5 1.5 0 0 0 4.5 19h9a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 13.5 7H12" />
      <path d="M9 13V2" />
      <path d="M5.5 5.5 9 2l3.5 3.5" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="6" cy="6" r="4.5" />
      <path d="m9.6 9.6 3.4 3.4" />
    </svg>
  )
}

export default function KaynoteApp() {
  const router = useRouter()
  const [selectedId, setSelectedId] = useState("about-me")
  const [noteOpen, setNoteOpen] = useState(true) // mobile: note pane visible; start on the about note
  const [query, setQuery] = useState("")
  const [copied, setCopied] = useState(false)
  const [buildingNote, setBuildingNote] = useState<Note | null>(null) // "still building" alert target

  // Open a note, or show the still-building alert when it isn't ready yet
  const openNote = (note: Note) => {
    if (note.building) {
      setBuildingNote(note)
      return
    }
    setSelectedId(note.id)
    setNoteOpen(true)
  }

  // NoteJump links inside note bodies dispatch this event to switch notes
  useEffect(() => {
    const onOpenNote = (e: Event) => {
      const id = (e as CustomEvent<string>).detail
      const note = SECTIONS.flatMap((s) => s.notes).find((n) => n.id === id)
      if (note?.building) {
        setBuildingNote(note)
        return
      }
      setSelectedId(id)
      setNoteOpen(true)
    }
    window.addEventListener("kaynotes:open-note", onOpenNote)
    return () => window.removeEventListener("kaynotes:open-note", onOpenNote)
  }, [])

  const q = query.trim().toLowerCase()
  const sections = SECTIONS.map((s) => ({
    ...s,
    notes: s.notes.filter(
      (n) => !q || n.title.toLowerCase().includes(q) || n.searchText.toLowerCase().includes(q)
    ),
  })).filter((s) => s.notes.length > 0)

  const allNotes = SECTIONS.flatMap((s) => s.notes)
  const selected = allNotes.find((n) => n.id === selectedId) ?? allNotes[0]

  const handleShare = async () => {
    const url = window.location.href
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: "Notes", url })
        return
      } catch {
        // fall through to clipboard if the user dismissed the sheet
      }
    }
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {}
  }

  return (
    <div
      className={`kn-app${noteOpen ? " note-open" : ""}${selected.id === "trading-portfolio" ? " kn-dark" : ""} page-fade-in`}
      style={{ fontFamily: SF }}
    >
      {/* ── Sidebar ── */}
      <aside className="kn-sidebar">
        <div className="kn-lights">
          <button
            className="kn-light kn-light--red"
            aria-label="Close Notes, back to home"
            title="Back to home"
            onClick={() => router.push("/")}
          />
          <span className="kn-light kn-light--yellow" />
          <span className="kn-light kn-light--green" />
        </div>

        <div className="kn-list">
          {sections.map((section) => (
            <div key={section.label}>
              <p className="kn-section-label">{section.label}</p>
              {section.notes.map((note) => (
                <button
                  key={note.id}
                  className={`kn-row${note.id === selectedId ? " is-selected" : ""}`}
                  onClick={() => openNote(note)}
                >
                  <span className="kn-row-title">{note.title}</span>
                  <span className="kn-row-snippet">{note.snippet}</span>
                </button>
              ))}
            </div>
          ))}
          {sections.length === 0 && <p className="kn-empty">No Results</p>}
        </div>
      </aside>

      {/* ── Note pane ── */}
      <section className="kn-note">
        <div className="kn-toolbar">
          <button className="kn-back" onClick={() => setNoteOpen(false)}>
            ‹ Back
          </button>
          <div className="kn-toolbar-right">
            {copied && <span className="kn-copied">Link copied</span>}
            <button className="kn-tool" aria-label="Share" title="Share" onClick={handleShare}>
              <ShareIcon />
            </button>
            <label className="kn-search">
              <SearchIcon />
              <input
                type="search"
                placeholder="Search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
          </div>
        </div>

        {/* key remounts the paper per note so the fade-in replays on every switch */}
        <div className="kn-paper" key={selected.id}>
          <p className="kn-date">{selected.date}</p>
          <h1 className="kn-title">{selected.heading ?? selected.title}</h1>
          <div
            className={`kn-body${selected.wide ? " kn-body--wide" : ""}${selected.essay ? " kn-body--essay" : ""}`}
          >
            {selected.body}
          </div>
        </div>
      </section>

      {buildingNote && (
        <IosAlert
          title={buildingNote.title}
          message="still building. check back soon."
          onDismiss={() => setBuildingNote(null)}
          buttons={[{ label: "OK", onClick: () => setBuildingNote(null), bold: true }]}
        />
      )}

      <style jsx>{`
        .kn-app {
          display: flex;
          height: 100dvh;
          overflow: hidden;
          background: #ffffff;
          color: ${INK};
        }
        /* Apple Notes has no focus rings — kill the browser's blue outline everywhere here */
        .kn-app :global(*:focus),
        .kn-app :global(*:focus-visible) {
          outline: none;
        }
        /* theme crossfade — every color-bearing element moves on the SAME
           curve; if only backgrounds animate, text snaps and the dark-mode
           switch feels broken */
        .kn-app,
        .kn-sidebar,
        .kn-note,
        .kn-search,
        .kn-search input,
        .kn-row,
        .kn-row + .kn-row::before,
        .kn-row-title,
        .kn-row-snippet,
        .kn-section-label,
        .kn-empty {
          transition:
            background-color 0.45s cubic-bezier(0.4, 0, 0.2, 1),
            color 0.45s cubic-bezier(0.4, 0, 0.2, 1),
            border-color 0.45s cubic-bezier(0.4, 0, 0.2, 1);
        }
        /* the note body swaps instantly on selection — fade it in so dark
           content never sits on a still-light pane (and vice versa) */
        .kn-paper {
          animation: kn-paper-in 0.45s ease;
        }
        @keyframes kn-paper-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        /* ── Sidebar ── */
        .kn-sidebar {
          width: 320px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          border-right: 1px solid #e5e5e5;
          background: #ffffff;
        }
        .kn-lights {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 20px 20px 12px;
        }
        .kn-light {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          padding: 0;
          border: none;
          display: block;
        }
        .kn-light--red {
          background: #ff5f57;
          cursor: pointer;
        }
        .kn-light--yellow {
          background: #febc2e;
        }
        .kn-light--green {
          background: #28c840;
        }
        .kn-list {
          flex: 1;
          overflow-y: auto;
          padding: 0 12px 24px;
        }
        .kn-section-label {
          font-size: 13px;
          font-weight: 600;
          color: ${GRAY};
          text-transform: capitalize;
          margin: 20px 8px 4px;
        }
        .kn-row {
          display: flex;
          flex-direction: column;
          gap: 3px;
          width: 100%;
          text-align: left;
          background: none;
          border: none;
          border-radius: 8px;
          padding: 12px 8px;
          cursor: pointer;
          font-family: inherit;
          position: relative;
        }
        .kn-row + .kn-row::before {
          content: "";
          position: absolute;
          top: 0;
          left: 8px;
          right: 8px;
          height: 1px;
          background: #ececec;
        }
        .kn-row.is-selected {
          background: #fce49b;
        }
        .kn-row.is-selected::before,
        .kn-row.is-selected + .kn-row::before {
          background: transparent;
        }
        .kn-row-title {
          font-size: 14px;
          font-weight: 600;
          color: ${INK};
          line-height: 1.3;
        }
        .kn-row-snippet {
          font-size: 13px;
          color: ${GRAY};
          line-height: 1.35;
        }
        .kn-empty {
          font-size: 15px;
          color: ${GRAY};
          text-align: center;
          margin-top: 40px;
        }

        /* ── Note pane ── */
        /* the pane itself scrolls (toolbar included), so share/search
           sit at the top of the page and scroll away with it */
        .kn-note {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          background: #ffffff;
          overflow-y: auto;
        }
        .kn-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 20px 8px;
        }
        .kn-back {
          display: none;
          background: none;
          border: none;
          padding: 0;
          font-family: inherit;
          font-size: 14px;
          color: ${GRAY};
          cursor: pointer;
        }
        .kn-toolbar-right {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-left: auto;
        }
        .kn-copied {
          font-size: 13px;
          color: ${GRAY};
        }
        .kn-tool {
          background: none;
          border: none;
          padding: 4px;
          color: #7c7c80;
          cursor: pointer;
          display: flex;
          align-items: center;
        }
        .kn-tool:hover {
          color: ${INK};
        }
        .kn-search {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #efeff0;
          border-radius: 7px;
          height: 28px;
          padding: 0 8px;
          color: ${GRAY};
          width: 180px;
        }
        .kn-search input {
          border: none;
          background: none;
          outline: none;
          font-family: inherit;
          font-size: 13px;
          color: ${INK};
          width: 100%;
        }
        .kn-search input::placeholder {
          color: ${GRAY};
        }

        .kn-paper {
          flex: 1;
          padding: 12px 32px 64px;
        }
        .kn-date {
          font-size: 12px;
          color: ${GRAY};
          text-align: center;
          margin: 0 0 24px;
        }
        .kn-title {
          font-size: 20px;
          font-weight: 700;
          letter-spacing: -0.01em;
          color: ${INK};
          max-width: 840px;
          margin: 0 0 10px;
          line-height: 1.25;
        }
        .kn-body {
          max-width: 840px;
        }
        .kn-body--wide {
          max-width: none;
        }
        .kn-body--essay {
          max-width: 680px;
        }
        /* ── Draft margin (essay): underlined phrases, arrows, taped photos ── */
        .kn-body :global(.kn-essay) {
          position: relative;
        }
        .kn-body :global(.kn-anno) {
          position: relative;
        }
        .kn-body :global(.kn-mark) {
          text-decoration: underline wavy rgba(0, 0, 0, 0.45);
          text-decoration-thickness: 1px;
          text-underline-offset: 3px;
        }
        .kn-body :global(sup.kn-ref) {
          font-size: 10px;
          font-weight: 600;
          line-height: 0;
          vertical-align: super;
          margin-left: 2px;
          color: ${GRAY};
        }
        .kn-body :global(.kn-fig-n) {
          display: inline-block;
          font-size: 15px;
          line-height: 20px;
          width: 20px;
          height: 20px;
          text-align: center;
          border: 1px solid rgba(0, 0, 0, 0.45);
          border-radius: 50%;
          color: ${INK};
          margin-bottom: 4px;
        }
        .kn-body :global(.kn-fig--photo) {
          position: relative;
        }
        .kn-body :global(.kn-fig--photo .kn-fig-n) {
          position: absolute;
          left: -8px;
          top: -8px;
          background: #ffffff;
          margin: 0;
          z-index: 1;
        }
        .kn-body :global(.kn-fig) {
          display: block;
          width: var(--w);
          max-width: 100%;
          margin: 12px 0 8px;
          transform: rotate(var(--tilt));
          font-family: "IntrudingCat", cursive;
          font-size: 15px;
          line-height: 18px;
          color: ${GRAY};
          pointer-events: none;
        }
        .kn-body :global(.kn-fig img) {
          display: block;
          width: 100%;
          height: auto;
          margin-bottom: 6px;
          border-radius: 3px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.18), 0 6px 14px rgba(0, 0, 0, 0.1);
        }
        .kn-body :global(.kn-fig-stat) {
          display: block;
          font-size: 30px;
          line-height: 32px;
          color: ${INK};
        }
        .kn-body :global(.kn-fig-cap) {
          display: block;
        }
        .kn-body :global(.kn-fig-src) {
          display: block;
          margin-top: 2px;
          font-size: 13px;
          color: rgba(0, 0, 0, 0.3);
        }
        /* wide panes: throw the figures out into the blank right half of the page */
        @media (min-width: 1400px) {
          .kn-body :global(.kn-fig) {
            position: absolute;
            left: calc(100% + var(--dx));
            top: var(--dy);
            margin: 0;
          }
        }

        .kn-body :global(p) {
          font-size: 14px;
          line-height: 20px;
          color: ${INK};
          margin: 0 0 12px;
        }
        .kn-body :global(.kn-intro) {
          display: flex;
          align-items: flex-start;
          gap: 40px;
          margin: 8px 0 16px;
        }
        .kn-body :global(.kn-intro-text) {
          flex: 1;
          min-width: 0;
        }
        .kn-body :global(.kn-intro-text p:last-child) {
          margin-bottom: 0;
        }
        .kn-body :global(img.kn-intro-avatar) {
          flex: none;
          display: block;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          object-fit: cover;
        }
        .kn-body :global(p.kn-subhead) {
          font-weight: 700;
          margin-top: 32px;
        }
        .kn-body :global(ul) {
          margin: 0 0 12px;
          padding-left: 24px;
          list-style-type: disc;
        }
        .kn-body :global(li) {
          font-size: 14px;
          line-height: 20px;
          color: ${INK};
          margin-bottom: 0;
        }
        /* Apple-Notes-style table: hairline grid, bold first column */
        .kn-body :global(.kn-table-wrap) {
          overflow-x: auto;
          margin: 16px 0 16px;
        }
        .kn-body :global(.kn-table) {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
          line-height: 20px;
          color: ${INK};
        }
        .kn-body :global(.kn-table th),
        .kn-body :global(.kn-table td) {
          border: 1px solid rgba(0, 0, 0, 0.14);
          padding: 8px 10px;
          text-align: left;
          vertical-align: top;
          font-weight: 400;
        }
        .kn-body :global(.kn-table thead th) {
          font-weight: 700;
          background: rgba(0, 0, 0, 0.03);
        }
        .kn-body :global(.kn-table tbody th) {
          font-weight: 600;
          white-space: nowrap;
          width: 1%;
        }

        /* ── Bookshelf (reading list): wallpapered wall + white shelf ── */
        .kn-body :global(.kn-shelves) {
          margin-top: 48px;
        }
        .kn-body :global(.kn-shelf-scene) {
          position: relative;
          margin-bottom: 20px;
          /* two tiles of the SF-window vintage-vine wallpaper, height cropped */
          background: url("/assets/wallpapers/vintage-vine/wall.webp") top center / 50% auto repeat;
          padding: 112px 0 122px;
        }
        .kn-body :global(.kn-shelf-scene)::after {
          /* soft white vignette so the wallpaper fades into the note page */
          content: "";
          position: absolute;
          inset: 0;
          box-shadow: inset 0 0 56px 38px #ffffff;
          pointer-events: none;
        }
        .kn-body :global(.kn-shelf-scroll) {
          overflow-x: auto;
        }
        .kn-body :global(.kn-shelf-unit) {
          width: 100%;
          min-width: max-content;
        }
        .kn-body :global(.kn-shelf-stage) {
          position: relative;
          width: max-content;
          margin: 0 auto;
          padding: 0 44px 0 104px;
        }
        .kn-body :global(.kn-spines) {
          position: relative;
          z-index: 3;
          display: flex;
          align-items: flex-end;
          gap: 2px;
        }
        .kn-body :global(.kn-spine) {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: none;
          padding: 0;
          border: none;
          border-radius: 3px 3px 0 0;
          overflow: hidden;
          cursor: pointer;
          text-decoration: none;
          font-family: ${SF};
          /* the book's roundness: inner shadow on both edges, none in the middle */
          box-shadow:
            inset 7px 0 8px -5px rgba(0, 0, 0, 0.45),
            inset -7px 0 8px -5px rgba(0, 0, 0, 0.45),
            0 2px 3px rgba(0, 0, 0, 0.2);
          transform: rotate(var(--tilt, 0deg));
          transform-origin: bottom center;
          transition: transform 0.15s ease;
        }
        .kn-body :global(.kn-spine:hover) {
          transform: rotate(var(--tilt, 0deg)) translateY(-6px);
        }
        .kn-body :global(.kn-spine-serif) {
          font-family: Georgia, "Times New Roman", "Songti SC", "STSong", serif;
        }
        .kn-body :global(.kn-spine-band) {
          width: 100%;
          height: 8px;
          flex: none;
        }
        .kn-body :global(.kn-spine-title) {
          flex: 1;
          min-height: 0;
          margin-top: 12px;
          writing-mode: vertical-rl;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 9.5px;
          font-weight: 600;
          letter-spacing: 0.5px;
          color: inherit;
        }
        .kn-body :global(.kn-spine-author) {
          margin: 8px 0 12px;
          writing-mode: vertical-rl;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-height: 58px;
          font-size: 7px;
          font-weight: 500;
          letter-spacing: 0.5px;
          color: inherit;
          opacity: 0.72;
        }
        .kn-body :global(.kn-spine-author + .kn-spine-band) {
          margin-top: -4px;
        }
        .kn-body :global(.kn-shelf-board) {
          position: relative;
          z-index: 2;
          height: 12px;
          border-radius: 6px;
          background: linear-gradient(#ffffff, #ececee 55%, #d8d8da);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.9),
            0 6px 12px rgba(0, 0, 0, 0.2);
        }
        /* shelf decorations: posters layer above the wallpaper only, below the shelf */
        .kn-body :global(img.kn-deco-illenium) {
          position: absolute;
          z-index: 0;
          left: -34px;
          bottom: -4px;
          width: 190px;
          height: auto;
        }
        .kn-body :global(img.kn-deco-pf) {
          position: absolute;
          z-index: 0;
          right: -50px;
          bottom: 34px;
          width: 158px;
          height: auto;
          transform: rotate(-8deg);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.28);
        }
        .kn-body :global(img.kn-deco-labubu) {
          position: absolute;
          z-index: 4;
          left: -6px;
          bottom: -5px;
          width: 58px;
          height: auto;
        }
        .kn-body :global(img.kn-deco-lion) {
          align-self: center;
          flex: none;
          width: 44px;
          height: auto;
          margin: 0 12px;
        }
        /* book preview card, follows the hovered spine */
        .kn-body :global(.kn-spine-card) {
          position: fixed;
          z-index: 60;
          width: 300px;
          background: #ffffff;
          border-radius: 12px;
          padding: 16px;
          text-align: left;
          box-shadow:
            0 2px 8px rgba(0, 0, 0, 0.12),
            0 18px 44px rgba(0, 0, 0, 0.22);
          pointer-events: none;
          animation: kn-fade-in 0.15s ease-out;
        }
        .kn-body :global(.kn-spine-card-head) {
          display: flex;
          gap: 14px;
          align-items: flex-start;
        }
        .kn-body :global(img.kn-spine-card-cover) {
          width: 88px;
          height: auto;
          flex: none;
          border-radius: 6px;
          box-shadow:
            0 1px 3px rgba(0, 0, 0, 0.18),
            0 5px 12px rgba(0, 0, 0, 0.14);
        }
        .kn-body :global(p.kn-spine-card-title) {
          font-size: 15px;
          font-weight: 700;
          line-height: 1.3;
          margin: 2px 0 0;
        }
        .kn-body :global(p.kn-spine-card-author) {
          font-size: 12px;
          color: ${GRAY};
          margin: 3px 0 0;
        }
        .kn-body :global(p.kn-spine-card-tag) {
          display: inline-block;
          font-size: 10px;
          font-weight: 600;
          line-height: 1;
          color: #7c7c80;
          background: #efeff0;
          border-radius: 100px;
          padding: 4px 8px;
          margin: 9px 0 0;
        }
        .kn-body :global(p.kn-spine-card-desc) {
          font-size: 13px;
          line-height: 19px;
          color: ${INK};
          margin: 12px 0 0;
        }
        /* ── Experience rows: logo + role, iOS company card on logo hover ── */
        .kn-body :global(.kn-xp) {
          margin: 8px 0 24px;
        }
        .kn-body :global(.kn-xp-row) {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 0;
        }
        .kn-body :global(.kn-xp-logo) {
          flex: none;
          width: 40px;
          height: 40px;
          border-radius: 9px;
          overflow: hidden;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .kn-body :global(.kn-xp-logo img) {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }
        .kn-body :global(.kn-xp-swatch) {
          display: block;
          width: 100%;
          height: 100%;
        }
        .kn-body :global(.kn-xp-main) {
          flex: 1;
          min-width: 0;
        }
        .kn-body :global(p.kn-xp-line1) {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 12px;
          margin: 0;
        }
        .kn-body :global(.kn-xp-name) {
          font-weight: 600;
        }
        .kn-body :global(.kn-xp-when) {
          flex: none;
          font-size: 13px;
          color: ${GRAY};
        }
        .kn-body :global(p.kn-xp-detail) {
          margin: 1px 0 0;
          font-size: 13px;
          color: ${GRAY};
        }
        /* company card: same fixed-position pattern as the bookshelf preview */
        .kn-body :global(.kn-co-card) {
          position: fixed;
          z-index: 60;
          width: 300px;
          background: #ffffff;
          border-radius: 14px;
          padding: 16px;
          text-align: left;
          box-shadow:
            0 2px 8px rgba(0, 0, 0, 0.12),
            0 18px 44px rgba(0, 0, 0, 0.22);
          pointer-events: none;
          animation: kn-fade-in 0.15s ease-out;
        }
        .kn-body :global(.kn-co-head) {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .kn-body :global(.kn-co-logo) {
          flex: none;
          width: 44px;
          height: 44px;
          border-radius: 10px;
          overflow: hidden;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .kn-body :global(.kn-co-logo img) {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }
        .kn-body :global(p.kn-co-name) {
          font-size: 15px;
          font-weight: 700;
          line-height: 1.3;
          margin: 0;
        }
        .kn-body :global(p.kn-co-sub) {
          font-size: 12px;
          color: ${GRAY};
          margin: 2px 0 0;
        }
        .kn-body :global(p.kn-co-desc) {
          font-size: 13px;
          line-height: 19px;
          margin: 12px 0 0;
        }
        .kn-body :global(.kn-co-facts) {
          margin-top: 12px;
          border-top: 1px solid #ececec;
        }
        .kn-body :global(.kn-co-facts p) {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 16px;
          margin: 0;
          padding: 7px 0;
          font-size: 12px;
          line-height: 16px;
        }
        .kn-body :global(.kn-co-facts p + p) {
          border-top: 1px solid #ececec;
        }
        .kn-body :global(.kn-co-facts p span:first-child) {
          flex: none;
          color: ${GRAY};
        }
        .kn-body :global(.kn-co-facts p span:last-child) {
          text-align: right;
        }

        /* ── Intro stamps: photos as postage stamps scattered on grid paper ── */
        .kn-body :global(.kn-stamp-scene) {
          position: relative;
          margin: 32px 0 8px;
          padding: 36px 0 32px;
          background-image:
            linear-gradient(#e9e9ee 1px, transparent 1px),
            linear-gradient(90deg, #e9e9ee 1px, transparent 1px);
          background-size: 26px 26px;
        }
        .kn-body :global(.kn-stamp-scene)::after {
          /* soft white vignette so the grid paper fades into the note page */
          content: "";
          position: absolute;
          inset: 0;
          box-shadow: inset 0 0 44px 30px #ffffff;
          pointer-events: none;
        }
        .kn-body :global(.kn-stamps) {
          position: relative;
          max-width: 560px;
          height: 300px;
          margin: 0 auto;
        }
        .kn-body :global(.kn-stamp) {
          position: absolute;
          margin: 0;
          display: flex;
          flex-direction: column;
          padding: 12px 12px 8px;
          /* perforation: transparent holes punched every 13px along the rim.
             the gradient tiles holes across the whole stamp; ::before fills
             the interior back in, so only the edge holes stay open */
          background: radial-gradient(circle, transparent 4.5px, #fdfdfb 5px);
          background-size: 13px 13px;
          background-position: -6.5px -6.5px;
          transform: rotate(var(--rot, 0deg));
          /* drop-shadow follows the perforated alpha, so the scallops cast real edges */
          filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.14)) drop-shadow(0 10px 18px rgba(0, 0, 0, 0.1));
        }
        .kn-body :global(.kn-stamp)::before {
          content: "";
          position: absolute;
          inset: 6.5px;
          background: #fdfdfb;
          z-index: -1;
        }
        .kn-body :global(.kn-stamp img) {
          flex: 1;
          min-height: 0;
          width: 100%;
          object-fit: cover;
          display: block;
        }
        .kn-body :global(.kn-stamp figcaption) {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding-top: 5px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: var(--ink, #2b35a8);
        }
        @keyframes kn-fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes kn-pop-in {
          from {
            opacity: 0;
            transform: scale(0.92);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* ── Dark mode (trading note), iOS-style ── */
        .kn-app.kn-dark {
          background: #000000;
        }
        .kn-dark .kn-sidebar {
          background: #1c1c1e;
          border-right-color: #2c2c2e;
        }
        .kn-dark .kn-section-label {
          color: #98989d;
        }
        .kn-dark .kn-row-title {
          color: #f2f2f7;
        }
        .kn-dark .kn-row + .kn-row::before {
          background: #2c2c2e;
        }
        .kn-dark .kn-row.is-selected {
          background: #5c5427;
        }
        .kn-dark .kn-row.is-selected .kn-row-title {
          color: #ffffff;
        }
        .kn-dark .kn-row.is-selected .kn-row-snippet {
          color: #d8d8dc;
        }
        .kn-dark .kn-empty {
          color: #98989d;
        }
        .kn-dark .kn-note {
          background: #000000;
        }
        .kn-dark .kn-back {
          color: #98989d;
        }
        .kn-dark .kn-tool {
          color: #98989d;
        }
        .kn-dark .kn-tool:hover {
          color: #f2f2f7;
        }
        .kn-dark .kn-copied {
          color: #98989d;
        }
        .kn-dark .kn-search {
          background: #1c1c1e;
        }
        .kn-dark .kn-search input {
          color: #f2f2f7;
        }
        .kn-dark .kn-title {
          color: #f2f2f7;
        }
        /* the trading note is a full Robinhood page — drop the Notes chrome
           (share/search + date + note title). the mobile back button stays. */
        .kn-dark .kn-toolbar-right,
        .kn-dark .kn-date,
        .kn-dark .kn-title {
          display: none;
        }
        .kn-dark .kn-body :global(p),
        .kn-dark .kn-body :global(li) {
          color: #f2f2f7;
        }

        /* ── Mobile: list first, tap into a note ── */
        @media (max-width: 767px) {
          .kn-sidebar {
            width: 100%;
            border-right: none;
          }
          .kn-note {
            display: none;
          }
          .kn-app.note-open .kn-sidebar {
            display: none;
          }
          .kn-app.note-open .kn-note {
            display: flex;
          }
          .kn-back {
            display: inline-flex;
          }
          .kn-search {
            display: none;
          }
          .kn-paper {
            padding: 12px 20px 48px;
          }
          /* narrow pane: photo above the intro text at a fixed size */
          .kn-body :global(.kn-intro) {
            flex-direction: column-reverse;
            /* equal room above the photo (after the title) and below it (before the text) */
            gap: 20px;
            margin-top: 20px;
          }
          .kn-body :global(img.kn-intro-avatar) {
            width: 160px !important;
            height: 160px !important;
          }
          .kn-body :global(.kn-shelf) {
            grid-template-columns: repeat(2, 1fr);
            column-gap: 20px;
            row-gap: 28px;
          }
          /* scale the stamp sheet down so the scatter fits the narrow pane */
          .kn-body :global(.kn-stamps) {
            zoom: 0.72;
          }
          /* essay: no margin to tape figures into, so they sit centered under their paragraph */
          .kn-body :global(.kn-fig) {
            margin: 14px auto 10px;
            text-align: center;
          }
          /* tables: let the label column wrap so the two content columns keep their room */
          .kn-body :global(.kn-table) {
            font-size: 13px;
            line-height: 18px;
          }
          .kn-body :global(.kn-table th),
          .kn-body :global(.kn-table td) {
            padding: 6px 8px;
          }
          .kn-body :global(.kn-table tbody th) {
            white-space: normal;
            width: auto;
          }
          /* on mobile, dark mode only applies once the trading note is open —
             the list view stays light like the rest of the app */
          .kn-app.kn-dark:not(.note-open) {
            background: #ffffff;
          }
          .kn-dark:not(.note-open) .kn-sidebar {
            background: #ffffff;
          }
          .kn-dark:not(.note-open) .kn-section-label {
            color: ${GRAY};
          }
          .kn-dark:not(.note-open) .kn-row-title {
            color: ${INK};
          }
          .kn-dark:not(.note-open) .kn-row + .kn-row::before {
            background: #ececec;
          }
          .kn-dark:not(.note-open) .kn-row.is-selected {
            background: #fce49b;
          }
          .kn-dark:not(.note-open) .kn-row.is-selected .kn-row-title {
            color: ${INK};
          }
          .kn-dark:not(.note-open) .kn-row.is-selected .kn-row-snippet {
            color: ${GRAY};
          }
        }
      `}</style>
    </div>
  )
}
