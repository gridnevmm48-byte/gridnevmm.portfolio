import { useEffect, useState } from "react";
import imgPhoto from "@/assets/profile-photo.jpg";
import {
  ActionButton,
  Card,
  CardTitle,
  cardClass,
  Footer,
  SECTION_ABOUT,
  SECTION_WORK,
  shellClass,
  TIGHT,
  LOOSE,
} from "./Root";
import CaseModal from "./CaseModal";
import WorkCard from "./WorkCard";
import { CASES, type CaseId } from "@/app/data/cases";
import { useT } from "@/app/i18n";

// ── Banner ────────────────────────────────────────────────────────────────────

// Frames are numbered 01..NN on disk purely so this sort is the playback order.
// Relative, not the "@" alias: import.meta.glob resolves patterns itself and
// never runs them through Vite's resolver, so an aliased pattern matches nothing.
const bannerAvif = import.meta.glob("../../assets/hero_slider/optimized/*.avif", {
  eager: true, query: "?url", import: "default",
}) as Record<string, string>;
const bannerJpg = import.meta.glob("../../assets/hero_slider/optimized/*.jpg", {
  eager: true, query: "?url", import: "default",
}) as Record<string, string>;

const BANNER_FRAMES = Object.keys(bannerAvif).sort().map((key) => ({
  avif: bannerAvif[key],
  jpg: bannerJpg[key.replace(/\.avif$/, ".jpg")],
}));
/** Each frame is a whole screen design, so it holds long enough to be read. */
const BANNER_FRAME_MS = 2800;

