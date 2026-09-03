import { cardClass, LOOSE, TIGHT, BUTTON } from "./Root";
import type { CaseId, CaseMeta } from "@/app/data/cases";
import { useT } from "@/app/i18n";

/**
 * One project in the Work row.
 *
 * The whole card is the control, so a phone gets a compact tappable row instead
 * of a full-width white button under every project: three of those stacked read
 * as a wall of buttons rather than a list of work. The button face only appears
 * from `lg` up, where the projects sit side by side and it anchors the column.
 */
export default function WorkCard({
  meta,
  onOpen,
}: {
  meta: CaseMeta;
  onOpen: (id: CaseId) => void;
}) {
  const t = useT();
  const entry = t.work[meta.id];

  return (
    <button
      type="button"
      onClick={() => onOpen(meta.id)}
      className={`${cardClass} group p-4 lg:p-6 flex flex-col gap-4 flex-1 min-w-0 text-left border-none cursor-pointer outline-none transition-colors hover:bg-white/15`}
    >
      <div className="flex items-start gap-4">
        {meta.logo && (
          <img
            src={meta.logo}
            alt=""
            aria-hidden
            className="w-12 h-12 lg:w-16 lg:h-16 rounded-lg object-cover shrink-0"
          />
        )}
        <div className="flex flex-col min-w-0 flex-1">
          {/* The dates are detail rather than headline on a phone, and the case
              modal repeats them in its facts strip anyway. */}
          <p
            className="hidden lg:block text-white/70 text-sm leading-5"
            style={{ letterSpacing: LOOSE }}
          >
            {entry.period}
          </p>
          <h3
            className="text-white font-semibold text-lg lg:text-xl leading-6"
            style={{ letterSpacing: TIGHT }}
          >
            {entry.name}
          </h3>
          {/* Plain weight and full opacity: bold at the same dimness as the
              date above it read as a second headline stacked on the company
              name, the two blurring into one line at a glance. */}
          <p
            className="text-white text-base lg:text-xl leading-6"
            style={{ letterSpacing: TIGHT }}
          >
            {entry.role}
          </p>
        </div>

        {/* Carries the "this opens" affordance on a phone, where there is no
            button face to do it. */}
        <span
          aria-hidden
          className="lg:hidden text-white/45 shrink-0 mt-1 transition-transform group-hover:translate-x-1"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </span>
      </div>

      <p className="text-white/70 text-sm leading-5" style={{ letterSpacing: LOOSE }}>
        {entry.desc}
      </p>

      {/* Not a nested button: the card itself is the control, this is its face.
          Pinned to the bottom so the faces line up across a row of cards
          whatever their copy does.

          Grey at rest, white on hover, on the same colour transition the modal
          close button uses. */}
      <span
        aria-hidden
        className="hidden lg:flex mt-auto bg-white/10 text-white group-hover:bg-white group-hover:text-black rounded-lg w-full h-16 items-center justify-center text-center px-4 font-semibold uppercase transition-colors"
        style={{ fontSize: "14px", lineHeight: "16px", letterSpacing: BUTTON }}
      >
        {t.common.viewProject}
      </span>
    </button>
  );
}
