/**
 * Ledger: a master resume plinth in the center powering five diversified
 * variant resume cards around it via grounded hairline conduits.
 */
const {
  Cam, facing, fillet, fit, mk, open, place, pointer, poly,
  prism, proj, rad, reflect, register, rings, seg, solid, tdone, tset,
  tval, tween, disposer, put,
} = HL;

const N = 5, WM = 44, HM = 56, TKM = 1.4, TKC = 1.2;
const SQ2 = Math.SQRT1_2, MCX = -15, MCY = -15, M_REST_TH = -10;
const CARDS = [
  { cx: -19, cy: 29, th: -13, pt: [-22, -10] },
  { cx: -3, cy: 21, th: -10, pt: [-18, -6] },
  { cx: 12, cy: 12, th: -7, pt: [-10, -10] },
  { cx: 21, cy: -3, th: -10, pt: [-6, -18] },
  { cx: 29, cy: -19, th: -13, pt: [-10, -22] },
];

const mShape = fillet(
  [[-WM / 2, 0], [WM / 2, 0], [WM / 2, HM], [10, HM], [10, HM + 5], [-6, HM + 5], [-6, HM], [-WM / 2, HM]],
  [1.2, 1.2, 2.5, 1.5, 2, 2, 1.5, 2.5],
);

const cShapes = [
  fillet([[-11, 0], [11, 0], [11, 32], [-2, 32], [-2, 36], [-11, 36]], [1, 1, 2, 1.5, 1.5, 2]),
  fillet([[-11, 0], [11, 0], [11, 34], [4, 34], [4, 38], [-4, 38], [-4, 34], [-11, 34]], [1, 1, 2, 1.5, 1.5, 1.5, 1.5, 2]),
  fillet([[-12, 0], [12, 0], [12, 36], [6, 36], [6, 40], [-6, 40], [-6, 34], [-12, 34]], [1, 1, 2, 1.5, 1.5, 1.5, 1.5, 2]),
  fillet([[-11, 0], [11, 0], [11, 34], [11, 38], [2, 38], [2, 34], [-11, 34]], [1, 1, 2, 1.5, 1.5, 1.5, 2]),
  fillet([[-11, 0], [11, 0], [11, 32], [11, 36], [3, 36], [3, 32], [-11, 32]], [1, 1, 2, 1.5, 1.5, 1.5, 2]),
];

const w = (P, cx, cy, u, v, th, lift) => {
  const s = Math.sin(rad(th)), c = Math.cos(rad(th));
  return P(cx + (u + v * s) * SQ2, cy + (-u + v * s) * SQ2, v * c + lift);
};
const wb = (P, cx, cy, u, v, th, lift, tk) => {
  const s = Math.sin(rad(th)), c = Math.cos(rad(th));
  return P(cx + (u + (v * s - tk * c)) * SQ2, cy + (-u + (v * s - tk * c)) * SQ2, v * c + tk * s + lift);
};

function masterPose(P, th, lift) {
  const mw = (u, v) => w(P, MCX, MCY, u, v, th, lift);
  const mwb = (u, v) => wb(P, MCX, MCY, u, v, th, lift, TKM);
  const vSec = [39, 32, 25, 18, 11];
  return {
    back: poly(mShape.map((p) => mwb(p[0], p[1]))),
    face: poly(mShape.map((p) => mw(p[0], p[1]))),
    head: seg(mw(-WM / 2 + 4, HM - 8), mw(WM / 2 - 4, HM - 8)),
    sub: seg(mw(-WM / 2 + 4, HM - 13), mw(WM / 2 - 12, HM - 13)),
    rules: vSec.map((v) => seg(mw(-WM / 2 + 8, v), mw(WM / 2 - 4, v)) + seg(mw(-WM / 2 + 8, v - 3), mw(WM / 2 - 12, v - 3))),
    punches: vSec.map((v) => mw(-WM / 2 + 4, v)),
  };
}

