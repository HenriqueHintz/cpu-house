import type { ReactNode } from 'react';

type P = [number, number];

/** Isometric projection: x → right/down, y → left/down, z → up. */
export const iso = (x: number, y: number, z: number): P => [(x - y) * 0.866, (x + y) * 0.5 - z];

export const pts = (list: P[]) => list.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');

/** Point on the visible front-left face (the y+d side) of a box, u/v in 0..1. */
export const leftFace =
  (x: number, y: number, z: number, w: number, d: number, h: number) =>
  (u: number, v: number): P =>
    iso(x + u * w, y + d, z + v * h);

export function SceneDefs() {
  return (
    <defs>
      <filter id="iso-blur" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="9" />
      </filter>
      <filter id="iso-glow" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="2.5" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  );
}

export function Box({
  x,
  y,
  z,
  w,
  d,
  h,
  children,
}: {
  x: number;
  y: number;
  z: number;
  w: number;
  d: number;
  h: number;
  children?: ReactNode;
}) {
  const top = pts([iso(x, y, z + h), iso(x + w, y, z + h), iso(x + w, y + d, z + h), iso(x, y + d, z + h)]);
  const left = pts([iso(x, y + d, z), iso(x + w, y + d, z), iso(x + w, y + d, z + h), iso(x, y + d, z + h)]);
  const right = pts([iso(x + w, y, z), iso(x + w, y + d, z), iso(x + w, y + d, z + h), iso(x + w, y, z + h)]);
  return (
    <g>
      <polygon points={left} className="iso-left" />
      <polygon points={right} className="iso-right" />
      <polygon points={top} className="iso-top" />
      {children}
    </g>
  );
}

export function Shadow({ cx, cy, rx, ry }: { cx: number; cy: number; rx: number; ry: number }) {
  return (
    <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="var(--iso-shadow)" opacity="0.22" filter="url(#iso-blur)" />
  );
}

export function Platform({ size = 110 }: { size?: number }) {
  const lines: ReactNode[] = [];
  for (let i = -size + 55; i < size; i += 55) {
    lines.push(
      <polyline key={`a${i}`} points={pts([iso(i, -size, 12), iso(i, size, 12)])} className="iso-grid" />,
      <polyline key={`b${i}`} points={pts([iso(-size, i, 12), iso(size, i, 12)])} className="iso-grid" />,
    );
  }
  return (
    <g>
      <Shadow cx={0} cy={30} rx={190} ry={96} />
      <Box x={-size} y={-size} z={0} w={size * 2} d={size * 2} h={12} />
      {lines}
    </g>
  );
}

export function Rack({ x, y, z, animated }: { x: number; y: number; z: number; animated: boolean }) {
  const w = 70;
  const d = 60;
  const h = 150;
  const f = leftFace(x, y, z, w, d, h);
  const slots = [0, 1, 2, 3, 4];
  return (
    <g>
      <Shadow cx={iso(x + w / 2, y + d / 2, z)[0]} cy={iso(x + w / 2, y + d / 2, z)[1] + 6} rx={62} ry={26} />
      <Box x={x} y={y} z={z} w={w} d={d} h={h}>
        {slots.map((i) => {
          const v0 = 0.08 + i * 0.18;
          const v1 = v0 + 0.13;
          const [lx, ly] = f(0.84, (v0 + v1) / 2);
          return (
            <g key={i}>
              <polygon points={pts([f(0.1, v0), f(0.9, v0), f(0.9, v1), f(0.1, v1)])} fill="var(--iso-slot)" />
              <polyline points={pts([f(0.16, (v0 + v1) / 2), f(0.6, (v0 + v1) / 2)])} stroke="var(--iso-left)" strokeWidth="1.2" opacity="0.7" />
              <circle
                cx={lx}
                cy={ly}
                r="2.4"
                fill="#22B8CF"
                filter="url(#iso-glow)"
                className={animated ? 'iso-led' : undefined}
                style={animated ? ({ '--d': `${i * 0.45}s` } as React.CSSProperties) : undefined}
              />
            </g>
          );
        })}
      </Box>
    </g>
  );
}

export function Shield({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  const d = 'M0,-40 L34,-28 V4 C34,26 16,40 0,48 C-16,40 -34,26 -34,4 V-28 Z';
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d={d} transform="translate(9 9)" className="iso-right" />
      <path d={d} transform="translate(4.5 4.5)" className="iso-left" />
      <path d={d} className="iso-top" />
      <path d="M-14,2 L-4,12 L16,-12" fill="none" stroke="#0B4F6C" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

export function Cloud({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  const d = 'M-40,20 a22,22 0 0 1 4,-43 a30,30 0 0 1 56,-8 a24,24 0 0 1 22,51 z';
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d={d} transform="translate(9 9)" className="iso-right" />
      <path d={d} transform="translate(4.5 4.5)" className="iso-left" />
      <path d={d} className="iso-top" />
      <path d="M-4,10 V-12 M-12,-4 L-4,-12 L4,-4" fill="none" stroke="#0B4F6C" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

export function Lock({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M-5,-14 v-16 a15,15 0 0 1 30,0 v16" fill="none" stroke="var(--iso-left)" strokeWidth="7" strokeLinecap="round" transform="translate(5 14)" />
      <Box x={0} y={0} z={0} w={40} d={28} h={34}>
        <circle cx={iso(20, 28, 18)[0]} cy={iso(20, 28, 18)[1]} r="3.2" fill="#22B8CF" />
      </Box>
    </g>
  );
}

export function Envelope({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  const w = 64;
  const d = 44;
  const h = 7;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <Box x={0} y={0} z={0} w={w} d={d} h={h}>
        <polyline
          points={pts([iso(0, 0, h), iso(w / 2, d / 2, h), iso(w, 0, h)])}
          fill="none"
          stroke="#0B4F6C"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <polyline points={pts([iso(0, d, h), iso(w / 2, d / 2, h), iso(w, d, h)])} fill="none" stroke="#0B4F6C" strokeWidth="1.6" opacity="0.6" />
      </Box>
    </g>
  );
}

export function NodeCube({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <Box x={-7} y={-7} z={0} w={14} d={14} h={14} />
    </g>
  );
}

export function Link({
  from,
  to,
  bend = -30,
  animated,
  delay = 0,
}: {
  from: P;
  to: P;
  bend?: number;
  animated: boolean;
  delay?: number;
}) {
  const mx = (from[0] + to[0]) / 2;
  const my = (from[1] + to[1]) / 2 + bend;
  const d = `M${from[0]},${from[1]} Q${mx},${my} ${to[0]},${to[1]}`;
  return (
    <g>
      <path d={d} fill="none" stroke="var(--iso-left)" strokeWidth="1.2" opacity="0.55" />
      <path
        d={d}
        fill="none"
        stroke="#22B8CF"
        strokeWidth="2.4"
        strokeLinecap="round"
        filter="url(#iso-glow)"
        className={animated ? 'iso-packet' : undefined}
        style={animated ? ({ animationDelay: `${delay}s` } as React.CSSProperties) : undefined}
        strokeDasharray={animated ? undefined : '6 54'}
      />
    </g>
  );
}
