# 📚 Sistem Manajemen Kurikulum - Import Excel

## ✨ Fitur Baru: Import Kurikulum dari Excel

Sekarang Anda dapat mengisi data kurikulum lengkap menggunakan Excel tanpa perlu edit kode PHP!

## 🚀 Quick Start (3 Langkah)

### 1. Generate Template
```bash
php artisan kurikulum:template
```
Output: `storage/app/public/template_kurikulum.xlsx`

### 2. Isi Data di Excel
- Buka file template
- Lihat contoh di baris 2-6 (background abu-abu)
- Isi data Anda mulai baris 7

### 3. Import
```bash
php artisan kurikulum:import public/template_kurikulum.xlsx
```

## 📋 Format Excel (11 Kolom)

| Kolom | Wajib? | Contoh |
|-------|--------|--------|
| mata_pelajaran | Ya* | MATH |
| fase | Ya* | A |
| deskripsi_fase | Ya* | Pada akhir Fase A... |
| elemen_pembelajaran | Ya* | Bilangan |
| urutan_elemen | Ya | 1 |
| cp_elemen | Ya* | Siswa memahami... |
| **kode_tp** | **YA** | TP.MAT.1.1 |
| **deskripsi_tp** | **YA** | Siswa dapat... |
| **urutan_tp** | **YA** | 1 |
| **tingkat** | **YA** | 1-6 |
| **semester** | **YA** | Ganjil/Genap |

*) Bisa dikosongkan jika sama dengan baris sebelumnya

## 📖 Dokumentasi Lengkap

- **Quick Reference**: `QUICK_IMPORT_EXCEL.md`
- **Panduan Lengkap**: `IMPORT_KURIKULUM_EXCEL.md`

## 📦 Struktur Hierarki

```
Mata Pelajaran (Life Skills, MATH, dll)
  └─ CP Fase (A, B, C, D, E, F)
      └─ Elemen Pembelajaran (Bilangan, Geometri, dll)
          └─ CP Elemen (Deskripsi capaian)
              └─ Tujuan Pembelajaran (TP.MAT.1.1, dll)
                  └─ TP Pemetaan (Tingkat & Semester)
```

## 🎯 Mata Pelajaran yang Tersedia

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

## 💡 Tips

### Kolom yang HARUS Diisi Setiap Baris:
- `kode_tp`, `deskripsi_tp`, `urutan_tp`, `tingkat`, `semester`

### Kolom yang Boleh Dikosongkan:
- Kolom lain boleh dikosongkan jika nilainya sama dengan baris sebelumnya

### TP Berlaku di Multiple Semester?
Copy baris dan ubah hanya kolom `semester`:
```
MATH | A | ... | Bilangan | 1 | ... | TP.MAT.1.1 | ... | 1 | 1 | Ganjil
     |   |     |          |   |     | TP.MAT.1.1 | ... | 1 | 1 | Genap
```

## 📊 Contoh Output Import

```
📂 Membaca file: storage/app/public/template_kurikulum.xlsx
⏳ Memproses import...

✅ Import selesai!

📊 Ringkasan:
   • Berhasil: 45 baris
   • Error: 0 baris
   • Warning: 0 baris

🎉 Semua data berhasil diimport!
```

## 🛠️ Command Reference

```bash
# Generate template dengan nama custom
php artisan kurikulum:template --output=kurikulum_2024.xlsx

# Import dari path berbeda
php artisan kurikulum:import public/kurikulum_2024.xlsx
php artisan kurikulum:import "D:\Downloads\kurikulum.xlsx"
```

## ⚠️ Troubleshooting

### Error: Mata pelajaran tidak ditemukan
**Solusi**: Copy paste nama mata pelajaran dari list di atas (perhatikan huruf besar/kecil)

### Error: Semester tidak ditemukan
**Solusi**: Gunakan `Ganjil` atau `Genap` (huruf G kapital!)

### Error: Tingkat harus 1-6
**Solusi**: Isi kolom tingkat dengan angka 1, 2, 3, 4, 5, atau 6

## 🔄 Update Data

Import menggunakan `updateOrCreate()`, jadi:
- ✅ Aman dijalankan berulang kali
- ✅ Data existing akan di-update
- ✅ Data baru akan ditambahkan

## 📞 File Penting

- `app/Imports/KurikulumImport.php` - Logic import
- `app/Exports/KurikulumTemplateExport.php` - Template generator
- `app/Console/Commands/ImportKurikulum.php` - Command import
- `app/Console/Commands/GenerateKurikulumTemplate.php` - Command template

## 🎓 Workflow Rekomendasi

1. Generate template
2. Isi 1-2 mata pelajaran dulu
3. Import dan cek hasilnya
4. Jika OK, lanjutkan isi semua mata pelajaran
5. Import final

---

**Dibuat dengan ❤️ untuk mempermudah pengelolaan kurikulum**

**Update terakhir**: Desember 2025
