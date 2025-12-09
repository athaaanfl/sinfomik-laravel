# 🚀 Panduan Deployment Production - Sinfomik

Panduan lengkap untuk deploy aplikasi Sinfomik ke VPS production.

## 📋 Prasyarat

### Spesifikasi VPS Minimum
- **OS**: Ubuntu 20.04 atau 22.04 LTS
- **RAM**: Minimal 2GB (4GB direkomendasikan)
- **Storage**: Minimal 20GB
- **PHP**: 8.2 atau lebih tinggi
- **MySQL**: 8.0 atau MariaDB 10.6+
- **Node.js**: 20.x LTS

### Yang Perlu Disiapkan
- [x] VPS dengan akses SSH root
- [x] Domain yang sudah diarahkan ke IP VPS
- [x] SMTP credentials untuk email (Gmail, Mailgun, dll)
- [x] Repository GitHub sudah disetup

---

## 🎯 Deployment Pertama Kali

### 1. Login ke VPS via SSH
```bash
ssh root@your-vps-ip
```

### 2. Update System
```bash
apt update && apt upgrade -y
```

### 3. Upload Script Initial Setup
```bash
# Di komputer lokal
scp deployment/initial-setup.sh root@your-vps-ip:/root/

# Di VPS
chmod +x /root/initial-setup.sh
```

### 4. Edit Konfigurasi dalam Script
```bash
nano /root/initial-setup.sh
```

Ubah variabel berikut:
```bash
DOMAIN="yourdomain.com"  # Ganti dengan domain Anda
DB_NAME="sinfomik"
PHP_VERSION="8.2"
```

### 5. Jalankan Initial Setup
```bash
./initial-setup.sh
```

Script ini akan:
- ✅ Install semua dependencies sistem
- ✅ Clone repository dari GitHub
- ✅ Install Composer & NPM dependencies
- ✅ Build frontend assets
- ✅ Setup database
- ✅ Konfigurasi Nginx
- ✅ Setup Supervisor untuk queue workers
- ✅ Setup SSL certificate (opsional)

### 6. Konfigurasi Environment
Setelah setup, edit file `.env`:
```bash
cd /var/www/sinfomik
nano .env
```

**Penting! Ubah nilai berikut:**
```env
APP_NAME=Sinfomik
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

# Database (MySQL tanpa password)
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=sinfomik
DB_USERNAME=root
DB_PASSWORD=

# Session (untuk HTTPS)
SESSION_SECURE_COOKIE=true

# Email (gunakan SMTP real)
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@yourdomain.com"
```

### 7. Generate Application Key (jika belum)
```bash
php artisan key:generate --force
```

### 8. Run Migrations & Seeders
```bash
php artisan migrate --force
php artisan db:seed --force  # Jika ada seeder
```

### 9. Test Aplikasi
Buka browser dan akses: `https://yourdomain.com`

---

## 🔄 Deploy Update/Perubahan Kode

Setiap kali ada perubahan kode di GitHub:

### 1. Login ke VPS
```bash
ssh root@your-vps-ip
```

### 2. Jalankan Deployment Script
```bash
cd /var/www/sinfomik
./deployment/deploy.sh
```

Script ini akan otomatis:
- ✅ Pull latest code dari GitHub
- ✅ Update Composer dependencies
- ✅ Update NPM dependencies
- ✅ Build frontend assets
- ✅ Run migrations
- ✅ Clear & cache configs
- ✅ Restart services

### Manual Deployment (Alternatif)
Jika ingin manual:
```bash
cd /var/www/sinfomik

# 1. Pull latest code
git pull origin main

# 2. Install dependencies
composer install --no-dev --optimize-autoloader
npm ci
npm run build

# 3. Run migrations
php artisan migrate --force

# 4. Clear & optimize
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize

# 5. Restart services
sudo systemctl reload php8.2-fpm
sudo supervisorctl restart sinfomik-queue:*
```

---

## 🔧 Maintenance & Troubleshooting

### Melihat Log Aplikasi
```bash
# Log Laravel
tail -f /var/www/sinfomik/storage/logs/laravel.log

# Log Queue Workers
tail -f /var/www/sinfomik/storage/logs/worker.log

# Log Nginx Error
tail -f /var/log/nginx/sinfomik-error.log

# Log Nginx Access
tail -f /var/log/nginx/sinfomik-access.log
```

### Restart Services
```bash
# Restart PHP-FPM
sudo systemctl restart php8.2-fpm

# Restart Nginx
sudo systemctl restart nginx

# Restart Queue Workers
sudo supervisorctl restart sinfomik-queue:*

# Restart semua Supervisor programs
sudo supervisorctl restart all
```

