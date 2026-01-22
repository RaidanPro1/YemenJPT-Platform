#!/bin/bash

# ============================================================
# 🇾🇪 YemenJPT & Press House Ecosystem (V15.0 - Automated Installer)
# ============================================================
# This script automates the full deployment of the YemenJPT platform
# and its comprehensive suite of services on a fresh Ubuntu 24.04 LTS server.
# It is designed to be idempotent; you can run it multiple times safely.
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
    echo -e "${BLUE}"
    echo "██    ██ ███████ ███    ███ ███████ ███    ██      ██ ██████  ████████ "
    echo " ██  ██  ██      ████  ████ ██      ████   ██      ██ ██   ██    ██    "
    echo "  ████   █████   ██ ████ ██ █████   ██ ██  ██      ██ ██████     ██    "
    echo "   ██    ██      ██  ██  ██ ██      ██  ██ ██ ██   ██ ██         ██    "
    echo "   ██    ███████ ██      ██ ███████ ██   ████  █████  ██         ██    "
    echo -e "${NC}"
    echo -e "${GREEN}>>> Initializing YemenJPT Platform Automated Installation (V15.0 on Ubuntu 24.04)...${NC}"
    echo ""
}

check_root() {
    if [ "$EUID" -ne 0 ]; then
        echo -e "${RED}❌ This script must be run as root. Please use 'sudo ./install.sh'${NC}"
        exit 1
    fi
}

check_env() {
    echo -e "${BLUE}⚙️ [1/9] Verifying environment configuration...${NC}"
    if [ ! -f "${REPO_DIR}/.env" ]; then
        echo -e "${RED}❌ CRITICAL: .env file not found. Please copy .env.example to .env and fill in your details.${NC}"
        exit 1
    fi

    export $(cat "${REPO_DIR}/.env" | sed 's/#.*//g' | xargs)

    local required_vars=(DOMAIN SERVER_IP CF_TOKEN CF_EMAIL)
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            echo -e "${RED}❌ CRITICAL: Required variable '$var' is not set in the .env file. Installation aborted.${NC}"
            exit 1
        fi
    done
    echo "   ✅ Environment variables loaded successfully."
}

prepare_system() {
    echo -e "${BLUE}🛠️ [2/9] Preparing server and installing dependencies...${NC}"
    export DEBIAN_FRONTEND=noninteractive
    apt-get update > /dev/null
    apt-get install -y curl git unzip htop jq software-properties-common ca-certificates ufw > /dev/null

    if ! command -v docker &> /dev/null; then
        echo "   -> Docker not found. Installing Docker Engine..."
        install -m 0755 -d /etc/apt/keyrings
        curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
        chmod a+r /etc/apt/keyrings/docker.asc
        echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
        apt-get update > /dev/null
        apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin > /dev/null
        systemctl enable --now docker
        echo "   ✅ Docker installed and started."
    else
        echo "   ✅ Docker is already installed."
    fi
}

