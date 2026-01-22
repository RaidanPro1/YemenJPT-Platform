# 🇾🇪 YemenJPT Digital Platform (V18.0 - Intelligence Engineering Edition)

**YemenJPT (Yemen Journalist Pre-trained Transformer)** is a self-hosted, integrated digital ecosystem designed specifically to empower journalists and media organizations in Yemen. The platform enhances press freedom by providing a secure, sovereign environment and a comprehensive suite of tools for Open Source Intelligence (OSINT), information verification, data analysis, and collaborative journalistic work.

This document serves as the primary technical guide for deploying and managing the YemenJPT platform.

---

## ✨ 1. Vision & Core Features

The platform is an all-in-one digital workspace providing critical capabilities for the modern investigative journalist. It is built on the principle of **data sovereignty**, allowing the entire system to run on private infrastructure, ensuring sensitive data never transits through third-party services. A key security feature is the **"Digital Chameleon" panic mode**, allowing an administrator to instantly switch the main application entry point to a decoy website in an emergency.

### Core Platform Modules

| Category                    | Tools & Features                                                                                        | Purpose for Journalists                                                                                           |
| --------------------------- | ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **Cognitive Core (AI)**     | `Ollama`, `Open WebUI`, `Qdrant` (Vector DB), `Langfuse` (Feedback Loop), `LibreTranslate`, `Whisper WebUI` | Accelerates research, transcribes interviews, provides a feedback mechanism for AI improvement, and enables secure translation. |
| **Investigation & OSINT**   | `SearXNG` (Secure Search), `SpiderFoot` (OSINT Automation), `ChangeDetection.io` (Web Monitoring)          | Gathers intelligence from open sources securely, automates reconnaissance, and tracks changes on key websites.      |
| **Media Verification**      | `Meedan Check` (Collaborative Fact-Checking)                                                            | Fights misinformation by providing a robust toolkit to verify the authenticity of images, videos, and claims.     |
| **Collaboration & Workflow**| `Mattermost` (Secure Chat), `Nextcloud` (File Hub), `Webtop` (Secure Browser)                            | Streamlines teamwork, allowing for secure communication, task management, and isolated browsing for risky sites. |
| **Organizational Mgmt.**    | `CiviCRM` (CRM System), Dashy Portals                                                                   | Manages relationships with contacts and donors, and provides role-based dashboards for journalists, admins, and verifiers. |
| **Security**                | Cloudflare Tunnel, Internal Nginx Proxy (Digital Chameleon)                                             | Secures the entire platform without opening server ports and provides an emergency decoy mechanism.               |

---

## 🏗️ 2. Architecture Overview

The application is built on a modern, containerized architecture designed for security, portability, and ease of management.

-   **Gateway**: **Cloudflare Tunnel** acts as the single, secure entry point. It connects the internal services to the Cloudflare network without exposing any public ports on the server, mitigating a wide range of network-based attacks.
-   **Orchestration**: The entire stack is managed and orchestrated via **Docker Compose**, defining all services, volumes, and networks in a single, declarative file.
-   **Frontend**: A zoneless **Angular** application served by a lightweight **Nginx** container (`yemenjpt_app`).
-   **Backend**: A **Node.js/Express** API server (`backend`) for handling system logging and notifications (e.g., via Telegram).
-   **Databases**: **PostgreSQL** and **MariaDB** serve as robust, persistent data stores for the various platform services.
-   **Internal Proxy & Decoy**: A dedicated **Nginx** container (`internal_proxy`) sits behind the Cloudflare Tunnel. This proxy is the key component of the "Digital Chameleon" panic mode, allowing it to dynamically switch traffic between the real frontend (`yemenjpt_app`) and a harmless decoy site (`decoy_app`).
-   **Dashboards**: **Dashy** is used to create role-specific portals (`ph-portal-journalist`, `ph-portal-admin`, `ph-portal-verifier`), providing a unified and customized user experience.

---

## 🚀 3. Deployment Guide

This guide is for deploying the platform on a fresh **Ubuntu 24.04 LTS** server.

### 3.1. Prerequisites

1.  **Server**: A fresh Ubuntu 24.04 LTS server with root access.
2.  **Domain Name**: A domain you own (e.g., `ph-ye.org`).
3.  **Cloudflare Account**: A free Cloudflare account managing your domain's DNS. You need to have a Cloudflare Tunnel configured.
4.  **Git**: `git` command-line tool installed (`sudo apt install git`).

