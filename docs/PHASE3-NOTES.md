# Fase 3 — Metafelt-drevne skabeloner + SEO + alle ambassadørsider

Alt arbejde ligger fortsat på duplikat-temaet **193309901133** — intet er publiceret.
Live-temaet 190092804429 er urørt.

## 1. Én PDP-skabelon til alle produkter (metafelter)

`templates/product.gamepatch-2026.json` er nu **universel**: alt produktspecifikt
indhold kommer fra produkt-metafelter (`custom.pdp_*`, alle PUBLIC_READ, pinned).
Sektioner uden data skjuler sig selv, så skabelonen kan sættes på alle produkter
— også Bauerfeind, Molten, PurePower osv.

Forrang i alle sektioner: **produkt-metafelt → sektionsindstilling/blokke → skjul**.

| Metafelt (namespace `custom`) | Type | Bruges af | Tom = |
|---|---|---|---|
| `pdp_eyebrow` | tekst | na-pdp-extras (eyebrow) | brand-linje |
| `pdp_badge` | tekst | na-pdp-extras (badge) | "Officiel partner" |
| `pdp_fit_note` | tekst | na-pdp-extras (fit) | generisk pasform-note |
| `pdp_short_desc` | flerlinje | na-pdp-extras (desc) | produktbeskrivelsen |
| `pdp_tech_heading` | tekst | na-pdp-technology | sektionens overskrift |
| `pdp_tech_intro` | flerlinje | na-pdp-technology | sektionens tekst |
| `pdp_tech_zones` | liste af tekst | na-pdp-technology | **sektionen skjules** |
| `pdp_size_columns` | liste af tekst | na-pdp-size-guide | **sektionen skjules** |
| `pdp_size_note` | flerlinje | na-pdp-size-guide | sektionens note |
| `pdp_bundle_product` | produktreference | na-pdp-bundle | **sektionen skjules** |

Listeformater (én linje pr. element):
- `pdp_tech_zones`: `x%|y%|Titel|Tekst` — fx `32|26|Integreret hoftebeskyttelse|dækket på de vitale punkter ved fald og sammenstød.`
- `pdp_size_columns`: `Størrelse|Interval` — fx `M|170–178 cm`

**Udfyldt nu:** kun hero-produktet GAMEPATCH 3/4 TIGHTS PADDED HOFTE/KNÆ
(`10522876608845`) — indholdet er flyttet 1:1 fra fase 2-skabelonen (zoner,
størrelsesskema S–2XL, note, bundle = knæbeskytter). Øvrige produkter skal have
data ind via admin (Produkter → metafelter) — sektionerne dukker op automatisk.
Der er bevidst IKKE digtet størrelsesskemaer/zoner til andre produkter.

**Go-live pr. produkt:** sæt `templateSuffix = gamepatch-2026` (menneskelig
handling — påvirker live-temaet, hvor skabelonen ikke findes endnu, så vent til
tema-publish).

## 2. Kollektionssider — 2026-design + metafelter + SEO

- `templates/collection.json` (standard for ALLE kollektioner uden eget suffix)
  bruger nu 2026-designet: `na-collection-hero` (banner + trust-bar med
  butiksfakta: 4,9/5 · 1.200+ anmeldelser · 1–2 dage · fri fragt over 600 ·
  30 dages retur) + `na-gamepatch-skin` (mørk styling/quick-add, generisk trods
  navnet) + `na-collection-filters` + `main-collection`.
- Hero-fallbacks: H1 = kollektionens titel, intro = kollektionsbeskrivelsen,
  eyebrow = metafeltet `custom.hero_banner_tagline` (eksisterede i forvejen).
- Nye kollektions-metafelter (PUBLIC_READ, pinned): `custom.hero_heading`
  (H1 linje 1), `custom.hero_accent` (linje 2, grøn/dæmpet), `custom.hero_intro`
  (erstatter beskrivelsen i heroen). Ingen af dem er udfyldt endnu — fallbacks
  gør alle 18 kollektioner pæne uden data.
- **SEO:** `seo.title` + `seo.description` er sat på alle 18 kollektioner
  (destilleret af de eksisterende danske beskrivelser — ingen opfundne claims).

## 3. Ambassadørsider — alle atleter via metaobjekt (ingen nye skabeloner)

Mønster uændret fra fase 2: 1 atlet = 1 `ambassador`-metaobjekt + 1 side med
`templateSuffix: "ambassador"` + sidemetafeltet `custom.ambassador`.

Oprettet i fase 3 (data fra atleternes egne blogartikler i "Nyheder"-bloggen):
Kristian Høegh, Magnus Stilling, Bastian Fallesen, Laura Rømer, Viktor Bille,
Mads-Emil Røll, Patrick Boldsen, Lucas Bess. (Victoria Mørk fandtes fra fase 2.)

Regler fulgt:
- "Bruges i kamp"-tags (`match_tag_count`) KUN på produkter atleten selv nævner
  i sin artikel; resten er markeret som anbefalinger i detaljelinjerne.
- Patrick Boldsen + Lucas Bess har intet verbatim-citat i artiklerne → `quote`
  er tom; `na-ambassador-story` er gjort blank-sikker (viser intro i stedet).
