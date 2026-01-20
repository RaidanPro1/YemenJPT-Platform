# 🇾🇪 YemenJPT Digital Platform (V15.0 - Polished & Deployable)

**YemenJPT** is a self-hosted, integrated digital ecosystem designed specifically to empower journalists and media organizations in Yemen. The platform aims to enhance press freedom by providing a secure environment and a comprehensive suite of tools for Open Source Intelligence (OSINT), information verification, data analysis, and collaborative work.

This document serves as the primary technical guide for deploying and managing the core YemenJPT application.

---

## ✨ 1. Vision & Core Features

The platform is an all-in-one digital workspace providing critical capabilities for the modern investigative journalist and their supporting organization. It is built on the principle of data sovereignty, allowing the entire system to run on private infrastructure.

### Core Platform Modules (Full Vision)

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

### 🚀 Advanced Admin Dashboard

- **Service Management**: Activate, deactivate, and monitor all platform tools.
- **AI Provider Control**: Switch between Google Gemini (cloud) and a private, local LLM (Ollama) to ensure privacy.
- **AI Feedback Loop**: Review user ratings of AI interactions to prepare fine-tuning datasets.
- **Security Dashboard**: Monitor and manage basic security settings.
- **Role-Based Access Control (RBAC)**: Fine-grained control over user access (`super-admin`, `editor-in-chief`, `investigative-journalist`) for each tool.
- **SEO Management**: Directly edit the public-facing platform title, description, and keywords.
- **User Management**: A professional interface to add, edit, and suspend user accounts.
- **Social Login Configuration**: A `super-admin`-level interface to manage OAuth credentials.
- **AI Model Training**: A `super-admin`-level dashboard to review training data and initiate model fine-tuning jobs.

## 🏗️ 2. Core Application Architecture

The deployable application is built on a modern, containerized architecture.

- **Frontend**: A zoneless **Angular** application, built and served efficiently by **Nginx**. This single application serves both the public Press House homepage (`ph-ye.org`) and the authenticated YemenJPT platform (`ai.ph-ye.org`).
- **Backend**: A lightweight **Node.js/Express** API server to handle requests and connect to the database. This is where the application's core logic will reside.
- **Database**: **PostgreSQL** serves as the robust, primary database for storing user data, tool configurations, and other application state.
- **Orchestration**: The entire stack is managed and orchestrated via **Docker Compose**, making it easy to deploy and scale.

## 🚀 3. Deployment Guide (Docker)

This guide provides simple, universal steps to deploy the YemenJPT application using Docker.

### 3.1. Prerequisites

1.  **Server**: Any server with Docker and Docker Compose installed.
2.  **Domain Name**: A domain name (`your-domain.org`) pointed at your server's public IP address. You should also point a subdomain (e.g., `ai.your-domain.org`) to the same IP.
3.  **Reverse Proxy**: It is **strongly recommended** to run this application behind a reverse proxy like Traefik, Caddy, or Nginx Proxy Manager to handle HTTPS/SSL certificates.

### 3.2. Installation Steps

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/YourUsername/YemenJPT-Platform.git
    cd YemenJPT-Platform
    ```

2.  **Configure Environment File (`.env`)**
    This is the most critical step. Copy the example file and fill it out.
    ```bash
    cp .env.example .env
    nano .env
    ```
    -   Fill in all required database credentials. **Use a password manager to generate strong, unique passwords.**
    -   (Optional) Add your Google Gemini `API_KEY` to enable the cloud AI provider.

3.  **Run the Deployment Script**
    This script will build the necessary Docker images and start all services in the correct order.
    ```bash
    chmod +x deploy.sh
    ./deploy.sh
    ```

### 3.3. Post-Installation & Domain Setup

-   After the script finishes, the application will be running. Configure your reverse proxy to point traffic for **both** your main domain (e.g., `ph-ye.org`) and your platform subdomain (e.g., `ai.ph-ye.org`) to the `frontend` service at `http://localhost:8080`.
-   The application is designed so that the main domain shows the public homepage, and users are directed to the platform experience upon logging in.
-   The backend API will be automatically proxied by the frontend's Nginx container.

## 📂 4. File Structure for GitHub

When pushing this project to a GitHub repository, it's important to include only the source code and configuration templates, not sensitive data or large dependency folders.

-   **Included Files**: All source code (`src/`, `backend/`), configuration files (`*.yml`, `*.conf`, `*.json`), and scripts (`deploy.sh`, `Dockerfile`) should be committed. The `.env.example` file is crucial as a template for new installations.
-   **Excluded Files**: The `.gitignore` file is configured to automatically exclude:
    -   The `.env` file, which contains your secret keys and passwords.
    -   `node_modules` directories and build artifacts.

This ensures that anyone cloning the repository gets the complete application source without any sensitive credentials.

## 🔧 5. Maintenance & Updates

-   **Updating the Application**: Pull the latest changes from your Git repository and re-run the deployment script:
    ```bash
    git pull
    ./deploy.sh
    ```
-   **Backups**: All persistent data is stored in Docker volumes. The `docker-compose.yml` file specifies a volume named `postgres_data`. You should implement a regular backup strategy for this volume. A simple method is to use a container that runs `pg_dump`.

---

## 🔗 6. Full System Vision Links (For Expanded Deployments)

The provided `dashy.conf.yml` contains the configuration for a much larger ecosystem of self-hosted tools. If you choose to expand your deployment to include these services, the following links serve as a reference:

| Service                | URL                             |
| :--------------------- | :------------------------------ |
| **Unified Portal**     | `https://portal.your-domain.org`  |
| **ERP System**         | `https://erp.your-domain.org`     |
| **Fact-Checking**      | `https://check.your-domain.org`   |
| **Publishing (Ghost)** | `https://publish.your-domain.org` |
| **Geospatial Viz**     | `https://maps.your-domain.org`    |
| **System Admin**       | `https://sys.your-domain.org`     |
| **Mail Admin**         | `https://mail.your-domain.org`    |
| **Automation (n8n)**   | `https://auto.your-domain.org`    |
| **Code Repository**    | `https://git.your-domain.org`     |
