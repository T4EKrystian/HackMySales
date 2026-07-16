import type { ComponentPropsWithoutRef } from "react";

type Variant = "primary" | "ghost" | "dark";
type Size = "md" | "lg";

const base =
  "inline-flex select-none items-center justify-center gap-2 rounded-md font-medium whitespace-nowrap " +
  "transition-[transform,background-color,border-color,color] duration-150 ease-out " +
  "active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 " +
  "disabled:opacity-50 disabled:pointer-events-none";

// primary = niebieski + biały · ghost = hairline na papierze · dark = pasmo granatowe
const variants: Record<Variant, string> = {
  primary: "bg-blue text-white hover:bg-blue-deep",
  ghost: "border border-hairline text-ink hover:bg-paper-deep hover:border-strongline",
  dark: "bg-forest-950 text-onforest hover:bg-forest-900",
};

const sizes: Record<Size, string> = {
  md: "min-h-11 px-5 py-2.5 t-ui", // ≥44px tap target
  lg: "min-h-14 px-7 py-3.5 t-body", // ≥56px (hero / final CTA)
};

type ButtonProps = { variant?: Variant; size?: Size } & (
  | ({ href: string } & ComponentPropsWithoutRef<"a">)
  | ({ href?: undefined } & ComponentPropsWithoutRef<"button">)
);

export function Button({ variant = "primary", size = "md", className = "", ...props }: ButtonProps) {
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`;
  if ("href" in props && props.href !== undefined) {
    const { href, ...rest } = props as { href: string } & ComponentPropsWithoutRef<"a">;
    return <a href={href} className={cls} {...rest} />;
  }
  return <button className={cls} {...(props as ComponentPropsWithoutRef<"button">)} />;
}
