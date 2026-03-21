const CALLOUT_STYLES = {
  note:     { color: "#7cacf0", bg: "rgba(124,172,240,0.08)", icon: "&#x1F4DD;" },
  info:     { color: "#7cacf0", bg: "rgba(124,172,240,0.08)", icon: "&#x2139;&#xFE0F;" },
  tip:      { color: "#6ecf9a", bg: "rgba(110,207,154,0.08)", icon: "&#x1F4A1;" },
  hint:     { color: "#6ecf9a", bg: "rgba(110,207,154,0.08)", icon: "&#x1F4A1;" },
  important:{ color: "#c49de8", bg: "rgba(196,157,232,0.08)", icon: "&#x2755;" },
  success:  { color: "#6ecf9a", bg: "rgba(110,207,154,0.08)", icon: "&#x2705;" },
  check:    { color: "#6ecf9a", bg: "rgba(110,207,154,0.08)", icon: "&#x2705;" },
  done:     { color: "#6ecf9a", bg: "rgba(110,207,154,0.08)", icon: "&#x2705;" },
  question: { color: "#e0c46c", bg: "rgba(224,196,108,0.08)", icon: "&#x2753;" },
  help:     { color: "#e0c46c", bg: "rgba(224,196,108,0.08)", icon: "&#x2753;" },
  faq:      { color: "#e0c46c", bg: "rgba(224,196,108,0.08)", icon: "&#x2753;" },
  warning:  { color: "#e8a84c", bg: "rgba(232,168,76,0.08)",  icon: "&#x26A0;&#xFE0F;" },
  caution:  { color: "#e8a84c", bg: "rgba(232,168,76,0.08)",  icon: "&#x26A0;&#xFE0F;" },
  attention:{ color: "#e8a84c", bg: "rgba(232,168,76,0.08)",  icon: "&#x26A0;&#xFE0F;" },
  danger:   { color: "#e07070", bg: "rgba(224,112,112,0.08)", icon: "&#x26D4;" },
  error:    { color: "#e07070", bg: "rgba(224,112,112,0.08)", icon: "&#x26D4;" },
  failure:  { color: "#e07070", bg: "rgba(224,112,112,0.08)", icon: "&#x274C;" },
  fail:     { color: "#e07070", bg: "rgba(224,112,112,0.08)", icon: "&#x274C;" },
  bug:      { color: "#e07070", bg: "rgba(224,112,112,0.08)", icon: "&#x1F41B;" },
  example:  { color: "#c49de8", bg: "rgba(196,157,232,0.08)", icon: "&#x1F4CB;" },
  quote:    { color: "#9a9a9a", bg: "rgba(154,154,154,0.06)", icon: "&#x275D;" },
  cite:     { color: "#9a9a9a", bg: "rgba(154,154,154,0.06)", icon: "&#x275D;" },
  abstract: { color: "#7cacf0", bg: "rgba(124,172,240,0.08)", icon: "&#x1F4C4;" },
  summary:  { color: "#7cacf0", bg: "rgba(124,172,240,0.08)", icon: "&#x1F4C4;" },
  todo:     { color: "#7cacf0", bg: "rgba(124,172,240,0.08)", icon: "&#x2611;&#xFE0F;" },
  _default: { color: "#9a9a9a", bg: "rgba(154,154,154,0.06)", icon: "&#x1F4AC;" },
};

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
    inCallout = false,
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

    if (line.startsWith("> ") || line === ">") {
      const content = line === ">" ? "" : line.slice(2);
      if (!inBq && !inCallout) {
        // Check for Obsidian callout syntax: > [!type] optional title
        const calloutMatch = content.match(/^\[!(\w+)\]\s*(.*)?$/);
        if (calloutMatch) {
          const cType = calloutMatch[1].toLowerCase();
          const cTitle = calloutMatch[2] || cType.charAt(0).toUpperCase() + cType.slice(1);
          const cfg = CALLOUT_STYLES[cType] || CALLOUT_STYLES._default;
          html += `<div class="m3callout" style="border-left:3px solid ${cfg.color};background:${cfg.bg};border-radius:0 12px 12px 0;margin:12px 0;padding:12px 16px;">`;
          html += `<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;font-weight:600;font-size:14px;color:${cfg.color};">${cfg.icon} ${fmt(cTitle)}</div>`;
          inCallout = true;
          continue;
        }
        html += '<blockquote class="m3bq">';
        inBq = true;
      }
      if (content.match(/^---+$/)) {
        html += '<hr class="m3hr" style="margin:8px 0;"/>';
      } else if (content === "") {
        html += '<div style="height:6px"></div>';
      } else {
        html += `<p class="m3body" style="margin:2px 0;">${fmt(content)}</p>`;
      }
      continue;
    } else if (inCallout) {
      html += "</div>";
      inCallout = false;
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
  if (inCallout) html += "</div>";
  if (inBq) html += "</blockquote>";
  if (inList) html += "</ul>";
  return html;
}
