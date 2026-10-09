// Hairline Engine Kernel for Resumely
// Isometric line drawing engine built on @lucasmarkes/hairline

export interface Camera {
  az: number;
  k: number;
  S: number;
  ox: number;
  oy: number;
}

export type Point2D = [number, number];
export type Point3D = [number, number, number];

export interface RingSample {
  u: number;
  v: number;
  nu: number;
  nv: number;
}

export const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const rad = (d: number) => (d * Math.PI) / 180;
export const r2 = (n: number) => Math.round(n * 100) / 100;
export const poly = (pts: Point2D[]) => 'M' + pts.map((p) => r2(p[0]) + ' ' + r2(p[1])).join('L') + 'Z';
export const seg = (a: Point2D, b: Point2D) => `M${r2(a[0])} ${r2(a[1])}L${r2(b[0])} ${r2(b[1])}`;
export const open = (pts: Point2D[]) => (pts.length < 2 ? '' : 'M' + pts.map((p) => r2(p[0]) + ' ' + r2(p[1])).join('L'));

export const Cam = (azDeg: number, k: number, S: number): Camera => ({
  az: rad(azDeg),
  k,
  S,
  ox: 0,
  oy: 0,
});

export function proj(C: Camera) {
  const c = Math.cos(C.az),
    s = Math.sin(C.az),
    zf = Math.sqrt(1 - C.k * C.k);
  return (x: number, y: number, z: number): Point2D => {
    const X = x * c - y * s,
      Y = x * s + y * c;
    return [C.ox + C.S * X, C.oy + C.S * (Y * C.k - z * zf)];
  };
}

export function unproj(C: Camera, sx: number, sy: number, z: number): Point2D {
  const c = Math.cos(C.az),
    s = Math.sin(C.az),
    zf = Math.sqrt(1 - C.k * C.k);
  const X = (sx - C.ox) / C.S,
    Y = ((sy - C.oy) / C.S + z * zf) / C.k;
  return [X * c + Y * s, -X * s + Y * c];
}

export function fit(C: Camera, pts: Point3D[], cx: number, cy: number) {
  C.ox = 0;
  C.oy = 0;
  const P = proj(C);
  let a = 1e9,
    b = -1e9,
    c = 1e9,
    d = -1e9;
  for (const p of pts) {
    const q = P(p[0], p[1], p[2]);
    a = Math.min(a, q[0]);
    b = Math.max(b, q[0]);
    c = Math.min(c, q[1]);
    d = Math.max(d, q[1]);
  }
  C.ox = cx - (a + b) / 2;
  C.oy = cy - (c + d) / 2;
}

export function rrect(u0: number, v0: number, u1: number, v1: number, r: number, n = 4): RingSample[] {
  r = Math.max(0, Math.min(r, (u1 - u0) / 2, (v1 - v0) / 2));
  const out: RingSample[] = [];
  for (const [cu, cv, a0] of [
    [u1 - r, v1 - r, 0],
    [u0 + r, v1 - r, 90],
    [u0 + r, v0 + r, 180],
    [u1 - r, v0 + r, 270],
  ]) {
    for (let k = 0; k <= n; k++) {
      const a = rad(a0 + (90 * k) / n),
        ca = Math.cos(a),
        sa = Math.sin(a);
      out.push({ u: cu + r * ca, v: cv + r * sa, nu: ca, nv: sa });
    }
  }
  return out;
}

