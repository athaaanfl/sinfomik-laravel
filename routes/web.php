<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');
});

// Load feature-specific routes
require __DIR__.'/settings.php';
require __DIR__.'/siswa.php';
require __DIR__.'/guru.php';
require __DIR__.'/tahun-ajaran.php';
require __DIR__.'/mata-pelajaran.php';
require __DIR__.'/kelas.php';
