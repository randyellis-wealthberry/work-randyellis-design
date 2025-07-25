export interface ParsedMetricValue {
  number: number;
  suffix: string;
  prefix: string;
}

export function parseMetricValue(value: string): ParsedMetricValue {
  if (!value || value.trim() === "") {
    return { number: 0, suffix: "", prefix: "" };
  }

  // Handle non-numeric strings
  const numericPattern = /[\d.]+/;
  if (!numericPattern.test(value)) {
    return { number: 0, suffix: value, prefix: "" };
  }

  // Extract number, prefix, and suffix using regex
  const match = value.match(/^([^0-9.]*)([0-9.]+)(.*)$/);

  if (!match) {
    return { number: 0, suffix: value, prefix: "" };
  }

  const [, prefix, numberStr, suffix] = match;
  const number = parseFloat(numberStr);

  return {
    number: isNaN(number) ? 0 : number,
    suffix: suffix || "",
    prefix: prefix || "",
  };
}
