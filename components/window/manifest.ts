// "Window" — manifest-driven daydream scene engine.
// Components read ONLY from this manifest; they never hardcode a city,
// window, wallpaper, or asset path. Adding a new city / window / wallpaper
// = dropping PNGs into /public/assets and adding one entry here.

// A box in % of the composition canvas (0–100).
export type Box = { left: number; top: number; width: number; height: number }

// The sub-rectangle of an asset's canvas that holds its visible content
// (fractions 0–1). Assets ship with transparent shadow margins; the renderer
// scales the image so this content box lands exactly on the manifest Box.
export type ContentBox = { x0: number; y0: number; x1: number; y1: number }

export type Layer = {
  id: string
  src: string // path under /assets, day variant
  depth: number // 0 = infinitely far (barely moves) … 1 = nearest (moves most)
  nightSrc?: string // optional night variant (crossfaded on light toggle)
  scale?: number // zoom so parallax never reveals the aperture edge (default 1.24)
  position?: string // CSS object-position for the crop (default '50% 60%')
}


export type RoomObject = {
  id: string
  src: string
  box: Box // where the visible content sits, % of the composition
  contentBox?: ContentBox
  role?: 'light-switch' | 'lamp' | 'fall' | 'wobble' | 'spider'
  // light-switch: click toggles day/night (whole scene)
  // lamp:         click toggles a warm glow
  // fall:         click drops it to the bottom of the wall panel (click again to hang it back)
  // wobble:       click makes it swing on its nail
  // spider:       ambient — crawls around the wall on its own
  fallRotate?: number // final rotation for role 'fall' (deg)
  fallShiftX?: number // horizontal drift while falling, % of the canvas width
  // 'canvas': rendered outside the wall panel's rounded clip (e.g. furniture
  // that runs off the composition edge, like the SoHo vanity desk).
  layer?: 'panel' | 'canvas'
}

export type WindowDef = {
  id: string
  name: string
  frameSrc: string
  contentBox: ContentBox
  frameBox: Box // where the visible frame sits in the composition
  aperture: Box // the glass opening the view is clipped to
  // Optional second state (e.g. the sashes swing open) — click the window to toggle.
  openSrc?: string
  openContentBox?: ContentBox
  openBox?: Box // placement of the open state (sashes protrude past frameBox)
  // CSS border-radius applied to the aperture, for non-rectangular glass
  // (e.g. an arched window's semicircular top).
  apertureRadius?: string
  // The two swinging sash panels, as content-fraction rects of the CLOSED
  // frame asset. When present, toggling animates a real 3D hinge swing
  // (left sash pivots on its left edge, right sash on its right edge)
  // instead of a plain crossfade.
  sashes?: { left: ContentBox; right: ContentBox }
}

export type WallpaperDef = {
  id: string
  name: string
  src: string
  objects: RoomObject[]
}

export type Location = {
  label: string
  address?: string
  timezone: string // IANA zone for the local-time nameplate
  layers: Layer[] // back → front
  hasNight: boolean
}

export type City = {
  name: string
  locations: Record<string, Location>
}

export type SceneEffects = {
  daySrc?: string // soft white vignette (always on)
  nightSrc?: string // darkness + glow overlay (night only)
}

// Composition canvas aspect ratio (the reference art is 3660 × 3264).
export const COMPOSITION_ASPECT = 3660 / 3264
// The wall panel: the rounded-rect the wallpaper fills. Its edge hides under
// the near-opaque white band of the day vignette (band spans 5.1–8.0% of the
// canvas, peak ≈ 6.5%); the vignette feathers it into the page background.
export const PANEL_BOX: Box = { left: 6.7, top: 7.4, width: 86.6, height: 85.2 }
// Panel corner radius (circular ≈ 13.8% of canvas width, expressed per-axis).
export const PANEL_RADIUS = "15.9% / 18.2%"

