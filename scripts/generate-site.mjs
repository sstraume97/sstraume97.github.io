// Bygger den statiske nettsiden til dist/: én ekte HTML-side per rute (inkl. ett
// blogginnlegg per fil i content/posts/), med innhold fra content/*.md bakt inn i
// data-props i stedet for hentet live fra GitHub sitt API i nettleseren.
//
// Kjøres av .github/workflows/deploy.yml ved hver push til main, og kan kjøres
// lokalt for testing: `node scripts/generate-site.mjs`.

import { readFile, writeFile, mkdir, readdir, rm, cp, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  parseFrontmatter, parseMdSections, parseNbDate, parseSiteMd, parseMarkdown, parsePlainMarkdown
} from "./content-parse.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CONTENT = path.join(ROOT, "content");
const TEMPLATE_PATH = path.join(ROOT, "templates", "page.html");
const OUT = path.join(ROOT, "dist");

async function readIfExists(p) {
  try { return await readFile(p, "utf8"); } catch { return null; }
}

async function listMdFiles(dir) {
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    return entries.filter(e => e.isFile() && e.name.endsWith(".md")).map(e => e.name).sort();
  } catch { return []; }
}

async function loadPosts() {
  const files = await listMdFiles(path.join(CONTENT, "posts"));
  const posts = [];
  for (const name of files) {
    const raw = await readFile(path.join(CONTENT, "posts", name), "utf8");
    const { meta, body } = parseFrontmatter(raw);
    posts.push({
      id: name.replace(/\.md$/, ""),
      title: meta.title || name,
      date: meta.date || "",
      read: meta.read || "",
      tags: (meta.tags || "").split(",").map(s => s.trim()).filter(Boolean),
      excerpt: meta.excerpt || "",
      body: parseMarkdown(body)
    });
  }
  posts.sort((a, b) => parseNbDate(b.date) - parseNbDate(a.date));
  return posts;
}

async function loadProjects() {
  const files = await listMdFiles(path.join(CONTENT, "projects"));
  const projects = [];
  for (const name of files) {
    const raw = await readFile(path.join(CONTENT, "projects", name), "utf8");
    const { meta, body } = parseFrontmatter(raw);
    projects.push({
      id: name.replace(/\.md$/, ""),
      title: meta.title || name,
      type: meta.type || "",
      date: meta.date || "",
      blurb: meta.blurb || "",
      url: meta.url || "",
      img: meta.img || "",
      body: parsePlainMarkdown(body)
    });
  }
  return projects;
}

async function loadSections(relPath) {
  const raw = await readIfExists(path.join(CONTENT, relPath));
  return raw === null ? null : parseMdSections(raw);
}

function escapeAttr(str) {
  return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function buildDataProps(props) {
  const meta = {};
  for (const [k, v] of Object.entries(props)) {
    if (v === undefined) continue;
    meta[k] = { default: v };
  }
  return escapeAttr(JSON.stringify(meta));
}

const DATA_PROPS_RE = /(<script type="text\/x-dc" data-dc-script data-props=")[^"]*(">)/;

async function writePage(template, outDir, props) {
  const dataProps = buildDataProps(props);
  if (!DATA_PROPS_RE.test(template)) {
    throw new Error("Fant ikke data-props-attributtet i malen — sjekk templates/page.html");
  }
  const html = template.replace(DATA_PROPS_RE, (_, pre, post) => pre + dataProps + post);
  const dir = path.join(OUT, outDir);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, "index.html"), html, "utf8");
}

async function copyStatic() {
  await cp(path.join(ROOT, "support.js"), path.join(OUT, "support.js"));
  await cp(path.join(ROOT, "_ds"), path.join(OUT, "_ds"), { recursive: true });
  await cp(path.join(ROOT, "assets"), path.join(OUT, "assets"), { recursive: true });
  await writeFile(path.join(OUT, ".nojekyll"), "");
}

