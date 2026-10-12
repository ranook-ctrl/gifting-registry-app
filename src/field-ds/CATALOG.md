# Field DS — Component Catalog (reference)

Reverse-engineered from the Field DS playground (`field-ds.vercel.app`), since
`@field-ds/components` is React Native and not on the public npm registry.

**How to use this:** when asked to build a UI here (Vite + `react-dom`), implement
faithful web versions of these components using the real props/variants below and the
token values in [`tokens.ts`](./tokens.ts). Icon names are in [`icons.ts`](./icons.ts).

Props were extracted from real call sites in the playground; enum values are confirmed
where noted, otherwise inferred. Field DS is mobile-first — sizes/spacing reflect that.

---

## Buttons

All share a core (`RectButton`). Sizes are height tokens: `H28 | H32 | H36 | H40 | H48 | H56` (default `H56`).

### `PrimaryButton` / `SecondaryButton` / `SecondaryNeutralButton` / `TextButton`
| prop | type | notes |
|------|------|-------|
| `label` | `string` | button text |
| `size` | `'H28'..'H56'` | default `H56` |
| `onPress` | `() => void` | |
| `disabled` | `boolean` | |
| `loading` | `boolean` | spinner, label hidden |
| `iconLeft` | `IconName` | leading icon |
| `iconRight` | `IconName` | trailing icon |
| `style` | style override | |

- **Primary** — filled action: bg `surface.action-extrabold` (#0f61ff), fg `on-surface-bold` (#fff).
- **Secondary** — action-tinted/outline.
- **SecondaryNeutral** — neutral outline: bg `surface.muted`, fg `text-n-icon.on-surface-bold`.
- **TextButton** — text-only, no fill.

### `IconButton`
| prop | type | notes |
|------|------|-------|
| `icon` | `IconName` | required |
| `accessibilityLabel` | `string` | required (a11y) |
| `emphasis` | `'action' \| 'ghost'` | |
| `size` | `'H28'..'H56'` | |
| `onPress` | `() => void` | |
| `disabled` | `boolean` | |

---

## Inputs

### `InputText`
| prop | type | notes |
|------|------|-------|
| `label` | `string` | |
| `labelMode` | `'external' \| 'inline' \| 'none'` | label placement |
| `placeholder` | `string` | |
| `value` / `defaultValue` | `string` | controlled / uncontrolled |
| `onChangeText` | `(t: string) => void` | |
| `helperText` | `string` | |
| `showHelperText` | `boolean` | |
| `error` | `boolean \| string` | error state |
| `disabled` | `boolean` | |
| `required` | `boolean` | |
| `leftSlot` / `rightSlot` | `ReactNode` | adornments |
| `showCounter` | `boolean` | char counter |
| `maxLength` | `number` | |

### `InputTextarea`
Same as `InputText` (multi-line). Commonly used with `showCounter` + `maxLength`.

### `FieldGroup`
Numbered form-field wrapper: `index` (e.g. `"01"`), `label`, `hint`.

---

## Selection

### `Switch` (segmented control — not on/off)
| prop | type | notes |
|------|------|-------|
| `options` | `{ value; label }[]` | segments |
| `value` / `defaultValue` | | selected segment |
| `onChange` | `(v) => void` | |
| `size` | `'small' \| 'large'` | |
| `disabled` | `boolean` | |
| `accessibilityLabel` | `string` | |

### `Radio` / `Checkbox`
| prop | type | notes |
|------|------|-------|
| `selected` / `defaultSelected` | `boolean` | |
| `onChange` | `(v: boolean) => void` | |
| `size` | `'small' \| 'large'` | |
| `disabled` | `boolean` | |
| `accessibilityLabel` | `string` | |

### `RatingInput`
| prop | type | notes |
|------|------|-------|
| `size` | `'small' \| 'large'` | |
| `value` / `defaultValue` | `number` | |
| `onChange` | `(n: number) => void` | |
| `emojis` | `string[]` | emoji-scale variant |
| `disabled` | `boolean` | |

---

## Containers & lists

### `ListItem`
| prop | type | notes |
|------|------|-------|
| `title` | `string` | |
| `subtitle` | `string` | |
| `leading` | `ReactNode` | icon/avatar |
| `trailing` | `ReactNode` | chevron/control |
| `titleSlot` | `ReactNode` | custom title node |
| `onPress` | `() => void` | |
| `size` | | |

### `Accordion`
| prop | type | notes |
|------|------|-------|
| `title` | `string` | |
| `children` | `ReactNode` | body |
| `expanded` / `defaultExpanded` | `boolean` | |
| `onExpandedChange` | `(b: boolean) => void` | |
| `iconLeft` | `IconName` | |

### `Divider`
`variant: 'neutral' | 'light' | 'white'`, `emphasis`, `paddingLeft`, `paddingRight`, `width`.

---

## Navigation & overlays

### `BottomSheet`
| prop | type | notes |
|------|------|-------|
| `open` | `boolean` | |
| `onClose` | `() => void` | |
| `presentation` | `'inline' \| ...` | |
| `showHeader` / `headerSlot` | `boolean` / `ReactNode` | |
| `bodySlot` | `ReactNode` | content |
| `showFooter` / `footer` | | |
| `primaryLabel` / `onPrimaryPress` | | footer CTA |
| `showScrim` / `showGrabber` / `showHomeIndicator` | `boolean` | chrome |

### `BottomNav`
`tabs` (array), `activeKey`, `onTabPress`, `showHomeBar`. Tab icons use `bottomnav-*` names.

### `Toast`
| prop | type | notes |
|------|------|-------|
| `type` | `'success' \| 'error' \| 'warning' \| 'dark' \| 'light'` | confirmed: `dark`, `light`, `success` |
| `title` | `string` | |
| `subtitle` | `string` | |
| `icon` | `IconName` | |
| `actionLabel` | `string` | |
| `onActionPress` / `onDismiss` | `() => void` | |

---

## Icons

`<Icon name={IconName} size={number} color={string} />` — see [`icons.ts`](./icons.ts) (458 names,
`system-*` general UI + `bottomnav-*` tab icons). `IconPicker` (`value`, `onChange`) is a dev tool for browsing them.
