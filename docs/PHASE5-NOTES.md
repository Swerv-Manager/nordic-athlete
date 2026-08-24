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
`sections/na-image-with-text.liquid`. Eneste ændrede fil er
`templates/index.json`, hvor sektionen `na_hummel` er indsat som nr. 3, lige
efter `na_trust`.

> RETTELSE (fase 5d): sektionsfilen var uændret i første leverance, men blev
> efterfølgende rettet for en reel CSS-specificitetsbug, der gjorde CTA-knappen
> blank. Se § 5d nedenfor. Læs derfor ikke dette afsnit som "sektionsfilen er
> urørt".

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
topmodeller") ved 52px på en 564px kolonne. Nu
`font-size: clamp(30px, 3.4vw, 52px)`, som giver ca. 44px ved 1280px og 30px på
telefon. De to faste heading-media-overrides (36px/30px) er fjernet, da clamp
dækker begge.

## VIGTIG GRÆNSE: sektions-`custom_css` må højst være 500 tegn

Første forsøg på at lægge alle fem rettelser i instansens `custom_css` blev
**afvist af Shopify** med `userErrors`:
"Den tilpassede CSS indeholder mere end 500 tegn" (jeg havde 590).
Skabelonen blev altså IKKE gemt, mens sektionsfilen gik igennem. Fejlen er
deterministisk server-side validering, ikke et transient upload-problem.

**Konsekvens for arkitekturen (og læringen):** `custom_css` skal reserveres til
det der er ægte instans-specifikt. Generelle forbedringer hører i
sektionsfilen. Fordelingen nu:

- **I sektionsfilen** (gælder alle fremtidige instanser): knap-fix, grøn CTA,
  `#131c15`-billedflise, `#253020`-stat-kort, clamp-overskrift, og stat-værdier
  ned til 17px under 900px (22px klemte "Dag til dag").
- **Ny indstilling `image_focus`** (Top/Midte, default Top): styrer
  `object-position`. Portrætter vil have Top (ansigt i toppen), produktbilleder
  vil have Midte. Hummel-banneret bruger Midte. Dermed er billedfokus nu
  redigerbart uden kode i stedet for et CSS-hack.
- **I instansens `custom_css`** (224 tegn): kun mobil-cap på billedet
  (260px, centreret) og mobil-padding, som afhænger af netop dette
  billedmotivs transparente marginer.

Tjek altid tegnantallet før upload:
`sum(len(x) for x in custom_css) <= 500`.

---

# Fase 6 — Video-hero + ny menustruktur (24/8)

Arbejdstema: **"Swerv // Klubber (Aug 20)" `gid://shopify/OnlineStoreTheme/194732720461`** (UNPUBLISHED).

## TEMA- OG MENU-LANDSKAB (verificeret 24/8, stol ikke paa navne)

| Tema | ID | Rolle |
|---|---|---|
| Swerv // Mobile Quick-Add Fix (Aug 18) | `194653061453` | **MAIN/LIVE — roer aldrig** |
| Swerv // Klubber (Aug 20) | `194732720461` | UNPUBLISHED, arbejdstema |
| Swerv // Bauerfeind Size Guides (Aug 18) | `194378498381` | UNPUBLISHED |
| Swerv // FAQ Merge (Aug 3) | `194067005773` | UNPUBLISHED |

**KRITISK om menuer:** Shopify-menuer er BUTIKS-niveau, ikke tema-niveau. En
menuaendring rammer derfor normalt live med det samme. Reddet af at temaerne
peger paa forskellige menuer, verificeret paa begge:
- LIVE-temaet bruger `ny-header-menu-horizon-tema`
- Klubber-temaet bruger `header-menu-klubber` ("Header menu + Klubber (draft)")

Derfor kunne menuen omlaegges uden at roere live. **Tjek ALTID
`header-menu`-blokkens `menu`-setting i begge temaers header-group.json foer
en menu redigeres.**

## 1. Video-hero med Holger Rune

Ny sektion `sections/na-video-hero.liquid`. `na-hero` kunne ikke video (kun
image_picker), og i stedet for at ombygge den delte hero er der bygget en
dedikeret video-hero. Den gamle `na_hero` er sat til `"disabled": true` i
index.json, altsaa bevaret med alle indstillinger og kan slaas til igen med et
klik i editoren.

