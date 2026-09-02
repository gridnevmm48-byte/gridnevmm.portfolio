import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import HomePage from "./HomePage";
import imgAvatar from "@/assets/avatar.jpg";
import cvEnPdf from "@/assets/cv/cv-en.pdf?url";
import cvRuPdf from "@/assets/cv/cv-ru.pdf?url";
import { useLang, useT, type Lang } from "@/app/i18n";
import { usePageTitle } from "@/app/title";

export const cardClass = "backdrop-blur-[30px] bg-white/10 rounded-lg";

/** The page is one centred column at every width; nothing is fixed to a side. */
export const shellClass = "mx-auto w-full max-w-[1200px] px-4 md:px-8 lg:px-12";

/** Which language reads the site picks which résumé opens. */
const CV_PDF = { en: cvEnPdf, ru: cvRuPdf };

// ── Type scale ────────────────────────────────────────────────────────────────
/** -0.08em — display/semibold text. */
export const TIGHT = "-0.08em";
/** -0.02em — body copy. */
export const LOOSE = "-0.02em";
/** -0.04em — uppercase buttons. */
export const BUTTON = "-0.04em";

/**
 * Ambient light behind the whole page.
 *
 * The glow itself is barely visible at 10%. The point is that the cards above it
 * are transparent, so every `cardClass` element samples it through its
 * backdrop-blur and picks up the tint — that is what finally makes the glass
 * read as glass instead of a flat grey plate. Fixed, so the light stays put
 * while the page scrolls through it.
 */
const ACCENT = "#7C5CFF";

function AmbientGlow() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 z-0 pointer-events-none"
      style={
        {
          "--accent": ACCENT,
          opacity: 0.1,
          // Sits below the 64px header, whose glass would otherwise darken the
          // brightest part of the pool.
          background:
            "radial-gradient(70% 45% at 50% 22%, var(--accent) 0%, transparent 68%), radial-gradient(45% 30% at 12% 62%, var(--accent) 0%, transparent 72%)",
        } as CSSProperties
      }
    />
  );
}

// ── Header ────────────────────────────────────────────────────────────────────

const LANG_OPTIONS: { code: Lang; short: string; full: string }[] = [
  { code: "en", short: "ENG", full: "English" },
  { code: "ru", short: "РУ", full: "Русский" },
];

/** Shared by every header chip, link or button. */
const CHIP =
  "text-sm font-semibold px-3 py-2 rounded-md uppercase transition-colors bg-white/10 text-white hover:bg-white hover:text-black cursor-pointer no-underline border-none outline-none";

export function LanguageDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { lang, setLang } = useLang();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${CHIP} flex items-center gap-2`}
        style={{ letterSpacing: LOOSE }}
      >
        <span>{LANG_OPTIONS.find((option) => option.code === lang)?.short}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 bg-black/95 backdrop-blur-md border border-white/20 rounded-md p-1 flex flex-col gap-1 shadow-2xl z-50 min-w-30">
          {LANG_OPTIONS.map(({ code, full }) => (
            <button
              key={code}
              onClick={() => {
                setLang(code);
                setIsOpen(false);
              }}
              className={`text-xs font-semibold px-3 py-2 rounded-sm uppercase text-left transition-colors cursor-pointer border-none outline-none ${
                lang === code
                  ? "bg-white text-black font-bold"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              {full}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** Anchor ids the header jumps to. Sections carry a scroll-margin so the sticky
 *  header does not land on top of the heading. */
export const SECTION_WORK = "work";
export const SECTION_ABOUT = "about";

export function Header() {
  const t = useT();
  const { lang } = useLang();
  const jumps = [
    { id: SECTION_WORK, label: t.nav.work },
    { id: SECTION_ABOUT, label: t.nav.about },
  ];
  const links = [
    { id: "li", label: t.nav.li, href: t.nav.liHref },
    { id: "tg", label: t.nav.tg, href: t.nav.tgHref },
  ];

  return (
    // Glass rather than solid #000: an opaque bar would punch a hard-edged black
    // rectangle out of the ambient glow behind it.
    <header className="sticky top-0 z-50 backdrop-blur-[30px] bg-black/50">
      <div className={`${shellClass} flex items-center justify-between gap-4 h-16`}>
        <a href="#top" className="flex items-center gap-3 shrink-0 no-underline">
          <img
            src={imgAvatar}
            alt={t.about.photoAlt}
            className="w-10 h-10 rounded-md object-cover"
          />
          <span
            className="text-white font-semibold text-sm leading-4 hidden sm:block"
            style={{ letterSpacing: "-0.04em" }}
          >
            {t.about.name}
          </span>
        </a>

        <nav className="flex items-center gap-2">
          {/* The jump links are the first thing to go when the row runs out of
              room: on a phone the whole page is a short scroll anyway. */}
          {jumps.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className={`${CHIP} hidden md:inline-block`}
              style={{ letterSpacing: LOOSE }}
            >
              {label}
            </a>
          ))}
          {/* A new tab, not a download: the PDF has a real text layer, so this
              is the one place on the site a visitor can select and copy the
              résumé's text — a modal showing it as a picture couldn't do that. */}
          <a
            href={CV_PDF[lang]}
            target="_blank"
            rel="noopener noreferrer"
            className={CHIP}
            style={{ letterSpacing: LOOSE }}
          >
            {t.nav.cv}
          </a>
          {links.map(({ id, label, href }) => (
            <a
              key={id}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={CHIP}
              style={{ letterSpacing: LOOSE }}
            >
              {label}
            </a>
          ))}
          <LanguageDropdown />
        </nav>
      </div>
    </header>
  );
}

