#!/bin/bash
# ==========================================
# SSL Certificate Setup Script
# Run this on your VPS to get Let's Encrypt certificates
# ==========================================

set -e

# Configuration
DOMAIN="${1:-yourdomain.com}"
EMAIL="${2:-admin@yourdomain.com}"

echo "🔐 Setting up SSL for $DOMAIN..."

# Create required directories
mkdir -p ./docker/nginx/ssl
mkdir -p ./docker/nginx/certbot

# Step 1: Start nginx with HTTP only (for initial certificate)
echo "📦 Starting nginx for certificate validation..."

# Create temporary nginx config for HTTP-only
cat > ./docker/nginx/conf.d/temp-http.conf << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 200 'Server is ready for SSL setup';
        add_header Content-Type text/plain;
    }
}
EOF

# Start nginx container
docker compose up -d nginx

# Step 2: Get certificate from Let's Encrypt
echo "📜 Requesting certificate from Let's Encrypt..."

docker compose run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email "$EMAIL" \
    --agree-tos \
    --no-eff-email \
    -d "$DOMAIN" \
    -d "www.$DOMAIN"

# Step 3: Remove temporary config and restart with full config
echo "🔄 Switching to production configuration..."
rm ./docker/nginx/conf.d/temp-http.conf

# Update domain in nginx config
sed -i "s/yourdomain.com/$DOMAIN/g" ./docker/nginx/conf.d/default.conf

# Restart services
docker compose down
docker compose up -d

echo ""
echo "✅ SSL setup complete!"
echo ""
echo "🌐 Your site is now available at:"
echo "   https://$DOMAIN"
echo ""
echo "📋 Next steps:"
echo "   1. Update astro.config.mjs with site: 'https://$DOMAIN'"
echo "   2. Rebuild the app: docker compose build app"
echo "   3. Restart: docker compose up -d"
echo ""
echo "🔄 Certificate auto-renewal is configured."
echo "   To manually renew: docker compose run --rm certbot renew"
