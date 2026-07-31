# Fase 5 — Header-hover-fix + Ambassadør-oversigtsside (21/7)

Arbejdstema: **"Swerv // Development" `gid://shopify/OnlineStoreTheme/193546781005`**
(LIVE = `193504706893` "Swerv // LIVE" — rør aldrig). Branch:
`claude/nordic-athlete-header-ambassadors-i72zuw` (fast-forwardet oven på
fase 4-branchen `claude/nordic-athlete-phase4-bprw7l`, så repo = tema-baseline).

## 1. Header: mega-menu klappede i på vej ned til dropdown-punkterne

**Symptom (merchant):** hover på et menupunkt åbner dropdown'en, men når musen
trækkes ned mod menu-punkterne, folder menuen sammen igen.

**Rodårsag:** Horizons hover-bro ("safety box") er en usynlig
`::after`-pseudo på `.menu-list__link`, som JS tænder under pointer-bevægelse,
så musen kan krydse mellemrummet ned til dropdown'en uden at udløse
`pointerleave`. Fase 4-omskrivningen af `na-header-custom.css` indførte den
grønne hover-UNDERLINJE på **samme** `::after` — og overskrev dermed broen med
en 2px-streg. Resultat: musen "forlader" menupunktet, så snart den er under
linket → menuen lukker.

**Fix (to lag, begge i temaet + repo):**
1. **`blocks/_header-menu.liquid`:** safety box flyttet fra `::after` til
   `::before` (3 steder, inkl. overflow-reglen). NA-underlinjen beholder
   `::after` uændret. VIGTIG REGEL fremover: `.menu-list__link::before` er
   RESERVERET til Horizons safety box — style aldrig den.
2. **`assets/header-menu.js`** (hardening, stock-logik forbedret):
   - Safety box slukkes ikke længere af zero-delta pointer-events (langsom
     musebevægelse gav konstant flimren af broen); kun idle-timeren (100 ms)
     slukker den, og `movementY` tæller nu i begge retninger (abs).
   - **Grace-periode på lukning:** `pointerleave` lukker ikke længere straks —
     lukning skeduleres 300 ms frem og annulleres, hvis musen når ind i
     menupunktet/dropdown'en igen (`#scheduleDeactivate`; hover-intent-mønster).
     Skift til et NABO-punkt er stadig øjeblikkeligt (activate afbryder pending
     close og skifter direkte).

## 2. Ambassadør-oversigtsside (/pages/ambassadoerer)

**Ny side "Ambassadører"** (`gid://shopify/Page/162500542797`, handle
`ambassadoerer`, templateSuffix `ambassadors`, publiceret) — erstatter på sigt
menupunktet "Ambassadører" der i dag peger på /blogs/nyheder.

**Datamodel:** nyt felt på `ambassador`-metaobjektet (def. 34781495629):
`page` (page_reference, "Ambassadørside (link)"). Udfyldt for alle 9 atleter
(Victoria, Kristian, Magnus, Bastian, Laura, Viktor, Mads-Emil, Patrick,
Lucas). **Ny atlet fremover:** metaobjekt + side + udfyld `page`-feltet →
atleten dukker selv op på oversigten. Ingen kode. (Atleter uden udfyldt
`page`-felt vises IKKE på oversigten — feltet fungerer som synlighedskontakt.)

**Nye filer:**
- `sections/na-ambassador-grid.liquid` — NA 2026-oversigt: eyebrow/H1 med grøn
  accent/intro/trust-linje (settings), kort-grid (3/2/1 kolonner) over alle
  ambassador-metaobjekter med `page`-felt: herobillede (4:5, cover, top),
  klub-chip, navn, karrierelinje, citat-teaser (fallback: intro, trunkeret),
  "Mød {fornavn} →". Hele kortet er ét link. Hover: grøn kant, løft, zoom,
  Energigrøn CTA. Bund-CTA "Vil du med på holdet?" → kontaktside (kan slås
  fra). ItemList JSON-LD for SEO. Tom-tilstand viser admin-hint.
