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
          "about me kayna huang product designer design engineer cognitive science political science barnard columbia HCI AI creative tools opusclip video AI heygen reach me email kh3443 what i think about on X arts lover",
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
              <li>
                on <NoteLink href="https://x.com/kayna_xyz">X</NoteLink>
              </li>
              <li>arts lover</li>
            </ul>
            <PhotoGallery photos={INTRO_PHOTOS} columns={3} />
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
          "what I think about questions mode of thinking founders great products apple figma AI reshape institutional jobs reprice labor market binary 0/1 evaluate product design future of technology impact product-first startup",
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
          "my reading list everything I've been reading books metro 2033 brave new world 1984 animal farm dune 2001 a space odyssey the three-body problem 三体 steve jobs isaacson aiming high masayoshi son 孙正义 leonardo da vinci 达芬奇 zero to one excellent sheep self-made man norah vincent sci-fi 黄仁勋 英伟达之芯 nvidia jensen huang 毛泽东传 王兴传 美团 elon musk 马斯克 isaacson the airbnb story 爱彼迎 只有偏执狂才能生存 安迪格鲁夫 only the paranoid survive 从优秀到卓越 good to great 吉姆柯林斯 段永平投资问答录 因为独特 王宁 泡泡玛特 pop mart 置身事内 兰小欢 创新与企业家精神 彼得德鲁克 drucker innovation and entrepreneurship andy grove jim collins",
        body: (
          <>
            <p>people, business, and sci-fi, left to right. hover on the books to see more.</p>
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
  const [noteOpen, setNoteOpen] = useState(true) // mobile: note pane visible; start on the about note
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
