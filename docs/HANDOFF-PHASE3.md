# NORDIC ATHLETE — Handoff til fase 3 (fortsæt her)

Ny session: læs dette dokument top til bund før du rører noget. Det afløser
fase 2-delen af det oprindelige `HANDOFF.md` (fase 1-dokumentet); fase 1-afsnittene
om brand, designsystem og gotchas gælder stadig og er opsummeret i §6.

---

## 0. TL;DR — hvad fase 3-sessionen skal gøre først

1. **Pull hele temaet** (duplikat-tema `193309901133`) ind i det nye repo
   `Swerv-Manager/nordic-athlete-theme` som baseline-commit (§3).
2. **Læg de 11 fase 2-filer oven på** (de ligger klar to steder, §2) og commit.
3. **Upload de 11 filer til temaet** via Admin GraphQL `themeFilesUpsert` (§4).
4. **Verificér** preview-URL'erne renderer korrekt (§5) — gerne med
   Playwright-screenshots (desktop + mobil).
5. **Ryd op:** slet branchen `claude/new-session-3y7iah` i
   `swerv-manager/swerv-platform-core` (den var kun en nød-backup).

Fase 2 er FÆRDIGBYGGET og lintet (`shopify theme check`: 0 fejl i de nye filer)
— den blev bare aldrig uploadet, fordi Shopify MCP-forbindelsen døde midt i
sessionen. Intet skal om-designes.

---

## 1. Projekt-kontekst (kort)

- **Butik:** NORDIC ATHLETE — `www.nordic-athlete.dk` (`dqj57y-sm.myshopify.com`).
  Dansk D2C: beskyttende sportstøj (GAMEPATCH) til håndbold/basket.
- **Tema-arkitektur:** Shopify **Horizon** (theme store id 2481), blok-baseret,
  custom elements + event-bus (`assets/events.js`).
- **SIKKERHED:** Alt arbejde sker på **duplikat-temaet `193309901133`**
  ("Kopi af Swerv // April 2026 Nyt design - Nye fa...", UNPUBLISHED).
  **Rør ALDRIG live-temaet `190092804429`.** Publicering er en menneskelig
  handling og er udskudt.
- **Design-referencer:** mockups + designsystem ligger i brugerens
  `nordic-athlete-phase2-handoff.zip` (bed brugeren vedhæfte den igen, hvis du
  skal sammenligne visuelt). Farver: 80% mørke neutraler (#2a2a2a, #131c15,
  kort #253020, kant 1.5px #3a3a3a), tekst #fff/#a8b8ae/#76837b, grøn KUN som
  accent: #3d7a52 (Atletgrøn — CTA/links/aktiv) og #69E281 (Energigrøn —
  hover/highlights). Inter overalt; labels UPPERCASE 700–900, letter-spaced.
  Radius max 8px. Dansk UI-sprog.

## 2. Status: hvad er hvor

**Allerede PÅ temaet (fase 1, færdigt):** kollektionssiden
(`collection.gamepatch-2026` + `na-collection-hero`, `na-gamepatch-skin`,
`na-collection-filters`, `na-card-extras`, `na-filter-chip`).

**Bygget i fase 2 men ENDNU IKKE uploadet — 11 filer:**

| Fil | Bytes |
|---|---|
| sections/na-pdp-skin.liquid | 8.933 |
| snippets/na-pdp-extras.liquid | 5.098 |
| sections/na-pdp-technology.liquid | 7.054 |
| sections/na-pdp-size-guide.liquid | 5.657 |
| sections/na-pdp-reviews.liquid | 8.420 |
| sections/na-pdp-bundle.liquid | 11.049 |
| templates/product.gamepatch-2026.json | 22.932 |
| sections/na-ambassador-hero.liquid | 5.268 |
| sections/na-ambassador-setup.liquid | 13.095 |
| sections/na-ambassador-story.liquid | 6.032 |
| templates/page.ambassador.json | 1.123 |

De ligger to steder (identiske):
1. **Git-backup:** `swerv-manager/swerv-platform-core`, branch
   `claude/new-session-3y7iah`, mappe `nordic-athlete-theme-phase2/`
   (commit `3da3f321`). Indeholder også `PHASE2-NOTES.md` (detaljeret
   beskrivelse af hver fil) og `upload/build_mutations.py`.
2. **Brugerens zip:** `nordic-athlete-phase2-output.zip` (sendt i chatten
   14/7 2026) — samme filer + 4 færdigbyggede `themeFilesUpsert`-mutations.

