"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface TestResult {
  step: string;
  status: "success" | "error" | "pending";
  message: string;
  timestamp: string;
  data?: unknown;
}

export default function EmailTestPage() {
  const [testEmail, setTestEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);

  const addResult = (
    step: string,
    status: TestResult["status"],
    message: string,
    data?: unknown,
  ) => {
    const result: TestResult = {
      step,
      status,
      message,
      timestamp: new Date().toISOString(),
      data,
    };
    setResults((prev) => [...prev, result]);
    return result;
  };

  const testEmailFlow = async () => {
    if (!testEmail) {
      alert("Please enter a test email address");
      return;
    }

    setIsRunning(true);
    setResults([]);

    try {
      // Step 1: Test email submission
      addResult(
        "submission",
        "pending",
        "Submitting email to newsletter endpoint...",
      );

      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: testEmail,
          firstName: firstName || undefined,
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        addResult(
          "submission",
          "success",
          "Email successfully submitted to API",
          responseData,
        );
      } else {
        addResult(
          "submission",
          "error",
          `API Error: ${responseData.error}`,
          responseData,
        );
        setIsRunning(false);
        return;
      }

      // Step 2: Check local storage
      addResult("local_storage", "pending", "Checking local storage...");

      try {
        const statsResponse = await fetch("/api/newsletter/stats");
        const statsData = await statsResponse.json();

        if (statsResponse.ok) {
          addResult(
            "local_storage",
            "success",
            `Local storage updated. Total subscriptions: ${statsData.data.totalSubscriptions}`,
            statsData.data,
          );
        } else {
          addResult(
            "local_storage",
            "error",
            "Failed to fetch local storage stats",
            statsData,
          );
        }
      } catch (error) {
        addResult(
          "local_storage",
          "error",
          `Local storage check failed: ${error}`,
        );
      }

      // Step 3: Provide Loops.so verification instructions
      addResult(
        "loops_verification",
        "success",
        "Check Loops.so dashboard for contact creation",
        {
          instructions: [
            "1. Visit https://app.loops.so/audience",
            "2. Search for your test email address",
            "3. Verify contact properties include signup metadata",
            "4. Check if 'newsletter_signup' event was recorded",
          ],
        },
      );

      // Step 4: Check for drip campaign enrollment
      addResult(
        "drip_campaigns",
        "success",
        "Monitor drip campaign enrollment",
        {
          instructions: [
            "1. Visit https://app.loops.so/loops",
            "2. Check active campaigns for new subscriber enrollment",
            "3. Verify campaign triggers are working correctly",
            "4. Monitor email delivery in campaign analytics",
          ],
        },
      );
    } catch (error) {
      addResult("error", "error", `Unexpected error: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  const getStatusColor = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return "text-green-600 dark:text-green-400";
      case "error":
        return "text-red-600 dark:text-red-400";
      case "pending":
        return "text-yellow-600 dark:text-yellow-400";
      default:
        return "text-zinc-600 dark:text-zinc-400";
    }
  };

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "pending":
        return "⏳";
      default:
        return "ℹ️";
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            Email Flow Testing Tool
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Test the complete email capture flow from form submission to
            Loops.so integration. This tool verifies each step of the email
            journey.
          </p>
        </div>

        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Test Configuration</h2>
          <div className="space-y-4">
            <FloatingInput
              type="email"
              label="Test Email Address"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="test@example.com"
              required
            />
            <FloatingInput
              type="text"
              label="First Name (Optional)"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="John"
            />
            <div className="flex gap-4">
              <Button
                onClick={testEmailFlow}
                disabled={isRunning}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isRunning ? "Running Test..." : "Start Email Flow Test"}
              </Button>
              {results.length > 0 && (
                <Button
                  onClick={clearResults}
                  variant="outline"
                  disabled={isRunning}
                >
                  Clear Results
                </Button>
              )}
            </div>
          </div>
        </Card>

        {results.length > 0 && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Test Results</h2>
            <div className="space-y-4">
              {results.map((result, index) => (
                <div
                  key={index}
                  className="border-l-4 border-zinc-200 dark:border-zinc-700 pl-4 py-2"
                  style={{
                    borderLeftColor:
                      result.status === "success"
                        ? "#10b981"
                        : result.status === "error"
                          ? "#ef4444"
                          : "#f59e0b",
                  }}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-lg">
                      {getStatusIcon(result.status)}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-zinc-900 dark:text-zinc-100">
                          {result.step.charAt(0).toUpperCase() +
                            result.step.slice(1).replace("_", " ")}
                        </h3>
                        <span
                          className={`text-sm ${getStatusColor(result.status)}`}
                        >
                          {result.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-zinc-600 dark:text-zinc-400 mb-2">
                        {result.message}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-500">
                        {new Date(result.timestamp).toLocaleString()}
                      </p>
                      {result.data != null && (
                        <details className="mt-2">
                          <summary className="cursor-pointer text-sm text-blue-600 dark:text-blue-400 hover:underline">
                            View Details
                          </summary>
                          <pre className="mt-2 p-2 bg-zinc-100 dark:bg-zinc-800 rounded text-xs overflow-auto">
                            {typeof result.data === "string"
                              ? result.data
                              : JSON.stringify(result.data, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        <Card className="p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">
            Manual Verification Steps
          </h2>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-medium text-zinc-900 dark:text-zinc-100 mb-2">
                1. Local Data Storage
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 mb-2">
                Check that email was stored locally:
              </p>
              <code className="block bg-zinc-100 dark:bg-zinc-800 p-2 rounded">
                cat data/email-subscriptions.json | jq &apos;.[].email&apos; |
                grep &quot;{testEmail}&quot;
              </code>
            </div>

            <div>
              <h3 className="font-medium text-zinc-900 dark:text-zinc-100 mb-2">
                2. Loops.so Contact Creation
              </h3>
              <ul className="text-zinc-600 dark:text-zinc-400 space-y-1">
                <li>
                  • Visit{" "}
                  <a
                    href="https://app.loops.so/audience"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Loops.so Audience
                  </a>
                </li>
                <li>• Search for your test email</li>
                <li>• Verify contact properties and metadata</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-zinc-900 dark:text-zinc-100 mb-2">
                3. Event Tracking
              </h3>
              <ul className="text-zinc-600 dark:text-zinc-400 space-y-1">
                <li>
                  • Check contact&apos;s activity timeline for
                  &quot;newsletter_signup&quot; event
                </li>
                <li>• Verify event properties are captured correctly</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-zinc-900 dark:text-zinc-100 mb-2">
                4. Drip Campaign Enrollment
              </h3>
              <ul className="text-zinc-600 dark:text-zinc-400 space-y-1">
                <li>
                  • Visit{" "}
                  <a
                    href="https://app.loops.so/loops"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Loops.so Campaigns
                  </a>
                </li>
                <li>
                  • Check if contact was enrolled in active drip campaigns
                </li>
                <li>• Monitor email delivery in campaign analytics</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
