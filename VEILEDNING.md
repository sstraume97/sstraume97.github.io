# Veiledning til nettsiden (sstraume97.github.io/hjem)

Denne filen forklarer hvordan nettsiden er satt opp, og hvordan du gjør de vanligste endringene selv – uten å måtte røre koden.

## 1. Hvordan siden fungerer

- Siden er **statisk** og ligger i GitHub-repoet `sstraume97/hjem`, publisert med **GitHub Pages**. Hver side (forsiden, blogginnlegg, CV, osv.) er en egen, ekte HTML-fil med sin egen adresse, f.eks. `sstraume97.github.io/hjem/blogg/` eller `.../blogg/jeg-er-autist-ikke-en-person-med-autisme/`.
- Disse HTML-filene skriver du **aldri direkte** – de blir generert automatisk av et **bygge-steg** (GitHub Actions, se [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)) hver gang du pusher til `main`. Selve kilden til layout/design/funksjonalitet er [`templates/page.html`](templates/page.html) (samme mal for alle sider – kun innholdet og hvilken visning som er "på" ved sideåpning skiller dem), og selve genereringen skjer i [`scripts/generate-site.mjs`](scripts/generate-site.mjs) (som leser alle filene i [`content/`](content/) og skriver ut én HTML-fil per side/innlegg til en `dist/`-mappe som publiseres).
- **Arbeidsflyten for deg er uendret:** du redigerer en `.md`-fil i `content/`, pusher til `main`, og GitHub bygger og publiserer automatisk – vanligvis klart i løpet av under et minutt. Du trenger aldri å kjøre noe selv.
- Mangler en seksjon/fil, brukes en innebygd standardtekst fra `templates/page.html` i stedet – det er normalt og ikke en feil.
- `_ds/`-mappen er et generert **designsystem** (farger, fonter, komponent-bundle). Den bør du ikke redigere manuelt – den er koblet til designverktøyet nettsiden er bygget med.

## 2. Publisere en endring

1. Rediger ønsket(e) fil(er) i `content/`.
2. Commit og push til `main` på GitHub (`git add`, `git commit`, `git push`, eller last opp filen direkte i GitHub sitt nettgrensesnitt).
3. Sjekk fanen **Actions** i GitHub-repoet – der ser du bygget kjøre (tar normalt under ett minutt). Når det er grønt, er endringen live.
4. Last siden på nytt (evt. med Ctrl+Shift+R for å unngå nettleser-cache).

Skulle et bygg av en eller annen grunn feile (f.eks. en `.md`-fil med ugyldig format), blir **ikke** den gamle, fungerende siden overskrevet – forrige vellykkede publisering blir stående til feilen er rettet og du pusher på nytt. Du finner feilmeldingen i **Actions**-fanen.

Blogginnlegg får automatisk sin egen adresse basert på filnavnet i `content/posts/` (se punkt 4). **Prosjekter** får foreløpig ikke egne adresser ennå, se punkt 5.

## 3. Redigere faste sider (tekst)

Disse filene er delt opp i seksjoner med `## Overskrift` – overskriften er nøkkelen koden leter etter, så **ikke endre selve overskriftene**, bare teksten under. Mangler en seksjon i filen, brukes en innebygd standardtekst i stedet.

