/*
  EffectsEngine — the playful particle system behind the sticker tray.

  All particle DOM is created imperatively and animated in a single rAF loop
  (no React re-render per frame). The engine owns three fixed-position layers:

    capture  — full screen, catches pointer input while a tool is active and
               hides the native cursor (a follower element stands in for it)
    overlay  — holds every particle; pointer-events: none
    follower — the "tool" cursor (gun / wand / butterfly), follows the mouse

  Tools: "gun" (press-and-hold → a continuous stream of bubbles),
  "wand" (press-and-hold → one growing bubble),
  "butterfly" (click → a small swarm). Pepe rain is a one-shot, not a tool.
*/

export type Tool = "gun" | "wand" | "butterfly"

const ASSET = {
  gun: "/effects/gun.webp",
  wand: "/effects/wand.webp",
  butterfly: "/effects/butterfly.webp",
  pepe: "/effects/pepe.webp",
}

// Gun follower placement — the 52×52 follower box is offset from the pointer
// and rotated; the muzzle (bubble ring) sits at the upper-left of gun.webp.
// These constants are shared by positionFollower() and gunMuzzle() so the
// bubbles always leave from the ring, not the cursor.
const GUN_TX = -12
const GUN_TY = -30
const GUN_ROT_DEG = -30
// muzzle aperture in the follower's local (unrotated) coords; gun.webp is
// 236×224 contained in 52×52 and the ring centre sits near frac (0.30, 0.18).
const GUN_MUZZLE_X = 15
const GUN_MUZZLE_Y = 9

const rand = (a: number, b: number) => a + Math.random() * (b - a)
const chance = (p: number) => Math.random() < p

// ---- glass refraction (Figma "Glass" → Refraction) -------------------------
// Each bubble lenses the page behind it with an SVG feDisplacementMap driven by
// a sphere normal map (R/G channels = surface slope, growing toward the rim).
// The displacement `scale` IS the refraction strength: 40 at the ⌀80 reference,
// scaled down for smaller bubbles. Filters use userSpaceOnUse units (scale in
// px), so each is tied to a diameter bucket; we inject one per bucket and cache.
const SVGNS = "http://www.w3.org/2000/svg"
const XLINK = "http://www.w3.org/1999/xlink"
const REFRACT_AT_80 = 70 // the requested "Refraction = 70", defined at ⌀80
const DISPERSION = 80 // Figma "Glass" Dispersion: chromatic spread of R/G/B (0–100)
const DISPERSION_MAX_PX_80 = 8 // px the R/B channels diverge from G at full (100) @ ⌀80
let refractDefs: SVGSVGElement | null = null
const refractBuckets = new Set<number>()

// Keep only one colour channel (+ full alpha) from an input — used to split the
// per-channel displaced backdrops before screen-compositing them back together.
const CHANNEL_MATRIX: Record<"R" | "G" | "B", string> = {
  R: "1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0",
  G: "0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0",
  B: "0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0",
}

