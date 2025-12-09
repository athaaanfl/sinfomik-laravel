<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function (\Illuminate\Http\Request $request) {
        // Redirect based on role
        if ($request->user()->isGuru()) {
            return redirect()->route('guru.dashboard');
        }
        
        // Admin dashboard
        return app(\App\Http\Controllers\DashboardController::class)->index($request);
    })->name('dashboard');
});

// Load feature-specific routes
require __DIR__.'/settings.php';
require __DIR__.'/guru-dashboard.php';  // Load guru dashboard BEFORE guru resource
require __DIR__.'/siswa.php';
require __DIR__.'/guru.php';
require __DIR__.'/tahun-ajaran.php';
require __DIR__.'/mata-pelajaran.php';
require __DIR__.'/kelas.php';
require __DIR__.'/akademik.php';  // Kelulusan & Naik Kelas
require __DIR__.'/penugasan-mengajar.php';
