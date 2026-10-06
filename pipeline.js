/**
 * Pipeline: a five-tier stepped lifecycle bench carrying four application
 * dockets across interview stages, advancing checkpoints under the pointer.
 */
const {
  Cam, facing, fillet, fit, mk, open, place, pointer, poly,
  prism, proj, rad, reflect, register, rings, seg, solid, tdone, tset,
  tval, tween, disposer, put,
} = HL;

const N = 4, TIERS = 5, CW = 20, CH = 26, TK = 1.2, SQ2 = Math.SQRT1_2;
// 4 Applications across stages:
// Stripe (stage 2: tech, z: 8), Linear (stage 4: offer, z: 0),
// Vercel (stage 1: screen, z: 12), Anthropic (stage 3: onsite, z: 4)
const APPS = [
  { u: -21, stage: 2, th: -10, name: "tech" },
  { u: -7, stage: 4, th: -8, name: "offer" },
  { u: 7, stage: 1, th: -12, name: "screen" },
  { u: 21, stage: 3, th: -10, name: "onsite" },
];

const shapes = [
  fillet([[-10, 0], [10, 0], [10, 26], [-2, 26], [-2, 30], [-10, 30]], [1, 1, 1.8, 1.2, 1.5, 1.8]),
  fillet([[-10, 0], [10, 0], [10, 26], [4, 26], [4, 30], [-4, 30], [-4, 26], [-10, 26]], [1, 1, 1.8, 1.2, 1.5, 1.5, 1.2, 1.8]),
  fillet([[-10, 0], [10, 0], [10, 26], [2, 26], [2, 30], [-6, 30], [-6, 26], [-10, 26]], [1, 1, 1.8, 1.2, 1.5, 1.5, 1.2, 1.8]),
  fillet([[-10, 0], [10, 0], [10, 30], [2, 30], [2, 26], [-10, 26]], [1, 1, 1.8, 1.2, 1.5, 1.8]),
];

const tierPos = (k) => {
  const d = -26 + k * 13;
  return { cx: d, cy: d, z: 16 - k * 4 };
};

