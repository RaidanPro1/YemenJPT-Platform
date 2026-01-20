#!/bin/bash

# =======================================================
# 🇾🇪 YemenJPT Platform Deployment Script (V15.0)
# =======================================================
# This script builds and launches the core YemenJPT
# application stack using Docker Compose. Use this
# for updates after running the main install.sh script.
# =======================================================

set -e # Exit immediately if a command fails.

# --- Terminal Colors ---
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}>>> Starting YemenJPT Platform Deployment/Update...${NC}"

# --- 1. Environment Check ---
echo -e "⚙️ [1/3] Checking for .env configuration file..."
if [ ! -f .env ]; then
    echo -e "${RED}❌ ERROR: .env file not found. Please copy .env.example to .env and fill in your details before running this script.${NC}"
    exit 1
fi
echo -e "   ${GREEN}✅ .env file found.${NC}"
export $(cat .env | sed 's/#.*//g' | xargs)

# --- 2. Build and Launch Containers ---
echo -e "🐳 [2/3] Building and launching services with Docker Compose from /opt/presshouse..."
if [ ! -f /opt/presshouse/docker-compose.yml ]; then
    echo -e "${RED}❌ ERROR: /opt/presshouse/docker-compose.yml not found. Please run the main install.sh script first.${NC}"
    exit 1
fi
cd /opt/presshouse
docker compose up -d --build --remove-orphans

# --- 3. Finalizing ---
echo -e "🚀 [3/3] Deployment process initiated."
echo ""
echo -e "${GREEN}======================================================================="
echo -e "✅ YemenJPT Platform deployment/update complete!"
echo -e "=======================================================================${NC}"
echo "💡 To see live logs, run: 'cd /opt/presshouse && docker compose logs -f'"
echo "💡 To stop the services, run: 'cd /opt/presshouse && docker compose down'"
echo "=======================================================================${NC}
