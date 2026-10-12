// Inline SVG icon set for the dWeb registry.
//
// The mobile components import rasterised Figma exports (see ../assets/); at
// desktop sizes those get soft, and the chrome icons (search, cart, heart…)
// don't exist in that set at all. These are hand-drawn at a 1.6 stroke to match
// the app's icon weight, and take `size`/`color` so one glyph serves the yellow
// masthead, the product tiles and the drawer.

export interface IconProps {
  size?: number;
  color?: string;
  /** Fill instead of stroke — used for the "saved" heart and rating star. */
  filled?: boolean;
}

const S = 1.6;

function Svg({ size = 24, children }: { size?: number; children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      style={{ display: 'block', flexShrink: 0 }}
    >
      {children}
    </svg>
  );
}

export function SearchIcon({ size = 20, color = '#404553' }: IconProps) {
  return (
    <Svg size={size}>
      <circle cx="10.5" cy="10.5" r="6.5" stroke={color} strokeWidth={S} />
      <path d="M15.5 15.5 20 20" stroke={color} strokeWidth={S} strokeLinecap="round" />
    </Svg>
  );
}

export function PinIcon({ size = 20, color = '#101628' }: IconProps) {
  return (
    <Svg size={size}>
      <path
        d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z"
        stroke={color}
        strokeWidth={S}
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.6" stroke={color} strokeWidth={S} />
    </Svg>
  );
}

export function ChevronIcon({
  size = 20,
  color = '#404553',
  dir = 'down',
}: IconProps & { dir?: 'up' | 'down' | 'left' | 'right' }) {
  const rotate = { down: 0, up: 180, left: 90, right: -90 }[dir];
  return (
    <span style={{ display: 'flex', transform: `rotate(${rotate}deg)` }}>
      <Svg size={size}>
        <path d="m7 10 5 5 5-5" stroke={color} strokeWidth={S} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    </span>
  );
}

export function UserIcon({ size = 22, color = '#101628' }: IconProps) {
  return (
    <Svg size={size}>
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth={S} />
      <circle cx="12" cy="10" r="2.8" stroke={color} strokeWidth={S} />
      <path d="M6.5 19.2a6 6 0 0 1 11 0" stroke={color} strokeWidth={S} strokeLinecap="round" />
    </Svg>
  );
}

export function OrdersIcon({ size = 22, color = '#101628' }: IconProps) {
  return (
    <Svg size={size}>
      <path
        d="M5 8h14l-1 12H6L5 8Z"
        stroke={color}
        strokeWidth={S}
        strokeLinejoin="round"
      />
      <path d="M9 8V6.5a3 3 0 0 1 6 0V8" stroke={color} strokeWidth={S} strokeLinecap="round" />
    </Svg>
  );
}

export function HeartIcon({ size = 22, color = '#101628', filled }: IconProps) {
  const d =
    'M12 20s-7.5-4.7-7.5-9.6A4.4 4.4 0 0 1 12 7.6a4.4 4.4 0 0 1 7.5 2.8C19.5 15.3 12 20 12 20Z';
  return (
    <Svg size={size}>
      <path d={d} stroke={color} strokeWidth={S} strokeLinejoin="round" fill={filled ? color : 'none'} />
    </Svg>
  );
}

export function CartIcon({ size = 22, color = '#101628' }: IconProps) {
  return (
    <Svg size={size}>
      <path d="M3 5h2.2l2.3 10.4h10l2.2-7.4H6.4" stroke={color} strokeWidth={S} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9.5" cy="19" r="1.5" stroke={color} strokeWidth={S} />
      <circle cx="16.5" cy="19" r="1.5" stroke={color} strokeWidth={S} />
    </Svg>
  );
}

