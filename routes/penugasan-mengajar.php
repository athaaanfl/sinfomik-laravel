<?php

use App\Http\Controllers\PenugasanMengajarController;
use App\Http\Controllers\MapelWaliKelasController;
use Illuminate\Support\Facades\Route;

// Penugasan Mengajar Routes
Route::middleware(['auth'])->group(function () {
    // Main penugasan mengajar
    Route::resource('penugasan-mengajar', PenugasanMengajarController::class)
        ->except(['show', 'edit', 'update']);
    
    // Helper route untuk get kelas by tahun ajaran
    Route::get('penugasan-mengajar/kelas-by-tahun-ajaran', [PenugasanMengajarController::class, 'getKelasByTahunAjaran'])
        ->name('penugasan-mengajar.kelas-by-tahun-ajaran');

    // Konfigurasi Mapel Wali Kelas (integrated dalam fitur penugasan mengajar)
    Route::prefix('penugasan-mengajar')->group(function () {
        Route::get('konfigurasi-mapel', [MapelWaliKelasController::class, 'index'])
            ->name('mapel-wali-kelas.index');
        Route::post('konfigurasi-mapel', [MapelWaliKelasController::class, 'store'])
            ->name('mapel-wali-kelas.store');
        Route::put('konfigurasi-mapel/{mapelWaliKela}', [MapelWaliKelasController::class, 'update'])
            ->name('mapel-wali-kelas.update');
        Route::delete('konfigurasi-mapel/{mapelWaliKela}', [MapelWaliKelasController::class, 'destroy'])
            ->name('mapel-wali-kelas.destroy');
        Route::patch('konfigurasi-mapel/{mapelWaliKela}/toggle', [MapelWaliKelasController::class, 'toggleActive'])
            ->name('mapel-wali-kelas.toggle');
        Route::post('konfigurasi-mapel/urutan', [MapelWaliKelasController::class, 'updateUrutan'])
            ->name('mapel-wali-kelas.urutan');
    });
});
