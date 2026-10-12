import type { CSSProperties } from 'react';
import imgConfetti from './assets/birthday-background/obj_confetti.png';
import imgGift from './assets/birthday-background/obj_gift.png';
import imgHat from './assets/birthday-background/obj_hat.png';
import imgExtra from './assets/birthday-background/obj_extra.png';

export interface BirthdayBackgroundProps {
  /** Rendered width. Defaults to the intrinsic 375px. Height scales with the 375×416 aspect ratio. */
  width?: number | string;
  /** Rendered height. Defaults to the intrinsic 416px. */
  height?: number | string;
  className?: string;
  style?: CSSProperties;
  /** Accessible label; when omitted the SVG is treated as decorative (aria-hidden). */
  title?: string;
}

// Birthday occasion background — 375×416, sourced 1:1 from Figma
// (Gifting Registry / node 1547:586025). Built as a single self-contained
// inline SVG so it stays crisp at any size and can be reused across screens.
// Geometry (centres, unrotated sizes, rotations, blends, blurs) is transcribed
// exactly from the Figma node; the 3D objects are the original raster fills.
export function BirthdayBackground({
  width,
  height,
  className,
  style,
  title,
}: BirthdayBackgroundProps) {
  const decorative = !title;
  return (
    <svg
      width={width ?? 375}
      height={height ?? 416}
      viewBox="0 0 375 416"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      className={className}
      style={{ display: 'block', ...style }}
      role={decorative ? undefined : 'img'}
      aria-hidden={decorative ? true : undefined}
      aria-label={title}
    >
      {title ? <title>{title}</title> : null}
      <defs>
        <radialGradient
          id="bgb-bg"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(187.5) rotate(90) scale(524.548 653.712)"
        >
          <stop offset="0.134615" stopColor="#EFB1E8" />
          <stop offset="0.711761" stopColor="#BF57E6" />
          <stop offset="1" stopColor="#6624F5" />
        </radialGradient>

        <filter id="bgb-blur2" x="-60%" y="-60%" width="220%" height="220%" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="2" />
        </filter>
        <filter id="bgb-blur3_5" x="-60%" y="-60%" width="220%" height="220%" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="3.5" />
        </filter>
        <filter id="bgb-blur4" x="-60%" y="-60%" width="220%" height="220%" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="4" />
        </filter>
        <filter id="bgb-blur6" x="-60%" y="-60%" width="220%" height="220%" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <filter id="bgb-streamer-blur" x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="1.5" />
        </filter>
        <filter id="bgb-spark-big-blur" x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="1.44396" />
        </filter>
        <filter id="bgb-spark-small-blur" x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="1" />
        </filter>
      </defs>

      {/* Base radial gradient */}
      <rect width="375" height="416" fill="url(#bgb-bg)" />

      {/* Soft-light glow ellipse */}
      <ellipse
        cx="187.5273"
        cy="145.1670"
        rx="386.5"
        ry="387"
        fill="#3DA3FF"
        style={{ mixBlendMode: 'soft-light' }}
      />

      {/* Confetti bit (right, behind gift) */}
      <g transform="translate(324.0478,158.1656) rotate(73.41)" filter="url(#bgb-blur2)">
        <image href={imgConfetti} x="-7.1097" y="-6.6832" width="14.6423" height="13.4221" preserveAspectRatio="none" />
      </g>

      {/* 3D gift box (left) */}
      <g transform="translate(31.4137,160.8602) rotate(7.33)" filter="url(#bgb-blur6)">
        <image href={imgGift} x="-36.0974" y="-37.3635" width="71.9039" height="75.0230" preserveAspectRatio="none" />
      </g>

      {/* Confetti streamer swirl (top) */}
      <g transform="translate(119.7788,15.9663) rotate(27.14) translate(-32.17945,-20.16475)" style={{ mixBlendMode: 'normal' }} filter="url(#bgb-streamer-blur)">
        <path d="M29.1003 5.24053C36.7806 6.60881 33.2123 34.1328 51.1664 37.3295L39.0239 35.1675C22.0053 32.1388 25.1572 4.53934 16.9577 3.07854L29.1003 5.24053Z" fill="#F7B04D" />
        <path d="M29.1003 5.24046C18.4542 3.68957 8.09458 23.1523 17.9178 28.6693L6.60554 26.6558C-3.12709 19.4419 9.07176 1.6761 16.9578 3.07847L29.1003 5.24046Z" fill="#FDE5BC" />
        <path d="M59.7136 10.6915C63.517 21.0973 60.7496 37.0493 51.1663 37.3293L39.0238 35.1673C49.8585 35.6591 51.8472 16.8951 48.5042 8.69508L59.7112 10.6915H59.7136Z" fill="#FDE5BC" />
      </g>

      {/* Sparkle (small, top-right) */}
      <g transform="translate(297.2666,65.4589) translate(-6.04485,-6.04485)" style={{ mixBlendMode: 'screen' }} filter="url(#bgb-spark-small-blur)">
        <path d="M10.0897 6.04484C6.4449 6.26708 6.26711 6.44488 6.04486 10.0897C5.82262 6.44488 5.64482 6.26708 2 6.04484C5.64482 5.82259 5.82262 5.6448 6.04486 2C6.26711 5.6448 6.4449 5.82259 10.0897 6.04484Z" fill="#FBFBFC" />
      </g>

      {/* Sparkle (large, top-right) */}
      <g transform="translate(271.3485,74.4602) rotate(2.1) translate(-14.16955,-14.1695)" style={{ mixBlendMode: 'screen' }} filter="url(#bgb-spark-big-blur)">
        <path d="M25.4512 14.1695C15.2853 14.7894 14.7894 15.2852 14.1696 25.4511C13.5497 15.2852 13.0538 14.7894 2.88792 14.1695C13.0538 13.5496 13.5497 13.0537 14.1696 2.88792C14.7894 13.0537 15.2853 13.5496 25.4512 14.1695Z" fill="#FBFBFC" />
      </g>

      {/* 3D party hat (right) */}
      <g transform="translate(375.8041,205.5107)" filter="url(#bgb-blur4)">
        <image href={imgHat} x="-46.1020" y="-62.1857" width="92.0262" height="124.3214" preserveAspectRatio="none" />
      </g>

      {/* Confetti bit (left, near gift) */}
      <g transform="translate(92.5587,100.0130) rotate(146) scale(-1,1)">
        <image href={imgConfetti} x="-7.1097" y="-6.6832" width="14.6423" height="13.4221" preserveAspectRatio="none" />
      </g>

      {/* Confetti bit (left-mid) */}
      <g transform="translate(78.7660,173.4269) rotate(-58.5) scale(-1,1)" filter="url(#bgb-blur2)">
        <image href={imgConfetti} x="-5.1767" y="-4.8662" width="10.6614" height="9.7730" preserveAspectRatio="none" />
      </g>

      {/* Confetti bit (far left) */}
      <g transform="translate(8.2067,218.5235) rotate(-58.5) scale(-1,1)" filter="url(#bgb-blur3_5)">
        <image href={imgConfetti} x="-5.1767" y="-4.8662" width="10.6614" height="9.7730" preserveAspectRatio="none" />
      </g>

      {/* 3D ornament (off right edge) */}
      <g transform="translate(429.6654,118.8044) rotate(71.2)" filter="url(#bgb-blur3_5)">
        <image href={imgExtra} x="-27.1041" y="-25.8552" width="54.0667" height="52.2045" preserveAspectRatio="none" />
      </g>
    </svg>
  );
}
