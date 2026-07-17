# Veiledning til nettsiden (sstraume97.github.io/hjem)

Denne filen forklarer hvordan nettsiden er satt opp, og hvordan du gjør de vanligste endringene selv.

## 1. Hvordan siden fungerer

- Siden er bygget med **[Quarto](https://quarto.org)**, et publiseringsverktøy som tar imot vanlige tekstfiler (`.qmd` – «Quarto markdown», nesten identisk med vanlig markdown) og bygger dem til ekte, statiske HTML-sider. Hver side har sin egen `.qmd`-fil og sin egen ekte adresse, f.eks. [`kontakt/index.qmd`](kontakt/index.qmd) → `sstraume97.github.io/hjem/kontakt/`.
- Design (farger, fonter, avstander, knapper, infobokser osv.) styres av [`_quarto.yml`](_quarto.yml) (meny, bunntekst, overordnet oppsett) og [`styles/theme.scss`](styles/theme.scss) + [`styles/custom.css`](styles/custom.css) (selve utseendet).
- **Arbeidsflyten for deg er uendret:** du redigerer en `.qmd`-fil, pusher til `main`, og GitHub Actions ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)) bygger siden med `quarto render` og publiserer den automatisk – vanligvis klart i løpet av under et minutt.
- Skulle et bygg feile, blir **ikke** den gamle, fungerende siden overskrevet – forrige vellykkede publisering blir stående til feilen er rettet og du pusher på nytt. Du finner feilmeldingen i **Actions**-fanen på GitHub.

## 2. Publisere en endring

1. Rediger ønsket `.qmd`-fil.
2. Commit og push til `main` (`git add`, `git commit`, `git push`, eller last opp filen direkte i GitHub sitt nettgrensesnitt).
3. Sjekk fanen **Actions** i GitHub-repoet – der ser du bygget kjøre. Når det er grønt, er endringen live.
4. Last siden på nytt (evt. med Ctrl+Shift+R for å unngå nettleser-cache).

