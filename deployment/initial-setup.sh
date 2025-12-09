#!/bin/bash

# Initial Deployment Script for Sinfomik
# Run this script only once for first-time deployment

set -e

echo "🎯 Starting initial deployment setup for Sinfomik..."

# Configuration
APP_DIR="/var/www/sinfomik"
DOMAIN="yourdomain.com"
DB_NAME="sinfomik"
PHP_VERSION="8.2"

echo "📋 Checking system requirements..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "❌ Please run as root or with sudo"
    exit 1
fi

echo "📦 Installing system dependencies..."
apt update
apt install -y nginx mysql-server php${PHP_VERSION}-fpm php${PHP_VERSION}-mysql php${PHP_VERSION}-xml \
    php${PHP_VERSION}-mbstring php${PHP_VERSION}-curl php${PHP_VERSION}-zip php${PHP_VERSION}-gd \
    php${PHP_VERSION}-bcmath php${PHP_VERSION}-intl php${PHP_VERSION}-redis \
    git curl unzip supervisor certbot python3-certbot-nginx

echo "📥 Cloning repository..."
if [ ! -d "$APP_DIR" ]; then
    git clone https://github.com/athaaanfl/sinfomik-laravel.git $APP_DIR
else
    echo "⚠️  Directory already exists, skipping clone..."
fi

cd $APP_DIR

echo "🔧 Installing Composer..."
if [ ! -f "/usr/local/bin/composer" ]; then
    curl -sS https://getcomposer.org/installer | php
    mv composer.phar /usr/local/bin/composer
    chmod +x /usr/local/bin/composer
fi

echo "📦 Installing Composer dependencies..."
composer install --no-dev --optimize-autoloader

echo "📦 Installing Node.js and NPM..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
fi

echo "📦 Installing NPM dependencies..."
npm ci

echo "🏗️  Building frontend assets..."
npm run build

echo "⚙️  Setting up environment file..."
if [ ! -f .env ]; then
    cp .env.production.example .env
    echo "📝 Please edit .env file with your configuration"
    nano .env
fi

echo "🔑 Generating application key..."
php artisan key:generate --force

echo "🗄️  Setting up database..."
mysql -e "CREATE DATABASE IF NOT EXISTS ${DB_NAME};"
mysql -e "GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO 'root'@'localhost';"
mysql -e "FLUSH PRIVILEGES;"

echo "🔄 Running database migrations..."
php artisan migrate --force

echo "👤 Creating admin user..."
php artisan db:seed --class=DatabaseSeeder --force

echo "🔗 Creating storage link..."
php artisan storage:link

echo "🔐 Setting permissions..."
chown -R www-data:www-data $APP_DIR
chmod -R 755 $APP_DIR
chmod -R 775 $APP_DIR/storage
chmod -R 775 $APP_DIR/bootstrap/cache

echo "🌐 Configuring Nginx..."
cp $APP_DIR/deployment/nginx/sinfomik.conf /etc/nginx/sites-available/sinfomik
sed -i "s/yourdomain.com/${DOMAIN}/g" /etc/nginx/sites-available/sinfomik
sed -i "s/php8.2-fpm/php${PHP_VERSION}-fpm/g" /etc/nginx/sites-available/sinfomik
ln -sf /etc/nginx/sites-available/sinfomik /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

echo "✅ Testing Nginx configuration..."
nginx -t

echo "♻️  Restarting Nginx..."
systemctl restart nginx

echo "👷 Setting up Supervisor for queue workers..."
cp $APP_DIR/deployment/supervisor/sinfomik-queue.conf /etc/supervisor/conf.d/
supervisorctl reread
supervisorctl update
supervisorctl start sinfomik-queue:*

echo "🔒 Setting up SSL with Let's Encrypt..."
read -p "Do you want to setup SSL now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    certbot --nginx -d $DOMAIN -d www.$DOMAIN
fi

echo "⚡ Optimizing Laravel..."
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize

echo ""
echo "✅ Initial deployment completed!"
echo ""
echo "📝 Next steps:"
echo "1. Update .env file with correct values"
echo "2. Run: php artisan migrate --seed"
echo "3. Visit: https://${DOMAIN}"
echo ""
echo "🚀 To deploy updates in the future, run: ./deploy.sh"
