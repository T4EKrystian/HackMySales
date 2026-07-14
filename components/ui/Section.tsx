import type { ReactNode } from "react";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`container-hms ${className}`}>{children}</div>;
}

export function SectionLabel({
  children,
  num,
  className = "",
}: {
  children: ReactNode;
  num?: string;
  className?: string;
}) {
  return (
    <p className={`label js-reveal flex items-center gap-3 ${className}`}>
      {num && (
        <>
          <span className="text-blue-soft">{num}</span>
          <span aria-hidden="true" className="inline-block h-px w-8 bg-strongline" />
        </>
      )}
      {children}
    </p>
  );
}

export function SectionH2({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <h2
      className={`t-h2 js-reveal mt-4 font-display font-semibold text-ink ${className}`}
    >
      {children}
    </h2>
  );
}