function BannerSlider() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timer: number | undefined;
    const advance = () => setActive((i) => (i + 1) % BANNER_FRAMES.length);
    // A background tab throttles the interval into an unpredictable stutter, so
    // stop it outright and restart on the frame the user left off at.
    const sync = () => {
      window.clearInterval(timer);
      timer = document.hidden ? undefined : window.setInterval(advance, BANNER_FRAME_MS);
    };
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return (
    <div className="flex flex-col gap-3">
      {/* 16:9 is the frames' own aspect, so object-cover has nothing to crop. */}
      <div className={`${cardClass} w-full relative overflow-hidden aspect-video`}>
        {BANNER_FRAMES.map((frame, i) => (
          // All frames stay mounted and decoded, so a first pass never flashes an
          // undecoded frame. The incoming one fades in faster than the outgoing
          // one fades out, which keeps the crossfade from dipping through black.
          <picture key={frame.avif}>
            <source srcSet={frame.avif} type="image/avif" />
            <img
              src={frame.jpg}
              alt=""
              aria-hidden
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                opacity: i === active ? 1 : 0,
                transition: `opacity ${i === active ? 500 : 900}ms ease-out`,
              }}
            />
          </picture>
        ))}
      </div>

      {/* Tapping a dot is the only way to reach a specific frame; the banner
          otherwise just cycles. */}
      <div className="flex items-center justify-center gap-2">
        {BANNER_FRAMES.map((frame, i) => (
          <button
            key={frame.avif}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`${i + 1}`}
            aria-current={i === active}
            className={`h-2 rounded-full border-none outline-none cursor-pointer transition-all duration-300 ${
              i === active ? "w-6 bg-white" : "w-2 bg-white/25 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────

function Hero() {
  const t = useT();
  return (
    <div className="flex flex-col items-center gap-8 pt-16 pb-12 md:pt-24 md:pb-16">
      <div className="flex flex-col items-center gap-3 w-full">
        <h1
          className="text-white font-semibold text-center text-[32px] leading-9 md:text-[56px] md:leading-[58px] max-w-[900px]"
          style={{ letterSpacing: "-0.06em" }}
        >
          {t.hero.tagline}
        </h1>
        <p
          className="text-white/70 text-center text-sm leading-4 md:text-xl md:leading-6"
          style={{ letterSpacing: LOOSE }}
        >
          {t.about.subtitle}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
        <ActionButton href={t.nav.tgHref} label={t.common.contactMe} full={false} />
        <ActionButton href={t.nav.mailHref} label={t.common.email} full={false} />
      </div>
    </div>
  );
}

// ── Work ──────────────────────────────────────────────────────────────────────

function WorkSection({ onOpen }: { onOpen: (id: CaseId) => void }) {
  const t = useT();
  return (
    <section id={SECTION_WORK} className="flex flex-col gap-4 scroll-mt-24">
      <CardTitle>{t.sections.work}</CardTitle>
      <div className="flex flex-col lg:flex-row gap-4 items-stretch">
        {CASES.map((meta) => (
          <WorkCard key={meta.id} meta={meta} onOpen={onOpen} />
        ))}
      </div>
    </section>
  );
}

// ── About ─────────────────────────────────────────────────────────────────────

function AboutCard() {
  const t = useT();
  return (
    <div className={`${cardClass} p-4 md:p-6 flex flex-col gap-4 flex-1 min-w-0`}>
      {/* Heading above the row, the way the design has it, so the portrait and
          the copy start on the same line. */}
      <CardTitle>{t.sections.aboutMe}</CardTitle>
      {/* The portrait is floated, not a flex column. Side by side, a square
          photo is always shorter than five paragraphs beside it, which left a
          block of dead glass underneath it; floated, the copy runs down its
          side and then continues underneath, and the column closes up.
          flow-root contains the float so it cannot escape the card. */}
      <div className="flow-root min-w-0">
        <div className="float-left w-full sm:w-[46%] aspect-square rounded-lg overflow-hidden mb-4 sm:mr-4">
          <img src={imgPhoto} alt={t.about.photoAlt} className="w-full h-full object-cover" />
        </div>
        <p
          className="text-white/70 text-sm leading-5 whitespace-pre-line"
          style={{ letterSpacing: LOOSE }}
        >
          {t.about.text}
        </p>
      </div>
      <div className="mt-auto">
        <ActionButton href={t.nav.tgHref} label={t.common.contactMe} />
      </div>
    </div>
  );
}

function SkillsCard() {
  const t = useT();
  return (
    <Card title={t.sections.skills} spacious>
      <div className="flex flex-col gap-4">
        {t.skills.map(({ title, items }) => (
          <div key={title} className="flex flex-col gap-2">
            <p className="text-white/70 text-sm leading-4" style={{ letterSpacing: LOOSE }}>
              {title}
            </p>
            <div className="flex flex-wrap gap-2">
              {items.map((item) => (
                <span
                  key={item}
                  className="bg-white/5 rounded-md px-3 py-2 text-white text-sm leading-4"
                  style={{ letterSpacing: LOOSE }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function EducationCard() {
  const t = useT();
  return (
    <Card title={t.sections.education} spacious>
      <div className="flex flex-col gap-2">
        {t.education.map((school) => (
          <p
            key={school}
            className="text-white font-semibold text-base leading-5"
            style={{ letterSpacing: TIGHT }}
          >
            {school}
          </p>
        ))}
      </div>
    </Card>
  );
}

function LanguagesCard() {
  const t = useT();
  return (
    <Card title={t.sections.languages} spacious>
      <div className="flex flex-col gap-2">
        {t.languages.map(({ name, level }) => (
          <div key={name} className="flex flex-col gap-1">
            <p
              className="text-white font-semibold text-base leading-5"
              style={{ letterSpacing: TIGHT }}
            >
              {name}
            </p>
            <p className="text-white/70 text-sm leading-4" style={{ letterSpacing: LOOSE }}>
              {level}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}

function AboutSection() {
  return (
    <section id={SECTION_ABOUT} className="flex flex-col lg:flex-row gap-4 items-stretch scroll-mt-24">
      <AboutCard />
      <div className="flex flex-col gap-4 flex-1 min-w-0">
        <SkillsCard />
        <div className="flex flex-col sm:flex-row gap-4 items-stretch">
          <div className="flex-1 min-w-0 flex">
            <EducationCard />
          </div>
          <div className="flex-1 min-w-0 flex">
            <LanguagesCard />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  // Which case study is open, if any. The modal mounts nothing until then, so
  // none of the case screenshots are fetched on a first visit.
  const [openCase, setOpenCase] = useState<CaseId | null>(null);

  return (
    <main className={`${shellClass} flex flex-col gap-8 md:gap-12 pb-8 md:pb-12`}>
      <Hero />
      <BannerSlider />
      <WorkSection onOpen={setOpenCase} />
      <AboutSection />
      <Footer />
      <CaseModal caseId={openCase} onClose={() => setOpenCase(null)} />
    </main>
  );
}
