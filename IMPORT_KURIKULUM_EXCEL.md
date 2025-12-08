# 📊 Import Kurikulum dari Excel

## Deskripsi
Fitur ini memudahkan Anda untuk mengisi data kurikulum lengkap menggunakan Excel, tanpa perlu edit kode PHP secara manual.

## 🚀 Quick Start

### 1. Generate Template Excel
```bash
php artisan kurikulum:template
```

File template akan dibuat di: `storage/app/public/template_kurikulum.xlsx`

### 2. Isi Data di Excel
Buka file `template_kurikulum.xlsx` dan isi data kurikulum Anda.

### 3. Import ke Database
```bash
php artisan kurikulum:import public/template_kurikulum.xlsx
```

## 📋 Format Excel

### Kolom-kolom yang Tersedia

| Kolom | Wajib? | Deskripsi | Contoh |
|-------|--------|-----------|--------|
| `mata_pelajaran` | Ya (baris pertama) | Nama mata pelajaran sesuai database | MATH, Bahasa Indonesia |
| `fase` | Ya (baris pertama) | Fase kurikulum (A-F) | A, B, C |
| `deskripsi_fase` | Ya (baris pertama) | Deskripsi capaian pembelajaran fase | Pada akhir Fase A, siswa... |
| `elemen_pembelajaran` | Ya (baris pertama elemen) | Nama elemen pembelajaran | Bilangan, Geometri |
| `urutan_elemen` | Ya | Urutan elemen (1, 2, 3, ...) | 1 |
| `cp_elemen` | Ya (baris pertama elemen) | Deskripsi capaian elemen | Siswa dapat memahami... |
| `kode_tp` | **Ya (setiap baris)** | Kode unik tujuan pembelajaran | TP.MAT.1.1 |
| `deskripsi_tp` | **Ya (setiap baris)** | Deskripsi tujuan pembelajaran | Siswa dapat membilang 1-20 |
| `urutan_tp` | **Ya (setiap baris)** | Urutan TP dalam elemen | 1, 2, 3 |
| `tingkat` | **Ya (setiap baris)** | Tingkat kelas (1-6) | 1 |
| `semester` | **Ya (setiap baris)** | Semester (Ganjil/Genap) | Ganjil |

### Aturan Pengisian

#### ✅ Kolom yang BOLEH Dikosongkan
Kolom berikut bisa dikosongkan jika nilainya **sama dengan baris sebelumnya**:
- `mata_pelajaran`
- `fase`
- `deskripsi_fase`
- `elemen_pembelajaran`
- `urutan_elemen`
- `cp_elemen`

#### ⚠️ Kolom yang HARUS Diisi Setiap Baris
Kolom berikut **WAJIB diisi** di setiap baris:
- `kode_tp`
- `deskripsi_tp`
- `urutan_tp`
- `tingkat`
- `semester`

## 📖 Contoh Pengisian

### Contoh 1: Satu Mata Pelajaran, Satu Fase, Dua Elemen

| mata_pelajaran | fase | deskripsi_fase | elemen_pembelajaran | urutan_elemen | cp_elemen | kode_tp | deskripsi_tp | urutan_tp | tingkat | semester |
|----------------|------|----------------|---------------------|---------------|-----------|---------|--------------|-----------|---------|----------|
| MATH | A | Pada akhir Fase A, siswa dapat operasi bilangan cacah sampai 100 | Bilangan | 1 | Siswa memahami bilangan cacah | TP.MAT.1.1 | Siswa dapat membilang 1-20 | 1 | 1 | Ganjil |
| | | | | | | TP.MAT.1.1 | Siswa dapat membilang 1-20 | 1 | 1 | Genap |
| | | | | | | TP.MAT.1.2 | Siswa dapat penjumlahan 1-20 | 2 | 1 | Ganjil |
| | | | Geometri | 2 | Siswa mengenal bangun datar | TP.MAT.2.1 | Siswa mengenal segitiga | 1 | 1 | Genap |

**Penjelasan:**
- Baris 1: Isi lengkap untuk mata pelajaran MATH, Fase A, Elemen Bilangan, TP pertama untuk semester Ganjil tingkat 1
- Baris 2: TP yang sama (TP.MAT.1.1) berlanjut ke semester Genap, kolom lain dikosongkan karena sama
- Baris 3: TP kedua (TP.MAT.1.2) masih di elemen Bilangan, kolom elemen dikosongkan
- Baris 4: Elemen baru (Geometri), perlu diisi nama elemen dan cp_elemen

### Contoh 2: TP yang Berlaku di Multiple Tingkat

