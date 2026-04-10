"use client";

import { TriangleDiagram as DiagramData } from "@/data/triangles";

interface Props {
  diagram: DiagramData;
}

export default function TriangleDiagram({ diagram }: Props) {
  if (diagram.type === "pythagoras") return <PythagorasDiagram d={diagram} />;
  return <AngleDiagram d={diagram} />;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

// Unit vector from (cx,cy) toward (px,py)
function unit(cx: number, cy: number, px: number, py: number) {
  const len = Math.hypot(px - cx, py - cy);
  return { x: (px - cx) / len, y: (py - cy) / len };
}

// Bisector direction between two edges from vertex (cx,cy)
function bisector(
  cx: number, cy: number,
  p1x: number, p1y: number,
  p2x: number, p2y: number
) {
  const u1 = unit(cx, cy, p1x, p1y);
  const u2 = unit(cx, cy, p2x, p2y);
  const bx = u1.x + u2.x;
  const by = u1.y + u2.y;
  const len = Math.hypot(bx, by) || 1;
  return { x: bx / len, y: by / len };
}

// Small arc at a vertex
function AngleArc({
  cx, cy, p1x, p1y, p2x, p2y,
  r = 18, color = "rgba(255,255,255,0.55)",
}: {
  cx: number; cy: number;
  p1x: number; p1y: number;
  p2x: number; p2y: number;
  r?: number; color?: string;
}) {
  const a1 = Math.atan2(p1y - cy, p1x - cx);
  const a2 = Math.atan2(p2y - cy, p2x - cx);
  let diff = a2 - a1;
  if (diff > Math.PI) diff -= 2 * Math.PI;
  if (diff < -Math.PI) diff += 2 * Math.PI;
  const endAngle = a1 + diff;
  const x1 = cx + r * Math.cos(a1);
  const y1 = cy + r * Math.sin(a1);
  const x2 = cx + r * Math.cos(endAngle);
  const y2 = cy + r * Math.sin(endAngle);
  const sweep = diff > 0 ? 1 : 0;
  return (
    <path
      d={`M ${x1} ${y1} A ${r} ${r} 0 0 ${sweep} ${x2} ${y2}`}
      fill="none" stroke={color} strokeWidth="1.4"
    />
  );
}

// Proper right-angle square at a vertex (works for any orientation)
function RightAngleSquare({
  cx, cy, p1x, p1y, p2x, p2y,
  size = 12, color = "rgba(255,255,255,0.55)",
}: {
  cx: number; cy: number;
  p1x: number; p1y: number;
  p2x: number; p2y: number;
  size?: number; color?: string;
}) {
  const d1 = unit(cx, cy, p1x, p1y);
  const d2 = unit(cx, cy, p2x, p2y);
  const ax = cx + d1.x * size;
  const ay = cy + d1.y * size;
  const bx = ax + d2.x * size;
  const by = ay + d2.y * size;
  const ex = cx + d2.x * size;
  const ey = cy + d2.y * size;
  return (
    <polyline
      points={`${ax},${ay} ${bx},${by} ${ex},${ey}`}
      fill="none" stroke={color} strokeWidth="1.4"
    />
  );
}

// ─── Pythagoras ────────────────────────────────────────────────────────────────
function PythagorasDiagram({ d }: { d: DiagramData }) {
  const W = 280, H = 200;
  // True right angle at bottom-left: vertical left side, horizontal bottom
  const bx = 55,      by = H - 45;  // bottom-left (right angle)
  const tx = 55,      ty = 38;      // top-left    (vertical side)
  const rx = W - 45,  ry = H - 45;  // bottom-right

  const unknownColor = "#f59e0b";
  const knownColor = "#94a3b8";
  const colA = d.unknown === "a" ? unknownColor : knownColor;
  const colB = d.unknown === "b" ? unknownColor : knownColor;
  const colC = d.unknown === "c" ? unknownColor : knownColor;
  const labelA = d.sideA != null ? `${d.sideA} cm` : "?";
  const labelB = d.sideB != null ? `${d.sideB} cm` : "?";
  const labelC = d.sideC != null ? `${d.sideC} cm` : "?";

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[280px] mx-auto">
      <polygon
        points={`${bx},${by} ${tx},${ty} ${rx},${ry}`}
        fill="rgba(255,255,255,0.04)"
        stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"
      />
      {/* Right angle square — hardcoded since sides are exactly vertical/horizontal */}
      <polyline
        points={`${bx},${by - 12} ${bx + 12},${by - 12} ${bx + 12},${by}`}
        fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.4"
      />
      {/* Side A — vertical left — label to the left of midpoint */}
      <text x={bx - 10} y={(by + ty) / 2} textAnchor="end" dominantBaseline="middle"
        fontSize="12" fontWeight="700" fill={colA}>{labelA}</text>
      {/* Side B — horizontal bottom — label below midpoint */}
      <text x={(bx + rx) / 2} y={by + 16} textAnchor="middle" dominantBaseline="hanging"
        fontSize="12" fontWeight="700" fill={colB}>{labelB}</text>
      {/* Side C — hypotenuse — label along bisector, offset outward */}
      <text x={(tx + rx) / 2 + 16} y={(ty + ry) / 2 - 10} textAnchor="middle"
        fontSize="12" fontWeight="700" fill={colC}>{labelC}</text>
    </svg>
  );
}

