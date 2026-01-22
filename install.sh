#!/bin/bash

# ============================================================
# 🇾🇪 YemenJPT & Press House Ecosystem (V18.0 - Intelligence Engineering Edition)
# ============================================================

set -e # Exit immediately if a command exits with a non-zero status.

# --- Terminal Colors ---
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# --- Global Variables ---
REPO_DIR=$(cd "$(dirname "$0")" && pwd)
BASE_DIR="/opt/presshouse"

print_header() {
    echo -e "${GREEN}>>> Initializing YemenJPT Platform Automated Installation (V18.0)...${NC}"
    echo ""
}

check_root() {
    if [ "$EUID" -ne 0 ]; then
        echo -e "${RED}❌ This script must be run as root. Please use 'sudo ./install.sh'${NC}"
        exit 1
    fi
}

check_env() {
    echo -e "${BLUE}⚙️ [1/7] Verifying environment configuration...${NC}"
    if [ ! -f "${REPO_DIR}/.env" ]; then
        echo -e "${RED}❌ CRITICAL: .env file not found. Please copy .env.example to .env and fill in your details.${NC}"
        exit 1
    fi

    export $(cat "${REPO_DIR}/.env" | sed 's/#.*//g' | xargs)

    local required_vars=(DOMAIN CLOUDFLARE_TUNNEL_TOKEN UNIFIED_PASS)
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            echo -e "${RED}❌ CRITICAL: Required variable '$var' is not set in the .env file. Installation aborted.${NC}"
            exit 1
        fi
    done
    echo "   ✅ Environment variables loaded successfully."
}

prepare_system() {
    echo -e "${BLUE}🛠️ [2/7] Preparing server and installing dependencies...${NC}"
    export DEBIAN_FRONTEND=noninteractive
    apt-get update > /dev/null
    apt-get install -y curl git docker-ce docker-ce-cli containerd.io docker-compose-plugin ufw > /dev/null || {
        echo "   -> Dependency installation failed, trying with Docker's official script..."
        curl -fsSL https://get.docker.com -o get-docker.sh
        sh get-docker.sh
        rm get-docker.sh
        systemctl enable --now docker
    }
    echo "   ✅ System dependencies and Docker are installed."
}

create_directories() {
    echo -e "${BLUE}📂 [3/7] Creating persistent data directories...${NC}"
    mkdir -p "${BASE_DIR}/data/postgres"
    mkdir -p "${BASE_DIR}/data/mariadb"
    mkdir -p "${BASE_DIR}/data/ollama"
    mkdir -p "${BASE_DIR}/data/open-webui"
    mkdir -p "${BASE_DIR}/data/qdrant"
    mkdir -p "${BASE_DIR}/data/libretranslate"
    mkdir -p "${BASE_DIR}/data/mattermost/config" "${BASE_DIR}/data/mattermost/data" "${BASE_DIR}/data/mattermost/logs"
    mkdir -p "${BASE_DIR}/data/nextcloud"
    mkdir -p "${BASE_DIR}/data/webtop_config"
    mkdir -p "${BASE_DIR}/data/searxng"
    mkdir -p "${BASE_DIR}/data/spiderfoot"
    mkdir -p "${BASE_DIR}/data/changedetection"
    mkdir -p "${BASE_DIR}/data/ghost"
    mkdir -p "${BASE_DIR}/data/civicrm_files"
    mkdir -p "${BASE_DIR}/cloudflare"
    mkdir -p "${BASE_DIR}/internal_proxy"
    mkdir -p "${BASE_DIR}/frontend/dist"
    mkdir -p "${BASE_DIR}/decoy"
    echo "   ✅ All data directories created in ${BASE_DIR}."
}

