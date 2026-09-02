import type { Lang } from "./index";

const NBSP = " ";

/**
 * Short words that read badly when a line break strands them at the end of a
 * line. The space after one of these becomes non-breaking, so the word travels
 * down to the next line together with whatever it introduces.
 *
 * Deliberately short entries only: binding a long word to its neighbour makes
 * an unbreakable run wide enough to overflow the 375px mobile column.
 */
const CLINGING: Record<Lang, string[]> = {
  ru: [
    // предлоги
    "в", "во", "на", "за", "к", "ко", "с", "со", "о", "об", "обо", "от", "ото",
    "до", "из", "изо", "у", "по", "под", "подо", "над", "надо", "при", "про",
    "для", "без", "перед", "через", "между", "кроме", "после", "среди",
    // союзы, частицы, местоимения
    "и", "а", "но", "да", "или", "либо", "что", "как", "чем", "если", "когда",
    "где", "чтобы", "не", "ни", "то", "это", "же", "бы", "ли", "мы", "я",
  ],
  en: [
    // articles
    "a", "an", "the",
    // prepositions
    "at", "by", "for", "from", "in", "into", "of", "off", "on", "onto", "out",
    "over", "per", "to", "up", "via", "with", "under", "after", "before",
    // conjunctions
    "and", "or", "but", "nor", "so", "yet", "as", "if", "than", "that", "when",
    // pronouns that look stranded on their own
    "i", "we", "it", "its", "he", "she", "they", "my", "our", "his", "her",
  ],
};

/** Openers a clinging word may follow — a line start, whitespace, or a bracket
 *  or dash it sits right behind. A lookbehind, not a capturing group: a
 *  consumed opener would swallow the space two clinging words in a row share
 *  ("or the experience"), leaving nothing for the second word's own match to
 *  open on. Zero-width, it never gets used up, so "or" and "the" each bind
 *  independently instead of only the first one taking. */
const OPENER = "(?<=^|[\\s(\\[«\"“'\\u2014\\u2013\\-])";

const PATTERNS: Record<Lang, RegExp> = {
  ru: new RegExp(`${OPENER}(${CLINGING.ru.join("|")}) +`, "giu"),
  en: new RegExp(`${OPENER}(${CLINGING.en.join("|")}) +`, "giu"),
};

/**
 * Binds clinging words to the word that follows them.
 *
 * Only literal spaces are swapped, never newlines, so paragraph breaks in the
 * case copy survive.
 */
export function bindClingingWords(text: string, lang: Lang): string {
  return text.replace(PATTERNS[lang], (_match: string, word: string) => `${word}${NBSP}`);
}

/** Keys whose string value is an identifier, not prose — a URL, an email
 *  address, a language code — and must survive untouched. Binding a clinging
 *  word is technically harmless on these too (the pattern only ever matches a
 *  short word followed by a literal space, and none of these contain one),
 *  but skipping them keeps the diff between source and rendered value obvious
 *  when a link is inspected. */
const IDENTIFIER_KEYS = new Set(["liHref", "tgHref", "mailHref", "photoAlt", "cvAlt"]);

/** Walks the entire dictionary and rewrites every string it holds. Every
 *  section renders as visible text somewhere on the page — the hero line, the
 *  footer, nav labels, skill tags, case facts, stat labels — so nothing here
 *  is short enough to exempt: a two-word tag can still wrap on a narrow phone
 *  and strand its own preposition. */
function bindDeep<T>(value: T, lang: Lang, key?: string): T {
  if (typeof value === "string") {
    return (key && IDENTIFIER_KEYS.has(key) ? value : bindClingingWords(value, lang)) as T;
  }
  if (Array.isArray(value)) return value.map((item) => bindDeep(item, lang)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([k, val]) => [k, bindDeep(val, lang, k)]),
    ) as T;
  }
  return value;
}

/** Applied to the whole dictionary: every field that reaches the page runs
 *  through the same clinging-word pass, so a line never ends on a bare
 *  preposition regardless of which section it's in. */
export function withCopyTypography<T extends object>(dict: T, lang: Lang): T {
  return bindDeep(dict, lang);
}
