# 🚀 CI/CD Setup Guide - GitHub Actions

Panduan setup CI/CD untuk deployment otomatis dari GitHub ke VPS.

---

## 🎯 Fitur CI/CD

### ✅ Automatic Deployment
- **Trigger:** Push ke branch `main`
- **Build:** Build frontend assets di GitHub Actions
- **Deploy:** Upload hasil build ke VPS via SSH
- **No Node.js di VPS:** Frontend sudah di-build, tinggal pakai

### ✅ Automated Testing
- **Trigger:** Pull request atau push ke `develop`
- **Tests:** PHPUnit + Pest tests
- **Frontend:** Build check + linting

### ✅ Rollback Support
- **Database backup** sebelum deployment
- **.env backup** otomatis
- **Easy rollback** jika ada masalah

---

## 📋 Prerequisites

### 1. **VPS Requirements** (Minimal)
```bash
# Yang HARUS diinstall di VPS:
- PHP 8.2-FPM
- Nginx
- MySQL 8.0
- Supervisor
- Git (untuk initial clone)

# Yang TIDAK perlu di VPS:
- Node.js ❌
- NPM ❌
- Composer ❌ (optional, hanya untuk troubleshooting)
```

### 2. **GitHub Repository Secrets**
Tambahkan secrets di: `Repository → Settings → Secrets and variables → Actions`

**Required Secrets:**
| Secret Name | Description | Example |
|-------------|-------------|---------|
| `VPS_HOST` | IP atau domain VPS | `123.456.789.0` |
| `VPS_USERNAME` | SSH username | `root` atau `azureuser` |
| `VPS_SSH_KEY` | Private SSH key | `-----BEGIN OPENSSH PRIVATE KEY-----` |
| `VPS_PORT` | SSH port | `22` |

---

## 🔑 Setup SSH Key untuk CI/CD

### Step 1: Generate SSH Key (di komputer lokal)
```bash
# Generate SSH key pair
ssh-keygen -t ed25519 -C "github-actions-sinfomik" -f ~/.ssh/github_actions_sinfomik

# Jangan set passphrase (tekan Enter)
```

Akan generate 2 file:
- `github_actions_sinfomik` - **Private key** (untuk GitHub Secret)
- `github_actions_sinfomik.pub` - **Public key** (untuk VPS)

### Step 2: Copy Public Key ke VPS
```bash
# Method 1: Via ssh-copy-id
ssh-copy-id -i ~/.ssh/github_actions_sinfomik.pub user@your-vps-ip

# Method 2: Manual
cat ~/.ssh/github_actions_sinfomik.pub
# Copy output, lalu di VPS:
ssh user@your-vps-ip
mkdir -p ~/.ssh
echo "PASTE_PUBLIC_KEY_HERE" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

### Step 3: Add Private Key ke GitHub Secrets
```bash
# Di komputer lokal, copy private key:
cat ~/.ssh/github_actions_sinfomik

# Copy SEMUA output (termasuk BEGIN dan END lines)
```

Di GitHub:
1. Go to: `Repository → Settings → Secrets and variables → Actions`
2. Click: **New repository secret**
3. Name: `VPS_SSH_KEY`
4. Value: **Paste private key**
5. Click: **Add secret**

### Step 4: Test SSH Connection
```bash
# Test dari komputer lokal
ssh -i ~/.ssh/github_actions_sinfomik user@your-vps-ip

# Jika berhasil login tanpa password, berarti sudah benar
```

---

## 🛠️ VPS Initial Setup (One-time)

### 1. **Install Required Packages**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install PHP 8.2
sudo apt install -y software-properties-common
sudo add-apt-repository ppa:ondrej/php -y
sudo apt update
sudo apt install -y php8.2-fpm php8.2-mysql php8.2-xml \
    php8.2-mbstring php8.2-curl php8.2-zip php8.2-gd \
    php8.2-bcmath php8.2-intl

# Install Nginx
sudo apt install -y nginx

# Install MySQL
sudo apt install -y mysql-server

# Install Supervisor
sudo apt install -y supervisor

# Install Git (untuk initial clone)
sudo apt install -y git
```

