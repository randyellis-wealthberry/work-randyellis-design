import { initBotId } from "botid/client/core";

/**
 * Client-side half of BotID. Registering a path here is what makes the browser
 * attach the proof-of-work token that `checkBotId()` verifies on the server —
 * without it, the server check has nothing to read and would classify real
 * visitors as bots.
 *
 * Only the newsletter signup is listed. It is the site's one public,
 * unauthenticated, write-causing form. The other POST routes are deliberately
 * absent: /api/csp-report receives automated browser reports rather than human
 * gestures, /api/newsletter/export is Bearer-authenticated and called by
 * scripts that carry no client token, /api/cdn/optimize has no callers, and
 * unsubscribe stays unprotected so a false positive can never block a legally
 * required opt-out.
 */
initBotId({
  protect: [
    {
      path: "/api/newsletter/subscribe",
      method: "POST",
    },
  ],
});