generate_configs() {
    echo -e "${BLUE}📝 [4/7] Generating dynamic configurations...${NC}"

    # Copy primary docker-compose and .env
    cp "${REPO_DIR}/docker-compose.yml" "${BASE_DIR}/docker-compose.yml"
    cp "${REPO_DIR}/.env" "${BASE_DIR}/.env"

    # Copy Cloudflare and Nginx proxy configs
    cp "${REPO_DIR}/cloudflare/config.yml" "${BASE_DIR}/cloudflare/config.yml"
    
    # Copy Dashy dashboard configurations
    cp "${REPO_DIR}/dashy-admin.yml" "${BASE_DIR}/dashy-admin.yml"
    cp "${REPO_DIR}/dashy-journalist.yml" "${BASE_DIR}/dashy-journalist.yml"
    cp "${REPO_DIR}/dashy-verifier.yml" "${BASE_DIR}/dashy-verifier.yml"

    # Copy security scripts
    cp "${REPO_DIR}/panic.sh" "${BASE_DIR}/panic.sh"
    cp "${REPO_DIR}/secure.sh" "${BASE_DIR}/secure.sh"
    chmod +x "${BASE_DIR}/panic.sh" "${BASE_DIR}/secure.sh"
    
    # Create default Nginx config for the internal proxy
    cat > "${BASE_DIR}/internal_proxy/nginx.conf" << EOL
events {}
http {
    server {
        listen 80;
        location / {
            proxy_pass http://yemenjpt_app:80;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }
        
        location /api/ {
            proxy_pass http://backend:3000/;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
        }
    }
}
EOL

    # Create a placeholder index for the main app
    cat > "${BASE_DIR}/frontend/dist/index.html" << EOL
<!DOCTYPE html>
<html>
<head><title>YemenJPT</title></head>
<body><h1>YemenJPT Frontend is loading...</h1></body>
</html>
EOL

    # Create the decoy index file
    cat > "${BASE_DIR}/decoy/index.html" << EOL
<!DOCTYPE html>
<html>
<head><title>Under Maintenance</title></head>
<body style="font-family: sans-serif; text-align: center; padding-top: 50px;">
  <h1>Service Temporarily Unavailable</h1>
  <p>This service is currently undergoing maintenance. Please check back later.</p>
</body>
</html>
EOL

    echo "   ✅ Configurations generated."
}

launch_services() {
    echo -e "${BLUE}🚀 [5/7] Launching all platform services via Docker Compose...${NC}"
    echo "   (This may take several minutes on the first run as images are downloaded)"
    
    cd "${BASE_DIR}"
    docker compose up -d --build --remove-orphans
    echo "   ✅ Services are starting in the background."
}

configure_firewall() {
    echo -e "${BLUE}🛡️ [6/7] Activating security firewall (UFW)...${NC}"
    ufw allow 22/tcp > /dev/null # Allow only SSH
    ufw --force enable > /dev/null
    echo "   ✅ Firewall configured to ALLOW port 22/tcp and DENY all other incoming traffic."
}

print_summary() {
    echo -e "${GREEN}======================================================================="
    echo -e "✅ YemenJPT Platform Installation Completed Successfully!"
    echo -e "=======================================================================${NC}"
    echo "All services are running securely behind a Cloudflare Tunnel."
    echo "No ports are open on this server except for SSH."
    echo ""
    echo "🔗 Main App:           https://ai.${DOMAIN}"
    echo "🔗 Journalist Portal:  https://portal.${DOMAIN}"
    echo "🔗 Admin Portal:       https://sys.${DOMAIN}"
    echo "🔗 Verifier Portal:    https://verifier.${DOMAIN}"
    echo ""
    echo "🔗 AI Web UI:          https://ai-ui.${DOMAIN}"
    echo "🔗 Identity Provider:  https://auth.${DOMAIN}"
    echo "🔗 Team Chat:          https://chat.${DOMAIN}"
    echo "🔗 Secure Files:       https://files.${DOMAIN}"
    echo ""
    echo -e "${GREEN}-----------------------------------------------------------------------"
    echo "💡 To see live logs, run: 'cd ${BASE_DIR} && docker compose logs -f'"
    echo "💡 To stop all services, run: 'cd ${BASE_DIR} && docker compose down'"
    echo "💡 To activate panic mode, run: '${BASE_DIR}/panic.sh'"
    echo "=======================================================================${NC}"
}

# --- Main Execution ---
main() {
    check_root
    print_header
    check_env
    prepare_system
    create_directories
    generate_configs
    launch_services
    configure_firewall
    print_summary
}

main
