# Fitur Penugasan Mengajar Guru

## 🎯 Tujuan Fitur
Sistem untuk mengelola penugasan guru mengajar mata pelajaran di kelas, dengan 2 tipe penugasan:
1. **Guru Bidang Studi** - Guru yang khusus mengajar mata pelajaran tertentu
2. **Wali Kelas** - Guru yang otomatis mengajar beberapa mata pelajaran saat ditunjuk sebagai wali kelas

---

## 📋 Requirements & Use Cases

### Use Case 1: Penugasan Guru Bidang Studi
**Skenario:**
- Guru A mengajar Matematika di **semua kelas tingkat 1 - 3**
- Guru B mengajar IPA di **semua kelas tingkat 4 - 6**
- Guru C mengajar Bahasa Inggris di **kelas 5 - Rucita, 5 - Binangkit, 6 - Gumilang saja** (per kelas spesifik)

**Kebutuhan UI:**
- Admin harus bisa input penugasan dengan **1 form** saja untuk generate banyak kelas sekaligus
- Pilihan scope:
  - ✅ Semua kelas (di semua tingkat)
  - ✅ Per tingkat (checkbox: tingkat 1, 2, 3, dst)
  - ✅ Per kelas spesifik (multi-select kelas)

### Use Case 2: Wali Kelas dengan Auto-Assignment
**Skenario:**
- Sekolah punya kebijakan: Wali kelas mengajar 5 mata pelajaran:
  1. Bahasa Indonesia
  2. Matematika
  3. Citizenship
  4. IPAS **HANYA untuk tingkat 3-6**
  5. Lifeskills

**Flow:**
1. Admin buka halaman **Edit Kelas** (misal: Kelas 3 - Calakan)
2. Admin centang checkbox **"Jadikan Wali Kelas"**
3. Admin pilih Guru dari dropdown
4. Klik **Simpan**
5. **Sistem otomatis:**
   - Update `kelas.homeroom_teacher_id` = guru terpilih
   - Trigger Event `WaliKelasAssigned`
   - Listener query konfigurasi `mapel_wali_kelas`
   - Check tingkat kelas (3A = tingkat 3)
   - Auto-create penugasan untuk mata pelajaran yang diperbolehkan di tingkat 3
   - Contoh: IPAS masuk karena tingkat 3 ada di `tingkat_allowed: [3,4,5,6]`

**Konfigurasi Mapel Wali Kelas:**
- Admin bisa set mata pelajaran mana yang otomatis diajarkan wali kelas
- **Checkbox tingkat** untuk presisi (contoh: IPAS tidak di tingkat 1-2)
- Toggle aktif/non-aktif per mata pelajaran

### Use Case 3: Halaman Index yang Efisien
**Masalah Sebelumnya:**
- ❌ Guru muncul berulang-ulang jika mengajar banyak kelas/mapel
- ❌ Tabel jadi panjang dan susah dibaca

**Solusi:**
- **Card-based UI per Guru**
- Setiap card menampilkan:
  - Nama Guru + NIP
  - Mata pelajaran yang diajarkan (dengan jumlah kelas)
  - Status wali kelas (jika ada)
  - Button "Lihat Detail" → Modal dengan breakdown per kelas

**Contoh Card:**
```
┌──────────────────────────────────────────────────┐
│ 🧑‍🏫 Budi Santoso                        [Edit]    │
│ NIP: 123456789                                   │
│ Tahun Ajaran: 2024/2025 Semester 1               │
│                                                  │
│ 📚 Guru Bidang Studi:                            │
│   • Matematika (15 kelas) - Tingkat 1-6          │
│   • IPA (8 kelas) - Tingkat 4-6                  │
│                                                  │
│ 🏫 Wali Kelas: Kelas 3A                         |
│   └─ Mengajar: Bahasa Indonesia, Matematika,     │
│     PKN, IPAS, Seni & Budaya                     │
│                                                  │
│ [Lihat Detail] [Edit Penugasan]                  │
└──────────────────────────────────────────────────┘
```

---

## 🗄️ Database Schema

### Tabel 1: `guru_mata_pelajaran`
**Purpose:** Hubungkan guru dengan mata pelajaran yang diajarkan di tahun ajaran tertentu

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| guru_id | bigint | FK ke `gurus` |
| mata_pelajaran_id | bigint | FK ke `mata_pelajarans` |
| tahun_ajaran_id | bigint | FK ke `tahun_ajarans` |
| tipe_penugasan | enum | `'wali_kelas'` atau `'guru_bidang_studi'` |
| created_at | timestamp | |
| updated_at | timestamp | |

**Unique Constraint:**
```sql
UNIQUE(guru_id, mata_pelajaran_id, tahun_ajaran_id, tipe_penugasan)
```

**Relasi:**
- `belongsTo(Guru)`
- `belongsTo(MataPelajaran)`
- `belongsTo(TahunAjaran)`
- `hasMany(GuruKelas)` - Detail kelas yang diajarkan

