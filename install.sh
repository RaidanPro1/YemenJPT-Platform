#!/bin/bash

# ============================================================
# 🇾🇪 YemenJPT & Press House Ecosystem (V14.0 - ERP Edition for Ubuntu 24 LTS)
# ============================================================
# Core | AI | Mail | Signals | DevOps | Automation | Security | CMS | ERP
# This script automates the full deployment of the YemenJPT platform
# and its comprehensive suite of services on a fresh Ubuntu 24.04 LTS server.
# It is designed to be idempotent; you can run it multiple times.
# ============================================================

set -e # Exit immediately if a command exits with a non-zero status.

# --- Terminal Colors ---
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}"
echo "██    ██ ███████ ███    ███ ███████ ███    ██      ██ ██████  ████████ "
echo " ██  ██  ██      ████  ████ ██      ████   ██      ██ ██   ██    ██    "
echo "  ████   █████   ██ ████ ██ █████   ██ ██  ██      ██ ██████     ██    "
echo "   ██    ██      ██  ██  ██ ██      ██  ██ ██ ██   ██ ██         ██    "
echo "   ██    ███████ ██      ██ ███████ ██   ████  █████  ██         ██    "
echo -e "${NC}"
echo -e "${GREEN}>>> Initializing YemenJPT Digital Empire Installation (V14.0 on Ubuntu 24.04)...${NC}"

# --- 1. Define Paths & Load Environment ---
echo -e "${BLUE}⚙️ [1/10] Defining paths and loading environment configuration...${NC}"
REPO_DIR=$(cd "$(dirname "$0")" && pwd) # Absolute path to the repository directory
BASE_DIR="/opt/presshouse" # Main installation directory

if [ -f "${REPO_DIR}/.env" ]; then
    export $(cat "${REPO_DIR}/.env" | sed 's/#.*//g' | xargs)
else
    echo -e "${RED}❌ CRITICAL: .env file not found in ${REPO_DIR}. Please copy .env.example to .env and fill in your details.${NC}"
    exit 1
fi

# Check for essential variables
if [ -z "$DOMAIN" ] || [ -z "$SERVER_IP" ] || [ -z "$CF_TOKEN" ] || [ -z "$CF_ZONE_ID" ] || [ -z "$CF_EMAIL" ] || [ -z "$UNIFIED_PASS" ] || [ -z "$MARIADB_ROOT_PASSWORD" ] || [ -z "$USHHAIDI_DB_PASSWORD" ] || [ -z "$ERPNEXT_DB_PASSWORD" ]; then
    echo -e "${RED}❌ CRITICAL: One or more required variables in the .env file are empty. Installation aborted.${NC}"
    exit 1
fi
echo "   ✅ Environment variables loaded successfully."

# --- 2. System Preparation & Dependencies ---
echo -e "${BLUE}🛠️ [2/10] Preparing server (Ubuntu 24.04) and installing dependencies...${NC}"
export DEBIAN_FRONTEND=noninteractive
apt-get update && apt-get upgrade -y > /dev/null
apt-get install -y curl git unzip htop jq software-properties-common ca-certificates ufw > /dev/null

# Install Docker Engine if not present
if ! command -v docker &> /dev/null; then
    echo "   -> Docker not found. Installing Docker Engine for Ubuntu..."
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