// ─── Angle ─────────────────────────────────────────────────────────────────────
function AngleDiagram({ d }: { d: DiagramData }) {
  const W = 280, H = 210;

  // Right-angled isosceles: right angle bottom-left, true vertical left side,
  // true horizontal bottom — same layout as Pythagoras so it looks correct
  const isRightIso = d.isRightAngle && d.isIsosceles;

  let bx: number, by: number, tx: number, ty: number, rx: number, ry: number;

  if (isRightIso) {
    // Proper right-angle layout: bottom-left = 90°, vertical left, horizontal bottom
    bx = 55;  by = H - 45;
    tx = 55;  ty = 45;
    rx = 55 + (by - ty); ry = H - 45; // equal legs so dx = dy
  } else if (d.isObtuse) {
    // Apex almost directly above bottom-left, slightly right — makes bottom-left angle > 90°
    bx = 55;  by = H - 45;
    rx = W - 45; ry = H - 45;
    tx = 90;  ty = 48;
  } else if (d.isIsosceles) {
    bx = 48;  by = H - 42;
    rx = W - 48; ry = H - 42;
    tx = W / 2; ty = 38;
  } else {
    bx = 48;  by = H - 42;
    rx = W - 48; ry = H - 42;
    tx = W / 2 - 15; ty = 38;
  }

  const knownColor = "#94a3b8";
  const unknownColor = "#f59e0b";

  // Angle A = bottom-left, B = bottom-right, C = top
  const colorA = (d.isRightAngle || d.angleA != null) ? knownColor : unknownColor;
  const colorB = d.angleB != null ? knownColor : unknownColor;
  const colorC = d.angleC != null ? knownColor : unknownColor;
  const labelA = d.isRightAngle ? "90°" : (d.angleA != null ? `${d.angleA}°` : "?°");
  const labelB = d.angleB != null ? `${d.angleB}°` : "?°";
  const labelC = d.angleC != null ? `${d.angleC}°` : "?°";

  // Label positions: place each label along the angle bisector, well outside the arc
  const labelDist = 34;
  const bisA = bisector(bx, by, tx, ty, rx, ry);
  const bisB = bisector(rx, ry, bx, by, tx, ty);
  const bisC = bisector(tx, ty, bx, by, rx, ry);

  const lAx = bx + bisA.x * labelDist;
  const lAy = by + bisA.y * labelDist;
  const lBx = rx + bisB.x * labelDist;
  const lBy = ry + bisB.y * labelDist;
  const lCx = tx + bisC.x * labelDist;
  const lCy = ty + bisC.y * labelDist;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[280px] mx-auto">
      <polygon
        points={`${bx},${by} ${tx},${ty} ${rx},${ry}`}
        fill="rgba(255,255,255,0.04)"
        stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"
      />

      {/* Angle markers */}
      {d.isRightAngle ? (
        // Hardcoded right-angle square for isRightIso (sides are exactly V/H)
        <polyline
          points={`${bx},${by - 14} ${bx + 14},${by - 14} ${bx + 14},${by}`}
          fill="none" stroke={colorA} strokeWidth="1.4"
        />
      ) : (
        <AngleArc cx={bx} cy={by} p1x={tx} p1y={ty} p2x={rx} p2y={ry} r={20} color={colorA} />
      )}
      <AngleArc cx={rx} cy={ry} p1x={bx} p1y={by} p2x={tx} p2y={ty} r={20} color={colorB} />
      <AngleArc cx={tx} cy={ty} p1x={bx} p1y={by} p2x={rx} p2y={ry} r={20} color={colorC} />

      {/* Labels — placed along each bisector, guaranteed outside arcs */}
      <text x={lAx} y={lAy} textAnchor="middle" dominantBaseline="middle"
        fontSize="12" fontWeight="700" fill={colorA}>{labelA}</text>
      <text x={lBx} y={lBy} textAnchor="middle" dominantBaseline="middle"
        fontSize="12" fontWeight="700" fill={colorB}>{labelB}</text>
      <text x={lCx} y={lCy} textAnchor="middle" dominantBaseline="middle"
        fontSize="12" fontWeight="700" fill={colorC}>{labelC}</text>

    </svg>
  );
}
