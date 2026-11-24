'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

export function WordReveal({
  text,
  as: Tag = 'h2',
  className = '',
  immediate = false,
}: {
  text: string;
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
  immediate?: boolean;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const words = text.split(' ');

  useGSAP(
    () => {
      if (!headingRef.current) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      gsap.registerPlugin(ScrollTrigger);
      const wordNodes = headingRef.current.querySelectorAll('[data-word]');
      if (!wordNodes.length) return;

      if (immediate) {
        gsap.fromTo(
          wordNodes,
          { yPercent: 28 },
          {
            yPercent: 0,
            duration: 0.65,
            stagger: 0.035,
            ease: 'power3.out',
            clearProps: 'transform',
          }
        );
      } else {
        gsap.fromTo(
          wordNodes,
          { yPercent: 40 },
          {
            yPercent: 0,
            duration: 0.6,
            stagger: 0.03,
            ease: 'power3.out',
            clearProps: 'transform',
            scrollTrigger: {
              trigger: headingRef.current,
              start: 'top 90%',
              once: true,
            },
          }
        );
      }
    },
    { scope: headingRef, dependencies: [text, immediate] }
  );

  return (
    <Tag ref={headingRef} className={className}>
      {words.map((word, idx) => (
        <span key={`${word}-${idx}`} className="inline-block overflow-hidden align-bottom">
          <span data-word className="inline-block will-change-transform">
            {word}
          </span>
          {idx < words.length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </Tag>
  );
}
