/** Logotypy platform (rewizja 2b, audyt premium-craft): jednorodne wordmarki tekstowe
 *  zamiast miksu ikon różnej wielkości (Shopify/Woo miały ikony, Shoper/IdoSell nie —
 *  niespójne). Jeden krój, jeden kolor, wspólna wysokość optyczna = czyściej i wiarygodniej. */
export function PlatformLogo({
  name,
  className = "",
}: {
  name: string;
  /** zachowane w API (ProofTicker przekazuje) — nieużywane w wordmarku */
  iconSize?: number;
  className?: string;
}) {
  return <span className={`font-sans t-ui font-medium tracking-tight ${className}`}>{name}</span>;
}
