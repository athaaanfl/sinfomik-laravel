# 📚 Dokumentasi Fitur Penugasan Mengajar Guru

## 🎯 Overview

Sistem untuk mengelola penugasan guru mengajar mata pelajaran di kelas, dengan 2 tipe penugasan:

1. **Guru Bidang Studi** - Guru yang khusus mengajar mata pelajaran tertentu
2. **Wali Kelas** - Guru yang otomatis mengajar beberapa mata pelajaran saat ditunjuk sebagai wali kelas

---

## 📁 Struktur File

### Backend (Laravel)

#### **Migrations**
- `database/migrations/2024_12_09_000001_create_penugasan_mengajars_table.php`
  - Tabel utama untuk menyimpan penugasan mengajar
  - Relasi: guru_id, mata_pelajaran_id, kelas_id, tahun_ajaran_id
  - Field tipe_penugasan: `bidang_studi` atau `wali_kelas`
  
- `database/migrations/2024_12_09_000002_create_mapel_wali_kelas_table.php`
  - Tabel konfigurasi mata pelajaran wali kelas
  - Field tingkat_allowed (JSON array): Tingkat mana saja yang diperbolehkan
  
- `database/migrations/2024_12_09_000003_add_homeroom_teacher_to_kelas_table.php`
  - Menambahkan kolom `homeroom_teacher_id` di tabel kelas

#### **Models**
- `app/Models/PenugasanMengajar.php`
  - Model utama untuk penugasan mengajar
  - Relasi: guru, mataPelajaran, kelas, tahunAjaran
  - Scopes: byGuru, aktif, byTipe

- `app/Models/MapelWaliKelas.php`
  - Model konfigurasi mata pelajaran wali kelas
  - Method: `isAllowedForTingkat()`, `getMapelForTingkat()`

- `app/Models/Kelas.php` (Updated)
  - Menambahkan relasi: `homeroomTeacher()`, `penugasanMengajars()`
  - Method: `assignWaliKelas()` - Trigger event otomatis

- `app/Models/Guru.php` (Updated)
  - Menambahkan relasi: `penugasanMengajars()`
  - Accessor: `getNamaAttribute()`

#### **Enums**
- `app/Enums/TipePenugasan.php`
  - BIDANG_STUDI: 'bidang_studi'
  - WALI_KELAS: 'wali_kelas'

#### **Events & Listeners**
- `app/Events/WaliKelasAssigned.php`
  - Event yang di-trigger saat guru ditunjuk sebagai wali kelas

- `app/Listeners/AutoCreatePenugasanWaliKelas.php`
  - Listener yang otomatis membuat penugasan mata pelajaran
  - Query konfigurasi dari `mapel_wali_kelas`
  - Filter berdasarkan tingkat kelas
  - Create penugasan dengan tipe `WALI_KELAS`

#### **Controllers**
- `app/Http/Controllers/PenugasanMengajarController.php`
  - `index()`: Tampilkan data guru dengan card-based UI
  - `create()`: Form dengan 3 scope (semua/tingkat/kelas)
  - `store()`: Bulk create penugasan
  - `destroy()`: Hapus penugasan
  - `getKelasByTahunAjaran()`: API untuk dynamic loading kelas

- `app/Http/Controllers/MapelWaliKelasController.php`
  - CRUD untuk konfigurasi mata pelajaran wali kelas
  - `toggleActive()`: Toggle status aktif/nonaktif
  - `updateUrutan()`: Update urutan tampilan

- `app/Http/Controllers/KelasController.php` (Updated)
  - Method `update()` menggunakan `assignWaliKelas()`
  - Method `show()` menambahkan data `allGurus`

#### **Form Requests**
- `app/Http/Requests/StorePenugasanMengajarRequest.php`
  - Validasi untuk bulk assignment
  - Rules untuk scope: semua, tingkat, kelas