---

### Tabel 2: `guru_kelas`
**Purpose:** Detail kelas mana saja yang diajarkan untuk setiap penugasan guru-mapel

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| guru_mata_pelajaran_id | bigint | FK ke `guru_mata_pelajaran` |
| kelas_id | bigint | FK ke `kelas` |
| created_at | timestamp | |
| updated_at | timestamp | |

**Unique Constraint:**
```sql
UNIQUE(guru_mata_pelajaran_id, kelas_id)
```

**Relasi:**
- `belongsTo(GuruMataPelajaran)`
- `belongsTo(Kelas)`

---

### Tabel 3: `mapel_wali_kelas`
**Purpose:** Konfigurasi mata pelajaran yang otomatis diajarkan wali kelas

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| mata_pelajaran_id | bigint | FK ke `mata_pelajarans` |
| tingkat_allowed | json | Array tingkat yang diperbolehkan, contoh: `[1,2,3,4,5,6]` atau `[3,4,5,6]` |
| is_active | boolean | Status aktif/non-aktif |
| created_at | timestamp | |
| updated_at | timestamp | |

**Unique Constraint:**
```sql
UNIQUE(mata_pelajaran_id)
```

**Relasi:**
- `belongsTo(MataPelajaran)`

**Contoh Data:**
```json
[
  { "mata_pelajaran_id": 1, "tingkat_allowed": [1,2,3,4,5,6], "is_active": true },  // B. Indonesia
  { "mata_pelajaran_id": 2, "tingkat_allowed": [1,2,3,4,5,6], "is_active": true },  // Matematika
  { "mata_pelajaran_id": 3, "tingkat_allowed": [1,2,3,4,5,6], "is_active": true },  // PKN
  { "mata_pelajaran_id": 4, "tingkat_allowed": [3,4,5,6], "is_active": true },      // IPAS (tidak di tingkat 1-2)
  { "mata_pelajaran_id": 5, "tingkat_allowed": [1,2,3,4,5,6], "is_active": true }   // Seni & Budaya
]
```

---

## 🔄 Flow Sistem

### A. Flow Penugasan Guru Bidang Studi (Manual)

```
1. Admin pilih Tahun Ajaran (context global)
   ↓
2. Admin klik "Tambah Penugasan"
   ↓
3. Form:
   - Pilih Guru (Select)
   - Pilih Mata Pelajaran (Multi-select, bisa pilih >1 mapel)
   ↓
4. Pilih Scope Kelas (Radio Button):
   ○ Semua Kelas (di semua tingkat)
   ○ Per Tingkat → [Checkbox] ☑ Tingkat 1  ☑ Tingkat 2  ☐ Tingkat 3 ...
   ○ Per Kelas Spesifik → [Multi-select kelas]
   ↓
5. Sistem proses:
   - Untuk setiap mata pelajaran yang dipilih:
     a. Create/update record di `guru_mata_pelajaran`
        (tipe_penugasan = 'guru_bidang_studi')
     b. Query kelas yang sesuai scope
     c. Batch insert ke `guru_kelas`
   ↓
6. Redirect ke halaman index dengan notifikasi sukses
```

**Contoh:**
- Guru: Budi
- Mata Pelajaran: Matematika, IPA
- Scope: Tingkat 1, 2, 3
- Kelas yang ada: 1A, 1B, 2A, 2B, 3A, 3B (6 kelas)

**Hasil Database:**
```sql
-- guru_mata_pelajaran
INSERT (guru_id=1, mata_pelajaran_id=1 [Matematika], tahun_ajaran_id=5, tipe='guru_bidang_studi')
INSERT (guru_id=1, mata_pelajaran_id=2 [IPA], tahun_ajaran_id=5, tipe='guru_bidang_studi')

-- guru_kelas (12 records total)
INSERT (guru_mata_pelajaran_id=1, kelas_id=1) -- Matematika di 1A
INSERT (guru_mata_pelajaran_id=1, kelas_id=2) -- Matematika di 1B
... (6 records untuk Matematika)
INSERT (guru_mata_pelajaran_id=2, kelas_id=1) -- IPA di 1A
INSERT (guru_mata_pelajaran_id=2, kelas_id=2) -- IPA di 1B
... (6 records untuk IPA)
```

---

### B. Flow Wali Kelas (Auto-Assignment)

