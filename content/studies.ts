/** 10 badań naukowych (AIDA — Desire). Linki KANONICZNE i zweryfikowane
 *  (DOI INFORMS/Elsevier + arXiv) — źródła realne, nie placeholdery. Findings PL
 *  przepuszczone przez deepNbsp (sierotki). Grupy = 3 funkcje setupu. */

import { deepNbsp } from "@/lib/typography";

export type StudyGroup = "search" | "reco" | "chat";

export type Study = {
  id: string;
  group: StudyGroup;
  title: string;
  finding: string;
  metric?: string;
  url: string;
  urlType: "DOI" | "arXiv";
  featured?: boolean;
};

const raw: Study[] = [
  // — Wyszukiwarka —
  {
    id: "genai-sales-productivity",
    group: "search",
    featured: true,
    metric: "+16,3% sprzedaży",
    title: "Generative AI and Sales Productivity: Field Experiments in Online Retail",
    finding:
      "Najszersze dopasowanie do HackMySales: przedsprzedażowy chatbot, ulepszanie zapytań i dopasowanie klientów do produktów. W siedmiu eksperymentach efekt sięgał 16,3% wzrostu sprzedaży — przede wszystkim z wyższej konwersji, nie z większych koszyków.",
    url: "https://arxiv.org/abs/2510.12049",
    urlType: "arXiv",
  },
  {
    id: "recommending-what-to-search",
    group: "search",
    metric: "+1–2% zakupów",
    title: "Recommending What to Search: Sales Volume and Consumption Diversity Effects of a Query Recommender System",
    finding:
      "System podpowiadał użytkownikowi, czego może szukać. Rekomendowane zapytania podniosły liczbę zakupów o około 1–2% w ciągu 30 dni — najmocniej w połączeniu z personalizowanym autouzupełnianiem.",
    url: "https://doi.org/10.1287/mksc.2024.1121",
    urlType: "DOI",
  },
  // — Rekomendacje —
  {
    id: "recommender-causal-mediation",
    group: "reco",
    featured: true,
    metric: "+12,4% zakupów",
    title: "How Do Recommender Systems Lead to Consumer Purchases? A Causal Mediation Analysis of a Field Experiment",
    finding:
      "Jedno z najmocniejszych badań dla ramek rekomendacji: w randomizowanym eksperymencie u sprzedawcy książek personalizowane rekomendacje podniosły skłonność do zakupu o 12,4%, a wartość koszyka o 1,7%.",
    url: "https://doi.org/10.1287/isre.2021.1074",
    urlType: "DOI",
  },
  {
    id: "recommendation-links-demand",
    group: "reco",
    metric: "+11% sprzedaży",
    title: "Measuring the Value of Recommendation Links on Product Demand",
    finding:
      "Randomizowany eksperyment w sklepie odzieżowym: linki rekomendacyjne podniosły odsłony produktów o 7,5%, sprzedaż polecanych zamienników o 9%, a łączną sprzedaż produktu i alternatyw średnio o 11%.",
    url: "https://doi.org/10.1287/isre.2018.0833",
    urlType: "DOI",
  },
  {
    id: "recommendations-help-search",
    group: "reco",
    title: "How Do Product Recommendations Help Consumers Search? Evidence from a Field Experiment",
    finding:
      "Randomizowany eksperyment: rekomendacje uczące się z wyborów innych klientów pomagały znaleźć produkt lepiej dopasowany do gustu, o lepszej wartości lub niższej cenie. To trafniejsze dopasowanie, a nie sama nawigacja, podnosiło szansę zakupu.",
    url: "https://doi.org/10.1287/mnsc.2023.4951",
    urlType: "DOI",
  },
  {
    id: "different-but-equal",
    group: "reco",
    metric: "mocniej na mobile",
    title:
      "Different but Equal? A Field Experiment on the Impact of Recommendation Systems on Mobile and Personal Computer Channels in Retail",
    finding:
      "Randomizowany eksperyment w sklepie internetowym: rekomendacje podniosły wyświetlenia produktów, CTR, sprzedaż i konwersję. Efekt był najmocniejszy na urządzeniach mobilnych, gdzie klient ma wyższe koszty wyszukiwania i mniej miejsca na ekranie.",
    url: "https://doi.org/10.1287/isre.2020.0922",
    urlType: "DOI",
  },
  {
    id: "choice-overload",
    group: "reco",
    metric: "próg nasycenia",
    title: "The Choice Overload Effect in Online Recommender Systems",
    finding:
      "Eksperyment terenowy na 1,6 mln użytkowników: prawdopodobieństwo zakupu najpierw rosło z liczbą rekomendacji, ale po pewnym progu zaczynało spadać. Zbyt wiele podpowiedzi zniechęcało klienta do rozpoczęcia przeglądania ofert.",
    url: "https://doi.org/10.1287/msom.2022.0659",
    urlType: "DOI",
  },
  // — Chatbot —
  {
    id: "ai-assistant-livestream",
    group: "chat",
    featured: true,
    metric: "−12,55% zwrotów",
    title: "Artificial Intelligence (AI) Assistant in Online Shopping: A Randomized Field Experiment on a Livestream Selling Platform",
    finding:
      "Randomizowany eksperyment terenowy: asystent AI odpowiadał na pytania i pomagał przetwarzać informacje o produktach. Sprzedaż wzrosła o 3%, a zwroty spadły o 12,55%.",
    url: "https://doi.org/10.1287/isre.2023.0103",
    urlType: "DOI",
  },
  {
    id: "machines-vs-humans",
    group: "chat",
    metric: "4× skuteczniej",
    title: "Machines vs. Humans: The Impact of Artificial Intelligence Chatbot Disclosure on Customer Purchases",
    finding:
      "Eksperyment terenowy na ponad 6200 klientach: nieujawnione chatboty dorównywały doświadczonym sprzedawcom i były 4× skuteczniejsze od niedoświadczonych pracowników. Zbyt wczesne ujawnienie, że rozmowę prowadzi bot, obniżało zakupy.",
    url: "https://doi.org/10.1287/mksc.2019.1192",
    urlType: "DOI",
  },
  {
    id: "chatbot-anthropomorphism",
    group: "chat",
    title:
      "How Chatbot Anthropomorphism Shapes Customer Purchase Decisions: Evidence from a Field Experiment on a Cosmetic E-Commerce Retailer",
    finding:
      "Eksperyment w rzeczywistym sklepie kosmetycznym: kompetentny styl chatbota lepiej wspierał zakup jednorazowy, a ciepły ton komunikacji zwiększał zakupy subskrypcyjne.",
    url: "https://doi.org/10.1016/j.jretconser.2025.104721",
    urlType: "DOI",
  },
];

export const studies: Study[] = deepNbsp(raw);