| Side | Fil |
|---|---|
| Forside – hero (kicker/tittel/tekst) | [`content/home/hero.md`](content/home/hero.md) |
| Forside – de 3 tjenestekortene | [`content/home/services.md`](content/home/services.md) (seksjonsnavn = korttittel) |
| Forside – podkast-boks | [`content/home/podcast.md`](content/home/podcast.md) |
| CV | [`content/cv.md`](content/cv.md) (se eget punkt under) |
| Kurs | [`content/kurs.md`](content/kurs.md) |
| Kontakt (intro-tekst) | [`content/kontakt.md`](content/kontakt.md) (se punkt 3.2 for hvordan du bytter selve kontaktskjemaet) |
| Nyhetsbrev | [`content/nyhetsbrev.md`](content/nyhetsbrev.md) (se punkt 3.2 for hvordan du bytter selve påmeldingsskjemaet) |
| Stilguide (intro-tekst) | [`content/stilguide.md`](content/stilguide.md) |
| Fagstoff (biblioteket) | [`content/fagstoff.md`](content/fagstoff.md) |
| Fagstoff → Autisme | [`content/fagstoff-autisme.md`](content/fagstoff-autisme.md) |
| Fagstoff → Asperger syndrom | [`content/fagstoff-asperger.md`](content/fagstoff-asperger.md) |
| Fagstoff → Diagnosekriterier | [`content/fagstoff-diagnosekriterier.md`](content/fagstoff-diagnosekriterier.md) (fritekst i `## Tekst`, vises med linjeskift bevart) |
| Fagstoff → Jenter/kvinner | [`content/fagstoff-jenter.md`](content/fagstoff-jenter.md) |
| Om meg | [`content/om-meg.md`](content/om-meg.md) (se eget punkt under) |
| «Gullkorn» | [`content/gullkorn.md`](content/gullkorn.md) (se eget punkt under) |
| Lenker | [`content/lenker.md`](content/lenker.md) (se eget punkt under) |
| Opphavsrettsnotis | [`content/opphavsrettsnotis.md`](content/opphavsrettsnotis.md) |

Eksempel – å endre hero-teksten på forsiden: åpne `content/home/hero.md` og skriv under riktig overskrift:

```markdown
## Kicker
Nestleder · formidler · brukermedvirker

## Tittel
Et inkluderende og varmere samfunn – for alle.

## Tekst
Jeg er Sondre Bogen-Straume, ...
```

### 3.1 Lister med flere felt (bruker `|` som skilletegn)

Noen seksjoner inneholder én oppføring per linje, med felt adskilt av `|`. **Ikke bytt ut `|` med noe annet**, og ikke legg til tomme linjer midt i listen.

- **CV → `## Erfaring`**: `Rolle | Organisasjon | Periode`
- **CV → `## Utdanning`**: `Skole | Detaljer`
- **Kurs → `## Kurstilbud`**: `Kicker | Tittel | Beskrivelse`
- **Om meg → `## Verv`**: én linje per verv (ingen `|`, bare fritekst per linje)
- **Gullkorn → `## Gullkorn`**: `Sitat-tekst | Dato`
- **Lenker**: hver `##`-overskrift blir en lenkegruppe, og hver linje under er `Lenketekst | URL`

Eksempel fra `content/lenker.md`:

```markdown
## Foreninger
Autismeforeningen i Norge | http://www.autismeforeningen.no
AD/HD foreningen i Norge | http://www.adhdnorge.no

## Kompetansesentre
Glenne regionalt senter for autisme | http://www.glennesenter.no
```

Vil du lage en **helt ny lenkegruppe**, legg bare til en ny `## Gruppenavn`-overskrift med linjer under – den dukker automatisk opp på Lenker-siden.

### 3.2 Bytte skjema på Kontakt og Nyhetsbrev (Web3Forms ⇄ HubSpot)

Både [`content/nyhetsbrev.md`](content/nyhetsbrev.md) og [`content/kontakt.md`](content/kontakt.md) støtter en egen `## Skjema`-seksjon som styrer **hvilket** skjema som vises – uten kodeendring:

```markdown
## Skjema
type: hubspot
portal-id: 139809075
form-id: 0e72c802-50c1-4d2c-9e57-b8b9ff2070a8
region: eu1
```

- `type: hubspot` viser HubSpot-skjemaet ditt (embeddet som iframe via HubSpots offisielle forms-embed-script).
- Fjerner du hele `## Skjema`-seksjonen (eller setter `type` til noe annet enn `hubspot`, f.eks. `web3forms`), vises det opprinnelige enkle Web3Forms/Web3Forms-skjemaet igjen – helt automatisk. For nyhetsbrev er det det gamle Web3Forms-påmeldingsskjemaet, for kontakt er det det gamle Web3Forms-baserte kontaktskjemaet.
- `portal-id`/`form-id`/`region` henter du fra embed-koden HubSpot gir deg under Marketing → Forms → Del/Embed (samme tre verdier som står i `data-portal-id`, `data-form-id` og `data-region` i koden HubSpot viser deg).
- De to filene har **hver sin** `## Skjema`-seksjon – du kan altså bruke HubSpot på den ene siden og Web3Forms på den andre, helt uavhengig av hverandre.

