<?php

use App\Http\Controllers\SiswaController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    Route::resource('siswa', SiswaController::class);
});
