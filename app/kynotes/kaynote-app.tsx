"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

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
  snippet: string
  date: string
  searchText: string
  body: React.ReactNode
  wide?: boolean // let the body span the full note pane (e.g. the bookshelf)
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
  slug: string
  title: string
  author: string
  tag: string // genre chip shown in the book modal
  desc: string
  width: number
  height: number
}

const BOOKS: Book[] = [
  {
    slug: "metro2033",
    title: "Metro 2033",
    author: "Dmitry Glukhovsky",
    tag: "sci-fi",
    desc: "survivors live on in the Moscow metro after nuclear war wipes out the surface. claustrophobic, rule-based horror at its best.",
    width: 300,
    height: 456,
  },
  {
    slug: "brave-new-world",
    title: "Brave New World",
    author: "Aldous Huxley",
    tag: "dystopia",
    desc: "a dystopia where no one has to suffer, and that is exactly the problem. happiness engineered at scale, no freedom required.",
    width: 300,
    height: 478,
  },
  {
    slug: "1984",
    title: "1984",
    author: "George Orwell",
    tag: "dystopia",
    desc: "Big Brother, doublethink, and the machinery of total surveillance. the world where we live right now.",
    width: 300,
    height: 484,
  },
  {
    slug: "animal-farm",
    title: "Animal Farm",
    author: "George Orwell",
    tag: "dystopia",
    desc: "the animals take over the farm, and the revolution slowly eats itself. the sharpest political fable ever written.",
    width: 300,
    height: 538,
  },
  {
    slug: "dune",
    title: "Dune",
    author: "Frank Herbert",
    tag: "sci-fi",
    desc: "a desert planet, a precious spice, and the politics of prophecy. the epic that defined modern sci-fi.",
    width: 300,
    height: 446,
  },
  {
    slug: "2001",
    title: "2001: A Space Odyssey",
    author: "Arthur C. Clarke",
    tag: "sci-fi",
    desc: "from the monolith to HAL, a story about intelligence outgrowing its makers. written alongside Kubrick's film.",
    width: 300,
    height: 510,
  },
  {
    slug: "three-body",
    title: "The Three-Body Problem",
    author: "Cixin Liu",
    tag: "sci-fi",
    desc: "first contact turns into a centuries-long game of survival between civilizations. the best sci-fi in Chinese history.",
    width: 300,
    height: 453,
  },
  {
    slug: "steve-jobs",
    title: "Steve Jobs",
    author: "Walter Isaacson",
    tag: "biography",
    desc: "the definitive biography of Steve Jobs, built on more than forty interviews with Jobs himself. taste, control, and the reality distortion field.",
    width: 300,
    height: 450,
  },
  {
    slug: "son-masayoshi",
    title: "Aiming High",
    author: "Atsuo Inoue",
    tag: "biography",
    desc: "how Masayoshi Son built SoftBank on a 300-year vision and outrageous bets, from software distribution to the internet age.",
    width: 266,
    height: 400,
  },
  {
    slug: "da-vinci",
    title: "Leonardo da Vinci",
    author: "Walter Isaacson",
    tag: "biography",
    desc: "Leonardo as the ultimate cross-disciplinary mind, art and science feeding each other. from the author of the Jobs biography.",
    width: 300,
    height: 453,
  },
  {
    slug: "zero-to-one",
    title: "Zero to One",
    author: "Peter Thiel",
    tag: "startups",
    desc: "notes on startups: competition is for losers, build a monopoly on something new. going from 0 to 1 instead of 1 to n.",
    width: 300,
    height: 452,
  },
  {
    slug: "excellent-sheep",
    title: "Excellent Sheep",
    author: "William Deresiewicz",
    tag: "essays",
    desc: "a critique of elite education and the students it produces, brilliant at hoop-jumping, lost at everything else.",
    width: 300,
    height: 457,
  },
  {
    slug: "self-made-man",
    title: "Self-Made Man",
    author: "Norah Vincent",
    tag: "experiment",
    desc: "a feminist lives undercover as a man for eighteen months to see manhood from the inside. the experiment broke her, and years later she chose to end her life.",
    width: 300,
    height: 453,
  },
]

