# 🇾🇪 YemenJPT Digital Platform (V16.0 - IAM/RBAC Edition)

**YemenJPT (Yemen Journalist Pre-trained Transformer)** is a self-hosted, integrated digital ecosystem designed specifically to empower journalists and media organizations in Yemen. The platform aims to enhance press freedom by providing a secure, sovereign environment and a comprehensive suite of tools for Open Source Intelligence (OSINT), information verification, data analysis, and collaborative journalistic work.

This document serves as the primary technical guide for deploying and managing the YemenJPT platform.

---

## ✨ 1. Vision & Core Features

The platform is an all-in-one digital workspace providing critical capabilities for the modern investigative journalist and their supporting organization. It is built on the principle of **data sovereignty**, allowing the entire system to run on private infrastructure, ensuring sensitive data never transits through third-party services.

### Core Platform Modules

| Category | Tools & Features | Purpose for Journalists |
|---|---|---|
| **Cognitive Core (AI)** | Dual AI Engine (`Gemini`/`Ollama`), Audio Transcription, Document Q&A, Journalism AI Assistants. | Accelerates research, summarizes complex documents, transcribes interviews, and aids in content creation. |
| **Investigation & OSINT** | `SearXNG` (Secure Search), `Sherlock` (Username Search), `SpiderFoot` (OSINT Automation), `Social Analyzer`. | Gathers intelligence from open sources securely and efficiently, mapping digital footprints of individuals and organizations. |
| **Media Verification** | `InVID` (Video), `ExifTool` (Metadata), Deepfake Detectors, `Meedan Check` (Collaborative Fact-Checking). | Fights misinformation by providing a robust toolkit to verify the authenticity of images, videos, and claims. |
| **Geospatial Analysis** | `Ushahidi` (Crowdsourced Reporting), `Kepler.gl` (Data Viz), `Earth Engine` (Satellite Imagery). | Visualizes geographic data to uncover patterns, track events on a map, and analyze environmental changes. |
| **Collaboration & Workflow** | Multi-Project Workspaces, Kanban Boards, Secure Chat, Secure Password Management (`Vaultwarden`). | Streamlines teamwork on investigations, allowing for secure communication, task management, and file sharing. |
| **Archiving & Monitoring** | `ArchiveBox` (Web Archiving), `ChangeDetection.io` (Web Monitoring). | Preserves digital evidence by creating permanent copies of web pages and alerting journalists to changes on key websites. |
| **Organizational Management** | `CiviCRM` (CRM System), Training & Support Portals. | Manages relationships with journalists, contacts, and donors. |
| **Automation** | `n8n` (Workflow Automation) | Connects different tools to create powerful automated workflows, saving time on repetitive tasks. |
| **Publishing** | `Ghost` (Modern Publishing), `TYPO3` (CMS) | Provides platforms to publish final investigative reports and manage the organization's public-facing website. |

---

## 🏗️ 2. Core Application Architecture

The application is built on a modern, containerized architecture designed for simplicity, security, and portability.

- **Frontend**: A zoneless **Angular** application, providing a fast and responsive user experience, served efficiently by **Nginx**.
- **Backend**: A lightweight **Node.js/Express** API server to handle system logging and notifications via a Telegram Bot.
- **Identity & Access**: **Keycloak** provides Single Sign-On (SSO) and centralized user management for all services.
- **Databases**: **PostgreSQL** & **MariaDB** serve as the robust, primary databases for the various platform services.
- **Reverse Proxy**: **Traefik** handles all incoming traffic, automates SSL certificate generation, and routes requests to the appropriate service based on subdomains.
- **Orchestration**: The entire stack is managed and orchestrated via **Docker Compose**, making it easy to deploy, update, and scale.

---

## 🚀 3. Deployment Guide

This guide is for deploying the platform on a fresh **Ubuntu 24.04 LTS** server.

### 3.1. Prerequisites

1.  **Server**: A fresh Ubuntu 24.04 LTS server with root access.
2.  **Domain Name**: A domain you own (e.g., `ph-ye.org`).
3.  **Cloudflare Account**: A free Cloudflare account managing your domain's DNS. You will need your account email, a Zone ID, and an API Token with `DNS:Edit` permissions for your zone.
4.  **Git**: `git` command-line tool installed (`sudo apt install git`).

### 3.2. Automated Installation Steps

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/RaidanPro1/YemenJPT-Platform.git
    cd YemenJPT-Platform
    ```

2.  **Configure Environment File (`.env`)**
    This is the most critical step. Copy the example file and fill out all required values.
    ```bash
    cp .env.example .env
    nano .env
    ```
    -   **Domain & Server IP**: Fill in your main `DOMAIN` and the public IP address of your server (`SERVER_IP`).
    -   **Cloudflare Credentials**: Fill in your `CF_EMAIL`, `CF_ZONE_ID`, and `CF_TOKEN`.
    -   **Passwords**: Use a password manager to generate strong, unique passwords for `UNIFIED_PASS`, `MARIADB_ROOT_PASSWORD`, etc. **Do not use simple passwords.**
    -   **(Optional) AI & Bot Keys**: Add your Google Gemini `API_KEY` and Telegram Bot credentials if you wish to use these features.

3.  **Run the Installation Script**
    Make the script executable and run it as root. It will automate the entire setup process.
    ```bash
    chmod +x install.sh
    sudo ./install.sh
    ```
    The script will install Docker, configure DNS records on Cloudflare, create directories, generate configurations, and launch all services. The first run may take several minutes to download all Docker images.

### 3.3. Accessing the Application

-   After the script finishes, all services will be running with valid SSL certificates.
-   **Journalist Portal:** `https://portal.your-domain.com`
-   **Admin Portal (Command Center):** `https://sys.your-domain.com`
-   **Identity Provider (User Management):** `https://auth.your-domain.com`
-   The main user-facing application is at `https://ai.your-domain.com`.
-   Refer to the final output of the `install.sh` script for a full list of URLs and initial login credentials (e.g., Keycloak admin user/pass).

---

## 🔧 4. Maintenance & Updates

-   **Updating the Application**: To update the frontend or backend code, pull the latest changes from Git and run the `deploy.sh` script.
    ```bash
    git pull
    sudo ./deploy.sh
    ```
-   **Backups**: All persistent data is stored in Docker volumes within `/opt/presshouse`. Implement a regular backup strategy for this entire directory.
-   **Viewing Logs**: To see real-time logs from all running services:
    ```bash
    cd /opt/presshouse && sudo docker compose logs -f
    ```
-   **Stopping the Application**:
    ```bash
    cd /opt/presshouse && sudo docker compose down
    ```

---

## 🔍 5. Troubleshooting

-   **Problem: Services are not starting or are in a restart loop.**
    -   **Solution:** Check the logs (`sudo docker compose -f /opt/presshouse/docker-compose.yml logs -f`). Common issues include incorrect passwords in the `.env` file or port conflicts.
-   **Problem: SSL certificates are not being generated.**
    -   **Solution:**
        1.  Ensure your `CF_TOKEN`, `CF_EMAIL`, and `CF_ZONE_ID` are correct in the `.env` file.
        2.  Verify your domain's nameservers point to Cloudflare.
        3.  Check the Traefik logs for ACME errors: `sudo docker logs ph-gateway`. The logs often indicate if the API token is invalid or has insufficient permissions.