```
1. Admin buka halaman "Edit Kelas" (misal: Kelas 3A)
   ↓
2. Form memiliki:
   - Checkbox: "Jadikan Wali Kelas"
   - Select Guru (muncul jika checkbox dicentang)
   ↓
3. Admin centang checkbox + pilih Guru
   ↓
4. Klik Simpan
   ↓
5. KelasController::update() detect perubahan homeroom_teacher_id:
   - Update kelas.homeroom_teacher_id = guru_id
   - Dispatch Event: WaliKelasAssigned($kelas, $guru_id)
   ↓
6. Listener: AssignDefaultMataPelajaranToWaliKelas::handle()
   {
     $tingkat = $kelas->tingkat; // 3
     $tahunAjaranId = $kelas->tahun_ajaran_id;
     
     // Query konfigurasi mapel wali kelas
     $configs = MapelWaliKelas::where('is_active', true)
         ->whereJsonContains('tingkat_allowed', $tingkat)
         ->get();
     
     foreach ($configs as $config) {
         // 1. Create/Get guru_mata_pelajaran
         $guruMapel = GuruMataPelajaran::firstOrCreate([
             'guru_id' => $guru_id,
             'mata_pelajaran_id' => $config->mata_pelajaran_id,
             'tahun_ajaran_id' => $tahunAjaranId,
             'tipe_penugasan' => 'wali_kelas',
         ]);
         
         // 2. Create guru_kelas (assign ke kelas ini saja)
         GuruKelas::firstOrCreate([
             'guru_mata_pelajaran_id' => $guruMapel->id,
             'kelas_id' => $kelas->id,
         ]);
     }
   }
   ↓
7. Redirect dengan notifikasi: "Guru berhasil ditugaskan sebagai wali kelas + 5 mata pelajaran"
```

**Contoh:**
- Kelas: 3A (tingkat = 3)
- Guru: Siti
- Konfigurasi mapel_wali_kelas:
  - Bahasa Indonesia: `[1,2,3,4,5,6]` ✅
  - Matematika: `[1,2,3,4,5,6]` ✅
  - PKN: `[1,2,3,4,5,6]` ✅
  - IPAS: `[3,4,5,6]` ✅ (tingkat 3 allowed)
  - Seni: `[1,2,3,4,5,6]` ✅

**Hasil Database:**
```sql
-- kelas
UPDATE kelas SET homeroom_teacher_id = 2 WHERE id = 10 (Kelas 3A)

-- guru_mata_pelajaran (5 records)
INSERT (guru_id=2, mata_pelajaran_id=1 [B.Indo], tahun_ajaran_id=5, tipe='wali_kelas')
INSERT (guru_id=2, mata_pelajaran_id=2 [Matematika], tahun_ajaran_id=5, tipe='wali_kelas')
INSERT (guru_id=2, mata_pelajaran_id=3 [PKN], tahun_ajaran_id=5, tipe='wali_kelas')
INSERT (guru_id=2, mata_pelajaran_id=4 [IPAS], tahun_ajaran_id=5, tipe='wali_kelas')
INSERT (guru_id=2, mata_pelajaran_id=5 [Seni], tahun_ajaran_id=5, tipe='wali_kelas')

-- guru_kelas (5 records, semua ke kelas_id=10)
INSERT (guru_mata_pelajaran_id=3, kelas_id=10)
INSERT (guru_mata_pelajaran_id=4, kelas_id=10)
INSERT (guru_mata_pelajaran_id=5, kelas_id=10)
INSERT (guru_mata_pelajaran_id=6, kelas_id=10)
INSERT (guru_mata_pelajaran_id=7, kelas_id=10)
```

---

### C. Flow Unassign Wali Kelas

```
1. Admin uncheck "Jadikan Wali Kelas" di halaman Edit Kelas
   ↓
2. KelasController::update() detect:
   - old homeroom_teacher_id = 2 (Guru Siti)
   - new homeroom_teacher_id = null
   ↓
3. Dispatch Event: WaliKelasRemoved($kelas, $oldGuruId)
   ↓
4. Listener: RemoveWaliKelasMataPelajaran::handle()
   {
     // Hapus semua penugasan wali kelas di kelas ini
     $guruMapelIds = GuruMataPelajaran::where('guru_id', $oldGuruId)
         ->where('tahun_ajaran_id', $kelas->tahun_ajaran_id)
         ->where('tipe_penugasan', 'wali_kelas')
         ->pluck('id');
     
     GuruKelas::whereIn('guru_mata_pelajaran_id', $guruMapelIds)
         ->where('kelas_id', $kelas->id)
         ->delete();
     
     // Hapus guru_mata_pelajaran jika tidak ada kelas lain
     foreach ($guruMapelIds as $id) {
         $count = GuruKelas::where('guru_mata_pelajaran_id', $id)->count();
         if ($count == 0) {
             GuruMataPelajaran::destroy($id);
         }
     }
   }
   ↓
5. Update kelas.homeroom_teacher_id = null
```

---

## 🎨 UI/UX Design

### 1. Halaman Index `/penugasan`

**Filter Section:**
```
┌──────────────────────────────────────────────────┐
│ Tahun Ajaran: [2024/2025 Semester 1 ▼]         │
│ Guru: [Semua Guru ▼]  Kelas: [Semua Kelas ▼]   │
│                                     [Tambah +]   │
└──────────────────────────────────────────────────┘
```

