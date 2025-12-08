# 📚 Dokumentasi Lengkap Fitur CRUD Siswa

**Project:** SINFOMIK - Sistem Informasi Manajemen Akademik  
**Fitur:** CRUD Data Siswa  
**Tanggal:** 6-7 Desember 2025  
**Stack:** Laravel 11 + React 19 + TypeScript + Inertia.js + Tailwind CSS + shadcn/ui

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Database Schema](#database-schema)
3. [Backend Implementation](#backend-implementation)
4. [Frontend Implementation](#frontend-implementation)
5. [Routing & Navigation](#routing--navigation)
6. [UI Components](#ui-components)
7. [Code Examples](#code-examples)
8. [Testing Checklist](#testing-checklist)

---

## 🎯 Overview

### Fitur yang Diimplementasikan:
- ✅ **Create** - Form tambah siswa baru dengan validasi
- ✅ **Read** - List siswa dengan pagination & detail siswa
- ✅ **Update** - Form edit data siswa existing
- ✅ **Delete** - Hapus siswa dengan modal konfirmasi
- ✅ **Search** - Pagination untuk navigasi data
- ✅ **Validation** - Form validation di frontend & backend
- ✅ **Type Safety** - TypeScript interfaces & Wayfinder routes

### Tech Stack Detail:
```
Backend:
├── Laravel 11.x
├── PHP 8.2+
├── MySQL
└── Inertia.js Server Adapter

Frontend:
├── React 19
├── TypeScript 5.x
├── Inertia.js Client
├── Tailwind CSS 3.x
├── shadcn/ui Components
└── Lucide React Icons
```

---

## 🗄️ Database Schema

### Migration: `2025_12_06_121715_create_siswas_table.php`

```php
Schema::create('siswas', function (Blueprint $table) {
    $table->id();
    
    // Data Identitas
    $table->string('nama_lengkap');
    $table->string('nama_panggilan')->nullable();            
    $table->string('nis')->nullable()->unique(); 
    $table->string('nisn', 15)->nullable()->unique(); 
    
    // Data Akademik
    $table->year('tahun_masuk');
    $table->enum('status', ['Aktif', 'Non Aktif'])->default('Aktif');
    
    // Data Pribadi
    $table->enum('gender', ['Laki-laki', 'Perempuan']);
    $table->date('tanggal_lahir')->nullable();
    $table->string('tempat_lahir')->nullable();
    $table->string('agama')->nullable(); 

    // Kontak
    $table->string('alamat')->nullable();
    $table->string('nomor_telepon', 15)->nullable();
    
    // Data Orang Tua/Wali
    $table->string('nama_ayah')->nullable();
    $table->string('nama_ibu')->nullable();
    $table->string('nomor_telepon_wali', 15)->nullable(); 

    $table->timestamps();
});
```

### Indexes:
- **Primary Key:** `id`
- **Unique:** `nis`, `nisn`
- **Indexed:** Auto-indexed pada unique columns

### Sample Data:
```sql
INSERT INTO siswas (
    nama_lengkap, nis, nisn, tahun_masuk, status, gender,
    tanggal_lahir, tempat_lahir, agama, alamat, nomor_telepon
) VALUES (
    'Ahmad Fauzi', '2024001', '1234567890', 2024, 'Aktif', 'Laki-laki',
    '2008-05-15', 'Jakarta', 'Islam', 'Jl. Merdeka No. 123', '081234567890'
);
```

---

## 🔧 Backend Implementation

### 1. Model: `app/Models/Siswa.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Siswa extends Model
{
    use HasFactory;
    
    protected $table = 'siswas';
    
    protected $fillable = [
        'nama_lengkap',
        'nama_panggilan',
        'nis',
        'nisn',
        'tahun_masuk',
        'status',
        'gender',
        'tanggal_lahir',
        'tempat_lahir',
        'agama',
        'alamat',
        'nomor_telepon',
        'nama_ayah',
        'nama_ibu',
        'nomor_telepon_wali',
    ];
    
    public $timestamps = true;
    
    /**
     * Siswa memiliki banyak Nilai.
     */
    public function nilais(): HasMany
    {
        return $this->hasMany(Nilai::class, 'siswa_id');
    }

    /**
     * Siswa terdaftar di banyak Kelas (Historis).
     */
    public function kelas(): BelongsToMany
    {
        return $this->belongsToMany(Kelas::class, 'kelas_siswa')
            ->withPivot(['start_date', 'end_date'])
            ->withTimestamps(); 
    }
}
```

**Key Points:**
- `$fillable` untuk mass assignment protection
- `$timestamps = true` untuk auto-manage created_at/updated_at
- Relasi ke Nilai (hasMany) dan Kelas (belongsToMany)

---

### 2. Controller: `app/Http/Controllers/SiswaController.php`

```php
<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSiswaRequest;
use App\Http\Requests\UpdateSiswaRequest;
use App\Models\Siswa;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SiswaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $siswas = Siswa::latest()->paginate(10);

        return Inertia::render('Siswa/Index', [
            'siswas' => $siswas,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Siswa/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSiswaRequest $request): RedirectResponse
    {
        Siswa::create($request->validated());

        return redirect()->route('siswa.index')
            ->with('success', 'Data siswa berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Siswa $siswa): Response
    {
        return Inertia::render('Siswa/Show', [
            'siswa' => $siswa,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Siswa $siswa): Response
    {
        return Inertia::render('Siswa/Edit', [
            'siswa' => $siswa,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSiswaRequest $request, Siswa $siswa): RedirectResponse
    {
        $siswa->update($request->validated());

        return redirect()->route('siswa.index')
            ->with('success', 'Data siswa berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Siswa $siswa): RedirectResponse
    {
        $siswa->delete();

        return redirect()->route('siswa.index')
            ->with('success', 'Data siswa berhasil dihapus.');
    }
}
```

**Key Features:**
- Route Model Binding (automatic `Siswa` injection)
- Inertia responses untuk semua views
- Flash messages untuk user feedback
- Type hints untuk return types

---

### 3. Request Validation: `app/Http/Requests/StoreSiswaRequest.php`

```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSiswaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nama_lengkap' => ['required', 'string', 'max:255'],
            'nama_panggilan' => ['nullable', 'string', 'max:255'],
            'nis' => ['nullable', 'string', 'unique:siswas,nis', 'max:255'],
            'nisn' => ['nullable', 'string', 'unique:siswas,nisn', 'max:15'],
            'tahun_masuk' => ['required', 'integer', 'digits:4'],
            'status' => ['required', 'in:Aktif,Non Aktif'],
            'gender' => ['required', 'in:Laki-laki,Perempuan'],
            'tanggal_lahir' => ['nullable', 'date'],
            'tempat_lahir' => ['nullable', 'string', 'max:255'],
            'agama' => ['nullable', 'string', 'max:255'],
            'alamat' => ['nullable', 'string'],
            'nomor_telepon' => ['nullable', 'string', 'max:15'],
            'nama_ayah' => ['nullable', 'string', 'max:255'],
            'nama_ibu' => ['nullable', 'string', 'max:255'],
            'nomor_telepon_wali' => ['nullable', 'string', 'max:15'],
        ];
    }

    public function attributes(): array
    {
        return [
            'nama_lengkap' => 'nama lengkap',
            'nama_panggilan' => 'nama panggilan',
            'nis' => 'NIS',
            'nisn' => 'NISN',
            'tahun_masuk' => 'tahun masuk',
            'status' => 'status',
            'gender' => 'jenis kelamin',
            'tanggal_lahir' => 'tanggal lahir',
            'tempat_lahir' => 'tempat lahir',
            'agama' => 'agama',
            'alamat' => 'alamat',
            'nomor_telepon' => 'nomor telepon',
            'nama_ayah' => 'nama ayah',
            'nama_ibu' => 'nama ibu',
            'nomor_telepon_wali' => 'nomor telepon wali',
        ];
    }
}
```

### `app/Http/Requests/UpdateSiswaRequest.php`

```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSiswaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nama_lengkap' => ['required', 'string', 'max:255'],
            'nama_panggilan' => ['nullable', 'string', 'max:255'],
            'nis' => ['nullable', 'string', Rule::unique('siswas', 'nis')->ignore($this->siswa), 'max:255'],
            'nisn' => ['nullable', 'string', Rule::unique('siswas', 'nisn')->ignore($this->siswa), 'max:15'],
            'tahun_masuk' => ['required', 'integer', 'digits:4'],
            'status' => ['required', 'in:Aktif,Non Aktif'],
            'gender' => ['required', 'in:Laki-laki,Perempuan'],
            'tanggal_lahir' => ['nullable', 'date'],
            'tempat_lahir' => ['nullable', 'string', 'max:255'],
            'agama' => ['nullable', 'string', 'max:255'],
            'alamat' => ['nullable', 'string'],
            'nomor_telepon' => ['nullable', 'string', 'max:15'],
            'nama_ayah' => ['nullable', 'string', 'max:255'],
            'nama_ibu' => ['nullable', 'string', 'max:255'],
            'nomor_telepon_wali' => ['nullable', 'string', 'max:15'],
        ];
    }

    public function attributes(): array
    {
        return [
            'nama_lengkap' => 'nama lengkap',
            'nama_panggilan' => 'nama panggilan',
            'nis' => 'NIS',
            'nisn' => 'NISN',
            'tahun_masuk' => 'tahun masuk',
            'status' => 'status',
            'gender' => 'jenis kelamin',
            'tanggal_lahir' => 'tanggal lahir',
            'tempat_lahir' => 'tempat lahir',
            'agama' => 'agama',
            'alamat' => 'alamat',
            'nomor_telepon' => 'nomor telepon',
            'nama_ayah' => 'nama ayah',
            'nama_ibu' => 'nama ibu',
            'nomor_telepon_wali' => 'nomor telepon wali',
        ];
    }
}
```

**Key Difference:**
- `UpdateSiswaRequest` menggunakan `Rule::unique()->ignore()` untuk mengabaikan record yang sedang di-edit

---

### 4. Routes: `routes/web.php`

```php
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Siswa Routes
    Route::resource('siswa', \App\Http\Controllers\SiswaController::class)->names([
        'index' => 'siswa.index',
        'create' => 'siswa.create',
        'store' => 'siswa.store',
        'show' => 'siswa.show',
        'edit' => 'siswa.edit',
        'update' => 'siswa.update',
        'destroy' => 'siswa.destroy',
    ]);
});
```

**Generated Routes:**
```
GET    /siswa              -> siswa.index    -> index()
GET    /siswa/create       -> siswa.create   -> create()
POST   /siswa              -> siswa.store    -> store()
GET    /siswa/{siswa}      -> siswa.show     -> show()
GET    /siswa/{siswa}/edit -> siswa.edit     -> edit()
PUT    /siswa/{siswa}      -> siswa.update   -> update()
DELETE /siswa/{siswa}      -> siswa.destroy  -> destroy()
```

---

## 🎨 Frontend Implementation

### 1. TypeScript Types: `resources/js/types/index.d.ts`

```typescript
export interface Siswa {
    id: number;
    nama_lengkap: string;
    nama_panggilan?: string;
    nis?: string;
    nisn?: string;
    tahun_masuk: number;
    status: 'Aktif' | 'Non Aktif';
    gender: 'Laki-laki' | 'Perempuan';
    tanggal_lahir?: string;
    tempat_lahir?: string;
    agama?: string;
    alamat?: string;
    nomor_telepon?: string;
    nama_ayah?: string;
    nama_ibu?: string;
    nomor_telepon_wali?: string;
    created_at: string;
    updated_at: string;
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}
```

---

### 2. Wayfinder Routes: `resources/js/routes/index.ts`

```typescript
/**
 * Siswa Routes
 * @see routes/web.php
 */
const siswaIndex = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: siswaIndex.url(options),
    method: 'get',
})

siswaIndex.definition = {
    methods: ["get","head"],
    url: '/siswa',
} satisfies RouteDefinition<["get","head"]>

siswaIndex.url = (options?: RouteQueryOptions) => {
    return siswaIndex.definition.url + queryParams(options)
}

const siswaCreate = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: siswaCreate.url(options),
    method: 'get',
})

siswaCreate.definition = {
    methods: ["get","head"],
    url: '/siswa/create',
} satisfies RouteDefinition<["get","head"]>

siswaCreate.url = (options?: RouteQueryOptions) => {
    return siswaCreate.definition.url + queryParams(options)
}

const siswaShow = (params: { siswa: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: siswaShow.url(params, options),
    method: 'get',
})

siswaShow.definition = {
    methods: ["get","head"],
    url: '/siswa/{siswa}',
} satisfies RouteDefinition<["get","head"]>

siswaShow.url = (params: { siswa: string | number }, options?: RouteQueryOptions) => {
    return siswaShow.definition.url.replace('{siswa}', String(params.siswa)) + queryParams(options)
}

const siswaEdit = (params: { siswa: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: siswaEdit.url(params, options),
    method: 'get',
})

siswaEdit.definition = {
    methods: ["get","head"],
    url: '/siswa/{siswa}/edit',
} satisfies RouteDefinition<["get","head"]>

siswaEdit.url = (params: { siswa: string | number }, options?: RouteQueryOptions) => {
    return siswaEdit.definition.url.replace('{siswa}', String(params.siswa)) + queryParams(options)
}

// Export siswa sebagai callable function dengan property
export const siswa = Object.assign(siswaIndex, {
    index: siswaIndex,
    create: siswaCreate,
    show: siswaShow,
    edit: siswaEdit,
});
```

**Usage:**
```typescript
// Shorthand untuk index
siswa()  // sama dengan siswa.index()

// Explicit methods
siswa.index()
siswa.create()
siswa.show({ siswa: 1 })
siswa.edit({ siswa: 1 })
```

---

### 3. Sidebar Navigation: `resources/js/components/app-sidebar.tsx`

```tsx
import { dashboard, siswa } from '@/routes';
import { GraduationCap, LayoutGrid } from 'lucide-react';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Data Siswa',
        href: siswa(),
        icon: GraduationCap,
    },
];
```

---

### 4. Page: Index (List) - `resources/js/pages/Siswa/index.tsx`

**File lengkap ada di project, berikut struktur utama:**

```tsx
export default function Index({ siswas }: Props) {
    const [deleteModal, setDeleteModal] = useState<{
        open: boolean;
        siswa: Siswa | null;
    }>({ open: false, siswa: null });

    const handleDelete = () => {
        if (deleteModal.siswa) {
            router.delete(siswaRoutes.show({ siswa: deleteModal.siswa.id }).url, {
                preserveScroll: true,
                onSuccess: () => setDeleteModal({ open: false, siswa: null }),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Siswa" />
            
            {/* Header Section */}
            <div className="flex items-center justify-between">
                <div>
                    <h1>Data Siswa</h1>
                    <p>Kelola data siswa sekolah</p>
                </div>
                <Link href={siswaRoutes.create()}>
                    <Button>Tambah Siswa</Button>
                </Link>
            </div>

            {/* Table Section */}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>NIS</TableHead>
                        <TableHead>Nama Lengkap</TableHead>
                        <TableHead>Jenis Kelamin</TableHead>
                        <TableHead>Tahun Masuk</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {siswas.data.map((siswa, index) => (
                        <TableRow key={siswa.id}>
                            {/* Table cells */}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Pagination */}
            {siswas.last_page > 1 && (
                <div className="flex items-center justify-between">
                    {/* Pagination info & links */}
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteModal.open} onOpenChange={...}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader className="text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                            <Trash2 className="h-6 w-6 text-destructive" />
                        </div>
                        <DialogTitle className="text-center text-xl">
                            Konfirmasi Hapus Data
                        </DialogTitle>
                        <DialogDescription className="text-center space-y-3 pt-3">
                            <p>Apakah Anda yakin ingin menghapus data siswa:</p>
                            <p className="text-base font-semibold text-foreground">
                                {deleteModal.siswa?.nama_lengkap}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Tindakan ini tidak dapat dibatalkan.
                            </p>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={...}>Batal</Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Ya, Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
```

**Key Features:**
- Pagination dengan info & links
- Action buttons (View, Edit, Delete)
- Status badge dengan color coding
- Delete confirmation modal dengan icon & centered layout
- State management untuk modal

---

### 5. Page: Create - `resources/js/pages/Siswa/create.tsx`

**Struktur utama:**

```tsx
export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        nama_lengkap: '',
        nama_panggilan: '',
        nis: '',
        nisn: '',
        tahun_masuk: new Date().getFullYear(),
        status: 'Aktif' as 'Aktif' | 'Non Aktif',
        gender: '' as 'Laki-laki' | 'Perempuan' | '',
        tanggal_lahir: '',
        tempat_lahir: '',
        agama: '',
        alamat: '',
        nomor_telepon: '',
        nama_ayah: '',
        nama_ibu: '',
        nomor_telepon_wali: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(siswaRoutes.index().url);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Siswa" />
            
            <form onSubmit={handleSubmit}>
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Card 1: Data Pribadi */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Data Pribadi</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Form fields */}
                        </CardContent>
                    </Card>

                    {/* Card 2: Data Sekolah & Kontak */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Data Sekolah & Kontak</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Form fields */}
                        </CardContent>
                    </Card>
                </div>

                <div className="mt-6 flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={...}>
                        Batal
                    </Button>
                    <Button type="submit" disabled={processing}>
                        {processing ? 'Menyimpan...' : 'Simpan'}
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}
```

**Key Features:**
- 2 kolom layout dengan Card components
- Inertia `useForm` hook untuk form state
- Real-time validation error display
- Processing state untuk button disable
- Select dropdown untuk enum fields

---

### 6. Page: Edit - `resources/js/pages/Siswa/edit.tsx`

**Hampir identik dengan Create, perbedaan:**

```tsx
export default function Edit({ siswa }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        nama_lengkap: siswa.nama_lengkap || '',
        nama_panggilan: siswa.nama_panggilan || '',
        // ... pre-filled from siswa prop
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(siswaRoutes.show({ siswa: siswa.id }).url);
    };

    // Rest sama dengan Create
}
```

**Key Differences:**
- Props menerima `siswa` object
- Form data pre-filled dari siswa
- Menggunakan `put()` bukan `post()`
- URL includes siswa ID

---

### 7. Page: Show (Detail) - `resources/js/pages/Siswa/show.tsx`

**Struktur utama:**

```tsx
export default function Show({ siswa }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail ${siswa.nama_lengkap}`} />
            
            <div className="flex items-center justify-between">
                <div>
                    <h1>Detail Data Siswa</h1>
                    <p>Informasi lengkap data siswa</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={...}>
                        Kembali
                    </Button>
                    <Link href={siswaRoutes.edit({ siswa: siswa.id })}>
                        <Button>Edit</Button>
                    </Link>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Card: Data Pribadi */}
                <Card>
                    <CardHeader>
                        <CardTitle>Data Pribadi</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-1 text-sm font-medium text-muted-foreground">
                                Nama Lengkap
                            </div>
                            <div className="col-span-2 text-sm">
                                {siswa.nama_lengkap}
                            </div>
                        </div>
                        {/* More fields */}
                    </CardContent>
                </Card>

                {/* Card: Data Sekolah */}
                <Card>
                    {/* Similar structure */}
                </Card>

                {/* Card: Kontak */}
                <Card>
                    {/* With icons */}
                </Card>

                {/* Card: Data Orang Tua/Wali */}
                <Card>
                    {/* Similar structure */}
                </Card>
            </div>

            {/* Card: Informasi Sistem */}
            <Card>
                <CardContent className="grid gap-4 md:grid-cols-2">
                    {/* Timestamp info */}
                </CardContent>
            </Card>
        </AppLayout>
    );
}
```

**Key Features:**
- Read-only display
- 4 Cards untuk group data
- Grid layout untuk label-value
- Icons untuk kontak info (Phone, MapPin, User)
- Formatted dates dengan `toLocaleDateString()`
- Status badge
- Action buttons (Back, Edit)

---

## 🧩 UI Components

### Components yang Dibuat/Digunakan:

```
components/ui/
├── table.tsx           ✅ Custom created
├── textarea.tsx        ✅ Custom created
├── button.tsx          ✅ Existing
├── card.tsx            ✅ Existing
├── dialog.tsx          ✅ Existing
├── input.tsx           ✅ Existing
├── label.tsx           ✅ Existing
└── select.tsx          ✅ Existing
```

### Custom Components Created:

#### 1. Table Component (`components/ui/table.tsx`)

```tsx
export { 
    Table, 
    TableBody, 
    TableCaption, 
    TableCell, 
    TableFooter, 
    TableHead, 
    TableHeader, 
    TableRow 
};
```

**Features:**
- Responsive wrapper with overflow-auto
- Styled with Tailwind classes
- Border & hover effects
- Works with data tables

#### 2. Textarea Component (`components/ui/textarea.tsx`)

```tsx
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, ...props }, ref) => {
        return (
            <textarea
                className={cn(
                    'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                    className,
                )}
                ref={ref}
                {...props}
            />
        );
    },
);
```

**Features:**
- Min height 80px
- Focus ring styling
- Disabled state styling
- Consistent with Input component

---

## 📱 Responsive Design

### Breakpoints Used:
```css
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
```

### Responsive Patterns:

**Grid Layout (Create/Edit Forms):**
```tsx
<div className="grid gap-6 md:grid-cols-2">
    {/* Single column on mobile, 2 columns on tablet+ */}
</div>
```

**Dialog Width:**
```tsx
<DialogContent className="sm:max-w-md">
    {/* Full width on mobile, max-width on tablet+ */}
</DialogContent>
```

**Button Layout:**
```tsx
<DialogFooter className="gap-2 sm:gap-0">
    {/* Vertical stack on mobile, horizontal on tablet+ */}
</DialogFooter>
```

**Table:**
```tsx
<div className="relative w-full overflow-auto">
    {/* Horizontal scroll on small screens */}
</div>
```

---

## 🎨 Design System

### Color Scheme:

**Status Colors:**
```tsx
// Aktif - Green
bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200

// Non Aktif - Gray
bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200

// Destructive - Red
bg-destructive hover:bg-destructive/90
text-destructive
```

### Typography:

```tsx
// Page Title
<h1 className="text-2xl font-bold">

// Page Description
<p className="text-sm text-muted-foreground">

// Card Title
<CardTitle>  // Default styling from component

// Form Label
<Label htmlFor="field">

// Table Header
<TableHead>  // Default styling

// Muted Text
className="text-muted-foreground"
```

### Spacing:

```tsx
// Section spacing
className="space-y-4"     // 1rem (16px) vertical
className="space-y-3"     // 0.75rem (12px) vertical
className="gap-4"         // 1rem (16px) gap
className="gap-6"         // 1.5rem (24px) gap

// Padding
className="p-4"           // 1rem all sides
className="px-3 py-2"     // Custom padding

// Margin
className="mb-4"          // 1rem bottom
className="mt-6"          // 1.5rem top
```

---

## 🔍 Code Examples

### Example 1: Form Field dengan Validation Error

```tsx
<div className="space-y-2">
    <Label htmlFor="nama_lengkap">
        Nama Lengkap <span className="text-destructive">*</span>
    </Label>
    <Input
        id="nama_lengkap"
        value={data.nama_lengkap}
        onChange={(e) => setData('nama_lengkap', e.target.value)}
        required
    />
    {errors.nama_lengkap && (
        <p className="text-sm text-destructive">
            {errors.nama_lengkap}
        </p>
    )}
</div>
```

### Example 2: Select Field dengan Enum

```tsx
<div className="space-y-2">
    <Label htmlFor="status">
        Status <span className="text-destructive">*</span>
    </Label>
    <Select
        value={data.status}
        onValueChange={(value) => setData('status', value as 'Aktif' | 'Non Aktif')}
    >
        <SelectTrigger>
            <SelectValue placeholder="Pilih status" />
        </SelectTrigger>
        <SelectContent>
            <SelectItem value="Aktif">Aktif</SelectItem>
            <SelectItem value="Non Aktif">Non Aktif</SelectItem>
        </SelectContent>
    </Select>
    {errors.status && (
        <p className="text-sm text-destructive">{errors.status}</p>
    )}
</div>
```

### Example 3: Status Badge

```tsx
<span
    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
        siswa.status === 'Aktif'
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
    }`}
>
    {siswa.status}
</span>
```

### Example 4: Pagination Info

```tsx
<p className="text-sm text-muted-foreground">
    Menampilkan {(siswas.current_page - 1) * siswas.per_page + 1} -{' '}
    {Math.min(siswas.current_page * siswas.per_page, siswas.total)}{' '}
    dari {siswas.total} siswa
</p>
```

### Example 5: Delete dengan Inertia Router

```tsx
const handleDelete = () => {
    if (deleteModal.siswa) {
        router.delete(siswaRoutes.show({ siswa: deleteModal.siswa.id }).url, {
            preserveScroll: true,
            onSuccess: () => setDeleteModal({ open: false, siswa: null }),
        });
    }
};
```

### Example 6: Format Date Display

```tsx
{siswa.tanggal_lahir && (
    <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1 text-sm font-medium text-muted-foreground">
            Tanggal Lahir
        </div>
        <div className="col-span-2 text-sm">
            {new Date(siswa.tanggal_lahir).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            })}
        </div>
    </div>
)}
```

---

## ✅ Testing Checklist

### Backend Testing:

- [ ] **Model**
  - [ ] Fillable fields berfungsi
  - [ ] Timestamps auto-update
  - [ ] Relasi ke model lain berfungsi

- [ ] **Validation**
  - [ ] Required fields validated
  - [ ] Unique fields (NIS, NISN) validated
  - [ ] Format validations (email, phone)
  - [ ] Update validation (unique ignore current)

- [ ] **Controller**
  - [ ] Index: returns paginated data
  - [ ] Create: renders form
  - [ ] Store: saves data & redirects
  - [ ] Show: displays single record
  - [ ] Edit: renders form with data
  - [ ] Update: updates data & redirects
  - [ ] Destroy: deletes data & redirects

### Frontend Testing:

- [ ] **Index Page**
  - [ ] Table displays data correctly
  - [ ] Pagination works
  - [ ] Action buttons navigate correctly
  - [ ] Delete modal opens & closes
  - [ ] Delete confirmation works
  - [ ] Status badge shows correct color

- [ ] **Create Page**
  - [ ] Form loads correctly
  - [ ] All fields editable
  - [ ] Validation errors display
  - [ ] Submit creates record
  - [ ] Cancel returns to index

- [ ] **Edit Page**
  - [ ] Form pre-filled with data
  - [ ] All fields editable
  - [ ] Validation errors display
  - [ ] Submit updates record
  - [ ] Cancel returns to index

- [ ] **Show Page**
  - [ ] All data displays correctly
  - [ ] Dates formatted properly
  - [ ] Edit button navigates correctly
  - [ ] Back button works

### UI/UX Testing:

- [ ] **Responsive**
  - [ ] Works on mobile (320px+)
  - [ ] Works on tablet (768px+)
  - [ ] Works on desktop (1024px+)

- [ ] **Accessibility**
  - [ ] Form labels associated with inputs
  - [ ] Required fields marked
  - [ ] Error messages visible
  - [ ] Focus states visible
  - [ ] Keyboard navigation works

- [ ] **Dark Mode**
  - [ ] All components support dark mode
  - [ ] Colors readable in dark mode
  - [ ] Icons visible in dark mode

---

## 📊 Performance Considerations

### Backend:
- **Pagination**: 10 records per page untuk menghindari loading berat
- **Eager Loading**: Bisa ditambahkan jika ada relasi yang perlu di-load
- **Indexing**: Unique indexes pada NIS & NISN untuk query cepat

### Frontend:
- **Code Splitting**: Automatic dengan Vite & React lazy loading
- **Memoization**: Bisa ditambahkan dengan `useMemo` untuk computed values
- **Debouncing**: Bisa ditambahkan untuk search/filter

---

## 🔒 Security Considerations

### Implemented:
- ✅ CSRF Protection (automatic dengan Laravel)
- ✅ Mass Assignment Protection (`$fillable`)
- ✅ Form Validation (backend & frontend)
- ✅ Route Authentication (`auth` middleware)
- ✅ SQL Injection Prevention (Eloquent ORM)
- ✅ XSS Prevention (React auto-escapes)

### Recommendations:
- [ ] Add role-based access control
- [ ] Add activity logging
- [ ] Add soft deletes untuk data penting
- [ ] Add data encryption untuk sensitive fields

---

## 🚀 Deployment Checklist

### Before Deploy:
- [ ] Run migrations: `php artisan migrate`
- [ ] Build assets: `npm run build`
- [ ] Clear caches: `php artisan optimize:clear`
- [ ] Set APP_ENV=production
- [ ] Set APP_DEBUG=false
- [ ] Configure proper database credentials

### After Deploy:
- [ ] Test all CRUD operations
- [ ] Check error logging
- [ ] Monitor performance
- [ ] Test on different devices

---

## 📝 Notes & Lessons Learned

### Best Practices Applied:
1. **Separation of Concerns**: Controller hanya handle HTTP, logic di Service/Model
2. **Type Safety**: TypeScript interfaces untuk semua data
3. **Reusable Components**: UI components bisa digunakan untuk fitur lain
4. **Consistent Naming**: Singular model, plural table, consistent variable names
5. **Error Handling**: Validation di backend & frontend
6. **User Feedback**: Loading states, success/error messages, confirmations

### Common Pitfalls Avoided:
1. ❌ Hardcoded routes → ✅ Wayfinder routes
2. ❌ Inline validation → ✅ Request classes
3. ❌ Direct array access → ✅ TypeScript interfaces
4. ❌ Inconsistent styling → ✅ Design system
5. ❌ No confirmation for delete → ✅ Modal confirmation

---

## 🔗 Related Files Reference

### Backend Files:
```
app/
├── Http/
│   ├── Controllers/
│   │   └── SiswaController.php              ✅ Main controller
│   └── Requests/
│       ├── StoreSiswaRequest.php            ✅ Create validation
│       └── UpdateSiswaRequest.php           ✅ Update validation
├── Models/
│   └── Siswa.php                            ✅ Eloquent model
routes/
└── web.php                                  ✅ Route definitions
database/
└── migrations/
    └── 2025_12_06_121715_create_siswas_table.php  ✅ Database schema
```

### Frontend Files:
```
resources/js/
├── components/
│   ├── app-sidebar.tsx                      ✅ Navigation
│   └── ui/
│       ├── table.tsx                        ✅ Custom component
│       ├── textarea.tsx                     ✅ Custom component
│       └── dialog.tsx                       ✅ Used for modal
├── pages/
│   └── Siswa/
│       ├── index.tsx                        ✅ List page
│       ├── create.tsx                       ✅ Create form
│       ├── edit.tsx                         ✅ Edit form
│       └── show.tsx                         ✅ Detail page
├── routes/
│   └── index.ts                             ✅ Wayfinder routes
└── types/
    └── index.d.ts                           ✅ TypeScript types
```

---

## 🎓 Learning Resources

### Laravel:
- [Laravel Documentation](https://laravel.com/docs)
- [Eloquent ORM](https://laravel.com/docs/eloquent)
- [Validation](https://laravel.com/docs/validation)

### Inertia.js:
- [Inertia Documentation](https://inertiajs.com/)
- [Forms & Validation](https://inertiajs.com/forms)
- [Manual Visits](https://inertiajs.com/manual-visits)

### React:
- [React Documentation](https://react.dev/)
- [TypeScript with React](https://react.dev/learn/typescript)
- [Hooks Reference](https://react.dev/reference/react)

### UI Libraries:
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/)

---

**Dokumentasi ini dibuat sebagai referensi lengkap untuk fitur CRUD Siswa dan template untuk fitur-fitur selanjutnya.**

**Last Updated:** 7 Desember 2025  
**Version:** 1.0  
**Author:** Generated with GitHub Copilot
