# Deploying CC-Event-Registration to AWS EC2 (Frontend + Backend on the Same EC2)

This guide walks you through deploying both the backend (Express + Node) and the frontend (React + Vite build served by Nginx) on a single AWS EC2 instance.

## Overview

- One EC2 instance will run the backend (Node, PM2) and serve the frontend static build via Nginx.
- Use MongoDB Atlas for the database (recommended) — update `backend/.env` with the Atlas URI.

## Prerequisites

- AWS account with permission to create EC2 instances and security groups
- Domain name (optional but recommended)
- GitHub repo or a way to upload project files to the server
- MongoDB Atlas connection string

## EC2 Instance Setup

1. Launch an EC2 instance (Ubuntu 22.04 LTS recommended).
   - Instance type: t3.micro (or larger for production)
   - Storage: 20–40 GB
   - Security group inbound rules:
     - SSH (TCP 22) from your IP
     - HTTP (TCP 80) from 0.0.0.0/0
     - HTTPS (TCP 443) from 0.0.0.0/0
     - (Optional) custom port 5000 if you want direct backend access (recommended to proxy through Nginx instead)

2. SSH into the instance:

```bash
ssh -i ~/path/to/key.pem ubuntu@EC2_PUBLIC_IP
```

## Install System Packages

```bash
sudo apt update && sudo apt upgrade -y
# Install Node.js 18.x (example)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs build-essential
# Install Nginx
sudo apt install -y nginx
# Install git, certbot, and other tools
sudo apt install -y git nginx certbot python3-certbot-nginx
# Install PM2 globally
sudo npm install -g pm2
```

## Clone Project & Install

```bash
cd /var/www
sudo mkdir event-app && sudo chown $USER:$USER event-app
cd event-app
git clone https://github.com/your/repo.git .
# Backend
cd backend
npm install
# Copy .env and update MONGODB_URI to your Atlas string
cp .env.example .env
# Edit .env: set MONGODB_URI, JWT_SECRET, PORT (5000)
```

## Backend: Start with PM2

```bash
# from backend/ directory
pm run build || true   # only if you have any build step; not required for this express server
pm run dev # optional to test
# Start production with pm2
pm start # or: pm2 start src/index.js --name event-backend
pm2 save
pm2 startup  # follow printed instructions to enable on boot
```

> Note: prefer `pm2 start npm --name "event-backend" -- start` if you use `npm start` script.

## Frontend: Build & Nginx Configuration

```bash
# From project root or frontend/
cd ../frontend
npm install
npm run build
# Copy dist to nginx served directory
sudo mkdir -p /var/www/event-frontend
sudo cp -r dist/* /var/www/event-frontend/
```

Create an Nginx server block (example):

```nginx
# /etc/nginx/sites-available/event-app
server {
    listen 80;
    server_name yourdomain.com; # or EC2_PUBLIC_IP

    root /var/www/event-frontend;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to backend
    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable and test Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/event-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Enable HTTPS (Certbot)

```bash
sudo certbot --nginx -d yourdomain.com
# Follow prompts and enable auto-renewal
```

## Final Notes & Verification

- Ensure `backend/.env` contains a properly URL-encoded password in `MONGODB_URI` and the correct Atlas host.
- Verify backend logs: `pm2 logs event-backend`.
- Verify Nginx: `sudo systemctl status nginx`.
- Test frontend at `http://yourdomain.com` and API at `http://yourdomain.com/api/events`.

## Maintenance & Scaling

- For more capacity, move backend to separate instance and use load balancers.
- Use CloudWatch or other monitoring to track performance.

---

(End of single-EC2 deployment guide)
