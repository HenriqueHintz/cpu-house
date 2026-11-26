'use client';

import Image from 'next/image';

export function HeroSceneStage() {
  return (
    <div className="relative mx-auto w-full max-w-[640px]">
      {/* Atmospheric subtle glow and telemetry pin layer behind the photograph */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ perspective: '1200px' }}
      >
        <div className="h-full w-full" style={{ transformStyle: 'preserve-3d' }}>
          <svg viewBox="0 0 640 440" className="h-full w-full opacity-60" focusable="false">
            <defs>
              <radialGradient id="hero-aura" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.16" />
                <stop offset="100%" stopColor="#0B4F6C" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="320" cy="220" r="210" fill="url(#hero-aura)" />
            <circle cx="596" cy="40" r="3" fill="#0EA5E9" className="iso-led" />
          </svg>
        </div>
      </div>

      {/* Seamless borderless photograph integrated directly onto the hero canvas */}
      <div className="relative z-10 overflow-hidden rounded-2xl">
        <Image
          src="/images/hero-rack-engenharia.webp"
          alt="Rack corporativo aberto com servidores GNU/Linux, cabeamento azul estruturado e notebook conectado por cabo console em sala envidraçada"
          width={1264}
          height={848}
          priority
          sizes="(max-width: 640px) 94vw, (max-width: 1024px) 620px, 600px"
          className="block aspect-[3/2] w-full object-cover object-center"
        />
      </div>
    </div>
  );
}