- `app/Http/Requests/UpdateMapelWaliKelasRequest.php`
  - Validasi konfigurasi mapel wali kelas

#### **Routes**
- `routes/penugasan-mengajar.php`
  - Resource routes untuk penugasan mengajar
  - Nested routes untuk konfigurasi mapel wali kelas

---

### Frontend (React + TypeScript)

#### **Pages**
- `resources/js/pages/penugasan-mengajar/index.tsx`
  - Card-based UI per guru
  - Modal detail dengan breakdown per kelas
  - Filter tahun ajaran

- `resources/js/pages/penugasan-mengajar/create.tsx`
  - Form dengan 3 scope selection:
    - ✅ Semua kelas
    - ✅ Per tingkat (checkbox multiple)
    - ✅ Per kelas spesifik
  - Dynamic loading kelas berdasarkan tahun ajaran

- `resources/js/pages/penugasan-mengajar/konfigurasi-mapel-wali-kelas.tsx`
  - CRUD konfigurasi mata pelajaran
  - Checkbox tingkat untuk setiap mata pelajaran
  - Toggle aktif/nonaktif
  - Drag & drop untuk sorting (future enhancement)

- `resources/js/pages/kelas/show.tsx` (Updated)
  - Card wali kelas yang clickable
  - Dialog untuk assign/update wali kelas
  - Dropdown pilih guru

---

## 🔄 Flow Kerja

### 1. Penugasan Guru Bidang Studi

```
Admin → Penugasan Mengajar → Tambah Penugasan
  ↓
Pilih Guru + Mata Pelajaran + Tahun Ajaran
  ↓
Pilih Scope:
  - Semua kelas: Generate untuk SEMUA kelas
  - Per tingkat: Pilih tingkat 1-6 (checkbox)
  - Per kelas: Pilih kelas spesifik (multi-select)
  ↓
Simpan → Bulk create dengan tipe BIDANG_STUDI
```

### 2. Assign Wali Kelas (Auto-Assignment)

```
Admin → Data Kelas → Pilih Kelas → Klik Card "Wali Kelas"
  ↓
Dialog Atur Wali Kelas → Pilih Guru
  ↓
Simpan → KelasController::update()
  ↓
$kelas->assignWaliKelas($guruId, $tahunAjaranId)
  ↓
Update homeroom_teacher_id → Trigger Event: WaliKelasAssigned
  ↓
Listener: AutoCreatePenugasanWaliKelas
  ↓
Query MapelWaliKelas::getMapelForTingkat($kelas->tingkat)
  ↓
Filter mata pelajaran yang sesuai dengan tingkat
  ↓
Hapus penugasan wali kelas lama (jika ada)
  ↓
Loop: Create PenugasanMengajar untuk setiap mata pelajaran
  - tipe_penugasan = WALI_KELAS
  - keterangan = "Auto-generated dari penugasan wali kelas"
```

### 3. Konfigurasi Mata Pelajaran Wali Kelas

```
Admin → Penugasan Mengajar → Konfigurasi Mapel Wali Kelas
  ↓
Tambah Mata Pelajaran
  ↓
Pilih tingkat yang diperbolehkan (checkbox 1-6)
  ↓
Contoh:
  - Bahasa Indonesia: Tingkat 1-6 ✅✅✅✅✅✅
  - Matematika: Tingkat 1-6 ✅✅✅✅✅✅
  - IPAS: Tingkat 3-6 ❌❌✅✅✅✅
  - Citizenship: Tingkat 1-6 ✅✅✅✅✅✅
  - Lifeskills: Tingkat 1-6 ✅✅✅✅✅✅
```

---

## 📊 Database Schema

### Table: `penugasan_mengajars`
```sql
- id (PK)
- guru_id (FK → gurus.id)
- mata_pelajaran_id (FK → mata_pelajarans.id)
- kelas_id (FK → kelas.id)
- tahun_ajaran_id (FK → tahun_ajarans.id)
- tipe_penugasan (ENUM: bidang_studi, wali_kelas)
- keterangan (TEXT, nullable)
- timestamps

UNIQUE: (guru_id, mata_pelajaran_id, kelas_id, tahun_ajaran_id)
```

