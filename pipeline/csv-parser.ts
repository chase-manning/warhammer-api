import { parse, HTMLElement as HtmlNode } from "node-html-parser";

const ATTRIBUTES_TO_REMOVE = [
  "style",
  "width",
  "height",
  "cellspacing",
  "cellpadding",
  "border",
  "class",
  "data-tooltip-content",
];
const BLOCKED_TAGS = new Set(["script", "style"]);
const TAGS_TO_UNWRAP = new Set(["a", "i", "span"]);

function sanitizeElement(element: HtmlNode): void {
  const tagName = element.tagName?.toLowerCase();

  if (BLOCKED_TAGS.has(tagName)) {
    element.remove();
    return;
  }

  element.childNodes.forEach((child) => {
    if (child instanceof HtmlNode && child.tagName) {
      sanitizeElement(child);
    }
  });

  if (TAGS_TO_UNWRAP.has(tagName)) {
    element.replaceWith(element.innerHTML);
    return;
  }

  ATTRIBUTES_TO_REMOVE.forEach((attr) => element.removeAttribute(attr));
}

export function stripHtml(input: string): string {
  if (!input || !input.includes("<")) return input;

  const root = parse(input, {
    lowerCaseTagName: false,
    comment: false,
    blockTextElements: { script: false, style: false },
  });

  root.childNodes.forEach((node) => {
    if (node instanceof HtmlNode && node.tagName) {
      sanitizeElement(node);
    }
  });

  let result = root.innerHTML;

  result = result.replace(/<br\s*\/?>/gi, "\n");
  result = result.replace(/<\/p>\s*<p[^>]*>/gi, "\n\n");
  result = result.replace(/<\/?p[^>]*>/gi, "\n");
  result = result.replace(/<li[^>]*>/gi, "• ");
  result = result.replace(/<\/li>/gi, "\n");
  result = result.replace(/<\/?(?:ul|ol|div)[^>]*>/gi, "\n");
  result = result.replace(/<b>(.*?)<\/b>/gi, "$1");
  result = result.replace(/<\/?[^>]+(>|$)/g, "");

  result = result.replace(/&nbsp;/gi, " ");
  result = result.replace(/&amp;/gi, "&");
  result = result.replace(/&lt;/gi, "<");
  result = result.replace(/&gt;/gi, ">");
  result = result.replace(/&quot;/gi, '"');
  result = result.replace(/&#39;/gi, "'");
  result = result.replace(/&emsp;/gi, " ");

  result = result.replace(/[ \t]+/g, " ");
  result = result.replace(/\n{3,}/g, "\n\n");
  result = result.trim();

  return result;
}

function toCamelCase(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr: string) => chr.toUpperCase());
}

export interface RawRecord {
  [key: string]: string;
}

export function parseCsv(input: string): RawRecord[] {
  const cleaned = input.replace(/^\uFEFF/, "");
  const rows = cleaned.split(/\r?\n/).filter((row) => row.trim().length > 0);

  if (rows.length < 2) return [];

  const headers = rows[0].split("|").map(toCamelCase).filter(Boolean);
  const results: RawRecord[] = [];

  for (let i = 1; i < rows.length; i++) {
    const columns = rows[i].split("|");
    const record: RawRecord = {};
    let hasData = false;

    for (let col = 0; col < headers.length; col++) {
      const value = columns[col] ?? "";
      record[headers[col]] = value;
      if (value.trim()) hasData = true;
    }

    if (hasData) results.push(record);
  }

  return results;
}
