import {
  CONVERSION_EVENTS,
  CONVERSION_SURFACES,
  HIGH_FREQUENCY_WINDOW_MS,
} from "@/lib/analytics-events";
import { MAX_LEN } from "@/lib/analytics-guard";

describe("the event catalog", () => {
  it("keeps every conversion event name inside Vercel's 255-character cap", () => {
    for (const name of CONVERSION_EVENTS) {
      expect(name.length).toBeLessThanOrEqual(MAX_LEN);
    }
  });

  it("keeps every surface identifier inside the cap", () => {
    for (const surface of CONVERSION_SURFACES) {
      expect(surface.length).toBeLessThanOrEqual(MAX_LEN);
    }
  });

  it("treats contact_intent as a conversion, since it is the booking signal", () => {
    expect(CONVERSION_EVENTS.has("contact_intent")).toBe(true);
  });

  it("does not treat decorative events as conversions", () => {
    // These carry no intent and must not receive the `page` property,
    // which would break the existing exact-payload assertions.
    expect(CONVERSION_EVENTS.has("pwa_install_success")).toBe(false);
    expect(CONVERSION_EVENTS.has("scroll_progress")).toBe(false);
  });

  it("uses a throttle window long enough to bound per-session cost", () => {
    expect(HIGH_FREQUENCY_WINDOW_MS).toBe(30_000);
  });
});
