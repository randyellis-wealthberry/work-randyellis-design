#!/usr/bin/env node

/**
 * Non-Interactive Development Server with Auto Port Cleanup
 * Automatically kills processes on port 3000 without user confirmation
 */

const { exec, spawn } = require("child_process");

// Simple color logging without external dependencies
const colors = {
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  red: (text) => `\x1b[31m${text}\x1b[0m`,
};

const PORT = 3000;

console.log(colors.blue("🔧 Starting development server with auto port cleanup..."));

/**
 * Kill processes running on specified port automatically
 */
function killPort(port) {
  return new Promise((resolve) => {
    console.log(colors.yellow(`🔍 Checking for processes on port ${port}...`));

    // Find processes using the port
    exec(`lsof -ti:${port}`, (error, stdout) => {
      if (error || !stdout.trim()) {
        console.log(colors.green(`✅ Port ${port} is available`));
        resolve();
        return;
      }

      const pids = stdout.trim().split("\n");
      console.log(
        colors.yellow(
          `⚠️  Found ${pids.length} process(es) on port ${port}: ${pids.join(", ")}`,
        ),
      );

      // Auto-kill the processes without confirmation
      exec(`kill -9 ${pids.join(" ")}`, (killError) => {
        if (killError) {
          console.log(
            colors.red(`❌ Failed to kill processes: ${killError.message}`),
          );
        } else {
          console.log(
            colors.green(
              `✅ Successfully killed ${pids.length} process(es) on port ${port}`,
            ),
          );
        }

        // Wait a moment for cleanup
        setTimeout(resolve, 1000);
      });
    });
  });
}

/**
 * Additional cleanup for Next.js processes
 */
function cleanupNextProcesses() {
  return new Promise((resolve) => {
    console.log(
      colors.yellow("🧹 Cleaning up any remaining Next.js processes..."),
    );

    // Kill any lingering next dev processes
    exec(
      'pkill -f "next.*dev" 2>/dev/null || pkill -f "node.*next" 2>/dev/null || true',
      (error) => {
        if (error) {
          console.log(
            colors.yellow("⚠️  No Next.js processes found to clean up"),
          );
        } else {
          console.log(colors.green("✅ Next.js process cleanup complete"));
        }
        resolve();
      },
    );
  });
}

/**
 * Start the Next.js development server
 */
function startDevServer() {
  console.log(colors.blue("🚀 Starting Next.js development server..."));

  const devProcess = spawn("npx", ["next", "dev"], {
    stdio: "inherit",
    env: { ...process.env, FORCE_COLOR: "1" },
  });

  // Handle process termination
  process.on("SIGINT", () => {
    console.log(colors.yellow("\n🛑 Shutting down development server..."));
    devProcess.kill("SIGTERM");
    process.exit(0);
  });

  process.on("SIGTERM", () => {
    console.log(colors.yellow("\n🛑 Received SIGTERM, shutting down..."));
    devProcess.kill("SIGTERM");
    process.exit(0);
  });

  devProcess.on("exit", (code) => {
    if (code !== 0) {
      console.log(colors.red(`❌ Development server exited with code ${code}`));
    }
    process.exit(code);
  });
}

/**
 * Main execution
 */
async function main() {
  try {
    await killPort(PORT);
    await cleanupNextProcesses();
    startDevServer();
  } catch (error) {
    console.error(colors.red(`❌ Error during setup: ${error.message}`));
    process.exit(1);
  }
}

// Run the script
main();
