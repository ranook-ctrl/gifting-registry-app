/**
 * Tailwind config scoped to the Wishlist page (./wishlist) only — the rest of
 * the repo styles with inline Field DS tokens (see src/components/CONVENTIONS.md).
 * Wired up via css.postcss in vite.wishlist.config.ts, so no root postcss.config
 * is needed and other pages' CSS is untouched.
 *
 * Ported from the noon-wishlist repo; class names map to the same Field DS
 * variables declared in wishlist/wishlist.css.
 */
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./wishlist/index.html", "./wishlist/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Field DS — Surface
        "surface-primary": "var(--colour-surface-primary)",
        "surface-secondary": "var(--colour-surface-secondary)",
        "surface-tertiary": "var(--colour-surface-tertiary)",
        "surface-primary-inverted": "var(--colour-surface-primary-inverted)",
        "surface-action-bold": "var(--colour-surface-action-bold)",
        "surface-action-subtle": "var(--colour-surface-action-subtle)",
        "surface-muted": "var(--colour-surface-muted)",
        "surface-overlay-subtle": "var(--colour-surface-overlay-subtle)",
        "neutral-white": "var(--neutral-white)",
        // Field DS — Text
        "text-primary": "var(--colour-text-primary)",
        "text-secondary": "var(--colour-text-secondary)",
        "text-tertiary": "var(--colour-text-tertiary)",
        "text-muted": "var(--colour-text-muted)",
        "text-action": "var(--colour-text-action)",
        "text-success": "var(--colour-text-success)",
        "text-error": "var(--colour-text-error)",
        "text-on-surface-bold": "var(--colour-text-on-surface-bold)",
        // Field DS — Border
        "border-primary": "var(--colour-border-primary)",
        "border-subtle": "var(--colour-border-subtle)",
        "border-bold": "var(--colour-border-bold)",
        "border-action": "var(--colour-border-action)",
        // Field DS — Alphas
        "alpha-dark-4": "var(--alpha-dark-4)",
        "alpha-light-16": "var(--alpha-light-16)",
        // Field DS — Accents
        "crimson-400": "var(--crimson-400)",
        "pink-600": "var(--pink-600)",
        "yellow-600": "var(--yellow-600)",
        "emerald-800": "var(--emerald-800)",
        "green-700": "var(--green-700)",
      },
      fontFamily: {
        // Field DS — Primary
        primary: ['"Noontree"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Field DS — body/b11
        b11: ["11px", { lineHeight: "14px", letterSpacing: "-0.1px" }],
        // Field DS — body/b12
        b12: ["12px", { lineHeight: "16px", letterSpacing: "-0.1px" }],
        // Field DS — body/b13
        b13: ["13px", { lineHeight: "20px", letterSpacing: "-0.1px" }],
        // Field DS — body/b14
        b14: ["14px", { lineHeight: "18px", letterSpacing: "-0.1px" }],
        // Field DS — body/b16
        b16: ["16px", { lineHeight: "20px", letterSpacing: "-0.15px" }],
        // Field DS — heading/h16
        h16: ["16px", { lineHeight: "20px", letterSpacing: "-0.15px" }],
        // Field DS — heading/h32
        h32: ["32px", { lineHeight: "40px", letterSpacing: "-0.25px" }],
        // Field DS — label3
        l3: ["14px", { lineHeight: "18px", letterSpacing: "-0.14px" }],
        // Field DS — label4
        l4: ["12px", { lineHeight: "14px", letterSpacing: "-0.12px" }],
      },
      boxShadow: {
        sheet: "0px -4px 16px 0px rgba(29, 37, 57, 0.04)",
      },
    },
  },
  plugins: [],
};
