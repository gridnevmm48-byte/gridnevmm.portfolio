import type { Dict } from "@/app/i18n";
import logoRespawn from "@/assets/logos/respawn.png";
import logoSpinit from "@/assets/logos/spinit.png";
import logoProwrap from "@/assets/logos/prowrap.png";

/**
 * The non-localised half of a case study: which images it shows, in what order,
 * and where the captions fall between them. The copy itself lives in
 * `i18n/*.ts` under `cases.<id>`, so a screenshot order never has to be
 * repeated once per language.
 */

/** avif for browsers that take it, jpg as the `<picture>` fallback. */
export type Shot = { avif: string; jpg: string };

export type Block =
  /** One full-width screen, the width of the modal. */
  | { kind: "shot"; shot: Shot }
  /** Portrait screens laid out three to a row. */
  | { kind: "phones"; shots: Shot[] }
  /** A caption card; `id` keys into `cases.<caseId>.notes`. */
  | { kind: "note"; id: string };

export type CaseId = keyof Dict["cases"];

export type CaseMeta = {
  id: CaseId;
  /** The product's own site. Empty hides the button, the same way a card does. */
  href: string;
  /** Empty for an entry with no brand of its own, like the sales role. */
  logo: string;
  blocks: Block[];
};

// Files are numbered 01..NN on disk in the order the design stacks them, so the
// sort below is the reading order and nothing here has to restate it.
// Relative, not the "@" alias: import.meta.glob resolves patterns itself and
// never runs them through Vite's resolver, so an aliased pattern matches nothing.
const avifFiles = import.meta.glob("../../assets/cases/**/*.avif", {
  eager: true, query: "?url", import: "default",
}) as Record<string, string>;
const jpgFiles = import.meta.glob("../../assets/cases/**/*.jpg", {
  eager: true, query: "?url", import: "default",
}) as Record<string, string>;

/** Every shot in one folder, in filename order. */
function shots(folder: string): Shot[] {
  return Object.keys(avifFiles)
    .filter((path) => path.startsWith(`../../assets/cases/${folder}/`))
    .sort()
    .map((path) => ({ avif: avifFiles[path], jpg: jpgFiles[path.replace(/\.avif$/, ".jpg")] }));
}

const respawn = shots("respawn");
const queen = shots("queen");
const queenMobile = shots("queen-mobile");
const prowrap = shots("prowrap");
const sales = shots("sales");

const shot = (s: Shot): Block => ({ kind: "shot", shot: s });
const note = (id: string): Block => ({ kind: "note", id });

export const CASES: CaseMeta[] = [
  {
    id: "respawn",
    href: "https://respawnesports.xyz/",
    logo: logoRespawn,
    blocks: [
      // The four screens of the new site, then the two that show what it replaced.
      ...respawn.slice(0, 4).map(shot),
      note("previous"),
      ...respawn.slice(4).map(shot),
    ],
  },
  {
    id: "queen",
    href: "https://spinit.com/en/",
    logo: logoSpinit,
    blocks: [
      ...queen.slice(0, 3).map(shot),
      // Six product screens for the platform itself; the last three belong to
      // the crypto app and get their own caption further down.
      { kind: "phones", shots: queenMobile.slice(0, 6) },
      note("designSystem"),
      ...queen.slice(3).map(shot),
      note("crypto"),
      { kind: "phones", shots: queenMobile.slice(6) },
    ],
  },
  {
    id: "prowrap",
    href: "https://prowrapcy.vercel.app/",
    logo: logoProwrap,
    blocks: [
      ...prowrap.slice(0, 4).map(shot),
      note("previous"),
      ...prowrap.slice(4, 7).map(shot),
      // Closes on the repo behind the redesign, so the case ends on the build
      // rather than on the old site it replaced.
      note("build"),
      ...prowrap.slice(7).map(shot),
    ],
  },
  {
    // A role rather than a product: no brand mark of its own and nothing public
    // to link to, so the card and the modal both drop those.
    id: "sales",
    href: "",
    logo: "",
    blocks: sales.map(shot),
  },
];

export const CASE_BY_ID = Object.fromEntries(CASES.map((c) => [c.id, c])) as Record<
  CaseId,
  CaseMeta
>;
