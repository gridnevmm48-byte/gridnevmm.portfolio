import { useId } from "react";
import Modal from "./Modal";
import { BUTTON, TIGHT } from "./Root";
import { useLang, useT } from "@/app/i18n";
import cvEnAvif from "@/assets/cv/cv-en.avif";
import cvEnJpg from "@/assets/cv/cv-en.jpg";
import cvRuAvif from "@/assets/cv/cv-ru.avif";
import cvRuJpg from "@/assets/cv/cv-ru.jpg";

/**
 * The résumé, as the image it was exported as.
 *
 * Which one is shown follows the interface language rather than a control of
 * its own: someone reading the site in Russian wants the Russian CV.
 */
const CV = {
  en: { avif: cvEnAvif, jpg: cvEnJpg, file: "Maksim-Gridnev-AI-Native-Product-Designer-EN.jpg" },
  ru: { avif: cvRuAvif, jpg: cvRuJpg, file: "Maksim-Gridnev-AI-Native-Product-Designer-RU.jpg" },
};

export default function CvModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useT();
  const { lang } = useLang();
  const titleId = useId();
  const cv = CV[lang];

  return (
    <Modal open={open} onClose={onClose} labelledBy={titleId}>
      <div className="flex flex-col gap-4 px-4 md:px-6 pb-4 md:pb-6 pt-4 md:pt-6">
        {/* One row with the close button: title and download sit together on
            the left, the close stays on the right. The top padding matches the
            close button's own offset and the row is its height, so all three
            land on the same line. pr-16 is the lane the close button occupies. */}
        <div className="flex items-center gap-4 h-10 pr-16">
          <h2
            id={titleId}
            className="text-white font-semibold text-2xl leading-7"
            style={{ letterSpacing: TIGHT }}
          >
            {t.caseUi.cvTitle}
          </h2>
          {/* The jpg, not the avif: this is the copy that leaves the site, and a
              jpg opens anywhere the recipient drops it. */}
          <a
            href={cv.jpg}
            download={cv.file}
            className="bg-white text-black rounded-lg h-10 flex items-center justify-center px-6 font-semibold uppercase no-underline shrink-0 hover:opacity-80 transition-opacity"
            style={{ fontSize: "13px", letterSpacing: BUTTON }}
          >
            {t.caseUi.cvDownload}
          </a>
        </div>

        <div className="rounded-lg overflow-hidden bg-white">
          <picture>
            <source srcSet={cv.avif} type="image/avif" />
            <img src={cv.jpg} alt={t.caseUi.cvAlt} className="w-full h-auto block" />
          </picture>
        </div>
      </div>
    </Modal>
  );
}
