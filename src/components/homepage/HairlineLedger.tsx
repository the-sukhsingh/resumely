'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as HL from '@/lib/hairline/kernel';

const N = 4,
  WM = 44,
  HM = 56,
  TKM = 1.4,
  TKC = 1.2;
const SQ2 = Math.SQRT1_2,
  MCX = 0,
  MCY = 0,
  M_REST_TH = -10;

const VARIANTS = [
  { id: 'staff', role: 'Staff Systems', format: 'Technical Arch', tag: 'eBPF · P99 Kernels', cx: -67, cy: 13, th: -12, pt: [-16, 12], edgeU: 11 },
  { id: 'lead', role: 'Platform Lead', format: 'Exec Leadership', tag: 'K8s Mesh · SLAs', cx: -13, cy: 67, th: -8, pt: [-12, 16], edgeU: 11 },
  { id: 'backend', role: 'Distributed Core', format: 'High Throughput', tag: 'Go · Concurrency', cx: 13, cy: -67, th: -12, pt: [12, -16], edgeU: -11 },
  { id: 'infra', role: 'Cloud Infrastructure', format: 'Cloud Systems', tag: 'Terraform · VPCs', cx: 67, cy: -13, th: -8, pt: [16, -12], edgeU: -11 },
];

const mShape = HL.fillet(
  [
    [-WM / 2, 0],
    [WM / 2, 0],
    [WM / 2, HM],
    [10, HM],
    [10, HM + 5],
    [-6, HM + 5],
    [-6, HM],
    [-WM / 2, HM],
  ],
  [1.2, 1.2, 2.5, 1.5, 2, 2, 1.5, 2.5],
);

const cShapes = [
  HL.fillet([[-11, 0], [11, 0], [11, 32], [-2, 32], [-2, 36], [-11, 36]], [1, 1, 2, 1.5, 1.5, 2]),
  HL.fillet([[-11, 0], [11, 0], [11, 34], [4, 34], [4, 38], [-4, 38], [-4, 34], [-11, 34]], [1, 1, 2, 1.5, 1.5, 1.5, 1.5, 2]),
  HL.fillet([[-11, 0], [11, 0], [11, 34], [11, 38], [2, 38], [2, 34], [-11, 34]], [1, 1, 2, 1.5, 1.5, 1.5, 2]),
  HL.fillet([[-11, 0], [11, 0], [11, 32], [11, 36], [3, 36], [3, 32], [-11, 32]], [1, 1, 2, 1.5, 1.5, 1.5, 2]),
];

const w = (
  P: (x: number, y: number, z: number) => HL.Point2D,
  cx: number,
  cy: number,
  u: number,
  v: number,
  th: number,
  lift: number,
) => {
  const s = Math.sin(HL.rad(th)),
    c = Math.cos(HL.rad(th));
  return P(cx + (u + v * s) * SQ2, cy + (-u + v * s) * SQ2, v * c + lift);
};

const wb = (
  P: (x: number, y: number, z: number) => HL.Point2D,
  cx: number,
  cy: number,
  u: number,
  v: number,
  th: number,
  lift: number,
  tk: number,
) => {
  const s = Math.sin(HL.rad(th)),
    c = Math.cos(HL.rad(th));
  return P(cx + (u + (v * s - tk * c)) * SQ2, cy + (-u + (v * s - tk * c)) * SQ2, v * c + tk * s + lift);
};

function masterPose(P: (x: number, y: number, z: number) => HL.Point2D, th: number, lift: number) {
  const mw = (u: number, v: number) => w(P, MCX, MCY, u, v, th, lift);
  const mwb = (u: number, v: number) => wb(P, MCX, MCY, u, v, th, lift, TKM);
  const vSec = [36, 28, 20, 12];
  return {
    back: HL.poly(mShape.map((p) => mwb(p[0], p[1]))),
    face: HL.poly(mShape.map((p) => mw(p[0], p[1]))),
    head: HL.seg(mw(-WM / 2 + 4, HM - 8), mw(WM / 2 - 4, HM - 8)),
    sub: HL.seg(mw(-WM / 2 + 4, HM - 13), mw(WM / 2 - 12, HM - 13)),
    rules: vSec.map(
      (v) =>
        HL.seg(mw(-WM / 2 + 8, v), mw(WM / 2 - 4, v)) +
        HL.seg(mw(-WM / 2 + 8, v - 3), mw(WM / 2 - 12, v - 3)),
    ),
    punches: [
      mw(-WM / 2 + 4, 36),
      mw(-WM / 2 + 4, 28),
      mw(WM / 2 - 4, 20),
      mw(WM / 2 - 4, 12),
    ],
  };
}