### Table: `mapel_wali_kelas`
```sql
- id (PK)
- mata_pelajaran_id (FK → mata_pelajarans.id, UNIQUE)
- tingkat_allowed (JSON) → [1,2,3,4,5,6]
- is_active (BOOLEAN)
- urutan (INTEGER)
- timestamps
```

### Table: `kelas` (Updated)
```sql
+ homeroom_teacher_id (FK → gurus.id, nullable)
```

---

## 🎨 UI/UX Design

### 1. Halaman Index (Card-Based)
```
┌─────────────────────────────────────┐
│  [Guru 1 - NIP 123456]             │
│  □ Wali Kelas: 3A                   │
│  ─────────────────────────────────  │
│  Mata Pelajaran:                    │
│  • Matematika        (5 kelas)     │
│  • Bahasa Indonesia  (1 kelas)     │
│  [Lihat Detail]                     │
└─────────────────────────────────────┘
```

### 2. Modal Detail
```
┌─────────────────────────────────────┐
│  Detail Penugasan - Guru Ahmad      │
│  ─────────────────────────────────  │
│  ▸ Matematika (Bidang Studi)       │
│    3A, 3B, 4A, 4B, 5A              │
│                                     │
│  ▸ Bahasa Indonesia (Wali Kelas)   │
│    3A                               │
└─────────────────────────────────────┘
```

### 3. Form Create (Scope Selection)
```
○ Semua kelas
  → Generate untuk SEMUA kelas di tahun ajaran

○ Per tingkat
  ☑ Tingkat 1 (3 kelas)
  ☑ Tingkat 2 (3 kelas)
  ☐ Tingkat 3 (3 kelas)

○ Per kelas spesifik
  Tingkat 1:
  ☑ 1A  ☑ 1B  ☐ 1C
```

---

## ⚙️ Konfigurasi

### Event Listener Registration
**File:** `app/Providers/AppServiceProvider.php`
```php
Event::listen(
    WaliKelasAssigned::class,
    AutoCreatePenugasanWaliKelas::class
);
```

### Route Registration
**File:** `bootstrap/app.php`
```php
->withRouting(
    ...
    then: function () {
        Route::middleware('web')
            ->group(base_path('routes/penugasan-mengajar.php'));
    }
)
```

---

## 🚀 Cara Menggunakan

### Step 1: Setup Konfigurasi Mapel Wali Kelas
1. Buka **Penugasan Mengajar** → **Konfigurasi Mapel Wali Kelas**
2. Tambah mata pelajaran yang ingin auto-assign
3. Centang tingkat yang diperbolehkan
4. Simpan

### Step 2: Assign Wali Kelas
1. Buka **Data Kelas** → Pilih kelas
2. Klik card **Wali Kelas**
3. Pilih guru dari dropdown
4. Simpan → Sistem otomatis buat penugasan mata pelajaran

### Step 3: Assign Guru Bidang Studi (Manual)
1. Buka **Penugasan Mengajar** → **Tambah Penugasan**
2. Pilih guru dan mata pelajaran
3. Pilih scope (semua/tingkat/kelas)
4. Simpan

### Step 4: Lihat Penugasan
1. Buka **Penugasan Mengajar**
2. Filter tahun ajaran
3. Lihat card per guru
4. Klik "Lihat Detail" untuk breakdown per kelas

---

## 🔒 Validasi & Business Logic

### Unique Constraint
- Satu guru tidak bisa mengajar mata pelajaran yang sama di kelas yang sama pada tahun ajaran yang sama
- Constraint: `(guru_id, mata_pelajaran_id, kelas_id, tahun_ajaran_id)`

