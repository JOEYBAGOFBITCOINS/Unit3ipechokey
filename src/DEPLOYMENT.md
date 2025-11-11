# EchoKey Deployment Guide

Complete deployment instructions for various platforms and environments.

---

## Table of Contents

1. [Quick Start (No Installation)](#quick-start-no-installation)
2. [Local Development](#local-development)
3. [Docker Deployment](#docker-deployment)
4. [Production Deployment](#production-deployment)
5. [Environment Variables](#environment-variables)
6. [Security Checklist](#security-checklist)

---

## Quick Start (No Installation)

EchoKey is a **frontend-only application** that runs entirely in the browser.

### Prerequisites

- Modern web browser (Chrome, Firefox, Edge, Safari)
- MetaMask browser extension (optional, for wallet features)

### Running the App

1. Open `index.html` in your browser
2. Click "Connect Wallet" to use MetaMask features
3. Create transactions and test the split-signal flow

That's it! No server, no build tools required.

---

## Local Development

For developers who want to modify the code or run with hot-reload.

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm or yarn package manager
- Git

### Setup Steps

```bash
# 1. Clone the repository (or download the files)
git clone https://github.com/yourusername/echokey.git
cd echokey

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open browser
# Navigate to http://localhost:5173 (or the port shown in terminal)
```

### Development Scripts

```json
{
  "scripts": {
    "dev": "vite",                    // Start dev server
    "build": "vite build",            // Build for production
    "preview": "vite preview",        // Preview production build
    "lint": "eslint . --ext ts,tsx",  // Run linter
    "type-check": "tsc --noEmit"      // Check TypeScript
  }
}
```

### Project Configuration

**vite.config.ts** (create if not exists):

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
```

---

## Docker Deployment

Containerized deployment for consistent environments.

### Dockerfile

Create `Dockerfile` in project root:

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf

Create `nginx.conf` for routing:

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  echokey:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost/"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

volumes:
  echokey_data:
```

### Build and Run

```bash
# Build the image
docker build -t echokey:latest .

# Run the container
docker run -d -p 3000:80 --name echokey echokey:latest

# Or use docker-compose
docker-compose up -d

# View logs
docker logs -f echokey

# Stop and remove
docker-compose down
```

---

## Production Deployment

### Option 1: Vercel (Recommended for Frontend)

**Easiest deployment for static sites.**

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

**vercel.json** configuration:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

### Option 2: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy

# Deploy to production
netlify deploy --prod
```

**netlify.toml** configuration:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
```

### Option 3: AWS S3 + CloudFront

**Step 1: Build the application**

```bash
npm run build
```

**Step 2: Create S3 bucket**

```bash
# Create bucket
aws s3 mb s3://echokey-app

# Enable static website hosting
aws s3 website s3://echokey-app \
  --index-document index.html \
  --error-document index.html

# Upload files
aws s3 sync dist/ s3://echokey-app --delete

# Set public read permissions
aws s3api put-bucket-policy \
  --bucket echokey-app \
  --policy file://bucket-policy.json
```

**bucket-policy.json**:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::echokey-app/*"
    }
  ]
}
```

**Step 3: Create CloudFront distribution**

```bash
aws cloudfront create-distribution \
  --origin-domain-name echokey-app.s3.amazonaws.com \
  --default-root-object index.html
```

### Option 4: AWS EC2 with Docker

**Step 1: Launch EC2 instance**

```bash
# Amazon Linux 2 AMI
# t3.small or larger
# Security group: Allow HTTP (80), HTTPS (443), SSH (22)
```

**Step 2: Connect and install Docker**

```bash
# Connect to instance
ssh -i key.pem ec2-user@your-instance-ip

# Install Docker
sudo yum update -y
sudo yum install docker -y
sudo service docker start
sudo usermod -a -G docker ec2-user

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" \
  -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

**Step 3: Deploy application**

```bash
# Clone repository
git clone https://github.com/yourusername/echokey.git
cd echokey

# Build and run
docker-compose up -d

# Set up auto-start on reboot
sudo systemctl enable docker
```

**Step 4: Configure Nginx reverse proxy (optional)**

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Option 5: GitHub Pages

**Step 1: Update vite.config.ts**

```typescript
export default defineConfig({
  base: '/echokey/', // Your repo name
  // ... other config
});
```

**Step 2: Create deployment script**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

**Step 3: Enable GitHub Pages**

- Go to repository Settings → Pages
- Select `gh-pages` branch as source
- Save

---

## Environment Variables

### Production Environment File

Create `.env.production`:

```bash
# Application
NODE_ENV=production
VITE_APP_NAME=EchoKey
VITE_APP_VERSION=1.0.0

# API Configuration (for future backend)
VITE_API_URL=https://api.echokey.com
VITE_API_TIMEOUT=10000

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_REPORTING=true

# Security
VITE_SIGNAL_WINDOW_SECONDS=60
VITE_MAX_TRANSACTION_AMOUNT=100

# MetaMask
VITE_SUPPORTED_CHAINS=1,5,137,80001
```

### Using Environment Variables in Code

```typescript
// Access in TypeScript
const apiUrl = import.meta.env.VITE_API_URL;
const isProduction = import.meta.env.PROD;

// Type definitions (vite-env.d.ts)
interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_API_URL: string;
  // ... add other variables
}
```

---

## Security Checklist

### Pre-Deployment Security Audit

- [ ] **Remove Development Secrets**
  - [ ] No hardcoded API keys
  - [ ] No test wallet private keys
  - [ ] No debug logging in production

- [ ] **Enable Security Headers**
  - [ ] Content Security Policy (CSP)
  - [ ] X-Frame-Options: SAMEORIGIN
  - [ ] X-Content-Type-Options: nosniff
  - [ ] Strict-Transport-Security (HTTPS only)

- [ ] **Input Validation**
  - [ ] Validate all wallet addresses
  - [ ] Sanitize user inputs
  - [ ] Limit transaction amounts

- [ ] **Rate Limiting**
  - [ ] Limit validation attempts
  - [ ] Throttle signal generation
  - [ ] Implement CAPTCHA for suspicious activity

- [ ] **Error Handling**
  - [ ] No sensitive data in error messages
  - [ ] Generic error responses
  - [ ] Proper logging without PII

- [ ] **Dependencies**
  - [ ] Run `npm audit`
  - [ ] Update vulnerable packages
  - [ ] Use lock files (package-lock.json)

- [ ] **HTTPS Configuration**
  - [ ] SSL/TLS certificate installed
  - [ ] Redirect HTTP to HTTPS
  - [ ] Secure cookie settings

- [ ] **Monitoring**
  - [ ] Error tracking (Sentry, LogRocket)
  - [ ] Performance monitoring
  - [ ] User analytics (privacy-compliant)

### Content Security Policy Example

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' data:;
  connect-src 'self' https://mainnet.infura.io https://goerli.infura.io;
  frame-ancestors 'none';
">
```

---

## SSL/TLS Setup (Let's Encrypt)

### For EC2 or VPS

```bash
# Install Certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal (cron job)
sudo certbot renew --dry-run
```

### For CloudFront

- AWS Certificate Manager (ACM) provides free SSL certificates
- Request certificate for your domain
- Attach to CloudFront distribution

---

## Performance Optimization

### Build Optimizations

```bash
# Analyze bundle size
npm run build -- --mode analyze

# Enable code splitting
# (Already configured in Vite)

# Minify and compress
# (Automatic with Vite build)
```

### CDN Configuration

Use CloudFront or similar CDN with:

- Edge caching for static assets
- Gzip/Brotli compression
- HTTP/2 support
- Geographic distribution

---

## Monitoring & Logging

### Error Tracking (Sentry)

```typescript
// Install Sentry
npm install @sentry/react

// Initialize in App.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: import.meta.env.MODE,
  tracesSampleRate: 0.1,
});
```

### Analytics (Privacy-Friendly)

```typescript
// Plausible Analytics (GDPR-compliant)
<script defer data-domain="echokey.com" 
  src="https://plausible.io/js/script.js">
</script>
```

---

## Backup & Recovery

### LocalStorage Backup

```typescript
// Export logs for backup
function exportLogs() {
  const logs = localStorage.getItem('echokey_logs');
  const blob = new Blob([logs || ''], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  // Download file
}

// Import logs
function importLogs(file: File) {
  // Read file and restore to localStorage
}
```

---

## Rollback Strategy

### Version Tagging

```bash
# Tag release
git tag -a v1.0.0 -m "Release 1.0.0"
git push origin v1.0.0

# Rollback to previous version
git checkout v0.9.0
npm run build
# Deploy
```

### Docker Rollback

```bash
# Keep previous images
docker tag echokey:latest echokey:previous

# Rollback
docker stop echokey
docker rm echokey
docker run -d -p 3000:80 --name echokey echokey:previous
```

---

## Troubleshooting

### Common Issues

**MetaMask not connecting**
- Check browser extension installed
- Verify site permissions
- Try refreshing page

**Build failures**
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear build cache: `rm -rf dist .vite`
- Check Node version: `node -v` (should be 18+)

**Docker container not starting**
- Check logs: `docker logs echokey`
- Verify port not in use: `lsof -i :3000`
- Inspect container: `docker inspect echokey`

---

## Post-Deployment Checklist

- [ ] Application loads successfully
- [ ] Wallet connection works
- [ ] Transaction creation functional
- [ ] Signal generation operational
- [ ] Validation logic working
- [ ] Admin panel accessible
- [ ] Logs persisting correctly
- [ ] Mobile responsive
- [ ] HTTPS enabled
- [ ] Error tracking active
- [ ] Performance metrics captured
- [ ] Backup strategy implemented

---

## Support & Maintenance

### Regular Maintenance Tasks

- **Weekly**: Check error logs, review analytics
- **Monthly**: Update dependencies, security audit
- **Quarterly**: Performance optimization, feature updates

### Getting Help

- GitHub Issues: Report bugs and request features
- Documentation: Refer to README.md and ARCHITECTURE.md
- Community: Join Discord/Slack (if available)

---

## Conclusion

EchoKey is designed for easy deployment across multiple platforms. Choose the deployment method that best fits your needs, from simple static hosting to full containerized production environments.

For production use with real cryptocurrency transactions, additional security measures and backend infrastructure are required. This guide provides the foundation for both demonstration and production deployments.
