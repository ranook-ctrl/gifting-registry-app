import { useEffect, useMemo, useRef, useState } from "react";
import { geoMercator, geoPath } from "d3-geo";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import { world, type WorldProps } from "./data/world";

type Props = {
  selectedCode: string | null;
  width?: number;
  height?: number;
  onSelect?: (code: string) => void;
};

const PAD = 50;

const COL = {
  ocean: "#BFE0EB",
  land: "#F4EFE5",
  border: "#A89AC9",
  borderFocus: "#1A1A1A",
  landFocus: "#FFFFFF",
  label: "#111111",
  labelHalo: "#FFFFFF",
  pin: "#0E0E0E",
  pinDot: "#FFFFFF",
};

function useViewBox(target: [number, number, number, number]) {
  const [vb, setVb] = useState(target);
  const fromRef = useRef(target);
  const startRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    cancelAnimationFrame(rafRef.current ?? 0);
    fromRef.current = vb;
    startRef.current = performance.now();
    const DURATION = 700;
    const tick = (t: number) => {
      const k = Math.min(1, (t - startRef.current) / DURATION);
      const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      const next = fromRef.current.map(
        (v, i) => v + (target[i] - v) * e
      ) as [number, number, number, number];
      setVb(next);
      if (k < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current ?? 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target.join(",")]);

  return vb;
}

export default function MapCanvas({
  selectedCode,
  width = 800,
  height = 600,
  onSelect,
}: Props) {
  const { features, spherePath, paths, bboxByCode, centroidByCode, allBBox } =
    useMemo(() => {
      const features = world.features as Feature<Geometry, WorldProps>[];
      const targets: FeatureCollection<Geometry, WorldProps> = {
        type: "FeatureCollection",
        features: features.filter((f) => f.properties?.target),
      };

      const projection = geoMercator().fitExtent(
        [
          [PAD, PAD],
          [width - PAD, height - PAD],
        ],
        targets
      );
      const path = geoPath(projection);
      const spherePath = path({ type: "Sphere" }) || "";

      const paths: Record<string, string> = {};
      const bboxByCode: Record<string, [number, number, number, number]> = {};
      const centroidByCode: Record<string, [number, number]> = {};

      for (let i = 0; i < features.length; i++) {
        const f = features[i];
        const id = String(i);
        const d = path(f);
        if (d) paths[id] = d;
        const code = f.properties?.code;
        if (code) {
          const b = path.bounds(f);
          const x = b[0][0],
            y = b[0][1],
            w = b[1][0] - b[0][0],
            h = b[1][1] - b[0][1];
          // generous padding so the rest of the world is visible around it
          const px = Math.max(w * 1.6, 120);
          const py = Math.max(h * 1.6, 120);
          bboxByCode[code] = [x - px, y - py, w + px * 2, h + py * 2];
          centroidByCode[code] = path.centroid(f) as [number, number];
        }
      }

      const allBBox: [number, number, number, number] = [0, 0, width, height];
      return { features, spherePath, paths, bboxByCode, centroidByCode, allBBox };
    }, [width, height]);

  const target =
    selectedCode && bboxByCode[selectedCode]
      ? bboxByCode[selectedCode]
      : allBBox;
  const vb = useViewBox(target);

  const focusCentroid = selectedCode ? centroidByCode[selectedCode] : null;
  const focusName = selectedCode
    ? features.find((f) => f.properties?.code === selectedCode)?.properties?.name
    : null;

  // Scale factor for pin/label so they stay readable when zoomed in
  const scale = vb[2] / width;
  const pinR = 18 * scale;
  const labelSize = 22 * scale;

  return (
    <svg
      viewBox={vb.join(" ")}
      width={width}
      height={height}
      style={{
        background: COL.ocean,
        display: "block",
        borderRadius: 16,
        overflow: "hidden",
      }}
      preserveAspectRatio="xMidYMid slice"
    >
      <rect x={vb[0]} y={vb[1]} width={vb[2]} height={vb[3]} fill={COL.ocean} />
      {spherePath && <path d={spherePath} fill={COL.ocean} />}
      <g>
        {features.map((f, i) => {
          const id = String(i);
          const code = f.properties?.code;
          const isFocus = !!code && code === selectedCode;
          const clickable = !!code && f.properties?.target;
          return (
            <path
              key={id}
              d={paths[id]}
              fill={isFocus ? COL.landFocus : COL.land}
              stroke={isFocus ? COL.borderFocus : COL.border}
              strokeWidth={isFocus ? 2.2 * scale : 0.6 * scale}
              strokeLinejoin="round"
              style={{
                transition: "fill 350ms ease, stroke 350ms ease",
                cursor: clickable && onSelect ? "pointer" : "default",
              }}
              onClick={
                clickable && onSelect ? () => onSelect(code!) : undefined
              }
            >
              {f.properties?.name && <title>{f.properties.name}</title>}
            </path>
          );
        })}
      </g>

      {focusCentroid && (
        <g
          style={{
            transition: "transform 350ms ease",
            transform: `translate(${focusCentroid[0]}px, ${focusCentroid[1] - pinR}px)`,
          }}
        >
          <path
            d={`M0 ${pinR} C ${pinR * 0.95} ${pinR * 0.4} ${pinR * 0.95} ${-pinR * 0.6} 0 ${-pinR} C ${-pinR * 0.95} ${-pinR * 0.6} ${-pinR * 0.95} ${pinR * 0.4} 0 ${pinR} Z`}
            fill={COL.pin}
            stroke="white"
            strokeWidth={1.5 * scale}
          />
          <circle cx={0} cy={-pinR * 0.25} r={pinR * 0.32} fill={COL.pinDot} />
        </g>
      )}

      {focusCentroid && focusName && (
        <text
          x={focusCentroid[0]}
          y={focusCentroid[1] + 32 * scale}
          textAnchor="middle"
          fill={COL.label}
          stroke={COL.labelHalo}
          strokeWidth={3.5 * scale}
          paintOrder="stroke"
          style={{
            fontFamily:
              "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
            fontWeight: 700,
            fontSize: labelSize,
          }}
        >
          {focusName}
        </text>
      )}
    </svg>
  );
}
