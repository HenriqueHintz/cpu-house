'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionConfig } from 'motion/react';

export function MotionLenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let onTick: ((time: number) => void) | null = null;

    const teardownLenis = () => {
      if (onTick) {
        gsap.ticker.remove(onTick);
        onTick = null;
      }
      if (lenisRef.current) {
        lenisRef.current.off('scroll', ScrollTrigger.update);
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
    };

    const initLenis = () => {
      if (mediaQuery.matches || lenisRef.current) return;

      const lenis = new Lenis({
        autoRaf: false,
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        anchors: { offset: -88 },
        stopInertiaOnNavigate: true,
      });

      lenisRef.current = lenis;
      lenis.on('scroll', ScrollTrigger.update);

      onTick = (time: number) => {
        lenis.raf(time * 1000);
      };

      gsap.ticker.add(onTick);
      gsap.ticker.lagSmoothing(0);
    };

    if (!mediaQuery.matches) {
      initLenis();
    }

    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        teardownLenis();
      } else {
        initLenis();
      }
    };

    mediaQuery.addEventListener('change', handleReducedMotionChange);

    return () => {
      mediaQuery.removeEventListener('change', handleReducedMotionChange);
      teardownLenis();
    };
  }, []);

  useEffect(() => {
    const rafId = window.requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
    return () => window.cancelAnimationFrame(rafId);
  }, [pathname]);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