// Returns `url(#…)` for a refraction filter sized to diameter `d` (bucketed to
// 8px steps so we only ever inject ~8 filters across the bubble size range).
function refractFilter(d: number): string {
  if (typeof document === "undefined") return "none"
  const dB = Math.max(16, Math.round(d / 8) * 8)
  if (!refractDefs) {
    refractDefs = document.createElementNS(SVGNS, "svg")
    refractDefs.setAttribute("width", "0")
    refractDefs.setAttribute("height", "0")
    refractDefs.style.position = "absolute"
    refractDefs.style.pointerEvents = "none"
    refractDefs.appendChild(document.createElementNS(SVGNS, "defs"))
    document.body.appendChild(refractDefs)
  }
  if (!refractBuckets.has(dB)) {
    refractBuckets.add(dB)
    const k = dB / 80
    const scale = k * REFRACT_AT_80
    // chromatic dispersion: refract each channel by a slightly different amount
    // so the rim gets a prism fringe. spread scales with bubble size + dispersion.
    const disp = k * DISPERSION_MAX_PX_80 * (DISPERSION / 100)
    const margin = dB * 0.35
    const filter = document.createElementNS(SVGNS, "filter")
    filter.setAttribute("id", `fxRefract-${dB}`)
    filter.setAttribute("color-interpolation-filters", "sRGB")
    filter.setAttribute("filterUnits", "userSpaceOnUse")
    filter.setAttribute("x", `${-margin}`)
    filter.setAttribute("y", `${-margin}`)
    filter.setAttribute("width", `${dB + margin * 2}`)
    filter.setAttribute("height", `${dB + margin * 2}`)

    const feImage = document.createElementNS(SVGNS, "feImage")
    feImage.setAttribute("x", "0")
    feImage.setAttribute("y", "0")
    feImage.setAttribute("width", `${dB}`)
    feImage.setAttribute("height", `${dB}`)
    feImage.setAttribute("preserveAspectRatio", "none")
    feImage.setAttribute("result", "map")
    feImage.setAttribute("href", "/effects/bubble-normal.png")
    feImage.setAttributeNS(XLINK, "xlink:href", "/effects/bubble-normal.png")
    filter.appendChild(feImage)

    // one displaced + channel-isolated pass per colour; red bends least, blue
    // most (longer wavelength refracts less), matching real glass dispersion.
    const channels: { ch: "R" | "G" | "B"; scale: number }[] = [
      { ch: "R", scale: scale - disp },
      { ch: "G", scale: scale },
      { ch: "B", scale: scale + disp },
    ]
    for (const { ch, scale: s } of channels) {
      const dispEl = document.createElementNS(SVGNS, "feDisplacementMap")
      dispEl.setAttribute("in", "SourceGraphic")
      dispEl.setAttribute("in2", "map")
      dispEl.setAttribute("scale", `${s}`)
      dispEl.setAttribute("xChannelSelector", "R")
      dispEl.setAttribute("yChannelSelector", "G")
      dispEl.setAttribute("result", `d${ch}`)
      filter.appendChild(dispEl)

      const mat = document.createElementNS(SVGNS, "feColorMatrix")
      mat.setAttribute("in", `d${ch}`)
      mat.setAttribute("type", "matrix")
      mat.setAttribute("values", CHANNEL_MATRIX[ch])
      mat.setAttribute("result", ch)
      filter.appendChild(mat)
    }
    // screen-add the three isolated channels back into one full-colour image
    const blendRG = document.createElementNS(SVGNS, "feBlend")
    blendRG.setAttribute("mode", "screen")
    blendRG.setAttribute("in", "R")
    blendRG.setAttribute("in2", "G")
    blendRG.setAttribute("result", "RG")
    filter.appendChild(blendRG)

    const blendRGB = document.createElementNS(SVGNS, "feBlend")
    blendRGB.setAttribute("mode", "screen")
    blendRGB.setAttribute("in", "RG")
    blendRGB.setAttribute("in2", "B")
    filter.appendChild(blendRGB)

    refractDefs.querySelector("defs")!.appendChild(filter)
  }
  return `url(#fxRefract-${dB})`
}

interface Particle {
  el: HTMLElement
  step(dt: number, now: number): boolean // return false to remove
  kill(): void
}

// ---------------------------------------------------------------- Bubble ----

interface BubbleOpts {
  x: number
  y: number
  r: number
  vx: number
  vy: number
  gravity?: number // px/s^2 applied to vy (negative = keep rising)
  swayAmp?: number
  popAfter?: number | null // seconds until auto-pop, or null = never
  bigPop?: boolean
  opacity?: number // resting opacity (1 = solid); pop fades from this to 0
}

class Bubble implements Particle {
  el: HTMLElement
  private x: number
  private y: number
  private r: number
  private vx: number
  private vy: number
  private gravity: number
  private swayAmp: number
  private swayFreq: number
  private popAfter: number | null
  private bigPop: boolean
  private baseOpacity: number
  private life = 0
  private popping = false
  private popT = 0
  private popDur = 0.26

  constructor(o: BubbleOpts) {
    this.x = o.x
    this.y = o.y
    this.r = o.r
    this.vx = o.vx
    this.vy = o.vy
    this.gravity = o.gravity ?? 0
    this.swayAmp = o.swayAmp ?? rand(8, 22)
    this.swayFreq = rand(1.2, 2.6)
    this.popAfter = o.popAfter ?? null
    this.bigPop = !!o.bigPop
    this.baseOpacity = o.opacity ?? 1

    const el = document.createElement("div")
    el.className = "fx-bubble"
    const d = this.r * 2
    el.style.width = `${d}px`
    el.style.height = `${d}px`
    const s = d / 80
    // glass refraction: lens the page behind the bubble (Figma Refraction 70),
    // plus a touch of blur so the lensed content reads as soft glass.
    // (drop shadow temporarily removed to preview the bare refraction look)
    const bf = `${refractFilter(d)} blur(${(s * 2).toFixed(2)}px)`
    el.style.backdropFilter = bf
    el.style.setProperty("-webkit-backdrop-filter", bf)
    this.el = el
    this.draw(1, this.baseOpacity)
  }

  private draw(scale: number, opacity: number) {
    this.el.style.transform = `translate(${this.x - this.r}px, ${this.y - this.r}px) scale(${scale})`
    this.el.style.opacity = `${opacity}`
  }

  private startPop() {
    this.popping = true
    this.popT = 0
    this.el.classList.add("fx-bubble--pop")
  }