**Begrensning:** i dag støtter koden kun disse to skjematypene (Web3Forms og HubSpot), og kun på Kontakt- og Nyhetsbrev-siden. Skal du bytte til en tredje tjeneste, eller ha samme fleksibilitet et annet sted, må det legges til i `templates/page.html` først – si ifra, så utvider vi det på samme måte.

## 4. Blogginnlegg

Alle innlegg ligger som egne filer i [`content/posts/`](content/posts/). Filnavnet blir automatisk innleggets URL/id, så bruk små bokstaver og bindestrek (f.eks. `mitt-nye-innlegg.md`).

### Legge til et nytt innlegg

Opprett en ny fil i `content/posts/`, f.eks. `content/posts/mitt-nye-innlegg.md`:

```markdown
title: Tittelen på innlegget
date: 16. juli 2026
read: 4 min
tags: Rettigheter, Skole
excerpt: En kort setning som vises i lista over blogginnlegg.
---
Første avsnitt i innlegget.

Andre avsnitt. Du kan skrive helt vanlig brødtekst i egne "blokker" adskilt med tom linje.
```

- Feltene over den første `---` er **metadata** (frontmatter). Alle er valgfrie, men `title` bør alltid være med.
- `tags` er kommaseparert og brukes både til filtreringsknappene på blogg-siden og til «relatert»-visning.
- `date` er fritekst som vises på siden, men brukes også til sortering – skriv den som `dd. måned åååå` (norsk månedsnavn, f.eks. `3. april 2026`) så sorteres innleggene riktig kronologisk.
- Alt **etter** `---` er selve innlegget. Hvert avsnitt skilles med en **tom linje**.

### Spesielle blokker i brødteksten

Disse prefiksene på starten av en "blokk" (avsnitt) gir spesiell formatering:

| Skriv dette | Blir til |
|---|---|
| `## Tekst` | Overskrift nivå 2 (nummereres automatisk 1, 2, 3 …) |
| `### Tekst` | Overskrift nivå 3 (nummereres 1.1, 1.2 …) |
| `#### Tekst` | Overskrift nivå 4 (nummereres 1.1.1 …) |
| `!!! info: Tekst` | Grønn infoboks |
| `!!! advarsel: Tekst` | Rød/oransje advarselboks |
| `!!! bla: Tekst` | Blå infoboks (supplerende/tips) |
| `!!! gull: Tekst` | Gul «gull»-boks (anbefalinger/nøkkelpoeng) |
| `> Sitatet -- Kilden` | Sitatblokk med kildehenvisning (`--` skiller sitat og kilde) |

Eksempel:

```markdown
## Hvorfor dette er viktig

Vanlig brødtekst her.

!!! info: Spør alltid den enkelte hvilket ord de selv foretrekker.

> Ingenting om oss uten oss -- Prinsipp innen selvadvokatering
```

**Begrensning:** kulepunkter, litra (a/b/c), avsnittsnummer og «pull quotes»/uthevede sitater (de du ser demonstrert på [Stilguide-siden](content/stilguide.md)) støttes foreløpig **kun** for innlegg som er hardkodet direkte i `templates/page.html` (i `rawPosts()`), ikke for `.md`-filer i `content/posts/`. Trenger du disse elementene i et innlegg, må det legges inn i koden – si ifra, så kan jeg hjelpe med det.

### Endre eller slette et innlegg

