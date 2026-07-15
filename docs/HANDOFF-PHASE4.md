# NORDIC ATHLETE — Handoff til fase 4 (fortsæt her)

Ny session: læs dette dokument top til bund før du rører noget. Fase 1–3 er
færdige og beskrevet i `docs/PHASE2-NOTES.md` og `docs/PHASE3-NOTES.md` — læs dem
også. Dette dokument dækker det, der er tilbage.

---

## 0. TL;DR — hvad fase 4 skal lave (merchant-prioritet)

1. **Produktkort-finpudsning** — ensartet billedformat på tværs af mærker (ingen
   hvide rammer / forskellige aspect ratios), fjern whitespace-uregelmæssigheder. (§3)
2. **Ny og forbedret header + footer.** (§4)
3. **Ny og forbedret forside / hjemmeside.** (§5)
4. **Ny og forbedret kurv (cart).** (§6)

Ingen af disse er påbegyndt. Alt arbejde foregår på duplikat-temaet — se §1.

---

## 1. Kritisk kontekst (gælder ALT arbejde)

- **Butik:** NORDIC ATHLETE — `www.nordic-athlete.dk` (`dqj57y-sm.myshopify.com`).
  Dansk D2C: beskyttende sportstøj (GAMEPATCH) + genoptræning/tilbehør (Bauerfeind,
  Molten, Hummel, PurePower m.fl.). Dansk UI-sprog.
- **Tema:** Shopify **Horizon** (blok-baseret, custom elements + event-bus
  `assets/events.js`). Repo: `Swerv-Manager/nordic-athlete`, branch
  `claude/nordic-athlete-phase3-e46soh` (fortsæt på samme branch, eller opret
  en ny fra den — spørg merchant/hovedsession).
- **SIKKERHED:** ALT arbejde sker på duplikat-temaet
  **`gid://shopify/OnlineStoreTheme/193309901133`** (UNPUBLISHED). **Rør ALDRIG
  live-temaet `190092804429`.** Publicering er en menneskelig handling.
- **Design-tokens (NA 2026):** 80% mørke neutraler (#2a2a2a bg, #131c15 dybest,
  #253020 kort-grøn, kant 1.5px #3a3a3a). Tekst #fff / #a8b8ae (mid) / #76837b
  (dim). Grøn KUN som accent: **#3d7a52** (Atletgrøn — CTA/links/aktiv) og
  **#69E281** (Energigrøn — hover/highlights). Inter overalt; labels UPPERCASE
  700–900, letter-spaced. Radius max 8px.

### Miljø-noter (vigtige — sparer tid)
- **Shopify CLI har ingen storefront-adgang** i cloud-miljøet, OG netværkspolitik
  blokerer `www.nordic-athlete.dk` / `*.myshopify.com` / `cdn.shopify.com`
  (proxy 403) — så **Playwright/WebFetch af preview-URL'er virker IKKE herfra.**
  Verificér i stedet server-side via Admin API + `shopify theme check` lokalt, og
  bed merchant om at kigge på preview-URL'erne. (Hvis en fremtidig session har et
  miljø med storefront-adgang, så kør endelig Playwright-screenshots.)
- **`shopify theme check` virker** lokalt (`npm i -g @shopify/cli` er allerede
  gjort én gang; geninstallér hvis nyt miljø). Kør på ændrede filer før upload.
- **Upload via Admin GraphQL `themeFilesUpsert`** (IKKE CLI). Byg payloads
  programmatisk med `python json.dumps` (ensure_ascii=True) — undgå manuel
  indtastning af Unicode (én tidligere session lavede kyrilliske homoglyffer).
  `docs/build_mutations.py` genererer batches. Batch < 28KB. `.liquid`-filer
  gemmes byte-for-byte (verificér md5); `.json`-skabeloner **kanoniseres** af
  Shopify (banner tilføjes, ugyldige nøgler strippes, nøgler omrokeres) — verificér
  dem semantisk, ikke på md5.
- **Shopify MCP kan flappe / spend-limit kan ramme.** Subagenter startet under et
  udfald får aldrig forbindelsen — tjek forbindelsen i hovedsessionen (lille
  query) før du delegerer, og genoptag subagenter med SendMessage hvis de dør.
- **Delegér store/gentagne API-jobs til subagenter** (fx metafelt-population,
  filupload) og hold indhold ude af hovedkonteksten.

### Arbejdsgang pr. fil-ændring
1. Redigér `.liquid`/`.json` lokalt i repo.
2. `shopify theme check` på de ændrede filer (0 fejl i NA-filer; `OrphanedSnippet`
   på `na-*`-snippets er en kendt falsk positiv — de renderes fra custom-liquid).
3. `md5sum` + `wc -c` lokalt.
4. `themeFilesUpsert` til `193309901133` (delegér til upload-subagent).
5. Verificér remote (md5 for liquid, semantisk for json).
6. Commit + push til branchen. Opdatér `docs/PHASE3-NOTES.md`/dette dokument.

