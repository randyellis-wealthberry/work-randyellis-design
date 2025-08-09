import { parseMetricValue } from "@/lib/utils/parseMetricValue";

describe("parseMetricValue", () => {
  describe("percentage values", () => {
    it("should parse simple percentage values", () => {
      expect(parseMetricValue("78%")).toEqual({
        number: 78,
        suffix: "%",
        prefix: "",
      });
    });

    it("should parse percentage values with less than symbol", () => {
      expect(parseMetricValue("<10%")).toEqual({
        number: 10,
        suffix: "%",
        prefix: "<",
      });
    });

    it("should parse percentage values with plus symbol", () => {
      expect(parseMetricValue("+12%")).toEqual({
        number: 12,
        suffix: "%",
        prefix: "+",
      });
    });
  });

  describe("currency values", () => {
    it("should parse currency values with K suffix", () => {
      expect(parseMetricValue("$180K")).toEqual({
        number: 180,
        suffix: "K",
        prefix: "$",
      });
    });

    it("should parse currency values with M suffix", () => {
      expect(parseMetricValue("$184.4M")).toEqual({
        number: 184.4,
        suffix: "M",
        prefix: "$",
      });
    });
  });

  describe("number values with suffixes", () => {
    it("should parse values with K+ suffix", () => {
      expect(parseMetricValue("10K+")).toEqual({
        number: 10,
        suffix: "K+",
        prefix: "",
      });
    });

    it("should parse values with star suffix", () => {
      expect(parseMetricValue("4.8★")).toEqual({
        number: 4.8,
        suffix: "★",
        prefix: "",
      });
    });
  });

  describe("time-based values", () => {
    it("should parse time values in months", () => {
      expect(parseMetricValue("6 months")).toEqual({
        number: 6,
        suffix: " months",
        prefix: "",
      });
    });
  });

  describe("plain number values", () => {
    it("should parse plain numbers", () => {
      expect(parseMetricValue("92")).toEqual({
        number: 92,
        suffix: "",
        prefix: "",
      });
    });

    it("should parse decimal numbers", () => {
      expect(parseMetricValue("4.8")).toEqual({
        number: 4.8,
        suffix: "",
        prefix: "",
      });
    });
  });

  describe("edge cases", () => {
    it("should handle empty string", () => {
      expect(parseMetricValue("")).toEqual({
        number: 0,
        suffix: "",
        prefix: "",
      });
    });

    it("should handle non-numeric strings", () => {
      expect(parseMetricValue("N/A")).toEqual({
        number: 0,
        suffix: "N/A",
        prefix: "",
      });
    });

    it("should handle values with multiple decimal places", () => {
      expect(parseMetricValue("184.4M")).toEqual({
        number: 184.4,
        suffix: "M",
        prefix: "",
      });
    });
  });
});
