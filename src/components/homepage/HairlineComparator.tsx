'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as HL from '@/lib/hairline/kernel';

const N = 4,
  YS = [-27, -9, 9, 27],
  REST_X = [22, 18, 14, 10];
const C_LEN = 16,
  C_WID = 10,
  C_H = 12;

const CRITERIA = [
  { id: 'dist', name: 'Distributed Caching', weight: '35%', score: '100% Match', matchVal: 1.0 },
  { id: 'k8s', name: 'Kubernetes Mesh', weight: '25%', score: '99% Match', matchVal: 0.99 },
  { id: 'p99', name: 'P99 SLA Optimization', weight: '25%', score: '98% Match', matchVal: 0.98 },
  { id: 'iac', name: 'Terraform Infra', weight: '15%', score: '96% Match', matchVal: 0.96 },
];

export default function HairlineComparator() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [activeItem, setActiveItem] = useState<number>(-1);
  const setTargetRef = useRef<((idx: number) => void) | null>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    HL.inject(document);
    stage.setAttribute('data-hairline', 'comparator');
    stage.setAttribute('role', 'img');
    stage.setAttribute('aria-label', 'Isometric ATS rubric comparator gauge bench');

    const svg = HL.mk('svg', { viewBox: '0 0 400 320', 'aria-hidden': 'true' }, stage);
    const bag = HL.disposer();
    const targetX = 22;

    const C = HL.Cam(45, 0.5, 1.85);
    HL.fit(
      C,
      [
        [-62, -52, -6],
        [62, 52, -6],
        [-62, 52, 0],
        [62, -52, 0],
        [22, -36, 32],
        [22, 36, 32],
        [-38, -27, 14],
        [38, 27, 14],
      ],
      200,
      166,
    );
    const P = HL.proj(C),
      front = HL.facing(C);

    const [outer, inner] = HL.rings(-60, -50, 60, 50, 9, 2.2);
    const g = HL.mk('g', {}, svg);
    HL.reflect(svg, g, P, front, outer, -6, 14);

    const plinth = HL.solid(g);
    HL.put(plinth, HL.prism(P, front, outer, inner, -6, 0));

    const rails = YS.map((y) => HL.mk('path', { d: HL.seg(P(-36, y, 0.2), P(34, y, 0.2)), class: 'dash' }, g));
    const threshLine = HL.mk('path', { d: HL.seg(P(22, -34, 0.2), P(22, 34, 0.2)), class: 'lo' }, g);

    const carriages = YS.map((y, i) => {
      const grp = HL.mk('g', {}, g);
      const body = HL.solid(grp);
      const notch = HL.mk('path', { class: 'lo' }, grp);
      const dot = HL.mk('circle', { r: 1.1, class: 'dot m' }, grp);
      const ticks = HL.mk('path', { class: 'lo' }, grp);
      return { grp, body, notch, dot, ticks, x: HL.tween(REST_X[i]), y };
    });

    const bGrp = HL.mk('g', {}, g);
    const bPill0 = HL.solid(bGrp),
      bPill1 = HL.solid(bGrp);
    HL.put(
      bPill0,
      HL.prism(
        P,
        front,
        HL.rings(20, -36, 24, -30, 1.5, 0.6)[0],
        HL.rings(20, -36, 24, -30, 1.5, 0.6)[1],
        0,
        24,
      ),
    );
    HL.put(
      bPill1,
      HL.prism(
        P,
        front,
        HL.rings(20, 30, 24, 36, 1.5, 0.6)[0],
        HL.rings(20, 30, 24, 36, 1.5, 0.6)[1],
        0,
        24,
      ),
    );
    const bBeam = HL.mk('path', { d: HL.seg(P(22, -33, 23), P(22, 33, 23)), class: 'hi' }, bGrp);
    HL.mk('path', { d: HL.seg(P(22, -33, 21), P(22, 33, 21)), class: 'lo' }, bGrp);

    const cRestPoints = YS.map((y, i) => P(REST_X[i], y, C_H / 2));
    const bridgeCenter = P(22, 0, 22);

    function hit([x, y]: HL.Point2D) {
      let best = -1,
        minD = 22;
      for (let i = 0; i < N; i++) {
        const c = cRestPoints[i],
          d = Math.hypot(x - c[0], y - c[1]);
        if (d < minD) {
          minD = d;
          best = i;
        }
      }
      if (best >= 0) return best;
      if (Math.hypot(x - bridgeCenter[0], y - bridgeCenter[1]) < 28) return 4;
      return -1;
    }

    function drawCarriage(i: number, curX: number) {
      const cd = carriages[i],
        y = cd.y;
      const [cRing, cInner] = HL.rings(curX - C_LEN / 2, y - C_WID / 2, curX + C_LEN / 2, y + C_WID / 2, 2, 0.8);
      HL.put(cd.body, HL.prism(P, front, cRing, cInner, 0, C_H));
      cd.notch.setAttribute(
        'd',
        HL.seg(P(curX, y - C_WID / 2 + 1, C_H + 0.1), P(curX, y + C_WID / 2 - 1, C_H + 0.1)),
      );
      HL.place(cd.dot, P(curX, y, C_H + 0.2));
      cd.ticks.setAttribute(
        'd',
        HL.seg(P(curX - 4, y + C_WID / 2, 4), P(curX - 4, y + C_WID / 2, 8)) +
          HL.seg(P(curX + 4, y + C_WID / 2, 4), P(curX + 4, y + C_WID / 2, 8)),
      );
    }

    const B = HL.register(stage, (_dt, now) => {
      let moving = false;
      carriages.forEach((cd, i) => {
        drawCarriage(i, HL.tval(cd.x, now));
        if (!HL.tdone(cd.x, now)) moving = true;
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

      carriages.forEach((cd, i) => {
        const delay = a < 0 ? Math.abs(i - 1) * 30 : a === 4 ? i * 40 : Math.abs(i - a) * 35;
        const tx = a < 0 ? REST_X[i] : a === 4 || a === i ? targetX : REST_X[i] - 3;
        HL.tset(cd.x, tx, now, delay);
        cd.body.sil.classList.toggle('hi', a === i);
        cd.dot.classList.toggle('hi', a === i || a === 4);
        rails[i].classList.toggle('hi', a === i || a === 4);
        rails[i].classList.toggle('dash', a !== i && a !== 4);
      });

      threshLine.classList.toggle('hi', a >= 0);
      bBeam.classList.toggle('hi', a < 0 || a === 4);
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
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold tracking-wider text-foreground">
            {activeItem === -1
              ? 'COMPARATOR : ATS BENCHMARK BENCH'
              : activeItem === 4
              ? 'COMPARATOR : FULL CALIBRATION SWEEP'
              : `CRITERION 0${activeItem + 1} : ${CRITERIA[activeItem].name.toUpperCase()}`}
          </span>
        </div>
        <div className="text-right tracking-widest text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold">
          {activeItem === -1
            ? 'MODEL: GREENHOUSE / LEVER'
            : activeItem === 4
            ? '98.4% OVERALL MATCH'
            : `${CRITERIA[activeItem].score} [${CRITERIA[activeItem].weight}]`}
        </div>
      </div>

      {/* Isometric Hairline Stage Plate (Borderless Floating Illustration) */}
      <div className="relative w-full max-w-lg aspect-[5/4] my-2 select-none">
        <div ref={stageRef} className="w-full h-full cursor-crosshair" />

        {/* Ambient Corner Crosshairs (Architectural Drafting marks) */}
        <div className="absolute top-2.5 left-3 text-[8px] font-mono text-muted-foreground/40 pointer-events-none">
          + VERNIER BENCH
        </div>
        <div className="absolute top-2.5 right-3 text-[8px] font-mono text-muted-foreground/40 pointer-events-none">
          {activeItem < 0
            ? 'BENCHMARK: 92% SLA'
            : activeItem === 4
            ? 'ALL CRITERIA VERIFIED'
            : `${CRITERIA[activeItem].score}`}
        </div>
        <div className="absolute bottom-2.5 left-3 text-[8px] font-mono text-muted-foreground/40 pointer-events-none">
          OPTICAL SCAN
        </div>
        <div className="absolute bottom-2.5 right-3 text-[8px] font-mono text-muted-foreground/40 pointer-events-none">
          ISO · HAIRLINE
        </div>
      </div>

      {/* Interactive Rubric Criteria Buttons (Borderless) */}
      <div className="w-full max-w-lg grid grid-cols-4 gap-1.5 pt-2 font-mono text-[9px]">
        {CRITERIA.map((crit, idx) => (
          <button
            key={crit.id}
            type="button"
            onClick={() => setTargetRef.current?.(idx)}
            onMouseEnter={() => setTargetRef.current?.(idx)}
            onMouseLeave={() => setTargetRef.current?.(-1)}
            className={`py-1.5 px-1.5 rounded transition-colors text-left flex flex-col justify-between ${
              activeItem === idx
                ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                : 'bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            <span className="truncate">{crit.name}</span>
            <span
              className={`text-[8px] mt-0.5 ${
                activeItem === idx ? 'text-emerald-100' : 'text-emerald-600 dark:text-emerald-400 font-semibold'
              }`}
            >
              {crit.score}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
