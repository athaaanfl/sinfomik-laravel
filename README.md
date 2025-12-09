# 🎓 SINFOMIK - Sistem Informasi Manajemen Akademik

Aplikasi manajemen akademik berbasis web untuk mengelola data sekolah, guru, siswa, mata pelajaran, dan penugasan mengajar.

## 🚀 Tech Stack

- **Backend:** Laravel 12 + PHP 8.2+
- **Frontend:** React 19 + TypeScript
- **UI Framework:** Tailwind CSS + shadcn/ui
- **Routing:** Inertia.js
- **Database:** MySQL

## ✨ Fitur Utama

### 📊 Manajemen Data
- **Siswa** - CRUD data siswa dengan pagination dan pencarian
- **Guru** - Pengelolaan data guru dan profil
- **Kelas** - Manajemen kelas per tahun ajaran dengan wali kelas
- **Mata Pelajaran** - Pengelolaan kurikulum dan mata pelajaran

### 👨‍🏫 Penugasan Mengajar
- **Guru Bidang Studi** - Penugasan guru untuk mata pelajaran tertentu
  - Penugasan per kelas spesifik
  - Penugasan per tingkat
  - Penugasan untuk semua kelas
- **Wali Kelas** - Auto-assignment mata pelajaran saat penunjukan wali kelas
  - Konfigurasi mata pelajaran per tingkat
  - Event-driven architecture dengan listener

### 🔐 Autentikasi & Role
- Multi-role system (Admin, Guru)
- Dashboard khusus per role
- Protected routes dengan middleware

## 📋 Prerequisites

- PHP >= 8.2
- Composer
- Node.js >= 18.x
- MySQL/MariaDB
- NPM atau Yarn

## 🛠️ Instalasi & Setup

### 1. Clone Repository
```bash
git clone https://gitlab.com/athaanfl/sinfomik-laravel.git
cd sinfomik-laravel
```

### 2. Install Dependencies
```bash
# Install PHP dependencies
composer install

# Install Node dependencies
npm install
```

### 3. Environment Setup
```bash
# Copy file environment
copy .env.example .env

# Generate application key
php artisan key:generate
```

### 4. Database Setup
Edit file `.env` dan sesuaikan konfigurasi database:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=sinfomik
DB_USERNAME=root
DB_PASSWORD=
```

Jalankan migration dan seeder:
```bash
php artisan migrate --seed
```

### 5. Build Assets
```bash
# Development mode dengan hot reload
npm run dev

# atau build untuk production
npm run build
```

### 6. Jalankan Aplikasi
```bash
# Jalankan server Laravel
composer run dev
```

Akses aplikasi di: `http://localhost:8000`

## 📝 Default Login

Setelah setup, gunakan kredensial default:
- **Email:** admin@example.com
- **Password:** password

## 👥 Author

Developed by [athaanfl](https://gitlab.com/athaanfl)