export const manifest: {
  cities: Record<string, City>
  windows: Record<string, WindowDef>
  wallpapers: Record<string, WallpaperDef>
  effects: SceneEffects
} = {
  cities: {
    sf: {
      name: 'San Francisco',
      locations: {
        goldenGate: {
          label: 'Golden Gate Bridge',
          address: 'Battery Spencer, Sausalito, CA',
          timezone: 'America/Los_Angeles',
          hasNight: true,
          layers: [
            {
              id: 'view',
              src: '/assets/views/sf/golden-gate/01_view.webp',
              nightSrc: '/assets/views/sf/golden-gate/night/01_view.webp',
              depth: 0.5,
            },
          ],
        },
        pacificHeights: {
          label: 'Pacific Heights',
          address: 'Pacific Heights, San Francisco, CA',
          timezone: 'America/Los_Angeles',
          hasNight: false,
          layers: [
            {
              id: 'view',
              src: '/assets/views/sf/pacific-heights/01_view.webp',
              depth: 0.5,
            },
          ],
        },
      },
    },
    countryside: {
      name: 'Countryside',
      locations: {
        village: {
          label: 'Village garden',
          address: 'A village far away',
          timezone: 'Asia/Shanghai',
          hasNight: false,
          layers: [
            {
              id: 'view',
              src: '/assets/views/countryside/village/01_view.webp',
              depth: 0.5,
            },
          ],
        },
      },
    },
    nyc: {
      name: 'New York',
      locations: {
        soho: {
          label: 'SoHo',
          address: 'SoHo, Manhattan, NY',
          timezone: 'America/New_York',
          hasNight: false,
          layers: [
            {
              // The street photo has the arch baked into its alpha — keep it
              // nearly static so the arch stays aligned with the frame.
              id: 'view',
              src: '/assets/views/nyc/soho/01_view.webp',
              depth: 0.1,
              scale: 1.05,
              position: '50% 40%',
            },
          ],
        },
      },
    },
  },

  windows: {
    classicWhite: {
      id: 'classicWhite',
      name: 'Classic white',
      frameSrc: '/assets/windows/classic-white/frame.webp',
      contentBox: { x0: 0.068, y0: 0.06, x1: 0.936, y1: 0.932 },
      frameBox: { left: 27.7, top: 25.7, width: 42.4, height: 48.4 },
      aperture: { left: 32.4, top: 29.7, width: 33, height: 40.5 },
    },
    sashWhite: {
      id: 'sashWhite',
      name: 'White sash',
      frameSrc: '/assets/windows/sash-white/frame.webp',
      contentBox: { x0: 0.252, y0: 0.121, x1: 0.749, y1: 0.868 },
      frameBox: { left: 33, top: 23.8, width: 33, height: 55.6 },
      aperture: { left: 36.6, top: 28, width: 25.6, height: 47.3 },
    },
    rusticFourPane: {
      id: 'rusticFourPane',
      name: 'Rustic four-pane',
      frameSrc: '/assets/windows/rustic-four-pane/frame.webp',
      contentBox: { x0: 0.217, y0: 0.145, x1: 0.787, y1: 0.832 },
      frameBox: { left: 28.5, top: 27.4, width: 36.7, height: 49.6 },
      aperture: { left: 33.1, top: 32.8, width: 27.7, height: 38.8 },
    },
    archedWhite: {
      id: 'archedWhite',
      name: 'Arched white',
      // Always shown open — no toggle (Kayna's call, July 2026).
      frameSrc: '/assets/windows/arched-white/open.webp',
      contentBox: { x0: 0.107, y0: 0.077, x1: 0.877, y1: 0.954 },
      frameBox: { left: 28.9, top: 19.2, width: 39.1, height: 64.6 },
      // Glass opening measured from the OPEN asset (arch glass top 0.047,
      // central opening x 0.213–0.785, sill top 0.816 — content fracs).
      aperture: { left: 37.2, top: 22.2, width: 22.4, height: 49.7 },
      // Semicircular arch top: rx = 50% of width, ry matched in px.
      apertureRadius: '50% 50% 0 0 / 25.3% 25.3% 0 0',
    },
  },

  wallpapers: {
    vintageVine: {
      id: 'vintageVine',
      name: 'Vintage vine',
      src: '/assets/wallpapers/vintage-vine/wall.webp',
      objects: [
        {
          id: 'switch',
          src: '/assets/wallpapers/vintage-vine/objects/switch.png',
          box: { left: 79.4, top: 46.4, width: 5.7, height: 6.4 },
          contentBox: { x0: 0.2, y0: 0.239, x1: 0.729, y1: 0.774 },
          role: 'light-switch',
        },
      ],
    },
    striped: {
      id: 'striped',
      name: 'Striped',
      src: '/assets/wallpapers/striped/wall.webp',
      objects: [
        {
          id: 'sconce',
          src: '/assets/wallpapers/striped/objects/sconce.webp',
          box: { left: 75.4, top: 32.9, width: 7.2, height: 6.3 },
          contentBox: { x0: 0.201, y0: 0.251, x1: 0.785, y1: 0.695 },
          role: 'lamp',
        },
      ],
    },
    plaster: {
      id: 'plaster',
      name: 'Plaster',
      src: '/assets/wallpapers/plaster/wall.webp',
      objects: [
        {
          id: 'plant',
          src: '/assets/wallpapers/plaster/objects/plant.webp',
          box: { left: 70.1, top: 9.5, width: 10.4, height: 41.4 },
          contentBox: { x0: 0.359, y0: 0.008, x1: 0.636, y1: 0.989 },
          role: 'wobble',
        },
        {
          id: 'spider-1',
          src: '/assets/wallpapers/plaster/objects/spider.webp',
          box: { left: 80, top: 60, width: 2, height: 2.5 },
          contentBox: { x0: 0.111, y0: 0.063, x1: 0.857, y1: 0.905 },
          role: 'spider',
        },
        {
          id: 'spider-2',
          src: '/assets/wallpapers/plaster/objects/spider.webp',
          box: { left: 16, top: 68, width: 1.6, height: 2 },
          contentBox: { x0: 0.111, y0: 0.063, x1: 0.857, y1: 0.905 },
          role: 'spider',
        },
        {
          id: 'spider-3',
          src: '/assets/wallpapers/plaster/objects/spider.webp',
          box: { left: 55, top: 13, width: 2.4, height: 3 },
          contentBox: { x0: 0.111, y0: 0.063, x1: 0.857, y1: 0.905 },
          role: 'spider',
        },
      ],
    },
    whiteBrick: {
      id: 'whiteBrick',
      name: 'White brick',
      src: '/assets/wallpapers/white-brick/wall.webp',
      objects: [
        {
          id: 'mirror',
          src: '/assets/wallpapers/white-brick/objects/mirror.webp',
          // The mirror asset is pre-cropped on its left edge — sit it at the
          // reference position on the canvas layer so the white feather hides
          // the cut (matching the reference composition).
          box: { left: 5.2, top: 37.3, width: 13.4, height: 17.3 },
          contentBox: { x0: 0, y0: 0.141, x1: 0.733, y1: 0.751 },
          role: 'wobble',
          layer: 'canvas',
        },
        {
          id: 'drawing',
          src: '/assets/wallpapers/white-brick/objects/drawing.webp',
          box: { left: 77.4, top: 32.5, width: 15.6, height: 17.4 },
          contentBox: { x0: 0.216, y0: 0.169, x1: 1, y1: 0.813 },
          role: 'wobble',
        },
        {
          id: 'desk',
          src: '/assets/wallpapers/white-brick/objects/desk.webp',
          // Clipped by the wall panel: its pre-cropped right edge hides past
          // the panel border, and its tabletop (content y 0.671) lands at
          // ~85% canvas so the lipstick has a surface inside the panel.
          box: { left: 74, top: 62.9, width: 25.9, height: 33 },
          contentBox: { x0: 0.135, y0: 0.082, x1: 1, y1: 1 },
        },
        {
          id: 'lipstick',
          src: '/assets/wallpapers/white-brick/objects/lipstick.webp',
          box: { left: 80.4, top: 82, width: 0.7, height: 2.8 },
          contentBox: { x0: 0.416, y0: 0.143, x1: 0.584, y1: 0.753 },
          role: 'fall',
          fallRotate: 96,
          fallShiftX: -2.5,
        },
      ],
    },
  },

  effects: {
    daySrc: '/assets/effects/vignette-day.webp',
    nightSrc: '/assets/effects/vignette-night.webp',
  },
}

export type SceneState = {
  cityId: keyof typeof manifest.cities
  locationId: string
  windowId: keyof typeof manifest.windows
  wallpaperId: keyof typeof manifest.wallpapers
  light: 'day' | 'night'
}

export const defaultScene: SceneState = {
  cityId: 'sf',
  locationId: 'goldenGate',
  windowId: 'classicWhite',
  wallpaperId: 'vintageVine',
  light: 'day',
}

// The curated combinations the playground's "another window" button cycles
// through. Each is just a SceneState — the scene is a pure function of it.
export const scenePresets: SceneState[] = [
  defaultScene,
  { cityId: 'sf', locationId: 'pacificHeights', windowId: 'sashWhite', wallpaperId: 'striped', light: 'day' },
  { cityId: 'countryside', locationId: 'village', windowId: 'rusticFourPane', wallpaperId: 'plaster', light: 'day' },
  { cityId: 'nyc', locationId: 'soho', windowId: 'archedWhite', wallpaperId: 'whiteBrick', light: 'day' },
]
