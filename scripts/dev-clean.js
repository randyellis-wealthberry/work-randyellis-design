#!/usr/bin/env node

const { exec, spawn } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

const PORT = 3000;

async function killPort(port) {
  try {
    console.log(`🔍 Checking for processes on port ${port}...`);
    
    // Find processes using the port
    const { stdout } = await execAsync(`lsof -ti:${port}`);
    const pids = stdout.trim().split('\n').filter(pid => pid);
    
    if (pids.length === 0) {
      console.log(`✅ Port ${port} is available`);
      return;
    }
    
    console.log(`🚫 Found ${pids.length} process(es) on port ${port}`);
    
    // Kill each process
    for (const pid of pids) {
      console.log(`   Killing PID ${pid}...`);
      await execAsync(`kill -9 ${pid}`);
    }
    
    console.log(`✅ Cleared port ${port}`);
    
    // Wait a moment for the port to be fully released
    await new Promise(resolve => setTimeout(resolve, 1000));
    
  } catch (error) {
    // If lsof command fails, the port is likely available
    if (error.message.includes('command not found')) {
      console.log('⚠️  lsof not found, assuming port is available');
    } else if (error.code === 1) {
      console.log(`✅ Port ${port} is available`);
    } else {
      console.log(`⚠️  Error checking port: ${error.message}`);
    }
  }
}

async function startDevServer() {
  console.log('🚀 Starting Next.js development server...');
  
  const nextProcess = spawn('npx', ['next', 'dev', '-p', PORT.toString()], {
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down development server...');
    nextProcess.kill('SIGINT');
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    nextProcess.kill('SIGTERM');
    process.exit(0);
  });
}

async function main() {
  console.log('🧹 Starting clean development server setup...\n');
  
  await killPort(PORT);
  console.log('');
  await startDevServer();
}

main().catch(error => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});