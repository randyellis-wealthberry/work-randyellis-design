#!/usr/bin/env node

/**
 * Vercel Deployment Cleanup Script
 * 
 * Automatically removes preview deployments for branches that have been merged or deleted.
 * This script uses the Vercel REST API to identify and clean up orphaned deployments.
 * 
 * Usage: node scripts/clean-vercel-deployments.js [--dry-run]
 * 
 * Environment Variables:
 * - VERCEL_BEARER_TOKEN: Your Vercel API token (required)
 * - VERCEL_TEAM_ID: Optional team ID for team projects
 * 
 * Author: Generated for Vercel active branch cleanup
 */

const { execSync } = require('child_process');
const https = require('https');

// Configuration
const API_BASE_URL = 'https://api.vercel.com';
const BATCH_SIZE = 10; // Process deployments in batches to avoid rate limits

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logError(message) {
  log(`❌ ERROR: ${message}`, 'red');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

/**
 * Execute a shell command and return the output
 */
function execCommand(command, options = {}) {
  try {
    const result = execSync(command, { 
      encoding: 'utf8', 
      ...options 
    }).trim();
    return result;
  } catch (error) {
    throw new Error(`Command failed: ${command}\n${error.message}`);
  }
}

/**
 * Make HTTP request to Vercel API
 */
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const requestOptions = {
      hostname: 'api.vercel.com',
      port: 443,
      path: url,
      method: options.method || 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.VERCEL_BEARER_TOKEN}`,
        'Content-Type': 'application/json',
        'User-Agent': 'vercel-cleanup-script/1.0',
        ...options.headers
      }
    };

    const req = https.request(requestOptions, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const parsed = data ? JSON.parse(data) : {};
            resolve({ data: parsed, status: res.statusCode });
          } catch (error) {
            reject(new Error(`Failed to parse response: ${error.message}`));
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error(`Request failed: ${error.message}`));
    });

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.end();
  });
}

/**
 * Get all existing Git branches (local and remote)
 */
function getGitBranches() {
  try {
    // Get local branches
    const localBranches = execCommand('git branch --format="%(refname:short)"')
      .split('\n')
      .filter(branch => branch.trim() && !branch.startsWith('HEAD'));

    // Get remote branches
    const remoteBranches = execCommand('git branch -r --format="%(refname:short)"')
      .split('\n')
      .filter(branch => branch.trim() && !branch.includes('HEAD'))
      .map(branch => branch.replace(/^origin\//, ''));

    // Combine and deduplicate
    const allBranches = new Set([...localBranches, ...remoteBranches]);
    
    logInfo(`Found ${allBranches.size} Git branches`);
    return Array.from(allBranches);
  } catch (error) {
    throw new Error(`Failed to get Git branches: ${error.message}`);
  }
}

/**
 * Fetch all deployments from Vercel API
 */
async function fetchAllDeployments() {
  logInfo('Fetching deployments from Vercel...');
  
  const deployments = [];
  let nextCursor = null;
  let totalCount = 0;

  do {
    const url = `/v13/deployments${nextCursor ? `?since=${nextCursor}` : ''}`;
    
    try {
      const response = await makeRequest(url);
      const batch = response.data.deployments || [];
      
      deployments.push(...batch);
      totalCount += batch.length;
      
      // Get next cursor for pagination
      nextCursor = response.data.pagination?.next;
      
      if (batch.length > 0) {
        logInfo(`Fetched ${batch.length} deployments (total: ${totalCount})`);
      }
    } catch (error) {
      throw new Error(`Failed to fetch deployments: ${error.message}`);
    }
  } while (nextCursor);

  logSuccess(`Fetched ${deployments.length} total deployments`);
  return deployments;
}

/**
 * Filter deployments to find orphaned preview deployments
 */
function findOrphanedDeployments(deployments, existingBranches) {
  logInfo('Analyzing deployments for orphaned branches...');
  
  const orphaned = deployments.filter(deployment => {
    // Skip production deployments
    if (deployment.target === 'production') {
      return false;
    }

    // Get branch name from deployment metadata
    const branchName = deployment.meta?.branch;
    
    // Skip if no branch information
    if (!branchName) {
      logWarning(`Deployment ${deployment.uid} has no branch information, skipping`);
      return false;
    }

    // Skip main/master branches (should never be deleted)
    if (branchName === 'main' || branchName === 'master') {
      return false;
    }

    // Check if branch still exists
    const branchExists = existingBranches.includes(branchName);
    
    if (!branchExists) {
      logInfo(`Found orphaned deployment: ${deployment.uid} (branch: ${branchName})`);
      return true;
    }

    return false;
  });

  logInfo(`Found ${orphaned.length} orphaned preview deployments`);
  return orphaned;
}

/**
 * Delete a deployment
 */
async function deleteDeployment(deployment) {
  const url = `/v13/deployments/${deployment.uid}`;
  
  try {
    const response = await makeRequest(url, { method: 'DELETE' });
    logSuccess(`Deleted deployment ${deployment.uid} (${deployment.url})`);
    return response.data;
  } catch (error) {
    logError(`Failed to delete deployment ${deployment.uid}: ${error.message}`);
    throw error;
  }
}

/**
 * Delete deployments in batches
 */
async function deleteDeploymentsBatch(deployments, dryRun = false) {
  if (dryRun) {
    logWarning('DRY RUN: Would delete the following deployments:');
    deployments.forEach(deployment => {
      log(`  - ${deployment.uid} (${deployment.url}) - Branch: ${deployment.meta?.branch || 'unknown'}`, 'yellow');
    });
    return;
  }

  logInfo(`Deleting ${deployments.length} orphaned deployments...`);
  
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < deployments.length; i += BATCH_SIZE) {
    const batch = deployments.slice(i, i + BATCH_SIZE);
    
    logInfo(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(deployments.length / BATCH_SIZE)}`);
    
    const promises = batch.map(async (deployment) => {
      try {
        await deleteDeployment(deployment);
        return { success: true, deployment };
      } catch (error) {
        return { success: false, deployment, error: error.message };
      }
    });

    const results = await Promise.allSettled(promises);
    
    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        if (result.value.success) {
          successCount++;
        } else {
          errorCount++;
          logError(`Failed to delete ${result.value.deployment.uid}: ${result.value.error}`);
        }
      } else {
        errorCount++;
        logError(`Batch processing error: ${result.reason.message}`);
      }
    });

    // Rate limiting: wait between batches
    if (i + BATCH_SIZE < deployments.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  logSuccess(`Deletion complete: ${successCount} successful, ${errorCount} failed`);
}

