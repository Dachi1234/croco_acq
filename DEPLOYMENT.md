# Crocobet Offers — Deployment Guide

## Project Overview

Crocobet Offers is a content platform (blog + promotions) consisting of three services:

| Service | Tech Stack | Description |
|---------|-----------|-------------|
| **Blog** | Next.js 15 (SSR/ISR) | Public-facing website at `offers.crocobet.com` |
| **Admin Panel** | React (Vite) SPA | Internal CMS at `admin-offers.crocobet.com` |
| **API Server** | Node.js (Fastify) | Split into **public API** (read-only) and **admin API** (full CRUD) |

**Database**: PostgreSQL hosted on Neon (cloud). No database container needed.

---

## Architecture

```
                    Internet
                       │
         ┌─────────────┼──────────────┐
         │             │              │
    ┌────▼────┐   ┌────▼────┐   ┌────▼────┐
    │ Machine 1│   │   Neon  │   │Machine 2│
    │ (public) │   │  (DB)   │   │ (VPN)   │
    └─────────┘   └─────────┘   └─────────┘
```

### Machine 1 — Public (offers.crocobet.com)

```
Host Nginx (:443 SSL)
  ├── /           → blog container (:3001)
  ├── /api/       → public-api container (:3003)
  └── /uploads/   → proxied to Machine 2 (:3004)

Docker containers:
  • blog (Next.js standalone)          → port 3001
  • public-api (Fastify, read-only)    → port 3003
```

### Machine 2 — Internal VPN (admin-offers.crocobet.com)

```
Host Nginx (:443 SSL)
  ├── /           → admin container (:3002), which internally proxies:
  │     ├── /api/      → admin-api container (:3004)
  │     └── /uploads/  → admin-api container (:3004)
  └── /uploads/   → admin-api container (:3004)  [for Machine 1 proxy]

Docker containers:
  • admin (Nginx serving static SPA)   → port 3002
  • admin-api (Fastify, full CRUD)     → port 3004
    └── /data/uploads/ volume          (persistent storage for uploaded files)
```

### Key data flows

- **Blog SSR** fetches articles/promotions from `public-api` via Docker network (`http://public-api:3003`)
- **Admin panel** sends CRUD requests to `admin-api` via the admin Nginx proxy
- **Admin API** triggers blog cache revalidation via HTTPS to `https://offers.crocobet.com/api/revalidate`
- **Uploaded images** are stored on Machine 2; Machine 1 proxies `/uploads/` requests to Machine 2 with 30-day cache

---

## Prerequisites

On **both machines**:
- Linux (Ubuntu 22.04+ recommended)
- Docker Engine 24+ and Docker Compose v2
- Nginx (installed on the host, outside Docker)
- SSL certificates for the respective domain

On **Machine 2** only:
- The machine must be accessible from Machine 1 on port 3004 (for `/uploads/` proxy)
- The machine should be restricted to VPN/internal network

---

## Step-by-Step Setup

### 1. Clone the repository (both machines)

```bash
cd ~
git clone https://gitlab.crocobet.com/crocosquad1/crocobet-offers.git
cd crocobet-offers
```

### 2. Generate secrets (once, on any machine)

```bash
# Generate BLOG_REVALIDATE_SECRET (shared by both machines)
openssl rand -hex 32
# Example output: a1b2c3d4e5f6...

# Generate BETTER_AUTH_SECRET (Machine 2 only)
openssl rand -hex 32
# Example output: f6e5d4c3b2a1...
```

Save these values — you'll need them in the next step.

### 3. Create environment files

#### Machine 1: `~/crocobet-offers/docker/.env.machine1`

```env
DATABASE_URL=postgresql://neondb_owner:<PASSWORD>@<NEON_HOST>/neondb?sslmode=require
SERVER_PORT=3003
BLOG_REVALIDATE_SECRET=<the value you generated>
```

#### Machine 2: `~/crocobet-offers/docker/.env.machine2`

```env
DATABASE_URL=postgresql://neondb_owner:<PASSWORD>@<NEON_HOST>/neondb?sslmode=require
ADMIN_PORT=3004
BETTER_AUTH_SECRET=<the value you generated>
BLOG_REVALIDATE_SECRET=<SAME value as Machine 1>
UPLOAD_DIR=/data/uploads
PUBLIC_URL=https://offers.crocobet.com
```