configure_dns() {
    echo -e "${BLUE}☁️ [3/9] Automating DNS records via Cloudflare...${NC}"
    
    update_dns_record() {
        local name=$1; local type=$2; local content=$3; local proxied=${4:-true}
        
        # Check if record exists
        local record_id=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/dns_records?type=${type}&name=${name}" \
            -H "Authorization: Bearer ${CF_TOKEN}" -H "Content-Type: application/json" | jq -r ".result[0].id")

        if [ "$record_id" != "null" ]; then
            echo "   -> DNS record for ${name} already exists. Skipping."
        else
            # Create record
            local response=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/dns_records" \
                -H "Authorization: Bearer ${CF_TOKEN}" -H "Content-Type: application/json" \
                --data "{\"type\":\"${type}\",\"name\":\"${name}\",\"content\":\"${content}\",\"ttl\":1,\"proxied\":${proxied}}")
            
            if [[ $(echo "$response" | jq -r '.success') == "true" ]]; then
                echo "   ✅ DNS record created for ${name}."
            else
                echo -e "${RED}   ❌ Failed to create DNS record for ${name}. Error: $(echo "$response" | jq -r '.errors[0].message')${NC}"
            fi
        fi
    }

    local subdomains=(
        "${DOMAIN}:A:${SERVER_IP}:true" "www:CNAME:${DOMAIN}:true" "ai:CNAME:${DOMAIN}:true" "portal:CNAME:${DOMAIN}:true"
        "auto:CNAME:${DOMAIN}:true" "git:CNAME:${DOMAIN}:true" "tools:CNAME:${DOMAIN}:true" "status:CNAME:${DOMAIN}:true" 
        "watch:CNAME:${DOMAIN}:true" "data:CNAME:${DOMAIN}:true" "chat:CNAME:${DOMAIN}:true" "pass:CNAME:${DOMAIN}:true" 
        "archive:CNAME:${DOMAIN}:true" "search:CNAME:${DOMAIN}:true" "sys:CNAME:${DOMAIN}:true" "glances:CNAME:${DOMAIN}:true" 
        "cms:CNAME:${DOMAIN}:true" "map-report:CNAME:${DOMAIN}:true" "osint-auto:CNAME:${DOMAIN}:true" "analyzer:CNAME:${DOMAIN}:true" 
        "gis-server:CNAME:${DOMAIN}:true" "web-rec:CNAME:${DOMAIN}:true" "publish:CNAME:${DOMAIN}:true" "maps:CNAME:${DOMAIN}:true"
        "crypto:CNAME:${DOMAIN}:true" "dispatch:CNAME:${DOMAIN}:true" "check:CNAME:${DOMAIN}:true" "erp:CNAME:${DOMAIN}:true"
        "loki:CNAME:${DOMAIN}:true" "aletheia:CNAME:${DOMAIN}:true"
    )
    for record in "${subdomains[@]}"; do IFS=':' read -r name type content proxied <<< "$record"; update_dns_record "$name" "$type" "$content" "$proxied"; done
}

create_directories() {
    echo -e "${BLUE}📂 [4/9] Creating persistent data directories...${NC}"
    local dirs=( traefik backend )
    for dir in "${dirs[@]}"; do
        mkdir -p "${BASE_DIR}/${dir}"
    done
    echo "   ✅ All data directories created in ${BASE_DIR}."
}

