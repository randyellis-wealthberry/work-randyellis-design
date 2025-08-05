#!/bin/bash

# Claude Code Health Check Script
# Monitors for common issues and provides proactive warnings

echo "🔍 Claude Code Health Check"
echo "=============================="

# Check 1: Configuration file size
config_file="$HOME/.claude.json"
if [ -f "$config_file" ]; then
    file_size=$(stat -f%z "$config_file" 2>/dev/null || stat -c%s "$config_file" 2>/dev/null)
    file_size_kb=$((file_size / 1024))
    
    echo "📁 Configuration file size: ${file_size_kb}KB"
    
    if [ "$file_size_kb" -gt 50 ]; then
        echo "⚠️  WARNING: Configuration file is large (${file_size_kb}KB)"
        echo "   Consider cleaning old project data to improve performance"
        echo "   Recommended: Keep under 10KB"
    else
        echo "✅ Configuration file size is healthy"
    fi
else
    echo "❌ Configuration file not found at $config_file"
fi

echo ""

# Check 2: Claude binary and symlink status
echo "🔗 Binary status:"
claude_bin="/usr/local/bin/claude"
if [ -L "$claude_bin" ]; then
    target=$(readlink "$claude_bin")
    echo "   Symlink: $claude_bin -> $target"
    
    if [ -f "$claude_bin" ]; then
        echo "✅ Symlink and target are valid"
    else
        echo "❌ Symlink target is missing or invalid"
    fi
else
    echo "❌ Claude symlink not found at $claude_bin"
fi

# Check 3: Version information
echo ""
echo "📦 Version information:"
if command -v claude >/dev/null 2>&1; then
    version=$(claude --version 2>/dev/null)
    if [ $? -eq 0 ]; then
        echo "✅ Claude version: $version"
    else
        echo "⚠️  Claude binary exists but version check failed"
        echo "   This may indicate terminal/stdin issues"
    fi
else
    echo "❌ Claude command not found in PATH"
fi

# Check 4: Environment detection
echo ""
echo "🖥️  Environment:"
if [ -n "$CLAUDECODE" ]; then
    echo "⚠️  Running inside Claude Code session (CLAUDECODE=$CLAUDECODE)"
    echo "   Interactive commands may fail due to stdin conflicts"
fi

if [ "$TERM_PROGRAM" = "vscode" ]; then
    echo "🔧 Running in VS Code terminal"
    echo "   Use Terminal.app for updates and doctor commands"
fi

# Check 5: Project count in config
echo ""
echo "📂 Project configurations:"
if [ -f "$config_file" ]; then
    # Count project entries using jq if available, otherwise approximate
    if command -v jq >/dev/null 2>&1; then
        project_count=$(jq '.projects | length' "$config_file" 2>/dev/null || echo "unknown")
        echo "   Active projects: $project_count"
        
        if [ "$project_count" != "unknown" ] && [ "$project_count" -gt 10 ]; then
            echo "⚠️  Many projects configured ($project_count)"
            echo "   Consider cleaning inactive project configurations"
        fi
    else
        echo "   (Install jq for detailed project analysis)"
    fi
fi

echo ""
echo "💡 Recommendations:"
echo "   • Run updates in Terminal.app with: sudo npm install -g @anthropic-ai/claude-code@latest"
echo "   • Keep configuration file under 10KB for best performance"
echo "   • Avoid running claude doctor from within Claude Code sessions"
echo "   • Check CLAUDE.md for detailed usage guidelines"

echo ""
echo "Health check complete! 🎉"