  step(dt: number, now: number): boolean {
    this.life += dt
    if (this.popping) {
      this.popT += dt
      const t = Math.min(this.popT / this.popDur, 1)
      const target = this.bigPop ? 2.3 : 1.55
      this.draw(1 + (target - 1) * t, this.baseOpacity * (1 - t))
      return this.popT < this.popDur
    }

    this.vy += this.gravity * dt
    const sway = Math.sin(this.life * this.swayFreq) * this.swayAmp
    this.x += (this.vx + sway) * dt
    this.y += this.vy * dt
    this.draw(1, this.baseOpacity)

    if (this.popAfter != null && this.life >= this.popAfter) {
      this.startPop()
      return true
    }
    const m = this.r + 60
    if (this.x < -m || this.x > innerWidth + m || this.y < -m || this.y > innerHeight + m)
      return false
    return true
  }

  kill() {
    this.el.remove()
  }
}

// ------------------------------------------------------------------ Pepe ----

// Falling rain sprites. Each carries a render aspect (width / height): pepe is
// kept square to match its original look; shock keeps its true proportions so
// the taller-than-wide face isn't squished.
const RAIN_SPRITES: { src: string; aspect: number }[] = [
  { src: ASSET.pepe, aspect: 1 },
  { src: "/effects/shock.png", aspect: 53 / 67 },
]

class Pepe implements Particle {
  el: HTMLElement
  private x: number
  private y: number
  private vy: number
  private vx: number
  private rot: number
  private vrot: number
  private size: number

  constructor() {
    const sprite = RAIN_SPRITES[rand(0, RAIN_SPRITES.length) | 0]
    this.size = rand(38, 86)
    const w = this.size
    const h = this.size / sprite.aspect
    this.x = rand(0, innerWidth - w)
    this.y = -h - rand(0, 700)
    this.vy = rand(220, 460)
    this.vx = rand(-30, 30)
    this.rot = rand(-25, 25)
    this.vrot = rand(-40, 40)

    const el = document.createElement("img")
    el.src = sprite.src
    el.className = "fx-pepe"
    el.draggable = false
    el.decoding = "async" // never block a frame on image decode
    el.style.width = `${w}px`
    el.style.height = `${h}px`
    this.el = el
  }

  step(dt: number): boolean {
    this.y += this.vy * dt
    this.x += this.vx * dt
    this.rot += this.vrot * dt
    this.el.style.transform = `translate(${this.x}px, ${this.y}px) rotate(${this.rot}deg)`
    return this.y < innerHeight + this.size + 40
  }

  kill() {
    this.el.remove()
  }
}

// ------------------------------------------------------------- Butterfly ----

type BflyState = "rest" | "walk" | "wander" | "gather" | "flyaway"

// Butterfly sprites — top-down wing photos, trimmed and centred on the body
// axis. `aspect` is source width/height; sprites render at a random width.
interface BflySprite {
  src: string
  aspect: number
}
const BFLY_SPRITES: BflySprite[] = [
  { src: "/effects/bfly-morpho.png", aspect: 1.289 }, // blue morpho
  { src: "/effects/bfly-tiger.png", aspect: 1.763 }, // brown tiger
  { src: "/effects/bfly-morpho2.png", aspect: 1.628 }, // bright blue morpho
  { src: "/effects/bfly-monarch.png", aspect: 1.4 }, // monarch
  { src: "/effects/bfly-buckeye.png", aspect: 1.354 }, // brown eyespot buckeye
  { src: "/effects/bfly-morpho3.png", aspect: 1.165 }, // pale blue morpho
  { src: "/effects/bfly-swallowtail.png", aspect: 1.0 }, // green swallowtail
  { src: "/effects/bfly-orange.png", aspect: 1.22 }, // bright orange
  { src: "/effects/bfly-skyblue.png", aspect: 1.448 }, // light blue morpho
  { src: "/effects/bfly-sulphur.png", aspect: 1.406 }, // orange eyespot sulphur
  { src: "/effects/bfly-pale.png", aspect: 1.273 }, // pale cream
  { src: "/effects/bfly-white.png", aspect: 1.524 }, // white
  { src: "/effects/bfly-pink.png", aspect: 1.419 }, // pink
  { src: "/effects/bfly-cabbage.png", aspect: 1.5 }, // white, black-tipped (cabbage)
  { src: "/effects/bfly-whitemorpho.png", aspect: 1.221 }, // large white morpho
  { src: "/effects/bfly-rose.png", aspect: 1.519 }, // rose pink
]

// Wing flap. The flap is a horizontal fold — the 2D projection of the wings
// tilting up: a wing tilted by θ projects to cos(θ) of its flat width, so the
// CSS squashes scaleX from 1 (flat, wings spread) down to cos(angle) at the peak
// of each beat. Each butterfly picks its OWN fold angle in this range, so some
// barely flutter and some fold their wings nearly shut.
const FLAP_ANGLE_MIN_DEG = 41
const FLAP_ANGLE_MAX_DEG = 90
const flapMinFor = (deg: number) => Math.cos((deg * Math.PI) / 180)

// per-state wing-beat (seconds for one half-flap; the CSS alternates, so a full
// open→close→open cycle is twice this). Faster = more energetic.
const FLAP_DUR: Record<BflyState, number> = {
  rest: 0.9, // perched in place, slow lazy flap
  walk: 1.0, // strolling — wings barely move
  wander: 0.42, // flitting around
  gather: 0.58, // flying to / hovering at the meet-up
  flyaway: 0.2, // bolting off-screen
}

