'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as HL from '@/lib/hairline/kernel';

const N = 4,
  TIERS = 5,
  TK = 1.2,
  SQ2 = Math.SQRT1_2;

const APPS = [
  { id: 'stripe', company: 'STRIPE', role: 'Staff Systems', stageIdx: 2, stage: '03 / TECHNICAL', sla: 'Loop in 2d', u: -21, th: -10, name: 'tech' },
  { id: 'linear', company: 'LINEAR', role: 'Platform Lead', stageIdx: 4, stage: '05 / OFFER', sla: 'Reviewing terms', u: -7, th: -8, name: 'offer' },
  { id: 'vercel', company: 'VERCEL', role: 'Core Infra', stageIdx: 1, stage: '02 / SCREEN', sla: 'Call scheduled', u: 7, th: -12, name: 'screen' },
  { id: 'anthropic', company: 'ANTHROPIC', role: 'Distributed AI', stageIdx: 3, stage: '04 / ONSITE', sla: 'Debrief pending', u: 21, th: -10, name: 'onsite' },
];

const shapes = [
  HL.fillet(
    [
      [-10, 0],
      [10, 0],
      [10, 26],
      [-2, 26],
      [-2, 30],
      [-10, 30],
    ],
    [1, 1, 1.8, 1.2, 1.5, 1.8],
  ),
  HL.fillet(
    [
      [-10, 0],
      [10, 0],
      [10, 26],
      [4, 26],
      [4, 30],
      [-4, 30],
      [-4, 26],
      [-10, 26],
    ],
    [1, 1, 1.8, 1.2, 1.5, 1.5, 1.2, 1.8],
  ),
  HL.fillet(
    [
      [-10, 0],
      [10, 0],
      [10, 26],
      [2, 26],
      [2, 30],
      [-6, 30],
      [-6, 26],
      [-10, 26],
    ],
    [1, 1, 1.8, 1.2, 1.5, 1.5, 1.2, 1.8],
  ),
  HL.fillet(
    [
      [-10, 0],
      [10, 0],
      [10, 30],
      [2, 30],
      [2, 26],
      [-10, 26],
    ],
    [1, 1, 1.8, 1.2, 1.5, 1.8],
  ),
];

const tierPos = (k: number) => {
  const d = -26 + k * 13;
  return { cx: d, cy: d, z: 16 - k * 4 };
};

const w = (
  P: (x: number, y: number, z: number) => HL.Point2D,
  cx: number,
  cy: number,
  z0: number,
  u: number,
  v: number,
  th: number,
  lift: number,
) => {
  const s = Math.sin(HL.rad(th)),
    c = Math.cos(HL.rad(th));
  return P(cx + (u + v * s) * SQ2, cy + (-u + v * s) * SQ2, z0 + v * c + lift);
};

const wb = (
  P: (x: number, y: number, z: number) => HL.Point2D,
  cx: number,
  cy: number,
  z0: number,
  u: number,
  v: number,
  th: number,
  lift: number,
) => {
  const s = Math.sin(HL.rad(th)),
    c = Math.cos(HL.rad(th));
  return P(cx + (u + (v * s - TK * c)) * SQ2, cy + (-u + (v * s - TK * c)) * SQ2, z0 + v * c + TK * s + lift);
};

