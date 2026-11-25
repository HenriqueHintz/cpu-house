'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HeroScene } from '@/components/iso/HeroScene';

const HeroCanvas3D = dynamic(() => import('@/components/iso/HeroCanvas3D'), {
  ssr: false,
});

function supportsHardwareWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = (canvas.getContext('webgl2') || canvas.getContext('webgl')) as WebGLRenderingContext | null;
    if (!gl) return false;
    const baseRenderer = String(gl.getParameter(gl.RENDERER) || '');
    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    const unmasked = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || '') : '';
    const combined = `${baseRenderer} ${unmasked}`;
    if (/SwiftShader|Subzero|llvmpipe|Software|Basic Render Driver/i.test(combined)) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function HeroSceneStage() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [canRender3D, setCanRender3D] = useState(false);
  const [ready3D, setReady3D] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const reducedMq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const desktopMq = window.matchMedia('(min-width: 768px)');

    const evaluate = () => {
      if (reducedMq.matches || !desktopMq.matches) {
        setCanRender3D(false);
        setReady3D(false);
        return;
      }
      setCanRender3D(supportsHardwareWebGL());
    };

    evaluate();
    reducedMq.addEventListener('change', evaluate);
    desktopMq.addEventListener('change', evaluate);

    let trigger: ScrollTrigger | null = null;
    if (!reducedMq.matches && stageRef.current) {
      gsap.registerPlugin(ScrollTrigger);
      trigger = ScrollTrigger.create({
        trigger: stageRef.current,
        start: 'top 20%',
        end: 'bottom top',
        onUpdate: (self) => setScrollProgress(self.progress),
      });
    }

    return () => {
      reducedMq.removeEventListener('change', evaluate);
      desktopMq.removeEventListener('change', evaluate);
      trigger?.kill();
    };
  }, []);

  if (!canRender3D) {
    return <HeroScene />;
  }

  return (
    <div
      ref={stageRef}
      aria-hidden="true"
      className="relative mx-auto h-[340px] w-full max-w-[340px] sm:h-[460px] sm:max-w-[460px] lg:h-[520px] lg:max-w-[540px]"
      style={{ perspective: '1200px' }}
    >
      {/* Precision CAD Orbital Underlay */}
      <div
        className="pointer-events-none absolute inset-3 flex items-center justify-center"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <svg viewBox="0 0 480 480" className="h-full w-full opacity-75" focusable="false">
          <defs>
            <radialGradient id="cad-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#22B8CF" stopOpacity="0.16" />
              <stop offset="70%" stopColor="#0B4F6C" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#0B4F6C" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="240" cy="240" r="215" fill="url(#cad-glow)" />
          <circle
            cx="240"
            cy="240"
            r="196"
            fill="none"
            stroke="#CBD5E1"
            strokeWidth="1"
            strokeDasharray="4 8"
          />
          <circle
            cx="240"
            cy="240"
            r="148"
            fill="none"
            stroke="#94A3B8"
            strokeOpacity="0.35"
            strokeWidth="1"
          />
          <circle cx="240" cy="44" r="4" fill="#22B8CF" className="iso-led" />
          <circle
            cx="436"
            cy="240"
            r="3.5"
            fill="#0B4F6C"
            className="iso-led"
            style={{ ['--d' as string]: '0.8s' }}
          />
        </svg>
      </div>

      {/* Fallback SVG stays visible until first WebGL frame renders */}
      {!ready3D && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <HeroScene />
        </div>
      )}

      {/* Interactive React Three Fiber Stage with guaranteed explicit height */}
      <div className={`absolute inset-0 z-10 ${ready3D ? 'opacity-100' : 'opacity-0'}`}>
        <HeroCanvas3D scrollProgress={scrollProgress} onReady={() => setReady3D(true)} />
      </div>

      {/* Ambient Telemetry Strip */}
      <div className="pointer-events-none absolute inset-x-6 bottom-1 z-20 hidden items-center justify-between rounded-full border border-border/90 bg-surface/90 px-4 py-1.5 font-mono text-[11px] text-muted-foreground shadow-xs backdrop-blur-sm sm:flex">
        <span className="inline-flex items-center gap-2 font-medium text-brand-ink">
          <span className="h-2 w-2 rounded-full bg-accent iso-led" />
          CLUSTER ATIVO
        </span>
        <span>PROXY · SAMBA4 AD · BACKUP LGPD</span>
      </div>
    </div>
  );
}