const w = (P, cx, cy, z0, u, v, th, lift) => {
  const s = Math.sin(rad(th)), c = Math.cos(rad(th));
  return P(cx + (u + v * s) * SQ2, cy + (-u + v * s) * SQ2, z0 + v * c + lift);
};
const wb = (P, cx, cy, z0, u, v, th, lift) => {
  const s = Math.sin(rad(th)), c = Math.cos(rad(th));
  return P(cx + (u + (v * s - TK * c)) * SQ2, cy + (-u + (v * s - TK * c)) * SQ2, z0 + v * c + TK * s + lift);
};

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxLift = value;

  const C = Cam(45, 0.5, 1.75);
  fit(C, [[-60, -50, -6], [60, 50, -6], [-60, 50, 0], [60, -50, 0], [-26, -26, 30], [26, 26, 16], [-32, 32, 16], [32, -32, 16]], 200, 166);
  const P = proj(C), front = facing(C);

  const [outer, inner] = rings(-58, -48, 58, 48, 8, 2);
  const g = mk("g", {}, svg);
  reflect(svg, g, P, front, outer, -6, 14);

  const plinth = solid(g);
  put(plinth, prism(P, front, outer, inner, -6, 0));

  const tierSteps = [];
  for (let k = 0; k < TIERS; k++) {
    const tp = tierPos(k);
    const line = mk("path", { d: seg(P(tp.cx - 28, tp.cy + 28, tp.z), P(tp.cx + 28, tp.cy - 28, tp.z)), class: "lo" }, g);
    const beacon = mk("circle", { r: 1.1, class: k === 4 ? "dot" : "dot off" }, g);
    place(beacon, P(tp.cx + 26, tp.cy - 26, tp.z + 0.2));
    tierSteps.push({ line, beacon });
  }

  const dockets = APPS.map((app, i) => {
    const grp = mk("g", {}, g);
    const back = mk("path", { class: "lo" }, grp), face = mk("path", { class: "sil" }, grp);
    const head = mk("path", { class: "lo" }, grp), rules = mk("path", { class: "lo" }, grp);
    const dots = [0, 1, 2, 3, 4].map((sIdx) =>
      mk("circle", { r: 0.9, class: "dot " + (sIdx === app.stage ? "m" : sIdx < app.stage ? "off" : "off") }, grp),
    );
    return { back, face, head, rules, dots, th: tween(app.th), z: tween(0) };
  });

  const appRestCenters = APPS.map((app) => {
    const tp = tierPos(app.stage);
    return w(P, tp.cx, tp.cy, tp.z, app.u, CH / 2, app.th, 0);
  });
  const summitCenter = P(tierPos(4).cx, tierPos(4).cy, 2);

  function hit([x, y]) {
    let best = -1, minD = 22;
    for (let i = 0; i < N; i++) {
      const c = appRestCenters[i], d = Math.hypot(x - c[0], y - c[1]);
      if (d < minD) { minD = d; best = i; }
    }
    if (best >= 0) return best;
    if (Math.hypot(x - summitCenter[0], y - summitCenter[1]) < 26) return 4;
    return -1;
  }

  function drawDocket(i, th, lift) {
    const app = APPS[i], tp = tierPos(app.stage), shape = shapes[i];
    const dw = (u, v) => w(P, tp.cx, tp.cy, tp.z, app.u + u, v, th, lift);
    const dwb = (u, v) => wb(P, tp.cx, tp.cy, tp.z, app.u + u, v, th, lift);
    const dk = dockets[i];
    dk.back.setAttribute("d", poly(shape.map((p) => dwb(p[0], p[1]))));
    dk.face.setAttribute("d", poly(shape.map((p) => dw(p[0], p[1]))));
    dk.head.setAttribute("d", seg(dw(-7, 21), dw(7, 21)));
    dk.rules.setAttribute("d", seg(dw(-7, 15), dw(7, 15)) + seg(dw(-7, 10), dw(5, 10)));
    for (let sIdx = 0; sIdx < 5; sIdx++) {
      place(dk.dots[sIdx], dw(-6 + sIdx * 3, 5));
    }
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    dockets.forEach((dk, i) => {
      drawDocket(i, tval(dk.th, now), tval(dk.z, now));
      if (!tdone(dk.th, now) || !tdone(dk.z, now)) moving = true;
    });
    return moving;
  });
  bag.add(B.unregister);

  let act = -1;
  const caption = (a) => (a < 0 ? "rest" : a === 4 ? "pipeline" : APPS[a].name);
  function setActive(a) {
    if (a === act) return;
    const now = performance.now();
    act = a;

    dockets.forEach((dk, i) => {
      const delay = a < 0 ? Math.abs(i - 1) * 25 : a === 4 ? i * 35 : Math.abs(i - a) * 35;
      const targetTh = a < 0 ? APPS[i].th : a === i ? 0 : APPS[i].th - 6;
      tset(dk.th, targetTh, now, delay);
      tset(dk.z, a === i ? maxLift : 0, now, delay);
      dk.face.classList.toggle("hi", a === i);
      dk.head.classList.toggle("hi", a === i);
      dk.dots[APPS[i].stage].classList.toggle("m", a !== i);
      dk.dots[APPS[i].stage].classList.toggle("hi", a === i || a === 4);
    });

    tierSteps.forEach((st, k) => {
      const isLit = a >= 0 && (a === 4 || APPS[a].stage === k);
      st.line.classList.toggle("hi", isLit);
      st.beacon.classList.toggle("hi", isLit || (a < 0 && k === 4));
    });

    read.textContent = caption(a);
    B.wake();
  }

  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return { set: (v) => { maxLift = v; }, destroy: bag.dispose };
}

hairline({
  name: "pipeline",
  means: "A five-tier stepped lifecycle bench carrying four application dockets across stages, advancing under the pointer.",
  rules: [1, 2, 4, 6, 8, 10],
  range: [6, 14, 24],
  mount,
});