- `templates/page.ambassadors.json` — kun grid-sektionen.

## 3. Upload/verifikation

- Uploadet til **193546781005** via `themeFilesUpsert` (ASCII-escapede
  payloads, upload-subagent): `assets/header-menu.js`,
  `blocks/_header-menu.liquid`, `sections/na-ambassador-grid.liquid` (sektion
  FØR skabelon, jf. fase 4-gotcha), `templates/page.ambassadors.json`.
  md5 verificeret remote for .js/.liquid; skabelonen semantisk.
- `shopify theme check`: 0 nye offenses i de ændrede/nye filer.
- Repo-baseline: branchen er fast-forwardet til fase 4-HEAD, så alle
  fase 4-filer (na-header-custom.css-omskrivningen m.fl.) nu ER i repoet.

## 3b. Fase 5b — merchant-feedback (21/7)

1. **Mere luft over dropdown-punkterne:** toppadding sat DIREKTE på
   `.header-menu .menu-list__submenu-inner` (og `::part(overflow-list)`) til
   **34px !important** i na-header-custom.css. **VIGTIGT (fælde):** at ændre
   `--submenu-padding-block-start`-variablen virker IKKE — Horizon nulstiller
   den til 0px via `.header__row[style*='--border-bottom-width: 0px']
   .menu-list__submenu.color-scheme-matches-parent` (border_width er 0 OG
   menuens farveskema matcher toprækken), en regel med højere specificitet
   (4 klasser) end vores variabel-override. Både fase 4's 20px og et første
   forsøg på 36px var derfor død kode — dropdown'en havde altid 0 toppadding.
   Løst ved at sætte `padding-block-start` direkte på inner-elementet
   (Horizons `padding-block-start: var(...)` er ikke !important, så vores
   vinder uanset variablen).
2. **Announcement-bar venstrestillet → centreret:** Horizons center-regel
   (`.text-block > * { text-align: var(--text-align) }`) bor i
   `snippets/text.liquid`'s scoped stylesheet og følger ikke pålideligt med
   announcement-baren. Eksplicit `text-align: center` på
   `.announcement-bar__slide/__text` i na-header-custom.css.
3. **Forsidens "Se alle ambassadører →"** (na-ambassadors i index.json):
   /blogs/nyheder → **/pages/ambassadoerer**. (Kun Development-temaets
   forsideskabelon — live er urørt.)

## 4. Udeståender / menneskelige beslutninger

- **Menupunktet "Ambassadører" er IKKE ændret** (peger stadig på
  /blogs/nyheder): menuen `ny-header-menu-horizon-tema` deles med LIVE-temaet,
  og LIVE har ikke `page.ambassadors`-skabelonen endnu → et menu-flip nu ville
  sende live-kunder til en rå fallback-side. **Ved go-live** (publish af
  Development-temaet): flip menupunktet til `/pages/ambassadoerer`
  (Navigation → Ny header menu (Horizon Tema)) — eller bed en session gøre det.
  ("Mød atleterne"-sektionens link på forsiden er ALLEREDE flippet til
  /pages/ambassadoerer i fase 5b — forsideskabelonen bor på Development-temaet,
  så det påvirker ikke live.)
- Merchant-review af preview:
  - Header-hover: `https://www.nordic-athlete.dk/?preview_theme_id=193546781005`
  - Oversigt: `https://www.nordic-athlete.dk/pages/ambassadoerer?preview_theme_id=193546781005`
- Tekster på oversigten (intro, CTA-boks, trust-linje) er defaults — kan
  redigeres i theme editor på siden.

---

# Fase 5c — Hummel-forsidebanner (31/7)

## TEMA-LANDSKABET ER SKIFTET IGEN (læs før alt andet)

Verificeret via Admin API 31/7. Navnene er roteret, så gå ALDRIG efter navnet
"Swerv // LIVE" mere:

