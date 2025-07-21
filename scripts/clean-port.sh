#!/bin/bash

# Port cleanup script for development
# Kills any process running on port 3000 and other common dev ports

PORT=${1:-3000}
PORTS_TO_CLEAN=(3000 3001 3002 3003 8000 8080 5000 5173 4000 4173)

echo "🧹 Cleaning up development ports..."

# Function to kill processes on a specific port
kill_port() {
    local port=$1
    echo "🔍 Checking port $port..."
    
    # Find processes using the port
    local pids=$(lsof -ti:$port 2>/dev/null)
    
    if [ -n "$pids" ]; then
        echo "⚠️  Found processes on port $port: $pids"
        echo "🔪 Killing processes..."
        echo $pids | xargs kill -9 2>/dev/null
        echo "✅ Port $port cleaned"
    else
        echo "✨ Port $port is already free"
    fi
}

# Clean specific port if provided as argument
if [ $# -eq 1 ]; then
    kill_port $PORT
else
    # Clean all common development ports
    for port in "${PORTS_TO_CLEAN[@]}"; do
        kill_port $port
    done
fi

# Additional cleanup for common dev server processes
echo "🔍 Cleaning up development server processes..."

# Kill Next.js dev servers
pkill -f "next.*dev" 2>/dev/null && echo "🔪 Killed Next.js dev servers"

# Kill npm/yarn/pnpm dev processes
pkill -f "npm.*dev\|yarn.*dev\|pnpm.*dev" 2>/dev/null && echo "🔪 Killed package manager dev processes"

# Kill Vite dev servers
pkill -f "vite.*dev\|vite.*serve" 2>/dev/null && echo "🔪 Killed Vite dev servers"

# Kill webpack dev servers
pkill -f "webpack.*serve\|webpack-dev-server" 2>/dev/null && echo "🔪 Killed Webpack dev servers"

echo ""
echo "🎉 Port cleanup complete! Port 3000 is ready for your dev server."
echo ""
echo "Usage:"
echo "  ./scripts/clean-port.sh          # Clean all common dev ports"
echo "  ./scripts/clean-port.sh 3000     # Clean specific port"
echo ""