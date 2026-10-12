import React from 'react';

// Exact bow/ribbon vector exported from Figma (stroke #FFDBB4).
const RIBBON = `<svg viewBox="0 0 65 65" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.809372 0.809187L64.1907 64.1905" stroke="#FFDBB4" stroke-width="2.28878"/><path d="M50.1195 32.72C45.9014 32.4742 40.6357 35.7486 38.53 37.4165C40.5342 39.4206 44.1785 43.065 49.2834 43.4032C53.0346 43.6517 55.8144 41.5925 56.3365 38.9369C56.8585 36.2813 55.5608 33.0371 50.1195 32.72Z" stroke="#FFDBB4" stroke-width="2.26863"/><path d="M43.2265 25.827C43.4723 30.0451 40.198 35.3109 38.53 37.4165C36.5259 35.4123 32.8816 31.768 32.5434 26.6631C32.2949 22.9119 34.354 20.1322 37.0096 19.6101C39.6652 19.088 42.9094 20.3857 43.2265 25.827Z" stroke="#FFDBB4" stroke-width="2.26863"/><path d="M39.0695 37.006C35.7891 38.3684 27.7275 40.004 21.7252 35.6477" stroke="#FFDBB4" stroke-width="2.28878" stroke-linecap="round"/><path d="M39.0691 37.0053C37.7068 40.2858 36.0711 48.3473 40.4274 54.3497" stroke="#FFDBB4" stroke-width="2.28878" stroke-linecap="round"/></svg>`;

/** "Floating Cart/Ribbon" — a 64×64 decorative gift-ribbon graphic (peach stroke). */
export function FloatingCartRibbon({ size = 64 }: { size?: number }) {
  const svg = RIBBON.replace('<svg ', `<svg width="${size}" height="${size}" `);
  return (
    <span
      aria-hidden
      style={{ display: 'inline-flex', width: size, height: size, overflow: 'hidden', lineHeight: 0 }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