| Tema | ID | Rolle |
|---|---|---|
| Swerv // Collection Page Optimisation | `193560707405` | **MAIN/LIVE — rør aldrig** |
| Kopi af Swerv // Collection Page Optimisation | `193966408013` | UNPUBLISHED — arbejdstema for denne opgave |
| Swerv // LIVE (misvisende navn) | `193546781005` | UNPUBLISHED (ikke længere live) |
| Swerv // Development | `193504706893` | UNPUBLISHED |
| Swerv // FAQ Sections | `193849819469` | UNPUBLISHED |

Slå altid `role` op frem for at stole på temanavnet.

## Opgaven

Forsidebanner om Hummel-samarbejdet. Grundlag: den godkendte Nexus-plan
`nordic-athlete-hummel-forside` (intelligence_documents), som indeholder Jonas'
ordrette tekst og beslutningen om at prisen IKKE nævnes endnu.

## Løsning: ingen ny kode

Banneret er en ny instans af den EKSISTERENDE sektion
`sections/na-image-with-text.liquid` (uændret, md5 verificeret identisk med
temaet). Eneste ændrede fil er `templates/index.json`, hvor sektionen
`na_hummel` er indsat som nr. 3, lige efter `na_trust`.

Alt indhold er settings, så Frederik og Jonas kan rette tekst, billede, knap og
trust-punkter direkte i theme editor uden kode.