generate_configs() {
    echo -e "${BLUE}📝 [5/9] Generating dynamic configurations and Dockerfiles...${NC}"

    # Nginx config for frontend (Angular app)
    # This config proxies /api/ requests to the backend container.
    cat > ${BASE_DIR}/nginx.conf <<EOF
server {
    listen 80;
    server_name ${DOMAIN} www.${DOMAIN} ai.${DOMAIN};
    root /usr/share/nginx/html;
    index index.html;
    
    location / { 
        try_files \$uri \$uri/ /index.html; 
    }
    
    # Proxy API requests to the backend service
    location /api/ {
        proxy_pass http://ph-backend:3000/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    }
}
EOF

    # Backend Dockerfile & source code
    cp -r ${REPO_DIR}/backend/* ${BASE_DIR}/backend/
    cat > ${BASE_DIR}/backend/Dockerfile <<EOF
FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD [ "node", "server.js" ]
EOF
    
    # Traefik secure ACME file
    touch ${BASE_DIR}/traefik/acme.json && chmod 600 ${BASE_DIR}/traefik/acme.json
    
    echo "   ✅ Configurations generated."
}

generate_compose_file() {
    echo -e "${BLUE}🐳 [6/9] Generating comprehensive Docker Compose file...${NC}"

    cat > ${BASE_DIR}/docker-compose.yml <<EOF
version: '3.8'

services:
  # 1. Core Infrastructure
  traefik:
    image: traefik:v3.0
    container_name: ph-gateway
    restart: always
    command:
      - "--providers.docker=true"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--entrypoints.web.http.redirections.entryPoint.to=websecure"
      - "--entrypoints.web.http.redirections.entryPoint.scheme=https"
      - "--certificatesresolvers.cfresolver.acme.dnschallenge=true"
      - "--certificatesresolvers.cfresolver.acme.dnschallenge.provider=cloudflare"
      - "--certificatesresolvers.cfresolver.acme.email=${CF_EMAIL}"
      - "--certificatesresolvers.cfresolver.acme.storage=/letsencrypt/acme.json"
    environment:
      - "CF_DNS_API_TOKEN=${CF_TOKEN}"
      - "CF_ZONE_API_TOKEN=${CF_TOKEN}"
    ports: ["80:80", "443:443"]
    volumes:
      - "/var/run/docker.sock:/var/run/docker.sock:ro"
      - "${BASE_DIR}/traefik/acme.json:/letsencrypt/acme.json"
    networks:
      - ph-net

  # 2. Main Application
  frontend:
    image: nginx:alpine
    container_name: ph-frontend
    restart: always
    volumes:
      - "${REPO_DIR}:/usr/share/nginx/html:ro"
      - "${BASE_DIR}/nginx.conf:/etc/nginx/conf.d/default.conf:ro"
    networks:
      - ph-net
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.yemenjpt.rule=Host(\`${DOMAIN}\`, \`www.${DOMAIN}\`, \`ai.${DOMAIN}\`)"
      - "traefik.http.routers.yemenjpt.entrypoints=websecure"
      - "traefik.http.routers.yemenjpt.tls.certresolver=cfresolver"
    depends_on:
      - backend

  backend:
    build: 
      context: "${BASE_DIR}/backend"
    container_name: ph-backend
    restart: always
    environment:
      - "API_KEY=${API_KEY}"
      - "TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN}"
      - "TELEGRAM_ROOT_CHAT_ID=${TELEGRAM_ROOT_CHAT_ID}"
    networks:
      - ph-net

  # 3. Portal & Management
  dashy:
    image: lissy93/dashy:latest
    container_name: ph-portal
    restart: always
    volumes:
      - "${REPO_DIR}/dashy.conf.yml:/app/public/conf.yml"
    networks:
      - ph-net
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.dashy.rule=Host(\`portal.${DOMAIN}\`)"
      - "traefik.http.routers.dashy.entrypoints=websecure"
      - "traefik.http.routers.dashy.tls.certresolver=cfresolver"
      - "traefik.http.services.dashy.loadbalancer.server.port=80"

  # NOTE: The full docker-compose.yml is extensive. This script generates
  # the core components. The user can expand this file by adding the other
  # services from their dashy.conf.yml (SearXNG, Portainer, etc.) following
  # the same Traefik label pattern.

networks:
  ph-net:
    driver: bridge
EOF
    echo "   ✅ Docker Compose file generated at ${BASE_DIR}/docker-compose.yml"
}

launch_services() {
    echo -e "${BLUE}🚀 [7/9] Launching all platform services via Docker Compose...${NC}"
    echo "   (This may take several minutes on the first run as images are downloaded)"
    docker compose -f ${BASE_DIR}/docker-compose.yml up -d --build --remove-orphans
    echo "   ✅ Services are starting in the background."
}

configure_firewall() {
    echo -e "${BLUE}🛡️ [8/9] Activating security firewall (UFW)...${NC}"
    ufw allow 22,80,443/tcp > /dev/null
    ufw --force enable > /dev/null
    echo "   ✅ Firewall configured to allow SSH, HTTP, and HTTPS."
}

print_summary() {
    echo -e "${GREEN}======================================================================="
    echo -e "✅ YemenJPT Platform Installation Completed Successfully!"
    echo -e "=======================================================================${NC}"
    echo "🔗 Main Application:   https://${DOMAIN}"
    echo "🔗 Services Portal:    https://portal.${DOMAIN}"
    echo ""
    echo -e "${GREEN}-----------------------------------------------------------------------"
    echo "💡 To see live logs of all services, run: 'cd ${BASE_DIR} && docker compose logs -f'"
    echo "💡 To stop all services, run: 'cd ${BASE_DIR} && docker compose down'"
    echo "=======================================================================${NC}"
}

# --- Main Execution ---
main() {
    check_root
    print_header
    check_env
    prepare_system
    configure_dns
    create_directories
    generate_configs
    generate_compose_file
    launch_services
    configure_firewall
    print_summary
}

main
