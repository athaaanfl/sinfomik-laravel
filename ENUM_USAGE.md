# UserRole Enum Implementation

## 📁 File yang Diubah

### 1. **Enum Class** (Baru)
- `app/Enums/UserRole.php`

### 2. **Helper Class** (Baru)
- `app/Helpers/RoleHelper.php`

### 3. **Model**
- `app/Models/User.php`

### 4. **Controllers**
- `app/Http/Controllers/GuruController.php`

### 5. **Middleware**
- `app/Http/Middleware/RoleMiddleware.php`
- `app/Http/Middleware/HandleInertiaRequests.php`

### 6. **Database Seeder**
- `database/seeders/DatabaseSeeder.php`
- `database/seeders/GuruSeeder.php`

### 7. **Factory**
- `database/factories/UserFactory.php`

---

## 📖 Cara Penggunaan

### **1. Membuat User dengan Role**

```php
use App\Enums\UserRole;
use App\Models\User;

// Cara 1: Langsung dengan enum
$admin = User::create([
    'name' => 'Admin User',
    'email' => 'admin@example.com',
    'password' => bcrypt('password'),
    'role' => UserRole::ADMIN,
]);

// Cara 2: Dengan string (otomatis di-cast ke enum)
$guru = User::create([
    'name' => 'Guru User',
    'email' => 'guru@example.com',
    'password' => bcrypt('password'),
    'role' => 'guru', // akan di-cast ke UserRole::GURU
]);
```

### **2. Mengecek Role User**

```php
$user = User::find(1);

// Cara 1: Helper methods (Recommended)
if ($user->isAdmin()) {
    // User adalah admin
}

if ($user->isGuru()) {
    // User adalah guru
}

// Cara 2: Direct comparison
if ($user->role === UserRole::ADMIN) {
    // User adalah admin
}

// Cara 3: String comparison (masih berfungsi karena casting)
if ($user->role->value === 'admin') {
    // User adalah admin
}
```

### **3. Menggunakan di Controller**

```php
use App\Enums\UserRole;

class SomeController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        if ($user->isAdmin()) {
            return view('admin.dashboard');
        }
        
        return view('guru.dashboard');
    }
}
```

### **4. Menggunakan di Blade/Inertia**

```php
// Controller
public function show()
{
    return Inertia::render('Dashboard', [
        'role' => auth()->user()->role->value, // 'admin' atau 'guru'
        'roleLabel' => auth()->user()->role->label(), // 'Administrator' atau 'Guru'
    ]);
}
```

### **5. Menggunakan di Factory**

```php
use App\Enums\UserRole;

// Random role
$user = User::factory()->create();

// Specific role dengan state
$admin = User::factory()->admin()->create();
$guru = User::factory()->guru()->create();

// Multiple users
$admins = User::factory()->admin()->count(5)->create();
$gurus = User::factory()->guru()->count(10)->create();
```

### **6. Menggunakan di Middleware**

```php
// Routes tetap sama
Route::middleware('role:admin')->group(function () {
    // Admin only routes
});

// Atau dengan enum
use App\Enums\UserRole;

Route::middleware('role:' . UserRole::ADMIN->value)->group(function () {
    // Admin only routes
});
```

### **7. Validasi Form**

```php
use App\Enums\UserRole;
use Illuminate\Validation\Rule;

$request->validate([
    'role' => ['required', Rule::enum(UserRole::class)],
]);
```

### **8. Query Database**

```php
use App\Enums\UserRole;

// Get all admins
$admins = User::where('role', UserRole::ADMIN)->get();

// Get all gurus
$gurus = User::where('role', UserRole::GURU)->get();

// Count by role
$adminCount = User::where('role', UserRole::ADMIN)->count();
```

### **9. Menggunakan RoleHelper**

```php
use App\Helpers\RoleHelper;

// Get all role options for forms/select
$roleOptions = RoleHelper::options();
// [
//     ['value' => 'admin', 'label' => 'Administrator'],
//     ['value' => 'guru', 'label' => 'Guru']
// ]

// Get all role values
$values = RoleHelper::values(); // ['admin', 'guru']

// Check if valid role
if (RoleHelper::isValid('admin')) {
    // valid
}

// Get enum from string
$role = RoleHelper::from('admin'); // UserRole::ADMIN
```

---

## 🎯 Keuntungan Menggunakan Enum

### ✅ **Type Safety**
```php
// ❌ SEBELUM: Rawan typo
$user->role = 'adimn'; // typo!

// ✅ SESUDAH: IDE akan error
$user->role = UserRole::ADIMN; // IDE error: constant tidak ada
```

### ✅ **Autocomplete**
IDE akan memberikan suggestions untuk `UserRole::ADMIN` dan `UserRole::GURU`

### ✅ **Refactoring Mudah**
Jika nama role berubah, tinggal ubah di satu tempat (enum class)

### ✅ **Dokumentasi Built-in**
```php
// Semua role yang tersedia
UserRole::cases(); // [UserRole::ADMIN, UserRole::GURU]

// Semua values
UserRole::values(); // ['admin', 'guru']

// Label untuk UI
UserRole::ADMIN->label(); // 'Administrator'
```

---

## 🔄 Backward Compatibility

Enum ini **100% kompatibel** dengan kode lama karena:

1. Database tetap menyimpan string `'admin'` dan `'guru'`
2. Laravel otomatis cast antara string ↔ enum
3. Kode lama yang pakai string masih berfungsi

```php
// ✅ Semua cara ini VALID dan SAMA
$user->role = UserRole::ADMIN;
$user->role = 'admin';

if ($user->role === UserRole::ADMIN) { }
if ($user->role->value === 'admin') { }
if ($user->isAdmin()) { }
```

---

## 📝 Method-method Enum

| Method | Return | Deskripsi |
|--------|--------|-----------|
| `UserRole::ADMIN` | `UserRole` | Enum case admin |
| `UserRole::GURU` | `UserRole` | Enum case guru |
| `->value` | `string` | Get string value ('admin' atau 'guru') |
| `->label()` | `string` | Get display label |
| `->isAdmin()` | `bool` | Check if admin |
| `->isGuru()` | `bool` | Check if guru |
| `::values()` | `array` | Get all values |
| `::cases()` | `array` | Get all enum cases |

---

## 🚀 Best Practices

1. **Gunakan enum di PHP code** (Controller, Model, Service)
2. **Kirim `.value` ke frontend** (React, Blade)
3. **Gunakan helper methods** (`isAdmin()`, `isGuru()`)
4. **Validasi dengan `Rule::enum()`**

---

## ⚠️ Catatan Penting

- Database migration **TIDAK PERLU DIUBAH**
- Data existing **TIDAK TERPENGARUH**
- Test existing **TETAP BERFUNGSI**
- Frontend **TETAP MENERIMA STRING**