### Cek Status Services
```bash
# Status PHP-FPM
sudo systemctl status php8.2-fpm

# Status Nginx
sudo systemctl status nginx

# Status Queue Workers
sudo supervisorctl status sinfomik-queue:*
```

### Clear Cache
```bash
cd /var/www/sinfomik

# Clear application cache
php artisan cache:clear

# Clear config cache
php artisan config:clear

# Clear route cache
php artisan route:clear

# Clear view cache
php artisan view:clear

# Clear all
php artisan optimize:clear
```

### Database Backup
```bash
# Manual backup
mysqldump -u root sinfomik > backup-$(date +%Y%m%d-%H%M%S).sql

# Setup automatic daily backup (crontab)
crontab -e

# Tambahkan baris ini:
0 2 * * * mysqldump -u root sinfomik > /backups/sinfomik-$(date +\%Y\%m\%d).sql
```

### Permission Issues
```bash
cd /var/www/sinfomik

# Reset permissions
sudo chown -R www-data:www-data .
sudo chmod -R 755 .
sudo chmod -R 775 storage bootstrap/cache
```

### Queue Worker Stuck
```bash
# Restart queue workers
sudo supervisorctl restart sinfomik-queue:*

# Jika masih bermasalah, restart supervisor
sudo systemctl restart supervisor
```

---

## 🔒 Security Checklist

- [x] `APP_DEBUG=false` di production
- [x] `APP_ENV=production`
- [x] SSL/HTTPS aktif
- [x] `SESSION_SECURE_COOKIE=true`
- [x] File `.env` tidak di-commit ke Git
- [x] Firewall aktif (UFW)
- [x] MySQL hanya listen di localhost
- [x] Regular security updates: `apt update && apt upgrade`
- [x] Backup database rutin
- [x] Monitoring & logging aktif

### Setup Firewall (UFW)
```bash
# Install UFW
apt install ufw

# Allow SSH
ufw allow 22

# Allow HTTP & HTTPS
ufw allow 80
ufw allow 443

# Enable firewall
ufw enable

# Check status
ufw status
```

---

## 🚨 Common Issues & Solutions

### Issue: 500 Internal Server Error
**Solusi:**
```bash
# 1. Cek log
tail -f storage/logs/laravel.log

# 2. Clear cache
php artisan optimize:clear

# 3. Cek permissions
sudo chown -R www-data:www-data /var/www/sinfomik
sudo chmod -R 775 storage bootstrap/cache
```

### Issue: Queue tidak jalan
**Solusi:**
```bash
# Restart queue workers
sudo supervisorctl restart sinfomik-queue:*

# Cek status
sudo supervisorctl status sinfomik-queue:*

# Cek log
tail -f storage/logs/worker.log
```

### Issue: CSS/JS tidak load
**Solusi:**
```bash
# Rebuild assets
npm run build

# Clear cache
php artisan view:clear
php artisan cache:clear

# Cek permissions
sudo chown -R www-data:www-data public/build
```

### Issue: Database connection failed
**Solusi:**
```bash
# 1. Cek MySQL running
sudo systemctl status mysql

# 2. Test koneksi
mysql -u root -p -e "SHOW DATABASES;"

# 3. Verify .env database config
cat .env | grep DB_
```

---

## 📊 Monitoring & Performance

### Setup Laravel Telescope (Development)
```bash
composer require laravel/telescope --dev
php artisan telescope:install
php artisan migrate
```

### Performance Optimization
```bash
# Enable OPcache
nano /etc/php/8.2/fpm/php.ini

# Tambahkan/aktifkan:
opcache.enable=1
opcache.memory_consumption=256
opcache.max_accelerated_files=20000

# Restart PHP-FPM
sudo systemctl restart php8.2-fpm
```

### Monitoring Disk Space
```bash
# Cek disk usage
df -h

# Cek folder size
du -sh /var/www/sinfomik/*

# Clean old logs (rotate)
php artisan log:clear
```

---

## 📞 Support & Contact

Jika mengalami masalah deployment:

1. Cek log aplikasi terlebih dahulu
2. Pastikan semua services running
3. Verify konfigurasi .env
4. Cek file permissions

**Repository:** https://github.com/athaaanfl/sinfomik-laravel

---

## 📝 Changelog Deployment

Catat setiap deployment:

```
[2025-12-09] Initial production deployment
- Setup server dan dependencies
- Deploy versi 1.0.0
- SSL certificate installed

[2025-12-10] Update fitur X
- Deploy versi 1.0.1
- Added feature X
- Bug fixes
```

---

**Good luck! 🚀**
