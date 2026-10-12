import { useState } from 'react';
import {
  GifterHome,
  CreatorEmptyState,
  CreatorHome,
  CreateGiftList,
  GiftListDetails,
  RegistrySettings,
  DEFAULT_OCCASIONS,
} from '../src/components';
import '../wishlist/wishlist.css';
import WishlistPage from '../wishlist/components/WishlistPage';

/* ------------------------------------------------------------------ Gifter */

/** Gifter flow — the shared registry a gifter browses (self-contained screen).
 *  Lift the floating cart above the 64px tab bar, plus whatever home-indicator
 *  strip the tab bar reserved below itself (design px — see useDeviceScale). */
export function GifterFlow({ safeBottom = 0 }: { safeBottom?: number }) {
  return <GifterHome floatingCartBottom={80 + safeBottom} />;
}

/** Create-list tab — opens on the ported Wishlist page (the latest page built
 *  this session). Both create entry points (header "+" and the Gift-lists CTA)
 *  initiate the Gift List Creation flow. */
export function CreateListFlow() {
  const [creating, setCreating] = useState(false);
  return creating ? (
    <CreateGiftListFlow onExit={() => setCreating(false)} />
  ) : (
    <WishlistPage fill onCreateList={() => setCreating(true)} />
  );
}

/* ----------------------------------------------------------------- Creator */

/**
 * Creator dashboard flow — opens straight on the Creator home (the populated
 * dashboard), which now leads with the first PageHeaderHero variant (Retune).
 */
export function CreatorFlow() {
  return <CreatorHome fill />;
}

/* ------------------------------------------------------------ Create a list */

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** Event date with an ordinal day, e.g. "14th July". */
function formatEventDate(d: Date) {
  const day = d.getDate();
  const tens = day % 100;
  const suffix =
    tens >= 11 && tens <= 13 ? 'th'
    : day % 10 === 1 ? 'st'
    : day % 10 === 2 ? 'nd'
    : day % 10 === 3 ? 'rd'
    : 'th';
  return `${day}${suffix} ${MONTHS[d.getMonth()]}`;
}

/** Whole days from today until the event, e.g. "20 days to go!". */
function formatCountdown(d: Date) {
  const DAY_MS = 24 * 60 * 60 * 1000;
  const now = new Date();
  const start = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const end = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
  const days = Math.round((end - start) / DAY_MS);
  if (days > 0) return `${days} day${days === 1 ? '' : 's'} to go!`;
  if (days === 0) return 'Today!';
  return 'Event passed';
}

type Step = 'create' | 'details' | 'creatorEmpty' | 'creatorHome' | 'settings';

/**
 * Create → Details → Creator dashboard → Settings. Mirrors the standalone
 * `create-gift-list` entry; carries the collected name/occasion/date forward.
 */
export function CreateGiftListFlow({ onExit }: { onExit?: () => void } = {}) {
  const [step, setStep] = useState<Step>('create');
  const [settingsReturn, setSettingsReturn] = useState<Step>('creatorHome');
  const [name, setName] = useState('Prasanna');
  const [occasion, setOccasion] = useState<number | null>(null);
  const [eventDate, setEventDate] = useState<Date | null>(null);

  const occasionLabel = occasion != null ? DEFAULT_OCCASIONS[occasion].label : '';
  const title = `${name}’s ${occasionLabel}`;
  const dateLabel = eventDate ? formatEventDate(eventDate) : undefined;
  const countdown = eventDate ? formatCountdown(eventDate) : undefined;

  const openSettings = (from: Step) => {
    setSettingsReturn(from);
    setStep('settings');
  };

  switch (step) {
    case 'create':
      return (
        <CreateGiftList
          fill
          creatorName={name}
          onChangeName={setName}
          selectedOccasion={occasion}
          onSelectOccasion={setOccasion}
          onBack={onExit}
          onContinue={() => setStep('details')}
        />
      );
    case 'details':
      return (
        <GiftListDetails
          fill
          title={title}
          eventDate={eventDate}
          onChangeDate={setEventDate}
          onBack={() => setStep('create')}
          onContinue={() => setStep('creatorEmpty')}
        />
      );
    case 'creatorEmpty':
      return (
        <CreatorEmptyState
          title={title}
          date={dateLabel}
          countdown={countdown}
          onBack={() => setStep('details')}
          onSearchGifts={() => setStep('creatorHome')}
          onOpenSettings={() => openSettings('creatorEmpty')}
        />
      );
    case 'creatorHome':
      return (
        <CreatorHome
          fill
          title={title}
          date={dateLabel}
          countdown={countdown}
          onBack={() => setStep('creatorEmpty')}
          onOpenSettings={() => openSettings('creatorHome')}
        />
      );
    case 'settings':
      return (
        <RegistrySettings
          hostName={name}
          giftListName={title}
          occasion={occasionLabel || undefined}
          occasionDate={dateLabel}
          contactName={name}
          onBack={() => setStep(settingsReturn)}
        />
      );
  }
}
