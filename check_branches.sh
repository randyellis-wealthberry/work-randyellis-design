#!/bin/bash

# Stash any uncommitted changes
git stash push -m "temp stash for branch checks"

# Get all local branches except main
branches=$(git branch | grep -v "main" | sed 's/* //')

echo "Branches to check: $branches"

for branch in $branches; do
  echo "Starting checks for branch: $branch"
  git checkout $branch
  if npm run build; then
    echo "Build successful for $branch"
  else
    echo "Build failed for $branch"
  fi
  if npm run lint; then
    echo "Lint successful for $branch"
  else
    echo "Lint failed for $branch"
  fi
  if npx tsc --noEmit; then
    echo "Typecheck successful for $branch"
  else
    echo "Typecheck failed for $branch"
  fi
  echo "Completed checks for $branch"
done

# Restore stashed changes
git stash pop

echo "All branch checks completed"