// What a butterfly can do. On spawn it picks one at random; the engine also
// flips resting ones to "gather", and the cursor flips any to "flyaway":
//   rest    — sit still where it is and flap (静止在原地)
//   walk    — crawl a few steps to a nearby spot, then perch (走路)
//   wander  — flit to random spots around the screen (乱飞)
//   gather  — fly over and cluster with the others, then settle (聚在一起)
//   flyaway — bolt off-screen fast (直接飞走 / scared by the cursor / old age)
class Butterfly implements Particle {
  el: HTMLElement
  private flap: HTMLElement
  private x: number
  private y: number
  private vx = 0
  private vy = 0
  private tx: number
  private ty: number
  private rot = rand(0, 360) // orientation in degrees — random on spawn
  private flapScale = rand(0.6, 1.9) // per-butterfly wing-beat speed (wide → varied)
  private speedScale = rand(0.72, 1.45) // per-butterfly travel speed (incl. fly-away)
  private gx = 0 // cluster centre while gathering
  private gy = 0
  private size: number // width in px
  private height: number
  private bobPhase = rand(0, 6.28)
  private state: BflyState = "rest"
  private stateT = 0
  private stateDur = 0
  private age = 0
  private spawnGuard = 0.9 // immune to the cursor right after spawning
  private lifespan = rand(34, 60)
  dead = false

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
    this.tx = x
    this.ty = y
    const sprite = BFLY_SPRITES[(Math.random() * BFLY_SPRITES.length) | 0]
    this.size = rand(40, 82)
    this.height = this.size / sprite.aspect

    const el = document.createElement("div")
    el.className = "fx-bfly"
    el.style.width = `${this.size}px`
    el.style.height = `${this.height}px`
    el.style.marginLeft = `${-this.size / 2}px`
    el.style.marginTop = `${-this.height / 2}px`
    // one sprite; the flap is a smooth horizontal fold of the whole span — no
    // seam, no split body. --fx-flap-min carries cos(FLAP_ANGLE_DEG) to the CSS.
    el.innerHTML = `<div class="fx-bfly-flap"><img alt="" src="${sprite.src}"></div>`
    this.el = el
    this.flap = el.firstElementChild as HTMLElement
    // each butterfly folds its wings to its own angle (40°–85°)
    const flapAngle = rand(FLAP_ANGLE_MIN_DEG, FLAP_ANGLE_MAX_DEG)
    this.flap.style.setProperty("--fx-flap-min", flapMinFor(flapAngle).toFixed(3))

