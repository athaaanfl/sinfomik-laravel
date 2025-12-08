# 📋 Template Request Fitur CRUD Baru

## 🎯 Cara Meminta Copilot Membuat Fitur Baru

### **Format Request Singkat:**
```
Buatkan fitur CRUD untuk [NAMA_FITUR] dengan field:
- field1 (type, required/optional, validasi)
- field2 (type, required/optional, validasi)
- ...

Icon: [nama_icon dari lucide-react]
Relasi (opsional): belongsTo/hasMany ke [Model lain]
```

### **Format Request Lengkap:**
```
Buatkan fitur CRUD lengkap untuk [NAMA_FITUR]

## Database & Model
- Table: [nama_table]
- Model: [NamaModel]
- Fields:
  * field_name (type, length, required/nullable, unique?, default?)
  * ...
  
## Relasi (jika ada)
- belongsTo: [Model] via [foreign_key]
- hasMany: [Model] via [foreign_key]

## Validasi Khusus
- Field X: [aturan khusus]
- Field Y: [aturan khusus]

## UI Requirements
- Icon sidebar: [icon_name]
- Fitur tambahan: [search, filter, export, dll]
- Layout khusus: [jika ada]

## Catatan Tambahan
- [Hal-hal spesifik lainnya]
```

---

## 📝 Contoh Request 1: Fitur Guru (Sederhana)

```
Buatkan fitur CRUD untuk Guru dengan field:
- nip (string, unique, required)
- nama (string, required)
- email (string, unique, required)
- no_telepon (string, optional)
- mata_pelajaran (string, required)
- status (enum: Aktif/Non Aktif, default: Aktif)

Icon: UserSquare
```

---

## 📝 Contoh Request 2: Fitur Mata Pelajaran (Lengkap)

```
Buatkan fitur CRUD lengkap untuk Mata Pelajaran

## Database & Model
- Table: mata_pelajarans
- Model: MataPelajaran
- Fields:
  * kode_mapel (string, 10, required, unique)
  * nama (string, 100, required)
  * kategori (enum: Wajib/Peminatan, required)
  * kkm (integer, required, min:0, max:100)
  * deskripsi (text, nullable)
  
## Relasi
- hasMany: Nilai via mata_pelajaran_id
- belongsToMany: Guru via mata_pelajaran_guru (pivot)

## Validasi Khusus
- kode_mapel: uppercase, format: XXX-999
- kkm: harus antara 50-100

## UI Requirements
- Icon sidebar: BookOpen
- Fitur tambahan: search by nama/kode, filter by kategori
- Tambahkan badge untuk kategori (Wajib=blue, Peminatan=green)

## Catatan Tambahan
- Di form, kategori menggunakan radio button, bukan select
- Tampilkan jumlah siswa terdaftar di halaman detail
```

---

## 📝 Contoh Request 3: Fitur dengan Relasi Kompleks

```
Buatkan fitur CRUD untuk Nilai

## Database & Model
- Table: nilais
- Model: Nilai
- Fields:
  * siswa_id (foreign key, required)
  * mata_pelajaran_id (foreign key, required)
  * semester_id (foreign key, required)
  * nilai_harian (decimal, nullable)
  * nilai_uts (decimal, nullable)
  * nilai_uas (decimal, nullable)
  * nilai_akhir (decimal, computed, nullable)
  
## Relasi
- belongsTo: Siswa via siswa_id
- belongsTo: MataPelajaran via mata_pelajaran_id
- belongsTo: Semester via semester_id

## Validasi Khusus
- Semua nilai: min:0, max:100
- nilai_akhir: auto-calculated = (harian*30% + uts*35% + uas*35%)
- Unique combination: siswa_id + mata_pelajaran_id + semester_id

## UI Requirements
- Icon sidebar: Award
- Di form create: select siswa, mapel, semester dengan searchable select
- Tampilkan nama siswa dan mapel (bukan ID)
- Auto-calculate nilai_akhir saat input nilai lain berubah
- Di tabel: filter by siswa, mapel, atau semester

## Catatan Tambahan
- Nilai akhir readonly di form
- Tambahkan badge grade (A/B/C/D/E) berdasarkan nilai_akhir
```

---

## 🎨 Request untuk Modifikasi/Enhancement

### **Format:**
```
Untuk fitur [NAMA_FITUR], tambahkan:
1. [Enhancement 1]
2. [Enhancement 2]
...
```

### **Contoh:**
```
Untuk fitur Siswa, tambahkan:
1. Search box di halaman index untuk cari nama/NIS
2. Filter dropdown untuk status (Aktif/Non Aktif)
3. Export data ke Excel
4. Bulk delete (pilih multiple siswa)
5. Photo upload untuk foto siswa
```

