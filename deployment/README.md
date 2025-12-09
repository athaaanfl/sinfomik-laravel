# Deployment Files

Directory ini berisi file-file konfigurasi untuk deployment production aplikasi Sinfomik ke VPS.

## 📁 Struktur

```
deployment/
├── nginx/
│   └── sinfomik.conf          # Konfigurasi Nginx dengan SSL
├── supervisor/
│   └── sinfomik-queue.conf    # Konfigurasi Supervisor untuk queue workers
├── deploy.sh                   # Script untuk deployment update
└── initial-setup.sh           # Script untuk setup awal di VPS
```

## 🚀 Quick Start

### 1. Setup Awal (Hanya Sekali)
```bash
# Upload ke VPS
scp deployment/initial-setup.sh root@your-vps:/root/

# Di VPS, jalankan:
chmod +x /root/initial-setup.sh
./initial-setup.sh
```

### 2. Deploy Update
```bash
# Di VPS, jalankan:
cd /var/www/sinfomik
./deployment/deploy.sh
```

## 📖 Dokumentasi Lengkap

Lihat [DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md) untuk panduan lengkap.