# --- 3. DNS Automation (Cloudflare) ---
echo -e "${BLUE}☁️ [3/10] Automating DNS record creation with Cloudflare...${NC}"
update_dns() {
    local name=$1; local type=$2; local content=$3; local proxied=${4:-true}
    # Check if record exists
    local record_id=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$CF_ZONE_ID/dns_records?type=$type&name=$name" \
        -H "Authorization: Bearer $CF_TOKEN" -H "Content-Type: application/json" | jq -r ".result[0].id")

    if [ "$record_id" != "null" ]; then
        echo "   -> DNS node already exists: $name. Skipping."
        return
    fi
    
    # Create DNS record
    curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$CF_ZONE_ID/dns_records" \
        -H "Authorization: Bearer $CF_TOKEN" -H "Content-Type: application/json" \
        --data "{\"type\":\"$type\",\"name\":\"$name\",\"content\":\"$content\",\"ttl\":1,\"proxied\":$proxied}" > /dev/null
    echo "   ✅ DNS node linked: $name"
}
# List of all subdomains required by the platform
SUBDOMAINS=(
    "$DOMAIN:A:$SERVER_IP:true" "www.$DOMAIN:CNAME:$DOMAIN:true" "ai.$DOMAIN:CNAME:$DOMAIN:true"
    "portal.$DOMAIN:CNAME:$DOMAIN:true" "mail.$DOMAIN:A:$SERVER_IP:false" "webmail.$DOMAIN:CNAME:$DOMAIN:true"
    "auto.$DOMAIN:CNAME:$DOMAIN:true" "git.$DOMAIN:CNAME:$DOMAIN:true" "tools.$DOMAIN:CNAME:$DOMAIN:true"
    "status.$DOMAIN:CNAME:$DOMAIN:true" "watch.$DOMAIN:CNAME:$DOMAIN:true" "data.$DOMAIN:CNAME:$DOMAIN:true"
    "chat.$DOMAIN:CNAME:$DOMAIN:true" "pass.$DOMAIN:CNAME:$DOMAIN:true" "archive.$DOMAIN:CNAME:$DOMAIN:true"
    "search.$DOMAIN:CNAME:$DOMAIN:true" "sys.$DOMAIN:CNAME:$DOMAIN:true" "glances.$DOMAIN:CNAME:$DOMAIN:true" "cms.$DOMAIN:CNAME:$DOMAIN:true"
    "map-report.$DOMAIN:CNAME:$DOMAIN:true" "osint-auto.$DOMAIN:CNAME:$DOMAIN:true" "analyzer.$DOMAIN:CNAME:$DOMAIN:true"
    "gis-server.$DOMAIN:CNAME:$DOMAIN:true" "web-rec.$DOMAIN:CNAME:$DOMAIN:true" "publish.$DOMAIN:CNAME:$DOMAIN:true"
    "maps.$DOMAIN:CNAME:$DOMAIN:true" "crypto.$DOMAIN:CNAME:$DOMAIN:true" "dispatch.$DOMAIN:CNAME:$DOMAIN:true"
    "check.$DOMAIN:CNAME:$DOMAIN:true" "erp.$DOMAIN:CNAME:$DOMAIN:true" "loki.$DOMAIN:CNAME:$DOMAIN:true" "aletheia.$DOMAIN:CNAME:$DOMAIN:true"
)
for record in "${SUBDOMAINS[@]}"; do IFS=':' read -r name type content proxied <<< "$record"; update_dns "$name" "$type" "$content" "$proxied"; done
# Mail-specific DNS records
update_dns "$DOMAIN" "MX" "mail.$DOMAIN" false
update_dns "$DOMAIN" "TXT" "v=spf1 mx ip4:$SERVER_IP ~all" false
update_dns "_dmarc.$DOMAIN" "TXT" "v=DMARC1; p=none; rua=mailto:admin@$DOMAIN" false

# --- 4. Directory Structure & Code Repositories ---
echo -e "${BLUE}📂 [4/10] Building data repositories and cloning required code...${NC}"
# Create directories for persistent data for all services
mkdir -p $BASE_DIR/{traefik,yemenjpt,postgres,redis,ollama,portainer,n8n,gitea,chatwoot,archivebox,vaultwarden,uptime,nocodb,changedetection,tooljet,searxng,glances,typo3,typo3-db,spiderfoot,social-analyzer,qgis-server,webrecorder,ushahidi,ushahidi-db,ghost,ghost-db,keplergl,arkham-mirror,local-ai-dispatch,maps-dashboard-src,meedan-check-db,meedan-check-es,meedan-check-redis,erpnext-db,erpnext-redis-cache,erpnext-redis-queue,erpnext-sites,loki,aletheia}

# Clone and configure Mailcow if it doesn't exist
if [ ! -d "/opt/mailcow-dockerized" ]; then
    cd /opt
    git clone https://github.com/mailcow/mailcow-dockerized
    cd mailcow-dockerized
    # Generate config with non-interactive flags
    ./generate_config.sh --hostname mail.$DOMAIN --timezone Asia/Aden --db-pass "$UNIFIED_PASS" --skip-assets
    # Modify config to run behind Traefik proxy
    sed -i -e 's/HTTP_PORT=80/HTTP_PORT=8080/' -e 's/HTTPS_PORT=443/HTTPS_PORT=8443/' -e 's/HTTP_BIND=0.0.0.0/HTTP_BIND=127.0.0.1/' -e 's/HTTPS_BIND=0.0.0.0/HTTPS_BIND=127.0.0.1/' -e 's/SKIP_LETS_ENCRYPT=n/SKIP_LETS_ENCRYPT=y/' mailcow.conf
    docker compose pull && docker compose up -d
    cd - > /dev/null # Return to previous directory
else
    echo "   -> Mailcow seems to be already configured. Skipping setup."
fi

# Clone required source code for custom builds
if [ ! -d "${BASE_DIR}/local-ai-dispatch/src" ]; then
    git clone https://github.com/associatedpress/local-ai-brainerd-dispatch.git "${BASE_DIR}/local-ai-dispatch/src"
else
    echo "   -> Brainerd Dispatch AI source already exists. Skipping clone."
fi
if [ ! -d "${BASE_DIR}/maps-dashboard-src/.git" ]; then
    # Clone a placeholder repo for the maps dashboard, to be developed later
    git clone https://github.com/RaidanPro1/yemen-maps-dashboard-placeholder.git "${BASE_DIR}/maps-dashboard-src"
else
    echo "   -> Maps dashboard source already exists. Skipping clone."
fi
# Clone verification tools
if [ ! -d "${BASE_DIR}/loki/src" ]; then
    echo "   -> Cloning placeholder for Loki..."
    git clone https://github.com/RaidanPro1/yemen-maps-dashboard-placeholder.git "${BASE_DIR}/loki/src"
else
    echo "   -> Loki source placeholder already exists. Skipping clone."
fi
if [ ! -d "${BASE_DIR}/aletheia/src" ]; then
    echo "   -> Cloning Aletheia deepfake detection toolkit..."
    git clone https://github.com/daniellerch/aletheia.git "${BASE_DIR}/aletheia/src"
else
    echo "   -> Aletheia source already exists. Skipping clone."
fi

# --- 5. Generate Custom Dockerfiles & Configs ---
echo -e "${BLUE}📝 [5/10] Generating custom Dockerfiles & configurations...${NC}"

# Nginx config for frontend
cat > ${REPO_DIR}/frontend/nginx.conf <<EOF
server {
    listen 80;
    server_name ${DOMAIN} www.${DOMAIN};
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://backend:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Dockerfile for Brainerd Dispatch Local AI
cat > ${BASE_DIR}/local-ai-dispatch/Dockerfile <<EOF
FROM python:3.11-slim
WORKDIR /app
COPY ./src /app
RUN pip install --no-cache-dir -r requirements.txt
EXPOSE 5001
CMD ["flask", "run", "--host=0.0.0.0", "--port=5001"]
EOF

# Dockerfile for the placeholder Maps Dashboard
cat > ${BASE_DIR}/maps-dashboard-src/Dockerfile.maps <<EOF
FROM nginx:alpine
COPY ./default.conf /etc/nginx/conf.d/default.conf
COPY ./dist /usr/share/nginx/html
# Placeholder content
RUN echo "<h1>Yemen Maps Dashboard</h1><p>Coming Soon...</p>" > /usr/share/nginx/html/index.html
EOF

# Dockerfile and wrapper for Aletheia
cat > ${BASE_DIR}/aletheia/Dockerfile <<EOF
FROM python:3.9-slim
WORKDIR /app
COPY ./src /app/aletheia-src
COPY main.py .
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
# In a real build, we'd install the full dependencies of Aletheia
# and the CLI tool itself. This is a functional placeholder.
# RUN pip install ./aletheia-src
EXPOSE 5000
CMD ["python", "main.py"]
EOF
cat > ${BASE_DIR}/aletheia/main.py <<EOF
from flask import Flask, request, jsonify
import os

app = Flask(__name__)

@app.route('/')
def index():
    return """
    <h1>Aletheia Deepfake Detection Service</h1>
    <p>This is a placeholder API wrapper for the Aletheia toolkit.</p>
    <p>Use the <code>/analyze</code> endpoint with a POST request and a file upload to simulate analysis.</p>
    """

# This is a placeholder for a real implementation.
# The Aletheia library is a CLI tool and would require more complex
# integration using subprocess to be exposed as a web service.
@app.route('/analyze', methods=['POST'])
def analyze():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    # In a real implementation:
    # 1. Save the file temporarily.
    # 2. Run 'aletheia.py predict path/to/file.mp4' using subprocess.
    # 3. Capture and return the output.
    
    # Simulate analysis
    filename = file.filename
    return jsonify({
        'filename': filename,
        'analysis_status': 'simulation_complete',
        'result': 'This is a simulated response. In a real setup, Aletheia CLI would be executed here to detect deepfakes.'
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
EOF
cat > ${BASE_DIR}/aletheia/requirements.txt <<EOF
Flask==2.2.2
EOF

# Dockerfile for Loki placeholder
cat > ${BASE_DIR}/loki/Dockerfile <<EOF
FROM nginx:alpine
RUN echo "<h1>Loki - OpenFactVerification</h1><p>Service placeholder. This service is under construction and will provide automated fact verification capabilities.</p>" > /usr/share/nginx/html/index.html
EOF

# --- 6. Generate Docker Compose Ecosystem ---
echo -e "${BLUE}🐳 [6/10] Generating comprehensive Docker Compose file...${NC}"
# Generate a secure random key for Ushahidi
USHHAIDI_APP_KEY_RAW=$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c 32)
export USHHAIDI_APP_KEY="base64:$(echo -n $USHHAIDI_APP_KEY_RAW | base64)"

# Generate the main docker-compose.yml file from a HEREDOC
cat > ${BASE_DIR}/docker-compose.yml <<EOF
# This file is auto-generated by install.sh. Do not edit manually.
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
      - "--entrypoints.websecure.http.middlewares.hsts.headers.stsSeconds=31536000"
      - "--entrypoints.websecure.http.middlewares.hsts.headers.stsIncludeSubdomains=true"
      - "--entrypoints.websecure.http.middlewares.hsts.headers.stsPreload=true"
    environment: { "CF_DNS_API_TOKEN": "${CF_TOKEN}" }
    ports: ["80:80", "443:443"]
    volumes: ["/var/run/docker.sock:/var/run/docker.sock:ro", "${BASE_DIR}/traefik/acme.json:/letsencrypt/acme.json"]
    networks: ["ph-net"]
    deploy: { resources: { limits: { memory: "256M" } } }

  postgres:
    image: postgres:16
    container_name: ph-postgres
    environment: { POSTGRES_DB: yemenjpt_db, POSTGRES_USER: admin, POSTGRES_PASSWORD: "${UNIFIED_PASS}" }
    volumes: ["${BASE_DIR}/postgres:/var/lib/postgresql/data"]
    networks: ["ph-net"]
    restart: always
    deploy: { resources: { limits: { memory: "2G" } } }

  redis:
    image: redis:alpine
    networks: ["ph-net"]
    restart: always
    deploy: { resources: { limits: { memory: "128M" } } }

  # 2. Main Application & AI
  frontend:
    image: nginx:alpine
    container_name: ph-frontend
    restart: always
    volumes:
      - "${REPO_DIR}:/usr/share/nginx/html:ro"
      - "${REPO_DIR}/frontend/nginx.conf:/etc/nginx/conf.d/default.conf:ro"
    networks: ["ph-net"]
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.yemenjpt.rule=Host(\`${DOMAIN}\`, \`www.${DOMAIN}\`)"
      - "traefik.http.routers.yemenjpt.entrypoints=websecure"
      - "traefik.http.routers.yemenjpt.tls.certresolver=cfresolver"
      - "traefik.http.routers.yemenjpt.middlewares=hsts@entrypoint"
    deploy: { resources: { limits: { memory: "128M" } } }
    depends_on: [backend]

  backend:
    build: { context: "${REPO_DIR}/backend" }
    container_name: ph-backend
    restart: always
    environment:
      - "DATABASE_URL=postgres://admin:${UNIFIED_PASS}@postgres:5432/yemenjpt_db"
      - "OLLAMA_HOST=http://ollama:11434"
      - "API_KEY=${API_KEY}"
    networks: ["ph-net"]
    deploy: { resources: { limits: { memory: "256M" } } }
    depends_on: [postgres]

  ollama:
    image: ollama/ollama:latest
    container_name: ph-ollama
    volumes: ["${BASE_DIR}/ollama:/root/.ollama"]
    networks: ["ph-net"]
    restart: always
    deploy:
      resources:
        limits: { memory: "8G" }
        reservations: { devices: [ { driver: "nvidia", capabilities: [ "gpu" ] } ] }

  local-ai-dispatch:
    build: { context: "${BASE_DIR}/local-ai-dispatch", dockerfile: Dockerfile }
    container_name: ph-dispatch-ai
    restart: always
    networks: ["ph-net"]
    labels: ["traefik.enable=true", "traefik.http.routers.dispatch.rule=Host(\`dispatch.$DOMAIN\`)", "traefik.http.routers.dispatch.entrypoints=websecure", "traefik.http.routers.dispatch.tls.certresolver=cfresolver", "traefik.http.services.dispatch.loadbalancer.server.port=5001"]
    deploy: { resources: { limits: { memory: "1G" } } }

  # 3. Management & Portal
  portainer:
    image: portainer/portainer-ce:latest
    container_name: ph-sysadmin
    restart: always
    volumes: ["/var/run/docker.sock:/var/run/docker.sock", "${BASE_DIR}/portainer:/data"]
    networks: ["ph-net"]
    labels: ["traefik.enable=true", "traefik.http.routers.portainer.rule=Host(\`sys.$DOMAIN\`)", "traefik.http.routers.portainer.entrypoints=websecure", "traefik.http.routers.portainer.tls.certresolver=cfresolver", "traefik.http.services.portainer.loadbalancer.server.port=9000"]
    deploy: { resources: { limits: { memory: "256M" } } }
  
  dashy:
    image: lissy93/dashy:latest
    container_name: ph-portal
    restart: always
    volumes: ["${REPO_DIR}/dashy.conf.yml:/app/public/conf.yml"]
    networks: ["ph-net"]
    labels: ["traefik.enable=true", "traefik.http.routers.dashy.rule=Host(\`portal.$DOMAIN\`)", "traefik.http.routers.dashy.entrypoints=websecure", "traefik.http.routers.dashy.tls.certresolver=cfresolver", "traefik.http.services.dashy.loadbalancer.server.port=80"]
    deploy: { resources: { limits: { memory: "128M" } } }
      
  # 4. Automation & DevOps
  n8n:
    image: n8nio/n8n:latest
    container_name: ph-auto
    restart: always
    environment: { N8N_HOST: "auto.$DOMAIN", WEBHOOK_URL: "https://auto.$DOMAIN/" }
    volumes: ["${BASE_DIR}/n8n:/home/node/.n8n"]
    networks: ["ph-net"]
    labels: ["traefik.enable=true", "traefik.http.routers.n8n.rule=Host(\`auto.$DOMAIN\`)", "traefik.http.routers.n8n.entrypoints=websecure", "traefik.http.routers.n8n.tls.certresolver=cfresolver"]
    deploy: { resources: { limits: { memory: "512M" } } }

  gitea:
    image: gitea/gitea:latest
    container_name: ph-git
    restart: always
    volumes: ["${BASE_DIR}/gitea:/data"]
    networks: ["ph-net"]
    labels: ["traefik.enable=true", "traefik.http.routers.gitea.rule=Host(\`git.$DOMAIN\`)", "traefik.http.routers.gitea.entrypoints=websecure", "traefik.http.routers.gitea.tls.certresolver=cfresolver", "traefik.http.services.gitea.loadbalancer.server.port=3000"]
    deploy: { resources: { limits: { memory: "512M" } } }

  # 5. OSINT & Monitoring Suite
  changedetection:
    image: ghcr.io/dgtlmoon/changedetection.io:latest
    container_name: ph-watch
    restart: always
    volumes: ["${BASE_DIR}/changedetection:/datastore"]
    networks: ["ph-net"]
    labels: ["traefik.enable=true", "traefik.http.routers.watch.rule=Host(\`watch.$DOMAIN\`)", "traefik.http.routers.watch.entrypoints=websecure", "traefik.http.routers.watch.tls.certresolver=cfresolver"]
    deploy: { resources: { limits: { memory: "256M" } } }

  uptime-kuma:
    image: louislam/uptime-kuma:1
    container_name: ph-status
    restart: always
    volumes: ["${BASE_DIR}/uptime:/app/data"]
    networks: ["ph-net"]
    labels: ["traefik.enable=true", "traefik.http.routers.status.rule=Host(\`status.$DOMAIN\`)", "traefik.http.routers.status.entrypoints=websecure", "traefik.http.routers.status.tls.certresolver=cfresolver"]
    deploy: { resources: { limits: { memory: "256M" } } }

  searxng:
    image: searxng/searxng:latest
    container_name: ph-search
    restart: always
    volumes: ["${BASE_DIR}/searxng:/etc/searxng"]
    networks: ["ph-net"]
    labels: ["traefik.enable=true", "traefik.http.routers.search.rule=Host(\`search.$DOMAIN\`)", "traefik.http.routers.search.entrypoints=websecure", "traefik.http.routers.search.tls.certresolver=cfresolver"]
    deploy: { resources: { limits: { memory: "256M" } } }

  archivebox:
    image: archivebox/archivebox:latest
    container_name: ph-archive
    restart: always
    command: server --quick-init 0.0.0.0:8000
    volumes: ["${BASE_DIR}/archivebox:/data"]
    networks: ["ph-net"]
    labels: ["traefik.enable=true", "traefik.http.routers.archive.rule=Host(\`archive.$DOMAIN\`)", "traefik.http.routers.archive.entrypoints=websecure", "traefik.http.routers.archive.tls.certresolver=cfresolver"]
    deploy: { resources: { limits: { memory: "512M" } } }
  
  glances:
    image: nicolargo/glances:latest-full
    container_name: ph-glances
    restart: always
    pid: host
    volumes: ["/var/run/docker.sock:/var/run/docker.sock:ro", "${BASE_DIR}/glances:/glances/conf"]
    networks: ["ph-net"]
    labels: ["traefik.enable=true", "traefik.http.routers.glances.rule=Host(\`glances.$DOMAIN\`)", "traefik.http.routers.glances.entrypoints=websecure", "traefik.http.routers.glances.tls.certresolver=cfresolver", "traefik.http.services.glances.loadbalancer.server.port=61208"]
    deploy: { resources: { limits: { memory: "256M" } } }

  # 6. Productivity & Data
  vaultwarden:
    image: vaultwarden/server:latest
    container_name: ph-pass
    restart: always
    volumes: ["${BASE_DIR}/vaultwarden:/data"]
    networks: ["ph-net"]
    labels: ["traefik.enable=true", "traefik.http.routers.vault.rule=Host(\`pass.$DOMAIN\`)", "traefik.http.routers.vault.entrypoints=websecure", "traefik.http.routers.vault.tls.certresolver=cfresolver"]
    deploy: { resources: { limits: { memory: "256M" } } }
  
  nocodb:
    image: nocodb/nocodb:latest
    container_name: ph-data
    restart: always
    volumes: ["${BASE_DIR}/nocodb:/usr/app/data"]
    networks: ["ph-net"]
    labels: ["traefik.enable=true", "traefik.http.routers.data.rule=Host(\`data.$DOMAIN\`)", "traefik.http.routers.data.entrypoints=websecure", "traefik.http.routers.data.tls.certresolver=cfresolver"]
    deploy: { resources: { limits: { memory: "512M" } } }
  
  tooljet:
    image: tooljet/tooljet-ce:latest
    container_name: ph-tools
    restart: always
    volumes: ["${BASE_DIR}/tooljet/locks:/var/lib/tooljet/locks", "${BASE_DIR}/tooljet/db:/var/lib/postgresql/13/main"]
    networks: ["ph-net"]
    labels: ["traefik.enable=true", "traefik.http.routers.tools.rule=Host(\`tools.$DOMAIN\`)", "traefik.http.routers.tools.entrypoints=websecure", "traefik.http.routers.tools.tls.certresolver=cfresolver", "traefik.http.services.tools.loadbalancer.server.port=3000"]
    deploy: { resources: { limits: { memory: "512M" } } }

  # 7. Content Management Systems (CMS)
  typo3-db:
    image: mariadb:10.6
    container_name: ph-typo3-db
    command: --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci
    environment: { MYSQL_ROOT_PASSWORD: "${MARIADB_ROOT_PASSWORD}", MYSQL_DATABASE: typo3, MYSQL_USER: typo3, MYSQL_PASSWORD: "${UNIFIED_PASS}" }
    volumes: ["${BASE_DIR}/typo3-db:/var/lib/mysql"]
    networks: ["ph-net"]
    restart: always
    deploy: { resources: { limits: { memory: "1G" } } }
  
  typo3:
    image: typo3/cms-base-distribution:13
    container_name: ph-cms
    environment: { TYPO3_DB_HOST: typo3-db, TYPO3_DB_NAME: typo3, TYPO3_DB_USER: typo3, TYPO3_DB_PASSWORD: "${UNIFIED_PASS}", TYPO3_INSTALL_WEB_SERVER_CONFIG_FLAVOR: apache-php, TYPO3_INSTALL_SETUP_ADMIN_USER_NAME: admin, TYPO3_INSTALL_SETUP_ADMIN_PASSWORD: "${UNIFIED_PASS}" }
    volumes: ["${BASE_DIR}/typo3:/var/www/html"]
    networks: ["ph-net"]
    depends_on: [typo3-db]
    restart: always
    labels: ["traefik.enable=true", "traefik.http.routers.typo3.rule=Host(\`cms.$DOMAIN\`)", "traefik.http.routers.typo3.entrypoints=websecure", "traefik.http.routers.typo3.tls.certresolver=cfresolver"]
    deploy: { resources: { limits: { memory: "512M" } } }

  ghost-db:
    image: mariadb:10.6
    container_name: ph-ghost-db
    command: --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci
    environment: { MYSQL_ROOT_PASSWORD: "${MARIADB_ROOT_PASSWORD}", MYSQL_DATABASE: ghost, MYSQL_USER: ghost, MYSQL_PASSWORD: "${UNIFIED_PASS}" }
    volumes: ["${BASE_DIR}/ghost-db:/var/lib/mysql"]
    networks: ["ph-net"]
    restart: always
    deploy: { resources: { limits: { memory: "512M" } } }

  ghost:
    image: ghost:5-alpine
    container_name: ph-publish
    restart: always
    environment:
      database__client: mysql
      database__connection__host: ghost-db
      database__connection__user: ghost
      database__connection__password: "${UNIFIED_PASS}"
      database__connection__database: ghost
      url: "https://publish.${DOMAIN}"
    volumes: ["${BASE_DIR}/ghost:/var/lib/ghost/content"]
    networks: ["ph-net"]
    depends_on: [ghost-db]
    labels: ["traefik.enable=true", "traefik.http.routers.ghost.rule=Host(\`publish.$DOMAIN\`)", "traefik.http.routers.ghost.entrypoints=websecure", "traefik.http.routers.ghost.tls.certresolver=cfresolver", "traefik.http.services.ghost.loadbalancer.server.port=2368"]
    deploy: { resources: { limits: { memory: "512M" } } }

  # 8. Mailcow Proxy
  mail-proxy:
    image: alpine/socat
    command: tcp-listen:80,fork,reuseaddr tcp-connect:host.docker.internal:8080
    extra_hosts: ["host.docker.internal:host-gateway"]
    networks: ["ph-net"]
    labels: ["traefik.enable=true", "traefik.http.routers.mail.rule=Host(\`mail.$DOMAIN\`, \`webmail.$DOMAIN\`)", "traefik.http.routers.mail.entrypoints=websecure", "traefik.http.routers.mail.tls.certresolver=cfresolver", "traefik.http.services.mail.loadbalancer.server.port=80"]
    deploy: { resources: { limits: { memory: "64M" } } }

  # 9. Expanded OSINT, GIS & Investigations Suite
  spiderfoot:
    image: smicallef/spiderfoot:4.0
    container_name: ph-spiderfoot
    restart: always
    volumes: ["${BASE_DIR}/spiderfoot:/var/lib/spiderfoot"]
    networks: ["ph-net"]
    labels: ["traefik.enable=true", "traefik.http.routers.spiderfoot.rule=Host(\`osint-auto.$DOMAIN\`)", "traefik.http.routers.spiderfoot.entrypoints=websecure", "traefik.http.routers.spiderfoot.tls.certresolver=cfresolver", "traefik.http.services.spiderfoot.loadbalancer.server.port=5001"]
    deploy: { resources: { limits: { memory: "1G" } } }

  social-analyzer:
    image: qeeqbox/social-analyzer:latest
    container_name: ph-social-analyzer
    restart: always
    volumes: ["${BASE_DIR}/social-analyzer:/app/database"]
    networks: ["ph-net"]
    labels: ["traefik.enable=true", "traefik.http.routers.social-analyzer.rule=Host(\`analyzer.$DOMAIN\`)", "traefik.http.routers.social-analyzer.entrypoints=websecure", "traefik.http.routers.social-analyzer.tls.certresolver=cfresolver", "traefik.http.services.social-analyzer.loadbalancer.server.port=9003"]
    deploy: { resources: { limits: { memory: "512M" } } }
  
  qgis-server:
    image: camptocamp/qgis-server:3.34
    container_name: ph-qgis-server
    restart: always
    volumes: ["${BASE_DIR}/qgis-server:/etc/qgisserver"]
    networks: ["ph-net"]
    labels: ["traefik.enable=true", "traefik.http.routers.qgis-server.rule=Host(\`gis-server.$DOMAIN\`)", "traefik.http.routers.qgis-server.entrypoints=websecure", "traefik.http.routers.qgis-server.tls.certresolver=cfresolver", "traefik.http.services.qgis-server.loadbalancer.server.port=80"]
    deploy: { resources: { limits: { memory: "512M" } } }

  webrecorder:
    image: webrecorder/webrecorder:latest
    container_name: ph-webrecorder
    restart: always
    volumes: ["${BASE_DIR}/webrecorder:/data"]
    networks: ["ph-net"]
    labels: ["traefik.enable=true", "traefik.http.routers.webrecorder.rule=Host(\`web-rec.$DOMAIN\`)", "traefik.http.routers.webrecorder.entrypoints=websecure", "traefik.http.routers.webrecorder.tls.certresolver=cfresolver", "traefik.http.services.webrecorder.loadbalancer.server.port=8080"]
    deploy: { resources: { limits: { memory: "512M" } } }
  
  ushahidi-db:
    image: mariadb:10.6
    container_name: ph-ushahidi-db
    command: --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci
    environment: { MYSQL_ROOT_PASSWORD: "${MARIADB_ROOT_PASSWORD}", MYSQL_DATABASE: ushahidi, MYSQL_USER: ushahidi, MYSQL_PASSWORD: "${USHHAIDI_DB_PASSWORD}" }
    volumes: ["${BASE_DIR}/ushahidi-db:/var/lib/mysql"]
    networks: ["ph-net"]
    restart: always
    deploy: { resources: { limits: { memory: "512M" } } }

  ushahidi:
    image: ushahidi/platform:latest
    container_name: ph-ushahidi
    restart: always
    environment: { DB_HOST: ushahidi-db, DB_DATABASE: ushahidi, DB_USERNAME: ushahidi, DB_PASSWORD: "${USHHAIDI_DB_PASSWORD}", APP_KEY: "${USHHAIDI_APP_KEY}", APP_URL: "https://map-report.${DOMAIN}" }
    networks: ["ph-net"]
    depends_on: [ushahidi-db]
    labels: ["traefik.enable=true", "traefik.http.routers.ushahidi.rule=Host(\`map-report.$DOMAIN\`)", "traefik.http.routers.ushahidi.entrypoints=websecure", "traefik.http.routers.ushahidi.tls.certresolver=cfresolver", "traefik.http.services.ushahidi.loadbalancer.server.port=80"]
    deploy: { resources: { limits: { memory: "256M" } } }
    
  keplergl:
    image: keplergl/kepler.gl:latest
    container_name: ph-kepler
    restart: always
    networks: ["ph-net"]
    labels: ["traefik.enable=true", "traefik.http.routers.kepler.rule=Host(\`maps.$DOMAIN\`)", "traefik.http.routers.kepler.entrypoints=websecure", "traefik.http.routers.kepler.tls.certresolver=cfresolver", "traefik.http.services.kepler.loadbalancer.server.port=8080"]
    deploy: { resources: { limits: { memory: "512M" } } }
    
  arkham-mirror:
    image: aarkk/arkham-mirror:latest
    container_name: ph-arkham
    restart: always
    networks: ["ph-net"]
    labels: ["traefik.enable=true", "traefik.http.routers.arkham.rule=Host(\`crypto.$DOMAIN\`)", "traefik.http.routers.arkham.entrypoints=websecure", "traefik.http.routers.arkham.tls.certresolver=cfresolver", "traefik.http.services.arkham.loadbalancer.server.port=3000"]
    deploy: { resources: { limits: { memory: "256M" } } }

  maps-dashboard:
    build: { context: "${BASE_DIR}/maps-dashboard-src", dockerfile: Dockerfile.maps }
    container_name: ph-maps-dashboard
    restart: always
    networks: ["ph-net"]
    labels: ["traefik.enable=true", "traefik.http.routers.maps-dashboard.rule=Host(\`vis.$DOMAIN\`)", "traefik.http.routers.maps-dashboard.entrypoints=websecure", "traefik.http.routers.maps-dashboard.tls.certresolver=cfresolver"]
    deploy: { resources: { limits: { memory: "64M" } } }

  # 10. Fact-Checking & Collaboration (Meedan Check)
  meedan-check-db:
    image: postgres:12
    container_name: ph-check-db
    restart: always
    environment: { POSTGRES_USER: check, POSTGRES_PASSWORD: "${UNIFIED_PASS}", POSTGRES_DB: check }
    volumes: ["${BASE_DIR}/meedan-check-db:/var/lib/postgresql/data"]
    networks: ["ph-net"]
    deploy: { resources: { limits: { memory: "1G" } } }

  meedan-check-es:
    image: docker.elastic.co/elasticsearch/elasticsearch:7.17.9
    container_name: ph-check-es
    restart: always
    environment: { "discovery.type": "single-node" }
    volumes: ["${BASE_DIR}/meedan-check-es:/usr/share/elasticsearch/data"]
    networks: ["ph-net"]
    deploy: { resources: { limits: { memory: "1G" } } }

  meedan-check-redis:
    image: redis:5
    container_name: ph-check-redis
    restart: always
    volumes: ["${BASE_DIR}/meedan-check-redis:/data"]
    networks: ["ph-net"]
    deploy: { resources: { limits: { memory: "256M" } } }

  meedan-check:
    image: meedan/check:latest
    container_name: ph-check
    restart: always
    depends_on: [meedan-check-db, meedan-check-es, meedan-check-redis]
    environment:
      RAILS_ENV: production
      DATABASE_HOST: meedan-check-db
      DATABASE_USERNAME: check
      DATABASE_PASSWORD: "${UNIFIED_PASS}"
      ELASTICSEARCH_HOST: meedan-check-es
      REDIS_HOST: meedan-check-redis
      SECRET_KEY_BASE: "${USHHAIDI_APP_KEY_RAW}" # Re-using a random key
    networks: ["ph-net"]
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.check.rule=Host(\`check.${DOMAIN}\`)"
      - "traefik.http.routers.check.entrypoints=websecure"
      - "traefik.http.routers.check.tls.certresolver=cfresolver"
      - "traefik.http.services.check.loadbalancer.server.port=3000"
    deploy: { resources: { limits: { memory: "1G" } } }

  loki:
    build: { context: "${BASE_DIR}/loki", dockerfile: Dockerfile }
    container_name: ph-loki
    restart: always
    networks: ["ph-net"]
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.loki.rule=Host(\`loki.${DOMAIN}\`)"
      - "traefik.http.routers.loki.entrypoints=websecure"
      - "traefik.http.routers.loki.tls.certresolver=cfresolver"
    deploy: { resources: { limits: { memory: "64M" } } }

  aletheia:
    build: { context: "${BASE_DIR}/aletheia", dockerfile: Dockerfile }
    container_name: ph-aletheia
    restart: always
    networks: ["ph-net"]
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.aletheia.rule=Host(\`aletheia.${DOMAIN}\`)"
      - "traefik.http.routers.aletheia.entrypoints=websecure"
      - "traefik.http.routers.aletheia.tls.certresolver=cfresolver"
      - "traefik.http.services.aletheia.loadbalancer.server.port=5000"
    deploy: { resources: { limits: { memory: "512M" } } }

  # 11. Organizational Management (ERPNext)
  erpnext-db:
    image: mariadb:10.6
    container_name: ph-erpnext-db
    restart: always
    command: ["--character-set-server=utf8mb4", "--collation-server=utf8mb4_unicode_ci"]
    environment:
      MYSQL_ROOT_PASSWORD: "${MARIADB_ROOT_PASSWORD}"
      MYSQL_DATABASE: erpnext_db
      MYSQL_USER: erpnext_user
      MYSQL_PASSWORD: "${ERPNEXT_DB_PASSWORD}"
    volumes: ["${BASE_DIR}/erpnext-db:/var/lib/mysql"]
    networks: ["ph-net"]
    deploy: { resources: { limits: { memory: "2G" } } }

  erpnext-redis-cache:
    image: redis:6.2-alpine
    container_name: ph-erpnext-redis-cache
    restart: always
    volumes: ["${BASE_DIR}/erpnext-redis-cache:/data"]
    networks: ["ph-net"]
    deploy: { resources: { limits: { memory: "256M" } } }

  erpnext-redis-queue:
    image: redis:6.2-alpine
    container_name: ph-erpnext-redis-queue
    restart: always
    volumes: ["${BASE_DIR}/erpnext-redis-queue:/data"]
    networks: ["ph-net"]
    deploy: { resources: { limits: { memory: "256M" } } }

  erpnext-backend:
    image: frappe/erpnext:v15.29.0
    container_name: ph-erpnext-backend
    restart: always
    depends_on: [erpnext-db, erpnext-redis-cache, erpnext-redis-queue]
    environment:
      DB_HOST: erpnext-db
      DB_PORT: "3306"
      DB_USER: erpnext_user
      DB_PASSWORD: "${ERPNEXT_DB_PASSWORD}"
      DB_NAME: erpnext_db
      REDIS_CACHE: "redis://erpnext-redis-cache:6379"
      REDIS_QUEUE: "redis://erpnext-redis-queue:6379"
      SOCKETIO_PORT: "9000"
      SITES: "erp.${DOMAIN}"
      ADMIN_PASSWORD: "${UNIFIED_PASS}"
    volumes: ["${BASE_DIR}/erpnext-sites:/home/frappe/frappe-bench/sites"]
    networks: ["ph-net"]
    deploy: { resources: { limits: { memory: "2G" } } }

  erpnext-frontend:
    image: frappe/erpnext:v15.29.0
    container_name: ph-erpnext-frontend
    restart: always
    command: ["nginx", "-g", "daemon off;"]
    depends_on: [erpnext-backend]
    volumes: ["${BASE_DIR}/erpnext-sites:/home/frappe/frappe-bench/sites"]
    networks: ["ph-net"]
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.erpnext.rule=Host(\`erp.${DOMAIN}\`)"
      - "traefik.http.routers.erpnext.entrypoints=websecure"
      - "traefik.http.routers.erpnext.tls.certresolver=cfresolver"
      - "traefik.http.services.erpnext.loadbalancer.server.port=8080"
    deploy: { resources: { limits: { memory: "512M" } } }

  erpnext-scheduler:
    image: frappe/erpnext:v15.29.0
    container_name: ph-erpnext-scheduler
    restart: always
    command: ["bench", "schedule"]
    depends_on: [erpnext-backend]
    volumes: ["${BASE_DIR}/erpnext-sites:/home/frappe/frappe-bench/sites"]
    networks: ["ph-net"]
    deploy: { resources: { limits: { memory: "512M" } } }

  erpnext-worker-default:
    image: frappe/erpnext:v15.29.0
    container_name: ph-erpnext-worker-default
    restart: always
    command: ["bench", "worker", "--queue", "default"]
    depends_on: [erpnext-backend]
    volumes: ["${BASE_DIR}/erpnext-sites:/home/frappe/frappe-bench/sites"]
    networks: ["ph-net"]
    deploy: { resources: { limits: { memory: "512M" } } }

networks:
  ph-net:
    driver: bridge
EOF

# --- 7. Prepare Configurations ---
echo -e "${BLUE}📝 [7/10] Preparing configurations...${NC}"
# Initialize ACME file for Traefik
touch ${BASE_DIR}/traefik/acme.json && chmod 600 ${BASE_DIR}/traefik/acme.json

# --- 8. Launch Ecosystem ---
echo -e "${BLUE}🚀 [8/10] Launching all platform services via Docker Compose...${NC}"
docker compose -f ${BASE_DIR}/docker-compose.yml up -d --build

# --- 9. Post-Launch Checks & Firewall ---
echo -e "${BLUE}🛠️ [9/10] Running post-launch checks...${NC}"
sleep 30 # Increased sleep to allow all containers to start properly
echo "   ✅ Waiting for services to stabilize..."

echo -e "${BLUE}🛡️ [10/10] Activating security firewall (UFW)...${NC}"
ufw allow 22,80,443/tcp
# Allow Mailcow ports
ufw allow 25,465,587,143,993,110,995/tcp
ufw --force enable

# --- Final Summary ---
echo -e "${GREEN}======================================================================="
echo -e "✅ YemenJPT Digital Empire Installation Completed (V14.0 on Ubuntu 24.04)"
echo -e "=======================================================================${NC}"
echo "🔗 Main Platform:    https://$DOMAIN"
echo "🔗 Unified Portal:   https://portal.$DOMAIN"
echo "📧 Mail Admin:       https://mail.$DOMAIN (Initial user: admin / pass: moohoo)"
echo "🔐 System Admin:     https://sys.$DOMAIN (Create admin account on first visit)"
echo "🔑 Unified Pass:     $UNIFIED_PASS (For databases, TYPO3 admin, ERPNext admin, etc.)"
echo -e "${GREEN}-----------------------------------------------------------------------"
echo "⚠️ IMPORTANT First Steps:"
echo "   1. Visit each service URL from the portal to complete its first-time setup."
echo "   2. For ERPNext, visit https://erp.$DOMAIN, login with 'Administrator' and your UNIFIED_PASS, and follow the setup wizard."
echo "   3. For Mailcow, log in immediately and change the admin password."
echo "   4. For Ghost, visit https://publish.$DOMAIN/ghost to create your admin account."
echo "   5. For TYPO3, log in at https://cms.$DOMAIN/typo3 with 'admin' and your UNIFIED_PASS."
echo "   6. For Ushahidi, complete the setup form using 'ushahidi-db', 'ushahidi', 'ushahidi', and your USHHAIDI_DB_PASSWORD."
echo "   7. To pull local AI models, run: 'docker compose -f ${BASE_DIR}/docker-compose.yml exec ph-ollama ollama pull llama3'"
echo "=======================================================================${NC}"