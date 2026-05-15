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
git clone https://github.com/NitishP1710/CC_Event_management.git .

# Backend setup
cd backend
npm install

# Create .env file with required variables
cat > .env << EOF
MONGODB_URI=your_mongodb_atlas_connection_string_here
PORT=5000
NODE_ENV=production
EOF

# Edit .env: replace MONGODB_URI with your actual MongoDB Atlas connection string
nano .env
```

## Backend: Start with PM2

```bash
# From backend/ directory
npm install  # if not already done

# Start production with pm2
pm2 start src/index.js --name event-backend
# or if you prefer using npm start script:
# pm2 start npm --name event-backend -- start

# Save PM2 process list and enable auto-start on reboot
pm2 save
pm2 startup
# Follow the printed instructions to enable PM2 on system boot
```

View logs:

```bash
pm2 logs event-backend
pm2 status
```

## Frontend: Build & Nginx Configuration

```bash
# From project root
cd ../frontend
npm install
npm run build

# Copy dist to nginx served directory
sudo mkdir -p /var/www/event-frontend
sudo chown $USER:$USER /var/www/event-frontend
cp -r dist/* /var/www/event-frontend/
```

Create an Nginx server block:

```nginx
# /etc/nginx/sites-available/event-app
server {
    listen 80;
    server_name _;  # Replace with yourdomain.com later

    # Serve frontend
    root /var/www/event-frontend;
    index index.html;

    # React Router: redirect all non-file requests to index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to backend (Node.js running on port 5000)
    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
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

**Backend environment variables** (`backend/.env`):

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/event_db?retryWrites=true&w=majority
PORT=5000
NODE_ENV=production
```

**Verification checklist:**

```bash
# Check backend is running
pm2 status
pm2 logs event-backend

# Check Nginx is running
sudo systemctl status nginx

# Test API endpoint
curl http://localhost:5000/api/events

# Test frontend is served
curl http://localhost/
```

**Access your application:**

- Frontend: `http://EC2_PUBLIC_IP` or `http://yourdomain.com`
- API directly (if needed): `http://EC2_PUBLIC_IP:5000/api/events`
- All API calls from frontend should go through `http://yourdomain.com/api/`

## Maintenance & Scaling

- For more capacity, move backend to separate instance and use load balancers.
- Use CloudWatch or other monitoring to track performance.

## Troubleshooting

**Backend not connecting to MongoDB:**

- Verify Atlas connection string in `backend/.env`
- Ensure IP address is whitelisted in Atlas cluster settings (or allow 0.0.0.0/0 for testing)
- Check PM2 logs: `pm2 logs event-backend`

**Frontend shows 404 errors:**

- Verify Nginx config: `sudo nginx -t`
- Restart Nginx: `sudo systemctl restart nginx`
- Check frontend files are copied: `ls -la /var/www/event-frontend/`

**API calls failing (CORS or 502 errors):**

- Verify backend is running: `pm2 status`
- Check backend is listening on 5000: `netstat -tlnp | grep 5000`
- Review Nginx proxy configuration and logs: `sudo tail -f /var/log/nginx/error.log`

**Enable SSH key authentication:**

```bash
# On your local machine
ssh-copy-id -i ~/.ssh/id_rsa.pub ubuntu@EC2_PUBLIC_IP
# Then disable password auth on the server
sudo sed -i 's/PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo systemctl restart ssh
```

---

(End of single-EC2 deployment guide)
