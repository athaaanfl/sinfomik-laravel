<?php

use App\Http\Controllers\MataPelajaranController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    Route::resource('mata-pelajaran', MataPelajaranController::class);
    
    // CP Fase Routes
    Route::post('mata-pelajaran/cp-fase', [MataPelajaranController::class, 'storeCpFase'])->name('mata-pelajaran.cp-fase.store');
    Route::put('mata-pelajaran/cp-fase/{id}', [MataPelajaranController::class, 'updateCpFase'])->name('mata-pelajaran.cp-fase.update');
    Route::delete('mata-pelajaran/cp-fase/{id}', [MataPelajaranController::class, 'destroyCpFase'])->name('mata-pelajaran.cp-fase.destroy');
    
    // Elemen Pembelajaran Routes
    Route::post('mata-pelajaran/elemen', [MataPelajaranController::class, 'storeElemen'])->name('mata-pelajaran.elemen.store');
    Route::put('mata-pelajaran/elemen/{id}', [MataPelajaranController::class, 'updateElemen'])->name('mata-pelajaran.elemen.update');
    Route::delete('mata-pelajaran/elemen/{id}', [MataPelajaranController::class, 'destroyElemen'])->name('mata-pelajaran.elemen.destroy');
    
    // CP Elemen Routes
    Route::post('mata-pelajaran/cp-elemen', [MataPelajaranController::class, 'storeCpElemen'])->name('mata-pelajaran.cp-elemen.store');
    Route::put('mata-pelajaran/cp-elemen/{id}', [MataPelajaranController::class, 'updateCpElemen'])->name('mata-pelajaran.cp-elemen.update');
    Route::delete('mata-pelajaran/cp-elemen/{id}', [MataPelajaranController::class, 'destroyCpElemen'])->name('mata-pelajaran.cp-elemen.destroy');
    
    // Tujuan Pembelajaran Routes
    Route::post('mata-pelajaran/tp', [MataPelajaranController::class, 'storeTp'])->name('mata-pelajaran.tp.store');
    Route::put('mata-pelajaran/tp/{id}', [MataPelajaranController::class, 'updateTp'])->name('mata-pelajaran.tp.update');
    Route::delete('mata-pelajaran/tp/{id}', [MataPelajaranController::class, 'destroyTp'])->name('mata-pelajaran.tp.destroy');
});
