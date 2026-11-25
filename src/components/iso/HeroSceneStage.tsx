'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export function HeroSceneStage() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      setReducedMotion(mq.matches);
      if (mq.matches) {
        setTilt({ rx: 0, ry: 0 });
      }
    };
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rx: Number((-ny * 5).toFixed(2)),
      ry: Number((nx * 6).toFixed(2)),
    });
  };

  const handlePointerLeave = () => {
    setTilt({ rx: 0, ry: 0 });
  };

  return (
    <div
      ref={stageRef}
      aria-hidden="true"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative mx-auto w-full max-w-[380px] sm:max-w-[500px] lg:max-w-[560px]"
      style={{ perspective: '1200px' }}
    >
      {/* Precision CAD Orbital Underlay */}
      <div
        className="pointer-events-none absolute -inset-4 flex items-center justify-center sm:-inset-6"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <svg viewBox="0 0 560 480" className="h-full w-full opacity-80" focusable="false">
          <defs>
            <radialGradient id="hero-cad-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.14" />
              <stop offset="68%" stopColor="#0B4F6C" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#0B4F6C" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="280" cy="240" rx="260" ry="220" fill="url(#hero-cad-glow)" />
          <ellipse
            cx="280"
            cy="240"
            rx="248"
            ry="208"
            fill="none"
            stroke="#CBD5E1"
            strokeWidth="1"
            strokeDasharray="4 8"
          />
          <ellipse
            cx="280"
            cy="240"
            rx="212"
            ry="176"
            fill="none"
            stroke="#94A3B8"
            strokeOpacity="0.35"
            strokeWidth="1"
          />
          <circle cx="280" cy="32" r="4" fill="#0EA5E9" className="iso-led" />
          <circle
            cx="528"
            cy="240"
            r="3.5"
            fill="#0B4F6C"
            className="iso-led"
            style={{ ['--d' as string]: '0.8s' }}
          />
          <circle
            cx="32"
            cy="240"
            r="3.5"
            fill="#0EA5E9"
            className="iso-led"
            style={{ ['--d' as string]: '1.4s' }}
          />
        </svg>
      </div>

      {/* Studio 3D Hardware Stage */}
      <div
        className="relative z-10 overflow-hidden rounded-3xl border border-border/90 bg-[#F4F7FB] p-2.5 shadow-[0_28px_64px_-26px_rgba(11,79,108,0.22)] transition-transform duration-200 ease-out sm:p-3.5"
        style={{
          transformStyle: 'preserve-3d',
          transform: reducedMotion
            ? 'none'
            : `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateZ(0)`,
        }}
      >
        <div className="mb-2.5 flex items-center justify-between rounded-2xl border border-border/75 bg-white/90 px-3.5 py-2 font-mono text-[11px] text-muted-foreground backdrop-blur-xs">
          <span className="inline-flex items-center gap-2 font-semibold text-brand-ink">
            <span className="h-2 w-2 rounded-full bg-accent iso-led" />
            CLUSTER ATIVO
          </span>
          <span className="hidden text-[10px] tracking-wider text-muted-foreground sm:inline">
            GNU/LINUX · ALTA DISPONIBILIDADE
          </span>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-white">
          <Image
            src="/images/hero-infrastructure.webp"
            alt=""
            aria-hidden="true"
            width={937}
            height={768}
            priority
            sizes="(max-width: 640px) 92vw, (max-width: 1024px) 500px, 560px"
            className="h-auto w-full object-cover"
          />
        </div>

        <div className="mt-2.5 flex items-center justify-between px-2 font-mono text-[10px] font-medium tracking-wider text-muted-foreground sm:text-[11px]">
          <span>PROXY · SAMBA4 AD</span>
          <span className="text-brand-ink">BACKUP EM NUVEM LGPD</span>
        </div>
      </div>
    </div>
  );
}