Mønstret for video foelger `snippets/background-media.liquid`: loop over
`video.sources` og brug `preview_image` som poster. Som i `na-hero`
(`image` + `image_url_fallback`) er der to veje ind:
- `video` (video-vaelger) → giver Shopifys adaptive renditions + poster
- `video_url` (tekst) → reserve, direkte .mp4

Liquid falder selv tilbage til `video_url`, hvis vaelgeren er tom eller ikke
kan resolves, saa heroen spiller uanset hvad Shopify gemmer i vaelgerfeltet.

Video: "EACE X HOLGER RUNE - HERO FILM HORIZONTAL 1920x1080.mp4"
(`gid://shopify/Video/63371784257869`). CTA → `/collections/holger-rune-x-eace`.

**Responsivt valg (vigtigt):** desktop viser videoen fuld bredde med teksten
oven paa og en gradient-scrim. **Mobil stakker i stedet:** videoen i fuldt
16:9 og teksten UNDER paa maerkefarven. Cover-beskaering af en 16:9-film paa en
portraetskaerm ville skaere motivet vaek i siderne, og tekst oven paa en lav
video bliver klemt. Der er ogsaa `prefers-reduced-motion`-respekt: videoen
skjules og posteren staar i stedet.

## 2. Ny menustruktur (`header-menu-klubber`)

Fra 8 til **6** hovedpunkter. Tre problemer blev loest:
1. Fire af otte punkter var infosider (Ambassadoerer, Om os, Kontakt, FAQ) der
   fyldte i en shoppingmenu. Nu samlet under **Om os**.
2. "Sport" blandede sportsgrene med produktkategorier (Traening, Tilbehoer,
   Energi/Kosttilskud) og et brand (Gamepatch). Akserne er nu adskilt.
3. **SKO (9 produkter) var slet ikke i menuen** trods Hummel-lanceringen og
   forsidebanneret der sender trafik derhen. Nu eget hovedpunkt.

| # | Hovedpunkt | Peger paa | Underpunkter |
|---|---|---|---|
| 1 | Sport | /collections | Haandbold, Basketball, Fodbold, Volleyball, Cykling |
| 2 | Beskyttelse | kroppen | Gamepatch, Knae, Albue, Ankel, Ben, Haand, Skulder |
| 3 | Sko | sko | (ingen) |
| 4 | Udstyr & tilskud | tilbehor | Traeningsudstyr, Energi & kosttilskud, Holger Rune x Eace |
| 5 | Klubber | /pages/klubber | 7 klubber |
| 6 | Om os | /pages/hvem-er-vi | Ambassadoerer, Kontakt os, Ofte stillede spoergsmaal |

**Holger Rune x Eace er flyttet fra hovedmenuen ned under "Udstyr & tilskud".**
Grunden er verificeret i data: kollektionens 5 produkter er KOSTTILSKUD fra
vendor "Eace" (kreatin, elektrolytter, collagen shot, energy gum), ikke toej
eller sko. Den mister ikke synlighed, da forsidens nye video-hero sender
direkte til den.

Ingen dubletter mellem foraeldre og boern: hvert foraeldrepunkt linker til den
bredeste relevante kollektion, og boernene gentager den ikke.

## 3. Fund vaerd at kende

- **Klub-kollektionerne har 0 produkter.** Alle 7 er smart-kollektioner med
  reglen TAG = `klub-<handle>`, skabelon `klub`, og beskrivelsen siger aerligt
  "Kollektionen til klubbens spillere og medlemmer er paa vej". De er altsaa
  bevidste landingssider, ikke fejl, men kunder der klikker moeder en
  "paa vej"-besked indtil produkterne tagges.
- **Legacy-handles er misvisende:** "Haandbold" har handle `gamepatch`, og
  "Basketball" har handle `frontpage`. Rettes IKKE (SEO og eksisterende links),
  men det forvirrer ved menuarbejde.
- **Shopify CLI forsvandt fra containeren midt i sessionen** (binaeren under
  /opt/node22/bin var vaek, selv om den virkede tidligere samme session).
  `npm install -g @shopify/cli@latest` bragte den tilbage. Theme check: 0 nye
  offenses (232/186 uaendret, kun filantallet steg med den nye sektion).

