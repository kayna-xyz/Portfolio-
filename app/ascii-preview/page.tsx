'use client'

import { useRef, useState, useEffect, useCallback } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────
interface AsciiParams {
  charSet:      'binary' | 'dense' | 'glitch' | 'full' | 'custom'
  customChars:  string
  cols:         number
  fontSize:     number
  fontFamily:   string
  contrast:     number    // −100 → 100
  brightness:   number    // −100 → 100
  gamma:        number    // 0.1 → 3.0
  blackLevel:   number    // 0 → 127
  whiteLevel:   number    // 128 → 255
  colorMode:    'white-on-black' | 'black-on-white' | 'matrix' | 'amber' | 'custom'
  fgColor:      string
  bgColor:      string
  cropTop:      number
  cropBottom:   number
  scanlines:    boolean
  crtEffect:    boolean
  glitchNoise:  boolean
  targetFps:    number | null
  keepAudio:    boolean
  slowmoStart:  number | null
  slowmoEnd:    number | null
  slowmoFactor: number
}

// ─── Constants ────────────────────────────────────────────────────────────────
const CHAR_SETS: Record<string, string> = {
  binary: '01',
  dense:  ' .:-=+*#%@',
  glitch: '01▓▒░#@%&$+=-:;.',
  full:   " .'`^\",;:!i1lI|/tfjrxvunzXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$",
}

const COLOR_MAP: Record<string, { fg: string; bg: string }> = {
  'white-on-black': { fg: '#ffffff', bg: '#000000' },
  'black-on-white': { fg: '#000000', bg: '#f0f0f0' },
  'matrix':         { fg: '#00ff41', bg: '#000000' },
  'amber':          { fg: '#ffb000', bg: '#0a0000' },
}

const DEFAULT: AsciiParams = {
  charSet: 'dense', customChars: '',
  cols: 160, fontSize: 11, fontFamily: 'Courier New',
  contrast: 0, brightness: 0, gamma: 1.35,
  blackLevel: 0, whiteLevel: 255,
  colorMode: 'white-on-black', fgColor: '#ffffff', bgColor: '#000000',
  cropTop: 180, cropBottom: 180,
  scanlines: false, crtEffect: false, glitchNoise: false,
  targetFps: null, keepAudio: true,
  slowmoStart: 4.0, slowmoEnd: 7.0, slowmoFactor: 2,
}

type PresetName = 'Clean ASCII' | 'High Contrast' | 'Matrix Terminal' | 'Glitch Digits' | 'Soft Grayscale'
const PRESETS: Record<PresetName, Partial<AsciiParams>> = {
  'Clean ASCII':      { charSet:'dense',  cols:160, contrast:10,  brightness:0,  gamma:1.2,  colorMode:'white-on-black', scanlines:false, crtEffect:false, glitchNoise:false },
  'High Contrast':    { charSet:'dense',  cols:160, contrast:75,  brightness:0,  gamma:1.6,  blackLevel:20, whiteLevel:230, colorMode:'white-on-black', scanlines:false, crtEffect:false, glitchNoise:false },
  'Matrix Terminal':  { charSet:'binary', cols:160, contrast:45,  brightness:5,  gamma:1.3,  colorMode:'matrix', scanlines:true, crtEffect:true, glitchNoise:false },
  'Glitch Digits':    { charSet:'glitch', cols:180, contrast:55,  brightness:10, gamma:1.4,  colorMode:'custom', fgColor:'#ff3333', bgColor:'#0a0000', scanlines:false, crtEffect:false, glitchNoise:true },
  'Soft Grayscale':   { charSet:'full',   cols:120, contrast:-10, brightness:10, gamma:1.0,  colorMode:'white-on-black', scanlines:false, crtEffect:false, glitchNoise:false },
}

// ─── Utilities ────────────────────────────────────────────────────────────────
function charString(p: AsciiParams) {
  if (p.charSet === 'custom') {
    const s = [...new Set(p.customChars.split(''))].join('')
    return s.length >= 2 ? s : CHAR_SETS.dense
  }
  return CHAR_SETS[p.charSet] ?? CHAR_SETS.dense
}