function cardPose(P, i, th, lift) {
  const cd = CARDS[i], shape = cShapes[i], cw = (u, v) => w(P, cd.cx, cd.cy, u, v, th, lift);
  const cwb = (u, v) => wb(P, cd.cx, cd.cy, u, v, th, lift, TKC);
  const head = i === 2 ? seg(cw(-9, 29), cw(9, 29)) : seg(cw(-8, 27), cw(8, 27));
  const sub = i === 2 ? seg(cw(-9, 25), cw(4, 25)) : i === 1 ? seg(cw(-8, 23), cw(3, 23)) : "";
  let r = "";
  if (i === 0) r = seg(cw(-8, 20), cw(-1, 20)) + seg(cw(2, 20), cw(8, 20)) + seg(cw(-8, 14), cw(8, 14)) + seg(cw(-8, 7), cw(5, 7));
  else if (i === 1) r = seg(cw(-8, 17), cw(8, 17)) + seg(cw(0, 15), cw(0, 19)) + seg(cw(-8, 11), cw(8, 11)) + seg(cw(-8, 6), cw(6, 6));
  else if (i === 2) r = seg(cw(0, 20), cw(0, 5)) + seg(cw(-9, 17), cw(-2, 17)) + seg(cw(2, 17), cw(9, 17)) + seg(cw(-9, 10), cw(-2, 10)) + seg(cw(2, 10), cw(9, 10));
  else if (i === 3) r = seg(cw(-8, 21), cw(8, 21)) + seg(cw(-8, 16), cw(8, 16)) + seg(cw(-8, 11), cw(6, 11)) + seg(cw(-8, 6), cw(8, 6));
  else r = seg(cw(-8, 21), cw(1, 21)) + seg(cw(-8, 15), cw(8, 15)) + seg(cw(-8, 10), cw(5, 10)) + seg(cw(-8, 5), cw(8, 5));
  const punch = i === 0 ? cw(-7, 34) : i === 1 ? cw(0, 36) : i === 2 ? cw(0, 38) : i === 3 ? cw(7, 36) : cw(7, 34);
  return { back: poly(shape.map((p) => cwb(p[0], p[1]))), face: poly(shape.map((p) => cw(p[0], p[1]))), head: head + sub, rules: r, punch };
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxLift = value;

  const C = Cam(45, 0.5, 1.62);
  fit(C, [[-62, -56, -6], [62, 56, -6], [-62, 56, 0], [62, -56, 0], [-15, -15, 80], [-19, 29, 60], [29, -19, 60]], 200, 166);
  const P = proj(C), front = facing(C);

  const [outer, inner] = rings(-60, -54, 60, 54, 10, 2.2);
  const g = mk("g", {}, svg);
  reflect(svg, g, P, front, outer, -6, 14);

  const plinth = solid(g);
  put(plinth, prism(P, front, outer, inner, -6, 0));

  const conduits = CARDS.map((cd) => mk("path", { d: seg(P(cd.pt[0], cd.pt[1], 0.2), P(cd.cx, cd.cy, 0.2)), class: "dash" }, g));

  const mGrp = mk("g", {}, g);
  const mBack = mk("path", { class: "lo" }, mGrp), mFace = mk("path", { class: "sil" }, mGrp);
  const mHead = mk("path", { class: "hi" }, mGrp), mSub = mk("path", { class: "lo" }, mGrp);
  const mRules = [0, 1, 2, 3, 4].map(() => mk("path", { class: "lo" }, mGrp));
  const mPunches = [0, 1, 2, 3, 4].map(() => mk("circle", { r: 1.15, class: "dot off" }, mGrp));
  const master = { th: tween(M_REST_TH), z: tween(0) };

  const cards = CARDS.map((cd, i) => {
    const grp = mk("g", {}, g);
    const back = mk("path", { class: "lo" }, grp), face = mk("path", { class: "sil" }, grp);
    const head = mk("path", { class: "lo" }, grp), rules = mk("path", { class: "lo" }, grp);
    const punch = mk("circle", { r: 1.05, class: "dot m" }, grp);
    return { back, face, head, rules, punch, th: tween(cd.th), z: tween(0) };
  });

  const cM = P(MCX, MCY, 27), cardCenters = CARDS.map((c) => P(c.cx, c.cy, 16));
  function hit([x, y]) {
    let best = -1, minD = 22;
    for (let i = 0; i < N; i++) {
      const c = cardCenters[i], d = Math.hypot(x - c[0], y - c[1]);
      if (d < minD) { minD = d; best = i; }
    }
    if (best >= 0) return best;
    if (Math.hypot(x - cM[0], y - cM[1]) < 32) return 5;
    return -1;
  }

  function drawMaster(th, lift) {
    const q = masterPose(P, th, lift);
    mBack.setAttribute("d", q.back); mFace.setAttribute("d", q.face);
    mHead.setAttribute("d", q.head); mSub.setAttribute("d", q.sub);
    q.rules.forEach((d, i) => mRules[i].setAttribute("d", d));
    q.punches.forEach((pt, i) => place(mPunches[i], pt));
  }

  function drawCard(i, th, lift) {
    const cd = cards[i], q = cardPose(P, i, th, lift);
    cd.back.setAttribute("d", q.back); cd.face.setAttribute("d", q.face);
    cd.head.setAttribute("d", q.head); cd.rules.setAttribute("d", q.rules);
    place(cd.punch, q.punch);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    drawMaster(tval(master.th, now), tval(master.z, now));
    if (!tdone(master.th, now) || !tdone(master.z, now)) moving = true;
    cards.forEach((cd, i) => {
      drawCard(i, tval(cd.th, now), tval(cd.z, now));
      if (!tdone(cd.th, now) || !tdone(cd.z, now)) moving = true;
    });
    return moving;
  });
  bag.add(B.unregister);

  let act = -1;
  const caption = (a) => (a < 0 ? "rest" : a === 5 ? "master" : "0" + (a + 1));
  function setActive(a) {
    if (a === act) return;
    const now = performance.now();
    act = a;

    tset(master.th, a === 5 ? 0 : M_REST_TH, now, 0);
    tset(master.z, a === 5 ? maxLift + 2 : 0, now, 0);
    mFace.classList.toggle("hi", a === 5);
    mHead.classList.toggle("hi", a < 0);

    cards.forEach((cd, i) => {
      const delay = a < 0 ? Math.abs(i - 2) * 25 : a === 5 ? Math.abs(i - 2) * 35 : Math.abs(i - a) * 35;
      const targetTh = a < 0 ? CARDS[i].th : a === i ? 0 : CARDS[i].th - 6;
      tset(cd.th, targetTh, now, delay);
      tset(cd.z, a === i ? maxLift : 0, now, delay);
      cd.face.classList.toggle("hi", a === i);
      cd.head.classList.toggle("hi", a === i);
      conduits[i].classList.toggle("hi", a === i || a === 5);
      conduits[i].classList.toggle("dash", a !== i && a !== 5);
      mRules[i].classList.toggle("hi", a === i);
      mPunches[i].classList.toggle("m", a === i);
      mPunches[i].classList.toggle("off", a !== i);
    });

    read.textContent = caption(a);
    B.wake();
  }

  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return { set: (v) => { maxLift = v; }, destroy: bag.dispose };
}

hairline({
  name: "ledger",
  means: "A master resume plinth powers five tailored variants, each lifted and traced to its source under the pointer.",
  rules: [1, 2, 4, 6, 8, 10],
  range: [6, 14, 24],
  mount,
});
