import type { CSSProperties } from 'react';
import imgConfetti from '../assets/birthday-background/obj_confetti.png';
import imgGift from '../assets/birthday-background/obj_gift.png';
import imgHat from '../assets/birthday-background/obj_hat.png';
import imgExtra from '../assets/birthday-background/obj_extra.png';

/** Art viewBox. Kept in sync with the hero band's height — `slice` crops any
 *  mismatch, and cropping is what pushes the props out of frame. */
export const HERO_ART_W = 1440;
export const HERO_ART_H = 300;

export interface RegistryHeroArtProps {
  className?: string;
  style?: CSSProperties;
}

/**
 * Wide (landscape) birthday backdrop for the dWeb registry hero.
 *
 * The mobile hero art (../BirthdayBackground.tsx) is a 375×416 portrait
 * composition — cropping it to a desktop band loses exactly the two props that
 * give it character, the gift box on the left and the party hat on the right. So
 * this is a re-composition, not a crop: same radial gradient stops, same
 * soft-light glow and the same 3D object fills, re-laid across a 1440×300
 * viewBox with the heavy props anchored to the outer edges and the centre left
 * clear for the occasion title.
 *
 * `preserveAspectRatio="xMidYMid slice"` so it fills (never letterboxes) any band
 * width. The props sit in from the edges and their vertical centres stay near the
 * middle of the viewBox, so they survive the crop that slicing implies when the
 * band is narrower or shorter than 1440×300.
 */