> **IMPORTANT**: `BLOG_REVALIDATE_SECRET` must be identical on both machines. It authenticates revalidation requests from admin to blog.

### 4. Configure host Nginx

#### Machine 1: `/etc/nginx/sites-enabled/offers.crocobet.com`

Copy the contents of `docker/nginx-machine1.conf` from the repo.

**Replace** `MACHINE2_INTERNAL_IP` with Machine 2's actual internal IP address.

**Replace** SSL certificate paths with your actual cert/key paths (or use certbot).

```bash
sudo cp ~/crocobet-offers/docker/nginx-machine1.conf /etc/nginx/sites-enabled/offers.crocobet.com
sudo nano /etc/nginx/sites-enabled/offers.crocobet.com  # edit the placeholders
sudo nginx -t && sudo systemctl reload nginx
```

#### Machine 2: `/etc/nginx/sites-enabled/admin-offers.crocobet.com`

Copy the contents of `docker/nginx-machine2.conf` from the repo.

**Replace** `MACHINE1_IP` with Machine 1's IP (for the upload proxy allow rule).

**Uncomment and adjust** the `allow`/`deny` rules to restrict access to VPN IPs.

```bash
sudo cp ~/crocobet-offers/docker/nginx-machine2.conf /etc/nginx/sites-enabled/admin-offers.crocobet.com
sudo nano /etc/nginx/sites-enabled/admin-offers.crocobet.com  # edit the placeholders
sudo nginx -t && sudo systemctl reload nginx
```

### 5. Start Docker containers

#### Machine 1:

```bash
cd ~/crocobet-offers
docker compose -f docker/docker-compose.blog.yml up -d
```

Verify:
```bash
docker compose -f docker/docker-compose.blog.yml ps
# Should show: public-api (healthy), blog (healthy)

curl -s http://localhost:3003/api/health
# Should return: {"status":"ok","mode":"public"}

curl -s http://localhost:3001
# Should return HTML
```

#### Machine 2:

```bash
cd ~/crocobet-offers
docker compose -f docker/docker-compose.admin.yml up -d
```

Verify:
```bash
docker compose -f docker/docker-compose.admin.yml ps
# Should show: admin-api (healthy), admin (running)

curl -s http://localhost:3004/api/health
# Should return: {"status":"ok","mode":"admin"}

curl -s http://localhost:3002
# Should return HTML (admin SPA)
```

### 6. Create the first admin user

On Machine 2, run:

```bash
curl -X POST https://admin-offers.crocobet.com/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@crocobet.com", "password": "YourSecurePassword", "name": "Admin"}'
```

> Note: Sign-up is disabled in production config (`disableSignUp: true` in auth config). To create the first user, temporarily enable it or insert directly into the database.

### 7. Verify end-to-end

- [ ] `https://offers.crocobet.com` — blog loads, articles/promotions display
- [ ] `https://offers.crocobet.com/api/health` — returns `{"status":"ok","mode":"public"}`
- [ ] `https://admin-offers.crocobet.com` — admin panel login page
- [ ] Upload an image via admin → verify it loads at `https://offers.crocobet.com/uploads/<filename>`
- [ ] Publish an article via admin → verify it appears on the blog within 60 seconds

---

## DNS Records

| Record | Type | Value |
|--------|------|-------|
| `offers.crocobet.com` | A | Machine 1 public IP |
| `admin-offers.crocobet.com` | A | Machine 2 internal/VPN IP |

---

## Ports Summary

| Machine | Port | Bound to | Service |
|---------|------|----------|---------|
| 1 | 443 | 0.0.0.0 | Host Nginx (SSL) |
| 1 | 3001 | 127.0.0.1 | Blog (Next.js) |
| 1 | 3003 | 127.0.0.1 | Public API (Fastify) |
| 2 | 443 | 0.0.0.0 | Host Nginx (SSL) |
| 2 | 3002 | 127.0.0.1 | Admin (Nginx SPA) |
| 2 | 3004 | 127.0.0.1 | Admin API (Fastify) |

All application ports are bound to `127.0.0.1` — only accessible through the host Nginx reverse proxy.

---

## Firewall Rules

