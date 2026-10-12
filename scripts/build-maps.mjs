// Build script: emit (a) full-world GeoJSON, (b) targets metadata for 7 ME
// countries with centroids, and (c) one focused light-mode SVG per target.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { feature } from "topojson-client";
import { geoMercator, geoPath, geoBounds } from "d3-geo";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// 7 targetable countries (ISO 3166-1 numeric used by world-atlas)
const TARGETS = [
  { id: "784", code: "AE", name: "United Arab Emirates" },
  { id: "682", code: "SA", name: "Saudi Arabia" },
  { id: "048", code: "BH", name: "Bahrain" },
  { id: "512", code: "OM", name: "Oman" },
  { id: "634", code: "QA", name: "Qatar" },
  { id: "414", code: "KW", name: "Kuwait" },
  { id: "818", code: "EG", name: "Egypt" },
];

const topo = JSON.parse(readFileSync("/tmp/countries-50m.json", "utf8"));
const world = feature(topo, topo.objects.countries);

// Tag features that match a target (normalize both sides — world-atlas mixes
// "048" and "48" style ids depending on country).
const norm = (s) => String(Number(s));
const codeById = new Map(
  TARGETS.map((t) => [norm(t.id), { code: t.code, name: t.name }])
);
for (const f of world.features) {
  const t = codeById.get(norm(f.id));
  f.properties = f.properties || {};
  if (t) {
    f.properties.code = t.code;
    f.properties.name = t.name;
    f.properties.target = true;
  }
}

mkdirSync(resolve(ROOT, "src/data"), { recursive: true });
writeFileSync(
  resolve(ROOT, "src/data/world.ts"),
  `// Auto-generated — full world (low-res) + 7 ME targets tagged.
import type { FeatureCollection, Geometry } from "geojson";

export type WorldProps = { code?: string; name?: string; target?: boolean };

export const world: FeatureCollection<Geometry, WorldProps> = ${JSON.stringify(
    world
  )} as unknown as FeatureCollection<Geometry, WorldProps>;

export const TARGETS = ${JSON.stringify(
    TARGETS.map((t) => ({ code: t.code, name: t.name }))
  )} as const;
`
);

// ---- SVG export (light mode) ----
const W = 1200;
const H = 800;
const PAD = 60;

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

// Expand a feature's geographic bbox to provide map context around small
// countries. Returns a synthetic GeoJSON Polygon covering the expanded bbox.
function expandedBBoxFeature(f, ratio = 1.6, minSpanDeg = 8) {
  const [[lng0, lat0], [lng1, lat1]] = geoBounds(f);
  const w = lng1 - lng0;
  const h = lat1 - lat0;
  const padX = Math.max(w * ratio, minSpanDeg);
  const padY = Math.max(h * ratio, minSpanDeg);
  const x0 = Math.max(-179.9, lng0 - padX);
  const x1 = Math.min(179.9, lng1 + padX);
  const y0 = Math.max(-85, lat0 - padY);
  const y1 = Math.min(85, lat1 + padY);
  // Clockwise in lon/lat ⇒ correct interior orientation on the sphere.
  return {
    type: "Feature",
    properties: {},
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [x0, y0],
          [x0, y1],
          [x1, y1],
          [x1, y0],
          [x0, y0],
        ],
      ],
    },
  };
}

function renderSVG({ focus, focusCode, focusName, focusFeature }) {
  const projection = geoMercator();
  // Fit to focus bbox + padding
  const fitTarget = focusFeature ? expandedBBoxFeature(focusFeature) : focus;
  projection.fitExtent(
    [
      [PAD, PAD],
      [W - PAD, H - PAD],
    ],
    fitTarget
  );
  const path = geoPath(projection);

  // Ocean (sphere fills the entire mapped area)
  const sphere = path({ type: "Sphere" }) || "";

  // Render every country path
  const countryPaths = world.features
    .map((f) => {
      const d = path(f);
      if (!d) return "";
      const isFocus = f.properties?.code === focusCode;
      const fill = isFocus ? COL.landFocus : COL.land;
      const stroke = isFocus ? COL.borderFocus : COL.border;
      const sw = isFocus ? 2.2 : 0.6;
      return `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round" />`;
    })
    .join("\n      ");

  // Pin at centroid of focus
  let pin = "";
  let label = "";
  if (focusFeature) {
    const [cx, cy] = path.centroid(focusFeature);
    if (Number.isFinite(cx) && Number.isFinite(cy)) {
      const r = 22;
      pin = `
    <g transform="translate(${cx} ${cy - r})">
      <path d="M0 ${r} C ${r * 0.95} ${r * 0.4} ${r * 0.95} ${-r * 0.6} 0 ${-r} C ${-r * 0.95} ${-r * 0.6} ${-r * 0.95} ${r * 0.4} 0 ${r} Z"
            fill="${COL.pin}" stroke="white" stroke-width="2" />
      <circle cx="0" cy="${-r * 0.25}" r="${r * 0.32}" fill="${COL.pinDot}" />
    </g>`;
      label = `
    <text x="${cx}" y="${cy + 56}" text-anchor="middle"
          fill="${COL.label}" stroke="${COL.labelHalo}" stroke-width="4" paint-order="stroke"
          font-family="Inter, system-ui, -apple-system, sans-serif"
          font-size="32" font-weight="700">${focusName}</text>`;
    }
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <rect x="0" y="0" width="${W}" height="${H}" fill="${COL.ocean}" />
  <path d="${sphere}" fill="${COL.ocean}" />
  <g>
      ${countryPaths}
  </g>
  ${pin}
  ${label}
</svg>
`;
}

mkdirSync(resolve(ROOT, "exports"), { recursive: true });
for (const t of TARGETS) {
  const focusFeature = world.features.find((f) => f.properties?.code === t.code);
  const svg = renderSVG({
    focus: focusFeature,
    focusCode: t.code,
    focusName: t.name,
    focusFeature,
  });
  const filename = `country-${t.code.toLowerCase()}-${t.name
    .toLowerCase()
    .replace(/\s+/g, "-")}.svg`;
  writeFileSync(resolve(ROOT, "exports", filename), svg);
  console.log(`wrote exports/${filename}`);
}

// Overview: fit to all 7 targets together
const overviewFC = {
  type: "FeatureCollection",
  features: world.features.filter((f) => f.properties?.target),
};
const overviewSVG = renderSVG({
  focus: overviewFC,
  focusCode: null,
  focusName: null,
  focusFeature: null,
});
writeFileSync(resolve(ROOT, "exports", "country-_overview.svg"), overviewSVG);
console.log("wrote exports/country-_overview.svg");
