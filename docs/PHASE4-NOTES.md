# Fase 4 — Produktkort, header/footer, forside, kurv (gennemført)

Alt arbejde ligger fortsat på duplikat-temaet **193309901133** — intet er publiceret.
Live-temaet 190092804429 er urørt. Se HANDOFF-PHASE4.md for opgavebeskrivelserne.

## 1. Opgave 1 — Ensartede produktkort (billedformat/whitespace)

**Problemet:** GAMEPATCH = mørke studieshots; Molten/Hummel/Bauerfeind m.fl. = hvide
pakshots i blandede aspect ratios (1:1, 4:5, 3:4, endda landscape) → hvide kasser og
uens whitespace i blandede grids.

**Løsningen (cover-varianten fra HANDOFF §3):**
- **`assets/na-cards.css` (NY, global):** al NA-kortstyling er flyttet hertil fra
  `na-gamepatch-skin` (kort-ramme, eyebrow/titel/zone, badge, pris-normalisering,
  quick-add overlay) + NYT: medie-zonen tvinges **kvadratisk** (overstyrer Horizons
  inline `--gallery-aspect-ratio` med `!important`), billeder får `object-fit: cover`,
  og medie-flisen får ensartet lys baggrund `#f5f5f3` med `mix-blend-mode: multiply`
  på billederne — hvide pakshot-baggrunde smelter ind i flisen i stedet for at stå
  som hvide kasser. Gælder ALLE `.product-card`-kort (kollektion, søgning,
  product-list, anbefalinger).
- **`assets/na-cards.js` (NY, global, defer):** quick-add JS flyttet 1:1 fra
  na-gamepatch-skin (samme cart:update-protokol), så quick-add virker overalt hvor
  `na-card-extras` renderes.