**Card Section (per Guru):**
```
┌──────────────────────────────────────────────────┐
│ 🧑‍🏫 Budi Santoso                        [Edit]    │
│ NIP: 123456789                                   │
│                                                  │
│ 📚 Guru Bidang Studi:                           │
│   • Matematika (15 kelas) - Tingkat 1-6        │
│     └─ 1A, 1B, 1C, 2A, 2B, 2C, 3A, 3B, 3C, ... │
│   • IPA (8 kelas) - Tingkat 4-6                │
│     └─ 4A, 4B, 5A, 5B, 6A, 6B, 6C, 6D          │
│                                                  │
│ 🏫 Wali Kelas: Kelas 3A                         │
│   └─ Mengajar: Bahasa Indonesia, Matematika,   │
│     PKN, IPAS, Seni & Budaya                    │
│                                                  │
│ [Lihat Detail] [Edit Penugasan] [Hapus]        │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│ 🧑‍🏫 Siti Aminah                         [Edit]    │
│ NIP: 987654321                                   │
│                                                  │
│ 🏫 Wali Kelas: Kelas 1B                         │
│   └─ Mengajar: Bahasa Indonesia, Matematika,   │
│     PKN, Seni & Budaya                          │
│   (IPAS tidak diajarkan di tingkat 1)           │
│                                                  │
│ [Lihat Detail] [Edit Penugasan] [Hapus]        │
└──────────────────────────────────────────────────┘
```

---

### 2. Form Tambah Penugasan `/penugasan/create`

**Step by Step Form:**

```
┌─────────────────────────────────────────────────────┐
│ Tambah Penugasan Mengajar                          │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Tahun Ajaran: [2024/2025 Semester 1 ▼]            │
│ Guru: [Pilih Guru ▼]                               │
│                                                     │
│ Mata Pelajaran:                                     │
│ [Select Multiple]                                   │
│ ☑ Matematika                                        │
│ ☑ IPA                                               │
│ ☐ Bahasa Indonesia                                  │
│ ☐ PKN                                               │
│ ...                                                 │
│                                                     │
│ ─────────────────────────────────────────────────  │
│                                                     │
│ Scope Kelas:                                        │
│ ○ Semua Kelas (di semua tingkat)                   │
│ ● Per Tingkat                                       │
│   └─ ☑ Tingkat 1  ☑ Tingkat 2  ☑ Tingkat 3        │
│      ☐ Tingkat 4  ☐ Tingkat 5  ☐ Tingkat 6        │
│ ○ Per Kelas Spesifik                               │
│   └─ [Multi-select disabled]                       │
│                                                     │
│ Preview: Akan membuat penugasan untuk 18 kelas     │
│                                                     │
│ [Batal]                             [Simpan]       │
└─────────────────────────────────────────────────────┘
```

**Logika Preview:**
- Query kelas berdasarkan scope + tahun ajaran
- Hitung jumlah mapel x jumlah kelas
- Tampilkan estimasi: "Akan membuat X penugasan untuk Y kelas"

---

### 3. Modal Detail Penugasan

**Triggered dari button "Lihat Detail" di card:**

```
┌─────────────────────────────────────────────────────┐
│ Detail Penugasan - Budi Santoso                   │
├─────────────────────────────────────────────────────┤
│ Tahun Ajaran: 2024/2025 Semester 1                 │
│                                                     │
│ ═══ Guru Bidang Studi ═══                          │
│                                                     │
│ ▼ Matematika (15 kelas)                            │
│   Tingkat 1: 1A, 1B, 1C                            │
│   Tingkat 2: 2A, 2B, 2C                            │
│   Tingkat 3: 3A, 3B, 3C                            │
│   Tingkat 4: 4A, 4B, 4C                            │
│   Tingkat 5: 5A, 5B, 5C                            │
│                                                     │
│ ▼ IPA (8 kelas)                                     │
│   Tingkat 4: 4A, 4B                                │
│   Tingkat 5: 5A, 5B                                │
│   Tingkat 6: 6A, 6B, 6C, 6D                        │
│                                                     │
│ ═══ Wali Kelas ═══                                 │
│                                                     │
│ Kelas 3A (Auto-assigned)                           │
│   • Bahasa Indonesia                               │
│   • Matematika                                      │
│   • PKN                                             │
│   • IPAS                                            │
│   • Seni & Budaya                                   │
│                                                     │
│                                      [Tutup]       │
└─────────────────────────────────────────────────────┘
```

---

### 4. Konfigurasi Mapel Wali Kelas (Sub-menu)

**Route:** `/penugasan/konfigurasi-mapel-walas`

