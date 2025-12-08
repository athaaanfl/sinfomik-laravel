<?php

use App\Http\Controllers\GuruController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    Route::resource('guru', GuruController::class);
});
