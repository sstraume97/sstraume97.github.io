// Engangs-migreringsscript: konverterer content/posts/*.md (det gamle formatet, se
// scripts/content-parse.mjs som denne gjenbruker parse-logikken fra) til ekte Quarto-sider
// på blogg/posts/<slug>/index.qmd.
//
// Kjøres én gang lokalt: `node scripts/convert-posts.mjs`. Nye innlegg skrives direkte som
// .qmd fremover — dette scriptet trengs ikke i det løpende bygget.

import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const POSTS_SRC = path.join(ROOT, "content", "posts");
// Postene ligger direkte under blogg/<slug>/ (ikke blogg/posts/<slug>/) slik at adressen blir
// /blogg/<slug>/ — identisk med dagens URL-struktur (se VEILEDNING.md).
const POSTS_OUT = path.join(ROOT, "blogg");

const MONTHS = { januar: "01", februar: "02", mars: "03", april: "04", mai: "05", juni: "06",
  juli: "07", august: "08", september: "09", oktober: "10", november: "11", desember: "12" };

function parseFrontmatter(raw) {
  const parts = raw.split(/\n---\s*\n/);
  const head = parts[0];
  const body = parts.slice(1).join("\n---\n");
  const meta = {};
  head.split("\n").forEach(line => {
    const idx = line.indexOf(":");
    if (idx > -1) meta[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  });
  return { meta, body };
}

function toIsoDate(nbDate) {
  const m = (nbDate || "").match(/(\d{1,2})\.\s*([a-zæøå]+)\s*(\d{4})/i);
  if (!m) return null;
  const mo = MONTHS[m[2].toLowerCase()];
  if (!mo) return null;
  return `${m[3]}-${mo}-${m[1].padStart(2, "0")}`;
}

function yamlStr(s) {
  return JSON.stringify(s || "");
}

function yamlList(items) {
  return `[${items.map(s => yamlStr(s)).join(", ")}]`;
}

// Plain avsnitt rendres som rå HTML-<p> i stedet for markdown-tekst. Dette er bevisst:
// disse innleggene er WordPress-eksporter med mye fritekst (tall/parenteser/URL-er/&-tegn
// i klartekst), og enkelte lange innlegg fikk Pandocs markdown-blokkparser til å "spise" og
// miste innhold midt i dokumentet når nok avsnitt (særlig tallinnledede) hopet seg opp inni
// én stor fenced div — en reproduserbar, men uklar Pandoc-parserfeil (se test i PR/commit-logg).
// Rå HTML-avsnitt omgår markdown-blokktolkningen fullstendig og er derfor 100% robust,
// uansett hvordan avsnittet starter. & escapes bevisst IKKE — kildeteksten inneholder både
// gyldige HTML-entiteter (f.eks. "&aring;" -> å, fra WordPress-eksporten) og "tvetydige"
// &-tegn i URL-er, og nettlesere viser begge riktig uansett (HTML5-spec).
function escapeHtmlParagraph(text) {
  return text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function rawParagraph(text) {
  return "```{=html}\n<p>" + escapeHtmlParagraph(text) + "</p>\n```";
}

function convertBody(md) {
  const blocks = (md || "").split(/\n\s*\n/).map(b => b.trim()).filter(Boolean);
  const out = blocks.map(b => {
    if (b.startsWith("#### ")) return `#### ${b.slice(5).trim()}`;
    if (b.startsWith("### ")) return `### ${b.slice(4).trim()}`;
    if (b.startsWith("## ")) return `## ${b.slice(3).trim()}`;
    if (b.startsWith("!!! info:")) return `::: {.info}\n${b.slice(9).trim()}\n:::`;
    if (b.startsWith("!!! advarsel:")) return `::: {.advarsel}\n${b.slice(13).trim()}\n:::`;
    if (b.startsWith("!!! bla:")) return `::: {.bla}\n${b.slice(8).trim()}\n:::`;
    if (b.startsWith("!!! gull:")) return `::: {.gull}\n${b.slice(9).trim()}\n:::`;
    if (b.startsWith("> ")) {
      const rest = b.slice(2).trim();
      const parts = rest.split(/\s*--\s*/);
      const text = parts[0].trim();
      const source = (parts[1] || "Sitat").trim();
      return `::: {.quote}\n${text}\n<span class="source">${source}</span>\n:::`;
    }
    return rawParagraph(b.replace(/\n/g, " "));
  });
  return out.join("\n\n");
}

function shareBlock(title, url) {
  const encTitle = encodeURIComponent(title);
  const encUrl = encodeURIComponent(url);
  return `\`\`\`{=html}
<div class="post-share">
  <span>Del:</span>
  <a href="https://www.facebook.com/sharer/sharer.php?u=${encUrl}" target="_blank" rel="noopener">Facebook</a>
  <a href="https://twitter.com/intent/tweet?text=${encTitle}&url=${encUrl}" target="_blank" rel="noopener">X</a>
  <a href="mailto:?subject=${encTitle}&body=${encUrl}">E-post</a>
  <button type="button" onclick="navigator.clipboard.writeText('${url}');this.textContent='Lenke kopiert!'">Kopier lenke</button>
</div>
\`\`\``;
}

async function main() {
  const files = (await readdir(POSTS_SRC, { withFileTypes: true }))
    .filter(e => e.isFile() && e.name.endsWith(".md"))
    .map(e => e.name)
    .sort();

  let count = 0;
  for (const name of files) {
    const slug = name.replace(/\.md$/, "");
    const rawFile = await readFile(path.join(POSTS_SRC, name), "utf8");
    // Normaliser linjeskift FØR alt annet — enkelte WordPress-eksporterte innlegg har CRLF
    // (\r\n) midt i en "avsnitts"-blokk. \n-erstatningen lenger ned fjerner kun \n og lot \r
    // henge igjen, noe Pandoc tolker som et nytt (gammelt Mac-stil) linjeskip — det fikk
    // Pandocs blokkparser til å mistolke/miste innhold i lengre innlegg med mange slike linjer.
    const raw = rawFile.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    const { meta, body } = parseFrontmatter(raw);

    const title = meta.title || slug;
    const iso = toIsoDate(meta.date) || "2000-01-01";
    const tags = (meta.tags || "").split(",").map(s => s.trim()).filter(Boolean);
    const excerpt = meta.excerpt || "";
    const url = `https://sstraume97.github.io/hjem/blogg/${slug}/`;

    const fmLines = [
      "---",
      `title: ${yamlStr(title)}`,
      `date: ${iso}`,
    ];
    if (tags.length) fmLines.push(`categories: ${yamlList(tags)}`);
    if (excerpt) fmLines.push(`description: ${yamlStr(excerpt)}`);
    fmLines.push(
      "page-layout: article",
      "toc: false",
      "reading-time: true",
      "title-block-banner: false",
      'date-format: "D. MMMM YYYY"',
    );
    fmLines.push("---", "");

    const bodyMd = convertBody(body);
    // OBS: :::: (4 kolon) på ytre div er nødvendig — innholdet kan inneholde
    // ::: {.quote}/.info/.advarsel/.bla/.gull}-divs (3 kolon), og Pandoc krever at ytre
    // fenced div har FLERE kolon enn eventuelle child-divs for at nøsting skal tolkes riktig.
    const qmd = fmLines.join("\n") + `:::: {.post-body}\n${bodyMd}\n\n::::\n\n` + shareBlock(title, url) + "\n";

    const outDir = path.join(POSTS_OUT, slug);
    await mkdir(outDir, { recursive: true });
    await writeFile(path.join(outDir, "index.qmd"), qmd, "utf8");
    count++;
  }

  console.log(`Konverterte ${count} blogginnlegg til ${path.relative(ROOT, POSTS_OUT)}/`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