function colors(p: AsciiParams) {
  return p.colorMode === 'custom' ? { fg: p.fgColor, bg: p.bgColor } : (COLOR_MAP[p.colorMode] ?? COLOR_MAP['white-on-black'])
}

function adjustLuma(v: number, p: AsciiParams): number {
  const range = Math.max(1, p.whiteLevel - p.blackLevel)
  v = (v - p.blackLevel) / range * 255
  v = Math.max(0, Math.min(255, v))
  v += p.brightness * 2.55
  v = Math.max(0, Math.min(255, v))
  v = (v - 128) * (1 + p.contrast / 100) + 128
  v = Math.max(0, Math.min(255, v))
  v = Math.pow(v / 255, 1 / Math.max(0.05, p.gamma)) * 255
  return Math.max(0, Math.min(255, v))
}

// ─── Canvas Renderer ──────────────────────────────────────────────────────────
function renderFrame(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  sample: HTMLCanvasElement,
  p: AsciiParams,
) {
  const W = video.videoWidth, H = video.videoHeight
  if (!W || !H) return

  const ctx  = canvas.getContext('2d', { alpha: false })
  const sCtx = sample.getContext('2d', { willReadFrequently: true })
  if (!ctx || !sCtx) return

  // Measure char size from live canvas
  ctx.font = `${p.fontSize}px "${p.fontFamily}", "Courier New", monospace`
  const charW = ctx.measureText('M').width
  const charH = p.fontSize * 1.35

  const cropTop    = Math.max(0, Math.min(p.cropTop, H - 20))
  const cropBottom = Math.max(0, Math.min(p.cropBottom, H - cropTop - 10))
  const cropH      = H - cropTop - cropBottom

  const charAspect = charH / charW
  const cols       = p.cols
  const rows       = Math.max(1, Math.floor(cropH / ((W / cols) * charAspect)))

  const outW = Math.round(cols * charW)
  const outH = Math.round(rows * charH)

  if (canvas.width !== outW || canvas.height !== outH) {
    canvas.width  = outW
    canvas.height = outH
  }
  if (sample.width !== cols || sample.height !== rows) {
    sample.width  = cols
    sample.height = rows
  }

  sCtx.drawImage(video, 0, cropTop, W, cropH, 0, 0, cols, rows)
  const { data } = sCtx.getImageData(0, 0, cols, rows)

  const { fg, bg } = colors(p)
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, outW, outH)
  ctx.font          = `${p.fontSize}px "${p.fontFamily}", "Courier New", monospace`
  ctx.textBaseline  = 'top'
  ctx.fillStyle     = fg

  const chars = charString(p)
  const n     = chars.length

  // Row-by-row fillText (fast: only `rows` draw calls)
  for (let row = 0; row < rows; row++) {
    let line = ''
    for (let col = 0; col < cols; col++) {
      const i    = (row * cols + col) * 4
      const luma = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
      const adj  = adjustLuma(luma, p)
      line      += chars[Math.min(n - 1, Math.floor(adj / 255 * n))]
    }
    ctx.fillText(line, 0, row * charH)
  }

  // Effects
  if (p.scanlines) {
    ctx.fillStyle = 'rgba(0,0,0,0.4)'
    for (let y = 0; y < outH; y += 4) ctx.fillRect(0, y, outW, 1)
  }
  if (p.crtEffect) {
    const g = ctx.createRadialGradient(outW/2, outH/2, 0, outW/2, outH/2, Math.max(outW, outH) * 0.75)
    g.addColorStop(0,   'rgba(0,0,0,0)')
    g.addColorStop(0.6, 'rgba(0,0,0,0)')
    g.addColorStop(1,   'rgba(0,0,0,0.55)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, outW, outH)
  }
  if (p.glitchNoise) {
    for (let i = 0; i < cols * rows * 0.015; i++) {
      ctx.fillStyle = Math.random() > 0.5 ? fg : bg
      ctx.fillRect(Math.random() * outW, Math.random() * outH, 1, 1)
    }
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function Sec({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-neutral-200">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex justify-between items-center py-2.5 px-1 text-xs uppercase tracking-widest text-neutral-500 hover:text-neutral-800 transition">
        {title}
        <span className="text-neutral-400">{open ? '▲' : '▼'}</span>
      </button>
      {open && <div className="pb-3 px-1 flex flex-col gap-2.5">{children}</div>}
    </div>
  )
}

function Slider({ label, value, min, max, step = 1, onChange }: {
  label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <span className="text-neutral-500 text-xs">{label}</span>
        <span className="text-neutral-800 text-xs font-mono w-12 text-right">{value}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full h-1 rounded appearance-none bg-neutral-300 accent-neutral-800 cursor-pointer" />
    </div>
  )
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer select-none">
      <div onClick={() => onChange(!checked)}
        className={`w-8 h-4 rounded-full transition-colors ${checked ? 'bg-neutral-800' : 'bg-neutral-300'} relative flex-shrink-0 cursor-pointer`}>
        <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${checked ? 'translate-x-4' : 'translate-x-0.5'}`} />
      </div>
      <span className="text-neutral-700 text-xs">{label}</span>
    </label>
  )
}

function ChipGroup<T extends string>({ options, value, onChange }: {
  options: T[]; value: T; onChange: (v: T) => void
}) {
  return (
    <div className="flex flex-wrap gap-1">
      {options.map(o => (
        <button key={o} onClick={() => onChange(o)}
          className={`px-2 py-0.5 text-xs rounded transition ${value === o ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}>
          {o}
        </button>
      ))}
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function AsciiEditorPage() {
  const [p, setP]             = useState<AsciiParams>(DEFAULT)
  const [synced, setSynced]   = useState(false)
  const [rendering, setRend]  = useState(false)
  const [progress, setProg]   = useState(0)
  const [done, setDone]       = useState(false)
  const [renderErr, setRErr]  = useState<string | null>(null)
  const [vidInfo, setVidInfo] = useState<{ w: number; h: number } | null>(null)

  const videoRef  = useRef<HTMLVideoElement>(null)
  const asciiRef  = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sampleRef = useRef<HTMLCanvasElement>(null)
  const rafRef    = useRef<number>(0)
  const pRef      = useRef<AsciiParams>(p)
  useEffect(() => { pRef.current = p }, [p])

  // RAF loop
  useEffect(() => {
    const loop = () => {
      const v = videoRef.current, c = canvasRef.current, s = sampleRef.current
      if (v && c && s && v.readyState >= 2) renderFrame(v, c, s, pRef.current)
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  // Sync original → ascii timeline
  useEffect(() => {
    const v = videoRef.current, a = asciiRef.current
    if (!v || !a || !synced) return
    const h = () => {
      if (Math.abs(a.currentTime - v.currentTime) > 0.3) a.currentTime = v.currentTime
    }
    v.addEventListener('timeupdate', h)
    return () => v.removeEventListener('timeupdate', h)
  }, [synced])

  const set = useCallback(<K extends keyof AsciiParams>(k: K, v: AsciiParams[K]) =>
    setP(prev => ({ ...prev, [k]: v })), [])

  const applyPreset = (name: PresetName) => {
    setP(prev => ({ ...prev, ...PRESETS[name] }))
    setDone(false); setRErr(null)
  }

  const syncPlay  = () => { videoRef.current?.play(); asciiRef.current?.play() }
  const syncPause = () => { videoRef.current?.pause(); asciiRef.current?.pause() }

  // Compute display stats
  const stats = (() => {
    if (!vidInfo) return null
    const W = vidInfo.w, H = vidInfo.h
    const charW = p.fontSize * 0.6
    const charH = p.fontSize * 1.35
    const cropH = H - p.cropTop - p.cropBottom
    const rows  = Math.max(1, Math.floor(cropH / ((W / p.cols) * (charH / charW))))
    return { cols: p.cols, rows, outW: Math.round(p.cols * charW), outH: Math.round(rows * charH) }
  })()

  // Render
  const startRender = async () => {
    setRend(true); setProg(0); setDone(false); setRErr(null)
    try {
      const resp = await fetch('/api/render-ascii-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(p),
      })
      if (!resp.body) throw new Error('No response body')
      const reader  = resp.body.getReader()
      const decoder = new TextDecoder()
      let buf = ''
      while (true) {
        const { done: d, value } = await reader.read()
        if (d) break
        buf += decoder.decode(value, { stream: true })
        const lines = buf.split('\n')
        buf = lines.pop() ?? ''
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          try {
            const ev = JSON.parse(line.slice(6))
            if (ev.type === 'progress') setProg(ev.percent ?? 0)
            if (ev.type === 'done')     { setDone(true); setProg(100) }
            if (ev.type === 'error')    setRErr(ev.message)
          } catch { /* ignore malformed */ }
        }
      }
    } catch (e) {
      setRErr(String(e))
    } finally {
      setRend(false)
    }
  }

  return (
    <main className="min-h-screen bg-white text-neutral-900 font-mono">

      {/* ── Header ── */}
      <div className="border-b border-neutral-200 px-5 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-sm font-bold tracking-wider uppercase text-neutral-900">ASCII Video Editor</h1>
          <p className="text-neutral-500 text-xs mt-0.5">real-time preview · parameterised render · export MP4</p>
        </div>
        <button onClick={() => { setP(DEFAULT); setDone(false); setRErr(null) }}
          className="text-xs text-neutral-500 hover:text-neutral-800 border border-neutral-300 px-3 py-1.5 rounded transition">
          Reset defaults
        </button>
      </div>

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-49px)]">

        {/* ── Left: videos + canvas ── */}
        <div className="flex-1 p-5 flex flex-col gap-4 min-w-0">

          {/* Presets */}
          <div className="flex flex-wrap gap-2">
            {(Object.keys(PRESETS) as PresetName[]).map(name => (
              <button key={name} onClick={() => applyPreset(name)}
                className="text-xs px-3 py-1.5 rounded border border-neutral-300 hover:bg-neutral-100 transition text-neutral-700">
                {name}
              </button>
            ))}
          </div>

          {/* Videos side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] tracking-widest text-neutral-500 uppercase">Original</span>
              <video ref={videoRef} src="/input/original.mp4" controls loop playsInline
                onLoadedMetadata={e => {
                  const v = e.currentTarget
                  setVidInfo({ w: v.videoWidth, h: v.videoHeight })
                }}
                className="w-full rounded border border-neutral-200 bg-black" />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] tracking-widest text-neutral-500 uppercase">Previous render</span>
              <video ref={asciiRef} src="/output/ascii-video.mp4" controls loop playsInline
                className="w-full rounded border border-neutral-200 bg-black" />
            </div>
          </div>

          {/* ASCII canvas preview */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] tracking-widest text-neutral-500 uppercase">
              Live canvas preview · {stats ? `${stats.cols}×${stats.rows} chars → ${stats.outW}×${stats.outH}px` : 'load video to preview'}
            </span>
            <div className="border border-neutral-200 rounded bg-black overflow-hidden">
              <canvas ref={canvasRef} className="w-full h-auto block" style={{ imageRendering: 'pixelated' }} />
            </div>
            <canvas ref={sampleRef} className="hidden" />
          </div>

          {/* Playback controls */}
          <div className="flex flex-wrap gap-2 items-center">
            <button onClick={syncPlay}  className="px-3 py-1.5 text-xs bg-neutral-900 text-white hover:bg-neutral-700 rounded transition">▶ Play both</button>
            <button onClick={syncPause} className="px-3 py-1.5 text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded transition border border-neutral-300">⏸ Pause both</button>
            <label className="flex items-center gap-1.5 text-xs text-neutral-500 cursor-pointer select-none">
              <input type="checkbox" checked={synced} onChange={e => setSynced(e.target.checked)} className="accent-neutral-800" />
              Lock timelines
            </label>
            {vidInfo && (
              <span className="text-neutral-400 text-xs ml-auto">
                src {vidInfo.w}×{vidInfo.h} · crop {p.cropTop}/{p.cropBottom}px · fps {p.targetFps ?? 'auto'}
              </span>
            )}
          </div>
        </div>

        {/* ── Right: control panel ── */}
        <aside className="lg:w-72 xl:w-80 border-l border-neutral-200 overflow-y-auto lg:h-screen lg:sticky lg:top-0 bg-neutral-50">
          <div className="p-4 flex flex-col gap-0">

            {/* Character Set */}
            <Sec title="Character Set">
              <ChipGroup
                options={['binary', 'dense', 'glitch', 'full', 'custom'] as const}
                value={p.charSet}
                onChange={v => set('charSet', v)} />
              {p.charSet === 'custom' && (
                <textarea rows={2} value={p.customChars}
                  onChange={e => set('customChars', e.target.value)}
                  placeholder="Enter characters (sparse → dense)"
                  className="w-full bg-white border border-neutral-300 rounded px-2 py-1 text-xs text-neutral-800 resize-none font-mono" />
              )}
              <div className="text-neutral-500 text-[10px] break-all leading-relaxed">
                {charString(p).slice(0, 60)}{charString(p).length > 60 ? '…' : ''}
              </div>
            </Sec>

            {/* Grid & Font */}
            <Sec title="Grid & Font">
              <Slider label="Columns" value={p.cols} min={60} max={800} onChange={v => set('cols', v)} />
              <Slider label="Font size (px)" value={p.fontSize} min={6} max={20} onChange={v => set('fontSize', v)} />
              <div className="flex flex-col gap-1">
                <span className="text-neutral-500 text-xs">Font family</span>
                <select value={p.fontFamily} onChange={e => set('fontFamily', e.target.value)}
                  className="bg-white border border-neutral-300 rounded px-2 py-1 text-xs text-neutral-800">
                  {['Courier New', 'monospace', 'Menlo', 'Monaco', 'Consolas', 'Lucida Console'].map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
            </Sec>

            {/* Tone */}
            <Sec title="Tone Adjustment">
              <Slider label="Contrast"    value={p.contrast}    min={-100} max={100} onChange={v => set('contrast', v)} />
              <Slider label="Brightness"  value={p.brightness}  min={-100} max={100} onChange={v => set('brightness', v)} />
              <Slider label="Gamma"       value={p.gamma}       min={0.1}  max={3.0} step={0.05} onChange={v => set('gamma', v)} />
              <Slider label="Black level" value={p.blackLevel}  min={0}    max={127} onChange={v => set('blackLevel', v)} />
              <Slider label="White level" value={p.whiteLevel}  min={128}  max={255} onChange={v => set('whiteLevel', v)} />
            </Sec>

            {/* Color */}
            <Sec title="Color Mode">
              <ChipGroup
                options={['white-on-black', 'black-on-white', 'matrix', 'amber', 'custom'] as const}
                value={p.colorMode}
                onChange={v => set('colorMode', v)} />
              {p.colorMode === 'custom' && (
                <div className="flex gap-3 mt-1">
                  <label className="flex flex-col gap-1 flex-1">
                    <span className="text-neutral-500 text-[10px]">Foreground</span>
                    <input type="color" value={p.fgColor} onChange={e => set('fgColor', e.target.value)}
                      className="w-full h-8 rounded cursor-pointer border border-neutral-300" />
                  </label>
                  <label className="flex flex-col gap-1 flex-1">
                    <span className="text-neutral-500 text-[10px]">Background</span>
                    <input type="color" value={p.bgColor} onChange={e => set('bgColor', e.target.value)}
                      className="w-full h-8 rounded cursor-pointer border border-neutral-300" />
                  </label>
                </div>
              )}
              {p.colorMode !== 'custom' && (
                <div className="flex gap-2 mt-1">
                  <div className="w-4 h-4 rounded-sm border border-neutral-300" style={{ background: colors(p).fg }} />
                  <span className="text-neutral-500 text-[10px]">{colors(p).fg}</span>
                  <div className="w-4 h-4 rounded-sm border border-neutral-300" style={{ background: colors(p).bg }} />
                  <span className="text-neutral-500 text-[10px]">{colors(p).bg}</span>
                </div>
              )}
            </Sec>

            {/* Crop */}
            <Sec title="Crop">
              <Slider label="Crop top (px)"    value={p.cropTop}    min={0} max={400} onChange={v => set('cropTop', v)} />
              <Slider label="Crop bottom (px)" value={p.cropBottom} min={0} max={400} onChange={v => set('cropBottom', v)} />
            </Sec>

            {/* Effects */}
            <Sec title="Effects" defaultOpen={false}>
              <Toggle label="Scanlines"   checked={p.scanlines}   onChange={v => set('scanlines', v)} />
              <Toggle label="CRT Vignette" checked={p.crtEffect}  onChange={v => set('crtEffect', v)} />
              <Toggle label="Glitch Noise" checked={p.glitchNoise} onChange={v => set('glitchNoise', v)} />
            </Sec>

            {/* Export settings */}
            <Sec title="Export Settings" defaultOpen={false}>
              <Toggle label="Keep audio" checked={p.keepAudio} onChange={v => set('keepAudio', v)} />
              <div className="flex flex-col gap-1">
                <span className="text-neutral-500 text-xs">Target FPS (blank = auto)</span>
                <input type="number" min={1} max={60} placeholder="auto"
                  value={p.targetFps ?? ''} onChange={e => set('targetFps', e.target.value ? parseInt(e.target.value) : null)}
                  className="bg-white border border-neutral-300 rounded px-2 py-1 text-xs text-neutral-800 w-full" />
              </div>
              <div className="flex flex-col gap-1.5 pt-1">
                <span className="text-neutral-400 text-[10px] uppercase tracking-wider">Slow-motion segment</span>
                <div className="grid grid-cols-3 gap-1.5">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-neutral-400 text-[10px]">Start (s)</span>
                    <input type="number" min={0} max={60} step={0.5} value={p.slowmoStart ?? ''}
                      onChange={e => set('slowmoStart', e.target.value ? parseFloat(e.target.value) : null)}
                      className="bg-white border border-neutral-300 rounded px-1.5 py-1 text-xs text-neutral-800 w-full" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-neutral-400 text-[10px]">End (s)</span>
                    <input type="number" min={0} max={60} step={0.5} value={p.slowmoEnd ?? ''}
                      onChange={e => set('slowmoEnd', e.target.value ? parseFloat(e.target.value) : null)}
                      className="bg-white border border-neutral-300 rounded px-1.5 py-1 text-xs text-neutral-800 w-full" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-neutral-400 text-[10px]">Factor</span>
                    <input type="number" min={1} max={8} step={1} value={p.slowmoFactor}
                      onChange={e => set('slowmoFactor', parseInt(e.target.value) || 1)}
                      className="bg-white border border-neutral-300 rounded px-1.5 py-1 text-xs text-neutral-800 w-full" />
                  </div>
                </div>
              </div>
            </Sec>

            {/* Render */}
            <div className="pt-4 flex flex-col gap-3 px-1 pb-6">
              <button onClick={startRender} disabled={rendering}
                className={`w-full py-2.5 rounded text-sm font-medium transition ${
                  rendering ? 'bg-neutral-200 text-neutral-400 cursor-wait'
                  : 'bg-neutral-900 text-white hover:bg-neutral-700'}`}>
                {rendering ? `Rendering… ${progress.toFixed(0)}%` : 'Render Final Video'}
              </button>

              {rendering && (
                <div className="h-1.5 rounded-full bg-neutral-200 overflow-hidden">
                  <div className="h-full bg-neutral-900 transition-all duration-300 rounded-full" style={{ width: `${progress}%` }} />
                </div>
              )}

              {renderErr && (
                <div className="text-red-400 text-xs bg-red-950 border border-red-800 px-3 py-2 rounded">
                  {renderErr}
                </div>
              )}

              {done && (
                <div className="flex flex-col gap-2">
                  <div className="text-green-400 text-xs">✓ Render complete</div>
                  <a href="/output/ascii-video-custom.mp4" download="ascii-video-custom.mp4"
                    className="w-full text-center py-2 rounded border border-green-700 text-green-400 text-xs hover:bg-green-950 transition">
                    Download ascii-video-custom.mp4 ↓
                  </a>
                  <video src={`/output/ascii-video-custom.mp4?t=${Date.now()}`} controls loop playsInline
                    className="w-full rounded border border-neutral-800 bg-black mt-1" />
                </div>
              )}
            </div>

          </div>
        </aside>
      </div>
    </main>
  )
}