**Allerede oprettet PÅ BUTIKKEN i fase 2 (kræver ingen gentagelse):**
- Metaobjekt-definition `ambassador` — `gid://shopify/MetaobjectDefinition/34781495629`
  (storefront PUBLIC_READ; felter: name, career_line, club, hero_image, headline,
  headline_accent, intro, quote, products [list.product_reference],
  product_details [list.single_line_text, index-matchet], match_tag_count [int]).
- Metaobjekt-entry `victoria-moerk` — `gid://shopify/Metaobject/350848188749`
  (Victorias data; produkter: tights 899 + undertrøje 699 + knæbeskytter 349 = 1.947 kr).
- Side-metafelt-definition `custom.ambassador` (PAGE, metaobject_reference,
  PUBLIC_READ, pinned) — `gid://shopify/MetafieldDefinition/391339835725`.
- Side **`/pages/victoria-moerk`** — `gid://shopify/Page/162292236621`,
  publiceret, `templateSuffix: "ambassador"`, metafelt peger på Victoria.

**Nøgle-produkter:**
- Hero-PDP: GAMEPATCH 3/4 TIGHTS PADDED HOFTE/KNÆ —
  `gid://shopify/Product/10522876608845`, handle
  `gamepatch-3-4-tights-padded-hofte-knae`, 899 kr, str. S–2XL,
  nuværende templateSuffix `gamepatch-pants` (skiftes til `gamepatch-2026`
  først ved go-live, §7).
- Bundle-companion: GAMEPATCH KNÆBESKYTTER — `gid://shopify/Product/10481086792013`, 349 kr.
- Ambassadør-produkt 2: GAMEPATCH PADDED UNDERTRØJE — `gid://shopify/Product/10482497847629`, 699 kr.

## 3. Pull hele temaet til det nye repo

Shopify CLI har ingen auth i cloud-miljøet — brug **Admin GraphQL via Shopify
MCP** (`mcp__Shopify__graphql_query`). Delegér til subagents (indholdet er
stort; hold det ude af hovedkontexten):

```graphql
query {
  theme(id: "gid://shopify/OnlineStoreTheme/193309901133") {
    files(first: 50, after: <cursor>) {
      nodes {
        filename
        body {
          ... on OnlineStoreThemeFileBodyText { content }
          ... on OnlineStoreThemeFileBodyUrl { url }
        }
      }
      pageInfo { hasNextPage endCursor }
    }
  }
}
```

- ~250 filer i alt. Tekst kommer inline; binære filer (png/jpg) kommer som
  signeret `url` → hent med `curl`.
- OBS: én subagent kan ikke rumme alt indhold (~2,5 MB) — fordel på flere
  agenter (fx pr. mappe) eller batch småt og skriv direkte til disk.
- Commit som "Baseline: fuldt tema 193309901133", læg derefter de 11 fase
  2-filer oven på og commit separat. Push til `Swerv-Manager/nordic-athlete-theme`.

## 4. Upload de 11 filer til temaet

```graphql
mutation {
  themeFilesUpsert(
    themeId: "gid://shopify/OnlineStoreTheme/193309901133",
    files: [{ filename: "...", body: { type: TEXT, value: "..." } }, ...]
  ) {
    upsertedThemeFiles { filename }
    userErrors { field message }
  }
}
```

- Indlejr indholdet som JSON-escaped GraphQL-streng (python `json.dumps`) —
  `upload/build_mutations.py` i backup-branchen genererer batches automatisk.
  Zippen indeholder allerede 4 færdige batches (à < 28 KB).
- Efter upload: verificér med `theme(...).files(filenames: [...]) { filename size checksumMd5 }`
  og sammenlign md5 mod lokale filer (`md5sum`).

## 5. Verifikation (før man siger "færdig")

Preview-URL'er (virker uden login for upubliceret tema):
- **PDP:** `https://www.nordic-athlete.dk/products/gamepatch-3-4-tights-padded-hofte-knae?preview_theme_id=193309901133&view=gamepatch-2026`
- **Ambassadør:** `https://www.nordic-athlete.dk/pages/victoria-moerk?preview_theme_id=193309901133`

Tjekliste:
- PDP: badges (Officiel partner + "Kun X tilbage" på str. med lavt lager — S har ~7),
  grøn eyebrow, rating-link scroller til #anmeldelser, pris 899,00 kr + "✓ Fri
  fragt", str.-knapper skifter variant og lager-badgen opdaterer, leveringsboks,
  grøn CTA, IKKE nogen antal-vælger, teknologi/størrelsesguide/anmeldelser/
  bundle-sektioner renderer mørkt, "Andre købte også" nederst, sticky
  køb-bar på scroll (mørk + grøn CTA).
- Bundle: vælg størrelser i begge selects → "Læg bundle i kurv" lægger BEGGE
  varer i kurven, kurv-ikonets tal opdaterer (temaets `cart:update`-event).
