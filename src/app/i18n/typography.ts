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
 *  or dash it sits right behind. */
const OPENER = "(^|[\\s(\\[«\"“'\\u2014\\u2013\\-])";

const PATTERNS: Record<Lang, RegExp> = {
  ru: new RegExp(`${OPENER}(${CLINGING.ru.join("|")}) +`, "giu"),
  en: new RegExp(`${OPENER}(${CLINGING.en.join("|")}) +`, "giu"),
};

/**
 * Binds clinging words to the word that follows them.
 *
 * Only literal spaces are swapped, never newlines, so paragraph breaks in the
 * case copy survive. Chains break on their own: the match eats the space that
 * would have opened the next word, so two short words in a row bind at most
 * once and never pile into one long unbreakable run.
 */
export function bindClingingWords(text: string, lang: Lang): string {
  return text.replace(PATTERNS[lang], (_, opener: string, word: string) => `${opener}${word}${NBSP}`);
}

/** Copy that belongs to the sidebar rather than a page section, so it keeps the
 *  plain spacing the rest of the shell uses. `desc` is the sidebar card line,
 *  and the stat captions under a figure are too short to need binding.
 *  `meta` and `results` are label/figure pairs in the case modal, short enough
 *  that binding them would only risk widening a narrow column. */
const SKIP_KEYS = new Set(["desc", "stats", "meta", "results"]);

/** Walks a dictionary branch and rewrites every string it renders. */
function bindDeep<T>(value: T, lang: Lang): T {
  if (typeof value === "string") return bindClingingWords(value, lang) as T;
  if (Array.isArray(value)) return value.map((item) => bindDeep(item, lang)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, val]) => [
        key,
        SKIP_KEYS.has(key) ? val : bindDeep(val, lang),
      ]),
    ) as T;
  }
  return value;
}

/** The prose blocks: the hero line, the footer line, the project cards, the
 *  case studies and the about copy. Everything else (nav labels, section
 *  titles, skill tags) is too short to strand a word. */
export function withCopyTypography<
  T extends { hero: { tagline: string }; footer: { rights: string }; work: unknown; about: unknown; cases: unknown },
>(dict: T, lang: Lang): T {
  return {
    ...dict,
    hero: { ...dict.hero, tagline: bindClingingWords(dict.hero.tagline, lang) },
    footer: { ...dict.footer, rights: bindClingingWords(dict.footer.rights, lang) },
    work: bindDeep(dict.work, lang),
    about: bindDeep(dict.about, lang),
    cases: bindDeep(dict.cases, lang),
  };
}
