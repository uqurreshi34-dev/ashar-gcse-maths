"use client";

import { TriangleDiagram as DiagramData } from "@/data/triangles";

interface Props {
  diagram: DiagramData;
}

export default function TriangleDiagram({ diagram }: Props) {
  if (diagram.type === "pythagoras") return <PythagorasDiagram d={diagram} />;
  return <AngleDiagram d={diagram} />;
}

// Draws a small arc at a triangle vertex to indicate the angle
function AngleArc({
  cx, cy,       // vertex point
  p1x, p1y,    // point on first edge
  p2x, p2y,    // point on second edge
  r = 18,      // arc radius
  color = "rgba(255,255,255,0.5)",
  isRight = false,
}: {
  cx: number; cy: number;
  p1x: number; p1y: number;
  p2x: number; p2y: number;
  r?: number; color?: string; isRight?: boolean;
}) {
  if (isRight) {
    // Draw a small square instead of arc for right angles
    const size = 12;
    // Direction vectors along each edge
    const d1x = (p1x - cx) / Math.hypot(p1x - cx, p1y - cy);
    const d1y = (p1y - cy) / Math.hypot(p1x - cx, p1y - cy);
    const d2x = (p2x - cx) / Math.hypot(p2x - cx, p2y - cy);
    const d2y = (p2y - cy) / Math.hypot(p2x - cx, p2y - cy);
    const ax = cx + d1x * size;
    const ay = cy + d1y * size;
    const bx = cx + d1x * size + d2x * size;
    const by = cy + d1y * size + d2y * size;
    const ex = cx + d2x * size;
    const ey = cy + d2y * size;
    return (
      <polyline
        points={`${ax},${ay} ${bx},${by} ${ex},${ey}`}
        fill="none"
        stroke={color}
        strokeWidth="1.4"
      />
    );
  }

  // Compute angles from vertex to each neighbour
  const a1 = Math.atan2(p1y - cy, p1x - cx);
  const a2 = Math.atan2(p2y - cy, p2x - cx);

  // Ensure arc goes the short way around
  let startAngle = a1;
  let endAngle = a2;
  let diff = endAngle - startAngle;
  if (diff > Math.PI) diff -= 2 * Math.PI;
  if (diff < -Math.PI) diff += 2 * Math.PI;
  endAngle = startAngle + diff;

  const x1 = cx + r * Math.cos(startAngle);
  const y1 = cy + r * Math.sin(startAngle);
  const x2 = cx + r * Math.cos(endAngle);
  const y2 = cy + r * Math.sin(endAngle);
  const largeArc = Math.abs(diff) > Math.PI ? 1 : 0;
  const sweep = diff > 0 ? 1 : 0;

  return (
    <path
      d={`M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} ${sweep} ${x2} ${y2}`}
      fill="none"
      stroke={color}
      strokeWidth="1.4"
    />
  );
}

// ─── Pythagoras ────────────────────────────────────────────────────────────────
function PythagorasDiagram({ d }: { d: DiagramData }) {
  const W = 280, H = 200;
  const pad = 50;

  // right angle at bottom-left, vertical left side, horizontal bottom
  const bx = pad,     by = H - pad;   // bottom-left (right angle)
  const tx = pad,     ty = pad + 10;  // top-left
  const rx = W - pad, ry = H - pad;   // bottom-right

  const unknownColor = "#f59e0b";
  const knownColor = "#94a3b8";

  const labelA = d.sideA != null ? `${d.sideA} cm` : "?";
  const labelB = d.sideB != null ? `${d.sideB} cm` : "?";
  const labelC = d.sideC != null ? `${d.sideC} cm` : "?";

  const colA = d.unknown === "a" ? unknownColor : knownColor;
  const colB = d.unknown === "b" ? unknownColor : knownColor;
  const colC = d.unknown === "c" ? unknownColor : knownColor;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[280px] mx-auto">
      {/* Triangle fill */}
      <polygon
        points={`${bx},${by} ${tx},${ty} ${rx},${ry}`}
        fill="rgba(255,255,255,0.04)"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1.5"
      />

      {/* Right angle square marker */}
      <AngleArc
        cx={bx} cy={by}
        p1x={tx} p1y={ty}
        p2x={rx} p2y={ry}
        isRight={true}
        color="rgba(255,255,255,0.55)"
      />

      {/* Side A — vertical left — label to the left */}
      <text
        x={bx - 10}
        y={(by + ty) / 2}
        textAnchor="end"
        dominantBaseline="middle"
        fontSize="12"
        fontWeight="700"
        fill={colA}
      >
        {labelA}
      </text>

      {/* Side B — horizontal bottom — label below */}
      <text
        x={(bx + rx) / 2}
        y={by + 18}
        textAnchor="middle"
        dominantBaseline="hanging"
        fontSize="12"
        fontWeight="700"
        fill={colB}
      >
        {labelB}
      </text>

      {/* Side C — hypotenuse — label offset to the right of midpoint */}
      <text
        x={(tx + rx) / 2 + 18}
        y={(ty + ry) / 2 - 8}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="12"
        fontWeight="700"
        fill={colC}
      >
        {labelC}
      </text>
      {d.unknown === "c" && (
        <text
          x={(tx + rx) / 2 + 18}
          y={(ty + ry) / 2 + 8}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="9"
          fill={unknownColor}
          opacity="0.75"
        >
          (longest side)
        </text>
      )}
    </svg>
  );
}

