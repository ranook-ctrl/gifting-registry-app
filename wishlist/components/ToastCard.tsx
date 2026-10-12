import airpodsImg from "../assets/products/airpods.png";

export type ToastVariant =
  | "removed"
  | "moved"
  | "copied"
  | "saved-wishlist"
  | "saved-collection";

export type ToastCardProps = {
  variant: ToastVariant;
  image?: string;
  imageAlt?: string;
  destination?: string;
  suffix?: string;
  meta?: string;
  link?: string;
  onAction?: () => void;
  onLink?: () => void;
  className?: string;
};

type Resolved = {
  prefix: string;
  destination: string;
  suffix?: string;
  meta?: string;
  link?: string;
  action: string;
};

function resolve(variant: ToastVariant, p: ToastCardProps): Resolved {
  switch (variant) {
    case "removed":
      return {
        prefix: "Removed from ",
        destination: p.destination ?? "All Items",
        action: "Undo",
      };
    case "moved":
      return {
        prefix: "Moved to ",
        destination: p.destination ?? "Electronics",
        meta: p.meta ?? "5 items",
        action: "Change",
      };
    case "copied":
      return {
        prefix: "Copied to ",
        destination: p.destination ?? "Electronics",
        meta: p.meta ?? "5 items",
        action: "Change",
      };
    case "saved-wishlist":
      return {
        prefix: "Saved to ",
        destination: p.destination ?? "All items",
        link: p.link ?? "View Wishlist",
        action: "Change",
      };
    case "saved-collection":
      return {
        prefix: "Saved to ",
        destination: p.destination ?? "Arushi’s Birthday",
        suffix: p.suffix,
        link: p.link ?? "View Collection",
        action: "Change",
      };
  }
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M6 4L10 8L6 12"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ToastBody({
  image,
  imageAlt,
  content,
  onAction,
  onLink,
}: {
  image: string;
  imageAlt: string;
  content: Resolved;
  onAction?: () => void;
  onLink?: () => void;
}) {
  return (
    <div className="flex w-full items-center gap-3">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <div className="corner-smooth-lg flex shrink-0 items-center bg-surface-tertiary p-1">
          <img
            src={image}
            alt={imageAlt}
            className="block size-10 object-cover"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
          <p className="text-b16 text-text-primary">
            {content.prefix}
            <span className="font-semibold">{content.destination}</span>
            {content.suffix && (
              <span className="font-semibold"> {content.suffix}</span>
            )}
          </p>
          {content.meta && (
            <p className="truncate text-b12 tracking-[-0.1px] text-text-tertiary">
              {content.meta}
            </p>
          )}
          {content.link && (
            <button
              type="button"
              onClick={onLink}
              className="flex items-center gap-0.5 text-text-tertiary"
            >
              <span className="text-b12 tracking-[-0.1px]">{content.link}</span>
              <ChevronRight className="block size-3.5 text-text-tertiary" />
            </button>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={onAction}
        className="flex h-9 shrink-0 items-center justify-center rounded-lg py-2.5 text-b14 font-semibold text-text-action"
      >
        <span className="relative">
          {content.action}
          <span
            aria-hidden
            className="dashed-underline-fine pointer-events-none absolute -bottom-[3px] left-0 right-0 h-px"
          />
        </span>
      </button>
    </div>
  );
}

export default function ToastCard(props: ToastCardProps) {
  const {
    variant,
    image = airpodsImg,
    imageAlt = "",
    onAction,
    onLink,
    className = "",
  } = props;
  const content = resolve(variant, props);

  return (
    <div
      className={
        "corner-smooth-card flex w-[351px] items-center bg-surface-primary p-3 font-primary " +
        className
      }
    >
      <ToastBody
        image={image}
        imageAlt={imageAlt}
        content={content}
        onAction={onAction}
        onLink={onLink}
      />
    </div>
  );
}