**Tekst (Jonas' egne ord, splittet som kunden selv foreslog):**
- Eyebrow: "Nyt samarbejde"
- Overskrift: "Vi har valgt" + grøn "Hummels topmodeller"
- Brødtekst: "fordi de er udviklet til brug og ikke kun fordi de ser fede ud.
  Find din model her, pas på din krop, den skal holde i mange år."
- Knap: "Find din model" → `/collections/sko`
- Trust-punkter (stats): 4,9 af 5 stjerner · Dag til dag levering · 30 dage retur

Rekonstrueret overskrift+brødtekst er ordret identisk med Jonas' Slack-tekst
(kun afsluttende punktum tilføjet, som kunden selv foreslog).

**Billede:** `shopify://shop_images/230728-9001.webp` (primærbilledet på
hummel-topflight-pro, skoen i profil). Filen er 514×685 = **præcis 3:4**, så
`image_ratio: 3/4` + `image_fit: cover` giver pixelpræcis udfyldning uden
beskæring og uden letterboxing. Intet genereret billede, intet stockfoto.

**Mobil:** sektionen skifter selv til én kolonne under 900px (billede først).
Derudover er der lagt `custom_css` på sektionen (redigerbar i editoren under
sektionens Custom CSS), fordi tre ting ellers klemmer på telefon:
- billedet cappes til 210px bredde og centreres (ellers 466px højt på 390px skærm)
- sektionens top/bund-padding sænkes 64px → 40px
- stat-værdierne sænkes 22px → 17px, så "Dag til dag" ikke ombrydes i den smalle boks

## Verifikation

- md5 remote == lokal (`1fabbc6182a0e2a7db5b3844ccecd86f`), og semantisk
  kontrolleret: `custom_css`, `image`, `cta_url`, overskrifter og alle tre stats
  overlevede Shopifys skabelon-validering (den stripper ellers ugyldige nøgler tyst).
- `shopify theme check`: 0 offenses i `templates/index.json` og
  `na-image-with-text.liquid`. Øvrige offenses i temaet er pre-existing.
- Copy-kontrol programmatisk: ingen tankestreger (Unicode-kategori Pd), ingen
  procent, ingen valuta som selvstændigt ord, ingen rabatkoder, ingen lagerpres,
  nul udråbstegn.

## Uafklarede punkter

1. **Shopify CLI kunne IKKE bruges.** `shopify theme list/pull/push` og
   `shopify auth login` fejler alle med HTTP 403 fra Shopifys authorization
   service i dette cloud-miljø, og OAuth kan ikke gennemføres non-interaktivt.
   Der er derfor arbejdet via Admin API `themeFilesUpsert` (husets metode siden
   fase 2). `shopify theme check` virker lokalt og er brugt.
2. **Billedet er ikke visuelt inspiceret.** `cdn.shopify.com` er blokeret af
   netværkspolitikken (proxy 403), så baggrunden i 230728-9001.webp er ikke set.
   Valget hviler på alt-teksten ("i hvid ... set fra siden") og på at 3:4-fit
   fjerner risikoen for letterboxing. Frederik bør kigge på det i preview.
3. **"4,9 af 5 stjerner"** er kundens eget trust-punkt fra deres bedst
   performende annonce og vises allerede i hero og trust-strip på det
   publicerede tema. Bemærk dog at fase 4 § 5c stadig har ratingen som et
   punkt merchant selv bør verificere.
4. SKO-kollektionen indeholder nu **alle 5 Hummel-sko** (verificeret 31/7), så
   bekymringen i Nexus-planen om at tre modeller ville være skjult er bortfaldet.
5. Prisvejen er fortsat ikke besluttet, og banneret er bygget uden pris. Vælges
   permanent nedsættelse eller rabatkode senere, kan en sekundær linje tilføjes
   i editoren uden kode.

## Fase 5d — designrettelser efter merchant-review af banneret (31/7)

Merchant: "sektionen ser ikke god ud, gør den mere clean og passende i temaet."

**1. KNAPPEN VAR HELT BLANK (reel bug i sektionen, ikke i indstillingerne).**
`sections/na-image-with-text.liquid` havde reglen
`#na-iwt-{{ sid }} a { text-decoration: none; color: inherit; }`.
Specificiteten er 1 id + 1 type (1-0-1), hvilket slår knappens egen
`.na-iwt-btn-primary-{{ sid }} { color: #000 }` (0-1-0). Knappen arvede derfor
temaets hvide tekstfarve og stod som hvid tekst på hvid baggrund, altså en tom
hvid kasse. Rettet ved at undtage knapperne:
`#na-iwt-{{ sid }} a:not([class*='na-iwt-btn'])`.
**REGEL fremover:** styr aldrig `color` på et bredt `#id a`-selektor i disse
sektioner; knapklasser taber altid den kamp.

**2. Primær-knap bragt i tråd med temaet.** Var hvid boks med sort tekst, hvilket
ikke matcher NA's CTA-konvention fra fase 4 § 5c (grøn CTA, HVID tekst). Nu
Atletgrøn `#3d7a52` med hvid tekst og hover `#4a9364`, som resten af sitet.
Sektionen bruges kun af `na_hummel`, så ændringen påvirker intet andet.

**3. Billedrammen var 752px høj og næsten tom.** Produktbilledet er en
transparent pakshot med store tomme marginer, så 3:4 på en 564px kolonne gav en
kæmpe sort flade med en lille sko i midten. Rettet i indstillingerne:
`image_ratio: 3/4 → 1/1` (rammen 752px → 564px), og i `custom_css`
`object-position: center` så den kvadratiske beskæring skærer de transparente
marginer symmetrisk væk i stedet for `center top`, der ville klippe sålen.
Skoen fylder nu markant mere af rammen.

**4. Rå #000 udskiftet med temaets egne tokens.** Billedflisen bruger nu
`#131c15` (temaets dybeste) og stat-kortene `#253020` (den dokumenterede
kort-grønne) i stedet for pure black, som stod som hårde huller mod
sektionens `#2a2a2a`.

**5. Overskriften brækkede i tre linjer** ("Vi har valgt / Hummels /
topmodeller") ved 52px på en 564px kolonne. Nu 44px på desktop og 30px under
900px, så den holder to linjer og "Hummels topmodeller" står samlet.

Alle fem punkter ligger i sektionens `custom_css` eller i indstillingerne
(punkt 1 og 2 i sektionsfilen), så teksten fortsat kan rettes uden kode.