---

## 2. Nuværende tilstand (hvad virker allerede)

- **PDP:** universel skabelon `product.gamepatch-2026` drevet af `custom.pdp_*`
  produkt-metafelter (badge, eyebrow, fit-note, kort/fuld beskrivelse, teknologi-
  zoner, størrelsesguide-rækker, bundle). Sektioner skjuler sig uden data. Størrelses-
  guider populeret for tights/shorts/armsleeves/knæbeskyttere/Bauerfeind-strømper.
- **Kollektionssider:** `collection.json` (standard for alle) = 2026-design:
  `na-collection-hero` (banner+trustbar) → `na-gamepatch-skin` → `na-collection-filters`
  (alle S&D-listefiltre) → `main-collection` → `na-collection-seo` → `na-collection-faq`.
  SEO-titler/beskrivelser + `custom.seo_text` + `custom.faqs` sat på alle 18 kollektioner.
- **Ambassadører:** 9 sider (metaobjekt `ambassador` + side m. `templateSuffix
  ambassador`), fuld artikeltekst i `story`-feltet. Se PHASE3-NOTES §5 for GID'er.
- **Kort:** `snippets/na-card-extras.liquid` giver brand-eyebrow + renset titel +
  badge + kropszone/type-linje + quick-add. Renderes fra custom-liquid inde i
  `blocks/_product-card.liquid`. **Se §3 — billedformat er endnu ikke ensartet.**

---

## 3. Opgave 1 — Produktkort-finpudsning

**Problem (fra merchant):** produktkort har uensartet whitespace og forskellige
billedformater. GAMEPATCH-produkter er mørke studieshots i ét format; Molten/
Sportson/PurePower m.fl. er hvide pakshots i andre ratios → kortene ser rodede
ud i blandede grids (fx forsiden og "Udstyr"-kollektionen).

**Hvor:**
- `snippets/na-card-extras.liquid` — NA's kort-overlay (brand, titel, badge, zone,
  quick-add). `.na-cardx-media` er billed-wrapperen.
- `blocks/_product-card.liquid` + `snippets/product-grid.liquid` — Horizons kort/grid.
- Kort-billedratio styres i høj grad af Horizons egne indstillinger
  (`image_ratio`/adapt) i `main-collection`/`featured-collection`-sektionerne og
  af `snippets/util-product-grid-card-size.liquid`.
- NA kort-styling ligger template-scoped i `sections/na-gamepatch-skin.liquid`
  (kollektion) — dvs. CSS for kortene bor DÉR, ikke i `na-card-extras`.

