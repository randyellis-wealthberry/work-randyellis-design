/**
 * CSP Violation Reporting Endpoint
 *
 * Handles Content Security Policy violation reports from browsers.
 * Logs violations for monitoring and debugging purposes.
 */

import { NextRequest, NextResponse } from "next/server";
import { extractDomain, isDangerousViolation } from "@/lib/security/csp-utils";

// Rate limiting for violation reports (prevent spam)
const violationRateLimit = new Map<
  string,
  { count: number; resetTime: number }
>();
const VIOLATION_RATE_LIMIT = {
  maxReports: 10, // Max 10 reports per IP per minute
  windowMs: 60 * 1000, // 1 minute window
};

interface CSPViolationReport {
  "csp-report": {
    "document-uri"?: string;
    referrer?: string;
    "violated-directive"?: string;
    "effective-directive"?: string;
    "original-policy"?: string;
    disposition?: string;
    "blocked-uri"?: string;
    "line-number"?: number;
    "column-number"?: number;
    "source-file"?: string;
    "status-code"?: number;
    "script-sample"?: string;
  };
}

function getRateLimitKey(request: NextRequest): string {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "unknown";
  return `csp-violation:${ip}`;
}

function checkViolationRateLimit(key: string): boolean {
  const now = Date.now();
  const entry = violationRateLimit.get(key);

  if (!entry || now > entry.resetTime) {
    violationRateLimit.set(key, {
      count: 1,
      resetTime: now + VIOLATION_RATE_LIMIT.windowMs,
    });
    return true;
  }

  if (entry.count >= VIOLATION_RATE_LIMIT.maxReports) {
    return false;
  }

  entry.count++;
  violationRateLimit.set(key, entry);
  return true;
}

function processViolationReport(report: CSPViolationReport): void {
  const violation = report["csp-report"];

  if (!violation) {
    console.warn("CSP Violation: Invalid report structure");
    return;
  }

  const logData = {
    timestamp: new Date().toISOString(),
    documentUri: violation["document-uri"],
    violatedDirective: violation["violated-directive"],
    blockedUri: violation["blocked-uri"],
    sourceFile: violation["source-file"],
    lineNumber: violation["line-number"],
    columnNumber: violation["column-number"],
    disposition: violation["disposition"],
    isDangerous: isDangerousViolation(violation),
    domain: extractDomain(violation["blocked-uri"] || ""),
  };

  // Log based on severity
  if (logData.isDangerous) {
    console.error("CSP Violation (DANGEROUS):", logData);
  } else {
    console.info("CSP Violation:", logData);
  }

  // In production, you might want to send this to a monitoring service
  // such as Sentry, DataDog, or your own analytics endpoint
  if (process.env.NODE_ENV === "production") {
    // Example: Send to monitoring service
    // await sendToMonitoringService(logData);
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check Content-Type
    const contentType = request.headers.get("content-type");
    if (
      !contentType ||
      (!contentType.includes("application/csp-report") &&
        !contentType.includes("application/json"))
    ) {
      return NextResponse.json(
        { error: "Invalid Content-Type" },
        { status: 400 },
      );
    }

    // Rate limiting
    const rateLimitKey = getRateLimitKey(request);
    if (!checkViolationRateLimit(rateLimitKey)) {
      return NextResponse.json(
        { error: "Too many violation reports" },
        {
          status: 429,
          headers: {
            "Retry-After": "60",
          },
        },
      );
    }

    // Parse request body
    const body = await request.text();

    if (!body) {
      return NextResponse.json(
        { error: "Empty request body" },
        { status: 400 },
      );
    }

    // Limit payload size (prevent large report spam)
    if (body.length > 10000) {
      // 10KB limit
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }

    let report: CSPViolationReport;
    try {
      report = JSON.parse(body);
    } catch (error) {
      console.warn("CSP Violation: Invalid JSON:", error);
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    // Process the violation report
    processViolationReport(report);

    return NextResponse.json(
      { message: "Violation report received" },
      { status: 204 },
    );
  } catch (error) {
    console.error("CSP Violation Endpoint Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// Only allow POST requests
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