### Auto-Assignment Logic
- Hanya mata pelajaran yang `is_active = true`
- Filter berdasarkan `tingkat_allowed`
- Hapus penugasan wali kelas lama sebelum create yang baru

### Cascade Delete
- Jika guru dihapus → penugasan dihapus
- Jika mata pelajaran dihapus → penugasan dihapus
- Jika kelas dihapus → penugasan dihapus
- Jika konfigurasi mapel wali kelas dihapus → tidak affect penugasan existing

---

## 📝 Notes

### Perbedaan Tipe Penugasan
- **BIDANG_STUDI**: Manual assignment, bisa multi-kelas
- **WALI_KELAS**: Auto-generated, tied to homeroom teacher

### Performance Considerations
- Index pada foreign keys untuk faster query
- Eager loading pada relasi untuk N+1 problem
- Bulk insert untuk efficiency

### Future Enhancements
- 🔄 Drag & drop sorting untuk konfigurasi mapel
- 📊 Report penugasan mengajar per guru/kelas
- 🔔 Notifikasi saat penugasan berubah
- 📅 Schedule penugasan untuk tahun ajaran mendatang
- 🔍 Advanced filter & search
- 📤 Export penugasan ke Excel/PDF

---

## 🐛 Troubleshooting

### Penugasan tidak auto-create saat assign wali kelas
**Cek:**
1. Event listener terdaftar di AppServiceProvider
2. Konfigurasi mapel wali kelas sudah dibuat
3. Mata pelajaran dalam status aktif
4. Tingkat kelas sesuai dengan `tingkat_allowed`

### Error unique constraint violation
**Solusi:**
- Cek apakah penugasan sudah ada
- Hapus penugasan lama sebelum create yang baru

### Kelas tidak muncul di dropdown
**Cek:**
- Tahun ajaran dipilih dengan benar
- Kelas sudah dibuat untuk tahun ajaran tersebut

---

## 📞 API Endpoints

### Penugasan Mengajar
- `GET /penugasan-mengajar` - Index (card-based)
- `GET /penugasan-mengajar/create` - Form create
- `POST /penugasan-mengajar` - Store (bulk create)
- `DELETE /penugasan-mengajar` - Destroy (batch delete)
- `GET /penugasan-mengajar/kelas/{tahun_ajaran_id}` - Get kelas by tahun ajaran

### Konfigurasi Mapel Wali Kelas
- `GET /penugasan-mengajar/konfigurasi-mapel` - Index
- `POST /penugasan-mengajar/konfigurasi-mapel` - Store
- `PUT /penugasan-mengajar/konfigurasi-mapel/{id}` - Update
- `DELETE /penugasan-mengajar/konfigurasi-mapel/{id}` - Destroy
- `PATCH /penugasan-mengajar/konfigurasi-mapel/{id}/toggle` - Toggle active
- `POST /penugasan-mengajar/konfigurasi-mapel/urutan` - Update urutan

### Update Wali Kelas
- `PUT /kelas/{id}` - Update (including homeroom_teacher_id)

---

## ✅ Checklist Implementasi

- [x] Migration penugasan_mengajars
- [x] Migration mapel_wali_kelas
- [x] Migration add homeroom_teacher_id to kelas
- [x] Model PenugasanMengajar dengan relasi
- [x] Model MapelWaliKelas dengan helper methods
- [x] Enum TipePenugasan
- [x] Event WaliKelasAssigned
- [x] Listener AutoCreatePenugasanWaliKelas
- [x] Controller PenugasanMengajarController
- [x] Controller MapelWaliKelasController
- [x] Form Requests (validation)
- [x] Routes registration
- [x] UI Index (card-based)
- [x] UI Create (with scope selection)
- [x] UI Konfigurasi Mapel Wali Kelas
- [x] Update UI Edit Kelas (assign wali kelas)
- [x] Event listener registration
- [x] Dokumentasi lengkap

**Status:** ✅ COMPLETED