    // random behaviour the moment it appears
    const roll = Math.random()
    if (roll < 0.22) {
      this.flyAway() // 直接飞走
    } else if (roll < 0.58) {
      this.startRest() // 静止在原地
    } else {
      this.newWanderTarget()
      this.setState("wander", rand(6, 14)) // 乱飞
    }
  }

  private applyFlap() {
    const dur = FLAP_DUR[this.state] * this.flapScale
    this.flap.style.setProperty("--fx-flap-dur", `${dur.toFixed(3)}s`)
  }

  private setState(s: BflyState, dur: number) {
    this.state = s
    this.stateT = 0
    this.stateDur = dur
    this.applyFlap()
  }

  private newWanderTarget() {
    const m = 60
    this.tx = rand(m, innerWidth - m)
    this.ty = rand(m, innerHeight - m)
  }

  // settle in place and perch for a bit
  private startRest() {
    this.tx = this.x
    this.ty = this.y
    this.setState("rest", rand(2, 5))
  }

  // crawl a short distance to a nearby spot, then it will perch again
  private startWalk() {
    const ang = rand(0, Math.PI * 2)
    const d = rand(45, 120)
    this.tx = Math.max(40, Math.min(innerWidth - 40, this.x + Math.cos(ang) * d))
    this.ty = Math.max(40, Math.min(innerHeight - 40, this.y + Math.sin(ang) * d))
    this.setState("walk", rand(2.5, 4.5))
  }

  // ----- public hooks the engine drives

  getXY() {
    return [this.x, this.y] as const
  }
  distanceTo(px: number, py: number) {
    return Math.hypot(this.x - px, this.y - py)
  }
  scareRadius() {
    return this.size * 0.7 + 16
  }
  canScare() {
    return this.state !== "flyaway" && this.age > this.spawnGuard
  }
  canGather() {
    return this.state === "rest" || this.state === "walk"
  }

  // join a cluster at (gx, gy) — a "stroke"/text spot the engine picked. The
  // butterfly flies in, then keeps milling around the spot (it never freezes).
  gatherTo(gx: number, gy: number) {
    this.gx = gx
    this.gy = gy
    this.tx = gx + rand(-26, 26)
    this.ty = gy + rand(-22, 22)
    this.setState("gather", rand(6, 13))
  }

  // bolt off-screen, directly away from whatever spooked it (the cursor)
  scare(fromX: number, fromY: number) {
    if (this.state === "flyaway") return
    const ang = Math.atan2(this.y - fromY, this.x - fromX)
    const reach = innerWidth + innerHeight
    this.tx = this.x + Math.cos(ang) * reach
    this.ty = this.y + Math.sin(ang) * reach - rand(20, 120)
    this.setState("flyaway", 12)
  }

  // bolt off-screen along the current heading (spawn-as-flyaway / old age)
  private flyAway() {
    const ang = Math.atan2(this.vy || rand(-1, 1), this.vx || rand(-1, 1))
    this.tx = this.x + Math.cos(ang) * (innerWidth + innerHeight)
    this.ty = this.y + Math.sin(ang) * (innerWidth + innerHeight)
    this.setState("flyaway", 12)
  }

  step(dt: number, now: number): boolean {
    void now
    this.age += dt
    this.stateT += dt
    this.bobPhase += dt * 6

    const dx = this.tx - this.x
    const dy = this.ty - this.y
    const dist = Math.hypot(dx, dy) || 1

    // ----- transitions
    if (this.state === "flyaway") {
      // keep going until off-screen (handled at the end)
    } else if (this.age > this.lifespan) {
      this.flyAway()
    } else if (this.state === "gather") {
      if (this.stateT > this.stateDur) {
        this.startWalk() // cluster breaks up → wander off on foot
      } else if (dist < 14) {
        // reached the spot → pick a new point near the cluster centre, so the
        // cluster keeps shuffling and never sits frozen (哪怕聚集也会走动)
        this.tx = this.gx + rand(-28, 28)
        this.ty = this.gy + rand(-24, 24)
      }
    } else if (this.state === "wander") {
      if (this.stateT > this.stateDur) {
        this.startWalk() // tire out → stroll, don't freeze
      } else if (dist < 24) {
        this.newWanderTarget() // reached the spot → pick another
      }
    } else if (this.state === "walk") {
      if (this.stateT > this.stateDur || dist < 8) this.startRest() // arrived → perch
    } else if (this.state === "rest" && this.stateT > this.stateDur) {
      // perched only briefly → usually stroll (走路) so the scene never freezes
      if (chance(0.6)) this.startWalk()
      else this.setState("rest", rand(2, 5))
    }
    // gather/scare are still driven externally by the engine and the cursor.

    // ----- steering
    let speed: number
    switch (this.state) {
      case "flyaway":
        speed = 280
        break
      case "gather":
        // fly in fast, then mill slowly around the cluster spot (keeps moving)
        speed = Math.hypot(this.gx - this.x, this.gy - this.y) > 55 ? 95 : 34
        break
      case "wander":
        speed = 78
        break
      case "walk":
        speed = 24 // a slow crawl
        break
      default:
        speed = 0 // rest: perched in place
    }
    speed *= this.speedScale // each butterfly travels (and flees) at its own pace

    const desVx = (dx / dist) * speed
    const desVy = (dy / dist) * speed
    const ease = this.state === "flyaway" ? 0.07 : 0.045
    this.vx += (desVx - this.vx) * ease * 60 * dt
    this.vy += (desVy - this.vy) * ease * 60 * dt

    this.x += this.vx * dt
    this.y += this.vy * dt

    // ----- orientation: a butterfly seen from above can head any direction, so
    // the sprite turns to face where it is flying. While (near) still it keeps
    // the random angle it was born with — some perch tilted, even upside-down.
    const sp = Math.hypot(this.vx, this.vy)
    if (sp > 12) {
      const heading = (Math.atan2(this.vy, this.vx) * 180) / Math.PI + 90
      const diff = ((heading - this.rot + 540) % 360) - 180
      this.rot += diff * Math.min(1, dt * 4)
    }
    const bob = Math.sin(this.bobPhase) * (this.state === "rest" || this.state === "walk" ? 1.1 : 2.4)
    this.el.style.transform =
      `translate(${this.x}px, ${this.y + bob}px) rotate(${this.rot}deg)`

    if (this.state === "flyaway") {
      const m = 140
      if (this.x < -m || this.x > innerWidth + m || this.y < -m || this.y > innerHeight + m)
        return false
    }
    return !this.dead
  }

  kill() {
    this.dead = true
    this.el.remove()
  }
}

// ----------------------------------------------------------------- Engine ----

export class EffectsEngine {
  private capture: HTMLDivElement
  private overlay: HTMLDivElement
  private follower: HTMLDivElement
  private parts: Particle[] = []
  private butterflies: Butterfly[] = []
  private tool: Tool | null = null
  private raf = 0
  private last = 0
  private mx = innerWidth / 2
  private my = innerHeight / 2
  private mouseAt = -1 // performance.now() of the last real pointer move
  private gatherTimer = rand(5, 9) // countdown to the next "聚在一起" cluster
  // wand charging
  private charging = false
  private chargeT = 0
  private chargeBubble: HTMLElement | null = null
  // gun: held down → a continuous stream of bubbles
  private gunFiring = false
  private gunAccum = 0

