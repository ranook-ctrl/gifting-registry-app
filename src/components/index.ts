// Gifting Registry components — single import surface for screens.
// See CONVENTIONS.md before adding new components. Register each here.

export { GiftStatusBadge } from './GiftStatusBadge';
export type { GiftStatusBadgeProps, GiftStatus } from './GiftStatusBadge';

export { ActiveOrderCard } from './ActiveOrderCard';
export type { ActiveOrderCardProps } from './ActiveOrderCard';

export { OrderStatusBar } from './OrderStatusBar';
export type { OrderStatusBarProps, OrderStatusVariant } from './OrderStatusBar';

export { GifterCard } from './GifterCard';
export type { GifterCardProps, GifterCardState } from './GifterCard';

export { CreatorCard } from './CreatorCard';
export type { CreatorCardProps, CreatorCardVariant } from './CreatorCard';

export { DeliveryDetails } from './DeliveryDetails';
export type { DeliveryDetailsProps, DeliveryDetailsVariant } from './DeliveryDetails';

export { FormFields, DEFAULT_OCCASIONS } from './FormFields';
export type { FormFieldsProps, FormFieldVariant, FormFieldsOccasion } from './FormFields';

export { StickyBottom } from './StickyBottom';
export type { StickyBottomProps } from './StickyBottom';

export { BirthdayBackground } from './BirthdayBackground';
export type { BirthdayBackgroundProps } from './BirthdayBackground';

export { DateInput } from './DateInput';
export type { DateInputProps } from './DateInput';

export { ShareSheet } from './ShareSheet';
export type { ShareSheetProps, ShareChannel } from './ShareSheet';

export { AddressSheet } from './AddressSheet';
export type { AddressSheetProps, AddressSheetVariant, AddressItem, AddressIcon } from './AddressSheet';

export { BottomSheet } from './BottomSheet';
export type { BottomSheetProps } from './BottomSheet';

// --- Flow screens ---
export { CreateGiftList } from './CreateGiftList';
export type { CreateGiftListProps } from './CreateGiftList';

export { GiftListDetails } from './GiftListDetails';
export type { GiftListDetailsProps } from './GiftListDetails';

export { GifterHome } from './GifterHome';
export type { GifterHomeProps, GifterHomeProduct } from './GifterHome';

export { RegistrySettings } from './RegistrySettings';
export type { RegistrySettingsProps } from './RegistrySettings';

export { ExplorableCard } from './ExplorableCard';
export type { ExplorableCardProps } from './ExplorableCard';

export { PageHeaderHero } from './PageHeaderHero';
export type { PageHeaderHeroProps, PageHeaderVariant } from './PageHeaderHero';

export { CreatorEmptyState } from './CreatorEmptyState';
export type { CreatorEmptyStateProps } from './CreatorEmptyState';

export { CreatorHome } from './CreatorHome';
export type { CreatorHomeProps } from './CreatorHome';

// --- Creator dashboard building blocks ---
export { CreatorHeader } from './CreatorHeader';
export type { CreatorHeaderProps } from './CreatorHeader';

export { ExploreCuratedGifts } from './ExploreCuratedGifts';
export type { ExploreCuratedGiftsProps } from './ExploreCuratedGifts';

export { NeutralButton } from './NeutralButton';
export type { NeutralButtonProps } from './NeutralButton';

export { ConfirmationBottomsheet } from './ConfirmationBottomsheet';
export type { ConfirmationBottomsheetProps, ConfirmationVariant } from './ConfirmationBottomsheet';

export { ReceivedGiftCard } from './ReceivedGiftCard';
export type {
  ReceivedGiftCardProps,
  ReceivedGiftBadge,
  ReceivedGiftDetail,
  ReceivedGiftInstallation,
} from './ReceivedGiftCard';

export { GiftListCard } from './GiftListCard';
export type { GiftListCardProps, GiftListCardVariant, GiftListCardProduct } from './GiftListCard';

export { GiftTracking } from './GiftTracking';
export type { GiftTrackingProps } from './GiftTracking';

export { CheckoutPage } from './CheckoutPage';
export type { CheckoutPageProps } from './CheckoutPage';

export { CartPage } from './CartPage';
export type { CartPageProps } from './CartPage';

export { GiftListsEmptyState } from './GiftListsEmptyState';
export type { GiftListsEmptyStateProps, GiftListsEmptyStateStep } from './GiftListsEmptyState';