## 4. Video-reference: to fund vaerd at kende

**1. Videovaelgerens JSON-format kunne IKKE gaettes.**
`"video": "shopify://videos/63371784257869"` blev afvist server-side med
userErrors: *"Vaerdien i indstillingen \"video\" skal vaere en gyldig
Shopify-webadresse til en video."* Skabelonen blev derfor slet ikke gemt, mens
sektionsfilen gik igennem, saa temaet stod kortvarigt med en orphan sektion.
Bemaerk at `shopify://shop_images/<filnavn>` VIRKER for image_picker (brugt i
Hummel-banneret), saa den analogi holder ikke for video. Loesningen blev at
droppe noeglen helt og bruge `video_url`, som Liquid'en alligevel falder
tilbage til. Vil man bruge vaelgeren, skal den saettes i theme editor, hvor
Shopify selv skriver det korrekte format.

**2. Originalfilen er 72 MB.** Den URL vi fik udleveret
(`/videos/c/o/v/<hash>.mp4`) er ORIGINALEN: 72.338.238 bytes, 33 sekunder.
Den ville vaere en tung forside-hero. Shopify har faerdige renditions paa
samme hash under `/videos/c/vp/<hash>/`:

| Rendition | Oploesning | Bitrate |
|---|---|---|
| SD-480p | 852x480 | 1.5 Mbps |
| HD-720p | 1280x720 | 4.5 Mbps |
| HD-1080p | 1920x1080 | 7.2 Mbps |
| m3u8 (HLS) | 1920x1080 | adaptiv |

**Valgt: HD-720p**, som er et fornuftigt kompromis mellem skarphed paa en
fuldbredde-hero og vaegt. Posterbilledet tages fra videoens eget
auto-genererede preview (`preview.image`), sat via det nye `poster_url`-felt,
saa der staar et billede med det samme frem for en sort boks.

**Anbefaling til merchant:** 33 sekunder er langt til en hero der looper. En
klipning til 8 til 12 sekunder vil skaere vaegten med omkring to tredjedele og
gøre loopet strammere. Alternativt kan der skiftes til SD-480p i
`video_url`-feltet i editoren uden kode.

## 5. Fase 6c — merchant-feedback: faerre overkategorier + logoets placering (24/8)

**1. Menuen samlet fra 6 til 4 hovedpunkter.** Merchant ville have Sport,
Beskyttelse, Sko og Udstyr samlet i en eller to overkategorier. Loest med to
indkoebsakser, som er de to maader kunder faktisk shopper i denne butik: "jeg
spiller haandbold" eller "jeg mangler knaebeskyttelse eller sko".

| # | Hovedpunkt | Niveau 2 | Niveau 3 |
|---|---|---|---|
| 1 | Sport | Haandbold, Basketball, Fodbold, Volleyball, Cykling | |
| 2 | Udstyr | Beskyttelse | Knae, Albue, Ankel, Ben, Haand, Skulder |
| | | Gamepatch, Sko, Traeningsudstyr, Energi & tilskud, Holger Rune x Eace | |
| 3 | Klubber | 7 klubber | |
| 4 | Om os | Ambassadoerer, Kontakt os, Ofte stillede spoergsmaal | |

**TRE NIVEAUER ER VERIFICERET FOER BRUG.** `snippets/mega-menu-list.liquid`
linje 138 til 145 har `{% if link.links != blank %}` med et indre
`{% for childLink in link.links %}`, og `na-header-custom.css` styler
`.mega-menu__link--parent` og holder sublister i én kolonne. Kropszonerne
ligger derfor som tredje niveau under Udstyr → Beskyttelse i stedet for at
ligge fladt sammen med produktkategorierne.

**2. Logoet: venstre side af headeren var tom.**
Aarsag: `logo_position` stod paa `center`, hvilket grupperer logo OG menu
midt i headeren. Med handlingerne (Soeg, Konto, Kurv) i hoejre side blev hele
venstre fjerdedel tom, og logo plus menu blev klemt sammen i midten.

