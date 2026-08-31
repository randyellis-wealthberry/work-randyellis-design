import {
  sanitize,
  throttled,
  resetThrottle,
  currentPage,
  MAX_LEN,
} from "@/lib/analytics-guard";

describe("sanitize", () => {
  it("passes valid scalar values through untouched", () => {
    const result = sanitize("my_event", {
      category: "engagement",
      count: 3,
      flag: true,
      empty: null,
    });

    expect(result.name).toBe("my_event");
    expect(result.props).toEqual({
      category: "engagement",
      count: 3,
      flag: true,
      empty: null,
    });
    expect(result.dropped).toEqual([]);
  });

  it("truncates an over-length event name to 255 characters", () => {
    const result = sanitize("a".repeat(300), {});

    expect(result.name).toHaveLength(MAX_LEN);
  });

  it("truncates an over-length key and string value", () => {
    const longKey = "k".repeat(300);
    const result = sanitize("e", { [longKey]: "v".repeat(300) });

    const [key] = Object.keys(result.props);
    expect(key).toHaveLength(MAX_LEN);
    expect(result.props[key]).toHaveLength(MAX_LEN);
  });

  it("removes nested objects and reports them as dropped", () => {
    const result = sanitize("e", { good: "yes", bad: { nested: 1 } });

    expect(result.props).toEqual({ good: "yes" });
    expect(result.dropped).toEqual(["bad"]);
  });

  it("treats arrays as nested objects and drops them", () => {
    const result = sanitize("e", { list: [1, 2, 3] });

    expect(result.props).toEqual({});
    expect(result.dropped).toEqual(["list"]);
  });

  it("omits undefined values without reporting them as dropped", () => {
    const result = sanitize("e", { present: "x", missing: undefined });

    expect(result.props).toEqual({ present: "x" });
    expect(result.dropped).toEqual([]);
  });

  it("preserves null, which Vercel accepts", () => {
    const result = sanitize("e", { cleared: null });

    expect(result.props).toEqual({ cleared: null });
    expect(result.dropped).toEqual([]);
  });

  it("drops a function value and reports it as dropped", () => {
    const result = sanitize("e", { good: "yes", handler: () => {} });

    expect(result.props).toEqual({ good: "yes" });
    expect(result.dropped).toEqual(["handler"]);
  });

  it("drops a symbol value and reports it as dropped", () => {
    const result = sanitize("e", { good: "yes", token: Symbol("id") });

    expect(result.props).toEqual({ good: "yes" });
    expect(result.dropped).toEqual(["token"]);
  });

  it("drops a bigint value and reports it as dropped", () => {
    const result = sanitize("e", { good: "yes", big: 10n });

    expect(result.props).toEqual({ good: "yes" });
    expect(result.dropped).toEqual(["big"]);
  });
});

describe("throttled", () => {
  beforeEach(() => {
    resetThrottle();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("allows the first call for a key", () => {
    expect(throttled("scroll", 30_000)).toBe(true);
  });

  it("blocks a repeat call inside the window", () => {
    throttled("scroll", 30_000);

    expect(throttled("scroll", 30_000)).toBe(false);
  });

  it("allows again once the window has elapsed", () => {
    throttled("scroll", 30_000);
    jest.advanceTimersByTime(30_001);

    expect(throttled("scroll", 30_000)).toBe(true);
  });

  it("tracks each key independently", () => {
    throttled("scroll", 30_000);

    expect(throttled("hover", 30_000)).toBe(true);
  });
});

describe("currentPage", () => {
  it("returns the pathname in a browser environment", () => {
    expect(currentPage()).toBe(window.location.pathname);
  });
});