### 2. **Create Application Directory**
```bash
# Create directory
sudo mkdir -p /var/www/sinfomik

# Set ownership
sudo chown -R $USER:$USER /var/www/sinfomik

# Initial clone (hanya sekali)
cd /var/www
git clone https://github.com/athaaanfl/sinfomik-laravel.git sinfomik
cd sinfomik

# Setup .env (copy dari .env.production.example)
cp .env.production.example .env
nano .env  # Edit dengan konfigurasi production

# Generate app key
php artisan key:generate --force
```

### 3. **Setup Database**
```bash
# Login ke MySQL
sudo mysql

# Create database
CREATE DATABASE sinfomik;
FLUSH PRIVILEGES;
EXIT;

# Run migrations (manual pertama kali)
cd /var/www/sinfomik
php artisan migrate --force
```

### 4. **Setup Nginx**
```bash
# Copy nginx config
sudo cp /var/www/sinfomik/deployment/nginx/sinfomik.conf /etc/nginx/sites-available/sinfomik

# Edit dengan domain Anda
sudo nano /etc/nginx/sites-available/sinfomik
# Ganti semua 'yourdomain.com' dengan domain Anda

# Enable site
sudo ln -s /etc/nginx/sites-available/sinfomik /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### 5. **Setup Supervisor**
```bash
# Copy supervisor config
sudo cp /var/www/sinfomik/deployment/supervisor/sinfomik-queue.conf /etc/supervisor/conf.d/

# Reload Supervisor
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start sinfomik-queue:*
```

### 6. **Setup SSL (Let's Encrypt)**
```bash
# Install certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal sudah setup otomatis
```

### 7. **Setup Permissions**
```bash
cd /var/www/sinfomik

# Set ownership
sudo chown -R www-data:www-data .
sudo chmod -R 755 .
sudo chmod -R 775 storage bootstrap/cache
```

---

## 🚀 Deployment Flow

### Automatic Deployment (setiap push ke `main`)

```mermaid
graph TD
    A[Push to main] --> B[GitHub Actions triggered]
    B --> C[Install dependencies]
    C --> D[Build frontend npm run build]
    D --> E[Create deployment artifact]
    E --> F[Upload to VPS via SSH]
    F --> G[Extract files]
    G --> H[Backup database & .env]
    H --> I[Run migrations]
    I --> J[Cache optimization]
    J --> K[Restart services]
    K --> L[Health check]
    L --> M[✅ Deployment complete]
```

### Manual Deployment (jika GitHub Actions gagal)

```bash
# SSH ke VPS
ssh user@your-vps-ip

# Go to app directory
cd /var/www/sinfomik

# Pull latest code
git pull origin main

# Set permissions
sudo chown -R www-data:www-data .
sudo chmod -R 755 .
sudo chmod -R 775 storage bootstrap/cache

# Run migrations
php artisan migrate --force

# Clear and cache
php artisan optimize:clear
php artisan optimize

# Restart services
sudo systemctl reload php8.2-fpm
sudo supervisorctl restart sinfomik-queue:*
```

---

## 📊 Monitoring Deployment

### 1. **GitHub Actions Dashboard**
```
Repository → Actions → Latest workflow run
```

Lihat:
- ✅ Build status
- ⏱️ Build duration
- 📋 Logs detail per step

### 2. **VPS Logs**
```bash
# Application logs
tail -f /var/www/sinfomik/storage/logs/laravel.log

# Nginx error logs
tail -f /var/log/nginx/sinfomik-error.log

# PHP-FPM logs
tail -f /var/log/php8.2-fpm.log

# Supervisor logs
tail -f /var/www/sinfomik/storage/logs/worker.log
```

### 3. **Deployment History**
```bash
# Check deployment backups
ls -lh /var/backups/sinfomik/

# Check latest backup
ls -lt /var/backups/sinfomik/ | head -5
```

---

## 🔄 Rollback Procedure

Jika deployment bermasalah:

### Quick Rollback
```bash
# SSH ke VPS
ssh user@your-vps-ip
cd /var/www/sinfomik

# Rollback ke commit sebelumnya
git log --oneline -5  # Lihat 5 commit terakhir
git reset --hard <commit-hash-sebelumnya>

