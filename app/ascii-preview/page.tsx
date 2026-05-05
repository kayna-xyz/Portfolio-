'use client'

import { useRef, useState, useEffect } from 'react'

export default function AsciiPreviewPage() {
  const originalRef = useRef<HTMLVideoElement>(null)
  const asciiRef    = useRef<HTMLVideoElement>(null)
  const [synced, setSynced] = useState(false)
  const [asciiErr, setAsciiErr] = useState(false)

  function syncPlay() {
    originalRef.current?.play()
    asciiRef.current?.play()
  }
  function syncPause() {
    originalRef.current?.pause()
    asciiRef.current?.pause()
  }

  useEffect(() => {
    const orig = originalRef.current
    if (!orig || !synced) return
    const handler = () => {
      if (asciiRef.current && Math.abs(asciiRef.current.currentTime - orig.currentTime) > 0.3) {
        asciiRef.current.currentTime = orig.currentTime
      }
    }
    orig.addEventListener('timeupdate', handler)
    return () => orig.removeEventListener('timeupdate', handler)
  }, [synced])

  return (
    <main className="min-h-screen bg-[#080808] text-neutral-100 px-6 py-10 font-mono">
      <div className="max-w-6xl mx-auto flex flex-col gap-10">

        {/* Header */}
        <div>
          <h1 className="text-xl font-bold tracking-tight">ASCII Video Preview</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Original vs ASCII art · crop ±180 px · 2× slow-mo at 0:04–0:07
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-3 items-center">
          <button
            onClick={syncPlay}
            className="px-4 py-1.5 text-sm bg-neutral-800 hover:bg-neutral-700 rounded transition"
          >
            ▶ Play both
          </button>
          <button
            onClick={syncPause}
            className="px-4 py-1.5 text-sm bg-neutral-800 hover:bg-neutral-700 rounded transition"
          >
            ⏸ Pause both
          </button>
          <label className="flex items-center gap-2 text-sm text-neutral-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={synced}
              onChange={(e) => setSynced(e.target.checked)}
              className="accent-white"
            />
            Lock ASCII timeline to original
          </label>
        </div>

        {/* Videos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="flex flex-col gap-2">
            <span className="text-xs tracking-widest text-neutral-400 uppercase">Original</span>
            <video
              ref={originalRef}
              src="/input/original.mp4"
              controls
              loop
              playsInline
              className="w-full rounded-lg border border-neutral-800 bg-black"
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs tracking-widest text-neutral-400 uppercase">ASCII Art</span>
            <video
              ref={asciiRef}
              src="/output/ascii-video.mp4"
              controls
              loop
              playsInline
              onError={() => setAsciiErr(true)}
              className="w-full rounded-lg border border-neutral-800 bg-black"
            />
            {asciiErr && (
              <p className="text-red-400 text-xs mt-1">
                Video not found. Run:{' '}
                <code className="text-red-300">python3 scripts/generate-ascii-video.py</code>
              </p>
            )}
          </div>

        </div>

        {/* Metadata cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          {[
            { k: 'Crop',        v: '±180 px top & bottom' },
            { k: 'Slow-motion', v: '2× · 0:04 – 0:07' },
            { k: 'ASCII grid',  v: '180 × 59 chars' },
            { k: 'Output res',  v: '1260 × 472 px' },
          ].map(({ k, v }) => (
            <div key={k} className="bg-neutral-900 border border-neutral-800 rounded px-3 py-2">
              <div className="text-neutral-500 text-xs mb-0.5">{k}</div>
              <div>{v}</div>
            </div>
          ))}
        </div>

        {/* Re-generate */}
        <div className="bg-neutral-900 border border-neutral-800 rounded px-4 py-3 text-sm">
          <div className="text-neutral-500 text-xs uppercase tracking-wider mb-1">Re-generate</div>
          <pre className="text-green-400">python3 scripts/generate-ascii-video.py</pre>
          <p className="text-neutral-600 text-xs mt-1">
            outputs to <code className="text-neutral-400">public/output/ascii-video.mp4</code>
          </p>
        </div>

      </div>
    </main>
  )
}