function Bookshelf() {
  const [openBook, setOpenBook] = useState<Book | null>(null)

  return (
    <div className="kn-shelf">
      {BOOKS.map((book) => (
        <button className="kn-book" key={book.slug} onClick={() => setOpenBook(book)}>
          <span className="kn-book-cover">
            <img
              src={`/kaynote/books/${book.slug}.webp`}
              alt={book.title}
              width={book.width}
              height={book.height}
              loading="lazy"
            />
          </span>
          <span className="kn-book-title">{book.title}</span>
          <span className="kn-book-author">{book.author}</span>
          <span className="kn-book-tag">{book.tag}</span>
        </button>
      ))}

      {openBook && (
        <div
          className="kn-book-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={openBook.title}
          onClick={() => setOpenBook(null)}
        >
          <div className="kn-book-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="kn-book-close"
              aria-label="Close"
              onClick={() => setOpenBook(null)}
            >
              ✕
            </button>
            <img
              className="kn-book-modal-cover"
              src={`/kaynote/books/${openBook.slug}.webp`}
              alt={openBook.title}
              width={openBook.width}
              height={openBook.height}
            />
            <p className="kn-book-modal-title">{openBook.title}</p>
            <p className="kn-book-modal-author">{openBook.author}</p>
            <p className="kn-book-modal-tag">{openBook.tag}</p>
            <p className="kn-book-modal-desc">{openBook.desc}</p>
          </div>
        </div>
      )}
    </div>
  )
}

type Photo = {
  src: string
  alt: string
  width: number
  height: number
}

const INTRO_PHOTOS: Photo[] = [
  { src: "/kaynote/intro/me-1.webp", alt: "black-and-white portrait by a window", width: 900, height: 900 },
  { src: "/kaynote/intro/me-3.webp", alt: "on a street in SoHo, New York", width: 900, height: 1261 },
]

// Display-only grid — the intro photos are deliberately not clickable.
function PhotoGallery({ photos, columns }: { photos: Photo[]; columns?: number }) {
  return (
    <div className={`kn-art-grid${columns === 3 ? " kn-art-grid-3" : ""}`}>
      {photos.map((a) => (
        <span className="kn-art-thumb" key={a.src}>
          <img src={a.src} alt={a.alt} width={a.width} height={a.height} loading="lazy" />
        </span>
      ))}
    </div>
  )
}