| mata_pelajaran | fase | deskripsi_fase | elemen_pembelajaran | urutan_elemen | cp_elemen | kode_tp | deskripsi_tp | urutan_tp | tingkat | semester |
|----------------|------|----------------|---------------------|---------------|-----------|---------|--------------|-----------|---------|----------|
| Bahasa Indonesia | A | Siswa mampu berbahasa Indonesia | Menyimak | 1 | Siswa dapat menyimak | TP.BI.1.1 | Siswa menyimak instruksi | 1 | 1 | Ganjil |
| | | | | | | TP.BI.1.1 | Siswa menyimak instruksi | 1 | 1 | Genap |
| | | | | | | TP.BI.1.1 | Siswa menyimak instruksi | 1 | 2 | Ganjil |
| | | | | | | TP.BI.1.2 | Siswa berbicara dengan jelas | 2 | 1 | Ganjil |

**Penjelasan:**
- TP.BI.1.1 berlaku di tingkat 1 semester Ganjil dan Genap, serta tingkat 2 semester Ganjil

### Contoh 3: Multiple Mata Pelajaran

| mata_pelajaran | fase | deskripsi_fase | elemen_pembelajaran | urutan_elemen | cp_elemen | kode_tp | deskripsi_tp | urutan_tp | tingkat | semester |
|----------------|------|----------------|---------------------|---------------|-----------|---------|--------------|-----------|---------|----------|
| MATH | A | Deskripsi Fase A MATH | Bilangan | 1 | CP Bilangan | TP.MAT.1.1 | Membilang 1-20 | 1 | 1 | Ganjil |
| Music | A | Deskripsi Fase A Music | Apresiasi Musik | 1 | CP Apresiasi | TP.MUS.1.1 | Mengenal alat musik | 1 | 1 | Ganjil |
| Sport | A | Deskripsi Fase A Sport | Aktivitas Jasmani | 1 | CP Aktivitas | TP.SPT.1.1 | Gerakan dasar | 1 | 1 | Ganjil |

## 🎯 Panduan Detail

### Fase Kurikulum Merdeka
- **Fase A**: Kelas 1-2 SD
- **Fase B**: Kelas 3-4 SD
- **Fase C**: Kelas 5-6 SD
- **Fase D**: Kelas 7-9 SMP
- **Fase E**: Kelas 10 SMA
- **Fase F**: Kelas 11-12 SMA

### Format Kode TP
Gunakan format yang konsisten. Contoh:
- `TP.MAT.1.1` - Prefix mata pelajaran + nomor elemen + nomor TP
- `TP.BI.2.3` - Bahasa Indonesia, elemen 2, TP ke-3
- `TP.1.1` - Format sederhana tanpa prefix
- `TP.A.1.1` - Dengan fase

### Nilai Tingkat
Harus angka **1-6** sesuai kelas SD

### Nilai Semester
Hanya ada 2 pilihan:
- `Ganjil`
- `Genap`

**PENTING:** Perhatikan huruf besar/kecil!

## 📦 Mata Pelajaran yang Tersedia

Pastikan nama mata pelajaran di Excel **persis sama** dengan yang ada di database:
1. Life Skills
2. Bahasa Indonesia
3. Music
4. Sport
5. Citizenship
6. Materi Keputrian Keputraan
7. Religion
8. MATH
9. IPAS
10. Budaya Jabar
11. Literasi

## 🔧 Command Reference

### Generate Template
```bash
# Generate dengan nama default (template_kurikulum.xlsx)
php artisan kurikulum:template

# Generate dengan nama custom
php artisan kurikulum:template --output=kurikulum_2024.xlsx
```

### Import Data
```bash
# Import dari storage/app/public
php artisan kurikulum:import public/template_kurikulum.xlsx

# Import dari path absolute
php artisan kurikulum:import "D:\Downloads\data_kurikulum.xlsx"

# Import dari subfolder di storage/app
php artisan kurikulum:import imports/kurikulum_math.xlsx
```

## 📊 Output Import

Setelah import, Anda akan melihat:

```
📂 Membaca file: storage/app/template_kurikulum.xlsx

⏳ Memproses import...
[===================================] 100%

✅ Import selesai!

📊 Ringkasan:
   • Berhasil: 45 baris
   • Error: 0 baris
   • Warning: 2 baris

⚠️  WARNINGS:
   • Baris 12: Fase 'B' tidak memiliki deskripsi

🎉 Semua data berhasil diimport!
```

## ⚠️ Troubleshooting

