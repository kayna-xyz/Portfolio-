'use client';

import { useEffect, useRef, useState } from 'react';
import { AsciiVideo } from './AsciiVideo';

interface Props {
  className?: string;
  style?: React.CSSProperties;
}

export function LazyAsciiVideo({ className, style }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        width: '100%',
        aspectRatio: '1552 / 487',
        background: '#000000',
        borderRadius: '0',
        overflow: 'hidden',
        ...style,
      }}
    >
      {shouldLoad && (
        <AsciiVideo src="/ascii/frames.json" loop />
      )}
    </div>
  );
}
