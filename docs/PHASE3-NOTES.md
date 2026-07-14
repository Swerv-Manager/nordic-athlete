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