# Restore database dari backup
BACKUP_FILE=$(ls -t /var/backups/sinfomik/database_*.sql | head -1)
mysql -u root sinfomik < $BACKUP_FILE

# Restart services
sudo systemctl reload php8.2-fpm
sudo supervisorctl restart sinfomik-queue:*
```

### Manual Restore .env
```bash
# Restore .env dari backup terakhir
BACKUP_ENV=$(ls -t /var/backups/sinfomik/.env.* | head -1)
cp $BACKUP_ENV /var/www/sinfomik/.env
```

---

## 🛡️ Security Best Practices

### 1. **SSH Key Management**
- ✅ Use separate SSH key untuk GitHub Actions
- ✅ Jangan share private key
- ✅ Rotate keys setiap 6 bulan

### 2. **Secrets Management**
- ✅ JANGAN commit `.env` ke Git
- ✅ Gunakan GitHub Secrets untuk credentials
- ✅ Restrict secret access ke specific workflows

### 3. **VPS Security**
```bash
# Setup firewall
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable

# Disable password authentication (hanya SSH key)
sudo nano /etc/ssh/sshd_config
# Set: PasswordAuthentication no
sudo systemctl restart sshd
```

---

## 🧪 Testing CI/CD

### Test Deployment (tanpa push ke main)

```bash
# Trigger manual via GitHub UI
Repository → Actions → Deploy to Production → Run workflow
```

### Test dengan Branch Lain
```bash
# Push ke branch test
git checkout -b test-deployment
git push origin test-deployment

# Lihat hasil di Actions tab
# Jika berhasil, merge ke main
```

---

## 💰 Cost Optimization

### GitHub Actions Free Tier
- ✅ 2,000 minutes/month gratis (public repo)
- ✅ ~5-10 menit per deployment
- ✅ Bisa 200-400 deployments per bulan gratis

### VPS Resources
- ✅ Tidak perlu Node.js (save ~500MB RAM)
- ✅ Tidak perlu npm modules (save ~2GB disk)
- ✅ Deployment lebih cepat (tidak compile di VPS)

---

## ❓ Troubleshooting

### Issue: SSH Connection Failed
**Solution:**
```bash
# Check SSH key di GitHub Secrets
# Pastikan format benar:
-----BEGIN OPENSSH PRIVATE KEY-----
...
-----END OPENSSH PRIVATE KEY-----

# Test SSH dari GitHub Actions
# Tambahkan step debugging:
- name: Debug SSH
  run: |
    echo "${{ secrets.VPS_SSH_KEY }}" | head -1
    # Jangan print full key!
```

### Issue: Permission Denied
**Solution:**
```bash
# Di VPS, check ownership
ls -la /var/www/sinfomik

# Fix permissions
sudo chown -R www-data:www-data /var/www/sinfomik
sudo chmod -R 775 storage bootstrap/cache
```

### Issue: Build Failed
**Solution:**
```bash
# Check GitHub Actions logs
# Common issues:
# - Composer dependencies conflict
# - NPM build errors
# - Missing environment variables
```

### Issue: Database Migration Failed
**Solution:**
```bash
# SSH ke VPS
cd /var/www/sinfomik

# Run migration manually
php artisan migrate --force

# Check database connection
php artisan tinker
DB::connection()->getPdo();
```

---

## 📚 References

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [SSH Action](https://github.com/appleboy/ssh-action)
- [Laravel Deployment Best Practices](https://laravel.com/docs/deployment)

---

## ✅ Checklist Setup

- [ ] VPS sudah install PHP, Nginx, MySQL, Supervisor
- [ ] SSH key pair sudah generated
- [ ] Public key sudah di VPS `~/.ssh/authorized_keys`
- [ ] Private key sudah di GitHub Secrets (`VPS_SSH_KEY`)
- [ ] GitHub Secrets lengkap: `VPS_HOST`, `VPS_USERNAME`, `VPS_PORT`
- [ ] Initial setup VPS sudah selesai (database, nginx, .env)
- [ ] Test push ke `main` berhasil trigger deployment
- [ ] Application bisa diakses via browser
- [ ] SSL certificate sudah installed

---

**Setelah setup, deployment otomatis setiap push ke `main`!** 🚀
