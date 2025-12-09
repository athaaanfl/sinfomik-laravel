<?php

use App\Http\Controllers\KelasController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    Route::resource('kelas', KelasController::class)->parameters(['kelas' => 'kelas']);
    
    // Generate kelas from kelas_master
    Route::post('kelas/generate-from-master', [KelasController::class, 'generateFromMaster'])->name('kelas.generate-from-master');
    
    // Kelas Students Management
    Route::get('kelas/{kelas}/students/add', [KelasController::class, 'addStudentsForm'])->name('kelas.students.add');
    Route::post('kelas/{kelas}/students/add', [KelasController::class, 'addStudents'])->name('kelas.students.store');
    Route::delete('kelas/{kelas}/students/{siswa}', [KelasController::class, 'removeStudent'])->name('kelas.students.remove');
});
