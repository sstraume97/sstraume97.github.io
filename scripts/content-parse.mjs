// Node-port av parse-hjelperne i templates/page.html (Component-klassen).
// Rene strengfunksjoner, ingen nettleser-API-er brukt av originalene, så dette
// er en direkte kopi (holdes i sync manuelt om parsing-logikken endres i malen).

export function parseFrontmatter(raw) {
  const parts = (raw || "").split(/\n---\s*\n/);
  const head = parts[0];
  const body = parts.slice(1).join("\n---\n");
  const meta = {};
  head.split("\n").forEach(line => {
    const idx = line.indexOf(":");
    if (idx > -1) meta[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  });
  return { meta, body };
}

export function parseMdSections(txt) {
  const secs = {};
  let cur = null, buf = [];
  const flush = () => { if (cur !== null) secs[cur] = buf.join("\n").trim(); };
  (txt || "").split("\n").forEach(line => {
    const m = line.match(/^#{2,3}\s+(.+)/);
    if (m) { flush(); cur = m[1].trim(); buf = []; }
    else if (cur !== null) buf.push(line);
  });
  flush();
  return secs;
}

export function parseNbDate(s) {
  const months = { januar: 0, februar: 1, mars: 2, april: 3, mai: 4, juni: 5, juli: 6, august: 7, september: 8, oktober: 9, november: 10, desember: 11 };
  const m = (s || "").match(/(\d{1,2})\.\s*([a-zæøå]+)\s*(\d{4})/i);
  if (!m) return 0;
  const mo = months[m[2].toLowerCase()];
  if (mo === undefined) return 0;
  return new Date(+m[3], mo, +m[1]).getTime();
}

export function parseSiteMd(txt) {
  const sections = {};
  let cur = null;
  (txt || "").split("\n").forEach(line => {
    const h = line.match(/^##\s+(.+)/);
    if (h) { cur = h[1].trim(); sections[cur] = []; return; }
    if (cur && line.trim()) {
      const idx = line.indexOf(":");
      if (idx > -1) sections[cur].push({ label: line.slice(0, idx).trim(), value: line.slice(idx + 1).trim() });
    }
  });
  return sections;
}

export function parseMarkdown(md) {
  const blocks = (md || "").split(/\n\s*\n/).map(b => b.trim()).filter(Boolean);
  return blocks.map(b => {
    if (b.startsWith('#### ')) return { h4: b.slice(5).trim() };
    if (b.startsWith('### ')) return { h3: b.slice(4).trim() };
    if (b.startsWith('## ')) return { h2: b.slice(3).trim() };
    if (b.startsWith('!!! info:')) return { info: b.slice(9).trim() };
    if (b.startsWith('!!! advarsel:')) return { advarsel: b.slice(13).trim() };
    if (b.startsWith('!!! bla:')) return { bla: b.slice(8).trim() };
    if (b.startsWith('!!! gull:')) return { gull: b.slice(9).trim() };
    if (b.startsWith('> ')) {
      const rest = b.slice(2).trim();
      const parts = rest.split(/\s*--\s*/);
      return { quote: { text: parts[0].trim(), source: (parts[1] || "Sitat").trim() } };
    }
    return b.replace(/\n/g, " ");
  });
}

export function parsePlainMarkdown(md) {
  return (md || "").split(/\n\s*\n/).map(b => b.trim().replace(/^#+\s*/, "").replace(/^>\s*/, "").replace(/\n/g, " ")).filter(Boolean);
}