**List View:**
```
┌─────────────────────────────────────────────────────┐
│ Konfigurasi Mata Pelajaran Wali Kelas              │
├─────────────────────────────────────────────────────┤
│                                                     │
│ ℹ️  Mata pelajaran yang akan otomatis diajarkan    │
│    ketika guru ditunjuk sebagai wali kelas         │
│                                         [Tambah +]  │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│ ☑ Bahasa Indonesia                      [Edit]     │
│   Berlaku untuk: Tingkat 1, 2, 3, 4, 5, 6         │
│                                                     │
│ ☑ Matematika                            [Edit]     │
│   Berlaku untuk: Tingkat 1, 2, 3, 4, 5, 6         │
│                                                     │
│ ☑ PKN (Pendidikan Kewarganegaraan)     [Edit]     │
│   Berlaku untuk: Tingkat 1, 2, 3, 4, 5, 6         │
│                                                     │
│ ☑ IPAS (Ilmu Pengetahuan Alam & Sosial) [Edit]    │
│   Berlaku untuk: Tingkat 3, 4, 5, 6 ⚠️            │
│   (Tidak diajarkan di tingkat 1-2)                 │
│                                                     │
│ ☑ Seni & Budaya                         [Edit]     │
│   Berlaku untuk: Tingkat 1, 2, 3, 4, 5, 6         │
│                                                     │
│ ☐ Bahasa Inggris                        [Edit]     │
│   Berlaku untuk: Tingkat 4, 5, 6                   │
│   (Non-aktif)                                       │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Form Edit:**
```
┌─────────────────────────────────────────────────────┐
│ Edit Konfigurasi - IPAS                            │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Mata Pelajaran: IPAS (Ilmu Pengetahuan Alam &     │
│                      Sosial)                        │
│                                                     │
│ Berlaku untuk Tingkat:                             │
│ ☐ Tingkat 1   ☐ Tingkat 2   ☑ Tingkat 3           │
│ ☑ Tingkat 4   ☑ Tingkat 5   ☑ Tingkat 6           │
│                                                     │
│ Status: ● Aktif  ○ Non-aktif                       │
│                                                     │
│ [Batal]                             [Simpan]       │
└─────────────────────────────────────────────────────┘
```

---

### 5. Integrasi di Halaman Edit Kelas

**File:** `resources/js/pages/kelas/edit.tsx`

**Tambahan di Form:**
```tsx
{/* Existing fields: nama, tingkat, tahun_ajaran_id */}