  constructor() {
    this.overlay = document.createElement("div")
    this.overlay.className = "fx-overlay"
    this.capture = document.createElement("div")
    this.capture.className = "fx-capture"
    this.follower = document.createElement("div")
    this.follower.className = "fx-follower"
    this.capture.appendChild(this.follower)
    document.body.appendChild(this.overlay)
    document.body.appendChild(this.capture)

    this.capture.addEventListener("pointermove", this.onMove)
    this.capture.addEventListener("pointerdown", this.onDown)
    window.addEventListener("pointermove", this.onWinMove)
    window.addEventListener("pointerup", this.onUp)
    window.addEventListener("pointercancel", this.onCancel)

    // warm the rain sprites so the first burst doesn't fetch + decode 26 images
    // mid-animation (the cause of the initial stutter)
    for (const s of RAIN_SPRITES) {
      const img = new Image()
      img.decoding = "async"
      img.src = s.src
      img.decode?.().catch(() => {})
    }
  }

  private onMove = (e: PointerEvent) => {
    this.mx = e.clientX
    this.my = e.clientY
    this.mouseAt = performance.now()
    this.positionFollower()
    if (this.charging && this.chargeBubble) {
      const c = this.wandLoop()
      this.chargeBubble.style.left = `${c.x}px`
      this.chargeBubble.style.top = `${c.y}px`
    }
  }

  // Always-on pointer tracking — the capture layer only sees moves while a tool
  // is in hand, but butterflies should flee the cursor even with no tool held.
  private onWinMove = (e: PointerEvent) => {
    this.mx = e.clientX
    this.my = e.clientY
    this.mouseAt = performance.now()
  }

  // centre of the wand's loop in screen space — the bubble blows from here,
  // not from the pointer (which sits at the handle end). Offset follows the
  // follower's translate(-8, -52) + rotate(8deg) anchoring.
  private wandLoop() {
    return { x: this.mx + 14, y: this.my - 38 }
  }

  private positionFollower() {
    if (!this.tool) return
    // anchor so the tool's "business end" sits near the pointer
    if (this.tool === "gun") {
      this.follower.style.transform = `translate(${this.mx + GUN_TX}px, ${this.my + GUN_TY}px) rotate(${GUN_ROT_DEG}deg)`
    } else if (this.tool === "wand") {
      this.follower.style.transform = `translate(${this.mx - 8}px, ${this.my - 52}px) rotate(8deg)`
    } else {
      this.follower.style.transform = `translate(${this.mx - 26}px, ${this.my - 26}px)`
    }
  }

  private onDown = (e: PointerEvent) => {
    if (!this.tool) return
    e.preventDefault()
    // Own the whole press: with pointer capture, move/up/cancel are delivered to
    // the capture layer even if the pointer slides over the tray or off-window,
    // so a long hold keeps firing until the button is actually released.
    try {
      this.capture.setPointerCapture(e.pointerId)
    } catch {
      /* not all pointer types support capture; harmless */
    }
    if (this.tool === "gun") {
      // press-and-hold → keep blowing bubbles until release
      this.gunFiring = true
      this.gunAccum = 0
      this.emitGunBubble() // immediate first puff
      this.ensureLoop()
    } else if (this.tool === "butterfly") {
      this.spawnButterflies(e.clientX, e.clientY)
    } else if (this.tool === "wand") {
      this.startCharge(e.clientX, e.clientY)
    }
  }

  private onUp = () => {
    if (this.tool === "wand" && this.charging) this.releaseCharge()
    this.gunFiring = false
  }

  // pointer cancelled (focus lost, OS gesture, tab switch) → stop firing so the
  // gun never gets stuck spraying after the button is no longer down.
  private onCancel = () => {
    if (this.charging) this.cancelCharge()
    this.gunFiring = false
  }

  // -------- tools

  setTool(tool: Tool | null) {
    if (this.charging) this.cancelCharge()
    this.gunFiring = false
    this.tool = tool
    if (tool) {
      this.capture.classList.add("fx-capture--active")
      this.follower.style.backgroundImage = `url(${ASSET[tool]})`
      this.follower.dataset.tool = tool
      this.positionFollower()
    } else {
      this.capture.classList.remove("fx-capture--active")
      this.follower.style.backgroundImage = ""
      delete this.follower.dataset.tool
    }
  }

  getTool() {
    return this.tool
  }

  private add(p: Particle) {
    this.parts.push(p)
    this.overlay.appendChild(p.el)
    this.ensureLoop()
  }