function cardPose(
  P: (x: number, y: number, z: number) => HL.Point2D,
  i: number,
  th: number,
  lift: number,
) {
  const cd = VARIANTS[i],
    shape = cShapes[i],
    cw = (u: number, v: number) => w(P, cd.cx, cd.cy, u, v, th, lift);
  const cwb = (u: number, v: number) => wb(P, cd.cx, cd.cy, u, v, th, lift, TKC);
  const head = i === 1 ? HL.seg(cw(-9, 29), cw(9, 29)) : HL.seg(cw(-8, 27), cw(8, 27));
  const sub =
    i === 1
      ? HL.seg(cw(-9, 25), cw(4, 25))
      : i === 0
      ? HL.seg(cw(-8, 23), cw(3, 23))
      : '';
  let r = '';
  if (i === 0)
    r =
      HL.seg(cw(-8, 20), cw(-1, 20)) +
      HL.seg(cw(2, 20), cw(8, 20)) +
      HL.seg(cw(-8, 14), cw(8, 14)) +
      HL.seg(cw(-8, 7), cw(5, 7));
  else if (i === 1)
    r =
      HL.seg(cw(-8, 17), cw(8, 17)) +
      HL.seg(cw(0, 15), cw(0, 19)) +
      HL.seg(cw(-8, 11), cw(8, 11)) +
      HL.seg(cw(-8, 6), cw(6, 6));
  else if (i === 2)
    r =
      HL.seg(cw(-8, 21), cw(8, 21)) +
      HL.seg(cw(-8, 16), cw(8, 16)) +
      HL.seg(cw(-8, 11), cw(6, 11)) +
      HL.seg(cw(-8, 6), cw(8, 6));
  else
    r =
      HL.seg(cw(-8, 21), cw(1, 21)) +
      HL.seg(cw(-8, 15), cw(8, 15)) +
      HL.seg(cw(-8, 10), cw(5, 10)) +
      HL.seg(cw(-8, 5), cw(8, 5));

  const punch =
    i === 0
      ? cw(-7, 34)
      : i === 1
      ? cw(0, 36)
      : i === 2
      ? cw(7, 36)
      : cw(7, 34);

  return {
    back: HL.poly(shape.map((p) => cwb(p[0], p[1]))),
    face: HL.poly(shape.map((p) => cw(p[0], p[1]))),
    head: head + sub,
    rules: r,
    punch,
  };
}