async function main() {
  await rm(OUT, { recursive: true, force: true });
  await mkdir(OUT, { recursive: true });

  const template = await readFile(TEMPLATE_PATH, "utf8");

  const siteConfigRaw = await readIfExists(path.join(CONTENT, "site.md"));
  const posts = await loadPosts();
  const projects = await loadProjects();
  // Listesider (forsiden, blogg-listen) trenger aldri innleggsteksten, bare metadata –
  // den fulle teksten bakes heller inn alene på det aktuelle innleggets egen side
  // (se writePage-kallet lenger ned). Uten dette ville hver eneste side på sajten
  // dratt med seg *alle* innleggenes fulle brødtekst (flere MB i dette tilfellet).
  const postsLight = posts.map(({ body, ...rest }) => rest);

  const common = {
    initialSiteConfig: siteConfigRaw === null ? undefined : parseSiteMd(siteConfigRaw),
    initialPosts: postsLight.length ? postsLight : undefined,
    initialProjects: projects.length ? projects : undefined,
    initialCvMd: await loadSections("cv.md"),
    initialKursMd: await loadSections("kurs.md"),
    initialKontaktMd: await loadSections("kontakt.md"),
    initialNyhetsbrevMd: await loadSections("nyhetsbrev.md"),
    initialStilguideMd: await loadSections("stilguide.md"),
    initialHeroMd: await loadSections("home/hero.md"),
    initialServicesMd: await loadSections("home/services.md"),
    initialPodcastMd: await loadSections("home/podcast.md"),
    initialFagstoffMd: await loadSections("fagstoff.md"),
    initialLenkerMd: await loadSections("lenker.md"),
    initialOmMegMd: await loadSections("om-meg.md"),
    initialGullkornMd: await loadSections("gullkorn.md"),
    initialFagstoffAutismeMd: await loadSections("fagstoff-autisme.md"),
    initialFagstoffAspergerMd: await loadSections("fagstoff-asperger.md"),
    initialFagstoffDiagnoseMd: await loadSections("fagstoff-diagnosekriterier.md"),
    initialFagstoffJenterMd: await loadSections("fagstoff-jenter.md"),
    initialOpphavsrettMd: await loadSections("opphavsrettsnotis.md"),
    podcastFeatured: true,
    showBlogTags: true
  };
  // fjern null-verdier (fil fantes ikke) slik at klienten faller tilbake på sine egne standardtekster
  for (const k of Object.keys(common)) if (common[k] === null) delete common[k];

  const fixedRoutes = [
    ["", "hjem"],
    ["blogg", "blogg"],
    ["publikasjoner", "publikasjoner"],
    ["prosjekter", "prosjekter"],
    ["cv", "cv"],
    ["kurs", "kurs"],
    ["kontakt", "kontakt"],
    ["nyhetsbrev", "nyhetsbrev"],
    ["nyhetsbrev/takk", "nyhetsbrev-takk"],
    ["stilguide", "stilguide"],
    ["fagstoff", "fagstoff"],
    ["fagstoff/autisme", "fs-autisme"],
    ["fagstoff/asperger", "fs-asperger"],
    ["fagstoff/diagnosekriterier", "fs-diagnose"],
    ["fagstoff/jenter", "fs-jenter"],
    ["lenker", "lenker"],
    ["om-meg", "om-meg"],
    ["gullkorn", "gullkorn"],
    ["opphavsrettsnotis", "opphavsrett"]
  ];

  let count = 0;
  for (const [outDir, startView] of fixedRoutes) {
    await writePage(template, outDir, { ...common, startView });
    count++;
  }
  for (const post of posts) {
    // Egen side per innlegg: bare dette ene innlegget (med full brødtekst) trengs her –
    // ikke hele biblioteket, jf. postsLight over.
    await writePage(template, `blogg/${post.id}`, { ...common, initialPosts: [post], startView: "blogg", startPostId: post.id });
    count++;
  }

  await copyStatic();

  console.log(`Bygget ${count} sider (${fixedRoutes.length} faste ruter + ${posts.length} blogginnlegg) til ${path.relative(ROOT, OUT)}/`);
  if (!projects.length) {
    console.log("Merk: content/projects/ finnes ikke (eller er tom) — prosjektlisten bruker fortsatt de hardkodede eksemplene fra malen.");
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
