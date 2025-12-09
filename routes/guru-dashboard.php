<?php

use App\Http\Controllers\Guru\GuruDashboardController;
use App\Http\Controllers\Guru\GuruKelasController;
use App\Http\Controllers\Guru\GuruKurikulumController;
use App\Http\Controllers\Guru\GuruNilaiController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:guru'])->name('guru.')->group(function () {
    // Dashboard
    Route::get('my-dashboard', [GuruDashboardController::class, 'index'])->name('dashboard');
    
    // Info Kelas & Siswa
    Route::get('my-kelas', [GuruKelasController::class, 'index'])->name('kelas.index');
    Route::get('my-kelas/{kelas}', [GuruKelasController::class, 'show'])->name('kelas.show');
    Route::get('my-kelas/{kelas}/siswa', [GuruKelasController::class, 'siswa'])->name('kelas.siswa');
    
    // Kurikulum
    Route::get('my-kurikulum', [GuruKurikulumController::class, 'index'])->name('kurikulum.index');
    Route::get('my-kurikulum/{mataPelajaran}', [GuruKurikulumController::class, 'show'])->name('kurikulum.show');
    
    // Penilaian
    Route::get('my-nilai', [GuruNilaiController::class, 'list'])->name('nilai.list');
    Route::get('my-nilai/{penugasan}', [GuruNilaiController::class, 'index'])->name('nilai.index');
    Route::post('my-nilai/{penugasan}/store', [GuruNilaiController::class, 'store'])->name('nilai.store');
    Route::put('my-nilai/{nilai}', [GuruNilaiController::class, 'update'])->name('nilai.update');
});