### 3.2. Automated Installation Steps

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/your-repo/YemenJPT-Platform.git
    cd YemenJPT-Platform
    ```

2.  **Configure Environment File (`.env`)**
    This is the most critical step. Copy the example file and fill out all required values using a text editor like `nano`.
    ```bash
    cp .env.example .env
    nano .env
    ```
    -   **`DOMAIN`**: Your main domain (e.g., `ph-ye.org`).
    -   **`CLOUDFLARE_TUNNEL_TOKEN`**: The token for your Cloudflare Tunnel. This is obtained from the Cloudflare Zero Trust dashboard.
    -   **Passwords**: Use a password manager to generate strong, unique passwords for `UNIFIED_PASS`, `MARIADB_ROOT_PASSWORD`, `POSTGRES_PASSWORD`, and `CIVICRM_DB_PASS`. **Do not use simple or reused passwords.**
    -   **(Optional) `API_KEY`**: Your Google Gemini API key if you plan to use the cloud AI provider.
    -   **(Optional) `TELEGRAM_BOT_TOKEN` / `TELEGRAM_ROOT_CHAT_ID`**: Credentials for the Telegram bot used for system notifications.

3.  **Run the Installation Script**
    Make the script executable and run it as root. It will automate the entire setup process.
    ```bash
    chmod +x install.sh
    sudo ./install.sh
    ```
    The script will:
    -   Install Docker and Docker Compose.
    -   Create all necessary data directories under `/opt/presshouse`.
    -   Copy all configuration files (`docker-compose.yml`, `.env`, dashboards, proxy configs) to `/opt/presshouse`.
    -   Copy the `panic.sh` and `secure.sh` scripts and make them executable.
    -   Launch all services via Docker Compose.
    -   Configure the firewall (UFW) to only allow SSH traffic.

### 3.3. Accessing the Application

After the script finishes, all services will be running securely behind the Cloudflare Tunnel.
-   **Main Application**: `https://ai.your-domain.com`
-   **Journalist Portal**: `https://portal.your-domain.com`
-   **Admin Portal**: `https://sys.your-domain.com`
-   **AI Interface**: `https://ai-ui.your-domain.com`
-   **Team Chat**: `https://chat.your-domain.com`
-   **Secure Files**: `https://files.your-domain.com`

Refer to the final output of the `install.sh` script for a full list of URLs.

---

## 🛡️ 4. Security: Digital Chameleon (Panic Mode)

The "Digital Chameleon" feature allows an administrator to instantly switch the main entry point of the application (`ai.your-domain.com`) to a simple, static decoy page. This is useful in an emergency to hide the platform's interface.

-   **To Activate Panic Mode**:
    ```bash
    sudo /opt/presshouse/panic.sh
    ```
-   **To Restore Normal (Secure) Mode**:
    ```bash
    sudo /opt/presshouse/secure.sh
    ```

---

## 🔧 5. Maintenance & Operations

All operational commands should be run from the main application directory.

-   **Updating the Application**: To apply updates from the Git repository:
    ```bash
    git pull
    sudo ./deploy.sh
    ```
-   **Viewing Logs**: To see real-time logs from all running services:
    ```bash
    cd /opt/presshouse && sudo docker compose logs -f
    ```
-   **Stopping the Application**:
    ```bash
    cd /opt/presshouse && sudo docker compose down
    ```
-   **Starting the Application**:
    ```bash
    cd /opt/presshouse && sudo docker compose up -d
    ```
-   **Backups**: All persistent data is stored in subdirectories within `/opt/presshouse/data`. You must implement a regular backup strategy for this entire directory.

---

## 🔍 6. Troubleshooting

-   **Problem: Services are not starting or are in a restart loop.**
    -   **Solution**: Check the logs (`sudo docker compose -f /opt/presshouse/docker-compose.yml logs -f <service_name>`). Common issues include incorrect passwords in the `.env` file or resource allocation problems.
-   **Problem: Domains are not accessible.**
    -   **Solution**:
        1.  Verify your domain's nameservers are pointing to Cloudflare.
        2.  Check the status of your tunnel in the Cloudflare Zero Trust dashboard.
        3.  Check the `cloudflared` service logs for token errors: `sudo docker logs ph-gateway-tunnel`.
-   **Problem: A specific service is not working (e.g., `chat.your-domain.com`).**
    -   **Solution**: Check the logs for that specific service (e.g., `sudo docker logs ph-mattermost`). The issue is often related to incorrect database credentials defined in the `.env` file.
