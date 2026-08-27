import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useT } from "@/app/i18n";

/**
 * The dialog shell behind both the case studies and the résumé.
 *
 * The page stays visible and dimmed behind the panel rather than being replaced,
 * which is what the design asks for and also what keeps the modal reading as a
 * layer over the portfolio instead of a separate screen.
 */

/** Everything that can hold focus inside the panel, for the tab trap. */
const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Hides the page scrollbar without letting the layout jump sideways.
 *
 * Removing the scrollbar frees its width, so the centred column would slide
 * right by ~15px the instant a modal opens. Padding the body by exactly that
 * width holds everything still.
 */
function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const { body } = document;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = body.style.overflow;
    const prevPadding = body.style.paddingRight;

    body.style.overflow = "hidden";
    if (gap > 0) body.style.paddingRight = `${gap}px`;

    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPadding;
    };
  }, [active]);
}

export default function Modal({
  open,
  onClose,
  labelledBy,
  children,
}: {
  open: boolean;
  onClose: () => void;
  /** id of the element inside `children` that names the dialog. */
  labelledBy?: string;
  children: ReactNode;
}) {
  const t = useT();
  const panelRef = useRef<HTMLDivElement>(null);
  const fallbackLabelId = useId();
  // Whatever opened the modal, so focus can go back there on close.
  const openerRef = useRef<HTMLElement | null>(null);
  // Drives the scroll hint: it has done its job the moment the panel moves.
  const [scrolled, setScrolled] = useState(false);

  useScrollLock(open);

  useEffect(() => {
    if (!open) return;
    setScrolled(false);
    const panel = panelRef.current;
    if (!panel) return;
    const read = () => setScrolled(panel.scrollTop > 24);
    panel.addEventListener("scroll", read, { passive: true });
    return () => panel.removeEventListener("scroll", read);
  }, [open]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;

      // Keep tabbing inside the panel: past the last stop it wraps to the first
      // rather than walking off into the dimmed page behind.
      const stops = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (stops.length === 0) return;
      const first = stops[0];
      const last = stops[stops.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || active === panelRef.current)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    openerRef.current = document.activeElement as HTMLElement | null;
    // The panel itself takes focus first: a case modal opens on its title, not
    // on whichever link happens to be first in the markup.
    panelRef.current?.focus();

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      openerRef.current?.focus?.();
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return createPortal(
    <div
      // items-start, not the default stretch: a flex item with height:auto is
      // stretched to the container, which would give a short modal (the résumé)
      // the full 92dvh with its content stranded at the top.
      className="fixed inset-0 z-[1000] flex justify-center items-start overflow-hidden modal-scrim"
      // Only a press that both starts and ends on the scrim closes: a drag that
      // began on text inside the panel must not dismiss it on release.
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div aria-hidden className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy ?? fallbackLabelId}
        tabIndex={-1}
        className="relative z-[1] w-full max-w-[760px] h-full sm:h-auto sm:my-[4dvh] sm:max-h-[92dvh] overflow-y-auto overscroll-contain outline-none bg-[#1c1c1c] sm:rounded-xl modal-panel"
      >
        {/* A zero-height sticky row, not a float. Floated, the button stayed in
            flow enough for the content to wrap around it, which took 56px off
            the right side of every block and left the panel visibly
            lopsided. With no height and no width to give away, it rides the
            scroll and the content keeps equal padding on both sides. */}
        <div className="sticky top-4 md:top-6 z-20 h-0 flex justify-end pr-4 md:pr-6">
        <button
          type="button"
          onClick={onClose}
          aria-label={t.common.close}
          // Deliberately quiet: it sits on top of the case imagery the whole way
          // down, so it holds back until it is pointed at.
          className="w-10 h-10 rounded-md bg-black/40 backdrop-blur-md text-white/60 hover:bg-white hover:text-black flex items-center justify-center cursor-pointer outline-none transition-colors"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
        </div>

        {children}

        {/* Sticky to the bottom of the visible panel, with a matching negative
            margin so it claims no height of its own. It fades out for good once
            the reader has started scrolling. */}
        <div
          aria-hidden
          className={`sticky bottom-0 z-10 -mt-24 h-24 pointer-events-none flex items-end justify-center pb-4 transition-opacity duration-300 ${
            scrolled ? "opacity-0" : "opacity-100"
          }`}
          style={{
            background: "linear-gradient(to top, #1c1c1c 8%, transparent 100%)",
          }}
        >
          <span className="scroll-hint text-white/55" >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </span>
        </div>
      </div>
    </div>,
    document.body,
  );
}