<div className="space-y-4">
  <div className="flex items-center space-x-2">
    <Checkbox 
      id="is-wali-kelas"
      checked={data.homeroom_teacher_id !== null}
      onCheckedChange={(checked) => {
        if (!checked) {
          setData('homeroom_teacher_id', null);
        }
      }}
    />
    <label htmlFor="is-wali-kelas" className="text-sm font-medium">
      Jadikan sebagai kelas dengan Wali Kelas
    </label>
  </div>
  
  {data.homeroom_teacher_id !== null && (
    <div>
      <label className="text-sm font-medium">Guru Wali Kelas</label>
      <Select 
        value={data.homeroom_teacher_id?.toString() || ''}
        onValueChange={(value) => setData('homeroom_teacher_id', parseInt(value))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Pilih Guru" />
        </SelectTrigger>
        <SelectContent>
          {gurus.map(guru => (
            <SelectItem key={guru.id} value={guru.id.toString()}>
              {guru.user?.name || guru.nama} - {guru.nip}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <p className="text-xs text-muted-foreground mt-1">
        💡 Guru akan otomatis ditugaskan mengajar mata pelajaran wali kelas
      </p>
    </div>
  )}
</div>
```

---

## 🔧 Technical Implementation

### Models

#### 1. `GuruMataPelajaran.php`
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GuruMataPelajaran extends Model
{
    protected $table = 'guru_mata_pelajaran';
    
    protected $fillable = [
        'guru_id',
        'mata_pelajaran_id',
        'tahun_ajaran_id',
        'tipe_penugasan',
    ];

    public function guru(): BelongsTo
    {
        return $this->belongsTo(Guru::class);
    }

    public function mataPelajaran(): BelongsTo
    {
        return $this->belongsTo(MataPelajaran::class);
    }

    public function tahunAjaran(): BelongsTo
    {
        return $this->belongsTo(TahunAjaran::class);
    }

    public function guruKelas(): HasMany
    {
        return $this->hasMany(GuruKelas::class);
    }
    
    // Scope untuk filter tipe penugasan
    public function scopeWaliKelas($query)
    {
        return $query->where('tipe_penugasan', 'wali_kelas');
    }
    
    public function scopeGuruBidangStudi($query)
    {
        return $query->where('tipe_penugasan', 'guru_bidang_studi');
    }
}
```

#### 2. `GuruKelas.php`
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GuruKelas extends Model
{
    protected $table = 'guru_kelas';
    
    protected $fillable = [
        'guru_mata_pelajaran_id',
        'kelas_id',
    ];

    public function guruMataPelajaran(): BelongsTo
    {
        return $this->belongsTo(GuruMataPelajaran::class);
    }

    public function kelas(): BelongsTo
    {
        return $this->belongsTo(Kelas::class);
    }
}
```

#### 3. `MapelWaliKelas.php`
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MapelWaliKelas extends Model
{
    protected $table = 'mapel_wali_kelas';
    
    protected $fillable = [
        'mata_pelajaran_id',
        'tingkat_allowed',
        'is_active',
    ];

    protected $casts = [
        'tingkat_allowed' => 'array',
        'is_active' => 'boolean',
    ];

    public function mataPelajaran(): BelongsTo
    {
        return $this->belongsTo(MataPelajaran::class);
    }
    
    // Scope untuk filter aktif
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
    
    // Check apakah mapel ini diperbolehkan untuk tingkat tertentu
    public function isAllowedForTingkat(int $tingkat): bool
    {
        return in_array($tingkat, $this->tingkat_allowed);
    }
}
```

---

### Events & Listeners

#### Event: `WaliKelasAssigned.php`
```php
<?php

namespace App\Events;

use App\Models\Kelas;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class WaliKelasAssigned
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public Kelas $kelas,
        public int $guruId
    ) {}
}
```

#### Event: `WaliKelasRemoved.php`
```php
<?php

namespace App\Events;

use App\Models\Kelas;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class WaliKelasRemoved
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public Kelas $kelas,
        public int $oldGuruId
    ) {}
}
```

#### Listener: `AssignDefaultMataPelajaranToWaliKelas.php`
```php
<?php

namespace App\Listeners;

use App\Events\WaliKelasAssigned;
use App\Models\GuruKelas;
use App\Models\GuruMataPelajaran;
use App\Models\MapelWaliKelas;
use Illuminate\Support\Facades\DB;

class AssignDefaultMataPelajaranToWaliKelas
{
    public function handle(WaliKelasAssigned $event): void
    {
        $kelas = $event->kelas;
        $guruId = $event->guruId;
        $tingkat = $kelas->tingkat;
        $tahunAjaranId = $kelas->tahun_ajaran_id;

        // Query konfigurasi mapel wali kelas yang aktif dan diperbolehkan untuk tingkat ini
        $configs = MapelWaliKelas::active()
            ->whereJsonContains('tingkat_allowed', $tingkat)
            ->get();

        DB::transaction(function () use ($configs, $guruId, $tahunAjaranId, $kelas) {
            foreach ($configs as $config) {
                // 1. Create/Get guru_mata_pelajaran
                $guruMapel = GuruMataPelajaran::firstOrCreate(
                    [
                        'guru_id' => $guruId,
                        'mata_pelajaran_id' => $config->mata_pelajaran_id,
                        'tahun_ajaran_id' => $tahunAjaranId,
                        'tipe_penugasan' => 'wali_kelas',
                    ]
                );

                // 2. Create guru_kelas (assign ke kelas ini)
                GuruKelas::firstOrCreate([
                    'guru_mata_pelajaran_id' => $guruMapel->id,
                    'kelas_id' => $kelas->id,
                ]);
            }
        });
    }
}
```

#### Listener: `RemoveWaliKelasMataPelajaran.php`
```php
<?php

namespace App\Listeners;

use App\Events\WaliKelasRemoved;
use App\Models\GuruKelas;
use App\Models\GuruMataPelajaran;
use Illuminate\Support\Facades\DB;

class RemoveWaliKelasMataPelajaran
{
    public function handle(WaliKelasRemoved $event): void
    {
        $kelas = $event->kelas;
        $oldGuruId = $event->oldGuruId;
        $tahunAjaranId = $kelas->tahun_ajaran_id;

        DB::transaction(function () use ($oldGuruId, $tahunAjaranId, $kelas) {
            // Get semua guru_mata_pelajaran wali kelas dari guru ini
            $guruMapelIds = GuruMataPelajaran::where('guru_id', $oldGuruId)
                ->where('tahun_ajaran_id', $tahunAjaranId)
                ->where('tipe_penugasan', 'wali_kelas')
                ->pluck('id');

            // Hapus guru_kelas untuk kelas ini
            GuruKelas::whereIn('guru_mata_pelajaran_id', $guruMapelIds)
                ->where('kelas_id', $kelas->id)
                ->delete();

            // Hapus guru_mata_pelajaran jika tidak ada kelas lain
            foreach ($guruMapelIds as $id) {
                $count = GuruKelas::where('guru_mata_pelajaran_id', $id)->count();
                if ($count == 0) {
                    GuruMataPelajaran::destroy($id);
                }
            }
        });
    }
}
```

---

### Controllers

#### `PenugasanController.php`
```php
<?php

namespace App\Http\Controllers;

use App\Models\Guru;
use App\Models\GuruKelas;
use App\Models\GuruMataPelajaran;
use App\Models\Kelas;
use App\Models\MataPelajaran;
use App\Models\TahunAjaran;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PenugasanController extends Controller
{
    public function index(Request $request)
    {
        $tahunAjaranId = $request->get('tahun_ajaran_id') ?: TahunAjaran::where('is_active', true)->first()?->id;
        $guruId = $request->get('guru_id');

        // Query guru dengan penugasan mereka
        $gurus = Guru::with([
            'guruMataPelajaran' => function ($q) use ($tahunAjaranId) {
                $q->where('tahun_ajaran_id', $tahunAjaranId)
                  ->with(['mataPelajaran', 'guruKelas.kelas']);
            },
            'kelasAsWaliKelas' => function ($q) use ($tahunAjaranId) {
                $q->where('tahun_ajaran_id', $tahunAjaranId);
            },
            'user'
        ])
        ->when($guruId, fn($q) => $q->where('id', $guruId))
        ->get()
        ->filter(fn($guru) => $guru->guruMataPelajaran->count() > 0 || $guru->kelasAsWaliKelas->count() > 0);

        return Inertia::render('penugasan/index', [
            'gurus' => $gurus,
            'tahunAjarans' => TahunAjaran::orderBy('tahun', 'desc')->get(),
            'filters' => [
                'tahun_ajaran_id' => $tahunAjaranId,
                'guru_id' => $guruId,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('penugasan/create', [
            'gurus' => Guru::with('user')->get(),
            'mataPelajarans' => MataPelajaran::all(),
            'tahunAjarans' => TahunAjaran::orderBy('tahun', 'desc')->get(),
            'kelasList' => Kelas::with('tahunAjaran')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'guru_id' => 'required|exists:gurus,id',
            'mata_pelajaran_ids' => 'required|array',
            'mata_pelajaran_ids.*' => 'exists:mata_pelajarans,id',
            'tahun_ajaran_id' => 'required|exists:tahun_ajarans,id',
            'scope' => 'required|in:all,tingkat,kelas',
            'tingkat' => 'required_if:scope,tingkat|array',
            'tingkat.*' => 'integer|between:1,6',
            'kelas_ids' => 'required_if:scope,kelas|array',
            'kelas_ids.*' => 'exists:kelas,id',
        ]);

        DB::transaction(function () use ($validated) {
            // Tentukan kelas mana yang akan di-assign
            $kelasIds = $this->resolveKelasIds($validated);

            foreach ($validated['mata_pelajaran_ids'] as $mapelId) {
                // Create/Get guru_mata_pelajaran
                $guruMapel = GuruMataPelajaran::firstOrCreate([
                    'guru_id' => $validated['guru_id'],
                    'mata_pelajaran_id' => $mapelId,
                    'tahun_ajaran_id' => $validated['tahun_ajaran_id'],
                    'tipe_penugasan' => 'guru_bidang_studi',
                ]);

                // Batch insert guru_kelas
                foreach ($kelasIds as $kelasId) {
                    GuruKelas::firstOrCreate([
                        'guru_mata_pelajaran_id' => $guruMapel->id,
                        'kelas_id' => $kelasId,
                    ]);
                }
            }
        });

        return redirect()->route('penugasan.index')
            ->with('success', 'Penugasan berhasil ditambahkan');
    }

    private function resolveKelasIds(array $validated): array
    {
        $scope = $validated['scope'];
        $tahunAjaranId = $validated['tahun_ajaran_id'];

        return match ($scope) {
            'all' => Kelas::where('tahun_ajaran_id', $tahunAjaranId)->pluck('id')->toArray(),
            'tingkat' => Kelas::where('tahun_ajaran_id', $tahunAjaranId)
                ->whereIn('tingkat', $validated['tingkat'])
                ->pluck('id')->toArray(),
            'kelas' => $validated['kelas_ids'],
        };
    }

    // ... edit, update, destroy methods
}
```

#### `MapelWaliKelasController.php`
```php
<?php

namespace App\Http\Controllers;

use App\Models\MapelWaliKelas;
use App\Models\MataPelajaran;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MapelWaliKelasController extends Controller
{
    public function index()
    {
        $configs = MapelWaliKelas::with('mataPelajaran')->get();

        return Inertia::render('penugasan/konfigurasi-mapel-walas/index', [
            'configs' => $configs,
        ]);
    }

    public function create()
    {
        // Mata pelajaran yang belum ada konfigurasi
        $existingMapelIds = MapelWaliKelas::pluck('mata_pelajaran_id');
        $mataPelajarans = MataPelajaran::whereNotIn('id', $existingMapelIds)->get();

        return Inertia::render('penugasan/konfigurasi-mapel-walas/create', [
            'mataPelajarans' => $mataPelajarans,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'mata_pelajaran_id' => 'required|exists:mata_pelajarans,id|unique:mapel_wali_kelas',
            'tingkat_allowed' => 'required|array|min:1',
            'tingkat_allowed.*' => 'integer|between:1,6',
            'is_active' => 'boolean',
        ]);

        MapelWaliKelas::create($validated);

        return redirect()->route('penugasan.konfigurasi-mapel-walas.index')
            ->with('success', 'Konfigurasi berhasil ditambahkan');
    }

    // ... edit, update, toggleActive methods
}
```

---

### Routes

#### `routes/penugasan.php`
```php
<?php

use App\Http\Controllers\MapelWaliKelasController;
use App\Http\Controllers\PenugasanController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    // Penugasan Mengajar
    Route::resource('penugasan', PenugasanController::class);
    
    // Konfigurasi Mapel Wali Kelas (sub-menu)
    Route::prefix('penugasan')->group(function () {
        Route::resource('konfigurasi-mapel-walas', MapelWaliKelasController::class);
        Route::post('konfigurasi-mapel-walas/{mapelWaliKelas}/toggle-active', [MapelWaliKelasController::class, 'toggleActive'])
            ->name('penugasan.konfigurasi-mapel-walas.toggle-active');
    });
});
```

---

## ⚠️ Catatan Penting

### 1. Validasi Duplikasi
- Sebelum create penugasan, cek dulu apakah sudah ada:
  ```php
  $exists = GuruMataPelajaran::where('guru_id', $guruId)
      ->where('mata_pelajaran_id', $mapelId)
      ->where('tahun_ajaran_id', $tahunAjaranId)
      ->where('tipe_penugasan', 'guru_bidang_studi')
      ->exists();
  ```

### 2. Cascade Delete
- Jika hapus guru → otomatis hapus semua penugasan (via FK constraint)
- Jika hapus kelas → otomatis hapus guru_kelas (via FK constraint)
- Jika unassign wali kelas → hapus hanya penugasan wali kelas, bukan guru bidang studi

### 3. Performance
- Index page bisa lambat jika banyak guru & kelas
- Gunakan eager loading: `with(['guruMataPelajaran.guruKelas.kelas'])`
- Pertimbangkan pagination atau infinite scroll

### 4. Edge Cases
- Guru jadi wali kelas di 2 kelas berbeda → Bisa, akan buat penugasan terpisah per kelas
- Guru mengajar mapel yang sama sebagai wali kelas DAN guru bidang studi → Bisa, dibedakan oleh `tipe_penugasan`
- Kelas pindah tahun ajaran → homeroom_teacher_id tetap, tapi penugasan tidak ikut (beda tahun ajaran)

---

## 📝 Testing Checklist

### Guru Bidang Studi
- [ ] Tambah penugasan scope "Semua Kelas"
- [ ] Tambah penugasan scope "Per Tingkat" (pilih 2-3 tingkat)
- [ ] Tambah penugasan scope "Per Kelas Spesifik"
- [ ] Tambah penugasan dengan multiple mata pelajaran
- [ ] Edit penugasan (tambah/kurangi kelas)
- [ ] Hapus penugasan
- [ ] Validasi duplikasi: Tidak bisa assign guru yang sama untuk mapel & tahun ajaran yang sama 2x

### Wali Kelas
- [ ] Centang "Jadikan Wali Kelas" di Kelas tingkat 1 → Check apakah IPAS tidak muncul
- [ ] Centang "Jadikan Wali Kelas" di Kelas tingkat 3 → Check apakah IPAS muncul
- [ ] Uncheck "Jadikan Wali Kelas" → Check apakah penugasan wali kelas terhapus
- [ ] Toggle konfigurasi mapel dari aktif ke non-aktif → Assign wali kelas baru, mapel non-aktif tidak muncul

### Konfigurasi Mapel Wali Kelas
- [ ] Tambah konfigurasi mata pelajaran baru
- [ ] Edit tingkat yang diperbolehkan (checkbox)
- [ ] Toggle aktif/non-aktif
- [ ] Hapus konfigurasi
- [ ] Validasi: Tidak bisa tambah mata pelajaran yang sudah ada konfigurasi

### UI/UX
- [ ] Card di index menampilkan jumlah kelas dengan benar
- [ ] Modal detail menampilkan breakdown per tingkat
- [ ] Filter di index berfungsi (guru, tahun ajaran)
- [ ] Preview di form create menampilkan estimasi yang akurat
- [ ] Form create responsif saat ganti scope (tingkat/kelas)

---

## 🚀 Next Steps

1. **Buat migrations** - 3 tabel sudah siap di folder `database/migrations`
2. **Buat models** - GuruMataPelajaran, GuruKelas, MapelWaliKelas
3. **Buat events & listeners** - WaliKelasAssigned/Removed + listeners
4. **Buat controllers** - PenugasanController, MapelWaliKelasController
5. **Buat routes** - Register di `routes/penugasan.php`
6. **Buat TypeScript types** - Interface di `resources/js/types/index.d.ts`
7. **Buat UI components** - Card, Modal, Form
8. **Update KelasController** - Tambah logic dispatch event saat update homeroom_teacher_id
9. **Testing** - Manual testing semua flow
10. **Seeder** (optional) - Buat data dummy untuk testing

---

**Dokumen ini berisi requirement lengkap untuk implementasi fitur Penugasan Mengajar Guru.**

Silakan reference dokumen ini saat development untuk memastikan semua requirement terpenuhi.