export default function HairlineLedger() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [activeItem, setActiveItem] = useState<number>(-1);
  const setTargetRef = useRef<((idx: number) => void) | null>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    HL.inject(document);
    stage.setAttribute('data-hairline', 'ledger');
    stage.setAttribute('role', 'img');
    stage.setAttribute('aria-label', 'Isometric master resume ledger powering diversified tailored variants');

    const svg = HL.mk('svg', { viewBox: '0 0 400 320', 'aria-hidden': 'true' }, stage);
    const bag = HL.disposer();
    const maxLift = 15;

    const C = HL.Cam(45, 0.5, 1.48);
    const plinthR = 82;
    HL.fit(
      C,
      [
        [-plinthR, -plinthR, -6],
        [plinthR, plinthR, -6],
        [-plinthR, plinthR, 0],
        [plinthR, -plinthR, 0],
        [0, 0, 75],
        [-67, 13, 50],
        [-13, 67, 50],
        [13, -67, 50],
        [67, -13, 50],
      ],
      200,
      166,
    );
    const P = HL.proj(C),
      front = HL.facing(C);

    const [outer, inner] = HL.rings(-plinthR, -plinthR, plinthR, plinthR, 14, 2.2);
    const g = HL.mk('g', {}, svg);
    HL.reflect(svg, g, P, front, outer, -6, 14);

    const plinth = HL.solid(g);
    HL.put(plinth, HL.prism(P, front, outer, inner, -6, 0));

    const conduits = VARIANTS.map((cd) => {
      const endX = cd.cx + cd.edgeU * SQ2,
        endY = cd.cy - cd.edgeU * SQ2;
      return HL.mk('path', { d: HL.seg(P(cd.pt[0], cd.pt[1], 0.2), P(endX, endY, 0.2)), class: 'dash' }, g);
    });

    const cards = VARIANTS.map((cd) => {
      const grp = HL.mk('g', {}, g);
      const back = HL.mk('path', { class: 'lo' }, grp),
        face = HL.mk('path', { class: 'sil' }, grp);
      const head = HL.mk('path', { class: 'lo' }, grp),
        rules = HL.mk('path', { class: 'lo' }, grp);
      const punch = HL.mk('circle', { r: 1.05, class: 'dot m' }, grp);
      return { grp, back, face, head, rules, punch, th: HL.tween(cd.th), z: HL.tween(0) };
    });

    const mGrp = HL.mk('g', {}, g);
    const mBack = HL.mk('path', { class: 'lo' }, mGrp),
      mFace = HL.mk('path', { class: 'sil' }, mGrp);
    const mHead = HL.mk('path', { class: 'hi' }, mGrp),
      mSub = HL.mk('path', { class: 'lo' }, mGrp);
    const mRules = [0, 1, 2, 3].map(() => HL.mk('path', { class: 'lo' }, mGrp));
    const mPunches = [0, 1, 2, 3].map(() => HL.mk('circle', { r: 1.15, class: 'dot off' }, mGrp));
    const master = { th: HL.tween(M_REST_TH), z: HL.tween(0) };

    // Strict back-to-front paint order: far cards (0, 2), master, near cards (1, 3)
    [0, 2].forEach((i) => g.appendChild(cards[i].grp));
    g.appendChild(mGrp);
    [1, 3].forEach((i) => g.appendChild(cards[i].grp));

    const cM = P(MCX, MCY, 28),
      cardCenters = VARIANTS.map((c) => P(c.cx, c.cy, 17));
    function hit([x, y]: HL.Point2D) {
      let best = -1,
        minD = 26;
      for (let i = 0; i < N; i++) {
        const c = cardCenters[i],
          d = Math.hypot(x - c[0], y - c[1]);
        if (d < minD) {
          minD = d;
          best = i;
        }
      }
      if (best >= 0) return best;
      if (Math.hypot(x - cM[0], y - cM[1]) < 32) return 4;
      return -1;
    }

    function drawMaster(th: number, lift: number) {
      const q = masterPose(P, th, lift);
      mBack.setAttribute('d', q.back);
      mFace.setAttribute('d', q.face);
      mHead.setAttribute('d', q.head);
      mSub.setAttribute('d', q.sub);
      q.rules.forEach((d, i) => mRules[i].setAttribute('d', d));
      q.punches.forEach((pt, i) => HL.place(mPunches[i], pt));
    }

    function drawCard(i: number, th: number, lift: number) {
      const cd = cards[i],
        q = cardPose(P, i, th, lift);
      cd.back.setAttribute('d', q.back);
      cd.face.setAttribute('d', q.face);
      cd.head.setAttribute('d', q.head);
      cd.rules.setAttribute('d', q.rules);
      HL.place(cd.punch, q.punch);
    }

    const B = HL.register(stage, (_dt, now) => {
      let moving = false;
      drawMaster(HL.tval(master.th, now), HL.tval(master.z, now));
      if (!HL.tdone(master.th, now) || !HL.tdone(master.z, now)) moving = true;
      cards.forEach((cd, i) => {
        drawCard(i, HL.tval(cd.th, now), HL.tval(cd.z, now));
        if (!HL.tdone(cd.th, now) || !HL.tdone(cd.z, now)) moving = true;
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

      HL.tset(master.th, a === 4 ? 0 : M_REST_TH, now, 0);
      HL.tset(master.z, a === 4 ? maxLift + 2 : 0, now, 0);
      mFace.classList.toggle('hi', a === 4);
      mHead.classList.toggle('hi', a < 0);

      cards.forEach((cd, i) => {
        const delay = a < 0 ? Math.abs(i - 1.5) * 25 : a === 4 ? 35 : Math.hypot(VARIANTS[i].cx - VARIANTS[a].cx, VARIANTS[i].cy - VARIANTS[a].cy) * 0.35;
        const targetTh = a < 0 ? VARIANTS[i].th : a === i ? 0 : VARIANTS[i].th - 4;
        HL.tset(cd.th, targetTh, now, delay);
        HL.tset(cd.z, a === i ? maxLift : 0, now, delay);
        cd.face.classList.toggle('hi', a === i);
        cd.head.classList.toggle('hi', a === i);
        conduits[i].classList.toggle('hi', a === i || a === 4);
        conduits[i].classList.toggle('dash', a !== i && a !== 4);
        mRules[i].classList.toggle('hi', a === i);
        mPunches[i].classList.toggle('m', a === i);
        mPunches[i].classList.toggle('off', a !== i);
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
      {/* Top Hairline Telemetry Ribbon */}
      <div className="w-full max-w-lg flex items-center justify-between font-mono text-[10px] text-muted-foreground pb-2 px-1 select-none">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
          <span className="font-semibold tracking-wider text-foreground">
            {activeItem === -1
              ? 'MANIFOLD : IDLE REST'
              : activeItem === 4
              ? 'MANIFOLD : 4-CHANNEL MASTER RECORD'
              : `MANIFOLD : CHANNEL 0${activeItem + 1} ACTIVE`}
          </span>
        </div>
        <div className="text-right tracking-widest text-[9px] text-indigo-600 dark:text-indigo-400 font-semibold">
          {activeItem === -1
            ? '4 DIVERSIFIED TARGETS'
            : activeItem === 4
            ? 'FEEDING ALL DERIVATIVES'
            : `${VARIANTS[activeItem].role.toUpperCase()} [${VARIANTS[activeItem].format.toUpperCase()}]`}
        </div>
      </div>

      {/* Isometric Hairline Stage Plate (Borderless Floating Illustration) */}
      <div className="relative w-full max-w-lg aspect-[5/4] my-2 select-none">
        <div ref={stageRef} className="w-full h-full cursor-crosshair" />

        {/* Ambient Corner Crosshairs (Architectural Drafting marks) */}
        <div className="absolute top-2.5 left-3 text-[8px] font-mono text-muted-foreground/40 pointer-events-none">
          + MASTER LEDGER
        </div>
        <div className="absolute top-2.5 right-3 text-[8px] font-mono text-muted-foreground/40 pointer-events-none">
          {activeItem < 0
            ? 'STATUS: REST'
            : activeItem === 4
            ? 'TARGET: ROOT'
            : `PULLING: ${VARIANTS[activeItem].tag}`}
        </div>
        <div className="absolute bottom-2.5 left-3 text-[8px] font-mono text-muted-foreground/40 pointer-events-none">
          4-WAY BRANCH
        </div>
        <div className="absolute bottom-2.5 right-3 text-[8px] font-mono text-muted-foreground/40 pointer-events-none">
          ISO · HAIRLINE
        </div>
      </div>

      {/* Interactive Diversified Target Route Buttons */}
      <div className="w-full max-w-lg grid grid-cols-5 gap-1.5 pt-2 font-mono text-[9px]">
        {/* Master Center Button */}
        <button
          type="button"
          onClick={() => setTargetRef.current?.(4)}
          onMouseEnter={() => setTargetRef.current?.(4)}
          onMouseLeave={() => setTargetRef.current?.(-1)}
          className={`py-1.5 px-1 rounded transition-colors text-center truncate ${
            activeItem === 4
              ? 'bg-indigo-600 text-white font-semibold shadow-sm'
              : 'bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground'
          }`}
          title="Master Career Record"
        >
          ★ MASTER
        </button>

        {/* 4 Diversified Variant Buttons */}
        {VARIANTS.map((v, idx) => (
          <button
            key={v.id}
            type="button"
            onClick={() => setTargetRef.current?.(idx)}
            onMouseEnter={() => setTargetRef.current?.(idx)}
            onMouseLeave={() => setTargetRef.current?.(-1)}
            className={`py-1.5 px-1 rounded transition-colors text-center truncate ${
              activeItem === idx
                ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                : 'bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground'
            }`}
            title={`${v.role} (${v.format})`}
          >
            0{idx + 1} {v.role.split(' ')[0]}
          </button>
        ))}
      </div>
    </div>
  );
}