**Anbefalet tilgang:** tving en fast aspect-ratio på kort-billedet (fx 1:1 eller
4:5) med `object-fit: cover` OG en ensartet lys/mørk billedbaggrund, så hvide
pakshots ikke giver blanke rammer. Overvej `object-fit: contain` + neutral
baggrund (#fff eller #f5f5f5 boks) KUN hvis merchant vil bevare hele pakshottet;
ellers `cover`. Afklar med merchant: beskær (cover) vs. vis-hele (contain)?
Test på "Udstyr"/forsiden hvor mærker blandes.

**Gotcha:** titel-split er render-only (`na-card-extras`) — produkttitler i Shopify
må ikke ændres (SEO/feeds). Undertitel-linjen reserveres allerede (nbsp) så kort
flugter — bevar det.

---

## 4. Opgave 2 — Ny header + footer

**Nuværende opsætning:**
- **Header** (`sections/header-group.json`): `header-announcements` +
  Horizons stock `header.liquid` (~48KB, uændret). Der er en NA-header-CSS-fil
  `assets/na-header-custom.css` (loades globalt) — fase 1-styling oven på stock.
- **Footer** (`sections/footer-group.json`): **tre** sektioner stablet —
  `na-footer.liquid` (custom, 13KB) + Horizons `footer.liquid` + `footer-utilities.liquid`.
  Dette er sandsynligvis en del af hvorfor footeren trænger til oprydning.

**Anbefalet tilgang:** byg enten en fuld custom `na-header.liquid` (som `na-footer`)
i 2026-designet, eller udvid `na-header-custom.css` markant. Beslut med merchant
om ét eller flere af de tre footer-lag skal fjernes (dobbelt-footer?). Behold
Horizons drawer/mega-menu-funktionalitet (kurv-drawer, predictive search) —
byg ovenpå, lav ikke funktionalitet om fra bunden. Kurv-ikonets tal opdateres
via temaets `cart:update`-event (se §6/gotcha).

**Gotchas:** header-drawer + mega-menu ligger i store snippets
(`snippets/header-drawer.liquid` 57KB, `snippets/mega-menu-list.liquid`). Rør
kun det nødvendige. Announcements-baren har egen sektion.

---

## 5. Opgave 3 — Ny forside / hjemmeside

**Nuværende `templates/index.json` rækkefølge:** 2× custom-liquid → `na-sport-collection`
→ `na-featured-product` → 2× `featured-collection` → `product-list` → 3×
`na-image-with-text` → `multicolumn-why` → `multicolumn-reviews` → custom-liquid.

**Genbrugelige NA-byggeklodser der allerede findes:**
`na-featured-product`, `na-featured-collection` (OBS: `sections/na-featured-collection.liquid`
er TOM — 0 bytes; skal bygges eller fjernes fra brug), `na-sport-collection`,
`na-image-with-text`, `na-collection-hero` (banner). Trust-strip/butiksfakta-
mønsteret fra `na-collection-hero` kan genbruges (jf. PHASE3-NOTES §8-ideen om
sitewide trust-strip).

**Anbefalet tilgang:** afklar med merchant hvad forsiden skal fortælle (hero →
ambassadører → GAMEPATCH-kollektion → trust → anmeldelser?). Byg nye `na-*`
forside-sektioner efter behov, metafelt-/indstillings-drevet i samme ånd som
resten (indhold via settings/metaobjekter, ikke hardcodet). Ambassadør-metaobjekterne
kan drive en "mød atleterne"-sektion. Genbrug design-tokens (§1).

---

## 6. Opgave 4 — Ny kurv (cart)

**Nuværende `templates/cart.json`:** `main-cart` + et `product-list`
("måske-du-mangler"). Ingen NA-custom cart endnu — den er stadig Horizon-stock.

**Anbefalet tilgang:** byg NA-styling/opsæt i 2026-designet — enten en
`na-cart-skin`-sektion (usynlig, template-scoped CSS som `na-pdp-skin`/
`na-gamepatch-skin`) der styler stock-kurven, eller custom cart-sektioner. Overvej:
fri-fragt-progressbar (>600 kr), trust-badges, "andre købte også" (findes allerede
via product-list), bundle-cross-sell.

**KRITISK gotcha — cart AJAX-protokol (nedarvet):** brug temaets `cart:update`-
protokol. POST til `Theme.routes.cart_add_url` med `sections` = joined
`data-section-id` fra alle `cart-items-component`; dispatch
`CustomEvent('cart:update', {detail: {resource: cartJson, sourceId, data:
{source: '<ikke product-form-component>', itemCount, sections}}})`. Reference-
implementeringer: `sections/na-gamepatch-skin.liquid` (single item),
`sections/na-pdp-bundle.liquid` (items-array), `sections/na-ambassador-setup.liquid`
(quick-add). Kurv-drawer/-ikon lytter på denne event — bryd den ikke.

---

## 7. Nøgle-ID'er (opslag)

- Duplikat-tema (arbejd her): `gid://shopify/OnlineStoreTheme/193309901133`
- Live-tema (RØR IKKE): `gid://shopify/OnlineStoreTheme/190092804429`
- Metaobjekt-def `ambassador`: `gid://shopify/MetaobjectDefinition/34781495629`
  (felter inkl. `story` fra fase 3b)
- Metaobjekt-def `faq_item`: `gid://shopify/MetaobjectDefinition/34796306765`
- Produkt-metafelter: namespace `custom`, nøgler `pdp_*` + `hero_*` (kollektion)
  + `seo_text`/`faqs` (kollektion). Alle PUBLIC_READ, pinned.
- Ambassadør-GID'er: se PHASE3-NOTES §5. Kollektions-GID'er: se
  scratchpad `collection-content.json` fra fase 3 (eller query `collections`).
- Hero-PDP (test-produkt): GAMEPATCH 3/4 TIGHTS PADDED HOFTE/KNÆ —
  `gid://shopify/Product/10522876608845`, suffix `gamepatch-pants` (skiftes til
  `gamepatch-2026` ved go-live).

## 8. Stående udeståender (uændret — menneskelige beslutninger)

- **Go-live:** publicér tema `193309901133`, sæt `templateSuffix = gamepatch-2026`
  på produkter der skal have den nye PDP, verificér Search & Discovery-filtre.
  Ambassadørsider er publiceret men nær-tomme på live-temaet indtil publish.
- **Backup-branch `claude/new-session-3y7iah`** i `swerv-platform-core` kunne ikke
  slettes af sessionen (GitHub 403 på ref-deletion) — slet manuelt i UI. Alt
  indhold er bevaret i dette repo.
- Bundle-besparelse (`savings_amount`) kun ved reel admin-rabat. Anmeldelser er
  brand-niveau indtil en anmeldelses-app tilføjes. Legacy `assets/na-product-page.css`
  ikke ryddet op.
- To kilde-typoer i blogartikler til editorial-pass: "EaceGum" (Kristian Høegh),
  garbled sætning i Mads-Emil Rølls artikel.