- **Alfred Malon er IKKE oprettet** — hans artikel er tom (kun billede).
  Rasmus Olsens artikel er upubliceret → også sprunget over.
- Ny atlet fremover: nyt metaobjekt + ny side. Ingen kode.

## 4. Kendte udeståender

- Siderne er publiceret (samme mønster som Victoria). OBS: på live-temaet
  findes ambassador-skabelonen ikke endnu, så siderne er nær-tomme dér indtil
  tema-publish. Overvej sitemap/indeksering, hvis publish trækker ud.
- Bundle-besparelse og anmeldelses-app: uændret fra fase 2 (HANDOFF §6.6/6.7).
- `assets/na-product-page.css` (legacy) stadig ikke ryddet op (HANDOFF §6.10).

## 5. Oprettede ambassadører (fase 3)

| Atlet | Side | Metaobjekt |
|---|---|---|
| Kristian Høegh | /pages/kristian-hoegh | gid://shopify/Metaobject/350938366285 |
| Magnus Stilling | /pages/magnus-stilling | gid://shopify/Metaobject/350938464589 |
| Bastian Fredslund Fallesen | /pages/bastian-fallesen | gid://shopify/Metaobject/350938497357 |
| Laura Rømer | /pages/laura-romer | gid://shopify/Metaobject/350938530125 |
| Viktor Bille | /pages/viktor-bille | gid://shopify/Metaobject/350938628429 |
| Mads-Emil Røll | /pages/mads-emil-roll | gid://shopify/Metaobject/350938693965 |
| Patrick Boldsen | /pages/patrick-boldsen | gid://shopify/Metaobject/350938726733 |
| Lucas Bess | /pages/lucas-bess | gid://shopify/Metaobject/350938759501 |

(Victoria Mørk: /pages/victoria-moerk, gid://shopify/Metaobject/350848188749, fra fase 2.)
Preview: https://www.nordic-athlete.dk/pages/<handle>?preview_theme_id=193309901133

## 6. Fase 3b — rettelser efter merchant-review (14/7)

**PDP:**
- Badge: "Officiel partner" vises nu KUN på Gamepatch-produkter; andre mærker
  viser vendor-navnet (fx "Bauerfeind"); NORDIC-ATHLETE-egne varer viser ingen
  badge. `custom.pdp_badge` overstyrer stadig alt.
- Størrelsesguide: nyt række-baseret tabelformat i `custom.pdp_size_columns`
  (første element = header-række, celler adskilt med `|`). Understøtter nu
  også bukse-matricen (højde×vægt) og Bauerfeind-skemaer. Nye felter:
  `pdp_size_heading` (overskrift) og `pdp_size_measure` ("Emoji|Label|Tekst"
  = måleinstruktions-boks). Data er migreret fra de GAMLE skabelon-accordions:
  armsleeves (albueomkreds), knæbeskyttere (knæomkreds), bukser/tights/shorts
  (højde×vægt-matrix, inkl. JR-størrelser), Bauerfeind-strømper (Omfang 1+2 +
  længdevalg). "Størrelsesguide"-linket i købsboksen vises kun, når produktet
  har guide-data — ellers er ankeret dødt (det var fejlen).
  OBS: Bauerfeind-BANDAGER (knæ/ankel/albue) har IKKE fået strømpe-skemaet
  (det ville være misvisende) — de skal have deres egne skemaer fra Bauerfeind.
- Pasform-noten er nu ren metafelt (`pdp_fit_note`) — ingen hardcodet fallback.
  Sat på alle compression-/beskyttelsesprodukter; Bauerfeind-strømper har
  Bauerfeinds egen anbefaling (vælg den MINDRE størrelse).
- Produktbeskrivelse: flyttet NED UNDER køb-knappen og gjort udvidbar
  (kort preview + "Læs hele beskrivelsen" — fold-skub undgås).

**Kollektionssider:**
- Filtre: `na-collection-filters` renderer nu ALLE liste-filtre fra Search &
  Discovery pr. kollektion (ikke kun Kategori/Kroppen) — rækkerne tilpasser
  sig automatisk hver kollektion.
- Kort: brand-eyebrow på ALLE kort (Gamepatch-split som før; ellers vendor,
  fx BAUERFEIND/HUMMEL; egne varer = NORDIC ATHLETE). Undertitel-linjen
  reserveres altid (kropszone → produkttype → blank linje), så blandede grids
  flugter.
- Nye sektioner under produktgridden (begge skjules uden data):
  - `na-collection-seo`: udvidet SEO-tekst fra `custom.seo_text` (rich text).
  - `na-collection-faq`: FAQ fra `custom.faqs` (liste af `faq_item`-metaobjekter,
    genbrugelige på tværs) + FAQPage JSON-LD (rich results).
  Indhold sat på alle 18 kollektioner (4 fælles + 9 kollektionsspecifikke
  FAQ-punkter; SEO-tekster destilleret af eksisterende beskrivelser).

**Ambassadører:**
- Nyt metaobjekt-felt `story` (multi_line): hele artiklens relevante tekst i
  Q&A-format (linje der ender med "?" = spørgsmåls-overskrift). Renderes i
  `na-ambassador-story` under citaterne. Udfyldt for alle 9 atleter inkl.
  Victoria.