---

## 🔧 Request untuk Komponen UI

### **Format:**
```
Buatkan komponen [NAMA_KOMPONEN] dengan:
- Props: [list props]
- Functionality: [deskripsi]
- Styling: [jika ada requirement khusus]
```

### **Contoh:**
```
Buatkan komponen SearchableSelect dengan:
- Props: options (array), value, onChange, placeholder
- Functionality: 
  * Input field dengan dropdown
  * Filter options saat mengetik
  * Highlight matched text
- Styling: konsisten dengan Select component yang ada
```

---

## 🚨 Request untuk Debugging/Fix

### **Format:**
```
Ada masalah di [FITUR/FILE]:
- Error yang muncul: [error message]
- Expected: [hasil yang diharapkan]
- Actual: [hasil yang terjadi]
- Steps to reproduce: [langkah-langkah]
```

---

## 💡 Tips untuk Request yang Efektif

### ✅ DO (Lakukan):
1. **Spesifik tentang field types**
   - ❌ "field nama"
   - ✅ "nama (string, max 100, required)"

2. **Sebutkan relasi dengan jelas**
   - ❌ "connect dengan tabel siswa"
   - ✅ "belongsTo: Siswa via siswa_id"

3. **Definisikan validasi khusus**
   - ❌ "validasi email"
   - ✅ "email (unique:users, format email valid, required)"

4. **Berikan konteks untuk UI**
   - ❌ "bikin bagus"
   - ✅ "gunakan Card layout 2 kolom, badge untuk status, icon di modal"

### ❌ DON'T (Hindari):
1. Request terlalu umum: "buatkan CRUD siswa"
2. Tidak spesifik field: "semua data siswa yang diperlukan"
3. Asumsi tanpa detail: "seperti fitur sebelumnya"
4. Request tanpa struktur: "tolong buatkan fitur guru ada nama nip email dll"

---

## 📚 Referensi Cepat

### **Field Types Umum:**
- `string` - Text pendek
- `text` - Text panjang
- `integer` - Angka bulat
- `decimal(8,2)` - Angka desimal
- `date` - Tanggal
- `datetime` - Tanggal + Waktu
- `boolean` - True/False
- `enum(['A','B'])` - Pilihan terbatas
- `json` - Data JSON

### **Validasi Rules Umum:**
- `required` - Wajib diisi
- `nullable` - Boleh kosong
- `unique:table,column` - Nilai unik
- `min:X` / `max:X` - Panjang/nilai min/max
- `email` - Format email
- `regex:pattern` - Pattern khusus
- `in:A,B,C` - Pilihan terbatas
- `exists:table,column` - Harus ada di tabel

### **Icons Populer (lucide-react):**
- Users, User, UserSquare - Untuk user/orang
- GraduationCap - Untuk siswa/pendidikan
- BookOpen, Book - Untuk mata pelajaran/buku
- Calendar - Untuk tanggal/jadwal
- Award, Trophy - Untuk nilai/prestasi
- FileText, File - Untuk dokumen
- Settings, Cog - Untuk pengaturan
- BarChart, TrendingUp - Untuk statistik

---

## 🎯 Workflow Request yang Ideal

1. **Mulai dengan request jelas:**
   ```
   Buatkan fitur CRUD untuk Kelas dengan field:
   - nama_kelas (string, required)
   - tingkat (integer, required, 10-12)
   - wali_kelas_id (foreign key to gurus)
   Icon: School
   ```

2. **Saya akan konfirmasi pemahaman:**
   ```
   Baik, saya akan membuat:
   - Model Kelas
   - Controller dengan CRUD
   - 4 Pages (index, create, edit, show)
   - Validation
   - Routes & Sidebar menu
   
   Apakah ada requirement tambahan?
   ```

3. **Anda bisa tambahkan detail:**
   ```
   Ya, tambahkan:
   - Di form, pilih wali_kelas dari dropdown guru
   - Di index, tampilkan nama wali kelas (bukan ID)
   ```

4. **Saya implementasi lengkap**

5. **Anda review & request perubahan jika perlu**

---

## 🎁 Bonus: Template Quick Request

Copy-paste dan edit bagian yang di-[ ]:

```
Buatkan fitur CRUD untuk [NAMA_FITUR] dengan field:
- [field1] ([type], [required/optional])
- [field2] ([type], [required/optional])
- [field3] ([type], [required/optional])

Icon: [IconName]
Relasi: [jika ada]
Catatan: [jika ada hal khusus]
```

---

**Simpan file ini sebagai referensi saat ingin membuat fitur baru!** 🚀

Kedepannya, cukup berikan request dengan format di atas, dan saya akan otomatis tahu struktur lengkap yang harus dibuat! 💪