- **`sections/na-gamepatch-skin.liquid`:** slanket til kun sidebaggrund (body #2a2a2a).
- **`sections/featured-collection.liquid`** (den custom NA-karusel på forsiden/PDP):
  billedområdet ændret fra mørk ramme + `contain` til samme lyse flise + `cover` +
  multiply som resten.
- `layout/theme.liquid`: loader na-cards.css + na-cards.js globalt.

**Bevidst valg:** cover (beskær) frem for contain (vis-hele) — jf. HANDOFF §3-anbefaling.
Vil merchant hellere bevare hele pakshottet: skift `object-fit` til `contain` i
na-cards.css og featured-collection.liquid (flisen gør at det stadig ser ensartet ud).

## 2. Opgave 2 — Header + footer

**Header:**
- `assets/na-header-custom.css` **omskrevet fra bunden**. Den gamle fil havde en
  ulukket `@media`-blok fra linje 26, så ALLE mobil-regler var fanget inde i
  `min-width:750px` og blev aldrig anvendt. Ny fil: menulinks i NA-toner med grøn
  hover-underlinje, kurv-knap som grøn CTA (Atletgrøn, Energigrøn hover) med mørk
  tæller-cirkel, søge-/konto-ikoner dim→hvid, announcement-bar-typografi. Horizons
  drawer/mega-menu/predictive search er urørt (vi styler kun ovenpå).
- `sections/header-group.json`: announcement-baren **genaktiveret** (var disabled)
  med "Dag til dag levering" + NY "Fri fragt over 600 kr" + "30 dages returret".
  ("Håndlavet i Europa"-blokken består men er fortsat disabled.)

**Footer (dobbelt-footer fjernet):**
- `sections/footer-group.json`: `na-footer` **genaktiveret** (var disabled!) og
  konfigureret med 3 link-kolonner fra rigtige menuer: `sidefods-menu-2` ("Shop"),
  `help-support` ("Hjælp & support"), `our-policy` ("Vores politik") + kontaktdata,
  betalings-badges og copyright. Horizons stock `footer` + `footer-utilities` er
  sat til `disabled: true` (indhold bevaret — kan genaktiveres i editoren).
- Sociale medier-URL'er er IKKE sat (ukendte) — ikonrækken skjuler sig selv.

## 3. Opgave 3 — Ny forside

`templates/index.json` er genopbygget. Ny rækkefølge:

1. **`na-hero` (NY sektion)** — settings-drevet erstatning for custom-liquid-heroen:
   eyebrow, richtext-titel (em = grøn), undertekst, 2 CTA'er, 3 stats, billede
   (image_picker + fallback-URL = det eksisterende manuscdn-foto), atlet-badge
   (Dainis Kristopans). OBS: badge-navnet og fotoet bør afstemmes af merchant —
   det gamle hero havde alt-tekst "Magnus Stilling" men badge "Dainis Kristopans".
2. **`na-trust-strip` (NY sektion)** — slank butiksfakta-bar (4,9/5 · 1–2 dage ·
   fri fragt over 600 · 30 dages retur). Genbrugelig sitewide.
3. `na-sport-collection` — uændret ("Find udstyr til din sport").
4. **`na-featured-collection`** — Shop GAMEPATCH (samme indstillinger som før; den
   tomme 0-byte sektionsfil er nu fyldt med den rigtige NA-karusel-kode, og
   skabelonen peger på den i stedet for stock-navnet `featured-collection`).
5. **`na-ambassadors` (NY sektion)** — "Mød atleterne": blokke der peger på
   ambassadørSIDER; navn/karriere/klub/foto hentes automatisk fra sidens metafelt
   `custom.ambassador` → metaobjektet. Konfigureret med Victoria, Magnus, Kristian,
   Laura. Ny atlet = ny blok i editoren, ingen kode. Link → /blogs/nyheder.
6. `multicolumn-why` — **genaktiveret** (var disabled, indhold fandtes allerede).
7. **`na-featured-collection`** — Shop Træningsudstyr (som før, ny sektionstype).
8. `multicolumn-reviews` — **genaktiveret** (var disabled, indhold fandtes allerede).
9. **`na-team` (NY sektion)** — "Menneskerne bag brandet" (Jonas & John) som
   settings-drevne person-blokke (fallback-URL'er = de gamle manuscdn-fotos).

**Fjernet fra skabelonen** (bevares i git-historik): 2× custom-liquid (hero/team,
erstattet af na-hero/na-team), disabled custom-liquid trustbar, disabled
na-featured-product, disabled product-list, 3× na-image-with-text (atlet-historier —
dækkes nu af na-ambassadors).

**OBS billeder:** hero- og team-fotos er stadig eksternt hostet (files.manuscdn.com)
via fallback-URL-settings. Anbefaling til merchant: upload fotos i theme editor
(image_picker-felterne overstyrer fallbacken).

## 4. Opgave 4 — Ny kurv

- **`sections/na-cart-skin.liquid` (NY)** — usynlig skin-sektion (mønster som
  na-pdp-skin): NA 2026-styling af Horizons stock-kurv (mørk side, hvide varelinjer,
  lys medie-flise + multiply som kortene, mørkt opsummeringspanel, grøn checkout-CTA,
  mørke antal-vælgere/rabatfelt, stylet tom-kurv). Renderer derudover:
  - **Fri fragt-progressbar** (grænse = indstilling, default 600 kr): "Køb for X kr
    mere og få fri fragt" → "Du har fri fragt 🎉". Opdateres live ved at LYTTE på
    temaets `cart:update`-event (protokollen brydes ikke) — virker både ved
    antal-ændringer på kurvsiden og quick-add andre steder.
  - **Trust-række** (1–2 dages levering · 30 dages fri retur · sikker betaling).
- `templates/cart.json`: na-cart-skin indsat FØRST, titel "Cart" → **"Kurv"**,
  product-list-overskrift "You may also like" → **"Måske mangler du"**.

## 5. Verifikation

- `shopify theme check`: 0 fejl i alle ændrede/nye filer. Eneste offenses:
  `UnknownFilter 'push'` i featured-collection.liquid + kopien na-featured-collection
  — PRE-EXISTING kode der allerede kører live på duplikat-temaet (falsk positiv,
  theme-check kender ikke `push`-filteret).
- Upload via `themeFilesUpsert` til 193309901133 i 10 ASCII-escapede batches
  (docs/build_mutations.py-mønstret); md5-verificeret remote for .liquid/.css/.js,
  semantisk verificeret for .json (Shopify kanoniserer).
- **NY gotcha (vigtig for fremtidige uploads):** upload SEKTIONSFILER FØR de
  JSON-skabeloner der bruger dem. index.json blev først uploadet før
  na-featured-collection.liquid fandtes på temaet → Shopifys skabelon-validering
  strippede ALLE settings for de to na-featured-collection-sektioner (uden fejl!).
  Løst ved at gen-uploade index.json bagefter; remote matcher nu lokal md5 1:1.

## 6. Udeståender / menneskelige beslutninger

- **Merchant-review af preview** (miljøet kan ikke se storefronten — jf. HANDOFF §1):
  - Forside: `https://www.nordic-athlete.dk/?preview_theme_id=193309901133`
  - Kurv: `https://www.nordic-athlete.dk/cart?preview_theme_id=193309901133`
  - Kollektion (blandede mærker): `https://www.nordic-athlete.dk/collections/kroppen?preview_theme_id=193309901133`
- Beskær (cover) vs. vis-hele (contain) på kortbilleder: cover er valgt (HANDOFF-
  anbefaling) — let at skifte, se §1 ovenfor.
- Hero-badge (Dainis Kristopans) vs. hero-foto: afstem navn/foto.
- Upload rigtige fotos til hero/team i editoren (erstatter manuscdn-fallbacks).
- Sociale medier-URL'er i na-footer-indstillingerne.
- Go-live-punkterne fra HANDOFF §8 er uændrede.