Rettet til `logo_position: left` i `sections/header-group.json`.
`menu_position` er bevidst ladt paa `center`, saa layoutet bliver
logo helt til venstre, menu centreret, handlinger helt til hoejre. Med kun
fire menupunkter giver det luft i stedet for komprimering.

Gyldige vaerdier for begge (fra header.liquid schema): `left`, `center`, `right`.

**Metode-note:** header-group.json blev IKKE transkriberet i haanden. Filen
blev hentet, md5 verificeret mod temaets checksum FOER aendringen, derefter én
enkelt streng-erstatning og md5-verifikation efter upload (foer
`4c254475cf539f1e9eab5601363fbe0d`, efter `48bf406058c16ee0582d738334a7545a`,
5477 bytes, én linje aendret). Den disciplin er noedvendig, fordi manuel
gengivelse af 5 KB med danske tegn og emoji har fejlet tidligere i projektet.

## RETTELSE: `/* auto-generated */`-banneret er RIGTIGT indhold, ikke annotation

Tidligere noter i dette dokument (fase 5c og 6b) siger at Shopifys
`/* ... auto-generated ... */`-banner "kun tilfoejes i API-svaret". **Det er
forkert.** Verificeret paa Klubber-temaet 24/8:

| Fil | Skrevet af | Banner i de gemte bytes? | Bevis |
|---|---|---|---|
| `sections/header-group.json` | theme editor | **JA** | md5 matcher KUN med banner (5479 bytes) |
| `templates/index.json` | os, via themeFilesUpsert | **NEJ** | vores banner-frie fil matcher 1:1 (14411 bytes) |

Banneret er altsaa almindeligt filindhold. Filer som theme editoren har
skrevet indeholder det, og filer vi selv uploader gør ikke, fordi vi ikke
skriver det med. Praktisk konsekvens:

- **Redigerer du en editor-skrevet fil** (header-group.json, footer-group.json,
  skabeloner der er roert i editoren): behold banneret. Stripper du det,
  sletter du rigtige bytes.
- **Uploader du en fil vi selv ejer:** md5 skal matche vores banner-frie
  indhold, praecis som hidtil.
- **Verificér altid ved at sammenligne md5 FOER du aendrer noget.** Det afgoer
  entydigt om banneret hoerer til filen eller ikke, i stedet for at gaette.

## 6. Fase 6d — mega-menuens layout (24/8)

Merchant: dropdownen saa maerkelig ud paa punkter med mange emner, og oenskede
et mere lækkert og overskueligt look a la jonsmadklub.dk.

**Rodaarsagen var layoutet, ikke menustrukturen.** `.mega-menu__column` var
sat til `grid-template-columns: repeat(3, 1fr)`, hvor HVER CELLE er ét link
(markup: `li.mega-menu__column > div > a` plus `ul` med boernene). Et punkt MED
boern blev derfor én HOEJ celle i kolonne 1, mens soeskende uden boern floed
videre i celle 2 og 3 og saa ned paa naeste raekke. Visuelt kom Knae og Albue
til at staa som sidestillede med Gamepatch og Sko, altsaa hierarkiet forsvandt.

**Loesning: to layouts i stedet for ét.**
- Flade lister (Sport, Klubber, Om os) faar jaevne kolonner
  (`repeat(auto-fill, minmax(190px, 1fr))`).
- Har et punkt boern (`:has(> div > ul)`), bliver gruppen sin EGEN
  venstrekolonne paa 240px i fuld hoejde med lodret skillelinje, og de oevrige
  links flyder i kolonnerne til hoejre.

To detaljer der er noedvendige for at det holder:
- `grid-row: span 20` paa gruppen holder kolonne 1 optaget, saa korte links
  aldrig lander under den.
- **Raekkegab skal vaere 0** (`gap: 0 40px`), og afstanden styres af marginer.
  Et raekkespaend over tomme raekker ville ellers laegge gab oven i hinanden og
  give et stort tomt hul.

**Typografi der goer hierarkiet synligt:** et punkt med boern er ikke et
sidestillet link men en rubrik. Det har nu hvid tekst, 900, 0.14em spacing og
en fin underlinje (`border-bottom: 1px solid #2e3d32`), som kategorikolonnen i
referencen, og ingen hover-flade. Boernene er en tone lettere (`#93a49a`) og
lyser op til hvid ved hover.

