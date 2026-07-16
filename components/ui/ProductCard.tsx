import Image from "next/image";
import { ProductVisual, type ProductKind } from "@/components/ui/ProductVisual";

export type ProductCardVariant = "chat" | "reco" | "grid";

export type ProductCardProps = {
  name: string;
  price?: string;
  oldPrice?: string | null;
  category?: string;
  meta?: string;
  /** slug zdjęcia z /public/products (rozwiązany przez wołającego); brak → ProductVisual/initials */
  slug?: string;
  kind?: ProductKind;
  initials?: string;
  variant: ProductCardVariant;
  featured?: boolean;
  saleLabel?: string;
  className?: string;
};

/** Jedna karta produktu na całą stronę — zastępuje 3 rozjechane implementacje
 *  (AttachmentProductCard w czacie, RecoGrid, HeroChatShowcase).
 *  Zdjęcia ZAWSZE 1:1 (packshoty są kwadratowe 800×800 / 112×112 → object-cover = zero
 *  przycięcia). Hierarchia: nazwa .t-ui 500 · cena mono .t-ui 500 · meta/kategoria .t-meta.
 *  Przecena = przekreślona stara cena (BEZ czerwieni). Hover = frame-hover (bez scale-lift).
 *  Radius wyłącznie z tokenów (md dla shellu, sm dla miniatury czatu). */
export function ProductCard({
  name,
  price,
  oldPrice,
  category,
  meta,
  slug,
  kind,
  initials,
  variant,
  featured = false,
  saleLabel,
  className = "",
}: ProductCardProps) {
  // --- CZAT: poziomy wiersz w bąblu bota ---
  if (variant === "chat") {
    return (
      <div
        className={`mt-3 flex min-w-[240px] items-center gap-3 rounded-md border bg-card p-3 frame-hover ${
          featured ? "border-strongline bg-blue-tint" : "border-hairline"
        } ${className}`}
      >
        <span className="relative block h-11 w-11 shrink-0 overflow-hidden rounded-sm border border-line-1 bg-l3">
          {slug ? (
            <Image src={`/products/${slug}-112.webp`} alt="" fill sizes="44px" unoptimized className="object-cover" />
          ) : kind ? (
            <ProductVisual kind={kind} size={44} className="!rounded-none" />
          ) : (
            <span className="num flex h-full w-full items-center justify-center bg-blue-tint t-meta text-blue-soft">
              {initials}
            </span>
          )}
        </span>
        <div className="min-w-0">
          <p className="truncate t-ui font-medium text-ink">{name}</p>
          {meta && <p className="t-meta truncate text-mute">{meta}</p>}
        </div>
        {price && <span className="num ml-auto shrink-0 t-ui font-medium text-ink">{price}</span>}
      </div>
    );
  }

  // --- RECO / GRID: pionowy kafel, kadr 1:1, hairline między zdjęciem a treścią ---
  const src = slug ? `/products/${slug}${variant === "grid" ? "-112" : ""}.webp` : null;
  return (
    <article
      className={`flex flex-col overflow-hidden rounded-md border bg-surface frame-hover ${
        featured ? "border-strongline" : "border-hairline"
      } ${className}`}
    >
      <div className="relative aspect-square w-full bg-l3">
        {src ? (
          <Image
            src={src}
            alt=""
            fill
            sizes={variant === "grid" ? "120px" : "160px"}
            unoptimized
            className="object-cover"
          />
        ) : kind ? (
          <span className="flex h-full items-center justify-center">
            <ProductVisual kind={kind} size={variant === "grid" ? 48 : 64} tint="graphite" />
          </span>
        ) : null}
      </div>
      <div
        className={`border-t border-hairline ${
          variant === "grid"
            ? "flex items-baseline justify-between px-2.5 py-2"
            : "flex flex-col gap-0.5 px-3 py-2.5"
        }`}
      >
        {variant === "reco" && category && (
          <p className="t-meta uppercase tracking-[0.06em] text-mute">{category}</p>
        )}
        {variant === "reco" && (
          <p className="line-clamp-2 t-ui font-medium leading-snug text-ink">{name}</p>
        )}
        <p className="flex items-baseline gap-1.5">
          {oldPrice && <span className="num t-meta text-mute line-through">{oldPrice}</span>}
          {price && <span className="num t-ui font-medium text-ink">{price}</span>}
          {saleLabel && oldPrice && <span className="sr-only">{saleLabel}</span>}
        </p>
      </div>
    </article>
  );
}
