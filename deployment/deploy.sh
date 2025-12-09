#!/bin/bash

# Sinfomik Laravel Deployment Script
# Usage: ./deploy.sh

set -e

echo "🚀 Starting deployment for Sinfomik..."

# Configuration
APP_DIR="/var/www/sinfomik"
PHP_VERSION="8.2"

# Navigate to app directory
cd $APP_DIR

echo "📥 Pulling latest changes from Git..."
git pull origin main

echo "🔧 Installing/Updating Composer dependencies..."
composer install --no-dev --optimize-autoloader --no-interaction

echo "📦 Installing/Updating NPM dependencies..."
npm ci --production=false

echo "🏗️  Building frontend assets..."
npm run build

echo "🔄 Running database migrations..."
php artisan migrate --force

echo "🧹 Clearing caches..."
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

echo "⚡ Optimizing application..."
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize

echo "🔗 Linking storage..."
php artisan storage:link

echo "🔐 Setting correct permissions..."
chown -R www-data:www-data $APP_DIR
chmod -R 755 $APP_DIR
chmod -R 775 $APP_DIR/storage
chmod -R 775 $APP_DIR/bootstrap/cache

echo "♻️  Restarting services..."
sudo systemctl reload php${PHP_VERSION}-fpm
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl restart sinfomik-queue:*

echo "✅ Deployment completed successfully!"
echo "🌐 Application is now live at: $(grep APP_URL .env | cut -d '=' -f2)"
