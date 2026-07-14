# Phase 2 — PDP + ambassadør-landingpage (gennemført)

Fortsættelse af HANDOFF.md (fase 1: kollektionsside). Alt arbejde ligger på
duplikat-temaet **193309901133** — intet er publiceret.

## Nye filer på temaet

**PDP (product.gamepatch-2026):**
- `sections/na-pdp-skin.liquid` — usynlig skin-sektion (samme mønster som
  `na-gamepatch-skin`): template-scoped CSS for købsboksen — titel/pris-typografi,
  variantknapper (56×44, grøn aktiv via `:has(input:checked)` — Horizon lægger
  input INDE i label), grøn CTA, mørk sticky-bar, galleri-kanter, skjult
  antal-vælger.
- `snippets/na-pdp-extras.liquid` — købsboks-elementer renderet fra custom-liquid
  blokke med `part`-parameter: breadcrumb, badges (Officiel partner + live
  lager-badge), eyebrow, rating-link (#anmeldelser), fri fragt-status (≥600 kr),
  størrelse-header med guide-link (#guide), pasform-note, leveringsdeadline-boks,
  betalingsrække, kort beskrivelse.
  Lager-badgen lytter på `variant:update` (Horizon morpher KUN variant-pickeren
  ved variantskift, ikke hele product-details).
- `sections/na-pdp-technology.liquid` — Body Adjust Technology: billede med
  nummererede zone-prikker (blokke med x/y-%), zoneliste, 20%-statboks.
  Billed-fallback: produktets 2. medie.
- `sections/na-pdp-size-guide.liquid` — id="guide". Størrelseskolonner som blokke,
  note, gratis ombytning/retur-badges, skema-billede (fallback: produktmedie med
  'size'/'chart' i filnavnet — tights-produktet har et).
- `sections/na-pdp-reviews.liquid` — id="anmeldelser". Fordelingsbjælker
  (BRAND-niveau: ingen anmeldelses-app med produktdata endnu — jf. HANDOFF §6.8),
  verificerede anmeldelser som blokke, atlet-citat (Victoria).
- `sections/na-pdp-bundle.liquid` — "Komplet beskyttelse": aktuelt produkt +
  companion-produkt (indstilling, sat til knæbeskytteren), variant-selects for
  begge, ét klik lægger begge i kurven via temaets cart:update-protokol
  (HANDOFF §6.1). **Besparelse er 0 som standard** — sæt kun `savings_amount`
  hvis en tilsvarende automatisk rabat er oprettet i admin, ellers er badgen
  vildledende.
- `templates/product.gamepatch-2026.json` — bygget oven på det fungerende
  `product.gamepatch-pants.json`-main (galleri-grid, sticky add-to-cart aktiv).
  Rækkefølge: main (købsboks 2.0) → skin → teknologi → størrelsesguide →
  anmeldelser → bundle → featured-collection ("Andre købte også") →
  na-sport-collection → multicolumn-why.

**Ambassadør (page.ambassador):**
- `sections/na-ambassador-hero.liquid` — message-match hero: atletfoto,
  navneskilt, badge, 2-linjes H1 (linje 2 grøn), intro, "Shop [fornavn]s setup ↓"
  → #setup, trust-linje.
- `sections/na-ambassador-setup.liquid` — id="setup". Produktkort fra
  metaobjektets produktliste med "Bruges i kamp"-tags (antal styres af
  metaobjektfeltet), detaljelinjer, quick-add med rigtige størrelsesknapper
  (samme regler + cart-protokol som fase 1) og sticky bund-bar med samlet pris.
  Sticky-CTA scroller til #setup (bevidst: at lægge hele setuppet blindt i kurven
  ville vælge forkerte størrelser).
- `sections/na-ambassador-story.liquid` — atlet-citat + Jonas-ærlighedsblok +
  3-stats-række.
- `templates/page.ambassador.json` — hero → setup → story.

## Data oprettet på butikken (ikke i temafiler)

- **Metaobjekt-definition `ambassador`** (storefront PUBLIC_READ, publicerbar):
  name, career_line, club, hero_image, headline, headline_accent, intro, quote,
  products (list.product_reference), product_details (list, index-matchet),
  match_tag_count. Definition-id: `gid://shopify/MetaobjectDefinition/34781495629`.
- **Metaobjekt-entry `victoria-moerk`** (`gid://shopify/Metaobject/350848188749`)
  med Victorias data + 3 produkter (tights 899 / undertrøje 699 / knæbeskytter
  349 = 1.947 kr som i mockuppet).
- **Side-metafelt `custom.ambassador`** (PAGE, metaobject_reference, PUBLIC_READ,
  pinned).
- **Side `/pages/victoria-moerk`** (publiceret, templateSuffix `ambassador`,
  metafelt sat). Ny atlet = nyt metaobjekt + ny side med samme skabelon.

## Preview-URL'er

- PDP: `https://www.nordic-athlete.dk/products/gamepatch-3-4-tights-padded-hofte-knae?preview_theme_id=193309901133&view=gamepatch-2026`
- Ambassadør: `https://www.nordic-athlete.dk/pages/victoria-moerk?preview_theme_id=193309901133`

## Udestående / menneskelige beslutninger

1. **Bundle-besparelse:** opret en automatisk rabat i admin (fx 125 kr ved
   tights + knæbeskytter) og sæt derefter `savings_amount` i bundle-sektionen.
   Shopify Functions kan være nødvendige for præcis "begge produkter"-logik.
2. **Anmeldelser:** fordelingen er brand-niveau. Ægte pr.-produkt-data kræver en
   anmeldelses-app (jf. fase 1-gotcha #8).
3. **Go-live** (uændret fra HANDOFF §7): publicér temaet, sæt
   `templateSuffix = gamepatch-2026` på tights-produktet/-erne, routér Meta-trafik
   til /pages/victoria-moerk.
4. `assets/na-product-page.css` (Alchemy-æra) loades stadig globalt fra
   theme.liquid; de fleste selektorer matcher ikke Horizon. Ikke fjernet i denne
   fase (lav risiko, men kan ryddes op).