export default function HairlinePipeline() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [activeItem, setActiveItem] = useState<number>(-1);
  const setTargetRef = useRef<((idx: number) => void) | null>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    HL.inject(document);
    stage.setAttribute('data-hairline', 'pipeline');
    stage.setAttribute('role', 'img');
    stage.setAttribute('aria-label', 'Isometric job application pipeline stage machine');

    const svg = HL.mk('svg', { viewBox: '0 0 400 320', 'aria-hidden': 'true' }, stage);
    const bag = HL.disposer();
    const maxLift = 14;

    const C = HL.Cam(45, 0.5, 1.75);
    HL.fit(
      C,
      [
        [-60, -50, -6],
        [60, 50, -6],
        [-60, 50, 0],
        [60, -50, 0],
        [-26, -26, 30],
        [26, 26, 16],
        [-32, 32, 16],
        [32, -32, 16],
      ],
      200,
      166,
    );
    const P = HL.proj(C),
      front = HL.facing(C);

    const [outer, inner] = HL.rings(-58, -48, 58, 48, 8, 2);
    const g = HL.mk('g', {}, svg);
    HL.reflect(svg, g, P, front, outer, -6, 14);

    const plinth = HL.solid(g);
    HL.put(plinth, HL.prism(P, front, outer, inner, -6, 0));

    const tierSteps: { line: SVGElement; beacon: SVGElement }[] = [];
    for (let k = 0; k < TIERS; k++) {
      const tp = tierPos(k);
      const line = HL.mk(
        'path',
        { d: HL.seg(P(tp.cx - 28, tp.cy + 28, tp.z), P(tp.cx + 28, tp.cy - 28, tp.z)), class: 'lo' },
        g,
      );
      const beacon = HL.mk('circle', { r: 1.1, class: k === 4 ? 'dot' : 'dot off' }, g);
      HL.place(beacon, P(tp.cx + 26, tp.cy - 26, tp.z + 0.2));
      tierSteps.push({ line, beacon });
    }

    const dockets = APPS.map((app) => {
      const grp = HL.mk('g', {}, g);
      const back = HL.mk('path', { class: 'lo' }, grp),
        face = HL.mk('path', { class: 'sil' }, grp);
      const head = HL.mk('path', { class: 'lo' }, grp),
        rules = HL.mk('path', { class: 'lo' }, grp);
      const dots = [0, 1, 2, 3, 4].map((sIdx) =>
        HL.mk(
          'circle',
          { r: 0.9, class: 'dot ' + (sIdx === app.stageIdx ? 'm' : 'off') },
          grp,
        ),
      );
      return { back, face, head, rules, dots, th: HL.tween(app.th), z: HL.tween(0) };
    });

    const appRestCenters = APPS.map((app) => {
      const tp = tierPos(app.stageIdx);
      return w(P, tp.cx, tp.cy, tp.z, app.u, 13, app.th, 0);
    });
    const summitCenter = P(tierPos(4).cx, tierPos(4).cy, 2);

    function hit([x, y]: HL.Point2D) {
      let best = -1,
        minD = 22;
      for (let i = 0; i < N; i++) {
        const c = appRestCenters[i],
          d = Math.hypot(x - c[0], y - c[1]);
        if (d < minD) {
          minD = d;
          best = i;
        }
      }
      if (best >= 0) return best;
      if (Math.hypot(x - summitCenter[0], y - summitCenter[1]) < 26) return 4;
      return -1;
    }

    function drawDocket(i: number, th: number, lift: number) {
      const app = APPS[i],
        tp = tierPos(app.stageIdx),
        shape = shapes[i];
      const dw = (u: number, v: number) => w(P, tp.cx, tp.cy, tp.z, app.u + u, v, th, lift);
      const dwb = (u: number, v: number) => wb(P, tp.cx, tp.cy, tp.z, app.u + u, v, th, lift);
      const dk = dockets[i];
      dk.back.setAttribute('d', HL.poly(shape.map((p) => dwb(p[0], p[1]))));
      dk.face.setAttribute('d', HL.poly(shape.map((p) => dw(p[0], p[1]))));
      dk.head.setAttribute('d', HL.seg(dw(-7, 21), dw(7, 21)));
      dk.rules.setAttribute('d', HL.seg(dw(-7, 15), dw(7, 15)) + HL.seg(dw(-7, 10), dw(5, 10)));
      for (let sIdx = 0; sIdx < 5; sIdx++) {
        HL.place(dk.dots[sIdx], dw(-6 + sIdx * 3, 5));
      }
    }

    const B = HL.register(stage, (_dt, now) => {
      let moving = false;
      dockets.forEach((dk, i) => {
        drawDocket(i, HL.tval(dk.th, now), HL.tval(dk.z, now));
        if (!HL.tdone(dk.th, now) || !HL.tdone(dk.z, now)) moving = true;
      });
      return moving;
    });
    bag.add(B.unregister);

    let act = -1;
    function setActive(a: number) {
      if (a === act) return;
      const now = performance.now();
      act = a;
      setActiveItem(a);

      dockets.forEach((dk, i) => {
        const delay = a < 0 ? Math.abs(i - 1) * 25 : a === 4 ? i * 35 : Math.abs(i - a) * 35;
        const targetTh = a < 0 ? APPS[i].th : a === i ? 0 : APPS[i].th - 6;
        HL.tset(dk.th, targetTh, now, delay);
        HL.tset(dk.z, a === i ? maxLift : 0, now, delay);
        dk.face.classList.toggle('hi', a === i);
        dk.head.classList.toggle('hi', a === i);
        dk.dots[APPS[i].stageIdx].classList.toggle('m', a !== i);
        dk.dots[APPS[i].stageIdx].classList.toggle('hi', a === i || a === 4);
      });

      tierSteps.forEach((st, k) => {
        const isLit = a >= 0 && (a === 4 || APPS[a]?.stageIdx === k);
        st.line.classList.toggle('hi', isLit);
        st.beacon.classList.toggle('hi', isLit || (a < 0 && k === 4));
      });

      B.wake();
    }

    setTargetRef.current = setActive;

    bag.add(HL.pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
    bag.add(() => svg.replaceChildren());

    return () => {
      bag.dispose();
      setTargetRef.current = null;
    };
  }, []);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Top Hairline Telemetry Ribbon (Borderless) */}
      <div className="w-full max-w-lg flex items-center justify-between font-mono text-[10px] text-muted-foreground pb-2 px-1 select-none">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          <span className="font-semibold tracking-wider text-foreground">
            {activeItem === -1
              ? 'LIFECYCLE PIPELINE : 4 APPLICATIONS'
              : activeItem === 4
              ? 'LIFECYCLE PIPELINE : OFFER SUMMIT'
              : `${APPS[activeItem].company} : ${APPS[activeItem].stage}`}
          </span>
        </div>
        <div className="text-right tracking-widest text-[9px] text-amber-600 dark:text-amber-400 font-semibold">
          {activeItem === -1
            ? '5-STAGE PROGRESSION'
            : activeItem === 4
            ? 'CONVERSION VERIFIED'
            : `SLA: ${APPS[activeItem].sla.toUpperCase()}`}
        </div>
      </div>

      {/* Isometric Hairline Stage Plate (Borderless Floating Illustration) */}
      <div className="relative w-full max-w-lg aspect-[5/4] my-2 select-none">
        <div ref={stageRef} className="w-full h-full cursor-crosshair" />

        {/* Ambient Corner Crosshairs (Architectural Drafting marks) */}
        <div className="absolute top-2.5 left-3 text-[8px] font-mono text-muted-foreground/40 pointer-events-none">
          + STAGE TERRACE
        </div>
        <div className="absolute top-2.5 right-3 text-[8px] font-mono text-muted-foreground/40 pointer-events-none">
          {activeItem < 0
            ? 'ACTIVE: 4 PIPELINES'
            : activeItem === 4
            ? 'OFFER REACHED'
            : `${APPS[activeItem].company} · ${APPS[activeItem].stage}`}
        </div>
        <div className="absolute bottom-2.5 left-3 text-[8px] font-mono text-muted-foreground/40 pointer-events-none">
          SLA MONITORED
        </div>
        <div className="absolute bottom-2.5 right-3 text-[8px] font-mono text-muted-foreground/40 pointer-events-none">
          ISO · HAIRLINE
        </div>
      </div>

      {/* Interactive Application Dockets (Borderless) */}
      <div className="w-full max-w-lg grid grid-cols-4 gap-1.5 pt-2 font-mono text-[9px]">
        {APPS.map((app, idx) => (
          <button
            key={app.id}
            type="button"
            onClick={() => setTargetRef.current?.(idx)}
            onMouseEnter={() => setTargetRef.current?.(idx)}
            onMouseLeave={() => setTargetRef.current?.(-1)}
            className={`py-1.5 px-1.5 rounded transition-colors text-left flex flex-col justify-between ${
              activeItem === idx
                ? 'bg-amber-600 text-white font-semibold shadow-sm'
                : 'bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            <span className="font-bold truncate">{app.company}</span>
            <span
              className={`text-[8px] mt-0.5 truncate ${
                activeItem === idx ? 'text-amber-100' : 'text-amber-600 dark:text-amber-400 font-semibold'
              }`}
            >
              {app.stage.split(' / ')[1]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