- **Endre:** rediger `.md`-filen direkte.
- **Slette:** slett `.md`-filen. Den forsvinner fra bloggen (og adressen slutter å eksistere) ved neste bygg.
- **Bilder i innlegg:** støttes ikke i innleggsteksten per nå (kun ren tekst/blokkene over). Portrettbildet på forsiden er hardkodet i `templates/page.html` (se punkt 7).
- **Adresse:** hvert innlegg får automatisk sin egen side på `sstraume97.github.io/hjem/blogg/<filnavn>/` – ingenting å konfigurere, det skjer av bygge-scriptet for hver fil i `content/posts/`.

## 5. Prosjekter

Prosjektlisten er koblet opp til å lese fra `content/projects/`, men **denne mappen finnes ikke i repoet ennå** – helt til den opprettes viser siden de 6 eksempelprosjektene som ligger hardkodet i `templates/page.html` (Ordbøkene.no, Ord og forkortelser, osv.), med detaljvisning inni selve prosjektsiden (ikke egen adresse per prosjekt).

For å ta over styringen med egne filer: opprett `content/projects/` og legg inn én `.md`-fil per prosjekt, f.eks. `content/projects/mitt-prosjekt.md`:

```markdown
title: Prosjektets tittel
type: Programvare
date: 14. juli 2026
blurb: Kort ingress som vises på prosjekt-oversikten.
url: https://eksempel.no/prosjektet
img: 2026/07/mitt-bilde.png
---
Første avsnitt i den fulle prosjektbeskrivelsen.

Andre avsnitt.
```

- `img` er banen til bildet **relativt til** `https://sondrestraume.wordpress.com/wp-content/uploads/` (samme WordPress-mediebibliotek som brukes i dag). Skal du bruke bilder fra et annet sted, må koden justeres (se punkt 7).
- Brødteksten her støtter **ikke** overskrifter/infobokser/sitater slik innlegg gjør – bare rene avsnitt (eventuelle `#`/`>`-tegn blir fjernet automatisk).
- **Viktig:** Så lenge `content/projects/` ikke finnes, vil oppretting av mappen med *én* fil i seg selv gjøre at *alle* seks eksempelprosjektene forsvinner og erstattes av det du har lagt inn – legg derfor inn alle prosjektene du vil vise, i samme omgang.
- **Egne adresser per prosjekt** (tilsvarende blogginnlegg) er ikke satt opp ennå, siden det ikke finnes ekte prosjektfiler å generere fra. Den dagen du oppretter `content/projects/*.md`, er det en liten, lav-risiko utvidelse av `scripts/generate-site.mjs` å legge til – si ifra når du har innhold klart, så gjør vi det da.

## 6. Meny, sosiale lenker og bunntekst

Alt dette styres fra [`content/site.md`](content/site.md), delt i tre seksjoner:

```markdown
## Meny
Hjem: Hjem
Blogg: Blogg
...

## Sosiale
LinkedIn: https://www.linkedin.com/in/sondre-bogen-straume/
...

## Sidefot
Tagline: Nestleder i Autismeforeningen i Norge
```

- **`## Meny`**: `Sidenavn: Visningstekst` – lar deg endre *teksten* som vises i menyen (venstre side er en fast nøkkel, ikke rediger den; høyre side er det som vises).
- **`## Sosiale`**: `Tjeneste: URL` – disse vises både i toppmenyen/kontaktsiden og i bunnteksten. Legg til en ny linje for en ny sosial lenke, eller fjern en linje for å fjerne den.
- **`## Sidefot`**: `Tagline: teksten under copyright-linjen i footeren`.

## 7. Ting som krever koding i `templates/page.html`

Følgende kan **ikke** gjøres via `content/`-filene, og krever at malen/logikken i `templates/page.html` (og evt. `scripts/generate-site.mjs`) endres direkte:

