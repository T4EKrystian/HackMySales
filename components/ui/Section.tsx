import type { ReactNode } from "react";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`container-hms ${className}`}>{children}</div>;
}

export function SectionLabel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`label js-reveal ${className}`}>{children}</p>;
}

export function SectionH2({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <h2
      className={`js-reveal mt-4 font-display font-bold tracking-tight text-ink ${className}`}
      style={{ fontSize: "var(--text-h2)", lineHeight: 1.1 }}
    >
      {children}
    </h2>
  );
}
