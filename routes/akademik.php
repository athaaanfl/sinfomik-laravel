<?php

use App\Http\Controllers\KelulusanSiswaController;
use App\Http\Controllers\NaikKelasController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    // Kelulusan Siswa
    Route::get('kelulusan-siswa', [KelulusanSiswaController::class, 'index'])->name('kelulusan-siswa.index');
    Route::post('kelulusan-siswa/preview', [KelulusanSiswaController::class, 'preview'])->name('kelulusan-siswa.preview.submit');
    Route::get('kelulusan-siswa/preview', [KelulusanSiswaController::class, 'showPreview'])->name('kelulusan-siswa.preview');
    Route::post('kelulusan-siswa/process', [KelulusanSiswaController::class, 'process'])->name('kelulusan-siswa.process');

    // Naik Kelas Massal
    Route::get('naik-kelas', [NaikKelasController::class, 'index'])->name('naik-kelas.index');
    Route::post('naik-kelas/preview', [NaikKelasController::class, 'preview'])->name('naik-kelas.preview.submit');
    Route::get('naik-kelas/preview', [NaikKelasController::class, 'showPreview'])->name('naik-kelas.preview');
    Route::post('naik-kelas/process', [NaikKelasController::class, 'process'])->name('naik-kelas.process');
});
