export function highlightMatch(text, query) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span
        style={{
          background: "var(--dm-primary)",
          color: "var(--dm-bg)",
          borderRadius: 3,
          padding: "0 2px",
        }}
      >
        {text.slice(idx, idx + query.length)}
      </span>
      {text.slice(idx + query.length)}
    </>
  );
}

export function renderMarkdown(md, docTitles = []) {
  if (!md) return "";
  const lines = md.split("\n");
  let html = "";
  let inTable = false,
    inBq = false,
    inList = false;

  // Sort titles longest-first to avoid partial matches
  const sortedTitles = [...docTitles].sort((a, b) => b.length - a.length);

  const autoLink = (s) => {
    if (!sortedTitles.length) return s;
    // Don't auto-link inside existing HTML tags or code
    return s.replace(
      /(<[^>]+>)|(\b(?:[\w\s''\u2014\u2013\-]+)\b)/g,
      (match, tag, text) => {
        if (tag) return tag;
        let result = text;
        for (const title of sortedTitles) {
          const regex = new RegExp(
            `\\b(${title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})\\b`,
            "gi",
          );
          result = result.replace(
            regex,
            '<span class="m3link" data-doc-link="$1">$1</span>',
          );
        }
        return result;
      },
    );
  };

  const fmt = (s) => {
    let r = s
      .replace(/\*\*\*(.*?)\*\*\*/g, "<strong><em>$1</em></strong>")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`(.*?)`/g, '<code class="m3code">$1</code>')
      .replace(
        /\[\[(.*?)\]\]/g,
        '<span class="m3link" data-doc-link="$1">$1</span>',
      );
    r = autoLink(r);
    return r;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("|")) {
      if (!inTable) {
        html += '<table class="m3table">';
        inTable = true;
      }
      if (line.match(/^\|[\s-:|]+\|$/)) continue;
      const cells = line.split("|").filter((c) => c.trim());
      const tag = html.includes("</tr>") ? "td" : "th";
      html +=
        "<tr>" +
        cells.map((c) => `<${tag}>${fmt(c.trim())}</${tag}>`).join("") +
        "</tr>";
      continue;
    } else if (inTable) {
      html += "</table>";
      inTable = false;
    }

    if (line.startsWith("> ")) {
      if (!inBq) {
        html += '<blockquote class="m3bq">';
        inBq = true;
      }
      html += fmt(line.slice(2)) + "<br/>";
      continue;
    } else if (inBq) {
      html += "</blockquote>";
      inBq = false;
    }

    if (line.match(/^- /)) {
      if (!inList) {
        html += '<ul class="m3list">';
        inList = true;
      }
      html += `<li>${fmt(line.slice(2))}</li>`;
      continue;
    } else if (inList) {
      html += "</ul>";
      inList = false;
    }

    if (line.match(/^---+$/)) {
      html += '<hr class="m3hr"/>';
      continue;
    }
    if (line.startsWith("###### "))
      html += `<h6 class="m3h6">${fmt(line.slice(7))}</h6>`;
    else if (line.startsWith("##### "))
      html += `<h5 class="m3h5">${fmt(line.slice(6))}</h5>`;
    else if (line.startsWith("#### "))
      html += `<h4 class="m3h4">${fmt(line.slice(5))}</h4>`;
    else if (line.startsWith("### "))
      html += `<h3 class="m3h3">${fmt(line.slice(4))}</h3>`;
    else if (line.startsWith("## "))
      html += `<h2 class="m3h2">${fmt(line.slice(3))}</h2>`;
    else if (line.startsWith("# "))
      html += `<h1 class="m3h1">${fmt(line.slice(2))}</h1>`;
    else if (line.trim() === "") html += '<div style="height:8px"></div>';
    else html += `<p class="m3body">${fmt(line)}</p>`;
  }
  if (inTable) html += "</table>";
  if (inBq) html += "</blockquote>";
  if (inList) html += "</ul>";
  return html;
}