- Nye sider/seksjoner i menyen (utover de som finnes i dag)
- Endre selve strukturen/rekkefølgen på menypunktene
- Bilder inne i blogginnlegg, eller avanserte blokktyper (kulepunkter, litra, avsnittsnummer, uthevede/pull-sitater) i innlegg hentet fra `content/posts/`
- Forsidens portrettbilde (URL er hardkodet i `<img src="...">` nær toppen av `templates/page.html`)
- Web3Forms-nøklene for kontaktskjema (`WEB3_KEY`) og nyhetsbrev (i skjemaets skjulte `access_key`-felt), og HubSpot-embedscriptet
- Zotero-gruppe/-samling for Publikasjoner-siden (`zoteroGroup` / `zoteroCollection` i koden)
- Design/farger/fonter (styres av `_ds/`-designsystemet, ikke av innholdsfilene)
- Egne adresser per prosjekt (se punkt 5)

Trenger du noe av dette, er det bare å be meg om hjelp – da gjør vi endringen sammen i `templates/page.html`.

## 8. Publikasjoner

Publikasjons-siden henter **ikke** fra `content/` eller bygge-steget, men direkte fra en offentlig **Zotero-gruppe** (`SBS-publikasjoner`, gruppe-id `6615478`, samling `3CG564LB`) hver gang siden lastes i nettleseren – dette er den ene siden som fortsatt henter live, siden publikasjonslisten endrer seg oftere enn et bygg gir mening for. Vil du legge til eller endre en publikasjon, gjør du det i Zotero – ikke i dette repoet. (Fire eksempeloppføringer i koden vises kun som midlertidig fallback dersom Zotero-kallet feiler.)

## 9. Kontakt- og nyhetsbrevskjema

Standardskjemaene sender til **Web3Forms** (en ekstern skjematjeneste – ingen egen backend); du kan også bytte til HubSpot per side via `## Skjema`-seksjonen i `content/kontakt.md`/`content/nyhetsbrev.md`, se punkt 3.2. Innsendinger via Web3Forms går til e-posten registrert på Web3Forms-kontoen; det er ingenting å vedlikeholde i repoet med mindre nøklene må byttes (se punkt 7).

## 10. Bygg-steget i detalj

- **`scripts/content-parse.mjs`** – de rene funksjonene som tolker markdown-formatet (frontmatter, seksjoner, spesialblokker). Speiler tilsvarende funksjoner i `templates/page.html` og må holdes i sync manuelt om parsing-reglene noen gang endres.
- **`scripts/generate-site.mjs`** – leser alt i `content/`, bygger én komplett HTML-side per rute (samme mal, ulikt innhold bakt inn), og skriver til en `dist/`-mappe (kun i bygget, ikke committet til git).
- **`.github/workflows/deploy.yml`** – kjører generatoren og publiserer `dist/` via GitHub Pages ved hver push til `main`.
- **Vil du teste et bygg lokalt** (f.eks. før du er sikker på en stor endring): kjør `node scripts/generate-site.mjs` fra repo-roten (krever Node.js installert) – det skriver resultatet til `dist/` uten å påvirke den live siden.

## 11. Rask oppsummering – "jeg vil …"

- **… endre tekst på en fast side** → finn riktig fil i tabellen i punkt 3, rediger under riktig `##`-overskrift.
- **… skrive et nytt blogginnlegg (med egen adresse)** → ny fil i `content/posts/`, se punkt 4.
- **… legge til/fjerne et prosjekt** → filer i `content/projects/`, se punkt 5.
- **… endre menytekst, sosiale lenker eller footer-tagline** → `content/site.md`, se punkt 6.
- **… legge til en lenkegruppe eller lenke** → `content/lenker.md`, se punkt 3.1.
- **… endre CV** → `content/cv.md`, se punkt 3.1 for `|`-formatet på erfaring/utdanning.
- **… bytte kontakt-/nyhetsbrevskjema mellom Web3Forms og HubSpot** → `## Skjema`-seksjonen i `content/kontakt.md`/`content/nyhetsbrev.md`, se punkt 3.2.
- **… legge til en publikasjon** → gjøres i Zotero, ikke i repoet.
- **… endre design/farger/fonter/meny-struktur/bilder i innlegg** → krever kodeendring i `templates/page.html`, se punkt 7.
- **… se om bygget mitt gikk bra** → fanen **Actions** i GitHub-repoet.
