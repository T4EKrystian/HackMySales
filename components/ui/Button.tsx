import type { ComponentPropsWithoutRef } from "react";

type Variant = "primary" | "ghost";
type Size = "md" | "lg";

const base =
  "inline-flex select-none items-center justify-center gap-2 rounded-full font-medium " +
  "transition-[transform,box-shadow,background-color,border-color,color] duration-150 ease-out";

const variants: Record<Variant, string> = {
  primary:
    "bg-blue text-onblue hover:bg-blue-hover hover:-translate-y-px hover:shadow-cta " +
    "active:translate-y-0 active:scale-[0.99] active:bg-blue-deep",
  ghost:
    "border border-hairline text-ink hover:border-strongline hover:bg-elevated",
};

const sizes: Record<Size, string> = {
  md: "min-h-11 px-5 py-2.5 text-[0.9375rem]", // ≥44px tap target (Apple)
  lg: "min-h-12 px-7 py-3 text-[1.0625rem]",
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
