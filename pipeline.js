/**
 * Pipeline: a multi-lane application lifecycle dispatch track with five
 * milestone gantry portals and four advancing tailored resume shuttles.
 */
const {
  Cam, facing, fit, mk, place, pointer, poly,
  prism, proj, reflect, register, rings, seg, solid, tdone, tset,
  tval, tween, disposer, put,
} = HL;

const STAGES = [-40, -20, 0, 20, 40], STAGE_NAMES = ["applied", "screen", "technical", "onsite", "offer"];
const APPS = [
  { name: "vercel", stage: 1, x: -20, y: -16, sla: "72h sla" },
  { name: "stripe", stage: 2, x: 0, y: -5, sla: "48h sla" },
  { name: "anthropic", stage: 3, x: 20, y: 6, sla: "36h sla" },
  { name: "linear", stage: 4, x: 40, y: 17, sla: "offer secured" },
];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let progressMult = value;

  const C = Cam(45, 0.5, 2.22);
  fit(C, [
    [-54, -26, -5], [54, 26, -5], [-54, 26, 0], [54, -26, 0],
    [-40, -24, 26], [40, 24, 30], [-20, -16, 22], [40, 17, 24],
  ], 200, 160);
  const P = proj(C), front = facing(C);

  const [outer, inner] = rings(-52, -24, 52, 24, 6, 2.0);
  const g = mk("g", {}, svg);
  reflect(svg, g, P, front, outer, -5, 12);

  const plinth = solid(g);
  put(plinth, prism(P, front, outer, inner, -5, 0));

  // Intake buffer and terminal bumper stops
  mk("path", { d: seg(P(-48, -22, 0.5), P(-48, 22, 0.5)) + seg(P(48, -22, 0.5), P(48, 22, 0.5)), class: "lo" }, g);

  // 5 Milestone Gantry Portals
  const arches = STAGES.map((sx, idx) => {
    const isOffer = idx === 4, archH = isOffer ? 25 : 22, grp = mk("g", {}, g);
    mk("path", { d: seg(P(sx, -22, 0.2), P(sx, 22, 0.2)), class: "lo" }, grp);
    const pL = seg(P(sx, -22, 0), P(sx, -22, archH)), pR = seg(P(sx, 22, 0), P(sx, 22, archH));
    const lintel = seg(P(sx, -22, archH), P(sx, 22, archH)), truss = seg(P(sx, -22, archH - 3), P(sx, 22, archH - 3));
    const frame = mk("path", { d: pL + pR + lintel + truss, class: isOffer ? "hi" : "lo" }, grp);
    const dot = mk("circle", { r: isOffer ? 2.2 : 1.4, class: isOffer ? "dot m hi" : "dot" }, grp);
    place(dot, P(sx, 0, archH + (isOffer ? 3.5 : 2)));
    return { grp, frame, dot, sx, isOffer };
  });

  // 4 Parallel Carrier Lanes
  const lanes = APPS.map((app) => {
    const lGrp = mk("g", {}, g);
    mk("path", { d: seg(P(-46, app.y, 0.3), P(46, app.y, 0.3)), class: "dash" }, lGrp);
    const traveled = mk("path", { d: seg(P(-46, app.y, 0.4), P(app.x, app.y, 0.4)), class: "lo" }, lGrp);
    return { lGrp, traveled, y: app.y };
  });

  // 4 Tailored Resume Dossier Shuttles
  const shuttles = APPS.map((app) => {
    const sGrp = mk("g", {}, g), sled = solid(sGrp);
    const card = mk("path", { class: "sil" }, sGrp), head = mk("path", { class: "lo" }, sGrp);
    const rules = mk("path", { class: "lo" }, sGrp), bead = mk("circle", { r: 1.2, class: "dot" }, sGrp);
    return { sGrp, sled, card, head, rules, bead, app, x: tween(app.x), z: tween(0), tilt: tween(0) };
  });

  const restPoints = APPS.map((app) => P(app.x, app.y, 8));
  const archCenters = STAGES.map((sx) => P(sx, 0, 12));

  function hit([px, py]) {
    let best = -1, minD = 28;
    for (let i = 0; i < APPS.length; i++) {
      const d = Math.hypot(px - restPoints[i][0], py - restPoints[i][1]);
      if (d < minD) { minD = d; best = i; }
    }
    if (best >= 0) return best;
    for (let j = 0; j < STAGES.length; j++) {
      if (Math.hypot(px - archCenters[j][0], py - archCenters[j][1]) < 24) return 10 + j;
    }
    return -1;
  }

  function drawShuttle(i, xPos, zLift, tiltDeg) {
    const s = shuttles[i], y = s.app.y;
    const [so, si] = rings(xPos - 5, y - 3, xPos + 5, y + 3, 1.2, 0.5);
    put(s.sled, prism(P, front, so, si, zLift, zLift + 2));
    const cardH = 16, rad = (tiltDeg * Math.PI) / 180, dx = Math.sin(rad) * cardH, cz = Math.cos(rad) * cardH;
    const p0 = P(xPos - 0.2, y - 4.5, zLift + 2), p1 = P(xPos - 0.2, y + 4.5, zLift + 2);
    const p2 = P(xPos + dx, y + 4.5, zLift + 2 + cz), p3 = P(xPos + dx, y + 2.5, zLift + 2 + cz);
    const p4 = P(xPos + dx, y + 2.5, zLift + cz), p5 = P(xPos + dx, y - 4.5, zLift + cz);
    s.card.setAttribute("d", poly([p0, p1, p2, p3, p4, p5]));
    const hp0 = P(xPos + dx * 0.85, y - 3.5, zLift + 2 + cz * 0.85), hp1 = P(xPos + dx * 0.85, y + 3.5, zLift + 2 + cz * 0.85);
    s.head.setAttribute("d", seg(hp0, hp1));
    const bp0 = P(xPos + dx * 0.65, y - 3.5, zLift + 2 + cz * 0.65), bp1 = P(xPos + dx * 0.65, y + 2.0, zLift + 2 + cz * 0.65);
    const bp2 = P(xPos + dx * 0.45, y - 3.5, zLift + 2 + cz * 0.45), bp3 = P(xPos + dx * 0.45, y + 0.5, zLift + 2 + cz * 0.45);
    s.rules.setAttribute("d", seg(bp0, bp1) + seg(bp2, bp3));
    place(s.bead, P(xPos + dx * 0.25, y, zLift + 2 + cz * 0.25));
    lanes[i].traveled.setAttribute("d", seg(P(-46, y, 0.4), P(xPos, y, 0.4)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    shuttles.forEach((s, i) => {
      drawShuttle(i, tval(s.x, now), tval(s.z, now), tval(s.tilt, now));
      if (!tdone(s.x, now) || !tdone(s.z, now) || !tdone(s.tilt, now)) moving = true;
    });
    return moving;
  });
  bag.add(B.unregister);

  let act = -1;
  function setActive(a) {
    if (a === act) return;
    act = a;
    const now = performance.now();
    if (a < 0) {
      read.textContent = "pipeline · 4 active";
      shuttles.forEach((s) => {
        tset(s.x, s.app.x * progressMult, now, 40);
        tset(s.z, 0, now, 40);
        tset(s.tilt, 0, now, 40);
        s.card.classList.remove("hi");
        s.bead.classList.remove("hi");
      });
      arches.forEach((arch) => {
        arch.frame.classList.toggle("hi", arch.isOffer);
        arch.frame.classList.toggle("lo", !arch.isOffer);
        arch.dot.classList.toggle("hi", arch.isOffer);
      });
      lanes.forEach((l) => l.traveled.classList.replace("hi", "lo"));
    } else if (a < 10) {
      const app = APPS[a];
      read.textContent = `${app.name} · ${STAGE_NAMES[app.stage]} (${app.sla})`;
      shuttles.forEach((s, idx) => {
        const isTarget = idx === a;
        tset(s.z, isTarget ? 5 : 0, now, 0);
        tset(s.tilt, isTarget ? -5 : 0, now, 0);
        tset(s.x, (s.app.x + (isTarget ? 3 : 0)) * progressMult, now, 0);
        s.card.classList.toggle("hi", isTarget);
        s.bead.classList.toggle("hi", isTarget);
      });
      arches.forEach((arch, idx) => {
        const isMatch = idx === app.stage;
        arch.frame.classList.toggle("hi", isMatch || arch.isOffer);
        arch.frame.classList.toggle("lo", !isMatch && !arch.isOffer);
        arch.dot.classList.toggle("hi", isMatch || arch.isOffer);
      });
      lanes.forEach((l, idx) => {
        l.traveled.classList.toggle("hi", idx === a);
        l.traveled.classList.toggle("lo", idx !== a);
      });
    } else {
      const sIdx = a - 10;
      read.textContent = `stage 0${sIdx + 1} · ${STAGE_NAMES[sIdx]}`;
      arches.forEach((arch, idx) => {
        const isTarget = idx === sIdx;
        arch.frame.classList.toggle("hi", isTarget || arch.isOffer);
        arch.frame.classList.toggle("lo", !isTarget && !arch.isOffer);
        arch.dot.classList.toggle("hi", isTarget || arch.isOffer);
      });
    }
    B.wake();
  }

  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  setActive(-1);

  return {
    set(v) {
      progressMult = v;
      const now = performance.now();
      shuttles.forEach((s) => tset(s.x, s.app.x * progressMult, now, 20));
      B.wake();
    },
    destroy: bag.dispose,
  };
}

hairline({
  name: "pipeline",
  means: "A multi-lane application dispatch track carrying tailored resumes through five milestone portals.",
  rules: [1, 3, 5, 8, 9],
  range: [0.8, 1.0, 1.2],
  mount,
});
