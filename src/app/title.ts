import { useEffect } from "react";
import { useT } from "@/app/i18n";

/**
 * Keeps document.title in step with the active language. The site is a single
 * page, so the title only ever changes when the reader switches language.
 */
export function usePageTitle(): void {
  const title = useT().titles.site;

  useEffect(() => {
    document.title = title;
  }, [title]);
}
