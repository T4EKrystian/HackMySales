import type { Metadata } from "next";
import { LegalShell, type LegalSection } from "@/components/sections/LegalShell";

export const metadata: Metadata = {
  title: "Polityka prywatności — HackMySales",
  description: "Jak przetwarzamy dane osobowe zebrane przez HackMySales (Time4Ecommerce).",
  alternates: { canonical: "/polityka-prywatnosci" },
};

// UWAGA: szablon do potwierdzenia przez dział prawny. Dane w [nawiasach] uzupełnia właściciel.
const sections: LegalSection[] = [
  {
    h: "Administrator danych",
    body: [
      "Administratorem Twoich danych osobowych jest Time4Ecommerce [pełna nazwa firmy], [adres siedziby], NIP [NIP], operator serwisu HackMySales.",
      "W sprawach dotyczących danych osobowych napisz na kontakt@hackmysales.pl.",
    ],
  },
  {
    h: "Jakie dane zbieramy",
    body: [
      "Dane z formularza kontaktowego: imię, nazwisko, adres e-mail, numer telefonu, adres strony sklepu oraz treść wiadomości.",
      "Dane techniczne zbierane automatycznie: adres IP, typ przeglądarki i urządzenia, informacje o sposobie korzystania ze strony (analityka), pliki cookies.",
    ],
  },
  {
    h: "Cel i podstawa prawna przetwarzania",
    body: [
      "Kontakt i przygotowanie prezentacji systemu — na podstawie art. 6 ust. 1 lit. b RODO (podjęcie działań na Twoje żądanie) oraz lit. f (nasz prawnie uzasadniony interes: obsługa zapytania).",
      "Analityka i poprawa działania serwisu — na podstawie art. 6 ust. 1 lit. a RODO (Twoja zgoda na cookies analityczne) lub lit. f.",
      "Marketing bezpośredni własnych usług — wyłącznie za Twoją zgodą, którą możesz wycofać w każdej chwili.",
    ],
  },
  {
    h: "Okres przechowywania",
    body: [
      "Dane z formularza przechowujemy przez czas niezbędny do obsługi zapytania, a następnie przez okres przedawnienia ewentualnych roszczeń, chyba że wyrazisz zgodę na dłuższy kontakt.",
      "Dane analityczne przechowujemy zgodnie z ustawieniami narzędzi analitycznych — szczegóły w sekcji o plikach cookies.",
    ],
  },
  {
    h: "Odbiorcy danych",
    body: [
      "Dane mogą być powierzane zaufanym dostawcom działającym na nasze zlecenie: dostawcy hostingu (serwery w Unii Europejskiej), usłudze obsługi formularza i poczty, narzędziom analitycznym.",
      "Z każdym z takich podmiotów zawieramy umowę powierzenia przetwarzania danych (DPA). Nie sprzedajemy Twoich danych.",
    ],
  },
  {
    h: "Przekazywanie poza EOG",
    body: [
      "Dążymy do przetwarzania danych na terenie Europejskiego Obszaru Gospodarczego. Jeśli którykolwiek dostawca przetwarza dane poza EOG, odbywa się to na podstawie odpowiednich zabezpieczeń (np. standardowych klauzul umownych).",
    ],
  },
  {
    h: "Twoje prawa",
    body: [
      "Masz prawo do: dostępu do danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, przenoszenia danych oraz wniesienia sprzeciwu wobec przetwarzania.",
      "Masz prawo cofnąć zgodę w dowolnym momencie oraz wnieść skargę do Prezesa Urzędu Ochrony Danych Osobowych (PUODO).",
      "Aby skorzystać z praw, napisz na kontakt@hackmysales.pl.",
    ],
  },
  {
    h: "Pliki cookies",
    body: [
      "Używamy plików cookies niezbędnych do działania serwisu oraz — za Twoją zgodą — cookies analitycznych, które pomagają nam ulepszać stronę.",
      "Ustawieniami cookies zarządzasz w swojej przeglądarce; możesz je w każdej chwili zablokować lub usunąć.",
    ],
  },
  {
    h: "Zmiany polityki",
    body: [
      "Politykę możemy aktualizować, gdy zmienią się przepisy lub sposób działania serwisu. Aktualna wersja jest zawsze dostępna na tej stronie, z datą ostatniej aktualizacji na górze.",
    ],
  },
];

export default function Page() {
  return (
    <LegalShell
      title="Polityka prywatności"
      updated="16 lipca 2026"
      intro="Dbamy o Twoją prywatność. Poniżej wyjaśniamy, jakie dane zbieramy przez stronę HackMySales, w jakim celu i jakie masz prawa."
      sections={sections}
    />
  );
}