const SECTIONS: Section[] = [
  {
    label: "intro",
    notes: [
      {
        id: "about-me",
        title: "about",
        snippet: "product designer & design engineer",
        date: "July 11, 2026 at 9:47 AM",
        searchText:
          "about me kayna huang product designer design engineer cognitive science political science barnard columbia HCI AI creative tools opusclip video AI heygen reach me email kh3443 what i think about on X poker lover arts kid uwc alum",
        body: (
          <>
            <p style={{ marginTop: 0 }}>
              kayna huang, product designer &amp; design engineer
            </p>
            <p>
              building creative tools at{" "}
              <NoteLink href="https://www.forbes.com/sites/ianshepherd/2025/03/13/softbank-is-betting-on-the-future-of-ai-content-creation-with-opusclip/">
                Opusclip
              </NoteLink>
              , and designed video AI products at{" "}
              <NoteLink href="https://heygen.com">HeyGen</NoteLink>. studying cognitive science
              &amp; political science at Barnard/Columbia, with specialization in hci &amp; ai
            </p>
            <p>
              reach me at{" "}
              <NoteLink href="mailto:kh3443@columbia.edu">kh3443@columbia.edu</NoteLink>
            </p>
            <p className="kn-subhead">anything else?</p>
            <ul>
              <li>
                <NoteJump noteId="what-i-think-about">what i think about</NoteJump>
              </li>
              <li>poker lover</li>
              <li>
                on <NoteLink href="https://x.com/kayna_xyz">X</NoteLink>
              </li>
              <li>arts kid since 8</li>
              <li>
                <NoteLink href="https://en.wikipedia.org/wiki/United_World_College_Changshu_China">
                  uwc
                </NoteLink>{" "}
                alum
              </li>
            </ul>
            <PhotoGallery photos={INTRO_PHOTOS} columns={3} />
          </>
        ),
      },
      {
        id: "portfolio",
        title: "where is the portfolio?",
        snippet: "where my product design work lives",
        date: "July 11, 2026 at 10:02 AM",
        searchText:
          "portfolio product design work case studies close kaynotes where my product design work lives",
        body: (
          <>
            <p>
              if you want to see my product design portfolio, close KyNotes (you know how to
              close it).
            </p>
            <p>don&apos;t worry, you can always come back.</p>
          </>
        ),
      },
    ],
  },
  {
    label: "blog",
    notes: [
      {
        id: "what-i-think-about",
        title: "what I think about",
        snippet: "the future of technology and humanity",
        date: "July 11, 2026 at 10:21 AM",
        searchText:
          "what I think about questions mode of thinking founders great products apple figma AI reshape institutional jobs reprice labor market binary 0/1 evaluate product design future of technology impact product-first startup effective altruism",
        body: (
          <>
            <p>the future of technology and humanity.</p>
            <ul>
              <li>
                what is the mode of thinking shared by the founders of great products (e.g.,
                Apple, Figma)?
              </li>
              <li>how will AI reshape institutional jobs and reprice the labor market?</li>
              <li>is there a binary (0/1) method that can evaluate product design?</li>
              <li>future of technology</li>
              <li>
                how can I make an impact on the world through my experience in product and design,
                and by building a product-first startup?
              </li>
              <li>effective altruism</li>
              <li>etc</li>
            </ul>
          </>
        ),
      },
      {
        id: "reading-list",
        title: "my reading list",
        snippet: "everything I've been reading",
        date: "February 15, 2026 at 10:12 AM",
        wide: true,
        searchText:
          "my reading list everything I've been reading books metro 2033 brave new world 1984 animal farm dune 2001 a space odyssey the three-body problem 三体 steve jobs isaacson aiming high masayoshi son 孙正义 leonardo da vinci 达芬奇 zero to one excellent sheep self-made man norah vincent sci-fi",
        body: (
          <>
            <p>sci-fi, experiments, biographies.</p>
            <Bookshelf />
          </>
        ),
      },
      {
        id: "post-ai-design",
        title: "in the post-AI era, design is no longer what it used to be.",
        snippet: "the fundamentals of a design builder",
        date: "January 19, 2026 at 8:30 PM",
        searchText:
          "in the post-AI era design is no longer what it used to be fundamentals of a design builder design engineering product design vercel design playground tools reading",
        body: (
          <>
            <p>
              the fundamentals of a design builder: notes on design engineering &amp; product
              design, articles worth reading, and tools I actually use.
            </p>
            <p className="kn-subhead">reading</p>
            <ul>
              <li>
                what design engineering takes,{" "}
                <NoteLink href="https://vercel.com/blog/design-engineering-at-vercel">
                  design engineering at Vercel
                </NoteLink>
              </li>
            </ul>
            <p className="kn-subhead">tools</p>
            <ul>
              <li>
                a new kind of design playground,{" "}
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
    label: "trading",
    notes: [
      {
        id: "trading-portfolio",
        title: "invest",
        snippet: "pocket robinhood",
        date: "July 11, 2026 at 11:32 AM",
        wide: true,
        searchText:
          "my trading portfolio trading investing invest crypto bitcoin btc markets stocks robinhood watchlist news prices nvda nvidia googl google hood orcl oracle crm salesforce hsai amba mbly asml qcom clsk mu micron nbis slv silver s&p 500 nasdaq dark mode",
        body: <TradingPanel />,
      },
    ],
  },
  {
    label: "lifestyle",
    notes: [
      {
        id: "restaurants",
        title: "🍽️ restaurants in nyc",
        snippet: "the best in new york city",
        date: "July 11, 2026 at 1:12 PM",
        wide: true,
        searchText:
          "restaurants in NYC new york food eat kayna's special collection restaurant list map japanese omakase sushi korean kotobuki kimura yakitori taisho davelle genki tsukimi sushi ikumi mori noda unique omakase ume odo ito nakaji tsubame class on 38th senya sushi noz bar masa hirohisa tosokchon samwoojung antoya moono anto korean steak house oiji mi 53 yong chuan yongchuan happy hot hunan columbia murray's cheese a pasta bar sea le jardin bistro zou zou's ping's dudleys our new york vodka le café louis vuitton",
        body: (
          <>
            <p>kayna&apos;s special collection of foods in new york city.</p>
            <RestaurantMap />
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
  const [noteOpen, setNoteOpen] = useState(false) // mobile: note pane visible
  const [query, setQuery] = useState("")
  const [copied, setCopied] = useState(false)

  // NoteJump links inside note bodies dispatch this event to switch notes
  useEffect(() => {
    const onOpenNote = (e: Event) => {
      setSelectedId((e as CustomEvent<string>).detail)
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
        await navigator.share({ title: "KyNotes", url })
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
            aria-label="Close KyNotes, back to home"
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
                  onClick={() => {
                    setSelectedId(note.id)
                    setNoteOpen(true)
                  }}
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
          <h1 className="kn-title">{selected.title}</h1>
          <div className={`kn-body${selected.wide ? " kn-body--wide" : ""}`}>{selected.body}</div>
        </div>
      </section>

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
          max-width: 680px;
          margin: 0 0 10px;
          line-height: 1.25;
        }
        .kn-body {
          max-width: 680px;
        }
        .kn-body--wide {
          max-width: none;
        }
        .kn-body :global(p) {
          font-size: 14px;
          line-height: 20px;
          color: ${INK};
          margin: 0 0 12px;
        }
        .kn-body :global(p.kn-subhead) {
          font-weight: 700;
          margin-top: 24px;
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

        /* ── Bookshelf (reading list), Apple Books style ── */
        .kn-body :global(.kn-shelf) {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          column-gap: 32px;
          row-gap: 40px;
          margin-top: 24px;
        }
        .kn-body :global(.kn-book) {
          display: flex;
          flex-direction: column;
          background: none;
          border: none;
          padding: 0;
          text-align: left;
          font-family: inherit;
          cursor: pointer;
        }
        .kn-body :global(.kn-book-cover) {
          position: relative;
          display: block;
          width: 100%;
          aspect-ratio: 27 / 40;
          border-radius: 10px;
          overflow: hidden;
          box-shadow:
            0 1px 3px rgba(0, 0, 0, 0.16),
            0 5px 14px rgba(0, 0, 0, 0.12);
        }
        .kn-body :global(.kn-book-cover img) {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .kn-body :global(.kn-book-title) {
          font-size: 13px;
          font-weight: 600;
          color: ${INK};
          line-height: 1.3;
          margin: 10px 0 0;
        }
        .kn-body :global(.kn-book-author) {
          font-size: 12px;
          line-height: 1.35;
          color: ${GRAY};
          margin: 2px 0 0;
        }
        .kn-body :global(.kn-book-tag) {
          align-self: flex-start;
          font-size: 10px;
          font-weight: 600;
          line-height: 1;
          color: #7c7c80;
          background: #efeff0;
          border-radius: 100px;
          padding: 4px 8px;
          margin-top: 7px;
        }

        /* book detail popup, iOS Books style */
        .kn-body :global(.kn-book-backdrop) {
          position: fixed;
          inset: 0;
          z-index: 50;
          background: rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          animation: kn-fade-in 0.18s ease-out;
        }
        .kn-body :global(.kn-book-modal) {
          position: relative;
          width: 100%;
          max-width: 400px;
          max-height: calc(100dvh - 48px);
          overflow-y: auto;
          background: #ffffff;
          border-radius: 14px;
          padding: 40px 28px 28px;
          text-align: center;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.3);
          animation: kn-pop-in 0.22s cubic-bezier(0.2, 0.9, 0.3, 1.2);
        }
        .kn-body :global(.kn-book-close) {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 26px;
          height: 26px;
          border: none;
          border-radius: 50%;
          background: #efeff0;
          color: #7c7c80;
          font-size: 12px;
          line-height: 1;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .kn-body :global(.kn-book-close:hover) {
          color: ${INK};
        }
        .kn-body :global(.kn-book-modal-cover) {
          width: 150px;
          height: auto;
          border-radius: 8px;
          box-shadow:
            0 2px 6px rgba(0, 0, 0, 0.18),
            0 10px 24px rgba(0, 0, 0, 0.16);
          margin: 0 auto;
          display: block;
        }
        .kn-body :global(p.kn-book-modal-title) {
          font-size: 17px;
          font-weight: 700;
          line-height: 1.25;
          margin: 20px 0 0;
        }
        .kn-body :global(p.kn-book-modal-author) {
          font-size: 13px;
          color: ${GRAY};
          margin: 3px 0 0;
        }
        .kn-body :global(p.kn-book-modal-tag) {
          display: inline-block;
          font-size: 11px;
          font-weight: 600;
          color: #7c7c80;
          background: #efeff0;
          border-radius: 100px;
          padding: 3px 10px;
          margin: 10px auto 0;
        }
        .kn-body :global(p.kn-book-modal-desc) {
          font-size: 14px;
          line-height: 20px;
          text-align: left;
          margin: 16px 0 0;
        }
        /* ── Art gallery (arts note), Apple Notes photo grid ── */
        .kn-body :global(.kn-art-grid) {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 6px;
          margin: 16px 0 20px;
        }
        .kn-body :global(.kn-art-grid-3) {
          grid-template-columns: repeat(3, 1fr);
          max-width: 480px;
          margin-top: 28px;
        }
        .kn-body :global(.kn-art-thumb) {
          border: none;
          padding: 0;
          background: none;
          border-radius: 4px;
          overflow: hidden;
          aspect-ratio: 1;
        }
        .kn-body :global(.kn-art-thumb img) {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        /* intro photos are portraits of people — crop from the top so faces stay in frame */
        .kn-body :global(.kn-art-grid-3 .kn-art-thumb img) {
          object-position: center top;
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
          .kn-body :global(.kn-shelf) {
            grid-template-columns: repeat(2, 1fr);
            column-gap: 20px;
            row-gap: 28px;
          }
          .kn-body :global(.kn-art-grid) {
            grid-template-columns: repeat(3, 1fr);
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
