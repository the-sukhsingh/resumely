'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as HL from '@/lib/hairline/kernel';

const STAGES = [
  { id: 'applied', label: '01 / APPLIED', x: -40, name: 'Applied' },
  { id: 'screen', label: '02 / SCREEN', x: -20, name: 'Screen' },
  { id: 'technical', label: '03 / TECHNICAL', x: 0, name: 'Technical' },
  { id: 'onsite', label: '04 / ONSITE', x: 20, name: 'Onsite' },
  { id: 'offer', label: '05 / OFFER', x: 40, name: 'Offer' },
];

const APPS = [
  { id: 'vercel', company: 'VERCEL', role: 'Staff Systems', stageIdx: 1, stage: '02 / SCREEN', x: -20, y: -16, sla: '72h SLA' },
  { id: 'stripe', company: 'STRIPE', role: 'Platform Lead', stageIdx: 2, stage: '03 / TECHNICAL', x: 0, y: -5, sla: '48h SLA' },
  { id: 'anthropic', company: 'ANTHROPIC', role: 'Distributed AI', stageIdx: 3, stage: '04 / ONSITE', x: 20, y: 6, sla: '36h SLA' },
  { id: 'linear', company: 'LINEAR', role: 'Core Infra', stageIdx: 4, stage: '05 / OFFER', x: 40, y: 17, sla: 'Offer Secured' },
];

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
    stage.setAttribute('aria-label', 'Isometric multi-lane application lifecycle dispatch track');

    const svg = HL.mk('svg', { viewBox: '0 0 400 320', 'aria-hidden': 'true' }, stage);
    const bag = HL.disposer();

    const C = HL.Cam(45, 0.5, 2.22);
    HL.fit(
      C,
      [
        [-54, -26, -5],
        [54, 26, -5],
        [-54, 26, 0],
        [54, -26, 0],
        [-40, -24, 26],
        [40, 24, 30],
        [-20, -16, 22],
        [40, 17, 24],
      ],
      200,
      160,
    );
    const P = HL.proj(C),
      front = HL.facing(C);

    const [outer, inner] = HL.rings(-52, -24, 52, 24, 6, 2.0);
    const g = HL.mk('g', {}, svg);
    HL.reflect(svg, g, P, front, outer, -5, 12);

    const plinth = HL.solid(g);
    HL.put(plinth, HL.prism(P, front, outer, inner, -5, 0));

    // Intake buffer and terminal bumper stops
    HL.mk(
      'path',
      {
        d: HL.seg(P(-48, -22, 0.5), P(-48, 22, 0.5)) + HL.seg(P(48, -22, 0.5), P(48, 22, 0.5)),
        class: 'lo',
      },
      g,
    );

    // 5 Milestone Gantry Portals
    const arches = STAGES.map((st, idx) => {
      const isOffer = idx === 4,
        archH = isOffer ? 25 : 22,
        grp = HL.mk('g', {}, g);
      HL.mk('path', { d: HL.seg(P(st.x, -22, 0.2), P(st.x, 22, 0.2)), class: 'lo' }, grp);
      const pL = HL.seg(P(st.x, -22, 0), P(st.x, -22, archH));
      const pR = HL.seg(P(st.x, 22, 0), P(st.x, 22, archH));
      const lintel = HL.seg(P(st.x, -22, archH), P(st.x, 22, archH));
      const truss = HL.seg(P(st.x, -22, archH - 3), P(st.x, 22, archH - 3));
      const frame = HL.mk('path', { d: pL + pR + lintel + truss, class: isOffer ? 'hi' : 'lo' }, grp);
      const dot = HL.mk('circle', { r: isOffer ? 2.2 : 1.4, class: isOffer ? 'dot m hi' : 'dot' }, grp);
      HL.place(dot, P(st.x, 0, archH + (isOffer ? 3.5 : 2)));
      return { grp, frame, dot, x: st.x, isOffer };
    });

    // 4 Parallel Carrier Lanes
    const lanes = APPS.map((app) => {
      const lGrp = HL.mk('g', {}, g);
      HL.mk('path', { d: HL.seg(P(-46, app.y, 0.3), P(46, app.y, 0.3)), class: 'dash' }, lGrp);
      const traveled = HL.mk('path', { d: HL.seg(P(-46, app.y, 0.4), P(app.x, app.y, 0.4)), class: 'lo' }, lGrp);
      return { lGrp, traveled, y: app.y };
    });

    // 4 Tailored Resume Dossier Shuttles
    const shuttles = APPS.map((app) => {
      const sGrp = HL.mk('g', {}, g),
        sled = HL.solid(sGrp);
      const card = HL.mk('path', { class: 'sil' }, sGrp),
        head = HL.mk('path', { class: 'lo' }, sGrp);
      const rules = HL.mk('path', { class: 'lo' }, sGrp),
        bead = HL.mk('circle', { r: 1.2, class: 'dot' }, sGrp);
      return {
        sGrp,
        sled,
        card,
        head,
        rules,
        bead,
        app,
        x: HL.tween(app.x),
        z: HL.tween(0),
        tilt: HL.tween(0),
      };
    });

    const restPoints = APPS.map((app) => P(app.x, app.y, 8));
    const archCenters = STAGES.map((st) => P(st.x, 0, 12));

    function hit([px, py]: HL.Point2D) {
      let best = -1,
        minD = 28;
      for (let i = 0; i < APPS.length; i++) {
        const d = Math.hypot(px - restPoints[i][0], py - restPoints[i][1]);
        if (d < minD) {
          minD = d;
          best = i;
        }
      }
      if (best >= 0) return best;
      for (let j = 0; j < STAGES.length; j++) {
        if (Math.hypot(px - archCenters[j][0], py - archCenters[j][1]) < 24) return 10 + j;
      }
      return -1;
    }

    function drawShuttle(i: number, xPos: number, zLift: number, tiltDeg: number) {
      const s = shuttles[i],
        y = s.app.y;
      const [so, si] = HL.rings(xPos - 5, y - 3, xPos + 5, y + 3, 1.2, 0.5);
      HL.put(s.sled, HL.prism(P, front, so, si, zLift, zLift + 2));
      const cardH = 16,
        rad = (tiltDeg * Math.PI) / 180,
        dx = Math.sin(rad) * cardH,
        cz = Math.cos(rad) * cardH;
      const p0 = P(xPos - 0.2, y - 4.5, zLift + 2),
        p1 = P(xPos - 0.2, y + 4.5, zLift + 2);
      const p2 = P(xPos + dx, y + 4.5, zLift + 2 + cz),
        p3 = P(xPos + dx, y + 2.5, zLift + 2 + cz);
      const p4 = P(xPos + dx, y + 2.5, zLift + cz),
        p5 = P(xPos + dx, y - 4.5, zLift + cz);
      s.card.setAttribute('d', HL.poly([p0, p1, p2, p3, p4, p5]));
      const hp0 = P(xPos + dx * 0.85, y - 3.5, zLift + 2 + cz * 0.85),
        hp1 = P(xPos + dx * 0.85, y + 3.5, zLift + 2 + cz * 0.85);
      s.head.setAttribute('d', HL.seg(hp0, hp1));
      const bp0 = P(xPos + dx * 0.65, y - 3.5, zLift + 2 + cz * 0.65),
        bp1 = P(xPos + dx * 0.65, y + 2.0, zLift + 2 + cz * 0.65);
      const bp2 = P(xPos + dx * 0.45, y - 3.5, zLift + 2 + cz * 0.45),
        bp3 = P(xPos + dx * 0.45, y + 0.5, zLift + 2 + cz * 0.45);
      s.rules.setAttribute('d', HL.seg(bp0, bp1) + HL.seg(bp2, bp3));
      HL.place(s.bead, P(xPos + dx * 0.25, y, zLift + 2 + cz * 0.25));
      lanes[i].traveled.setAttribute('d', HL.seg(P(-46, y, 0.4), P(xPos, y, 0.4)));
    }

    const B = HL.register(stage, (_dt, now) => {
      let moving = false;
      shuttles.forEach((s, i) => {
        drawShuttle(i, HL.tval(s.x, now), HL.tval(s.z, now), HL.tval(s.tilt, now));
        if (!HL.tdone(s.x, now) || !HL.tdone(s.z, now) || !HL.tdone(s.tilt, now)) moving = true;
      });
      return moving;
    });
    bag.add(B.unregister);

    let act = -1;
    function setActive(a: number) {
      if (a === act) return;
      act = a;
      setActiveItem(a);
      const now = performance.now();

      if (a < 0) {
        shuttles.forEach((s) => {
          HL.tset(s.x, s.app.x, now, 40);
          HL.tset(s.z, 0, now, 40);
          HL.tset(s.tilt, 0, now, 40);
          s.card.classList.remove('hi');
          s.bead.classList.remove('hi');
        });
        arches.forEach((arch) => {
          arch.frame.classList.toggle('hi', arch.isOffer);
          arch.frame.classList.toggle('lo', !arch.isOffer);
          arch.dot.classList.toggle('hi', arch.isOffer);
        });
        lanes.forEach((l) => l.traveled.classList.replace('hi', 'lo'));
      } else if (a < 10) {
        const app = APPS[a];
        shuttles.forEach((s, idx) => {
          const isTarget = idx === a;
          HL.tset(s.z, isTarget ? 5 : 0, now, 0);
          HL.tset(s.tilt, isTarget ? -5 : 0, now, 0);
          HL.tset(s.x, s.app.x + (isTarget ? 3 : 0), now, 0);
          s.card.classList.toggle('hi', isTarget);
          s.bead.classList.toggle('hi', isTarget);
        });
        arches.forEach((arch, idx) => {
          const isMatch = idx === app.stageIdx;
          arch.frame.classList.toggle('hi', isMatch || arch.isOffer);
          arch.frame.classList.toggle('lo', !isMatch && !arch.isOffer);
          arch.dot.classList.toggle('hi', isMatch || arch.isOffer);
        });
        lanes.forEach((l, idx) => {
          l.traveled.classList.toggle('hi', idx === a);
          l.traveled.classList.toggle('lo', idx !== a);
        });
      } else {
        const sIdx = a - 10;
        arches.forEach((arch, idx) => {
          const isTarget = idx === sIdx;
          arch.frame.classList.toggle('hi', isTarget || arch.isOffer);
          arch.frame.classList.toggle('lo', !isTarget && !arch.isOffer);
          arch.dot.classList.toggle('hi', isTarget || arch.isOffer);
        });
      }
      B.wake();
    }

    bag.add(HL.pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
    bag.add(() => svg.replaceChildren());

    setTargetRef.current = setActive;
    setActive(-1);

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
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          <span className="font-semibold tracking-wider text-foreground">
            {activeItem === -1
              ? 'DISPATCH TRACK : 4 ACTIVE PIPELINES'
              : activeItem < 10
              ? `${APPS[activeItem].company} : ${APPS[activeItem].stage}`
              : `PORTAL ${STAGES[activeItem - 10].label}`}
          </span>
        </div>
        <div className="text-right tracking-widest text-[9px] text-amber-600 dark:text-amber-400 font-semibold">
          {activeItem === -1
            ? '5-STAGE MILESTONE GANTRIES'
            : activeItem < 10
            ? APPS[activeItem].stageIdx === 4
              ? 'CONVERSION VERIFIED'
              : `SLA: ${APPS[activeItem].sla.toUpperCase()}`
            : 'STAGE ACTIVE'}
        </div>
      </div>

      {/* Isometric Hairline Stage Plate (Borderless Floating Illustration) */}
      <div className="relative w-full max-w-lg aspect-[5/4] my-2 select-none">
        <div ref={stageRef} className="w-full h-full cursor-crosshair" />

        {/* Ambient Corner Crosshairs (Architectural Drafting marks) */}
        <div className="absolute top-2.5 left-3 text-[8px] font-mono text-muted-foreground/40 pointer-events-none">
          + DISPATCH TRACK
        </div>
        <div className="absolute top-2.5 right-3 text-[8px] font-mono text-muted-foreground/40 pointer-events-none">
          {activeItem < 0
            ? '4 CARRIER LANES'
            : activeItem < 10
            ? `${APPS[activeItem].company} · ${APPS[activeItem].stage}`
            : `PORTAL ${STAGES[activeItem - 10].name.toUpperCase()}`}
        </div>
        <div className="absolute bottom-2.5 left-3 text-[8px] font-mono text-muted-foreground/40 pointer-events-none">
          5 MILESTONE GANTRIES
        </div>
        <div className="absolute bottom-2.5 right-3 text-[8px] font-mono text-muted-foreground/40 pointer-events-none">
          ISO · HAIRLINE
        </div>
      </div>

      {/* Interactive Application Shuttles (Borderless) */}
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
            <div className="flex items-center justify-between w-full">
              <span className="font-bold truncate">{app.company}</span>
              <span className="text-[7.5px] opacity-75">{app.sla.split(' ')[0]}</span>
            </div>
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
