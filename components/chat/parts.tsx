"use client";

import Image from "next/image";
import { pl } from "@/content/pl";
import { Glyph } from "@/components/ui/Glyph";
import { ProductVisual } from "@/components/ui/ProductVisual";
import type { ChatCard } from "./script";

/** Klocki ChatShell (v5): avatar persony, plakietka AI, karta produktu ze ZDJĘCIEM,
 *  receipt, divider, dots. Czyste komponenty prezentacyjne — playback robi silnik. */

const persona = pl.hero.chat.persona;
const ui = pl.chatUi;

export function PersonaAvatar({ size = 28, ring = false }: { size?: number; ring?: boolean }) {
  const avatar = (
    <span
      className="relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-line-1 bg-blue-tint"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {/* fallback-inicjał pod spodem — obrazek przykrywa go po załadowaniu */}
      <span className="num absolute text-[13px] md:text-[11px] text-blue-soft">{persona.name[0]}</span>
      <Image
        src={persona.avatar}
        alt=""
        width={size}
        height={size}
        className="relative h-full w-full object-cover"
        unoptimized
      />
    </span>
  );
  // IG: gradient wyłącznie jako 1px ring (anti-kitsch V6)
  return ring ? (
    <span className="chat-ig-ring inline-flex shrink-0" aria-hidden="true">
      {avatar}
    </span>
  ) : (
    avatar
  );
}

export function AiBadge() {
  return (
    <span
      role="img"
      aria-label={ui.aiBadgeAria}
      className="num rounded-[5px] border border-line-2 px-1.5 py-px text-[9px] uppercase tracking-[0.1em] text-mute"
    >
      {persona.aiBadge}
    </span>
  );
}

/** Wiersz tożsamości do headerów: avatar + imię + AI + status/rola. */
export function PersonaRow({ presence, clock, ring = false }: { presence?: string; clock?: string; ring?: boolean }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <PersonaAvatar ring={ring} />
      <div className="min-w-0 leading-tight">
        <p className="flex items-center gap-2 truncate text-sm font-medium text-ink">
          {persona.name}
          <AiBadge />
        </p>
        {presence ? (
          <p className="flex items-center gap-1.5 truncate text-xs text-mute">
            <span className="chat-online-dot inline-block h-1.5 w-1.5 rounded-full bg-ok" aria-hidden="true" />
            {presence}
            {clock && (
              <>
                <span aria-hidden="true">—</span>
                <span className="num">{clock}</span>
              </>
            )}
          </p>
        ) : (
          <p className="truncate text-xs text-mute">{persona.role}</p>
        )}
      </div>
    </div>
  );
}

export function TypingDots() {
  // inline-flex + w-max + nowrap: bąbel pisania NIGDY się nie zawija (w-fit=fit-content
  // kurczył się pod min-w-0/max-w rodzica do 2 linii — V7 zgłoszony bug)
  return (
    <div className="chat-typing mb-2 inline-flex w-max items-center gap-1 whitespace-nowrap rounded-2xl bg-elevated px-3.5 py-3">
      <span className="chat-dot" />
      <span className="chat-dot" />
      <span className="chat-dot" />
    </div>
  );
}

export function DayDivider() {
  return (
    <p className="chat-step self-center text-[13px] md:text-[11px] uppercase tracking-[0.12em] text-mute" data-role="divider">
      <span className="chat-msg">{ui.today}</span>
    </p>
  );
}

export function ReadReceipt() {
  return (
    <p className="chat-receipt mt-1 text-right text-[13px] md:text-[11px] text-mute" aria-label={ui.receiptAria}>
      {ui.seen}
    </p>
  );
}

/** Karta produktu w bąblu bota — PRAWDZIWE zdjęcie (thumb 112 px), fallback ProductVisual. */
export function AttachmentProductCard({ card }: { card: ChatCard }) {
  return (
    <div
      className="mt-3 flex min-w-[240px] items-center gap-3 rounded-xl border border-hairline bg-card p-3 transition-[transform,box-shadow] duration-200 hover:scale-[1.02] hover:[box-shadow:var(--highlight-top),var(--shadow-l2)]"
      style={{ transitionTimingFunction: "var(--ease-out)" }}
    >
      {card.slug ? (
        <Image
          src={`/products/${card.slug}-112.webp`}
          alt=""
          width={44}
          height={44}
          className="h-11 w-11 shrink-0 rounded-lg border border-line-1 object-cover"
          unoptimized
        />
      ) : card.kind ? (
        <ProductVisual kind={card.kind} size={44} />
      ) : (
        <div
          aria-hidden="true"
          className="num flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-tint text-xs text-blue-soft"
        >
          {card.initials}
        </div>
      )}
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-ink">{card.name}</p>
        {card.tags && <p className="truncate text-xs text-mute">{card.tags}</p>}
        {(card.meta ?? card.note) && <p className="mt-1 text-xs text-sub">{card.meta ?? card.note}</p>}
      </div>
      {card.price && <span className="num ml-auto shrink-0 text-sm text-ink">{card.price}</span>}
    </div>
  );
}

/** Pasek glifów przy atrapie inputu (wzorzec komunikatora — messenger/instagram). */
export function InputTools() {
  return (
    <span className="flex items-center gap-2.5 text-mute" aria-hidden="true">
      <Glyph name="camera" size={17} />
      <Glyph name="plus" size={16} />
    </span>
  );
}
