import { test, expect } from "@playwright/test";
import { gotoAndSettle } from "../helpers";
import { pl } from "../../content/pl";

/** Mobilny hero (rewizja AIDA): żywy artefakt 3 funkcji (HeroDemo) zamiast dawnej
 *  karty HeroChatMobile. Kontrakt: 3 zakładki (Wyszukiwarka / Rekomendacje / Chat)
 *  widoczne, a artefakt pokazuje treść od razu (nie puste okno). */

test("mobilny hero: artefakt 3 funkcji z zakładkami", async ({ page }) => {
  await gotoAndSettle(page);
  const hero = page.locator("#top");
  await expect(hero, "sekcja hero istnieje").toBeVisible();

  // 3 zakładki demo widoczne
  for (const label of pl.hero.demoTabs) {
    await expect(hero.getByRole("button", { name: label }).first(), `zakładka ${label}`).toBeVisible();
  }

  // artefakt pokazuje treść (bąbel czatu / wynik) — okno nie jest puste
  const hasContent = await page.evaluate(() => {
    const root = document.querySelector("#top");
    return !!root?.querySelector(".chat-msg, .pp-row, .reco-card");
  });
  expect(hasContent, "artefakt hero pokazuje treść (czat/wynik/rekomendacja)").toBe(true);
});
