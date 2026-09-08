/**
 * Fires a named goal at Yandex Metrika, for interactions its automatic
 * tracking can't see on its own.
 *
 * `trackLinks` (set on the counter in index.html) already logs every click on
 * a real `<a>` to an outside domain — the case modal's "GO TO WEB" buttons,
 * the LinkedIn/Telegram chips, the résumé link — with no code needed here.
 * Opening a case study is different: it's a `<button>` that swaps state, not
 * a navigation, so nothing about it reaches Metrika unless something calls
 * this explicitly.
 *
 * A no-op until the goal with this exact identifier exists in the counter's
 * own settings (Цели → JavaScript-событие) — the call fires either way, but
 * only a matching goal turns it into a report. See README for the goals this
 * site expects.
 */
export function reachGoal(target: string): void {
  const ym = (window as unknown as { ym?: (...args: unknown[]) => void }).ym;
  ym?.(112074666, "reachGoal", target);
}
