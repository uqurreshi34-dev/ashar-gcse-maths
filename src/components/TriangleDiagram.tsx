"use client";

import { TriangleDiagram as DiagramData } from "@/data/triangles";

interface Props {
  diagram: DiagramData;
}

export default function TriangleDiagram({ diagram }: Props) {
  if (diagram.type === "pythagoras") return <PythagorasDiagram d={diagram} />;
  return <AngleDiagram d={diagram} />;
}

// ─── Pythagoras ────────────────────────────────────────────────────────────────
function PythagorasDiagram({ d }: { d: DiagramData }) {
  // Fixed triangle: right angle bottom-left, vertical left, horizontal bottom
  const W = 260, H = 180;
  const pad = 36;
  const bx = pad, by = H - pad;       // bottom-left (right angle)
  const tx = pad, ty = pad;            // top-left
  const rx = W - pad, ry = H - pad;   // bottom-right

  const labelA = d.sideA != null ? `${d.sideA} cm` : "?";
  const labelB = d.sideB != null ? `${d.sideB} cm` : "?";
  const labelC = d.sideC != null ? `${d.sideC} cm` : "?";

  const unknownColor = "#f59e0b";
  const knownColor = "#94a3b8";

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[260px] mx-auto">
      {/* Triangle */}
      <polygon
        points={`${bx},${by} ${tx},${ty} ${rx},${ry}`}
        fill="rgba(255,255,255,0.04)"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="1.5"
      />

      {/* Right angle marker at bottom-left */}
      <polyline
        points={`${bx},${by - 12} ${bx + 12},${by - 12} ${bx + 12},${by}`}
        fill="none"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="1.2"
      />

      {/* Side A label — left (vertical) */}
      <text
        x={bx - 10}
        y={(by + ty) / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="12"
        fontWeight="700"
        fill={d.unknown === "a" ? unknownColor : knownColor}
      >
        {labelA}
      </text>

      {/* Side B label — bottom (horizontal) */}
      <text
        x={(bx + rx) / 2}
        y={by + 16}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="12"
        fontWeight="700"
        fill={d.unknown === "b" ? unknownColor : knownColor}
      >
        {labelB}
      </text>

      {/* Side C label — hypotenuse */}
      <text
        x={(tx + rx) / 2 + 14}
        y={(ty + ry) / 2 - 4}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="12"
        fontWeight="700"
        fill={d.unknown === "c" ? unknownColor : knownColor}
      >
        {labelC}
      </text>

      {/* "longest side" label under hypotenuse for unknown c */}
      {d.unknown === "c" && (
        <text
          x={(tx + rx) / 2 + 14}
          y={(ty + ry) / 2 + 11}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="9"
          fill={unknownColor}
          opacity="0.8"
        >
          (longest side)
        </text>
      )}
    </svg>
  );
}

// ─── Angle ─────────────────────────────────────────────────────────────────────
function AngleDiagram({ d }: { d: DiagramData }) {
  const W = 260, H = 180;
  const pad = 36;

  // Isosceles: symmetric triangle; otherwise slightly skewed
  const bx = pad, by = H - pad;
  const rx = W - pad, ry = H - pad;
  const tx = d.isIsosceles ? W / 2 : W / 2 - 10;
  const ty = pad;

  const knownColor = "#94a3b8";
  const unknownColor = "#f59e0b";

  const labelA = d.angleA != null ? `${d.angleA}°` : "?°";
  const labelB = d.angleB != null ? `${d.angleB}°` : "?°";
  const labelC = d.angleC != null ? `${d.angleC}°` : "?°";

  const colorA = d.angleA != null ? knownColor : unknownColor;
  const colorB = d.angleB != null ? knownColor : unknownColor;
  const colorC = d.angleC != null ? knownColor : unknownColor;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[260px] mx-auto">
      {/* Triangle */}
      <polygon
        points={`${bx},${by} ${tx},${ty} ${rx},${ry}`}
        fill="rgba(255,255,255,0.04)"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="1.5"
      />

      {/* Right angle marker at bottom-left if applicable */}
      {d.isRightAngle && (
        <polyline
          points={`${bx},${by - 12} ${bx + 12},${by - 12} ${bx + 12},${by}`}
          fill="none"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="1.2"
        />
      )}

      {/* Angle A — bottom-left */}
      <text x={bx + 14} y={by - 10} fontSize="12" fontWeight="700" fill={colorA}>
        {d.isRightAngle ? "90°" : labelA}
      </text>

      {/* Angle B — bottom-right */}
      <text x={rx - 30} y={by - 10} fontSize="12" fontWeight="700" fill={colorB}>
        {labelB}
      </text>

      {/* Angle C — top */}
      <text
        x={tx}
        y={ty + 20}
        textAnchor="middle"
        fontSize="12"
        fontWeight="700"
        fill={colorC}
      >
        {labelC}
      </text>

      {/* Tick marks on equal sides for isosceles */}
      {d.isIsosceles && (
        <>
          {/* Left side tick */}
          <line
            x1={(bx + tx) / 2 - 5} y1={(by + ty) / 2 - 3}
            x2={(bx + tx) / 2 + 5} y2={(by + ty) / 2 + 3}
            stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"
          />
          {/* Right side tick */}
          <line
            x1={(rx + tx) / 2 - 5} y1={(ry + ty) / 2 - 3}
            x2={(rx + tx) / 2 + 5} y2={(ry + ty) / 2 + 3}
            stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"
          />
        </>
      )}
    </svg>
  );
}