// ─── Angle ─────────────────────────────────────────────────────────────────────
function AngleDiagram({ d }: { d: DiagramData }) {
  const W = 280, H = 200;

  // Vertices — isosceles is symmetric
  const bx = 48,      by = H - 38;   // bottom-left  (angle A)
  const rx = W - 48,  ry = H - 38;   // bottom-right (angle B)
  const tx = d.isIsosceles ? W / 2 : W / 2 - 10;
  const ty = 32;                       // top          (angle C)

  const knownColor = "#94a3b8";
  const unknownColor = "#f59e0b";

  const colorA = d.angleA != null ? knownColor : unknownColor;
  const colorB = d.angleB != null ? knownColor : unknownColor;
  const colorC = d.angleC != null ? knownColor : unknownColor;

  const labelA = d.isRightAngle ? "90°" : (d.angleA != null ? `${d.angleA}°` : "?°");
  const labelB = d.angleB != null ? `${d.angleB}°` : "?°";
  const labelC = d.angleC != null ? `${d.angleC}°` : "?°";

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[280px] mx-auto">
      {/* Triangle */}
      <polygon
        points={`${bx},${by} ${tx},${ty} ${rx},${ry}`}
        fill="rgba(255,255,255,0.04)"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1.5"
      />

      {/* Angle arcs */}
      {/* Bottom-left A */}
      <AngleArc
        cx={bx} cy={by}
        p1x={tx} p1y={ty}
        p2x={rx} p2y={ry}
        r={20}
        color={colorA}
        isRight={!!d.isRightAngle}
      />
      {/* Bottom-right B */}
      <AngleArc
        cx={rx} cy={ry}
        p1x={bx} p1y={by}
        p2x={tx} p2y={ty}
        r={20}
        color={colorB}
      />
      {/* Top C */}
      <AngleArc
        cx={tx} cy={ty}
        p1x={bx} p1y={by}
        p2x={rx} p2y={ry}
        r={20}
        color={colorC}
      />

      {/* Angle labels — pushed well clear of vertices */}
      {/* A — bottom-left: label down-right */}
      <text x={bx + 28} y={by - 8} fontSize="12" fontWeight="700" fill={colorA}>
        {labelA}
      </text>
      {/* B — bottom-right: label down-left */}
      <text x={rx - 42} y={ry - 8} fontSize="12" fontWeight="700" fill={colorB} textAnchor="start">
        {labelB}
      </text>
      {/* C — top: label below vertex */}
      <text x={tx} y={ty + 26} textAnchor="middle" fontSize="12" fontWeight="700" fill={colorC}>
        {labelC}
      </text>

      {/* Isosceles tick marks on equal sides */}
      {d.isIsosceles && (
        <>
          <line
            x1={(bx + tx) / 2 - 6} y1={(by + ty) / 2 - 3}
            x2={(bx + tx) / 2 + 6} y2={(by + ty) / 2 + 3}
            stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"
          />
          <line
            x1={(rx + tx) / 2 - 6} y1={(ry + ty) / 2 - 3}
            x2={(rx + tx) / 2 + 6} y2={(ry + ty) / 2 + 3}
            stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"
          />
        </>
      )}
    </svg>
  );
}