  // Map the muzzle's local point through the same transform the follower uses
  // (rotate about the 52×52 box centre, then translate) → screen coords.
  private gunMuzzle(x: number, y: number) {
    const cx = 26
    const cy = 26
    const dx = GUN_MUZZLE_X - cx
    const dy = GUN_MUZZLE_Y - cy
    const a = (GUN_ROT_DEG * Math.PI) / 180
    const cos = Math.cos(a)
    const sin = Math.sin(a)
    const rx = cx + dx * cos - dy * sin
    const ry = cy + dx * sin + dy * cos
    return { x: x + GUN_TX + rx, y: y + GUN_TY + ry }
  }

  // One glass bubble out of the muzzle with thoroughly randomised motion:
  // size, direction (not always up), drift, and whether/when it pops mid-air.
  private emitGunBubble() {
    if (this.parts.length > 140) return // keep the field from runaway-growing
    const m = this.gunMuzzle(this.mx, this.my)
    const r = rand(13, 40) // glassy soap bubbles (⌀ ~26–80, the 80px reference)
    // spray up-and-to-the-left (~45°, the way the muzzle points), with a
    // moderate cone of spread so it reads as a stream, not a laser.
    const ang = (-3 * Math.PI) / 4 + rand(-0.5, 0.5)
    const sp = rand(35, 120)
    this.add(
      new Bubble({
        x: m.x + rand(-5, 5),
        y: m.y + rand(-5, 5),
        r,
        vx: Math.cos(ang) * sp,
        vy: Math.sin(ang) * sp,
        // mostly buoyant (keeps the up-left drift), a few gently sink
        gravity: rand(-28, 14),
        swayAmp: rand(6, 28),
        // about half pop somewhere mid-flight, the rest drift off
        popAfter: chance(0.55) ? rand(0.4, 2.8) : null,
      }),
    )
  }

  burstPepe() {
    const n = 26
    for (let i = 0; i < n; i++) this.add(new Pepe())
  }

  // one butterfly per click
  spawnButterflies(x: number, y: number) {
    if (this.butterflies.length > 24) return
    const b = new Butterfly(x, y)
    this.butterflies.push(b)
    this.parts.push(b)
    this.overlay.appendChild(b.el)
    this.ensureLoop()
  }

  // -------- wand charge

  private startCharge(_x: number, _y: number) {
    this.charging = true
    this.chargeT = 0
    const el = document.createElement("div")
    el.className = "fx-bubble fx-bubble--charge"
    const c = this.wandLoop()
    el.style.left = `${c.x}px`
    el.style.top = `${c.y}px`
    this.chargeBubble = el
    this.overlay.appendChild(el)
    this.ensureLoop()
  }

  private chargeRadius() {
    return Math.min(8 + this.chargeT * 46, 80)
  }

  private updateCharge(dt: number) {
    if (!this.charging || !this.chargeBubble) return
    this.chargeT += dt
    const r = this.chargeRadius()
    const d = r * 2
    this.chargeBubble.style.width = `${d}px`
    this.chargeBubble.style.height = `${d}px`
    this.chargeBubble.style.transform = `translate(-50%, -50%) scale(1)`
    // held too long → big pop, no bubble released
    if (this.chargeT > 2.2) {
      const popR = this.chargeRadius()
      this.chargeBubble.remove()
      this.chargeBubble = null
      this.charging = false
      const c = this.wandLoop()
      this.add(
        new Bubble({
          x: c.x,
          y: c.y,
          r: popR,
          vx: 0,
          vy: 0,
          popAfter: 0,
          bigPop: true,
        }),
      )
    }
  }

  private releaseCharge() {
    if (!this.chargeBubble) return
    const r = this.chargeRadius()
    const c = this.wandLoop()
    const x = c.x
    const y = c.y
    this.chargeBubble.remove()
    this.chargeBubble = null
    this.charging = false
    const ang = rand(0, Math.PI * 2)
    const sp = rand(40, 120)
    this.add(
      new Bubble({
        x,
        y,
        r,
        vx: Math.cos(ang) * sp,
        vy: Math.sin(ang) * sp - 20,
        gravity: rand(-4, 4),
        popAfter: chance(0.4) ? rand(1, 3) : null,
        bigPop: true,
      }),
    )
  }

  private cancelCharge() {
    if (this.chargeBubble) this.chargeBubble.remove()
    this.chargeBubble = null
    this.charging = false
  }

  // -------- butterfly flocking: scatter from the cursor, gather in clusters

  // Any butterfly the moving cursor passes near bolts away. Gated on a *recent*
  // real pointer move, so a swarm spawned under a resting cursor doesn't all
  // leave at once — they only flee something that moves through them.
  private scareButterflies(now: number) {
    if (this.mouseAt < 0 || now - this.mouseAt > 260) return
    for (const b of this.butterflies) {
      if (b.canScare() && b.distanceTo(this.mx, this.my) < b.scareRadius()) {
        b.scare(this.mx, this.my)
      }
    }
  }