export function LangIcon({ size = 22, color = '#101628' }: IconProps) {
  return (
    <Svg size={size}>
      <path d="M3 6h8M7 6v1.5c0 3-1.6 5.6-4 7" stroke={color} strokeWidth={S} strokeLinecap="round" />
      <path d="M4 10.5c1.6 2.4 3.8 3.6 6 4" stroke={color} strokeWidth={S} strokeLinecap="round" />
      <path d="m12.5 20 4-11 4 11M14 16.5h5" stroke={color} strokeWidth={S} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function GiftIcon({ size = 22, color = '#101628' }: IconProps) {
  return (
    <Svg size={size}>
      <path d="M20 12v8.5a.5.5 0 0 1-.5.5h-15a.5.5 0 0 1-.5-.5V12" stroke={color} strokeWidth={S} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 7.5H3v4h18v-4Z" stroke={color} strokeWidth={S} strokeLinejoin="round" />
      <path d="M12 7.5V21" stroke={color} strokeWidth={S} strokeLinecap="round" />
      <path
        d="M12 7.5S10.6 3 8.2 3C6.8 3 6 3.9 6 5c0 1.4 1.3 2.5 3 2.5h3Zm0 0S13.4 3 15.8 3C17.2 3 18 3.9 18 5c0 1.4-1.3 2.5-3 2.5h-3Z"
        stroke={color}
        strokeWidth={S}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function BagIcon({ size = 18, color = '#0f61ff' }: IconProps) {
  return (
    <Svg size={size}>
      <path d="M5.5 8h13l-1 11.5h-11L5.5 8Z" stroke={color} strokeWidth={S} strokeLinejoin="round" />
      <path d="M9.2 8V6.6a2.8 2.8 0 0 1 5.6 0V8" stroke={color} strokeWidth={S} strokeLinecap="round" />
    </Svg>
  );
}

export function CalendarIcon({ size = 18, color = '#1d2539' }: IconProps) {
  return (
    <Svg size={size}>
      <rect x="3.75" y="5.75" width="16.5" height="14.5" rx="2.5" stroke={color} strokeWidth={S} />
      <path d="M3.75 10h16.5M8.5 3.5V7M15.5 3.5V7" stroke={color} strokeWidth={S} strokeLinecap="round" />
    </Svg>
  );
}

export function StarIcon({ size = 14, color = '#0b623f' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" aria-hidden style={{ display: 'block', flexShrink: 0 }}>
      <path
        d="M7 1.2l1.76 3.57 3.94.57-2.85 2.78.67 3.92L7 10.2l-3.52 1.84.67-3.92L1.3 5.34l3.94-.57L7 1.2Z"
        fill={color}
      />
    </svg>
  );
}

export function CheckIcon({ size = 18, color = '#0f8857' }: IconProps) {
  return (
    <Svg size={size}>
      <path d="m5 12.5 4.2 4.2L19 7" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function VerifiedIcon({ size = 18, color = '#0f8857' }: IconProps) {
  return (
    <Svg size={size}>
      <circle cx="12" cy="12" r="9" fill={color} />
      <path d="m8 12.2 2.6 2.6L16 9.4" stroke="#fff" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function CloseIcon({ size = 20, color = '#1d2539' }: IconProps) {
  return (
    <Svg size={size}>
      <path d="M6 6l12 12M18 6 6 18" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

export function PlusIcon({ size = 18, color = '#0f61ff' }: IconProps) {
  return (
    <Svg size={size}>
      <path d="M12 5.5v13M5.5 12h13" stroke={color} strokeWidth={1.9} strokeLinecap="round" />
    </Svg>
  );
}

export function MinusIcon({ size = 18, color = '#0f61ff' }: IconProps) {
  return (
    <Svg size={size}>
      <path d="M5.5 12h13" stroke={color} strokeWidth={1.9} strokeLinecap="round" />
    </Svg>
  );
}

export function TrashIcon({ size = 18, color = '#0f61ff' }: IconProps) {
  return (
    <Svg size={size}>
      <path d="M4.5 7h15M9.5 7V5.2a1.2 1.2 0 0 1 1.2-1.2h2.6a1.2 1.2 0 0 1 1.2 1.2V7" stroke={color} strokeWidth={S} strokeLinecap="round" />
      <path d="M6.5 7l.9 12.1a1.2 1.2 0 0 0 1.2 1.1h6.8a1.2 1.2 0 0 0 1.2-1.1L17.5 7" stroke={color} strokeWidth={S} strokeLinejoin="round" />
      <path d="M10.5 10.5v6.5M13.5 10.5v6.5" stroke={color} strokeWidth={S} strokeLinecap="round" />
    </Svg>
  );
}

export function ShareIcon({ size = 18, color = '#1d2539' }: IconProps) {
  return (
    <Svg size={size}>
      <path d="M12 3.5v11" stroke={color} strokeWidth={S} strokeLinecap="round" />
      <path d="m8 7.2 4-3.7 4 3.7" stroke={color} strokeWidth={S} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 12.5H4.8a.8.8 0 0 0-.8.8v6.4a.8.8 0 0 0 .8.8h14.4a.8.8 0 0 0 .8-.8v-6.4a.8.8 0 0 0-.8-.8H18" stroke={color} strokeWidth={S} strokeLinecap="round" />
    </Svg>
  );
}

export function LinkIcon({ size = 18, color = '#1d2539' }: IconProps) {
  return (
    <Svg size={size}>
      <path d="M10 14a3.4 3.4 0 0 1 0-4.8l2.6-2.6a3.4 3.4 0 0 1 4.8 4.8L16 12.8" stroke={color} strokeWidth={S} strokeLinecap="round" />
      <path d="M14 10a3.4 3.4 0 0 1 0 4.8l-2.6 2.6a3.4 3.4 0 0 1-4.8-4.8L8 11.2" stroke={color} strokeWidth={S} strokeLinecap="round" />
    </Svg>
  );
}

export function TruckIcon({ size = 20, color = '#1d2539' }: IconProps) {
  return (
    <Svg size={size}>
      <path d="M3 6.5h9.5v9H3z" stroke={color} strokeWidth={S} strokeLinejoin="round" />
      <path d="M12.5 9.5h3.8L19.5 13v2.5h-7z" stroke={color} strokeWidth={S} strokeLinejoin="round" />
      <circle cx="7" cy="17.5" r="1.7" stroke={color} strokeWidth={S} />
      <circle cx="16" cy="17.5" r="1.7" stroke={color} strokeWidth={S} />
    </Svg>
  );
}

export function ShieldIcon({ size = 20, color = '#0f61ff' }: IconProps) {
  return (
    <Svg size={size}>
      <path d="M12 3.5l7 2.4v5.6c0 4-2.9 7.3-7 8.9-4.1-1.6-7-4.9-7-8.9V5.9l7-2.4Z" stroke={color} strokeWidth={S} strokeLinejoin="round" />
      <path d="m9 12.2 2.2 2.2L15.4 10" stroke={color} strokeWidth={S} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function HomeIcon({ size = 20, color = '#1d2539' }: IconProps) {
  return (
    <Svg size={size}>
      <path d="M4 10.6 12 4l8 6.6" stroke={color} strokeWidth={S} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 11.5v8a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5v-8" stroke={color} strokeWidth={S} strokeLinejoin="round" />
    </Svg>
  );
}
