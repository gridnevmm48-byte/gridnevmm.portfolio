import { useId } from "react";
import Modal from "./Modal";
import { BUTTON, LOOSE, TIGHT } from "./Root";
import { CASE_BY_ID, type Block, type CaseId, type Shot } from "@/app/data/cases";
import { useT } from "@/app/i18n";

/**
 * A case study, shown over the dimmed portfolio.
 *
 * The whole body is built from `blocks`, so the reading order lives in
 * `data/cases.ts` and adding a screenshot never means touching this file.
 */

/** Panels inside the modal, one step lighter than its own background. */
const panelClass = "bg-white/[0.07] rounded-lg";

/**
 * Screenshots are decoded only as they come into view: a case stacks a dozen
 * full-width screens, and the modal opens at the top of them.
 */
function ShotImage({ shot, className = "" }: { shot: Shot; className?: string }) {
  return (
    <picture>
      <source srcSet={shot.avif} type="image/avif" />
      <img
        src={shot.jpg}
        alt=""
        aria-hidden
        loading="lazy"
        decoding="async"
        className={`w-full h-auto block ${className}`}
      />
    </picture>
  );
}

function CaseBlock({ block, caseId }: { block: Block; caseId: CaseId }) {
  const t = useT();

  if (block.kind === "note") {
    const notes = t.cases[caseId].notes as Record<string, { title: string; text: string }>;
    const note = notes[block.id];
    if (!note) return null;
    return (
      <div className={`${panelClass} p-6 flex flex-col gap-2`}>
        <h3 className="text-white font-semibold text-base leading-5" style={{ letterSpacing: TIGHT }}>
          {note.title}
        </h3>
        <p className="text-white/70 text-sm leading-5" style={{ letterSpacing: LOOSE }}>
          {note.text}
        </p>
      </div>
    );
  }

  if (block.kind === "phones") {
    return (
      <div className={`${panelClass} p-4 md:p-6 grid grid-cols-2 sm:grid-cols-3 gap-4`}>
        {block.shots.map((shot) => (
          <ShotImage key={shot.avif} shot={shot} className="rounded-md" />
        ))}
      </div>
    );
  }

  // A screen design carries its own framing, so it sits flush in a plain
  // rounded box with nothing padded around it.
  return (
    <div className="rounded-lg overflow-hidden bg-black">
      <ShotImage shot={block.shot} />
    </div>
  );
}

export default function CaseModal({
  caseId,
  onClose,
}: {
  caseId: CaseId | null;
  onClose: () => void;
}) {
  const t = useT();
  const titleId = useId();

  if (!caseId) return null;

  const meta = CASE_BY_ID[caseId];
  const copy = t.cases[caseId];
  const card = t.work[caseId];
  const facts = [
    { label: t.caseUi.dateWork, value: copy.meta.dateWork },
    { label: t.caseUi.role, value: copy.meta.role },
    { label: t.caseUi.projectType, value: copy.meta.projectType },
    { label: t.caseUi.platform, value: copy.meta.platform },
  ];

  return (
    <Modal open onClose={onClose} labelledBy={titleId}>
      <div className="flex flex-col gap-4 px-4 md:px-6 pb-4 md:pb-6 pt-16">
        {/* Header. One column width for every case, wide enough that the
            description always lands on about two lines, with the name and the
            button centred on it. */}
        <div className="flex justify-center px-4 pt-8 pb-12">
          <div className="flex flex-col items-center gap-6 w-full sm:w-auto sm:min-w-[480px] max-w-full">
          <div className="flex items-center gap-4">
            <img
              src={meta.logo}
              alt=""
              aria-hidden
              className="w-16 h-16 rounded-lg object-cover shrink-0"
            />
            <h2
              id={titleId}
              className="text-white font-semibold text-[28px] leading-8 sm:text-[44px] sm:leading-[48px]"
              style={{ letterSpacing: TIGHT }}
            >
              {copy.title}
            </h2>
          </div>
          {/* w-0 with min-w-full fills the column without widening it, so a
              long description wraps instead of stretching the button beside
              it. */}
          <p
            className="w-0 min-w-full text-center text-white/70 text-sm leading-5"
            style={{ letterSpacing: LOOSE }}
          >
            {card.desc}
          </p>
          {meta.href && (
            <a
              href={meta.href}
              target="_blank"
              rel="noopener noreferrer"
              // Same face as a project card's call to action, so the two read
              // as one control at two moments rather than two designs.
              className="w-full h-16 bg-white/10 text-white hover:bg-white hover:text-black rounded-lg flex items-center justify-center px-4 font-semibold uppercase no-underline transition-colors"
              style={{ fontSize: "14px", letterSpacing: BUTTON }}
            >
              {t.common.goToWeb}
            </a>
          )}
          </div>
        </div>

        {/* Facts */}
        <div className={`${panelClass} p-6 grid grid-cols-2 md:grid-cols-4 gap-6`}>
          {facts.map(({ label, value }) => (
            <div key={label} className="flex flex-col gap-1 min-w-0">
              <p className="text-white/55 text-sm leading-4" style={{ letterSpacing: LOOSE }}>
                {label}
              </p>
              <p
                className="text-white font-semibold text-base leading-5"
                style={{ letterSpacing: TIGHT }}
              >
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Problem / solution */}
        <div className={`${panelClass} p-6 grid grid-cols-1 md:grid-cols-2 gap-6`}>
          {[
            { title: t.caseUi.problem, text: copy.problem },
            { title: t.caseUi.whatIDid, text: copy.whatIDid },
          ].map(({ title, text }) => (
            <div key={title} className="flex flex-col gap-2 min-w-0">
              <h3
                className="text-white font-semibold text-base leading-5"
                style={{ letterSpacing: TIGHT }}
              >
                {title}
              </h3>
              <p className="text-white/70 text-sm leading-5" style={{ letterSpacing: LOOSE }}>
                {text}
              </p>
            </div>
          ))}
        </div>

        {/* Figures, when the project has any to report. */}
        {copy.results.length > 0 && (
          <div className={`${panelClass} p-6 flex flex-col gap-6`}>
            <h3
              className="text-white font-semibold text-base leading-5"
              style={{ letterSpacing: TIGHT }}
            >
              {t.caseUi.results}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {copy.results.map(({ value, label }) => (
                <div key={label} className="flex flex-col gap-1 min-w-0">
                  <p
                    className="text-white font-semibold text-[32px] leading-9"
                    style={{ letterSpacing: TIGHT }}
                  >
                    {value}
                  </p>
                  <p className="text-white/70 text-sm leading-4" style={{ letterSpacing: LOOSE }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {meta.blocks.map((block, i) => (
          <CaseBlock key={i} block={block} caseId={caseId} />
        ))}
      </div>
    </Modal>
  );
}
