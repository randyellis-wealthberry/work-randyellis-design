import { TestResults, type TestResult } from "@/components/ui/test-results";

const mockTestResults: TestResult[] = [
  {
    id: "1",
    title: "Submission",
    message: "Submitting email to newsletter endpoint...",
    status: "pending",
    timestamp: new Date("2025-07-28T15:07:01"),
  },
  {
    id: "2",
    title: "Submission",
    message: "API Error: Server configuration error. Please contact support.",
    status: "error",
    timestamp: new Date("2025-07-28T15:07:05"),
    details: {
      error: "Server configuration error. Please contact support.",
    },
  },
  {
    id: "3",
    title: "Database Connection",
    message: "Successfully connected to database",
    status: "success",
    timestamp: new Date("2025-07-28T15:06:45"),
    details: "Connection established to PostgreSQL database at port 5432",
  },
  {
    id: "4",
    title: "Authentication Test",
    message: "JWT token validation failed",
    status: "error",
    timestamp: new Date("2025-07-28T15:06:30"),
    details: {
      error: "JWT token validation failed",
      code: "INVALID_TOKEN",
      timestamp: "2025-07-28T15:06:30Z",
    },
  },
];

export default function TestResultsDemo() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-4 text-3xl font-bold">Test Results Component Demo</h1>
        <p className="mb-6 text-gray-600">
          This demo showcases the TestResults component with different status
          types: pending, error, and success states. Each result can include
          expandable details.
        </p>
      </div>

      <TestResults results={mockTestResults} />

      <div className="mt-12 rounded-lg bg-gray-50 p-6">
        <h2 className="mb-4 text-xl font-semibold">Usage Example</h2>
        <pre className="overflow-x-auto rounded border bg-white p-4 text-sm">
          {`import { TestResults, type TestResult } from "@/components/ui/test-results";

const results: TestResult[] = [
  {
    id: "1",
    title: "Submission",
    message: "Submitting email to newsletter endpoint...",
    status: "pending",
    timestamp: new Date(),
  },
  {
    id: "2",
    title: "Submission", 
    message: "API Error: Server configuration error.",
    status: "error",
    timestamp: new Date(),
    details: { error: "Server configuration error" }
  }
];

<TestResults results={results} />`}
        </pre>
      </div>
    </div>
  );
}
