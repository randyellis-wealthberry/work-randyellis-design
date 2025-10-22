# Vercel Deployment Cleanup Guide

## Overview

The Vercel Deployment Cleanup script automatically removes preview deployments for branches that have been merged or deleted. This helps keep your Vercel dashboard clean and reduces unnecessary resource usage.

## Features

- ✅ **Fully Automated**: No interactive prompts - runs completely unattended
- ✅ **Safe**: Multiple safeguards prevent accidental production deployment deletion
- ✅ **Git-Aware**: Checks both local and remote branch existence
- ✅ **Batch Processing**: Processes deployments in batches to avoid rate limits
- ✅ **Comprehensive Logging**: Detailed output of all actions and decisions
- ✅ **Dry Run Mode**: Test what would be deleted without actually deleting
- ✅ **Error Handling**: Robust error management with meaningful messages

## Prerequisites

1. **Node.js** (v14 or higher)
2. **Git** installed and available in PATH
3. **Vercel API Token** with appropriate permissions
4. **Git repository** with Vercel project connected

## Setup

### 1. Get Vercel API Token

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to **Settings** → **Tokens**
3. Create a new token with **deployment deletion** permissions
4. Copy the token for environment setup

### 2. Set Environment Variables

```bash
# Required: Your Vercel API token
export VERCEL_BEARER_TOKEN="your_token_here"

# Optional: Team ID for team projects
export VERCEL_TEAM_ID="your_team_id_here"
```

For persistent setup, add to your shell profile (`.bashrc`, `.zshrc`, etc.):

```bash
echo 'export VERCEL_BEARER_TOKEN="your_token_here"' >> ~/.bashrc
source ~/.bashrc
```

### 3. Make Script Executable

```bash
chmod +x scripts/clean-vercel-deployments.js
```

## Usage

### Basic Commands

```bash
# Dry run - see what would be deleted without actually deleting
npm run clean:vercel:dry-run

# Actually delete orphaned deployments
npm run clean:vercel

# Or run directly
node scripts/clean-vercel-deployments.js --dry-run
node scripts/clean-vercel-deployments.js
```

### Command Line Options

| Option | Description |
|--------|-------------|
| `--dry-run` | Show what would be deleted without actually deleting |
| (no flags) | Perform actual deletion of orphaned deployments |

## What Gets Cleaned Up

The script identifies and removes deployments that meet ALL of these criteria:

1. ✅ **Preview Deployment** (not production)
2. ✅ **Branch No Longer Exists** (checked locally and remotely)
3. ✅ **Has Branch Metadata** (can identify the source branch)
4. ✅ **Not Main/Master** (never deletes main/master branches)

### Safety Exclusions

The script will NEVER delete:
- 🚫 Production deployments (`target: "production"`)
- 🚫 Main/master branch deployments
- 🚫 Deployments without branch metadata
- 🚫 Deployments for existing branches

## Example Output

### Dry Run Mode
```
🧹 Vercel Deployment Cleanup Script
=====================================
⚠️  DRY RUN MODE: No actual deletions will be performed
✅ Environment validation passed
✅ Found 12 existing branches
ℹ️  Fetching deployments from Vercel...
ℹ️  Fetched 45 deployments (total: 45)
ℹ️  Analyzing deployments for orphaned branches...
ℹ️  Found orphaned deployment: dpl_abc123 (branch: feature/old-branch)
ℹ️  Found orphaned deployment: dpl_def456 (branch: hotfix/merged-fix)
ℹ️  Found 2 orphaned preview deployments

📊 Summary:
Total deployments: 45
Orphaned preview deployments: 2
Existing branches: 12

⚠️  DRY RUN: Would delete the following deployments:
  - dpl_abc123 (https://my-app-abc123.vercel.app) - Branch: feature/old-branch
  - dpl_def456 (https://my-app-def456.vercel.app) - Branch: hotfix/merged-fix
```

### Actual Deletion
```
🧹 Vercel Deployment Cleanup Script
=====================================
✅ Environment validation passed
✅ Found 12 existing branches
ℹ️  Fetching deployments from Vercel...
ℹ️  Fetched 45 deployments (total: 45)
ℹ️  Analyzing deployments for orphaned branches...
ℹ️  Found 2 orphaned preview deployments

📊 Summary:
Total deployments: 45
Orphaned preview deployments: 2
Existing branches: 12

ℹ️  Deleting 2 orphaned deployments...
ℹ️  Processing batch 1/1
✅ Deleted deployment dpl_abc123 (https://my-app-abc123.vercel.app)
✅ Deleted deployment dpl_def456 (https://my-app-def456.vercel.app)
✅ Deletion complete: 2 successful, 0 failed

🎉 Cleanup completed successfully!
```

## Automation

### GitHub Actions

Create `.github/workflows/vercel-cleanup.yml`:

```yaml
name: Vercel Cleanup

on:
  schedule:
    # Run daily at 2 AM UTC
    - cron: '0 2 * * *'
  workflow_dispatch:

jobs:
  cleanup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run Vercel Cleanup
        env:
          VERCEL_BEARER_TOKEN: ${{ secrets.VERCEL_BEARER_TOKEN }}
          VERCEL_TEAM_ID: ${{ secrets.VERCEL_TEAM_ID }}
        run: npm run clean:vercel
```

### Cron Job

Add to your crontab (`crontab -e`):

```bash
# Run daily at 2 AM
0 2 * * * cd /path/to/your/project && npm run clean:vercel
```

## Troubleshooting

### Common Issues

#### "VERCEL_BEARER_TOKEN environment variable is required"
```bash
export VERCEL_BEARER_TOKEN="your_token_here"
```

#### "Not in a Git repository"
Ensure you're running the script from within a Git repository.

#### "Git is required but not found in PATH"
Install Git or ensure it's available in your PATH.

#### "Failed to fetch deployments: HTTP 401"
Your API token may be expired or invalid. Generate a new token from Vercel dashboard.

#### "Failed to fetch deployments: HTTP 403"
Your token doesn't have sufficient permissions. Ensure it has deployment deletion permissions.

### Debug Mode

For additional debugging, you can modify the script to add more verbose logging or run with Node.js debug flag:

```bash
DEBUG=* node scripts/clean-vercel-deployments.js --dry-run
```

## API Rate Limits

The script processes deployments in batches of 10 with a 1-second delay between batches to respect Vercel's API rate limits. If you encounter rate limiting, the script will automatically retry.

## Security Considerations

- 🔒 **Token Security**: Never commit your API token to version control
- 🔒 **Permissions**: Use minimum required permissions for your API token
- 🔒 **Team Access**: Only run with appropriate team permissions
- 🔒 **Audit Trail**: All actions are logged for audit purposes

## Contributing

To modify the script:

1. Test changes with `--dry-run` first
2. Add appropriate logging for new features
3. Update this documentation
4. Test with various scenarios (no deployments, all deployments clean, etc.)

## Support

If you encounter issues:

1. Check environment variables are set correctly
2. Verify your Vercel API token permissions
3. Ensure you're in a Git repository
4. Run with `--dry-run` to test behavior
5. Check the logs for specific error messages

## Version History

- **v1.0.0**: Initial release with automated cleanup functionality
  - Git branch detection
  - Batch processing
  - Dry run mode
  - Comprehensive logging
  - Safety checks