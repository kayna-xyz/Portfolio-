'use client';

import { useEffect, useRef, useState } from 'react';

interface AsciiVideoProps {
  src: string;
  fontSize?: number;
  autoPlay?: boolean;
  loop?: boolean;
  onEnd?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

interface FrameData {
  t: number;
  chars: string;
  brightness: Uint8Array;  // 1 byte per char, 0-255 gray
}

interface Meta {
  width: number;
  height: number;
  totalDuration: number;
  charset: string;
  renderWidth: number;
  renderHeight: number;
}

export function AsciiVideo({
  src,
  fontSize = 16,
  autoPlay = true,
  loop = false,
  onEnd,
  className,
  style,
}: AsciiVideoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [frames, setFrames] = useState<FrameData[]>([]);
  const [loading, setLoading] = useState(true);
  const startTimeRef = useRef<number>(0);
  const rafRef = useRef<number>(0);
  const currentFrameIdxRef = useRef(0);

  useEffect(() => {
    fetch(src)
      .then((r) => r.json())
      .then((data) => {
        setMeta(data.meta);
        const decoded: FrameData[] = data.frames.map((f: { t: number; chars: string; brightness: string }) => ({
          t: f.t,
          chars: f.chars,
          brightness: Uint8Array.from(atob(f.brightness), (c) => c.charCodeAt(0)),
        }));
        setFrames(decoded);
        setLoading(false);
      });
  }, [src]);

  useEffect(() => {
    if (loading || !meta || frames.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = meta.renderWidth;
    canvas.height = meta.renderHeight;

    const charWidth = meta.renderWidth / meta.width;
    const charHeight = meta.renderHeight / meta.height;

    ctx.font = `${fontSize}px 'JetBrains Mono', 'Menlo', 'Courier New', monospace`;
    ctx.textBaseline = 'top';

    const renderFrame = (frame: FrameData) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < frame.chars.length; i++) {
        const char = frame.chars[i];
        if (char === ' ') continue;

        const col = i % meta.width;
        const row = Math.floor(i / meta.width);
        const v = frame.brightness[i];

        ctx.fillStyle = `rgb(${v},${v},${v})`;
        ctx.fillText(char, col * charWidth, row * charHeight);
      }
    };

    const tick = (now: number) => {
      if (!startTimeRef.current) startTimeRef.current = now;
      const elapsed = now - startTimeRef.current;

      let idx = currentFrameIdxRef.current;
      while (idx < frames.length - 1 && frames[idx + 1].t <= elapsed) {
        idx++;
      }
      currentFrameIdxRef.current = idx;

      renderFrame(frames[idx]);

      if (elapsed >= meta.totalDuration) {
        if (loop) {
          startTimeRef.current = now;
          currentFrameIdxRef.current = 0;
        } else {
          onEnd?.();
          return;
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    if (autoPlay) {
      rafRef.current = requestAnimationFrame(tick);
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [loading, meta, frames, autoPlay, loop, onEnd, fontSize]);

  if (loading) {
    return (
      <div className={className} style={style}>
        Loading ASCII video...
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: 'auto',
          // trim ~11px off top and bottom of the 487px frame to fit 465px slot
          marginTop: '-2.26%',
        }}
      />
    </div>
  );
}
