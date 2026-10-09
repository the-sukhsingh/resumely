/**
 * Comparator: an isometric calibration bench with four rubric carriages
 * sliding along precision rails under an optical inspection bridge.
 */
const {
  Cam, facing, fit, mk, open, place, pointer, poly,
  prism, proj, reflect, register, rings, seg, solid, tdone, tset,
  tval, tween, disposer, put,
} = HL;

const N = 4, YS = [-27, -9, 9, 27], REST_X = [22, 18, 14, 10];
const C_LEN = 16, C_WID = 10, C_H = 12;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let targetX = value;

  const C = Cam(45, 0.5, 1.85);
  fit(C, [[-62, -52, -6], [62, 52, -6], [-62, 52, 0], [62, -52, 0], [22, -36, 32], [22, 36, 32], [-38, -27, 14], [38, 27, 14]], 200, 166);
  const P = proj(C), front = facing(C);

  const [outer, inner] = rings(-60, -50, 60, 50, 9, 2.2);
  const g = mk("g", {}, svg);
  reflect(svg, g, P, front, outer, -6, 14);

  const plinth = solid(g);
  put(plinth, prism(P, front, outer, inner, -6, 0));

  const rails = YS.map((y) => mk("path", { d: seg(P(-36, y, 0.2), P(34, y, 0.2)), class: "dash" }, g));
  const threshLine = mk("path", { d: seg(P(22, -34, 0.2), P(22, 34, 0.2)), class: "lo" }, g);

  const carriages = YS.map((y, i) => {
    const grp = mk("g", {}, g);
    const body = solid(grp);
    const notch = mk("path", { class: "lo" }, grp);
    const dot = mk("circle", { r: 1.1, class: "dot m" }, grp);
    const ticks = mk("path", { class: "lo" }, grp);
    return { grp, body, notch, dot, ticks, x: tween(REST_X[i]), y };
  });

  const bGrp = mk("g", {}, g);
  const bPill0 = solid(bGrp), bPill1 = solid(bGrp);
  put(bPill0, prism(P, front, rings(20, -36, 24, -30, 1.5, 0.6)[0], rings(20, -36, 24, -30, 1.5, 0.6)[1], 0, 24));
  put(bPill1, prism(P, front, rings(20, 30, 24, 36, 1.5, 0.6)[0], rings(20, 30, 24, 36, 1.5, 0.6)[1], 0, 24));
  const bBeam = mk("path", { d: seg(P(22, -33, 23), P(22, 33, 23)), class: "hi" }, bGrp);
  const bBeamLo = mk("path", { d: seg(P(22, -33, 21), P(22, 33, 21)), class: "lo" }, bGrp);

  const cRestPoints = YS.map((y, i) => P(REST_X[i], y, C_H / 2));
  const bridgeCenter = P(22, 0, 22);

  function hit([x, y]) {
    let best = -1, minD = 22;
    for (let i = 0; i < N; i++) {
      const c = cRestPoints[i], d = Math.hypot(x - c[0], y - c[1]);
      if (d < minD) { minD = d; best = i; }
    }
    if (best >= 0) return best;
    if (Math.hypot(x - bridgeCenter[0], y - bridgeCenter[1]) < 28) return 4;
    return -1;
  }

  function drawCarriage(i, curX) {
    const cd = carriages[i], y = cd.y;
    const [cRing, cInner] = rings(curX - C_LEN / 2, y - C_WID / 2, curX + C_LEN / 2, y + C_WID / 2, 2, 0.8);
    put(cd.body, prism(P, front, cRing, cInner, 0, C_H));
    cd.notch.setAttribute("d", seg(P(curX, y - C_WID / 2 + 1, C_H + 0.1), P(curX, y + C_WID / 2 - 1, C_H + 0.1)));
    place(cd.dot, P(curX, y, C_H + 0.2));
    cd.ticks.setAttribute("d", seg(P(curX - 4, y + C_WID / 2, 4), P(curX - 4, y + C_WID / 2, 8)) + seg(P(curX + 4, y + C_WID / 2, 4), P(curX + 4, y + C_WID / 2, 8)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    carriages.forEach((cd, i) => {
      drawCarriage(i, tval(cd.x, now));
      if (!tdone(cd.x, now)) moving = true;
    });
    return moving;
  });
  bag.add(B.unregister);

  let act = -1;
  const caption = (a) => (a < 0 ? "rest" : a === 4 ? "calibrated" : "0" + (a + 1));
  function setActive(a) {
    if (a === act) return;
    const now = performance.now();
    act = a;

    carriages.forEach((cd, i) => {
      const delay = a < 0 ? Math.abs(i - 1) * 30 : a === 4 ? i * 40 : Math.abs(i - a) * 35;
      const tx = a < 0 ? REST_X[i] : a === 4 || a === i ? targetX : REST_X[i] - 3;
      tset(cd.x, tx, now, delay);
      cd.body.sil.classList.toggle("hi", a === i);
      cd.dot.classList.toggle("hi", a === i || a === 4);
      rails[i].classList.toggle("hi", a === i || a === 4);
      rails[i].classList.toggle("dash", a !== i && a !== 4);
    });

    threshLine.classList.toggle("hi", a >= 0);
    bBeam.classList.toggle("hi", a < 0 || a === 4);
    read.textContent = caption(a);
    B.wake();
  }

  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return { set: (v) => { targetX = v; }, destroy: bag.dispose };
}

hairline({
  name: "comparator",
  means: "A precision comparator bench aligns four rubric carriages under an optical inspection bridge, locking into calibration under the pointer.",
  rules: [1, 2, 4, 6, 8, 10],
  range: [14, 22, 28],
  mount,
});
