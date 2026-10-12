import { useEffect, useMemo, useRef, useState } from "react";
import { geoMercator, geoPath } from "d3-geo";
import type { Feature, Geometry } from "geojson";
import { countries, type CountryProps } from "../src/data/countries";

type Props = {
  selectedCode: string | null;
  width?: number;
  height?: number;
  onSelect?: (code: string) => void;
};

const PAD = 60;

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
  const { paths, bboxByCode, allBBox } = useMemo(() => {
    const projection = geoMercator().fitExtent(
      [
        [PAD, PAD],
        [width - PAD, height - PAD],
      ],
      countries
    );
    const path = geoPath(projection);
    const paths: Record<string, string> = {};
    const bboxByCode: Record<string, [number, number, number, number]> = {};

    for (const f of countries.features as Feature<Geometry, CountryProps>[]) {
      paths[f.properties.code] = path(f) || "";
      const b = path.bounds(f);
      const x = b[0][0],
        y = b[0][1],
        w = b[1][0] - b[0][0],
        h = b[1][1] - b[0][1];
      const px = Math.max(w * 0.4, 40);
      const py = Math.max(h * 0.4, 40);
      bboxByCode[f.properties.code] = [x - px, y - py, w + px * 2, h + py * 2];
    }
    const allBBox: [number, number, number, number] = [0, 0, width, height];
    return { paths, bboxByCode, allBBox };
  }, [width, height]);

  const target =
    selectedCode && bboxByCode[selectedCode]
      ? bboxByCode[selectedCode]
      : allBBox;
  const vb = useViewBox(target);

  const grid = useMemo(() => {
    const step = 40;
    const lines: JSX.Element[] = [];
    for (let x = 0; x <= width; x += step)
      lines.push(
        <line
          key={`vx${x}`}
          x1={x}
          y1={0}
          x2={x}
          y2={height}
          stroke="#222"
          strokeWidth={0.5}
          opacity={0.35}
        />
      );
    for (let y = 0; y <= height; y += step)
      lines.push(
        <line
          key={`hy${y}`}
          x1={0}
          y1={y}
          x2={width}
          y2={y}
          stroke="#222"
          strokeWidth={0.5}
          opacity={0.35}
        />
      );
    return lines;
  }, [width, height]);

  return (
    <svg
      viewBox={vb.join(" ")}
      width={width}
      height={height}
      style={{ background: "#0A0A0A", display: "block", borderRadius: 16 }}
      preserveAspectRatio="xMidYMid meet"
    >
      <g aria-hidden>{grid}</g>
      <g>
        {(countries.features as Feature<Geometry, CountryProps>[]).map((f) => {
          const code = f.properties.code;
          const isFocus = code === selectedCode;
          return (
            <path
              key={code}
              d={paths[code]}
              fill={isFocus ? "#FEEE95" : "#1B1B1B"}
              stroke={isFocus ? "#111111" : "#2A2A2A"}
              strokeWidth={isFocus ? 2 : 0.75}
              strokeLinejoin="round"
              style={{
                transition: "fill 400ms ease, stroke 400ms ease",
                cursor: onSelect ? "pointer" : "default",
              }}
              onClick={() => onSelect?.(code)}
            >
              <title>{f.properties.name}</title>
            </path>
          );
        })}
      </g>
    </svg>
  );
}
