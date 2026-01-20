# 🇾🇪 YemenJPT Digital Platform (V15.0 - Polished & Deployable)

**YemenJPT** is a self-hosted, integrated digital ecosystem designed specifically to empower journalists and media organizations in Yemen. The platform aims to enhance press freedom by providing a secure environment and a comprehensive suite of tools for Open Source Intelligence (OSINT), information verification, data analysis, and collaborative work.

This document serves as the primary technical guide for deploying and managing the core YemenJPT application.

---

## ✨ 1. Vision & Core Features

The platform is an all-in-one digital workspace providing critical capabilities for the modern investigative journalist and their supporting organization. It is built on the principle of data sovereignty, allowing the entire system to run on private infrastructure.

### Core Platform Modules

| Category                               | Tools & Features                                                                                                                              |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **Investigation & OSINT**              | `SearXNG` (Secure Search), `Sherlock` (Username Search), `Snscrape` (Data Scraping), `Mediacloud` (Media Analysis), **`SpiderFoot`** (OSINT Automation), **`Social Analyzer`** (Digital Footprint), **`Harvester (AP)`** (Data Collection). |
| **Media Verification & Forensics**     | `InVID` (Video), `ExifTool` (Metadata), `FotoForensics`, **`Mean Check`** (Collaborative Fact-Checking), **`Loki`** (Automated Verification), **`Aletheia`** & Deepfake Detectors. |
| **Cognitive Core (YemenGPT)**          | **Dual AI Engine** (`Google Gemini` or local `Ollama`), `Whisper` (Transcription), `Haystack` (Document Q&A), **`Brainerd Dispatch AI`** & `Quaily` (Journalism AI), `Bitbat.ai` (Source Discovery), **Google Colab** integration.      |
| **Financial & Data Journalism** | **`ArkhamMirror`** (Crypto Tracking), **`OpenDuka`** (Corporate Data). |
| **Indicator Lab (IndiLab)**            | `ChangeDetection.io` (Change Monitoring), `ADSBexchange` (Flight Tracking), `NASA FIRMS` (Fire Monitoring).                                           |
| **Organizational Management**          | **`ERPNext`** (Accounting, HR, CRM), for managing internal operations. |
| **Productivity & Workflow**            | **`Vaultwarden`** (Passwords), **`ToolJet`** (Internal Tools), **`Chatwoot`** (Secure Inbox), **`NocoDB`** (Flexible Databases). |
| **Geospatial Analysis**                | **`Ushahidi`** (Crowdsourced Reporting), **`Kepler.gl`** (Large-scale Data Viz), **`QGIS Server`** (Map Publishing). |
| **Content Publishing (CMS)**           | **`Ghost`** (Modern Publishing), `TYPO3 13 LTS` (Enterprise CMS). |
| **Archiving & Data Security**          | `ArchiveBox` (Web Archiving), **`Webrecorder`** (Interactive Archiving). |
| **Collaboration & Automation**         | `Nextcloud` (Files), `Mattermost` (Chat), `Gitea` (Code), `JupyterHub` (Data Journalism), `n8n` (Automation).                                                    |
| **System & Content Management**        | `Glances` (System Monitoring), `Dashy` (Unified Portal), `Uptime Kuma` (Service Status). |


## 🏗️ 2. Core Application Architecture

The application is built on a modern, containerized architecture designed for simplicity and portability.

- **Frontend**: A zoneless **Angular** application, built and served efficiently by **Nginx**.
- **Backend**: A lightweight **Node.js/Express** API server to handle logging, notifications, and future API needs.
- **Database**: **PostgreSQL** serves as the robust, primary database for storing user data, tool configurations, and other application state.
- **Reverse Proxy**: **Traefik** handles incoming traffic, automates SSL certificate generation via Let's Encrypt and Cloudflare, and routes requests to the appropriate service.
- **Orchestration**: The entire stack is managed and orchestrated via **Docker Compose**, making it easy to deploy and scale.

## 🚀 3. Deployment Guide (Docker)

This guide provides simple, universal steps to deploy the YemenJPT core application using Docker.

### 3.1. Prerequisites

1.  **Server**: Any machine (local or cloud) with **Docker** and **Docker Compose** installed.
2.  **Git**: The `git` command-line tool for cloning the repository.
3.  **Cloudflare Account**: A Cloudflare account managing your domain's DNS.

### 3.2. Installation Steps

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/YourUsername/YemenJPT-Platform.git
    cd YemenJPT-Platform
    ```

2.  **Configure Environment File (`.env`)**
    This is the most critical step. Copy the example file and fill out the required values.
    ```bash
    cp .env.example .env
    nano .env
    ```
    -   **Domain & SSL**: Fill in your `DOMAIN`, `CF_EMAIL`, and `CF_TOKEN` to enable automatic HTTPS via Traefik and Cloudflare.
    -   **Database**: Fill in all required `POSTGRES_...` credentials. **Use a password manager to generate strong, unique passwords.**
    -   **(Optional) AI Services**: Add your Google Gemini `API_KEY` to enable the cloud AI provider.
    -   **(Optional) Notifications**: Add your `TELEGRAM_BOT_TOKEN` and `TELEGRAM_ROOT_CHAT_ID` to enable system notifications.

3.  **Run the Deployment Script**
    This script will build the necessary Docker images from the source code and start all services.
    ```bash
    chmod +x deploy.sh
    ./deploy.sh
    ```

### 3.3. Accessing the Application

-   After the script finishes, the services will start. Traefik will automatically obtain an SSL certificate from Let's Encrypt via Cloudflare.
-   The application will be accessible at `https://your-domain.com` (as configured in your `.env` file).
-   Ensure that ports 80 and 443 are open on your server's firewall.

## 🔧 4. Maintenance & Updates

-   **Updating the Application**: Pull the latest changes from your Git repository and re-run the deployment script:
    ```bash
    git pull
    ./deploy.sh
    ```
    The script will rebuild only the components that have changed and restart the services.
-   **Backups**: All persistent data is stored in Docker volumes (`postgres_data`, `traefik_data`). You should implement a regular backup strategy for these volumes.
-   **Viewing Logs**: To see the real-time logs from all running services, use the command:
    ```bash
    docker compose logs -f
    ```
-   **Stopping the Application**: To stop all services, run:
    ```bash
    docker compose down
    ```
