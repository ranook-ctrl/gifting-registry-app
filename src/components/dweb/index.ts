// Gifting Registry · dWeb (desktop web) components.
//
// The rest of ../ is laid out against a fixed 375pt phone canvas. This folder is
// the desktop port: same Field DS tokens, same Noontree type, same state
// machines — different layout, and mouse/keyboard affordances in place of touch
// ones (dialogs and a drawer instead of bottom sheets, hover instead of ⋮ menus).
//
// Screens import from one place:
//   import { GifterRegistryWeb } from '../src/components/dweb';

export { GifterRegistryWeb } from './GifterRegistryWeb';
export type { GifterRegistryWebProps, RegistryProduct } from './GifterRegistryWeb';

export { NoonHeader, NOON_CATEGORIES } from './NoonHeader';
export type { NoonHeaderProps } from './NoonHeader';

export { NoonFooter } from './NoonFooter';
export type { NoonFooterProps } from './NoonFooter';

export { RegistryHero } from './RegistryHero';
export type { RegistryHeroProps } from './RegistryHero';

export { RegistryHeroArt } from './RegistryHeroArt';
export type { RegistryHeroArtProps } from './RegistryHeroArt';

export { RegistryAside, PRICE_BANDS } from './RegistryAside';
export type { RegistryAsideProps, AvailabilityFilter, PriceBand } from './RegistryAside';

export { ProductTile } from './ProductTile';
export type { ProductTileProps, ProductTileState } from './ProductTile';

export { ProductQuickView } from './ProductQuickView';
export type { ProductQuickViewProps, QuickViewProduct } from './ProductQuickView';

export { GiftBagDrawer, bagTotals } from './GiftBagDrawer';
export type { GiftBagDrawerProps, GiftBagLine } from './GiftBagDrawer';

export { CheckoutWeb, DELIVERY_SLOTS } from './CheckoutWeb';
export type { CheckoutWebProps, DeliverySlot, PaymentMethod } from './CheckoutWeb';

export { AddressDialog, GIFTER_ADDRESSES } from './AddressDialog';
export type { AddressDialogProps, WebAddressItem, AddressKind } from './AddressDialog';

export { ConfirmDialog } from './ConfirmDialog';
export type { ConfirmDialogProps, ConfirmVariant } from './ConfirmDialog';

export { WebDialog } from './WebDialog';
export type { WebDialogProps } from './WebDialog';