| From | To | Port | Purpose |
|------|----|------|---------|
| Internet | Machine 1 | 443 | Public website |
| Machine 1 | Machine 2 | 3004 | Upload proxy (`/uploads/`) |
| Machine 2 | Machine 1 | 443 | Cache revalidation (`POST /api/revalidate`) |
| Both machines | Neon | 5432 | Database |
| VPN only | Machine 2 | 443 | Admin panel access |

---

## CI/CD (GitLab)

The `.gitlab-ci.yml` in the repo automates build and deploy on every push to `main`.

### Required GitLab CI/CD Variables

Set these in **GitLab > Settings > CI/CD > Variables**:

| Variable | Description | Protected | Masked |
|----------|-------------|-----------|--------|
| `DEPLOY_SSH_KEY` | Private SSH key for the `deploy` user on both machines | Yes | Yes |
| `MACHINE1_HOST` | Machine 1 hostname or IP | Yes | No |
| `MACHINE2_HOST` | Machine 2 hostname or IP | Yes | No |
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager ID (e.g. `GTM-WRMD8Z5`) | No | No |

> `CI_REGISTRY`, `CI_REGISTRY_USER`, `CI_REGISTRY_PASSWORD` are provided automatically by GitLab.

### Pipeline flow

```
git push to main
    ↓
BUILD (parallel):
  • build_public_api  → registry.gitlab.crocobet.com/.../public-api:latest
  • build_admin_api   → registry.gitlab.crocobet.com/.../admin-api:latest
  • build_blog        → registry.gitlab.crocobet.com/.../blog:latest
  • build_admin       → registry.gitlab.crocobet.com/.../admin:latest
    ↓
DEPLOY (parallel):
  • deploy_machine1 → SSH, pull images, docker compose up
  • deploy_machine2 → SSH, pull images, docker compose up
```

### SSH setup for deploy

On **both machines**, create a `deploy` user with Docker access:

```bash
sudo useradd -m -G docker deploy
sudo mkdir -p /home/deploy/.ssh
# Add the public key corresponding to DEPLOY_SSH_KEY:
echo "ssh-rsa AAAA..." | sudo tee /home/deploy/.ssh/authorized_keys
sudo chown -R deploy:deploy /home/deploy/.ssh
sudo chmod 600 /home/deploy/.ssh/authorized_keys
```

---

## Updating / Redeploying

### Automated (via CI/CD)

Push to `main` — pipeline builds and deploys automatically.

### Manual

On each machine:

```bash
cd ~/crocobet-offers
git pull

# Machine 1:
docker compose -f docker/docker-compose.blog.yml pull
docker compose -f docker/docker-compose.blog.yml up -d --remove-orphans

# Machine 2:
docker compose -f docker/docker-compose.admin.yml pull
docker compose -f docker/docker-compose.admin.yml up -d --remove-orphans
```

---

## Logs and Debugging

```bash
# View logs (Machine 1)
docker compose -f docker/docker-compose.blog.yml logs -f
docker compose -f docker/docker-compose.blog.yml logs -f public-api
docker compose -f docker/docker-compose.blog.yml logs -f blog

# View logs (Machine 2)
docker compose -f docker/docker-compose.admin.yml logs -f
docker compose -f docker/docker-compose.admin.yml logs -f admin-api

# Check container health
docker compose -f docker/docker-compose.blog.yml ps
docker compose -f docker/docker-compose.admin.yml ps

# Restart a single service
docker compose -f docker/docker-compose.blog.yml restart blog

# View uploaded files (Machine 2)
docker compose -f docker/docker-compose.admin.yml exec admin-api ls /data/uploads/
```

---

## File Map

```
docker/
├── Dockerfile.server         # Builds public-api OR admin-api (ARG ENTRY selects which)
├── Dockerfile.blog           # Builds Next.js standalone blog
├── Dockerfile.admin          # Builds Vite SPA → served by Nginx
├── docker-compose.blog.yml   # Machine 1: blog + public-api
├── docker-compose.admin.yml  # Machine 2: admin + admin-api
├── nginx-admin.conf          # Nginx config INSIDE the admin Docker container
├── nginx-machine1.conf       # Host Nginx config for Machine 1
├── nginx-machine2.conf       # Host Nginx config for Machine 2
└── .env.example              # Template for .env.machine1 and .env.machine2
```
