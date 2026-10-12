# Gifting Registry — component conventions

Read this first if you're building a component in this folder. Following it is what
lets components built in **separate sessions** compose cleanly into screens later.

## The contract (5 rules)

1. **One component per file.** `PascalCase.tsx` (e.g. `RegistryCard.tsx`). Co-locate
   nothing else — no screens, no data fetching.

2. **Style only from Field DS tokens.** Import from the reference module and use its
   values for every colour / space / radius / type decision. No raw hex, no magic px.
   ```ts
   import { colour, space, radius, typography } from '../field-ds';
   ```
   The token source of truth is [`src/field-ds/tokens.ts`](../field-ds/tokens.ts).
   (Field DS is React Native and not installable here — we render web equivalents with
   inline styles built from these token objects. See [`CATALOG.md`](../field-ds/CATALOG.md).)

3. **Props in, callbacks out. No global state.** A component takes everything it needs
   as props and reports events via `on*` callbacks. It must not assume which screen
   renders it, read from a store, or fetch data. This is what makes it drop-in reusable.

4. **Export a typed props interface** named `<Component>Props`, and register the
   component in [`index.ts`](./index.ts) so screens import from one place:
   ```ts
   import { GiftStatusBadge } from '../components';
   ```

5. **RTL / Arabic aware.** noon serves the Middle East. Use logical layout (flex,
   `marginInlineStart` over `marginLeft`) and don't hardcode left/right. Eid/Ramadan is
   the flagship occasion — keep copy and examples occasion-agnostic in the component
   itself (pass occasion text as props).

## Template

[`GiftStatusBadge.tsx`](./GiftStatusBadge.tsx) is the canonical example — copy its
shape (props interface, token imports, inline-style pattern, barrel export) for new
components.

## Merging into screens

"Merge" = importing and composing in code, not a git merge. Build components in any
session, then a later session assembles a screen (e.g. `RegistryDetail.tsx`) that
imports from `../components`. This repo isn't git-tracked, so avoid editing the **same
file** from two sessions running at once; different files are safe.