**Vil du sjekke hvordan endringen ser ut før du pusher?** Kjør `quarto preview` fra repo-roten (krever [Quarto installert](https://quarto.org/docs/get-started/) lokalt) – det åpner en nettleserfane som oppdaterer seg automatisk mens du redigerer.

## 3. Redigere faste sider

Hver fast side er én `.qmd`-fil du redigerer direkte som vanlig tekst/markdown – ingen egne seksjonsnøkler eller spesialformat å forholde deg til lenger.

| Side | Fil |
|---|---|
| Forside | [`index.qmd`](index.qmd) |
| CV | [`cv/index.qmd`](cv/index.qmd) |
| Kurs | [`kurs/index.qmd`](kurs/index.qmd) |
| Kontakt | [`kontakt/index.qmd`](kontakt/index.qmd) (se punkt 6 for skjema) |
| Nyhetsbrev | [`nyhetsbrev/index.qmd`](nyhetsbrev/index.qmd) + [`nyhetsbrev/takk/index.qmd`](nyhetsbrev/takk/index.qmd) (se punkt 6 for skjema) |
| Stilguide | [`stilguide/index.qmd`](stilguide/index.qmd) |
| Fagstoff (biblioteket) | [`fagstoff/index.qmd`](fagstoff/index.qmd) |
| Fagstoff → Autisme / Asperger / Diagnosekriterier / Jenter | `fagstoff/<tema>/index.qmd` |
| Om meg | [`om-meg/index.qmd`](om-meg/index.qmd) |
| «Gullkorn» | [`gullkorn/index.qmd`](gullkorn/index.qmd) |
| Lenker | [`lenker/index.qmd`](lenker/index.qmd) |
| Opphavsrettsnotis | [`opphavsrettsnotis/index.qmd`](opphavsrettsnotis/index.qmd) |
| Publikasjoner | [`publikasjoner/index.qmd`](publikasjoner/index.qmd) – henter live fra Zotero, se punkt 8 |

### Byggeklosser du kan bruke i teksten

- Vanlig markdown: `##`/`###` for overskrifter, `**fet**`, `*kursiv*`, `- ` for punktlister, `[lenketekst](url)` for lenker.
- Infobokser (samme fire typer som i blogginnlegg, se punkt 4):
  ```markdown
  ::: {.info}
  Tekst i en grønn infoboks.
  :::
  ```
  Bytt `.info` med `.advarsel`, `.bla` eller `.gull` for de andre variantene.
- Knapper: `[Knappetekst](url){.btn .btn-primary}` (eller `.btn-secondary` / `.btn-ghost`).
- Sitatblokk med kilde:
  ```markdown
  ::: {.quote}
  Selve sitatet.
  <span class="source">Kilden</span>
  :::
  ```

**OBS – nøstede bokser:** hvis du legger en boks (`::: {.xxx}`) *inni* en annen boks, må den ytre boksen ha **flere kolon** enn den indre, f.eks. `:::: {.ytre}` rundt `::: {.indre}`. Ellers blir det synlige `:::`-tegn på siden. Vanlig tekst rett etter hverandre (ikke nøstet) trenger ikke dette.

## 4. Blogginnlegg

Alle innlegg ligger i [`blogg/`](blogg/), én mappe per innlegg: `blogg/<mappenavn>/index.qmd`. Mappenavnet blir adressen, f.eks. `blogg/mitt-nye-innlegg/` → `sstraume97.github.io/hjem/blogg/mitt-nye-innlegg/`.

### Nytt innlegg

Opprett `blogg/mitt-nye-innlegg/index.qmd`:

```markdown
---
title: "Tittelen på innlegget"
date: 2026-07-16
categories: [Rettigheter, Skole]
description: "En kort setning som vises i lista over blogginnlegg."
page-layout: article
toc: false
reading-time: true
title-block-banner: false
date-format: "D. MMMM YYYY"
---

::: {.post-body}
Første avsnitt i innlegget.

Andre avsnitt. Vanlige avsnitt skiller du med en tom linje, akkurat som før.

## En overskrift
Overskrifter (`##`/`###`/`####`) nummereres automatisk (1, 2, 3 … / 1.1, 1.2 … / 1.1.1 …).

::: {.info}
En infoboks.
:::
:::
```

- `categories` brukes til tagg-filteret på blogglisten – kommaseparert i klammer, som over.
- `date` skrives som `ÅÅÅÅ-MM-DD` (sorteres automatisk kronologisk; vises på siden som norsk dato, f.eks. «16. juli 2026», takket være `date-format`-linjen).
- Lesetid (`reading-time: true`) regnes automatisk ut fra teksten – du trenger ikke oppgi den selv lenger.
- Selve brødteksten pakkes i `::: {.post-body}` … `:::` (gir nummererte overskrifter riktig style) – kopiér gjerne toppen av en eksisterende fil i `blogg/` som mal.
- Del-knapper (Facebook/X/e-post/kopier lenke) nederst i innlegget legges til automatisk hvis du kopierer HTML-blokken fra bunnen av et eksisterende innlegg.

### Endre eller slette et innlegg

- **Endre:** rediger `.qmd`-filen direkte.
- **Slette:** slett hele mappen (`blogg/<mappenavn>/`). Innlegget forsvinner fra bloggen ved neste bygg.

## 5. Prosjekter

Hvert prosjekt er en egen fil, `prosjekter/<mappenavn>/index.qmd`, med egen adresse (`prosjekter/<mappenavn>/`) – samme mønster som blogginnlegg. Kopiér en eksisterende fil i [`prosjekter/`](prosjekter/) som mal:

```markdown
---
title: "Prosjektets tittel"
date: 2026-07-16
description: "Kort ingress som vises på prosjekt-oversikten."
page-layout: article
toc: false
title-block-banner: false
date-format: "D. MMMM YYYY"
---

<p class="card-kicker">Type prosjekt</p>

Brødtekst om prosjektet.

[Besøk prosjektet →](https://eksempel.no){.btn .btn-primary target="_blank" rel="noopener"}

[← Tilbake til prosjekter](../index.qmd){.btn .btn-ghost}
```

[`prosjekter/index.qmd`](prosjekter/index.qmd) er en oversiktsside som automatisk lister opp alle prosjekt-mappene – du trenger ikke oppdatere den selv når du legger til eller fjerner et prosjekt.

## 6. Kontakt- og nyhetsbrevskjema (HubSpot ⇄ Web3Forms)

Begge skjemasidene ([`kontakt/index.qmd`](kontakt/index.qmd) og [`nyhetsbrev/index.qmd`](nyhetsbrev/index.qmd)) inneholder to skjema-varianter i samme rå HTML-blokk:

- **HubSpot** er den aktive varianten i dag (matcher det som var live før omleggingen).
- Rett under, **kommentert ut** (`<!-- … -->`), ligger et Web3Forms-skjema klart til bruk.

For å bytte: kommenter ut HubSpot-blokken (script + `hs-form-frame`-div) og fjern kommentartegnene rundt Web3Forms-skjemaet. Begge sider har sin egen, uavhengige blokk, så du kan bruke ulike skjema på de to sidene.

## 7. Meny, sosiale lenker og bunntekst

Alt dette styres fra [`_quarto.yml`](_quarto.yml):

- **`website.navbar`**: menypunktene, i rekkefølge. Undermenyer (Fagstoff, Om meg) er `menu:`-lister under sitt hovedpunkt.
- **`website.page-footer`**: `left`/`right` er markdown-tekst – merkenavn/copyright/tagline til venstre, sosiale lenker + RSS/Stilguide/Opphavsrettsnotis til høyre.

Endringer her krever ingen kodeforståelse – det er ren YAML og markdown.

## 8. Publikasjoner

Publikasjons-siden ([`publikasjoner/index.qmd`](publikasjoner/index.qmd)) henter **ikke** fra en fil i repoet, men direkte fra en offentlig **Zotero-gruppe** (`SBS-publikasjoner`, gruppe-id `6615478`, samling `3CG564LB`) hver gang siden lastes i nettleseren. Vil du legge til eller endre en publikasjon, gjør du det i Zotero – ikke i dette repoet. De fire oppføringene i selve `.qmd`-filen vises kun som midlertidig fallback dersom Zotero-kallet feiler.

## 9. Design/utseende

Skal du endre farger, fonter, avstander eller stilen på knapper/kort/infobokser, gjør du det i:

- [`styles/theme.scss`](styles/theme.scss) – grunnfarger, fonter (Playfair Display til overskrifter, Libre Baskerville til brødtekst), Bootstrap-variabler.
- [`styles/custom.css`](styles/custom.css) – alt det spesifikke (infobokser, sitatstil, grid-layouter for forside/CV/prosjekter, blogglistens radlayout, nummererte overskrifter, a11y-widget, responsivt).

Etter en endring her, kjør `quarto preview` for å se resultatet før du pusher.

## 10. Bygg-steget i detalj

- **`quarto render`** – bygger alle `.qmd`-filene til ferdige HTML-sider i `_site/` (ikke committet til git – bygges på nytt hver gang).
- **`.github/workflows/deploy.yml`** – kjører `quarto render` og publiserer `_site/` via GitHub Pages ved hver push til `main`.
- **Teste et bygg lokalt:** kjør `quarto render` fra repo-roten (krever [Quarto installert](https://quarto.org/docs/get-started/)) – skriver resultatet til `_site/` uten å påvirke den live siden. `quarto preview` gjør det samme, men med automatisk oppdatering i nettleseren mens du redigerer.

## 11. Rask oppsummering – «jeg vil …»

- **… endre tekst på en fast side** → finn riktig fil i tabellen i punkt 3.
- **… skrive et nytt blogginnlegg** → ny mappe i `blogg/`, se punkt 4.
- **… legge til/fjerne et prosjekt** → ny/slettet mappe i `prosjekter/`, se punkt 5.
- **… endre menytekst, sosiale lenker eller footer** → `_quarto.yml`, se punkt 7.
- **… legge til en lenkegruppe eller lenke** → `lenker/index.qmd`, vanlig markdown.
- **… endre CV** → `cv/index.qmd`.
- **… bytte kontakt-/nyhetsbrevskjema mellom HubSpot og Web3Forms** → se punkt 6.
- **… legge til en publikasjon** → gjøres i Zotero, ikke i repoet.
- **… endre design/farger/fonter** → `styles/theme.scss` og `styles/custom.css`, se punkt 9.
- **… se om bygget mitt gikk bra** → fanen **Actions** i GitHub-repoet.