### Hvorfor IKKE billedkort som referencen

Referencens midterste sektion er kollektionskort med billeder. Horizon kan det
via `menu_style: collection_images`, og det blev undersoegt. **Fravalgt paa
data:** menustilen gaelder HELE menuen, og alle 7 klub-kollektioner har
`image: null`, mens "Om os"-punkterne er SIDER uden kollektionsbillede.
Kortvisning ville derfor give en raekke tomme pladsholderbokse under Klubber og
Om os, altsaa ringere end i dag. Alle 15 produktkollektioner HAR billeder, saa
hvis klubberne faar billeder, er kortvisning en reel mulighed senere.

## 7. Fase 6e — mega-menuen igen: RIGTIG rodaarsag fundet (24/8)

Fase 6d virkede ikke. Merchant-screenshot viste gruppen i venstre kolonne med
skillelinje, men de fem loese links laa i en raekke UNDER den, og hele hoejre
side var tom.

**Hvorfor 6d fejlede: jeg antog at alle links laa i ÉN kolonne-container.**
Det gør de ikke. Verificeret mod temaets EGEN `snippets/mega-menu-list.liquid`
(md5 `9b60f091f726318fc37debafb29c2f0f`, som IKKE er identisk med repoets
kopi, saa lokal laesning var ikke nok):

`<ul class="mega-menu__list">` indeholder FLERE `<li class="mega-menu__column">`.
Lukkelogikken er: en kolonne lukkes naar (a) det er sidste link, (b)
collection_images-tilstand, (c) NAESTE link har boern, eller (d) dette link har
boern og det naeste ikke har. **Et punkt med boern faar altsaa altid sin egen
`<li>`, og loese links samles i én faelles `<li>`.**

"Udstyr" giver derfor praecis to `<li>`:
1. Beskyttelse: `li > div > a.mega-menu__link--parent` + `li > div > ul > li > a`
2. De fem loese: fem soeskende-`div`'er i én `li`

Da `.mega-menu__list` stod paa `display: block`, stablede de to `li` lodret.
Mine 6d-regler stylede hver `li` for sig, saa gruppen fik 4 grid-kolonner med
kun ét element (deraf det tomme felt til hoejre), og `grid-row: span 20`
gjorde ingen forskel paa tvaers af `li`-graensen.

**RIGTIG loesning: `.mega-menu__list` er raekke-containeren.**
- `.mega-menu__list` → `display: flex`, `align-items: stretch`
- `> .mega-menu__column:has(> div > ul)` → `flex: 0 0 220px` + hoejre skillelinje
- `> .mega-menu__column:not(:has(> div > ul))` → `flex: 0 1 740px` + eget
  `auto-fill`-grid

**Plus en fejl mere, som screenshottet ogsaa afsloerede:** panelets indhold
begyndte helt ude i venstre kant, mens menupunktet "UDSTYR" staar centreret i
headeren (logo_position er left, menu_position center). Den forskydning saa
forkert ud i sig selv. Derfor `justify-content: center` paa listen, og
`flex: 0 1 740px` UDEN grow paa link-kolonnen, saa indholdet har en naturlig
bredde der kan centreres i stedet for at blive strakt ud i hele vinduet.

### Laering til fremtidige menu-rettelser
1. `.mega-menu__list` kan indeholde FLERE `.mega-menu__column`. Styl paa
   list-niveau, ikke kolonne-niveau, naar kolonner skal ligge side om side.
2. Div'en mellem `li` og `a` har INGEN klasse. Brug `.mega-menu__column > div`.
   Boerne-`ul` har kun `.list-unstyled`, ingen `mega-menu__*`-klasse.
3. Diskriminatorer: gruppe = `div:has(> ul)`, loest link = `div:not(:has(> ul))`.
4. `class="mega-menu__link "` har et efterhaengende mellemrum naar linket ikke
   har boern. Brug aldrig `[class="mega-menu__link"]`.
5. Repoets kopi af `mega-menu-list.liquid` er IKKE i sync med temaet. Laes
   temaets version foer du skriver selektorer mod den.
