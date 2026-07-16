import type { Metadata } from "next";
import { LegalShell, type LegalSection } from "@/components/sections/LegalShell";

export const metadata: Metadata = {
  title: "Regulamin — HackMySales",
  description: "Zasady korzystania ze strony HackMySales i umawiania prezentacji systemu.",
  alternates: { canonical: "/regulamin" },
};

// UWAGA: szablon do potwierdzenia przez dział prawny. Dane w [nawiasach] uzupełnia właściciel.
const sections: LegalSection[] = [
  {
    h: "Postanowienia ogólne",
    body: [
      "Niniejszy regulamin określa zasady korzystania ze strony internetowej HackMySales, dostępnej pod adresem [domena], której operatorem jest Time4Ecommerce [pełna nazwa firmy], NIP [NIP].",
      "Kontakt z operatorem: kontakt@hackmysales.pl.",
    ],
  },
  {
    h: "Zakres usługi",
    body: [
      "Strona ma charakter informacyjny i prezentuje system HackMySales (wyszukiwarka AI, rekomendacje produktowe i chatbot sprzedażowy dla sklepów internetowych).",
      "Za pośrednictwem formularza możesz umówić bezpłatną prezentację systemu. Strona nie służy do zawierania umów sprzedaży ani świadczenia usługi online bez odrębnych ustaleń.",
    ],
  },
  {
    h: "Umówienie prezentacji",
    body: [
      "Aby umówić prezentację, wypełnij formularz kontaktowy, podając dane niezbędne do kontaktu. Wysłanie formularza jest równoznaczne z prośbą o kontakt w celu przedstawienia oferty.",
      "Skontaktujemy się z Tobą w ciągu jednego dnia roboczego. Umówienie prezentacji jest bezpłatne i niezobowiązujące.",
    ],
  },
  {
    h: "Prawa i obowiązki użytkownika",
    body: [
      "Korzystając ze strony, zobowiązujesz się do podawania prawdziwych danych oraz do niepodejmowania działań zakłócających jej działanie.",
      "Treści prezentowane na stronie (w tym dane demonstracyjne i przykładowe rozmowy) mają charakter poglądowy i nie stanowią oferty w rozumieniu Kodeksu cywilnego.",
    ],
  },
  {
    h: "Odpowiedzialność",
    body: [
      "Dokładamy starań, aby strona działała poprawnie i zawierała aktualne informacje. Nie ponosimy odpowiedzialności za przerwy techniczne niezależne od nas ani za decyzje podjęte wyłącznie na podstawie materiałów poglądowych.",
      "Wyniki i statystyki cytowane na stronie pochodzą z podanych źródeł i nie stanowią gwarancji rezultatu w konkretnym sklepie.",
    ],
  },
  {
    h: "Reklamacje",
    body: [
      "Uwagi dotyczące działania strony zgłaszaj na kontakt@hackmysales.pl. Odpowiemy w rozsądnym terminie, nie dłuższym niż 14 dni.",
    ],
  },
  {
    h: "Dane osobowe",
    body: [
      "Zasady przetwarzania danych osobowych opisuje Polityka prywatności dostępna pod adresem /polityka-prywatnosci.",
    ],
  },
  {
    h: "Postanowienia końcowe",
    body: [
      "W sprawach nieuregulowanych regulaminem stosuje się prawo polskie. Zastrzegamy prawo do zmiany regulaminu; aktualna wersja jest zawsze dostępna na tej stronie, z datą ostatniej aktualizacji.",
    ],
  },
];

export default function Page() {
  return (
    <LegalShell
      title="Regulamin"
      updated="16 lipca 2026"
      intro="Zasady korzystania ze strony HackMySales oraz umawiania bezpłatnej prezentacji systemu."
      sections={sections}
    />
  );
}