export function RegistryHeroArt({ className, style }: RegistryHeroArtProps) {
  return (
    <svg
      viewBox={`0 0 ${HERO_ART_W} ${HERO_ART_H}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden
      style={{ display: 'block', width: '100%', height: '100%', ...style }}
    >
      <defs>
        {/* Same three stops as the mobile art, projected across a wide band. */}
        <radialGradient
          id="rha-bg"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(720) rotate(90) scale(470 1180)"
        >
          <stop offset="0.134615" stopColor="#EFB1E8" />
          <stop offset="0.711761" stopColor="#BF57E6" />
          <stop offset="1" stopColor="#6624F5" />
        </radialGradient>

        {/* Blur is a fraction of each object's size, matching the mobile art's
            ratios (gift ≈ 2%, hat ≈ 1.5%) — absolute values scaled up with the
            objects would smear them into the gradient. */}
        <filter id="rha-blur-gift" x="-40%" y="-40%" width="180%" height="180%" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="4" />
        </filter>
        <filter id="rha-blur-hat" x="-40%" y="-40%" width="180%" height="180%" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="3" />
        </filter>
        <filter id="rha-blur-sm" x="-40%" y="-40%" width="180%" height="180%" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="2.5" />
        </filter>
        <filter id="rha-blur-xs" x="-40%" y="-40%" width="180%" height="180%" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="1.6" />
        </filter>
        <filter id="rha-spark-lg" x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="2.2" />
        </filter>
        <filter id="rha-spark-sm" x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="1.4" />
        </filter>
        <filter id="rha-streamer" x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="1.8" />
        </filter>
      </defs>

      <rect width={HERO_ART_W} height={HERO_ART_H} fill="url(#rha-bg)" />

      {/* Soft-light glow — widened to the band's aspect. */}
      <ellipse cx="720" cy="96" rx="1180" ry="360" fill="#3DA3FF" style={{ mixBlendMode: 'soft-light' }} />

      {/* --- Left cluster: the 3D gift box --- */}
      <g transform="translate(138,196) rotate(7.33)" filter="url(#rha-blur-gift)">
        <image href={imgGift} x="-102" y="-106" width="204" height="212" preserveAspectRatio="none" />
      </g>
      <g transform="translate(292,74) rotate(146) scale(-1,1)" filter="url(#rha-blur-xs)">
        <image href={imgConfetti} x="-18" y="-17" width="36" height="33" preserveAspectRatio="none" />
      </g>
      <g transform="translate(306,246) rotate(-58.5) scale(-1,1)" filter="url(#rha-blur-sm)">
        <image href={imgConfetti} x="-13" y="-12" width="26" height="24" preserveAspectRatio="none" />
      </g>
      <g transform="translate(34,268) rotate(-58.5) scale(-1,1)" filter="url(#rha-blur-sm)">
        <image href={imgConfetti} x="-13" y="-12" width="26" height="24" preserveAspectRatio="none" />
      </g>

      {/* Confetti streamer swirl, upper left — scaled 2× from the mobile art. */}
      <g
        transform="translate(418,44) rotate(27.14) scale(2) translate(-32.17945,-20.16475)"
        filter="url(#rha-streamer)"
      >
        <path
          d="M29.1003 5.24053C36.7806 6.60881 33.2123 34.1328 51.1664 37.3295L39.0239 35.1675C22.0053 32.1388 25.1572 4.53934 16.9577 3.07854L29.1003 5.24053Z"
          fill="#F7B04D"
        />
        <path
          d="M29.1003 5.24046C18.4542 3.68957 8.09458 23.1523 17.9178 28.6693L6.60554 26.6558C-3.12709 19.4419 9.07176 1.6761 16.9578 3.07847L29.1003 5.24046Z"
          fill="#FDE5BC"
        />
        <path
          d="M59.7136 10.6915C63.517 21.0973 60.7496 37.0493 51.1663 37.3293L39.0238 35.1673C49.8585 35.6591 51.8472 16.8951 48.5042 8.69508L59.7112 10.6915H59.7136Z"
          fill="#FDE5BC"
        />
      </g>

      {/* --- Right cluster: the 3D party hat --- */}
      <g transform="translate(1318,182)" filter="url(#rha-blur-hat)">
        <image href={imgHat} x="-97" y="-131" width="194" height="262" preserveAspectRatio="none" />
      </g>
      <g transform="translate(1124,80) rotate(73.41)" filter="url(#rha-blur-xs)">
        <image href={imgConfetti} x="-18" y="-17" width="36" height="33" preserveAspectRatio="none" />
      </g>
      {/* Ornament, tucked against the right edge. */}
      <g transform="translate(1420,62) rotate(71.2)" filter="url(#rha-blur-sm)">
        <image href={imgExtra} x="-62" y="-60" width="124" height="120" preserveAspectRatio="none" />
      </g>

      {/* Sparkles */}
      <g transform="translate(1006,62) scale(2.4) translate(-6.04485,-6.04485)" style={{ mixBlendMode: 'screen' }} filter="url(#rha-spark-sm)">
        <path
          d="M10.0897 6.04484C6.4449 6.26708 6.26711 6.44488 6.04486 10.0897C5.82262 6.44488 5.64482 6.26708 2 6.04484C5.64482 5.82259 5.82262 5.6448 6.04486 2C6.26711 5.6448 6.4449 5.82259 10.0897 6.04484Z"
          fill="#FBFBFC"
        />
      </g>
      <g transform="translate(944,100) rotate(2.1) scale(2.1) translate(-14.16955,-14.1695)" style={{ mixBlendMode: 'screen' }} filter="url(#rha-spark-lg)">
        <path
          d="M25.4512 14.1695C15.2853 14.7894 14.7894 15.2852 14.1696 25.4511C13.5497 15.2852 13.0538 14.7894 2.88792 14.1695C13.0538 13.5496 13.5497 13.0537 14.1696 2.88792C14.7894 13.0537 15.2853 13.5496 25.4512 14.1695Z"
          fill="#FBFBFC"
        />
      </g>
      <g transform="translate(556,104) scale(1.7) translate(-6.04485,-6.04485)" style={{ mixBlendMode: 'screen' }} filter="url(#rha-spark-sm)">
        <path
          d="M10.0897 6.04484C6.4449 6.26708 6.26711 6.44488 6.04486 10.0897C5.82262 6.44488 5.64482 6.26708 2 6.04484C5.64482 5.82259 5.82262 5.6448 6.04486 2C6.26711 5.6448 6.4449 5.82259 10.0897 6.04484Z"
          fill="#FBFBFC"
        />
      </g>
    </svg>
  );
}