  // Every so often, gather idle butterflies into clusters. Each cluster heads to
  // a "stroke" spot — a line/border or text-heavy run on the portfolio — and
  // holds AT MOST 10 (one big colony is fine; a very large swarm still splits).
  private maybeGather(dt: number) {
    this.gatherTimer -= dt
    if (this.gatherTimer > 0) return
    this.gatherTimer = rand(7, 12)
    const idle = this.butterflies.filter((b) => b.canGather())
    if (idle.length < 2) return // need at least two to "gather together"
    // shuffle so clusters mix up each time
    for (let i = idle.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0
      ;[idle[i], idle[j]] = [idle[j], idle[i]]
    }
    const MAX = 10
    for (let i = 0; i < idle.length; i += MAX) {
      const group = idle.slice(i, i + MAX)
      if (group.length < 2) break // a lone leftover doesn't form a cluster
      const spot = this.pickStrokeSpot() || this.groupCentroid(group)
      for (const b of group) b.gatherTo(spot.x, spot.y)
    }
  }

  private groupCentroid(group: Butterfly[]) {
    let cx = 0
    let cy = 0
    for (const b of group) {
      const [x, y] = b.getXY()
      cx += x
      cy += y
    }
    return { x: cx / group.length, y: cy / group.length }
  }

  // Find an on-screen "stroke": a line/border element, or a text-heavy run.
  // Butterflies cluster here, as if perching on the ink of the portfolio.
  private pickStrokeSpot(): { x: number; y: number } | null {
    const vw = innerWidth
    const vh = innerHeight
    const cands: { x: number; y: number; w: number }[] = []
    const consider = (el: Element, base: number) => {
      if ((el as HTMLElement).closest(".effect-tray, .effect-controller")) return
      const r = el.getBoundingClientRect()
      if (r.width < 8 || r.height < 6) return
      if (r.right < 30 || r.left > vw - 30 || r.bottom < 30 || r.top > vh - 30) return
      cands.push({
        x: r.left + Math.random() * r.width,
        y: r.top + r.height * rand(0.3, 0.85),
        w: base,
      })
    }
    // text-heavy runs, weighted by how much text they hold
    document
      .querySelectorAll("h1,h2,h3,h4,h5,h6,p,a,li,span,blockquote,figcaption,label,strong,em")
      .forEach((el) => {
        const t = (el.textContent || "").trim()
        if (t.length < 6 || el.children.length > 3) return // skip big wrappers
        consider(el, Math.min(t.length, 160) + 20)
      })
    // strokes / lines / borders
    document
      .querySelectorAll("hr, svg, path, line, [class*='stroke'], [class*='border'], [class*='divider']")
      .forEach((el) => consider(el, 60))
    if (!cands.length) return null
    const total = cands.reduce((acc, c) => acc + c.w, 0)
    let r = Math.random() * total
    for (const c of cands) {
      r -= c.w
      if (r <= 0) return { x: c.x, y: c.y }
    }
    return { x: cands[0].x, y: cands[0].y }
  }

  // -------- loop

  private ensureLoop() {
    if (this.raf) return
    this.last = performance.now()
    this.raf = requestAnimationFrame(this.tick)
  }

  private tick = (now: number) => {
    let dt = (now - this.last) / 1000
    this.last = now
    if (dt > 0.05) dt = 0.05 // clamp after tab-switches

    this.updateCharge(dt)
    this.updateGun(dt)
    this.scareButterflies(now)
    this.maybeGather(dt)

    for (let i = this.parts.length - 1; i >= 0; i--) {
      const p = this.parts[i]
      if (!p.step(dt, now)) {
        p.kill()
        this.parts.splice(i, 1)
        if (p instanceof Butterfly) {
          const k = this.butterflies.indexOf(p)
          if (k >= 0) this.butterflies.splice(k, 1)
        }
      }
    }

    if (this.parts.length === 0 && !this.charging && !this.gunFiring) {
      this.raf = 0
    } else {
      this.raf = requestAnimationFrame(this.tick)
    }
  }

  // while the gun is held, blow a fresh bubble every ~30ms (jittered) so a long
  // hold reads as a dense, continuous fountain rather than a metronome.
  private gunInterval = 0.03
  private updateGun(dt: number) {
    if (!this.gunFiring) return
    this.gunAccum += dt
    while (this.gunAccum >= this.gunInterval) {
      this.gunAccum -= this.gunInterval
      this.emitGunBubble()
      this.gunInterval = rand(0.022, 0.045)
    }
  }

  destroy() {
    cancelAnimationFrame(this.raf)
    this.raf = 0
    this.capture.removeEventListener("pointermove", this.onMove)
    this.capture.removeEventListener("pointerdown", this.onDown)
    window.removeEventListener("pointermove", this.onWinMove)
    window.removeEventListener("pointerup", this.onUp)
    window.removeEventListener("pointercancel", this.onCancel)
    this.parts.forEach((p) => p.kill())
    this.parts = []
    this.butterflies = []
    this.overlay.remove()
    this.capture.remove()
  }
}