export function hull(input: Point2D[]): Point2D[] {
  const pts = input.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const x = (o: Point2D, a: Point2D, b: Point2D) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo: Point2D[] = [],
    up: Point2D[] = [];
  for (const p of pts) {
    while (lo.length > 1 && x(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop();
    lo.push(p);
  }
  for (let i = pts.length - 1; i >= 0; i--) {
    const p = pts[i];
    while (up.length > 1 && x(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop();
    up.push(p);
  }
  lo.pop();
  up.pop();
  return lo.concat(up);
}

export const ringAt = (P: (x: number, y: number, z: number) => Point2D, ring: RingSample[], z: number): Point2D[] =>
  ring.map((q) => P(q.u, q.v, z));

export const facing = (C: Camera) => {
  const s = Math.sin(C.az),
    c = Math.cos(C.az);
  return (q: RingSample) => q.nu * s + q.nv * c >= -1e-6;
};

export function run(ring: RingSample[], keep: (q: RingSample) => boolean): RingSample[] {
  const n = ring.length;
  let s = -1;
  for (let i = 0; i < n; i++) {
    if (keep(ring[i]) && !keep(ring[(i + n - 1) % n])) {
      s = i;
      break;
    }
  }
  if (s < 0) return keep(ring[0]) ? ring.slice() : [];
  const out: RingSample[] = [];
  for (let k = 0; k < n && keep(ring[(s + k) % n]); k++) out.push(ring[(s + k) % n]);
  return out;
}

export function prism(
  P: (x: number, y: number, z: number) => Point2D,
  front: (q: RingSample) => boolean,
  ring: RingSample[],
  inner?: RingSample[],
  z0 = 0,
  z1 = 0,
) {
  return {
    sil: poly(hull(ringAt(P, ring, z1).concat(ringAt(P, ring, z0)))),
    crease: inner ? open(ringAt(P, run(inner, front), z1)) : '',
  };
}

export const rings = (x0: number, y0: number, x1: number, y1: number, r: number, b: number): [RingSample[], RingSample[]] => [
  rrect(x0, y0, x1, y1, r),
  rrect(x0 + b, y0 + b, x1 - b, y1 - b, Math.max(0.3, r - b)),
];

export function fillet(pts: Point2D[], rs: number[], n = 4): Point2D[] {
  const m = pts.length,
    out: Point2D[] = [];
  for (let i = 0; i < m; i++) {
    const a = pts[(i + m - 1) % m],
      p = pts[i],
      b = pts[(i + 1) % m];
    const la = Math.hypot(a[0] - p[0], a[1] - p[1]),
      lb = Math.hypot(b[0] - p[0], b[1] - p[1]);
    const t = Math.min(rs[i], la / 2, lb / 2);
    const p1: Point2D = [p[0] + ((a[0] - p[0]) / la) * t, p[1] + ((a[1] - p[1]) / la) * t];
    const p2: Point2D = [p[0] + ((b[0] - p[0]) / lb) * t, p[1] + ((b[1] - p[1]) / lb) * t];
    for (let k = 0; k <= n; k++) {
      const s = k / n,
        w = 1 - s;
      out.push([w * w * p1[0] + 2 * w * s * p[0] + s * s * p2[0], w * w * p1[1] + 2 * w * s * p[1] + s * s * p2[1]]);
    }
  }
  return out;
}

export function bezier(x1: number, y1: number, x2: number, y2: number) {
  const cx = 3 * x1,
    bx = 3 * (x2 - x1) - cx,
    ax = 1 - cx - bx;
  const cy = 3 * y1,
    by = 3 * (y2 - y1) - cy,
    ay = 1 - cy - by;
  const X = (u: number) => ((ax * u + bx) * u + cx) * u;
  const Y = (u: number) => ((ay * u + by) * u + cy) * u;
  const dX = (u: number) => (3 * ax * u + 2 * bx) * u + cx;
  return (t: number) => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    let u = t;
    for (let i = 0; i < 8; i++) {
      const e = X(u) - t;
      if (Math.abs(e) < 1e-5) break;
      const d = dX(u);
      if (Math.abs(d) < 1e-6) break;
      u -= e / d;
    }
    return Y(u);
  };
}

export const EASE_LIFT = bezier(0.32, 0.72, 0, 1);

export interface Tween {
  from: number;
  to: number;
  t0: number;
  dur: number;
}

export const tween = (v: number, dur = 700): Tween => ({ from: v, to: v, t0: -1e9, dur });
export const tval = (tw: Tween, now: number) => {
  const p = clamp((now - tw.t0) / tw.dur, 0, 1);
  return tw.from + (tw.to - tw.from) * EASE_LIFT(p);
};
export const tset = (tw: Tween, to: number, now: number, delay: number) => {
  if (tw.to === to) return;
  tw.from = tval(tw, now);
  tw.to = to;
  tw.t0 = now + delay;
};
export const tdone = (tw: Tween, now: number) => now >= tw.t0 + tw.dur;

const NS = 'http://www.w3.org/2000/svg';
export function mk<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs?: Record<string, string | number>,
  parent?: SVGElement | Element,
): SVGElementTagNameMap[K] {
  const e = document.createElementNS(NS, tag);
  if (attrs) for (const k in attrs) e.setAttribute(k, String(attrs[k]));
  if (parent) parent.appendChild(e);
  return e as SVGElementTagNameMap[K];
}

export function solid(parent: SVGElement) {
  const g = mk('g', {}, parent);
  return { g, sil: mk('path', { class: 'sil' }, g), cr: mk('path', { class: 'nf lo' }, g) };
}

export const put = (el: { sil: SVGElement; cr: SVGElement }, s: { sil: string; crease: string }) => {
  el.sil.setAttribute('d', s.sil);
  el.cr.setAttribute('d', s.crease);
};

export const place = (el: SVGElement, q: Point2D) => {
  el.setAttribute('cx', String(r2(q[0])));
  el.setAttribute('cy', String(r2(q[1])));
};

let fid = 0;
export function fade(svg: SVGElement, y0: number, y1: number, a0 = 0.7) {
  const id = 'hl-fd' + ++fid,
    defs = mk('defs', {}, svg);
  const lg = mk(
    'linearGradient',
    { id: id + 'g', gradientUnits: 'userSpaceOnUse', x1: 0, y1: r2(y0), x2: 0, y2: r2(y1) },
    defs,
  );
  mk('stop', { offset: '0', 'stop-color': '#fff', 'stop-opacity': String(a0) }, lg);
  mk('stop', { offset: '1', 'stop-color': '#fff', 'stop-opacity': '0' }, lg);
  const m = mk('mask', { id, maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: 400, height: 320 }, defs);
  mk('rect', { x: 0, y: 0, width: 400, height: 320, fill: `url(#${id}g)` }, m);
  return `url(#${id})`;
}

export function ghost(
  P: (x: number, y: number, z: number) => Point2D,
  front: (q: RingSample) => boolean,
  ring: RingSample[],
  z0: number,
  depth: number,
) {
  const f = run(ring, front),
    lowP = ringAt(P, f, z0 - depth);
  return {
    d: open(lowP) + [f[0], f[f.length - 1]].map((q) => seg(P(q.u, q.v, z0), P(q.u, q.v, z0 - depth))).join(''),
    y0: Math.min(...ringAt(P, f, z0).map((p) => p[1])),
    y1: Math.max(...lowP.map((p) => p[1])) + 2,
  };
}

export function reflect(
  svg: SVGElement,
  parent: SVGElement,
  P: (x: number, y: number, z: number) => Point2D,
  front: (q: RingSample) => boolean,
  ring: RingSample[],
  z0: number,
  depth: number,
) {
  const r = ghost(P, front, ring, z0, depth);
  const gh = mk('g', { class: 'ghost', mask: fade(svg, r.y0, r.y1) }, parent);
  mk('path', { d: r.d }, gh);
}

interface Board {
  stage: Element;
  tick: (dt: number, now: number) => boolean;
  vis: boolean;
  awake: boolean;
}

let boards: Board[] = [];
const byStage = new Map<Element, Board>();
let raf = 0;
let last = 0;
let io: IntersectionObserver | null = null;

function frame(now: number) {
  const dt = Math.min(0.05, Math.max(0, (now - last) / 1e3));
  last = now;
  let any = false;
  for (const b of boards.slice()) {
    if (b.vis && b.awake) {
      b.awake = !!b.tick(dt, now);
      any = any || b.awake;
    }
  }
  raf = any ? requestAnimationFrame(frame) : 0;
}

function wake(b: Board) {
  b.awake = true;
  if (!raf) {
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }
}

function start() {
  if (io || typeof window === 'undefined') return;
  io = new IntersectionObserver(
    (es) => {
      for (const e of es) {
        const b = byStage.get(e.target);
        if (!b) continue;
        b.vis = e.isIntersecting;
        if (b.vis) wake(b);
      }
    },
    { rootMargin: '80px' },
  );
}

function stop() {
  if (raf) cancelAnimationFrame(raf);
  raf = 0;
  io?.disconnect();
  io = null;
}

export function register(stage: Element, tick: (dt: number, now: number) => boolean) {
  start();
  const b: Board = { stage, tick, vis: true, awake: true };
  boards.push(b);
  byStage.set(stage, b);
  io?.observe(stage);
  tick(0, performance.now());
  let gone = false;
  return {
    wake: () => {
      if (!gone) wake(b);
    },
    unregister: () => {
      if (gone) return;
      gone = true;
      boards = boards.filter((x) => x !== b);
      if (byStage.get(stage) === b) {
        byStage.delete(stage);
        io?.unobserve(stage);
      }
      if (!boards.length) stop();
    },
  };
}

export function pointer(
  stage: Element,
  on: { move: (pt: Point2D) => void; leave: () => void; down?: (pt: Point2D) => void },
) {
  let tm = 0;
  const pt = (e: MouseEvent | PointerEvent): Point2D => {
    const r = stage.getBoundingClientRect();
    return [((e.clientX - r.left) / r.width) * 400, ((e.clientY - r.top) / r.height) * 320];
  };
  const move = (e: Event) => {
    window.clearTimeout(tm);
    on.move(pt(e as PointerEvent));
  };
  const leave = () => {
    window.clearTimeout(tm);
    tm = window.setTimeout(() => on.leave(), 200);
  };
  stage.addEventListener('pointermove', move);
  stage.addEventListener('pointerleave', leave);
  return () => {
    window.clearTimeout(tm);
    stage.removeEventListener('pointermove', move);
    stage.removeEventListener('pointerleave', leave);
  };
}

export function disposer() {
  let fns: (() => void)[] = [];
  return {
    add: (fn: () => void) => {
      fns.push(fn);
    },
    dispose: () => {
      const run2 = fns;
      fns = [];
      for (let i = run2.length - 1; i >= 0; i--) run2[i]();
    },
  };
}

const LIGHT = { plate: '#ffffff', hi: '#232327', edge: '#a4a4ac', mid: '#c3c3c9', lo: '#e0e0e4' };
const DARK = { plate: '#090a0f', hi: '#f1f5f9', edge: '#64748b', mid: '#334155', lo: '#1e293b' };
const KEYS = ['plate', 'hi', 'edge', 'mid', 'lo'] as const;
const vars = (p: typeof LIGHT) => KEYS.map((k) => `--hl-${k}:var(--hairline-${k},${p[k]});`).join('');
const EASE = 'cubic-bezier(0.5,0,0.1,1)';
const SVG = ':where([data-hairline]>svg)';

export function css() {
  return [
    `:where([data-hairline]){display:block;position:relative;aspect-ratio:5/4;touch-action:pan-y;user-select:none;-webkit-user-select:none;--hl-sw:var(--hairline-stroke,1);${vars(LIGHT)}}`,
    `:where(.dark,[data-theme="dark"]) :where([data-hairline]){${vars(DARK)}}`,
    `:where([data-hairline]:focus-visible){outline:1.5px solid var(--hl-hi);outline-offset:2px}`,
    `${SVG}{position:absolute;inset:0;width:100%;height:100%;display:block}`,
    `${SVG} :where(path,polygon,ellipse,line){fill:var(--hl-plate);stroke:var(--hl-mid);stroke-width:var(--hl-sw);vector-effect:non-scaling-stroke;stroke-linejoin:round;stroke-linecap:round;transition:stroke 260ms ${EASE}}`,
    `${SVG} :where(.nf){fill:none}`,
    `${SVG} :where(.fo){stroke:none}`,
    `${SVG} :where(.sil){stroke:var(--hl-edge)}`,
    `${SVG} :where(.hi){stroke:var(--hl-hi)}`,
    `${SVG} :where(.lo){stroke:var(--hl-lo)}`,
    `${SVG} :where(.dash){stroke-dasharray:1 3}`,
    `${SVG} :where(.dot){stroke:none;fill:var(--hl-hi);transition:fill 260ms ${EASE}}`,
    `${SVG} :where(.dot.m){fill:var(--hl-edge)}`,
    `${SVG} :where(.dot.off){fill:var(--hl-lo)}`,
    `${SVG} :where(.ghost path){fill:none;stroke:var(--hl-mid)}`,
  ].join('');
}

let done = false;
export function inject(doc: Document = document) {
  if (done || typeof document === 'undefined') return;
  done = true;
  const style = doc.createElement('style');
  style.setAttribute('data-hairline-style', '');
  style.textContent = css();
  doc.head.appendChild(style);
}