// ── Page primitives ───────────────────────────────────────────────────────────

/** Big white call to action. `full` stretches it to the card it sits in. */
export function ActionButton({
  href,
  label,
  full = true,
}: {
  href: string;
  label: string;
  full?: boolean;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("mailto:") ? undefined : "_blank"}
      rel="noopener noreferrer"
      className={`bg-white text-black rounded-lg h-16 flex items-center justify-center text-center px-4 font-semibold uppercase no-underline shrink-0 transition-opacity hover:opacity-80 ${
        full ? "w-full" : "min-w-[200px]"
      }`}
      style={{ fontSize: "14px", lineHeight: "16px", letterSpacing: BUTTON }}
    >
      {label}
    </a>
  );
}

/** Section heading inside a card. */
export function CardTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-white font-semibold text-base leading-5" style={{ letterSpacing: TIGHT }}>
      {children}
    </h2>
  );
}

/** Card holding prose. `spacious` is for structured content that owns its own
 *  layout (lists, grids) instead of a paragraph. */
export function Card({
  title,
  children,
  spacious,
  className = "",
}: {
  title?: string;
  children: ReactNode;
  spacious?: boolean;
  className?: string;
}) {
  return (
    <div className={`${cardClass} p-4 md:p-6 w-full flex flex-col ${spacious ? "gap-4" : "gap-2"} ${className}`}>
      {title && <CardTitle>{title}</CardTitle>}
      {spacious ? (
        children
      ) : (
        <div
          className="text-white/70 text-sm leading-4 whitespace-pre-line"
          style={{ letterSpacing: LOOSE }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function Footer() {
  const t = useT();
  return (
    <div className={`${cardClass} p-4 md:p-6 w-full`}>
      <p
        className="text-white/30 font-semibold text-center w-full text-base md:text-2xl"
        style={{ lineHeight: "24px", letterSpacing: TIGHT }}
      >
        {t.footer.rights}
      </p>
    </div>
  );
}

/** How close to the end of the page the button waits for, and the minimum
 *  amount of scrolling the page needs before it is offered at all. */
const BACK_TO_TOP_NEAR_END = 200;

/** Small button that surfaces once the page is scrolled to its end. */
function BackToTop() {
  const t = useT();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const read = () => {
      const runway = document.documentElement.scrollHeight - window.innerHeight;
      setVisible(runway > BACK_TO_TOP_NEAR_END && runway - window.scrollY < BACK_TO_TOP_NEAR_END);
    };

    read();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    return () => {
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "auto"
            : "smooth",
        })
      }
      aria-label={t.common.backToTop}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      // Darker than the cards it lands on, so it reads as a control floating
      // over the page rather than as part of the footer behind it.
      className={`fixed bottom-4 right-4 z-40 w-10 h-10 rounded-lg backdrop-blur-[30px] bg-black/80 border border-white/20 text-white hover:bg-white hover:text-black hover:border-white flex items-center justify-center outline-none cursor-pointer transition-all duration-300 ${
        visible ? "opacity-100" : "opacity-0 translate-y-2 pointer-events-none"
      }`}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}

export default function Root() {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  usePageTitle();

  useEffect(() => {
    const t1 = setTimeout(() => setFadeOut(true), 900);
    const t2 = setTimeout(() => setLoading(false), 1400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <>
      {/* Fullscreen Initial Loader Overlay */}
      {loading && (
        <div
          className={`fixed inset-0 bg-black z-[99999] flex items-center justify-center transition-opacity duration-500 ${
            fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <div className="loader" />
        </div>
      )}

      {/* The glow is painted first on purpose — backdrop-filter only samples what
          is beneath it, and the page sits a layer above. No background of its
          own here: the body is already black, and an opaque one would hide it. */}
      <AmbientGlow />
      <div id="top" className="relative z-[1] min-h-screen flex flex-col">
        <Header />
        <HomePage />
      </div>
      <BackToTop />
    </>
  );
}
