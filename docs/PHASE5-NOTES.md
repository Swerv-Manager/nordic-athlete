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

1. **Mere luft over dropdown-punkterne:** `--submenu-padding-block-start`
   20px → 36px i na-header-custom.css (mega-menu-panelet).
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
