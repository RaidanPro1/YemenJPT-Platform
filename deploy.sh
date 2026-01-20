#!/bin/bash

# =======================================================
# 🇾🇪 YemenJPT Platform Deployment Script (V15.0)
# =======================================================
# This script builds and launches the core YemenJPT
# application stack using Docker Compose.
# =======================================================

set -e # Exit immediately if a command fails.

# --- Terminal Colors ---
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}>>> Starting YemenJPT Platform Deployment...${NC}"

# --- 1. Environment Check ---
echo -e "⚙️ [1/3] Checking for .env configuration file..."
if [ ! -f .env ]; then
    echo -e "${RED}❌ ERROR: .env file not found. Please copy .env.example to .env and fill in your details before running this script.${NC}"
    exit 1
fi
echo -e "   ${GREEN}✅ .env file found.${NC}"
export $(cat .env | sed 's/#.*//g' | xargs)

# --- 2. Build and Launch Containers ---
echo -e "🐳 [2/3] Building and launching services with Docker Compose..."
echo -e "   This may take a few minutes on the first run..."
docker compose up -d --build --remove-orphans

# --- 3. Finalizing ---
echo -e "🚀 [3/3] Deployment process initiated."
echo -e "   Services are starting in the background."
echo -e "   Run 'docker compose ps' to check the status of your containers."
echo ""
echo -e "${GREEN}======================================================================="
echo -e "✅ YemenJPT Platform deployment complete!"
echo -e "=======================================================================${NC}"
echo "🔗 Your application should be accessible shortly."
echo "   Please ensure your reverse proxy is configured to point to the frontend service."
echo ""
echo "💡 To see live logs, run: 'docker compose logs -f'"
echo "💡 To stop the services, run: 'docker compose down'"
echo "=======================================================================${NC}"