const ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " "
}

/**
 * Convert a bill history action from the legislature's API to plain text.
 *
 * Some actions embed HTML, for example
 * `...in A-2 and Virtual<br> <span style="...">Hearing updated to New End Time</span>`.
 * Line breaks become newlines, every other tag is dropped (keeping its text),
 * and common entities are decoded. The result is rendered as text, never as HTML.
 */
export const formatHistoryAction = (action: string): string =>
  action
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?[a-z][^>]*>/gi, "")
    .replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (entity, code: string) => {
      const lower = code.toLowerCase()
      if (lower.startsWith("#x")) {
        return String.fromCodePoint(parseInt(lower.slice(2), 16))
      }
      if (lower.startsWith("#")) {
        return String.fromCodePoint(parseInt(lower.slice(1), 10))
      }
      return ENTITIES[lower] ?? entity
    })
    .split("\n")
    .map(line => line.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join("\n")