/**
 * Validate environment and prerequisites
 */
function validateEnvironment() {
  if (!process.env.VERCEL_BEARER_TOKEN) {
    throw new Error('VERCEL_BEARER_TOKEN environment variable is required');
  }

  try {
    execCommand('git --version');
  } catch (error) {
    throw new Error('Git is required but not found in PATH');
  }

  try {
    execCommand('git rev-parse --git-dir');
  } catch (error) {
    throw new Error('Not in a Git repository');
  }
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  
  if (dryRun) {
    logWarning('DRY RUN MODE: No actual deletions will be performed');
  }

  try {
    log('🧹 Vercel Deployment Cleanup Script', 'cyan');
    log('=====================================', 'cyan');

    // Validate environment
    validateEnvironment();
    logSuccess('Environment validation passed');

    // Get existing Git branches
    const existingBranches = getGitBranches();
    logSuccess(`Found ${existingBranches.length} existing branches`);

    // Fetch all deployments
    const deployments = await fetchAllDeployments();

    if (deployments.length === 0) {
      logInfo('No deployments found. Nothing to clean up.');
      return;
    }

    // Find orphaned deployments
    const orphanedDeployments = findOrphanedDeployments(deployments, existingBranches);

    if (orphanedDeployments.length === 0) {
      logSuccess('No orphaned preview deployments found. All clean!');
      return;
    }

    // Show summary
    log('\n📊 Summary:', 'magenta');
    log(`Total deployments: ${deployments.length}`, 'white');
    log(`Orphaned preview deployments: ${orphanedDeployments.length}`, 'white');
    log(`Existing branches: ${existingBranches.length}`, 'white');

    // Delete orphaned deployments
    await deleteDeploymentsBatch(orphanedDeployments, dryRun);

    log('\n🎉 Cleanup completed successfully!', 'green');

  } catch (error) {
    logError(`Script failed: ${error.message}`);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logError(`Uncaught exception: ${error.message}`);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logError(`Unhandled rejection at ${promise}: ${reason}`);
  process.exit(1);
});

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  main,
  getGitBranches,
  fetchAllDeployments,
  findOrphanedDeployments,
  deleteDeployment
};