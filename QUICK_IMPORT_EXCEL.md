# 🚀 Quick Reference - Import Kurikulum Excel

## Generate Template
```bash
php artisan kurikulum:template
```
📂 Output: `storage/app/public/template_kurikulum.xlsx`

## Import Data
```bash
php artisan kurikulum:import public/template_kurikulum.xlsx
```

## 📋 Kolom Excel (11 Kolom)

| # | Kolom | Wajib? | Contoh |
|---|-------|--------|--------|
| 1 | mata_pelajaran | Ya* | MATH |
| 2 | fase | Ya* | A |
| 3 | deskripsi_fase | Ya* | Pada akhir Fase A... |
| 4 | elemen_pembelajaran | Ya* | Bilangan |
| 5 | urutan_elemen | Ya | 1 |
| 6 | cp_elemen | Ya* | Siswa memahami... |
| 7 | kode_tp | **YA** | TP.MAT.1.1 |
| 8 | deskripsi_tp | **YA** | Siswa dapat... |
| 9 | urutan_tp | **YA** | 1 |
| 10 | tingkat | **YA** | 1-6 |
| 11 | semester | **YA** | Ganjil/Genap |

*) Bisa dikosongkan jika sama dengan baris sebelumnya

## 📝 Contoh Isian

```
Baris 1 (Header):
mata_pelajaran | fase | deskripsi_fase | elemen_pembelajaran | urutan_elemen | cp_elemen | kode_tp | deskripsi_tp | urutan_tp | tingkat | semester

Baris 2 (Data pertama - ISI SEMUA):
MATH | A | Pada akhir Fase A, siswa dapat operasi bilangan | Bilangan | 1 | Siswa memahami bilangan cacah | TP.MAT.1.1 | Siswa dapat membilang 1-20 | 1 | 1 | Ganjil

Baris 3 (TP sama, semester berbeda - KOSONGKAN kolom yang sama):
     |   |                                                |          |   |                                | TP.MAT.1.1 | Siswa dapat membilang 1-20 | 1 | 1 | Genap

Baris 4 (TP baru, elemen sama):
     |   |                                                |          |   |                                | TP.MAT.1.2 | Siswa dapat penjumlahan | 2 | 1 | Ganjil

Baris 5 (Elemen baru - ISI elemen & cp_elemen):
     |   |                                                | Geometri | 2 | Siswa mengenal bangun datar    | TP.MAT.2.1 | Siswa kenali segitiga | 1 | 1 | Genap
```

## ✅ Aturan Penting

### Kolom yang HARUS Diisi Setiap Baris:
- `kode_tp`
- `deskripsi_tp`
- `urutan_tp`
- `tingkat` (1-6)
- `semester` (Ganjil/Genap)

### Kolom yang Boleh Dikosongkan (jika sama):
- `mata_pelajaran`
- `fase`
- `deskripsi_fase`
- `elemen_pembelajaran`
- `urutan_elemen`
- `cp_elemen`

### Fase:
- A = Kelas 1-2
- B = Kelas 3-4
- C = Kelas 5-6

### Semester:
- `Ganjil` (huruf G besar!)
- `Genap` (huruf G besar!)

## 📚 Mata Pelajaran (Copy Paste Persis!):
- Life Skills
- Bahasa Indonesia
- Music
- Sport
- Citizenship
- Materi Keputrian Keputraan
- Religion
- MATH
- IPAS
- Budaya Jabar
- Literasi

## 🎯 Workflow:

1. **Generate template:**
   ```bash
   php artisan kurikulum:template
   ```

2. **Buka Excel:** `storage/app/public/template_kurikulum.xlsx`

3. **Lihat contoh** di baris 2-6 (background abu-abu)

4. **Isi data** mulai baris 7 ke bawah

5. **Save Excel**

6. **Import:**
   ```bash
   php artisan kurikulum:import public/template_kurikulum.xlsx
   ```

7. **Cek hasil** - lihat ringkasan success/error

## 💡 Tips:

- **TP berlaku di banyak semester/tingkat?** → Copy baris, ubah kolom tingkat/semester saja
- **Fase baru?** → Isi kolom fase & deskripsi_fase
- **Elemen baru?** → Isi kolom elemen_pembelajaran & cp_elemen
- **TP baru?** → Selalu isi kode_tp, deskripsi_tp, urutan_tp, tingkat, semester

## ❌ Error Umum:

| Error | Penyebab | Solusi |
|-------|----------|--------|
| Mata pelajaran tidak ditemukan | Typo nama mapel | Copy paste dari list di atas |
| Semester tidak ditemukan | Huruf kecil | Gunakan `Ganjil` atau `Genap` |
| Tingkat harus 1-6 | Salah input | Isi dengan angka 1, 2, 3, 4, 5, atau 6 |

## 📖 Dokumentasi Lengkap:
Baca file: `IMPORT_KURIKULUM_EXCEL.md`

---

**Happy importing! 🎉**
