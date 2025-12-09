<?php

namespace App\Http\Controllers;

use App\Models\Siswa;
use App\Models\Guru;
use App\Models\Kelas;
use App\Models\TahunAjaran;
use App\Models\MataPelajaran;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        // Dashboard admin only
        $jumlahSiswa = Siswa::count();
        $jumlahGuru = Guru::count();
        $jumlahKelas = Kelas::count();
        $tahunAjaranAktif = TahunAjaran::where('is_active', true)->first();
        $daftarMataPelajaran = MataPelajaran::all();

        return Inertia::render('dashboard', [
            'jumlahSiswa' => $jumlahSiswa,
            'jumlahGuru' => $jumlahGuru,
            'jumlahKelas' => $jumlahKelas,
            'tahunAjaranAktif' => $tahunAjaranAktif,
            'daftarMataPelajaran' => $daftarMataPelajaran,
        ]);
    }
}
