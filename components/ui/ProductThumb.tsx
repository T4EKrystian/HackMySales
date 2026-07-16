"use client";

import Image from "next/image";
import { ProductVisual, type ProductKind } from "@/components/ui/ProductVisual";
import { productSlug } from "@/components/chat/script";

/** Thumb produktu (V5-F5): PRAWDZIWE zdjęcie z /public/products (wariant 112 px),
 *  fallback = generatywny ProductVisual (udokumentowany wyjątek DNA „Fotografia
 *  produktowa" dla pozycji bez packshotu w manifeście). */
export function ProductThumb({
  name,
  kind,
  size = 40,
  tint,
  photo = true,
}: {
  name: string;
  kind?: ProductKind;
  size?: number;
  tint?: "blue" | "graphite";
  /** true (domyślnie) = realne zdjęcie produktu z /public/products; false = generatywny
   *  ProductVisual (fallback tam, gdzie zdjęcie zbędne). Klient chce realne foto + nazwy. */
  photo?: boolean;
}) {
  const slug = photo ? productSlug(name) : null;
  if (slug) {
    return (
      <Image
        src={`/products/${slug}-112.webp`}
        alt=""
        width={size}
        height={size}
        unoptimized
        className="shrink-0 rounded-lg border border-line-1 object-cover"
        style={{ width: size, height: size }}
      />
    );
  }
  return kind ? <ProductVisual kind={kind} size={size} tint={tint} /> : null;
}
