# Deploying CC-Event-Registration to AWS EC2 (Frontend and Backend on Separate EC2 Instances)

This guide covers deploying the backend on one EC2 instance and the frontend on another (or multiple) instances. This is better for scaling and security.

## Architecture Overview

- `backend-ec2`: runs Node/Express + PM2; connects to MongoDB Atlas
- `frontend-ec2`: serves static build via Nginx (or via CDN)
- Use an Elastic Load Balancer (ELB) or Route 53 to route traffic if you have multiple frontends

## Prerequisites

- Two EC2 instances (Ubuntu 22.04 LTS recommended)
- Domain(s) and DNS control (Route 53 or external)
- MongoDB Atlas connection string

## Security Groups

- `backend-sg`: allow SSH (22) from admin, allow inbound from `frontend-sg` on port 5000 (if using direct API calls), or only allow ELB.
- `frontend-sg`: allow HTTP/HTTPS from 0.0.0.0/0, allow SSH from admin IP.

## Backend Instance Setup

1. Launch EC2 instance for backend.
2. SSH into instance and install Node, git, pm2 (same steps as single instance):

```bash
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs build-essential git
sudo npm install -g pm2
```

3. Clone project and install backend deps:

```bash
cd /var/www
mkdir backend && chown $USER:$USER backend
cd backend
git clone https://github.com/your/repo.git .
cd backend
npm install
cp .env.example .env
# Edit .env: set MONGODB_URI to Atlas (URL-encode password), JWT_SECRET
```

4. Start backend with PM2 and secure it behind Nginx or an ELB:

```bash
pm2 start src/index.js --name event-backend
pm2 save
pm2 startup
```

5. (Optional) Set up Nginx on backend to respond only to internal frontend/ELB requests and serve health check endpoint.

## Frontend Instance Setup

1. Launch EC2 instance for frontend.
2. SSH and install Nginx & git:

```bash
sudo apt update && sudo apt install -y nginx git certbot python3-certbot-nginx
```

3. Clone project and build frontend:

```bash
cd /var/www
mkdir event-frontend && chown $USER:$USER event-frontend
cd event-frontend
git clone https://github.com/your/repo.git .
cd frontend
npm install
npm run build
sudo cp -r dist/* /var/www/event-frontend/
```

4. Configure Nginx to serve static files and proxy `/api` to backend's public endpoint (or ELB):

```nginx
server {
  listen 80;
  server_name frontend.yourdomain.com;

  root /var/www/event-frontend;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }

  # Proxy API calls to backend (use internal IP or load balancer)
  location /api/ {
    proxy_pass http://BACKEND_PRIVATE_IP:5000/api/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }
}
```

5. Enable HTTPS with Certbot:

```bash
sudo certbot --nginx -d frontend.yourdomain.com
```

## DNS & Load Balancing

- Point `frontend.yourdomain.com` to the frontend EC2 public IP (or ELB)
- For production, put frontend instances behind an Application Load Balancer and use Route 53 for DNS
- Backend should not be publicly accessible unless behind ELB or restricted by security group rules

## CORS & Environment

- Update `frontend/src/api/eventAPI.js` baseURL to point to the frontend domain (`/api`) so Nginx proxies it; or use full backend URL.
- Ensure backend `MONGODB_URI` is set to Atlas and password is URL-encoded.

## Health Checks & Monitoring

- Configure PM2 monitoring: `pm2 monit`
- Add health endpoint in backend (e.g., `/health`) and configure ELB health checks to use it

## Rolling Updates

- To update backend: `git pull`, `npm install`, `pm2 reload event-backend`
- To update frontend: `git pull`, `npm install`, `npm run build`, `sudo cp -r dist/* /var/www/event-frontend/`, `sudo systemctl reload nginx`

## Optional: Use S3 + CloudFront for Frontend

- For production, consider uploading `dist/` to an S3 bucket and serve via CloudFront for higher availability and caching.

## Final Verification Steps

- Frontend: visit `https://frontend.yourdomain.com` and browse events
- API: visit `https://frontend.yourdomain.com/api/events` (proxied) or direct backend health check if allowed
- Check PM2 logs and Nginx logs for errors

---

(End of separate-EC2 deployment guide)
