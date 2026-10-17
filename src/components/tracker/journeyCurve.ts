// Math helper for the curved (not-straight) Journey Path

export interface MilestoneAnchor {
  id: string;
  percent: number; // 0 to 100
  yPercent: number; // vertical position in % (0 = top, 100 = bottom)
}

// 5 well-spaced milestones along the journey:
// Saved -> Applied -> Interviewing -> Offer (summit) -> Rejected / Closed
export const MILESTONE_ANCHORS: MilestoneAnchor[] = [
  { id: 'saved', percent: 10, yPercent: 60 },
  { id: 'applied', percent: 32, yPercent: 44 },
  { id: 'interviewing', percent: 54, yPercent: 52 },
  { id: 'offered', percent: 76, yPercent: 30 },
  { id: 'rejected', percent: 94, yPercent: 62 },
];

/**
 * Calculates smooth y coordinate on the non-straight journey curve for any x.
 * Uses cubic Hermite spline with horizontal tangents at anchors for silky smoothness.
 */
export function getCurveY(x: number, width: number, height: number): number {
  if (width <= 0) return height / 2;

  const anchors = [
    { x: 0, y: height * (MILESTONE_ANCHORS[0].yPercent / 100) },
    ...MILESTONE_ANCHORS.map((m) => ({
      x: width * (m.percent / 100),
      y: height * (m.yPercent / 100),
    })),
    { x: width, y: height * (MILESTONE_ANCHORS[MILESTONE_ANCHORS.length - 1].yPercent / 100) },
  ];

  if (x <= anchors[0].x) return anchors[0].y;
  if (x >= anchors[anchors.length - 1].x) return anchors[anchors.length - 1].y;

  // Find surrounding anchors
  let i = 0;
  while (i < anchors.length - 1 && anchors[i + 1].x < x) {
    i++;
  }

  const p0 = anchors[i];
  const p1 = anchors[i + 1];
  const dx = p1.x - p0.x;
  if (dx <= 0) return p0.y;

  const t = Math.max(0, Math.min(1, (x - p0.x) / dx));

  // Cubic Hermite smoothstep interpolation (zero derivatives at endpoints)
  const h00 = 2 * t * t * t - 3 * t * t + 1;
  const h01 = -2 * t * t * t + 3 * t * t;

  return h00 * p0.y + h01 * p1.y;
}

/**
 * Generates smooth SVG path string (d attribute) for the curved baseline
 */
export function getCurvedBaselineD(width: number, height: number, sampleCount = 70): string {
  if (width <= 0) return '';
  const points: { x: number; y: number }[] = [];

  for (let i = 0; i <= sampleCount; i++) {
    const x = (i / sampleCount) * width;
    const y = getCurveY(x, width, height);
    points.push({ x, y });
  }

  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const midX = (prev.x + curr.x) / 2;
    const midY = (prev.y + curr.y) / 2;
    d += ` Q ${prev.x.toFixed(1)} ${prev.y.toFixed(1)}, ${midX.toFixed(1)} ${midY.toFixed(1)}`;
  }
  const last = points[points.length - 1];
  d += ` L ${last.x.toFixed(1)} ${last.y.toFixed(1)}`;

  return d;
}