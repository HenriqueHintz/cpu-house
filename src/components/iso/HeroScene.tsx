'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { Cloud, Envelope, Link, Lock, NodeCube, Platform, Rack, SceneDefs, Shield } from '@/components/iso/iso';

const RACK_TOP: [number, number] = [-22, -112];

const OBJECTS = {
  shield: { x: 118, y: -128 },
  cloud: { x: -140, y: -130 },
  lock: { x: 140, y: 50 },
  envelope: { x: -168, y: 60 },
};

function Floating({
  children,
  index,
  duration,
}: {
  children: React.ReactNode;
  index: number;
  duration: number;
}) {
  return (
    <g className="iso-assemble" style={{ ['--d' as string]: `${0.35 + index * 0.14}s` }}>
      <g className="iso-float" style={{ ['--t' as string]: `${duration}s`, ['--fd' as string]: `${-index * 1.3}s` }}>
        {children}
      </g>
    </g>
  );
}

export function HeroScene() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 80, damping: 18 });
  const sry = useSpring(ry, { stiffness: 80, damping: 18 });

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (reduce) return;

    const onMove = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      ry.set(nx * 12);
      rx.set(-ny * 12);
    };
    if (fine) window.addEventListener('pointermove', onMove, { passive: true });

    gsap.registerPlugin(ScrollTrigger);
    const tween = gsap.to(wrapRef.current, {
      scale: 0.86,
      opacity: 0.35,
      y: -24,
      ease: 'none',
      scrollTrigger: {
        trigger: wrapRef.current,
        start: 'top 15%',
        end: 'bottom top',
        scrub: true,
      },
    });

    return () => {
      window.removeEventListener('pointermove', onMove);
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [rx, ry]);

  return (
    <div ref={wrapRef} aria-hidden="true" className="mx-auto w-full max-w-[230px] sm:max-w-[400px] lg:max-w-[520px]">
      <div style={{ perspective: '1200px' }}>
        <motion.div
          ref={sceneRef}
          style={{ rotateX: srx, rotateY: sry, transformStyle: 'preserve-3d' }}
        >
          <svg viewBox="-260 -250 520 500" className="h-auto w-full overflow-visible" focusable="false">
            <SceneDefs />
            <g className="iso-assemble" style={{ ['--d' as string]: '0s' }}>
              <Platform />
            </g>

            <g className="iso-assemble" style={{ ['--d' as string]: '0.25s' }}>
              <Link from={RACK_TOP} to={[OBJECTS.shield.x, OBJECTS.shield.y]} animated delay={0} bend={-40} />
              <Link from={RACK_TOP} to={[OBJECTS.cloud.x, OBJECTS.cloud.y]} animated delay={0.6} bend={-40} />
              <Link from={RACK_TOP} to={[OBJECTS.lock.x, OBJECTS.lock.y]} animated delay={1.2} bend={30} />
              <Link from={RACK_TOP} to={[OBJECTS.envelope.x, OBJECTS.envelope.y]} animated delay={1.8} bend={30} />
              <NodeCube x={60} y={-150} />
              <NodeCube x={-90} y={-156} />
              <NodeCube x={90} y={-30} />
              <NodeCube x={-100} y={-6} />
            </g>

            <g className="iso-assemble" style={{ ['--d' as string]: '0.45s' }}>
              <Rack x={-35} y={-30} z={12} animated />
            </g>

            <Floating index={1} duration={5}>
              <Shield x={OBJECTS.shield.x} y={OBJECTS.shield.y} />
            </Floating>
            <Floating index={2} duration={6.4}>
              <Cloud x={OBJECTS.cloud.x} y={OBJECTS.cloud.y} />
            </Floating>
            <Floating index={3} duration={4.6}>
              <Lock x={OBJECTS.lock.x - 20} y={OBJECTS.lock.y} />
            </Floating>
            <Floating index={4} duration={5.8}>
              <Envelope x={OBJECTS.envelope.x} y={OBJECTS.envelope.y} />
            </Floating>
          </svg>
        </motion.div>
      </div>
    </div>
  );
}