### Error: Mata pelajaran tidak ditemukan
```
❌ Baris 5: Mata pelajaran 'Matematika' tidak ditemukan
```
**Solusi:** Pastikan nama mata pelajaran persis sama dengan database. Gunakan `MATH` bukan `Matematika`.

### Error: Semester tidak ditemukan
```
❌ Baris 8: Semester 'ganjil' tidak ditemukan
```
**Solusi:** Gunakan huruf kapital: `Ganjil` atau `Genap`

### Error: Tingkat harus berupa angka 1-6
```
❌ Baris 10: Tingkat harus berupa angka 1-6
```
**Solusi:** Pastikan kolom tingkat berisi angka 1, 2, 3, 4, 5, atau 6

### Warning: Fase tidak memiliki deskripsi
```
⚠️  Baris 15: Fase 'A' tidak memiliki deskripsi
```
**Solusi:** Isi kolom `deskripsi_fase` pada baris pertama fase tersebut muncul

## 💡 Tips Efisien

### 1. Copy-Paste untuk Data Berulang
Jika TP berlaku di banyak tingkat/semester, copy baris dan ubah hanya kolom `tingkat` dan `semester`.

### 2. Gunakan Freeze Panes di Excel
Freeze baris header agar tetap terlihat saat scroll:
- Pilih baris 2
- View → Freeze Panes → Freeze Panes

### 3. Gunakan Filter
Aktifkan filter untuk melihat data per mata pelajaran atau fase.

### 4. Validasi Data di Excel
Gunakan Data Validation di Excel untuk kolom:
- `tingkat`: List 1,2,3,4,5,6
- `semester`: List Ganjil,Genap
- `fase`: List A,B,C,D,E,F

### 5. Import Bertahap
Anda bisa import per mata pelajaran untuk memudahkan pengecekan:
```bash
# Import MATH dulu
php artisan kurikulum:import math_only.xlsx

# Cek hasilnya, lalu import yang lain
php artisan kurikulum:import bahasa_indonesia.xlsx
```

### 6. Backup Database Sebelum Import
```bash
# Backup database
php artisan db:backup  # jika ada package backup

# Atau export manual dari phpMyAdmin
```

## 🔄 Update Data

Command import menggunakan `updateOrCreate`, artinya:
- Jika data sudah ada (berdasarkan kode TP), akan **di-update**
- Jika data belum ada, akan **dibuat baru**

Jadi aman untuk run import berulang kali!

## 📝 Workflow Rekomendasi

1. **Generate Template**
   ```bash
   php artisan kurikulum:template
   ```

2. **Isi Data di Excel**
   - Buka `storage/app/template_kurikulum.xlsx`
   - Lihat contoh di baris 2-6 (background abu-abu)
   - Hapus baris contoh atau biarkan (akan diabaikan jika sama)
   - Isi data mulai baris 7

3. **Import & Cek**
   ```bash
   php artisan kurikulum:import template_kurikulum.xlsx
   ```

4. **Perbaiki Error (jika ada)**
   - Lihat pesan error
   - Perbaiki di Excel
   - Import ulang

5. **Verifikasi di Database/Aplikasi**
   - Cek di aplikasi apakah data sudah muncul
   - Cek relasi antar tabel

## 🎓 Contoh Lengkap: Import MATH Fase A & B

Lihat file: `storage/app/examples/contoh_math_lengkap.xlsx` (jika tersedia)

Atau buat sendiri dengan struktur:

```
MATH | A | Deskripsi Fase A | Bilangan | 1 | CP Bilangan | TP.MAT.1.1 | Membilang 1-20 | 1 | 1 | Ganjil
     |   |                  |          |   |             | TP.MAT.1.1 | Membilang 1-20 | 1 | 1 | Genap
     |   |                  |          |   |             | TP.MAT.1.2 | Penjumlahan 1-20 | 2 | 1 | Ganjil
     |   |                  | Geometri | 2 | CP Geometri | TP.MAT.2.1 | Kenali segitiga | 1 | 1 | Genap
MATH | B | Deskripsi Fase B | Bilangan | 1 | CP Bilangan | TP.MAT.B.1.1 | Bilangan 1-10000 | 1 | 3 | Ganjil
```

---

## 📞 Support

Jika ada pertanyaan atau error yang tidak tercantum di sini:
1. Cek file log: `storage/logs/laravel.log`
2. Pastikan package `maatwebsite/excel` terinstall
3. Pastikan data mata pelajaran sudah di-seed
4. Pastikan data semester sudah di-seed

---

**Selamat mengisi data kurikulum dengan mudah! 🎉**