- Ambassadør: hero med Victorias foto + navneskilt, "Shop Victorias setup ↓"
  scroller til #setup, 3 produktkort med "Bruges i kamp" på de første 2,
  størrelses-quick-add virker, samlet pris 1.947 kr, story + stats, sticky bund-bar.
- Mobil (390px): alt 1-kolonne, sticky bars synlige.
- Kør `shopify theme check` lokalt på det fulde pull (npm i -g @shopify/cli
  virker i miljøet) — de 11 nye filer var fejlfrie ved aflevering; hold dem sådan.

Playwright er præinstalleret (executablePath `/opt/pw-browsers/chromium`).
Screenshot-script fra fase 2 (kan genskabes på 2 min): goto URL → networkidle →
luk cookie-banner → fullPage screenshot for de 2 sider × desktop/mobil.

## 6. Gotchas (nedarvet fra fase 1 + nye fra fase 2)

1. **Cart AJAX:** brug temaets `cart:update`-protokol — POST til
   `Theme.routes.cart_add_url` med `sections` = joined `data-section-id` fra alle
   `cart-items-component`, dispatch `CustomEvent('cart:update', {detail: {resource:
   cartJson, sourceId, data: {source: '<ikke product-form-component>', itemCount,
   sections}}})`. Reference-implementeringer: `sections/na-gamepatch-skin.liquid`
   (single item), `sections/na-pdp-bundle.liquid` (items-array),
   `sections/na-ambassador-setup.liquid` (quick-add).
2. **Variantskift morpher KUN variant-pickeren**, ikke hele product-details —
   custom UI der skal reagere på variantskift lytter på `variant:update`
   (se lager-badgen i `snippets/na-pdp-extras.liquid`).
3. **Horizon lægger radio-input INDE i `.variant-option__button-label`** —
   styling af valgt tilstand kræver `:has(input:checked)` (se `na-pdp-skin`).
4. **Pris dobbelt-render:** `.price__hidden { display:none }` SKAL bevares.
5. **Titel-split er render-only** (`remove_first: 'GAMEPATCH'`) — produkttitler
   i Shopify må ikke ændres (SEO/feeds).
6. **Bundle-besparelse:** `savings_amount` i bundle-sektionen er bevidst 0.
   Sæt den KUN når en tilsvarende automatisk rabat findes i admin — ellers er
   "Spar X kr" vildledende.
7. **Anmeldelses-fordelingen er brand-niveau** (ingen anmeldelses-app skriver
   `reviews.rating`). Ægte pr.-produkt-tal kræver app-integration først — flag
   til merchant, digt ikke tal.
8. **Ambassadør-skabelonen er delt på tværs af atleter** — al athlete-specifik
   tekst skal komme fra metaobjektet eller bruge `[navn]`-pladsholderen
   (erstattes med fornavn i Liquid). Ny atlet = nyt metaobjekt + ny side med
   templateSuffix `ambassador` + metafelt sat. Ingen kode.
9. **`custom.*`-metafelter/metaobjekter til storefront skal have
   `PUBLIC_READ`** storefront-adgang, ellers er de usynlige i Liquid.
10. **Gammel `assets/na-product-page.css`** (Alchemy-æra) loades stadig globalt
    fra `theme.liquid` linje ~51. De fleste selektorer matcher ikke Horizon.
    Kan ryddes op, men test på `gamepatch-pants`-skabelonen først (den bruger
    stadig `.na-accordion`-klasserne derfra).
11. **Miljø:** Shopify MCP kan flappe. Subagents startet under et udfald får
    ALDRIG forbindelsen — tjek forbindelsen i hovedsessionen (lille query) før
    du delegerer upload-arbejde.

## 7. Go-live (menneskelige handlinger — når ALT er godkendt)

1. Merchant publicerer tema `193309901133`.
2. Sæt templateSuffix:
   - Collection "Officiel Gamepatch butik" (`gid://shopify/Collection/653355057485`)
     → `gamepatch-2026` (fase 1).
   - PDP: tights-produkt(er) → `gamepatch-2026`.
   - Ambassadør: `/pages/victoria-moerk` har allerede sit suffix; routér
     Meta-annoncer til URL'en.
3. Verificér Search & Discovery-filtrene stadig er aktive efter publish.
4. Beslut bundle-rabat (gotcha 6) og evt. anmeldelses-app (gotcha 7).

## 8. Mulige fase 3-emner (fra site-improvements-overview, ikke påbegyndt)

- Version af ambassadørsiden til Dainis Kristopans (kun data: metaobjekt + side).
- PDP-anmeldelser som karrusel; teknologi-sektion på mobil.
- Sitewide: genbrug af trust-strip på flere sider; oprydning af legacy CSS (gotcha 10).
