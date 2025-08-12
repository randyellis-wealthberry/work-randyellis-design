#!/bin/bash

# Deploy to Vercel with feature flags
# Usage: ./scripts/deploy-with-flags.sh [environment] [flags...]
# Example: ./scripts/deploy-with-flags.sh preview experimentalAnimations=true

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default environment
ENVIRONMENT=${1:-preview}

echo -e "${BLUE}🏳️  Portfolio Feature Flags Deployment${NC}"
echo -e "${YELLOW}Environment: $ENVIRONMENT${NC}"
echo ""

# Build the Vercel command
VERCEL_CMD="vercel"

# Add production flag if needed
if [ "$ENVIRONMENT" = "production" ] || [ "$ENVIRONMENT" = "prod" ]; then
    VERCEL_CMD="$VERCEL_CMD --prod"
    echo -e "${RED}⚠️  PRODUCTION DEPLOYMENT${NC}"
    echo -e "${RED}This will affect all users. Continue? (y/N)${NC}"
    read -r confirm
    if [ "$confirm" != "y" ]; then
        echo "Deployment cancelled."
        exit 1
    fi
fi

# Process feature flags
echo -e "${GREEN}Feature Flags:${NC}"
shift # Remove environment from arguments

if [ $# -eq 0 ]; then
    echo "  No custom flags specified (using defaults)"
else
    for flag in "$@"; do
        if [[ $flag == *"="* ]]; then
            # Split flag=value
            IFS='=' read -r key value <<< "$flag"
            
            # Convert camelCase to SNAKE_CASE for env var
            ENV_VAR="NEXT_PUBLIC_"
            
            # Handle the conversion
            case "$key" in
                experimentalAnimations) ENV_VAR="${ENV_VAR}EXPERIMENTAL_ANIMATIONS" ;;
                maintenanceMode) ENV_VAR="${ENV_VAR}MAINTENANCE_MODE" ;;
                newProjectShowcase) ENV_VAR="${ENV_VAR}NEW_PROJECT_SHOWCASE" ;;
                newsletterEnabled) ENV_VAR="${ENV_VAR}NEWSLETTER_ENABLED" ;;
                analyticsEnhanced) ENV_VAR="${ENV_VAR}ANALYTICS_ENHANCED" ;;
                betaFeatures) ENV_VAR="${ENV_VAR}BETA_FEATURES" ;;
                performanceMode) ENV_VAR="${ENV_VAR}PERFORMANCE_MODE" ;;
                *) 
                    echo -e "${RED}Unknown flag: $key${NC}"
                    exit 1
                    ;;
            esac
            
            VERCEL_CMD="$VERCEL_CMD --build-env $ENV_VAR=$value"
            
            # Display with color based on value
            if [ "$value" = "true" ]; then
                echo -e "  ${GREEN}✓${NC} $key: ${GREEN}enabled${NC}"
            else
                echo -e "  ${RED}✗${NC} $key: ${RED}disabled${NC}"
            fi
        fi
    done
fi

echo ""
echo -e "${YELLOW}Deploying...${NC}"
echo -e "${BLUE}Command: $VERCEL_CMD${NC}"
echo ""

# Execute the deployment
eval $VERCEL_CMD

echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Check the deployment URL above"
echo "2. Verify feature flags are working as expected"
echo "3. Monitor analytics for any issues"

# If in preview, suggest production deployment
if [ "$ENVIRONMENT" != "production" ] && [ "$ENVIRONMENT" != "prod" ]; then
    echo ""
    echo -e "${YELLOW}To deploy to production with these flags:${NC}"
    echo "./scripts/deploy-with-flags.sh production $@"
fi