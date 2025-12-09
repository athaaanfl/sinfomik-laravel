<?php

use App\Http\Controllers\GuruController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    Route::post('guru/bulk-destroy', [GuruController::class, 'bulkDestroy'])->name('guru.bulk-destroy');
    Route::resource('guru', GuruController::class);
});
