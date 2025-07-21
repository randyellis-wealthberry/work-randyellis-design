# Development Scripts

## Port Cleanup Script

The `clean-port.sh` script automatically kills processes on common development ports to ensure your dev server can start without port conflicts.

### Usage

**Via npm scripts (recommended):**

```bash
# Clean ports and start dev server
npm run dev

# Just clean ports
npm run clean-port

# Clean specific port
npm run clean-port-specific 3000
```

**Direct script usage:**

```bash
# Clean all common dev ports
./scripts/clean-port.sh

# Clean specific port
./scripts/clean-port.sh 3000
```

### What it does

1. **Kills processes on common dev ports:**
   - 3000, 3001, 3002, 3003 (Next.js, React, etc.)
   - 8000, 8080 (Various dev servers)
   - 5000, 5173 (Vite, Flask, etc.)
   - 4000, 4173 (Other dev servers)

2. **Cleans up development server processes:**
   - Next.js dev servers (`next dev`)
   - Package manager dev processes (`npm/yarn/pnpm dev`)
   - Vite dev servers
   - Webpack dev servers

3. **Safe operation:**
   - Only kills development-related processes
   - Shows what it's doing with clear output
   - Handles errors gracefully

### Integration

The script is automatically integrated into the main `dev` command, so running `npm run dev` will:

1. Clean up any existing development servers
2. Start the Next.js development server on port 3000

This ensures you never get "port already in use" errors when starting development.
