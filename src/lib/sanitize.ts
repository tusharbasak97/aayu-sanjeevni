import DOMPurify from "isomorphic-dompurify";

/**
 * OWASP Top 10 A03 - Stored Cross-Site Scripting (XSS) Sanitizer
 * Strips executable scripts, malicious event handlers (onerror, onload, etc.),
 * javascript: pseudo-protocols, and unsafe iframes while preserving rich formatting.
 */
export function sanitizeHtml(dirtyHtml: string): string {
  if (!dirtyHtml || typeof dirtyHtml !== "string") return "";

  return DOMPurify.sanitize(dirtyHtml, {
    ALLOWED_TAGS: [
      "p",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "strong",
      "b",
      "em",
      "i",
      "u",
      "s",
      "strike",
      "ul",
      "ol",
      "li",
      "blockquote",
      "code",
      "pre",
      "a",
      "img",
      "br",
      "hr",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
      "span",
      "div",
    ],
    ALLOWED_ATTR: [
      "href",
      "src",
      "alt",
      "title",
      "class",
      "target",
      "rel",
      "width",
      "height",
    ],
    ALLOW_DATA_ATTR: false,
    ADD_ATTR: ["rel"],
    FORBID_TAGS: ["script", "style", "iframe", "object", "embed", "base", "form"],
    FORBID_ATTR: ["style", "onerror", "onload", "onclick", "onmouseover"],
  });
}
